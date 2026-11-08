import { router, protectedProcedure, adminProcedure } from '../router.core';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and, not, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

/**
 * Üyelik ve Sadakat Puan Router
 * 
 * Gold, Platinum, VIP üyelikler ve sadakat puanı sistemi
 */

// Üyelik avantajları tanımı
const SUBSCRIPTION_BENEFITS = {
  free: {
    name: 'Ücretsiz',
    monthlyPrice: 0,
    features: ['Profil oluşturma', 'Temel iletişim'],
  },
  gold: {
    name: 'Gold',
    monthlyPrice: 29.99,
    features: ['Profil oluşturma', 'Temel iletişim', 'Öne çıkma (7 gün)', 'Gelişmiş filtreleme'],
  },
  platinum: {
    name: 'Platinum',
    monthlyPrice: 59.99,
    features: ['Gold avantajları', 'Öne çıkma (30 gün)', 'Video yükleme', 'Öncelikli destek'],
  },
  vip: {
    name: 'VIP',
    monthlyPrice: 99.99,
    features: ['Platinum avantajları', 'Sınırsız öne çıkma', 'Özel rozet', 'Kişisel asistan'],
  },
};

// Davet sistemi: Arkadaş davet ettiğinde puan kazanma
const REFERRAL_BONUS = 500; // Puan

export const subscriptionRouter = router({
  /**
   * Üyelik avantajlarını getir
   */
  getSubscriptionBenefits: protectedProcedure
    .query(() => {
      return SUBSCRIPTION_BENEFITS;
    }),

  /**
   * Kullanıcının mevcut üyelik bilgisini getir
   */
  getMySubscription: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
      });

      if (ctx.user.role === 'customer') {
        const customerProfile = await db.query.customerProfiles.findFirst({
          where: eq(schema.customerProfiles.userId, ctx.user.id),
        });

        return {
          tier: customerProfile?.tier || 'free',
          subscriptionEndsAt: customerProfile?.subscriptionEndsAt,
          loyaltyPoints: user?.loyaltyPoints || 0,
          referralCode: user?.referralCode,
        };
      } else if (ctx.user.role === 'escort') {
        const escortProfile = await db.query.escortProfiles.findFirst({
          where: eq(schema.escortProfiles.userId, ctx.user.id),
        });

        return {
          tier: escortProfile?.tier || 'free',
          subscriptionEndsAt: escortProfile?.subscriptionEndsAt,
          loyaltyPoints: user?.loyaltyPoints || 0,
          referralCode: user?.referralCode,
        };
      }

      return { tier: 'free', loyaltyPoints: user?.loyaltyPoints || 0, referralCode: user?.referralCode };
    }),

  /**
   * Üyelik seviyesini yükselt
   */
  upgradeSubscription: protectedProcedure
    .input(
      z.object({
        tier: z.enum(['gold', 'platinum', 'vip']),
        months: z.number().min(1).max(12),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
      });

      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + input.months);

      if (ctx.user.role === 'customer') {
        await db.update(schema.customerProfiles)
          .set({
            tier: input.tier,
            subscriptionEndsAt: subscriptionEndDate,
          })
          .where(eq(schema.customerProfiles.userId, ctx.user.id));
      } else if (ctx.user.role === 'escort') {
        await db.update(schema.escortProfiles)
          .set({
            tier: input.tier,
            subscriptionEndsAt: subscriptionEndDate,
          })
          .where(eq(schema.escortProfiles.userId, ctx.user.id));
      }

      // Sadakat puanı ekle
      const benefit = SUBSCRIPTION_BENEFITS[input.tier];
      const loyaltyPointsToAdd = Math.floor(benefit.monthlyPrice * 10); // 1 TL = 10 puan

      await db.insert(schema.loyaltyTransactions).values({
        userId: ctx.user.id,
        amount: loyaltyPointsToAdd,
        type: 'earn',
        description: `${input.tier.toUpperCase()} üyeliğe yükseltme (${input.months} ay)`,
      });

      await db.update(schema.users)
        .set({ loyaltyPoints: (user?.loyaltyPoints || 0) + loyaltyPointsToAdd })
        .where(eq(schema.users.id, ctx.user.id));

      return {
        success: true,
        message: `${benefit.name} üyeliğine başarıyla yükseltildiniz.`,
        subscriptionEndsAt: subscriptionEndDate,
        loyaltyPointsAdded: loyaltyPointsToAdd,
      };
    }),

  /**
   * Sadakat puanı harca
   */
  spendLoyaltyPoints: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(1),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
      });

      if (!user || (user.loyaltyPoints || 0) < input.amount) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Yeterli sadakat puanınız yok.' });
      }

      await db.insert(schema.loyaltyTransactions).values({
        userId: ctx.user.id,
        amount: input.amount,
        type: 'spend',
        description: input.reason,
      });

      await db.update(schema.users)
        .set({ loyaltyPoints: (user.loyaltyPoints || 0) - input.amount })
        .where(eq(schema.users.id, ctx.user.id));

      return { success: true, message: 'Sadakat puanları harcandı.', remainingPoints: (user.loyaltyPoints || 0) - input.amount };
    }),

  /**
   * Davet kodu oluştur
   */
  generateReferralCode: protectedProcedure
    .mutation(async ({ ctx }) => {
      const referralCode = `REF-${ctx.user.id}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      await db.update(schema.users)
        .set({ referralCode })
        .where(eq(schema.users.id, ctx.user.id));

      return { success: true, referralCode };
    }),

  /**
   * Arkadaşı davet et (Referral)
   */
  referFriend: protectedProcedure
    .input(
      z.object({
        referralCode: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Davet kodu sahibini bul
      const referrer = await db.query.users.findFirst({
        where: eq(schema.users.referralCode, input.referralCode),
      });

      if (!referrer) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Geçersiz davet kodu.' });
      }

      if (referrer.id === ctx.user.id) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Kendi davet kodunuzu kullanamazsınız.' });
      }

      // Zaten referral yapılmış mı kontrol et
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
      });

      if (user?.referredById) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Zaten birisi tarafından davet edildiniz.' });
      }

      // Referral işlemi
      await db.update(schema.users)
        .set({
          referredById: referrer.id,
          loyaltyPoints: (user?.loyaltyPoints || 0) + REFERRAL_BONUS,
        })
        .where(eq(schema.users.id, ctx.user.id));

      await db.insert(schema.loyaltyTransactions).values({
        userId: ctx.user.id,
        amount: REFERRAL_BONUS,
        type: 'referral_bonus',
        description: `Davet edildiğiniz için bonus (${referrer.fullName || 'Kullanıcı'})`,
      });

      // Davet edenin puanını arttır
      await db.insert(schema.loyaltyTransactions).values({
        userId: referrer.id,
        amount: REFERRAL_BONUS,
        type: 'referral_bonus',
        description: `Arkadaş davet bonusu (${user?.fullName || 'Kullanıcı'})`,
      });

      await db.update(schema.users)
        .set({ loyaltyPoints: (referrer.loyaltyPoints || 0) + REFERRAL_BONUS })
        .where(eq(schema.users.id, referrer.id));

      return { success: true, message: 'Davet başarıyla tamamlandı.' };
    }),

  /**
   * Sadakat puanı geçmişini getir
   */
  getLoyaltyHistory: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      const transactions = await db.query.loyaltyTransactions.findMany({
        where: eq(schema.loyaltyTransactions.userId, ctx.user.id),
        orderBy: (t) => [t.createdAt],
        limit: input.limit,
      });

      return transactions;
    }),

  /**
   * Davet edilen kullanıcıları getir
   */
  getReferrals: protectedProcedure
    .query(async ({ ctx }) => {
      const referrals = await db.query.users.findMany({
        where: eq(schema.users.referredById, ctx.user.id),
      });

      return referrals.map(r => ({
        id: r.id,
        fullName: r.fullName,
        email: r.email,
        createdAt: r.createdAt,
      }));
    }),

  /**
   * Üyelik süresi kontrol et ve otomatik olarak düşür
   */
  checkAndDowngradeExpiredSubscriptions: adminProcedure
    .query(async ({ ctx: _ctx }) => {
      const now = new Date();

      // Süresi dolan müşteri üyelikleri (Gold, Platinum, VIP)
      const expiredCustomers = await db.query.customerProfiles.findMany({
        where: and(
          not(eq(schema.customerProfiles.tier, 'free')),
          sql`${schema.customerProfiles.subscriptionEndsAt} <= ${now}`
        ),
      });

      for (const customer of expiredCustomers) {
        await db.update(schema.customerProfiles)
          .set({ tier: 'free' })
          .where(eq(schema.customerProfiles.id, customer.id));
      }

      // Süresi dolan escort üyelikleri (Gold, Platinum, VIP)
      const expiredEscorts = await db.query.escortProfiles.findMany({
        where: and(
          not(eq(schema.escortProfiles.tier, 'free')),
          sql`${schema.escortProfiles.subscriptionEndsAt} <= ${now}`
        ),
      });

      for (const escort of expiredEscorts) {
        await db.update(schema.escortProfiles)
          .set({ tier: 'free' })
          .where(eq(schema.escortProfiles.id, escort.id));
      }

      return { success: true, message: `${expiredCustomers.length + expiredEscorts.length} üyelik düşürüldü.` };
    }),
});

export type SubscriptionRouter = typeof subscriptionRouter;
