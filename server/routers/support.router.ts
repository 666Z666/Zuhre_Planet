import { router, publicProcedure, adminProcedure } from '../router.core';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { createRateLimiter } from '@/lib/security/rateLimit';
import { clientIp } from '../lib/session';

/** İletişim formu: IP başına saatte 5 mesaj. */
const contactLimiter = createRateLimiter({ windowMs: 60 * 60 * 1000, maxRequests: 5 });

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Adınızı girin.').max(80),
  email: z.string().trim().email('Geçerli bir e-posta girin.').max(254),
  subject: z.string().trim().min(3, 'Konu en az 3 karakter olmalı.').max(120),
  message: z.string().trim().min(10, 'Mesaj en az 10 karakter olmalı.').max(5000),
  /** Bot tuzağı: gerçek kullanıcı bu alanı görmez ve boş bırakır. */
  website: z.string().max(0).optional(),
});

export const supportRouter = router({
  /** İletişim formu gönderimi → admin gelen kutusu. */
  contact: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ ctx, input }) => {
      if (!contactLimiter.check(`ip:${clientIp(ctx.req)}`).allowed) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Çok fazla mesaj gönderdiniz. Lütfen daha sonra tekrar deneyin.' });
      }
      await db.insert(schema.contactMessages).values({
        name: input.name,
        email: input.email.toLowerCase(),
        subject: input.subject,
        message: input.message,
      });
      return { message: 'Mesajınız alındı. En kısa sürede e-posta ile dönüş yapacağız.' };
    }),

  // ---------------- Admin ----------------
  inbox: adminProcedure
    .input(z.object({ status: z.enum(['new', 'read', 'closed']).optional(), limit: z.number().int().min(1).max(100).default(50) }).optional())
    .query(async ({ input }) => {
      const where = input?.status ? eq(schema.contactMessages.status, input.status) : undefined;
      const [rows, counts] = await Promise.all([
        db.select().from(schema.contactMessages).where(where).orderBy(desc(schema.contactMessages.createdAt)).limit(input?.limit ?? 50),
        db.select({ status: schema.contactMessages.status, count: sql<number>`count(*)::int` })
          .from(schema.contactMessages).groupBy(schema.contactMessages.status),
      ]);
      return { messages: rows, counts: Object.fromEntries(counts.map((c) => [c.status, c.count])) as Partial<Record<'new' | 'read' | 'closed', number>> };
    }),

  setStatus: adminProcedure
    .input(z.object({ id: z.number().int().positive(), status: z.enum(['new', 'read', 'closed']) }))
    .mutation(async ({ input }) => {
      await db.update(schema.contactMessages).set({ status: input.status }).where(eq(schema.contactMessages.id, input.id));
      return { success: true };
    }),
});
