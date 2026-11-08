import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { verifyAccessToken, AUTH_COOKIE } from "./lib/session";

// 1. tRPC Initialization - CORE
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// 2. JWT-based Authentication Middleware
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const token = ctx.req.cookies?.[AUTH_COOKIE];
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Yetkilendirme çerezi bulunamadı veya hatalı.",
    });
  }

  let decoded: { userId: number };
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Geçersiz veya süresi dolmuş token.",
    });
  }

  {

    // Find the user in the database to ensure they still exist
    const userProfile = await db.query.users.findFirst({
      where: eq(schema.users.id, decoded.userId),
    });

    if (!userProfile) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Kullanıcı bulunamadı.",
      });
    }

    const now = new Date();
    const isBanExpired = Boolean(
      userProfile.isBanned && userProfile.banExpiresAt && userProfile.banExpiresAt <= now,
    );

    if (isBanExpired) {
      await db.update(schema.users)
        .set({
          isBanned: false,
          banExpiresAt: null,
        })
        .where(eq(schema.users.id, userProfile.id));

      userProfile.isBanned = false;
      userProfile.banExpiresAt = null;
    }

    if (userProfile.isBanned) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Hesabınız askıya alındı. Destek ile iletişime geçin.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: {
          id: userProfile.id,
          email: userProfile.email,
          role: userProfile.role,
        },
      },
    });
  }
});

// 3. Admin-specific Middleware
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Bu kaynağa erişim yetkiniz yok.",
    });
  }
  return next();
});

// 4. Tier-specific Middleware Factory
// Usage: tierProcedure(['gold', 'platinum', 'vip']).mutation(...)
export const tierProcedure = (allowedTiers: ('free' | 'gold' | 'platinum' | 'vip')[]) => {
  return protectedProcedure.use(async ({ ctx, next }) => {
    let userTier: 'free' | 'gold' | 'platinum' | 'vip' = 'free';

    if (ctx.user.role === 'admin') {
      return next(); // Admins bypass tier restrictions
    }

    if (ctx.user.role === 'escort') {
      const profile = await db.query.escortProfiles.findFirst({ 
        where: eq(schema.escortProfiles.userId, ctx.user.id) 
      });
      if (profile?.tier) userTier = profile.tier as 'free' | 'gold' | 'platinum' | 'vip';
    } else if (ctx.user.role === 'customer') {
      const profile = await db.query.customerProfiles.findFirst({ 
        where: eq(schema.customerProfiles.userId, ctx.user.id) 
      });
      if (profile?.tier) userTier = profile.tier as 'free' | 'gold' | 'platinum' | 'vip';
    }

    if (!allowedTiers.includes(userTier)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Bu işlem kısıtlanmıştır! Mevcut Üyeliğiniz: ${userTier.toUpperCase()}. İhtiyaç: ${allowedTiers.join(' veya ').toUpperCase()}`,
      });
    }

    // Pass the retrieved tier into context for downstream usage if needed
    return next({
      ctx: {
        ...ctx,
        user: { ...ctx.user, tier: userTier }
      }
    });
  });
};
