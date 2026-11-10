import { router, publicProcedure, protectedProcedure, adminProcedure } from '../router.core';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { and, eq, gte, sql, or, inArray } from 'drizzle-orm';
import { createRateLimiter } from '@/lib/security/rateLimit';
import { clientIp } from '../lib/session';
import { publicListingCondition } from '../lib/publicListing';
import {
  encryptContact, decryptContact, normalizeTrPhone, maskPhone, contactLink, blindIndex,
} from '../lib/contactCrypto';

/**
 * İletişim maskeleme: numaralar sayfada görünmez; "Ara"/"WhatsApp" tıklamasında
 * hız sınırlı bu uçtan bağlantı alınır ve tıklama sayılır (sağlayıcı istatistiği).
 */

// Toplu numara kazımaya karşı: IP başına 10 dk'da 30 açma, aynı profil için 10 dk'da 5.
const revealIpLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, maxRequests: 30 });
const revealProfileLimiter = createRateLimiter({ windowMs: 10 * 60 * 1000, maxRequests: 5 });

const channelSchema = z.enum(['phone', 'whatsapp']);
const CLEAR_PENDING = {
  pendingPhoneEnc: null, pendingWhatsappEnc: null, pendingPhoneHash: null, pendingWhatsappHash: null,
  hasPendingChange: false,
} as const;
const phoneInput = z.string().trim().max(32);

const safeDecrypt = (enc: string | null | undefined) => {
  if (!enc) return null;
  try { return decryptContact(enc); } catch { return null; }
};
const masked = (enc: string | null | undefined) => {
  const p = safeDecrypt(enc);
  return p ? maskPhone(p) : null;
};

async function myProfileId(userId: number): Promise<number> {
  const profile = await db.query.escortProfiles.findFirst({
    where: eq(schema.escortProfiles.userId, userId),
    columns: { id: true },
  });
  if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Escort profili bulunamadı.' });
  return profile.id;
}

function assertEscort(role: string) {
  if (role !== 'escort') throw new TRPCError({ code: 'FORBIDDEN', message: 'Yalnız ilan sahipleri iletişim bilgisi girebilir.' });
}

export const contactRouter = router({
  /** İlan sahibi numarasını girer/değiştirir → admin onayına düşer. */
  setMine: protectedProcedure
    .input(z.object({ phone: phoneInput.optional(), whatsapp: phoneInput.optional() })
      .refine((v) => v.phone || v.whatsapp, { message: 'En az bir numara girin.' }))
    .mutation(async ({ ctx, input }) => {
      assertEscort(ctx.user.role ?? "");
      const profileId = await myProfileId(ctx.user.id);
      const phone = input.phone ? normalizeTrPhone(input.phone) : undefined;
      const whatsapp = input.whatsapp ? normalizeTrPhone(input.whatsapp) : undefined;
      if (input.phone && !phone) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Telefon numarası geçersiz (ör. 0532 123 45 67).' });
      if (input.whatsapp && !whatsapp) throw new TRPCError({ code: 'BAD_REQUEST', message: 'WhatsApp numarası geçersiz.' });

      const values = {
        pendingPhoneEnc: phone ? encryptContact(phone) : null,
        pendingWhatsappEnc: whatsapp ? encryptContact(whatsapp) : null,
        pendingPhoneHash: phone ? blindIndex('phone', phone) : null,
        pendingWhatsappHash: whatsapp ? blindIndex('phone', whatsapp) : null,
        hasPendingChange: true,
        updatedAt: new Date(),
      };
      await db.insert(schema.escortContacts)
        .values({ escortProfileId: profileId, ...values })
        .onConflictDoUpdate({ target: schema.escortContacts.escortProfileId, set: values });
      return { message: 'Numaranız alındı; admin onayından sonra ilanınızda "Ara/WhatsApp" düğmesi açılacak.' };
    }),

  /** İlan sahibinin kendi paneli: maskeli numaralar + son 30 gün tıklama sayıları. */
  getMine: protectedProcedure.query(async ({ ctx }) => {
    assertEscort(ctx.user.role ?? "");
    const profileId = await myProfileId(ctx.user.id);
    const c = await db.query.escortContacts.findFirst({ where: eq(schema.escortContacts.escortProfileId, profileId) });
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const rows = await db
      .select({ channel: schema.contactClicks.channel, count: sql<number>`count(*)::int` })
      .from(schema.contactClicks)
      .where(and(eq(schema.contactClicks.escortProfileId, profileId), gte(schema.contactClicks.createdAt, since)))
      .groupBy(schema.contactClicks.channel);
    const clicks = { phone: 0, whatsapp: 0 };
    for (const r of rows) clicks[r.channel] = r.count;
    return {
      phone: masked(c?.phoneEnc),
      whatsapp: masked(c?.whatsappEnc),
      pendingPhone: masked(c?.pendingPhoneEnc),
      pendingWhatsapp: masked(c?.pendingWhatsappEnc),
      hasPendingChange: Boolean(c?.hasPendingChange),
      clicksLast30Days: clicks,
    };
  }),

  /** Ziyaretçi için: hangi kanallar açık (numara dönmez). */
  availability: publicProcedure
    .input(z.object({ profileId: z.number().int().positive() }))
    .query(async ({ input }) => {
      // Yayın kapısını geçmeyen ilanlar için kanal bilgisi de verilmez.
      const visible = await db.query.escortProfiles.findFirst({
        where: and(eq(schema.escortProfiles.id, input.profileId), publicListingCondition()),
        columns: { id: true },
      });
      if (!visible) return { phone: false, whatsapp: false };
      const c = await db.query.escortContacts.findFirst({
        where: eq(schema.escortContacts.escortProfileId, input.profileId),
        columns: { phoneEnc: true, whatsappEnc: true },
      });
      return { phone: Boolean(c?.phoneEnc), whatsapp: Boolean(c?.whatsappEnc) };
    }),

  /** Tıklamada bağlantıyı açar ve sayar. Yalnız yayın kapısını geçen profil (public + onaylı + 18+) ve onaylı numara. */
  reveal: publicProcedure
    .input(z.object({ profileId: z.number().int().positive(), channel: channelSchema }))
    .mutation(async ({ ctx, input }) => {
      const ip = clientIp(ctx.req);
      if (!revealIpLimiter.check(`ip:${ip}`).allowed || !revealProfileLimiter.check(`ip:${ip}:p:${input.profileId}`).allowed) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Çok fazla istek. Lütfen biraz sonra tekrar deneyin.' });
      }
      const profile = await db.query.escortProfiles.findFirst({
        where: and(eq(schema.escortProfiles.id, input.profileId), publicListingCondition()),
        columns: { id: true },
      });
      if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Profil bulunamadı.' });
      const c = await db.query.escortContacts.findFirst({ where: eq(schema.escortContacts.escortProfileId, profile.id) });
      const number = safeDecrypt(input.channel === 'phone' ? c?.phoneEnc : c?.whatsappEnc);
      if (!number) throw new TRPCError({ code: 'NOT_FOUND', message: 'Bu ilan için bu iletişim kanalı açık değil.' });

      await db.insert(schema.contactClicks).values({ escortProfileId: profile.id, channel: input.channel });
      return { url: contactLink(input.channel, number) };
    }),

  // ---------------- Admin ----------------

  /** Onay bekleyen numara değişiklikleri (moderasyon için tam numara + mevcut). */
  listPending: adminProcedure.query(async () => {
    const rows = await db.query.escortContacts.findMany({
      where: eq(schema.escortContacts.hasPendingChange, true),
      with: { escortProfile: { columns: { id: true, stageName: true, city: true } } },
      limit: 100,
    });
    // Aynı numara başka profillerde de kayıtlı mı (onaylı veya bekleyen)
    const hashes = [...new Set(rows.flatMap((r) => [r.pendingPhoneHash, r.pendingWhatsappHash]).filter((h): h is string => !!h))];
    const all = hashes.length
      ? await db.query.escortContacts.findMany({
          columns: { escortProfileId: true, phoneHash: true, whatsappHash: true, pendingPhoneHash: true, pendingWhatsappHash: true },
          where: or(
            inArray(schema.escortContacts.phoneHash, hashes),
            inArray(schema.escortContacts.whatsappHash, hashes),
            inArray(schema.escortContacts.pendingPhoneHash, hashes),
            inArray(schema.escortContacts.pendingWhatsappHash, hashes),
          ),
        })
      : [];
    const usersOf = (h: string | null, self: number) =>
      h ? all.filter((o) => o.escortProfileId !== self && [o.phoneHash, o.whatsappHash, o.pendingPhoneHash, o.pendingWhatsappHash].includes(h)).map((o) => o.escortProfileId) : [];
    return rows.map((r) => ({
      sharedWithProfiles: [...new Set([...usersOf(r.pendingPhoneHash, r.escortProfileId), ...usersOf(r.pendingWhatsappHash, r.escortProfileId)])],
      profileId: r.escortProfileId,
      stageName: r.escortProfile?.stageName ?? '',
      city: r.escortProfile?.city ?? '',
      currentPhone: safeDecrypt(r.phoneEnc),
      currentWhatsapp: safeDecrypt(r.whatsappEnc),
      pendingPhone: safeDecrypt(r.pendingPhoneEnc),
      pendingWhatsapp: safeDecrypt(r.pendingWhatsappEnc),
      updatedAt: r.updatedAt,
    }));
  }),

  review: adminProcedure
    .input(z.object({ profileId: z.number().int().positive(), approve: z.boolean(), reason: z.string().max(300).optional() }))
    .mutation(async ({ ctx, input }) => {
      const c = await db.query.escortContacts.findFirst({ where: eq(schema.escortContacts.escortProfileId, input.profileId) });
      if (!c?.hasPendingChange) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Onay bekleyen değişiklik yok.' });
      const set = input.approve
        ? {
            phoneEnc: c.pendingPhoneEnc ?? c.phoneEnc,
            whatsappEnc: c.pendingWhatsappEnc ?? c.whatsappEnc,
            phoneHash: c.pendingPhoneHash ?? c.phoneHash,
            whatsappHash: c.pendingWhatsappHash ?? c.whatsappHash,
            ...CLEAR_PENDING,
            updatedAt: new Date(),
          }
        : { ...CLEAR_PENDING, updatedAt: new Date() };
      await db.update(schema.escortContacts).set(set).where(eq(schema.escortContacts.id, c.id));
      await db.insert(schema.auditLogs).values({
        adminId: ctx.user.id,
        action: input.approve ? 'APPROVE_CONTACT' : 'REJECT_CONTACT',
        targetType: 'ESCORT_PROFILE',
        targetId: input.profileId,
        details: input.reason ? JSON.stringify({ reason: input.reason }) : null,
        ipAddress: clientIp(ctx.req),
      });
      return { success: true };
    }),
});
