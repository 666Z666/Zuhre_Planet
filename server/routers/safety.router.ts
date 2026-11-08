import { router, adminProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { and, eq, gte, inArray, isNotNull, sql } from 'drizzle-orm';
import { groupShared, type SharedGroup } from '../lib/safetySignals';

/**
 * Sömürü / insan ticareti işaretleri (yalnız admin).
 * Bunlar KANIT değil, inceleme sinyalidir: aynı numarayı paylaşan profiller,
 * farklı profillerde aynı fotoğraf, aynı yerden kısa sürede çok sayıda ilan hesabı.
 * Ham numara/IP gösterilmez; karşılaştırma HMAC kör indeksleriyle yapılır.
 */
export const safetyRouter = router({
  signals: adminProcedure
    .input(z.object({ burstDays: z.number().int().min(1).max(30).default(7), burstMin: z.number().int().min(2).max(50).default(3) }).optional())
    .query(async ({ input }) => {
      const burstDays = input?.burstDays ?? 7;
      const burstMin = input?.burstMin ?? 3;

      // 1) Aynı numara birden fazla profilde (onaylı veya bekleyen)
      const contacts = await db.query.escortContacts.findMany({
        columns: { escortProfileId: true, phoneHash: true, whatsappHash: true, pendingPhoneHash: true, pendingWhatsappHash: true },
      });
      const numberGroups = groupShared(
        contacts.flatMap((c) =>
          [c.phoneHash, c.whatsappHash, c.pendingPhoneHash, c.pendingWhatsappHash]
            .filter((h): h is string => !!h)
            .map((key) => ({ key, profileId: c.escortProfileId })),
        ),
      );

      // 2) Aynı fotoğraf (içerik özeti) farklı profillerde
      const mediaRows = await db
        .select({ key: schema.media.contentHash, profileId: schema.media.escortId })
        .from(schema.media)
        .where(isNotNull(schema.media.contentHash));
      const mediaGroups = groupShared(mediaRows.filter((r): r is { key: string; profileId: number } => !!r.key));

      // 3) Aynı kayıt IP özetinden kısa sürede çok sayıda ilan hesabı
      const since = new Date(Date.now() - burstDays * 24 * 60 * 60 * 1000);
      const bursts = await db
        .select({
          key: schema.users.signupIpHash,
          count: sql<number>`count(*)::int`,
          userIds: sql<number[]>`array_agg(${schema.users.id} order by ${schema.users.id})`,
        })
        .from(schema.users)
        .where(and(eq(schema.users.role, 'escort'), isNotNull(schema.users.signupIpHash), gte(schema.users.createdAt, since)))
        .groupBy(schema.users.signupIpHash)
        .having(sql`count(*) >= ${burstMin}`);

      // Profil adlarını tek sorguda çöz
      const profileIds = [...new Set([...numberGroups, ...mediaGroups].flatMap((g) => g.profileIds))];
      const burstUserIds = bursts.flatMap((b) => b.userIds ?? []);
      const [profiles, burstProfiles] = await Promise.all([
        profileIds.length
          ? db.select({ id: schema.escortProfiles.id, stageName: schema.escortProfiles.stageName, city: schema.escortProfiles.city, visibilityStatus: schema.escortProfiles.visibilityStatus })
              .from(schema.escortProfiles).where(inArray(schema.escortProfiles.id, profileIds))
          : Promise.resolve([]),
        burstUserIds.length
          ? db.select({ id: schema.escortProfiles.id, userId: schema.escortProfiles.userId, stageName: schema.escortProfiles.stageName, city: schema.escortProfiles.city, visibilityStatus: schema.escortProfiles.visibilityStatus })
              .from(schema.escortProfiles).where(inArray(schema.escortProfiles.userId, burstUserIds))
          : Promise.resolve([]),
      ]);
      const byId = new Map(profiles.map((p) => [p.id, p]));
      const describe = (g: SharedGroup) => ({ size: g.profileIds.length, profiles: g.profileIds.map((id) => byId.get(id) ?? { id, stageName: '?', city: '', visibilityStatus: null }) });

      return {
        sharedNumbers: numberGroups.map(describe),
        sharedPhotos: mediaGroups.map(describe),
        signupBursts: bursts.map((b) => ({
          accounts: b.count,
          profiles: burstProfiles.filter((p) => (b.userIds ?? []).includes(p.userId)),
        })),
        generatedAt: new Date().toISOString(),
      };
    }),
});
