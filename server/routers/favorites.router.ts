import { router, protectedProcedure } from '../router.core';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { withActivity } from '../lib/activity';
import { publicListingCondition } from '../lib/publicListing';

/** Kullanıcı başına favori üst sınırı (kötüye kullanım / kazıma sınırı). */
export const MAX_FAVORITES = 500;

export const favoritesRouter = router({
  /** Favoriye ekle/çıkar. Yalnız herkese açık ilanlar eklenebilir. */
  toggle: protectedProcedure
    .input(z.object({ profileId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.query.favorites.findFirst({
        where: and(eq(schema.favorites.userId, ctx.user.id), eq(schema.favorites.escortProfileId, input.profileId)),
        columns: { id: true },
      });
      if (existing) {
        await db.delete(schema.favorites).where(eq(schema.favorites.id, existing.id));
        return { favorited: false };
      }
      const profile = await db.query.escortProfiles.findFirst({
        where: and(eq(schema.escortProfiles.id, input.profileId), publicListingCondition()),
        columns: { id: true },
      });
      if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'İlan bulunamadı.' });
      const [{ count }] = await db.select({ count: sql<number>`count(*)::int` })
        .from(schema.favorites).where(eq(schema.favorites.userId, ctx.user.id));
      if (count >= MAX_FAVORITES) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: `En fazla ${MAX_FAVORITES} favori ekleyebilirsiniz.` });
      }
      await db.insert(schema.favorites).values({ userId: ctx.user.id, escortProfileId: profile.id }).onConflictDoNothing();
      return { favorited: true };
    }),

  /** Favori ilan numaraları (kalp düğmelerinin durumu için). */
  ids: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db.select({ id: schema.favorites.escortProfileId })
      .from(schema.favorites).where(eq(schema.favorites.userId, ctx.user.id));
    return rows.map((r) => r.id);
  }),

  /** Favori ilanlar — yalnız hâlâ yayın kapısını geçenler (public + onaylı + 18+), public alanlarla. */
  list: protectedProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const p = schema.escortProfiles;
      const rows = await db
        .select({
          id: p.id, stageName: p.stageName, displayName: p.displayName, slug: p.slug, city: p.city, district: p.district,
          age: p.age, coverImage: p.coverImage, tier: p.tier, isBoosted: p.isBoosted, hasVerifiedBadge: p.hasVerifiedBadge,
          isVerifiedByAdmin: p.isVerifiedByAdmin, lastActive: p.lastActive, hourlyRate: p.hourlyRate, rating: p.rating,
          averageRating: p.averageRating, reviewCount: p.reviewCount, viewCount: p.viewCount, favoritedAt: schema.favorites.createdAt,
        })
        .from(schema.favorites)
        .innerJoin(p, eq(p.id, schema.favorites.escortProfileId))
        .where(and(eq(schema.favorites.userId, ctx.user.id), publicListingCondition()))
        .orderBy(desc(schema.favorites.createdAt))
        .limit(input?.limit ?? 50);
      const now = Date.now();
      return rows.map((r) => withActivity(r, now));
    }),
});
