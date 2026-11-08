 
import { router, publicProcedure, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and, or, sql, desc, asc, ilike } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import logger from '@/lib/logger';
import { RANK_CONFIG } from './loyalty.router';

// ============================================
// TIER CONFIGURATION
// ============================================

import { TIER_LIMITS, type TierLevel } from '../lib/tiers';
export { TIER_LIMITS, type TierLevel };

/**
 * Herkese açık profil alanları. verificationPhotoUrl (kimlik doğrulama fotoğrafı),
 * pendingData, userId ve abonelik tarihleri ASLA public uçlardan dönmez.
 */
const PUBLIC_PROFILE_COLUMNS = {
  id: true,
  stageName: true,
  displayName: true,
  slug: true,
  city: true,
  district: true,
  age: true,
  bio: true,
  biography: true,
  slogan: true,
  coverImage: true,
  thumbnailVideo: true,
  tier: true,
  isVip: true,
  isBoosted: true,
  viewCount: true,
  verificationStatus: true,
  hasVerifiedBadge: true,
  lastActive: true,
  isVerifiedByAdmin: true,
  hourlyRate: true,
  rating: true,
  averageRating: true,
  reviewCount: true,
} as const;

function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * Check if escort's tier meets the required tier
 */
function assertTierAccess(escortTier: string, requiredTier: TierLevel, message?: string): void {
  const tierOrder: TierLevel[] = ['free', 'gold', 'platinum', 'vip'];
  const escortIndex = tierOrder.indexOf(escortTier as TierLevel);
  const requiredIndex = tierOrder.indexOf(requiredTier);
  if (escortIndex < requiredIndex) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: message ?? `Bu özellik için en az ${requiredTier} üyeliği gereklidir.`,
    });
  }
}

/**
 * Calculate visibility score: tier x loyalty multiplier
 */
function calcVisibilityScore(points: number, tier: string): number {
  const rankMultiplier = RANK_CONFIG.find(r => points >= r.minPoints && points <= r.maxPoints)?.multiplier ?? 1.0;
  const tierMultiplier = TIER_LIMITS[tier as TierLevel]?.visibilityMultiplier ?? 1.0;
  return Math.round(points * rankMultiplier * tierMultiplier);
}

export const escortRouter = router({
  /**
   * List Escort Profiles with filtering and pagination
   */
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        city: z.string().optional(),
        tier: z.enum(schema.subscriptionTierEnum.enumValues).optional(),
        isBoosted: z.boolean().optional(),
        search: z.string().optional(),
        sortBy: z.enum(['rating', 'createdAt', 'hourlyRate']).default('rating'),
        sortOrder: z.enum(['asc', 'desc']).default('desc'),
      })
    )
    .query(async ({ input }) => {
      const { page, limit, city, tier, isBoosted, search, sortBy, sortOrder } = input;
      // CRITICAL: Always filter to only publicly visible profiles
      const whereConditions = [
        eq(schema.escortProfiles.visibilityStatus, 'public'),
      ];

      if (city) whereConditions.push(eq(schema.escortProfiles.city, city));
      if (tier) whereConditions.push(eq(schema.escortProfiles.tier, tier));
      if (isBoosted !== undefined) whereConditions.push(eq(schema.escortProfiles.isBoosted, isBoosted));

      if (search) {
        const term = `%${escapeLike(search)}%`;
        whereConditions.push(
          or(
            ilike(schema.escortProfiles.displayName, term),
            ilike(schema.escortProfiles.bio, term)
          )!
        );
      }

      // Şema uyumlu güvenli sıralama map'i
      const sortColumnMap = {
        rating: schema.escortProfiles.rating,
        hourlyRate: schema.escortProfiles.hourlyRate,
        createdAt: schema.escortProfiles.lastActive,
      } as const;
      const sortColumn = sortColumnMap[sortBy];
      const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

      // and() always receives at least the visibility filter, so spread is safe
      const filterCondition = and(...whereConditions)!;

      const [profiles, total] = await Promise.all([
        db.query.escortProfiles.findMany({
          columns: PUBLIC_PROFILE_COLUMNS,
          where: filterCondition,
          limit: limit,
          offset: (page - 1) * limit,
          orderBy: [desc(schema.escortProfiles.isBoosted), orderBy],
        }),
        db.select({ count: sql<number>`count(*)::int` }).from(schema.escortProfiles).where(filterCondition),
      ]);

      return {
        profiles,
        pagination: {
          page,
          limit,
          total: total[0].count,
          totalPages: Math.ceil(total[0].count / limit),
        },
      };
    }),

  /**
   * Get Escort Profile by Slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(160) }))
    .query(async ({ input }) => {
      const profile = await db.query.escortProfiles.findFirst({
        columns: PUBLIC_PROFILE_COLUMNS,
        // Gizli / onay bekleyen profiller slug ile de erişilemez
        where: and(
          eq(schema.escortProfiles.slug, input.slug),
          eq(schema.escortProfiles.visibilityStatus, 'public'),
        ),
        with: {
          // Yalnızca admin onaylı ve herkese açık medya
          media: {
            columns: { id: true, type: true, url: true, watermarkedUrl: true, blurredUrl: true, privacyLevel: true, createdAt: true },
            where: (m, { and: andFn, eq: eqFn }) => andFn(eqFn(m.isApproved, true), eqFn(m.privacyLevel, 'public')),
          },
          reviews: {
            columns: { id: true, rating: true, comment: true, createdAt: true },
            where: (rv, { eq: eqFn }) => eqFn(rv.visibility, 'public'),
            limit: 10,
            orderBy: [desc(schema.reviews.createdAt)],
          }
        },
      });

      if (!profile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Profil bulunamadı.' });
      }

      // Fire-and-forget view count increment
      db.update(schema.escortProfiles)
        .set({ viewCount: sql`${schema.escortProfiles.viewCount} + 1` })
        .where(eq(schema.escortProfiles.id, profile.id))
        .execute()
        .catch(err => logger.error(`View count update failed for slug ${input.slug}: ${err}`));

      return profile;
    }),

  /**
   * Update own escort profile (Queue for admin approval)
   */
  /**
   * Get escort's own tier info and limits
   */
  getMyTierInfo: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'escort') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Sadece escortlar bu bilgilere erişebilir.' });
      }

      const profile = await db.query.escortProfiles.findFirst({
        where: eq(schema.escortProfiles.userId, ctx.user.id),
        columns: { tier: true, isBoosted: true },
      });

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, ctx.user.id),
        columns: { loyaltyPoints: true, userRank: true },
      });

      if (!profile || !user) throw new TRPCError({ code: 'NOT_FOUND' });

      const tier = (profile.tier ?? 'free') as TierLevel;
      const limits = TIER_LIMITS[tier];
      const visibilityScore = calcVisibilityScore(user.loyaltyPoints ?? 0, tier);

      return {
        tier,
        limits,
        loyaltyPoints: user.loyaltyPoints ?? 0,
        userRank: user.userRank ?? 'Bronz',
        visibilityScore,
        isBoosted: profile.isBoosted,
      };
    }),

  /**
   * Activate visibility boost (gold+ only)
   */
  activateBoost: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== 'escort') {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const profile = await db.query.escortProfiles.findFirst({
        where: eq(schema.escortProfiles.userId, ctx.user.id),
      });

      if (!profile) throw new TRPCError({ code: 'NOT_FOUND' });

      assertTierAccess(profile.tier ?? 'free', 'gold', 'Boost özelliği için en az Gold üyeliği gereklidir.');

      await db.update(schema.escortProfiles)
        .set({ isBoosted: true })
        .where(eq(schema.escortProfiles.userId, ctx.user.id));

      return { success: true, message: 'Profiliniz 24 saat boyunca öne çıkarıldı.' };
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
        bio: z.string().optional(),
        biography: z.string().optional(),
        slogan: z.string().optional(),
        city: z.string().optional(),
        district: z.string().optional(),
        age: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'escort') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Sadece escortlar profillerini güncelleyebilir.' });
      }

      // Save the update request to pendingData instead of updating the profile directly
      const [updatedProfile] = await db.update(schema.escortProfiles)
        .set({
          pendingData: JSON.stringify(input),
          hasPendingUpdate: true,
          // We keep the old data as-is on the main columns
        })
        .where(eq(schema.escortProfiles.userId, ctx.user.id))
        .returning();

      if (!updatedProfile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Güncellenecek escort profili bulunamadı.' });
      }

      return {
        message: 'Profil güncellemeleriniz alındı ve admin onayına sunuldu. Onaylandığında yayına girecektir.',
        profile: updatedProfile
      };
    })
});

export type EscortRouter = typeof escortRouter;





