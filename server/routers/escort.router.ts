 
import { router, publicProcedure, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, and, or, sql, desc, asc, ilike, gte, lte, type SQL } from 'drizzle-orm';
import { listInputSchema, updateProfileInputSchema, shouldIndexLocation } from '../lib/listing';
import { withActivity, activeSince } from '../lib/activity';
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

/** Herkese açık profil + onaylı medya + public yorumlar; gizli profil 404. */
async function getPublicProfile(match: SQL) {
      const profile = await db.query.escortProfiles.findFirst({
        columns: PUBLIC_PROFILE_COLUMNS,
        // Gizli / onay bekleyen profiller slug ile de erişilemez
        where: and(
          match,
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
        .catch(err => logger.error(`View count update failed for profile ${profile.id}: ${err}`));

      return withActivity(profile);
}

export const escortRouter = router({
  /**
   * List Escort Profiles with filtering and pagination
   */
  list: publicProcedure
    .input(listInputSchema)
    .query(async ({ input }) => {
      const {
        page, limit, city, district, tier, isBoosted, verifiedOnly,
        minPrice, maxPrice, minAge, maxAge, search, activeWithin, sortBy, sortOrder,
      } = input;
      const p = schema.escortProfiles;
      // CRITICAL: Always filter to only publicly visible profiles
      const whereConditions: SQL[] = [
        eq(p.visibilityStatus, 'public'),
      ];

      if (city) whereConditions.push(eq(p.city, city));
      if (district) whereConditions.push(eq(p.district, district));
      if (tier) whereConditions.push(eq(p.tier, tier));
      if (isBoosted !== undefined) whereConditions.push(eq(p.isBoosted, isBoosted));
      if (verifiedOnly) whereConditions.push(or(eq(p.hasVerifiedBadge, true), eq(p.isVerifiedByAdmin, true))!);
      if (minPrice !== undefined) whereConditions.push(gte(p.hourlyRate, minPrice));
      if (maxPrice !== undefined) whereConditions.push(lte(p.hourlyRate, maxPrice));
      if (minAge !== undefined) whereConditions.push(gte(p.age, minAge));
      if (maxAge !== undefined) whereConditions.push(lte(p.age, maxAge));
      if (activeWithin) whereConditions.push(gte(p.lastActive, activeSince(activeWithin)));

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
        lastActive: schema.escortProfiles.lastActive,
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
          // Doğrulama satın alınamaz: önce doğrulanmış, sonra boost (bkz. rankKey)
          orderBy: [
            desc(sql`(coalesce(${p.hasVerifiedBadge}, false) or coalesce(${p.isVerifiedByAdmin}, false))`),
            desc(p.isBoosted),
            orderBy,
          ],
        }),
        db.select({ count: sql<number>`count(*)::int` }).from(schema.escortProfiles).where(filterCondition),
      ]);

      const now = Date.now();
      return {
        // Tam zaman damgası yerine kaba aktiflik dilimi (gizlilik)
        profiles: profiles.map((row) => withActivity(row, now)),
        pagination: {
          page,
          limit,
          total: total[0].count,
          totalPages: Math.ceil(total[0].count / limit),
        },
      };
    }),

  /**
   * Şehir/ilçe bazında canlı ilan sayıları — ilçe SEO sayfaları ve filtre paneli için.
   * `indexable`: boş/az ilanlı sayfalar noindex kalmalı (doorway page riski).
   */
  locationStats: publicProcedure
    .input(z.object({ city: z.string().trim().max(80).optional() }).optional())
    .query(async ({ input }) => {
      const p = schema.escortProfiles;
      const conds: SQL[] = [eq(p.visibilityStatus, 'public')];
      if (input?.city) conds.push(eq(p.city, input.city));
      const rows = await db
        .select({
          city: p.city,
          district: p.district,
          count: sql<number>`count(*)::int`,
          verifiedCount: sql<number>`count(*) filter (where coalesce(${p.hasVerifiedBadge}, false) or coalesce(${p.isVerifiedByAdmin}, false))::int`,
        })
        .from(p)
        .where(and(...conds))
        .groupBy(p.city, p.district)
        .orderBy(desc(sql`count(*)`));
      return rows.map((r) => ({ ...r, indexable: shouldIndexLocation(r.count) }));
    }),

  /**
   * Get Escort Profile by Slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(160) }))
    .query(({ input }) => getPublicProfile(eq(schema.escortProfiles.slug, input.slug))),

  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(({ input }) => getPublicProfile(eq(schema.escortProfiles.id, input.id))),

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
    .input(updateProfileInputSchema)
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





