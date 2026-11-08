/**
 * Zühre Planet — Loyalty (Sadakat) Router
 * Puan kazanma, rütbe hesaplama ve görünürlük boost sistemi
 */

import { router, protectedProcedure, adminProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

// ============================================
// RANK CONFIGURATION
// ============================================

export const RANK_CONFIG = [
  { rank: 'Bronz',  minPoints: 0,    maxPoints: 499,  multiplier: 1.0, color: '#CD7F32' },
  { rank: 'Gümüş', minPoints: 500,  maxPoints: 1499, multiplier: 1.1, color: '#C0C0C0' },
  { rank: 'Altın',  minPoints: 1500, maxPoints: 2999, multiplier: 1.25, color: '#FFD700' },
  { rank: 'Platin', minPoints: 3000, maxPoints: 4999, multiplier: 1.5, color: '#E5E4E2' },
  { rank: 'Elmas',  minPoints: 5000, maxPoints: Infinity, multiplier: 2.0, color: '#B9F2FF' },
] as const;

// ============================================
// POINT VALUES BY EVENT
// ============================================

export const POINT_EVENTS = {
  profile_complete:    50,
  first_appointment:   100,
  appointment:         25,
  review_written:      15,
  review_received:     10,
  referral_invite:     75,
  referral_registered: 100,
  daily_login:         5,
} as const;

export type PointEventType = keyof typeof POINT_EVENTS;

// ============================================
// HELPER FUNCTIONS
// ============================================

function calculateRank(points: number) {
  return RANK_CONFIG.find(r => points >= r.minPoints && points <= r.maxPoints) ?? RANK_CONFIG[0];
}

function calculateVisibilityScore(points: number, tier: string): number {
  const rankInfo = calculateRank(points);
  const tierMultiplier = { free: 1, gold: 1.5, platinum: 2, vip: 3 }[tier] ?? 1;
  return Math.round(points * rankInfo.multiplier * tierMultiplier);
}

// ============================================
// ROUTER
// ============================================

export const loyaltyRouter = router({

  /**
   * Get current user's loyalty status
   */
  getMyStatus: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
      });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      const points = user.loyaltyPoints ?? 0;
      const rankInfo = calculateRank(points);
      const nextRank = RANK_CONFIG.find(r => r.minPoints > points);

      return {
        points,
        rank: rankInfo.rank,
        rankColor: rankInfo.color,
        multiplier: rankInfo.multiplier,
        nextRank: nextRank?.rank ?? null,
        pointsToNextRank: nextRank ? nextRank.minPoints - points : 0,
        progressPercent: nextRank
          ? Math.round(((points - rankInfo.minPoints) / (nextRank.minPoints - rankInfo.minPoints)) * 100)
          : 100,
        referralCode: user.referralCode,
      };
    }),

  /**
   * Olay puanı ekler. GÜVENLİK: eskiden protectedProcedure idi — her kullanıcı kendine
   * sınırsız puan yazabiliyordu (puan = indirim + görünürlük). Artık yalnız admin;
   * puanlar sunucu olaylarından (yorum, profil tamamlama vb.) verilmeli.
   */
  addPoints: adminProcedure
    .input(z.object({
      userId: z.number().int().positive(),
      eventType: z.enum([
        'profile_complete',
        'first_appointment',
        'appointment',
        'review_written',
        'review_received',
        'referral_invite',
        'referral_registered',
        'daily_login',
      ]),
      referenceId: z.number().optional(), // appointmentId, reviewId etc.
    }))
    .mutation(async ({ input }) => {
      const pointsToAdd = POINT_EVENTS[input.eventType];

      const [updatedUser] = await db.update(schema.users)
        .set({
          loyaltyPoints: sql`${schema.users.loyaltyPoints} + ${pointsToAdd}`,
          experiencePoints: sql`${schema.users.experiencePoints} + ${pointsToAdd}`,
        })
        .where(eq(schema.users.id, input.userId))
        .returning({ id: schema.users.id, loyaltyPoints: schema.users.loyaltyPoints, userRank: schema.users.userRank });

      const newPoints = updatedUser.loyaltyPoints ?? 0;
      const newRank = calculateRank(newPoints);

      // Update rank if changed
      if (updatedUser.userRank !== newRank.rank) {
        await db.update(schema.users)
          .set({ userRank: newRank.rank })
          .where(eq(schema.users.id, input.userId));
      }

      return {
        pointsAdded: pointsToAdd,
        newTotal: newPoints,
        newRank: newRank.rank,
        rankChanged: updatedUser.userRank !== newRank.rank,
      };
    }),

  /**
   * Generate referral code for user (if not exists)
   */
  generateReferralCode: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
      });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });

      if (user.referralCode) {
        return { referralCode: user.referralCode, isNew: false };
      }

      // Generate unique code: ZP + userId + random 4 chars
      const code = `ZP${user.id}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      await db.update(schema.users)
        .set({ referralCode: code })
        .where(eq(schema.users.id, ctx.user.id));

      return { referralCode: code, isNew: true };
    }),

  /**
   * Apply referral code on registration
   */
  applyReferralCode: protectedProcedure
    .input(z.object({ code: z.string().min(5) }))
    .mutation(async ({ ctx, input }) => {
      const referrer = await db.query.users.findFirst({
        where: eq(schema.users.referralCode, input.code),
      });

      if (!referrer) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Geçersiz referans kodu.' });
      }

      if (referrer.id === ctx.user.id) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Kendi referans kodunuzu kullanamazsınız.' });
      }

      // Check if already has a referrer
      const currentUser = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
      });

      if (currentUser?.referredById) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Zaten bir referans kodu kullandınız.' });
      }

      // Set referredBy + grant points to both
      await db.update(schema.users)
        .set({ referredById: referrer.id })
        .where(eq(schema.users.id, ctx.user.id));

      // Grant registration points to invited user
      await db.update(schema.users)
        .set({ loyaltyPoints: sql`${schema.users.loyaltyPoints} + ${POINT_EVENTS.referral_invite}` })
        .where(eq(schema.users.id, ctx.user.id));

      // Grant referral bonus to referrer
      await db.update(schema.users)
        .set({ loyaltyPoints: sql`${schema.users.loyaltyPoints} + ${POINT_EVENTS.referral_registered}` })
        .where(eq(schema.users.id, referrer.id));

      return {
        success: true,
        pointsGranted: POINT_EVENTS.referral_invite,
        message: `${POINT_EVENTS.referral_invite} puan kazandınız!`,
      };
    }),

  /**
   * Get leaderboard (top users by points)
   */
  getLeaderboard: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      const topUsers = await db.query.users.findMany({
        where: eq(schema.users.role, 'escort'),
        orderBy: (users, { desc }) => [desc(users.loyaltyPoints)],
        limit: input.limit,
        columns: {
          id: true,
          fullName: true,
          loyaltyPoints: true,
          userRank: true,
        },
      });

      return topUsers.map((u, i) => ({
        rank: i + 1,
        userId: u.id,
        name: u.fullName ?? 'Anonim',
        points: u.loyaltyPoints ?? 0,
        rankTitle: u.userRank ?? 'Bronz',
        rankInfo: calculateRank(u.loyaltyPoints ?? 0),
      }));
    }),

  /**
   * Admin: manually add/remove points
   */
  adminAdjustPoints: adminProcedure
    .input(z.object({
      userId: z.number(),
      points: z.number(), // Can be negative
      reason: z.string().min(3),
    }))
    .mutation(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, input.userId),
      });

      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'Kullanıcı bulunamadı.' });

      const [updated] = await db.update(schema.users)
        .set({
          loyaltyPoints: sql`GREATEST(0, ${schema.users.loyaltyPoints} + ${input.points})`,
        })
        .where(eq(schema.users.id, input.userId))
        .returning({ loyaltyPoints: schema.users.loyaltyPoints });

      return {
        success: true,
        userId: input.userId,
        adjustment: input.points,
        newTotal: updated.loyaltyPoints,
        reason: input.reason,
      };
    }),
});

export type LoyaltyRouter = typeof loyaltyRouter;
