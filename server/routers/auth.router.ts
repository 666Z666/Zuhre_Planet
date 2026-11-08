import { router, publicProcedure, protectedProcedure } from "../router.core";
import { z } from "zod";
import { db } from "@/drizzle/db";
import * as schema from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { env } from "@/config/env";
import { isDisposableEmail } from "../lib/email";
import { issueSession, clientIp } from "../lib/session";
import { checkLoginRate, checkRegisterRate, TOO_MANY_ATTEMPTS } from "../lib/authRateLimit";
const DUMMY_HASH = bcrypt.hashSync("timing-equalizer-not-a-real-password", 12);
function assertUserNotBanned(
  user: Pick<schema.User, "isBanned" | "banExpiresAt">,
): void {
  if (!user.isBanned) {
    return;
  }
  const isExpired = user.banExpiresAt ? user.banExpiresAt <= new Date() : false;
  if (!isExpired) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Hesabınız askıya alındı. Lütfen destek ile iletişime geçin.",
    });
  }
}
async function verifyGoogleToken(input: {
  idToken: string;
  email: string;
  providerId: string;
}) {
  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(input.idToken)}`,
  );
  if (!response.ok) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Google oturumu doğrulanamadı.",
    });
  }
  const payload = (await response.json()) as {
    aud?: string;
    email?: string;
    email_verified?: string;
    exp?: string;
    sub?: string;
  };
  if (!env.googleClientId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Google girişi yapılandırılmamış (GOOGLE_CLIENT_ID eksik).",
    });
  }
  if (payload.aud !== env.googleClientId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Google istemci doğrulaması başarısız.",
    });
  }
  if (
    payload.email !== input.email ||
    payload.sub !== input.providerId ||
    payload.email_verified !== "true"
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Google hesabı bilgileri doğrulanamadı.",
    });
  }
  if (!payload.exp || Number(payload.exp) * 1000 <= Date.now()) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Google oturumunun süresi dolmuş.",
    });
  }
}
async function verifySocialIdentity(input: {
  provider: "google" | "apple";
  idToken: string;
  email: string;
  providerId: string;
}) {
  if (input.provider === "google") {
    await verifyGoogleToken(input);
    return;
  }
  if (env.allowInsecureSocialAuth && !env.isProduction) {
    return;
  }
  throw new TRPCError({
    code: "PRECONDITION_FAILED",
    message: "Apple girişi sunucu tarafında dogrulanmadan kullanılamaz.",
  });
}
export const authRouter = router({
  /**
   * User Registration (Email/Password with full validation)
   */
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Geçersiz e-posta adresi.").max(254),
        password: z.string().min(8, "Şifre en az 8 karakter olmalıdır.").max(256),
        fullName: z.string().trim().min(2, "Ad Soyad en az 2 karakter olmalıdır.").max(120),
        phoneNumber: z
          .string()
          .min(10, "Geçerli bir telefon numarası girin.")
          .max(20)
          .regex(/^[+\d\s()-]{10,20}$/, "Geçerli bir telefon numarası girin."),
        role: z.enum(["customer", "escort"]),
        hasAcceptedTerms: z.boolean().refine((val) => val === true, {
          message:
            "Kullanım Koşulları ve Gizlilik Politikasını kabul etmelisiniz.",
        }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { password, fullName, phoneNumber, role, hasAcceptedTerms } = input;
      const email = input.email.trim().toLowerCase();
      const limit = checkRegisterRate(clientIp(ctx.req));
      if (!limit.allowed) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: TOO_MANY_ATTEMPTS });
      }
      // Block disposable/fake email providers
      if (isDisposableEmail(email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Tek kullanımlık veya geçici e-posta adresleri kabul edilmemektedir. Lütfen gerçek e-posta adresinizi kullanın.",
        });
      }
      // Check email uniqueness
      const existingByEmail = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });
      if (existingByEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bu e-posta adresi zaten kullanımda.",
        });
      }
      // Check phone uniqueness
      const existingByPhone = await db.query.users.findFirst({
        where: eq(schema.users.phoneNumber, phoneNumber),
      });
      if (existingByPhone) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bu telefon numarası zaten başka bir hesaba kayıtlı.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const [newUser] = await db
        .insert(schema.users)
        .values({
          email,
          passwordHash: hashedPassword,
          fullName,
          phoneNumber,
          role: role as "customer" | "escort",
          provider: "email",
          hasAcceptedTerms,
          termsAcceptedAt: new Date(),
          isProfileComplete: true,
        })
        .returning({
          id: schema.users.id,
          email: schema.users.email,
          role: schema.users.role,
        });
      // For escorts: create empty escort profile
      if (role === "escort") {
        await db
          .insert(schema.escortProfiles)
          .values({
            userId: newUser.id as number,
            stageName: fullName || "İsimsiz",
            city: "İstanbul",
            visibilityStatus: "hidden",
          })
          .catch(() => null);
      }
      issueSession(ctx.res, newUser);
      return {
        status: "success",
        user: newUser,
        requiresProfileSetup: false,
      };
    }),
  /**
   * User Login
   */
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email().max(254),
        password: z.string().min(1).max(256),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const email = input.email.trim().toLowerCase();
      const { password } = input;
      const limit = checkLoginRate(email, clientIp(ctx.req));
      if (!limit.allowed) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: TOO_MANY_ATTEMPTS });
      }
      const user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });
      const isPasswordValid = await bcrypt.compare(
        password,
        user?.passwordHash || DUMMY_HASH,
      );
      if (!user || !isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "E-posta veya şifre hatalı.",
        });
      }
      // Ban durumu yalnızca doğru şifreden sonra açıklanır (hesap keşfini önler)
      assertUserNotBanned(user);
      issueSession(ctx.res, user);
      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isProfileComplete: user.isProfileComplete,
          hasAcceptedChatRules: user.hasAcceptedChatRules,
        },
        requiresProfileSetup: !user.isProfileComplete,
      };
    }),
  /**
   * Social Auth (Google / Apple)
   * Receives the decoded user info from the OAuth provider.
   * In production, verify the ID token on the server.
   */
  socialAuth: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        fullName: z.string().optional(),
        providerId: z.string(),
        idToken: z.string().min(1, "Kimlik tokeni gereklidir."),
        provider: z.enum(["google", "apple"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email, fullName, providerId, provider, idToken } = input;
      await verifySocialIdentity({ provider, idToken, email, providerId });
      // Block disposable emails even for social logins
      if (isDisposableEmail(email)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Bu e-posta adresi platformumuzda kullanılamaz.",
        });
      }
      // Check if user already exists (by email or providerId)
      let user = await db.query.users.findFirst({
        where: eq(schema.users.email, email),
      });
      if (!user) {
        // New user — create with incomplete profile
        const [newUser] = await db
          .insert(schema.users)
          .values({
            email,
            passwordHash: "",
            fullName: fullName ?? null,
            provider,
            providerId,
            isProfileComplete: false,
            hasAcceptedTerms: false,
          })
          .returning();
        user = newUser;
      } else {
        assertUserNotBanned(user);
        // Update provider info if needed
        await db
          .update(schema.users)
          .set({ provider, providerId })
          .where(eq(schema.users.id, user.id));
      }
      issueSession(ctx.res, user);
      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isProfileComplete: user.isProfileComplete,
          hasAcceptedTerms: user.hasAcceptedTerms,
          hasAcceptedChatRules: user.hasAcceptedChatRules,
        },
        requiresProfileSetup: !user.isProfileComplete,
      };
    }),
  /**
   * Complete Profile — called after social login to fill in missing fields
   */
  completeProfile: protectedProcedure
    .input(
      z.object({
        phoneNumber: z
          .string()
          .min(10, "Geçerli bir telefon numarası girin.")
          .max(20)
          .regex(/^[+\d\s()-]{10,20}$/, "Geçerli bir telefon numarası girin."),
        role: z.enum(["customer", "escort"]),
        fullName: z.string().min(2).optional(),
        hasAcceptedTerms: z.boolean().refine((val) => val === true, {
          message: "Kullanım Koşulları kabul edilmelidir.",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { phoneNumber, role, fullName, hasAcceptedTerms } = input;
      // Check phone uniqueness
      const existingByPhone = await db.query.users.findFirst({
        where: eq(schema.users.phoneNumber, phoneNumber),
      });
      if (existingByPhone && existingByPhone.id !== ctx.user.id) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bu telefon numarası zaten başka bir hesaba kayıtlı.",
        });
      }
      const [updated] = await db
        .update(schema.users)
        .set({
          phoneNumber,
          role: role as "customer" | "escort",
          fullName: fullName ?? undefined,
          hasAcceptedTerms,
          termsAcceptedAt: new Date(),
          isProfileComplete: true,
        })
        .where(eq(schema.users.id, ctx.user.id))
        .returning();
      // For escorts: create escort profile if not exists
      if (role === "escort") {
        await db
          .insert(schema.escortProfiles)
          .values({
            userId: updated.id,
            stageName: updated.fullName ?? "Escort",
            city: "İstanbul",
            visibilityStatus: "hidden" as "hidden" | "public",
          })
          .onConflictDoNothing();
      }
      return { success: true, user: updated };
    }),
  /**
   * Accept Chat Rules — called on first chat attempt
   */
  acceptChatRules: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(schema.users)
      .set({
        hasAcceptedChatRules: true,
        chatRulesAcceptedAt: new Date(),
      })
      .where(eq(schema.users.id, ctx.user.id));
    return { success: true };
  }),
  /**
   * Get current user session info
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, ctx.user.id),
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber,
      isProfileComplete: user.isProfileComplete,
      hasAcceptedTerms: user.hasAcceptedTerms,
      hasAcceptedChatRules: user.hasAcceptedChatRules,
      provider: user.provider,
    };
  }),
});
export type AuthRouter = typeof authRouter;
