import { router, adminProcedure } from '../router.core';
import { z } from 'zod';
import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { eq, sql, and, or, ilike, gte, inArray, type SQL } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { MIN_AGE, updateProfileInputSchema } from '../lib/listing';
import { canPublishListing, publicListingCondition } from '../lib/publicListing';

type AdminAuditAction =
  | 'ADJUST_LOYALTY' | 'APPROVE_LISTING' | 'APPROVE_PHOTO' | 'APPROVE_PROFILE_UPDATE'
  | 'APPROVE_REVIEW' | 'BAN_USER' | 'DELETE_LISTING' | 'DELETE_REVIEW' | 'HIDE_REVIEW'
  | 'REJECT_LISTING' | 'REJECT_PHOTO' | 'REJECT_REVIEW' | 'SHADOWBAN_ENABLE'
  | 'SHADOWBAN_DISABLE' | 'UPDATE_REPORT_STATUS' | 'VERIFY_USER';

const DB_USER_ROLES = ['customer', 'escort', 'admin', 'super_mod', 'moderator'] as const;
type DbUserRole = (typeof DB_USER_ROLES)[number];
const ADMIN_USER_STATUSES = ['all', 'active', 'pending', 'banned', 'suspended', 'deleted'] as const;

/**
 * Audit Logger Helper
 */
async function logAdminAction(ctx: { user: { id: number } | null }, input: { action: AdminAuditAction, targetType: string, targetId?: number, previousData?: Record<string, unknown>, newData?: Record<string, unknown> }) {
    if (!ctx.user) return;
    try {
        const details = (input.previousData || input.newData)
            ? JSON.stringify({
                previousData: input.previousData ?? null,
                newData: input.newData ?? null,
            })
            : null;

        await db.insert(schema.auditLogs).values({
            adminId: ctx.user.id,
            action: input.action,
            targetType: input.targetType,
            targetId: input.targetId,
            details,
            ipAddress: 'internal',
        });
    } catch (error) {
        console.error('Audit log failed:', error);
    }
}

function toIsoString(value?: Date | null) {
  return value ? value.toISOString() : new Date(0).toISOString();
}

function getUserStatus(user: Pick<typeof schema.users.$inferSelect, 'isBanned' | 'isShadowBanned' | 'isVerified'>) {
  if (user.isBanned) return 'banned';
  if (user.isShadowBanned) return 'suspended';
  if (!user.isVerified) return 'pending';
  return 'active';
}

function getListingStatus(profile: Pick<typeof schema.escortProfiles.$inferSelect, 'verificationStatus' | 'visibilityStatus'>) {
  if (profile.verificationStatus === 'rejected') return 'rejected';
  if (profile.visibilityStatus === 'public') return 'active';
  if (profile.verificationStatus === 'approved') return 'hidden';
  return 'pending';
}

type ReportRow = Pick<typeof schema.reports.$inferSelect, 'targetType' | 'targetId'>;

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

async function resolveReportTargetNames(rows: ReportRow[]) {
  const names = new Map<string, string>();
  const idsFor = (type: string) => [...new Set(rows.filter((row) => row.targetType === type).map((row) => row.targetId))];
  const userIds = idsFor('user');
  const listingIds = idsFor('listing');
  const reviewIds = idsFor('review');
  const photoIds = idsFor('photo');

  const [users, listings, reviews, photos] = await Promise.all([
    userIds.length ? db.select({ id: schema.users.id, fullName: schema.users.fullName, email: schema.users.email }).from(schema.users).where(inArray(schema.users.id, userIds)) : Promise.resolve([]),
    listingIds.length ? db.select({ id: schema.escortProfiles.id, displayName: schema.escortProfiles.displayName, stageName: schema.escortProfiles.stageName, fullName: schema.users.fullName }).from(schema.escortProfiles).leftJoin(schema.users, eq(schema.users.id, schema.escortProfiles.userId)).where(inArray(schema.escortProfiles.id, listingIds)) : Promise.resolve([]),
    reviewIds.length ? db.select({ id: schema.reviews.id, fullName: schema.users.fullName }).from(schema.reviews).leftJoin(schema.users, eq(schema.users.id, schema.reviews.revieweeId)).where(inArray(schema.reviews.id, reviewIds)) : Promise.resolve([]),
    photoIds.length ? db.select({ id: schema.media.id, displayName: schema.escortProfiles.displayName, stageName: schema.escortProfiles.stageName }).from(schema.media).leftJoin(schema.escortProfiles, eq(schema.escortProfiles.id, schema.media.escortId)).where(inArray(schema.media.id, photoIds)) : Promise.resolve([]),
  ]);

  for (const item of users) names.set(`user:${item.id}`, item.fullName || item.email);
  for (const item of listings) names.set(`listing:${item.id}`, item.displayName || item.stageName || item.fullName || '');
  for (const item of reviews) names.set(`review:${item.id}`, item.fullName || '');
  for (const item of photos) names.set(`photo:${item.id}`, item.displayName || item.stageName || '');

  return (report: ReportRow) => names.get(`${report.targetType}:${report.targetId}`)
    || ({ user: `Kullanıcı #${report.targetId}`, listing: `Profil #${report.targetId}`, review: `Yorum #${report.targetId}`, photo: `Medya #${report.targetId}` }[report.targetType] ?? `${report.targetType} #${report.targetId}`);
}

function getUserStatusCondition(status: string): SQL | undefined {
  const user = schema.users;
  const notBanned = sql`coalesce(${user.isBanned}, false) = false`;
  const notShadowBanned = sql`coalesce(${user.isShadowBanned}, false) = false`;
  switch (status) {
    case 'banned': return sql`coalesce(${user.isBanned}, false) = true`;
    case 'suspended': return and(notBanned, sql`coalesce(${user.isShadowBanned}, false) = true`);
    case 'pending': return and(notBanned, notShadowBanned, sql`coalesce(${user.isVerified}, false) = false`);
    case 'active': return and(notBanned, notShadowBanned, sql`coalesce(${user.isVerified}, false) = true`);
    case 'deleted': return sql`false`;
    default: return undefined;
  }
}

function getListingStatusCondition(status: string): SQL | undefined {
  const profile = schema.escortProfiles;
  switch (status) {
    case 'active': return publicListingCondition();
    case 'approved': return eq(profile.verificationStatus, 'approved');
    case 'suspended': return and(eq(profile.verificationStatus, 'approved'), eq(profile.visibilityStatus, 'hidden'));
    case 'rejected': return eq(profile.verificationStatus, 'rejected');
    case 'pending': return inArray(profile.verificationStatus, ['none', 'pending_ai', 'pending_admin']);
    case 'flagged': return eq(profile.hasPendingUpdate, true);
    case 'expired': return sql`false`;
    default: return undefined;
  }
}

/**
 * Admin Router (tRPC)
 * Handle administrative tasks and dashboard statistics.
 */
export const adminRouter = router({
  /**
   * Get Platform Stats
   */
  getPlatformStats: adminProcedure.query(async () => {
    const [totalUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.users);
    const [pendingListings] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.escortProfiles).where(inArray(schema.escortProfiles.verificationStatus, ['none', 'pending_ai', 'pending_admin']));
    const [activeListings] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.escortProfiles).where(publicListingCondition());
    const [reportsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.reports).where(eq(schema.reports.status, 'pending'));

    return {
      totalUsers: Number(totalUsers?.count ?? 0),
      activeListings: Number(activeListings?.count ?? 0),
      pendingListings: Number(pendingListings?.count ?? 0),
      // Revenue and presence are unknown until genuine providers are configured.
      monthlyRevenue: null,
      activeNow: null,
      reportsCount: Number(reportsCount?.count ?? 0),
    };
  }),

  /**
   * Get Users with Pagination
   */
  getUsers: adminProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
      search: z.string().trim().max(200).optional(),
      role: z.string().optional(),
      status: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      if (input.role && !DB_USER_ROLES.includes((input.role === 'super_admin' ? 'super_mod' : input.role) as DbUserRole)) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Geçersiz kullanıcı rolü.' });
      if (input.status && !ADMIN_USER_STATUSES.includes(input.status as (typeof ADMIN_USER_STATUSES)[number])) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Geçersiz kullanıcı durumu.' });
      const conditions: SQL[] = [];
      if (input.search) {
        const term = `%${escapeLike(input.search)}%`;
        const searchCondition = or(ilike(schema.users.email, term), ilike(schema.users.fullName, term));
        if (searchCondition) conditions.push(searchCondition);
      }
      if (input.role) conditions.push(eq(schema.users.role, (input.role === 'super_admin' ? 'super_mod' : input.role) as DbUserRole));
      const statusCondition = input.status ? getUserStatusCondition(input.status) : undefined;
      if (statusCondition) conditions.push(statusCondition);
      const where = conditions.length ? and(...conditions) : undefined;

      const [users, totalRows] = await Promise.all([
        db.query.users.findMany({
          where,
          columns: { id: true, fullName: true, email: true, phoneNumber: true, role: true, isVerified: true, isBanned: true, isShadowBanned: true, createdAt: true },
          orderBy: (user, { desc }) => [desc(user.createdAt)],
          limit: input.limit,
          offset,
        }),
        db.select({ count: sql<number>`count(*)::int` }).from(schema.users).where(where),
      ]);
      const total = Number(totalRows[0]?.count ?? 0);
      const items = users.map((user) => ({
        id: String(user.id),
        name: user.fullName || user.email.split('@')[0],
        fullName: user.fullName || user.email.split('@')[0],
        email: user.email,
        phone: user.phoneNumber || undefined,
        role: user.role,
        status: getUserStatus(user),
        isVerified: Boolean(user.isVerified),
        // The current schema has no shared presence or last-login source.
        isOnline: null,
        isBanned: Boolean(user.isBanned),
        isShadowBanned: Boolean(user.isShadowBanned),
        createdAt: toIsoString(user.createdAt),
        updatedAt: null,
        lastActive: null,
      }));

      return { items, total, page: input.page, limit: input.limit, hasMore: offset + input.limit < total, totalPages: Math.ceil(total / input.limit) };
    }),

  /**
   * Get Listings with Pagination
   */
  getListings: adminProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
      status: z.string().optional(),
      search: z.string().trim().max(200).optional(),
    }))
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      const allowedStatuses = ['all', 'active', 'pending', 'approved', 'rejected', 'suspended', 'expired', 'flagged'] as const;
      if (input.status && !allowedStatuses.includes(input.status as (typeof allowedStatuses)[number])) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Geçersiz ilan durumu.' });
      const conditions: SQL[] = [];
      if (input.status && input.status !== 'all') {
        const statusCondition = getListingStatusCondition(input.status);
        if (statusCondition) conditions.push(statusCondition);
      }
      if (input.search) {
        const term = `%${escapeLike(input.search)}%`;
        const searchCondition = or(
          ilike(schema.escortProfiles.displayName, term),
          ilike(schema.escortProfiles.stageName, term),
          ilike(schema.escortProfiles.slug, term),
          ilike(schema.escortProfiles.city, term),
          ilike(schema.escortProfiles.district, term),
        );
        if (searchCondition) conditions.push(searchCondition);
      }
      const where = conditions.length ? and(...conditions) : undefined;
      const [listings, totalRows] = await Promise.all([
        db.query.escortProfiles.findMany({
          where,
          columns: { id: true, displayName: true, stageName: true, slug: true, city: true, district: true, hourlyRate: true, verificationStatus: true, visibilityStatus: true, isVerifiedByAdmin: true, isVip: true, isBoosted: true, verifiedAt: true, lastActive: true, viewCount: true, reviewCount: true, averageRating: true, rating: true, hasPendingUpdate: true, coverImage: true },
          with: {
            user: { columns: { fullName: true } },
            media: {
              where: eq(schema.media.isApproved, true),
              columns: { id: true, url: true, watermarkedUrl: true, blurredUrl: true },
              orderBy: (item, { desc }) => [desc(item.id)],
              limit: 1,
            },
          },
          orderBy: (profile, { desc }) => [desc(profile.lastActive)],
          limit: input.limit,
          offset,
        }),
        db.select({ count: sql<number>`count(*)::int` }).from(schema.escortProfiles).where(where),
      ]);
      const total = Number(totalRows[0]?.count ?? 0);
      const profileIds = listings.map((listing) => listing.id);
      const mediaCounts = profileIds.length
        ? await db.select({ profileId: schema.media.escortId, count: sql<number>`count(*)::int` }).from(schema.media)
          .where(and(inArray(schema.media.escortId, profileIds), eq(schema.media.isApproved, true))).groupBy(schema.media.escortId)
        : [];
      const photoCountByProfile = new Map(mediaCounts.map((item) => [item.profileId, Number(item.count)]));
      const [favoriteCounts, contactCounts] = await Promise.all([
        profileIds.length ? db.select({ profileId: schema.favorites.escortProfileId, count: sql<number>`count(*)::int` }).from(schema.favorites)
          .where(inArray(schema.favorites.escortProfileId, profileIds)).groupBy(schema.favorites.escortProfileId) : Promise.resolve([]),
        profileIds.length ? db.select({ profileId: schema.contactClicks.escortProfileId, count: sql<number>`count(*)::int` }).from(schema.contactClicks)
          .where(inArray(schema.contactClicks.escortProfileId, profileIds)).groupBy(schema.contactClicks.escortProfileId) : Promise.resolve([]),
      ]);
      const favoritesByProfile = new Map(favoriteCounts.map((item) => [item.profileId, Number(item.count)]));
      const contactsByProfile = new Map(contactCounts.map((item) => [item.profileId, Number(item.count)]));
      const items = listings.map((listing) => {
        const status = getListingStatus(listing);
        const mediaItem = listing.media?.[0];
        const title = listing.displayName || listing.stageName;
        return {
          id: String(listing.id), title, slug: listing.slug || String(listing.id), escortId: String(listing.id), escortName: title,
          escortAvatar: mediaItem?.url || listing.coverImage || undefined,
          thumbnail: mediaItem?.blurredUrl || mediaItem?.watermarkedUrl || mediaItem?.url || listing.coverImage || undefined,
          category: 'escort-profile', location: [listing.city, listing.district].filter(Boolean).join(' / '), city: listing.city,
          district: listing.district || undefined, price: listing.hourlyRate == null ? null : Math.round(Number(listing.hourlyRate)), priceUnit: 'hourly' as const,
          status: input.status === 'flagged' && listing.hasPendingUpdate ? 'flagged' : status,
          isVerified: Boolean(listing.isVerifiedByAdmin), isFeatured: Boolean(listing.isVip), isBoosted: Boolean(listing.isBoosted),
          // Profiles have no created_at or updated_at column yet; do not substitute verification/activity time.
          createdAt: null, updatedAt: null,
          views: listing.viewCount ?? 0, favorites: favoritesByProfile.get(listing.id) ?? 0, contacts: contactsByProfile.get(listing.id) ?? 0, photos: photoCountByProfile.get(listing.id) ?? 0,
          reviews: listing.reviewCount || 0, rating: Number(listing.averageRating || listing.rating || 0), tags: [], services: [],
        };
      });

      return { items, total, page: input.page, limit: input.limit, hasMore: offset + input.limit < total, totalPages: Math.ceil(total / input.limit) };
    }),

  /**
   * Get Reviews
   */
  getReviews: adminProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
      status: z.string().optional(),
      search: z.string().trim().max(200).optional(),
    }))
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      const allowedStatuses = ['all', 'approved', 'pending', 'visible', 'hidden', 'flagged', 'rejected'] as const;
      if (input.status && !allowedStatuses.includes(input.status as (typeof allowedStatuses)[number])) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Geçersiz yorum durumu.' });
      const conditions: SQL[] = [];
      if (input.status === 'approved' || input.status === 'visible') conditions.push(eq(schema.reviews.visibility, 'public'));
      if (input.status === 'pending' || input.status === 'hidden') conditions.push(eq(schema.reviews.visibility, 'private'));
      if (input.status === 'flagged') conditions.push(sql`EXISTS (SELECT 1 FROM reports flagged_report WHERE flagged_report.target_type = 'review' AND flagged_report.target_id = ${schema.reviews.id})`);
      if (input.status === 'rejected') conditions.push(sql`false`);
      if (input.search) {
        const term = `%${escapeLike(input.search)}%`;
        const searchCondition = or(
          ilike(schema.reviews.comment, term),
          sql`EXISTS (SELECT 1 FROM users reviewer_search WHERE reviewer_search.id = ${schema.reviews.reviewerId} AND (reviewer_search.full_name ILIKE ${term} OR reviewer_search.email ILIKE ${term}))`,
          sql`EXISTS (SELECT 1 FROM users reviewee_search WHERE reviewee_search.id = ${schema.reviews.revieweeId} AND (reviewee_search.full_name ILIKE ${term} OR reviewee_search.email ILIKE ${term}))`,
          sql`EXISTS (SELECT 1 FROM appointments appointment_search JOIN escort_profiles profile_search ON profile_search.id = appointment_search.escort_id WHERE appointment_search.id = ${schema.reviews.appointmentId} AND (profile_search.display_name ILIKE ${term} OR profile_search.stage_name ILIKE ${term}))`,
        );
        if (searchCondition) conditions.push(searchCondition);
      }
      const where = conditions.length ? and(...conditions) : undefined;
      const [reviews, totalRows] = await Promise.all([
        db.query.reviews.findMany({
          where,
          columns: { id: true, appointmentId: true, reviewerId: true, revieweeId: true, rating: true, comment: true, visibility: true, createdAt: true },
          with: {
            reviewer: { columns: { fullName: true, isVerified: true } },
            reviewee: { columns: { fullName: true } },
            appointment: { columns: { id: true, escortId: true, customerId: true }, with: {
              escort: { columns: { displayName: true, stageName: true } },
              customer: { columns: { fullName: true } },
            } },
          },
          orderBy: (review, { desc }) => [desc(review.createdAt)],
          limit: input.limit,
          offset,
        }),
        db.select({ count: sql<number>`count(*)::int` }).from(schema.reviews).where(where),
      ]);
      const total = Number(totalRows[0]?.count ?? 0);
      const reviewIds = reviews.map((review) => review.id);
      const reportCounts = reviewIds.length
        ? await db.select({ targetId: schema.reports.targetId, count: sql<number>`count(*)::int` }).from(schema.reports)
          .where(and(eq(schema.reports.targetType, 'review'), inArray(schema.reports.targetId, reviewIds))).groupBy(schema.reports.targetId)
        : [];
      const reportsByReviewId = new Map(reportCounts.map((item) => [item.targetId, Number(item.count)]));
      const items = reviews.map((review) => {
        const escortName = review.appointment?.escort?.displayName || review.appointment?.escort?.stageName || review.reviewee?.fullName || `Profil #${review.revieweeId}`;
        const customerName = review.reviewer?.fullName || review.appointment?.customer?.fullName || `Kullanıcı #${review.reviewerId}`;
        const reportCount = reportsByReviewId.get(review.id) ?? 0;
        return {
          id: String(review.id), listingId: String(review.appointment?.escortId || review.revieweeId || review.id), listingTitle: escortName,
          escortId: String(review.appointment?.escortId || review.revieweeId || ''), escortName,
          customerId: String(review.reviewerId || review.appointment?.customerId || ''), customerName, customerAvatar: undefined,
          rating: review.rating, comment: review.comment || '', status: review.visibility === 'public' ? 'approved' : 'pending',
          isVerified: Boolean(review.reviewer?.isVerified), isFlagged: reportCount > 0,
          createdAt: toIsoString(review.createdAt), updatedAt: null, helpfulVotes: null, reportCount,
        };
      });
      return { items, total, page: input.page, limit: input.limit, hasMore: offset + input.limit < total, totalPages: Math.ceil(total / input.limit) };
    }),

  /**
   * Get Reports
   */
  getReports: adminProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
      status: z.string().optional(),
      search: z.string().trim().max(200).optional(),
    }))
    .query(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;
      const allowedStatuses = ['all', 'pending', 'resolved', 'dismissed', 'reviewing'] as const;
      if (input.status && !allowedStatuses.includes(input.status as (typeof allowedStatuses)[number])) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Geçersiz şikayet durumu.' });
      const conditions: SQL[] = [];
      if (input.status === 'reviewing') conditions.push(sql`false`);
      if (input.status && input.status !== 'all' && input.status !== 'reviewing') {
        conditions.push(eq(schema.reports.status, input.status as 'pending' | 'resolved' | 'dismissed'));
      }
      if (input.search) {
        const term = `%${escapeLike(input.search)}%`;
        const searchCondition = or(
          ilike(schema.reports.reason, term),
          ilike(schema.reports.description, term),
          sql`EXISTS (SELECT 1 FROM users reporter_search WHERE reporter_search.id = ${schema.reports.reporterId} AND (reporter_search.full_name ILIKE ${term} OR reporter_search.email ILIKE ${term}))`,
          sql`(${schema.reports.targetType} = 'user' AND EXISTS (SELECT 1 FROM users target_user WHERE target_user.id = ${schema.reports.targetId} AND (target_user.full_name ILIKE ${term} OR target_user.email ILIKE ${term})))`,
          sql`(${schema.reports.targetType} = 'listing' AND EXISTS (SELECT 1 FROM escort_profiles target_listing LEFT JOIN users listing_owner ON listing_owner.id = target_listing.user_id WHERE target_listing.id = ${schema.reports.targetId} AND (target_listing.display_name ILIKE ${term} OR target_listing.stage_name ILIKE ${term} OR listing_owner.full_name ILIKE ${term})))`,
          sql`(${schema.reports.targetType} = 'review' AND EXISTS (SELECT 1 FROM reviews target_review LEFT JOIN users reviewee ON reviewee.id = target_review.reviewee_id WHERE target_review.id = ${schema.reports.targetId} AND reviewee.full_name ILIKE ${term}))`,
          sql`(${schema.reports.targetType} = 'photo' AND EXISTS (SELECT 1 FROM media target_media LEFT JOIN escort_profiles media_owner ON media_owner.id = target_media.escort_id WHERE target_media.id = ${schema.reports.targetId} AND (media_owner.display_name ILIKE ${term} OR media_owner.stage_name ILIKE ${term})))`,
          sql`CAST(${schema.reports.targetId} AS text) ILIKE ${term}`,
        );
        if (searchCondition) conditions.push(searchCondition);
      }
      const where = conditions.length ? and(...conditions) : undefined;
      const [reports, totalRows] = await Promise.all([
        db.query.reports.findMany({
          where,
          columns: { id: true, reporterId: true, targetId: true, targetType: true, reason: true, description: true, status: true, createdAt: true, resolvedAt: true },
          with: { reporter: { columns: { fullName: true, email: true } }, resolver: { columns: { fullName: true } } },
          orderBy: (report, { desc }) => [desc(report.createdAt)],
          limit: input.limit,
          offset,
        }),
        db.select({ count: sql<number>`count(*)::int` }).from(schema.reports).where(where),
      ]);
      const total = Number(totalRows[0]?.count ?? 0);
      const getTargetName = await resolveReportTargetNames(reports);
      const items = reports.map((report) => ({
        id: String(report.id), type: report.targetType, targetId: String(report.targetId), targetName: getTargetName(report),
        reason: report.reason, description: report.description || '', reporterId: String(report.reporterId || ''),
        reporterName: report.reporter?.fullName || report.reporter?.email || 'Anonim', reporterEmail: report.reporter?.email || undefined,
        status: report.status, priority: null, category: report.targetType,
        createdAt: toIsoString(report.createdAt), updatedAt: toIsoString(report.resolvedAt || report.createdAt),
        assignedTo: report.resolver?.fullName || undefined, resolvedAt: report.resolvedAt ? toIsoString(report.resolvedAt) : undefined,
      }));
      return { items, total, page: input.page, limit: input.limit, hasMore: offset + input.limit < total, totalPages: Math.ceil(total / input.limit) };
    }),

  /**
   * Mutations
   */
  banUser: adminProcedure
    .input(z.object({
      userId: z.string(),
      reason: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const id = Number(input.userId);
      await db.update(schema.users).set({ isBanned: true }).where(eq(schema.users.id, id));
      await logAdminAction(ctx, { action: 'BAN_USER', targetType: 'USER', targetId: id, newData: { reason: input.reason } });
      return { success: true };
    }),

  verifyUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = Number(input.userId);
      await db.update(schema.users).set({ isVerified: true }).where(eq(schema.users.id, id));
      await logAdminAction(ctx, { action: 'VERIFY_USER', targetType: 'USER', targetId: id });
      return { success: true };
    }),

  approveListing: adminProcedure
    .input(z.object({ listingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = Number(input.listingId);
      if (!Number.isSafeInteger(id) || id <= 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Geçersiz ilan numarası.' });
      }

      const profile = await db.query.escortProfiles.findFirst({
        where: eq(schema.escortProfiles.id, id),
        columns: { age: true },
      });
      if (!profile) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'İlan bulunamadı.' });
      }
      if (!canPublishListing(profile.age)) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `İlan yayımlanamaz: yaş bilgisi ${MIN_AGE} veya üzerinde olmalıdır.`,
        });
      }

      const [published] = await db.update(schema.escortProfiles).set({
        verificationStatus: 'approved',
        visibilityStatus: 'public',
        isVerifiedByAdmin: true,
        verifiedAt: new Date(),
      }).where(and(
        eq(schema.escortProfiles.id, id),
        gte(schema.escortProfiles.age, MIN_AGE),
      )).returning({ id: schema.escortProfiles.id });
      if (!published) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'İlanın yaşı değiştiği için yayınlanamadı; profili yeniden kontrol edin.',
        });
      }
      await logAdminAction(ctx, { action: 'APPROVE_LISTING', targetType: 'LISTING', targetId: id });
      return { success: true };
    }),

  rejectListing: adminProcedure
    .input(z.object({ listingId: z.string(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const id = Number(input.listingId);
      await db.update(schema.escortProfiles).set({
        verificationStatus: 'rejected',
        visibilityStatus: 'hidden',
      }).where(eq(schema.escortProfiles.id, id));
      await logAdminAction(ctx, { action: 'REJECT_LISTING', targetType: 'LISTING', targetId: id, newData: { reason: input.reason } });
      return { success: true };
    }),

  deleteListing: adminProcedure
    .input(z.object({ listingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = Number(input.listingId);
      await db.delete(schema.escortProfiles).where(eq(schema.escortProfiles.id, id));
      await logAdminAction(ctx, { action: 'DELETE_LISTING', targetType: 'LISTING', targetId: id });
      return { success: true };
    }),

  approveReview: adminProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(schema.reviews).set({ visibility: 'public' }).where(eq(schema.reviews.id, input.reviewId));
      await logAdminAction(ctx, { action: 'APPROVE_REVIEW', targetType: 'REVIEW', targetId: input.reviewId });
      return { success: true };
    }),

  rejectReview: adminProcedure
    .input(z.object({ reviewId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(schema.reviews).set({ visibility: 'private' }).where(eq(schema.reviews.id, input.reviewId));
      await logAdminAction(ctx, { action: 'REJECT_REVIEW', targetType: 'REVIEW', targetId: input.reviewId, newData: { reason: input.reason } });
      return { success: true };
    }),

  hideReview: adminProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(schema.reviews).set({ visibility: 'private' }).where(eq(schema.reviews.id, input.reviewId));
      await logAdminAction(ctx, { action: 'HIDE_REVIEW', targetType: 'REVIEW', targetId: input.reviewId });
      return { success: true };
    }),

  deleteReview: adminProcedure
    .input(z.object({ reviewId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(schema.reviews).where(eq(schema.reviews.id, input.reviewId));
      await logAdminAction(ctx, { action: 'DELETE_REVIEW', targetType: 'REVIEW', targetId: input.reviewId });
      return { success: true };
    }),

  updateReportStatus: adminProcedure
    .input(z.object({ reportId: z.number(), status: z.enum(['pending', 'resolved', 'dismissed']) }))
    .mutation(async ({ ctx, input }) => {
      await db.update(schema.reports).set({ 
        status: input.status,
        resolvedAt: input.status !== 'pending' ? new Date() : null,
        resolvedBy: input.status !== 'pending' ? ctx.user?.id : null
      }).where(eq(schema.reports.id, input.reportId));
      await logAdminAction(ctx, { action: 'UPDATE_REPORT_STATUS', targetType: 'REPORT', targetId: input.reportId, newData: { status: input.status } });
      return { success: true };
    }),

  /**
   * Photo Approvals
   */
  getPendingPhotos: adminProcedure.query(async () => {
    return await db.query.media.findMany({
      where: (m, { eq }) => eq(m.isApproved, false),
      with: { escort: true }
    });
  }),

  approvePhoto: adminProcedure
    .input(z.object({ photoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(schema.media).set({ isApproved: true }).where(eq(schema.media.id, input.photoId));
      await logAdminAction(ctx, { action: 'APPROVE_PHOTO', targetType: 'MEDIA', targetId: input.photoId });
      return { success: true };
    }),

  rejectPhoto: adminProcedure
    .input(z.object({ photoId: z.number(), reason: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(schema.media).where(eq(schema.media.id, input.photoId));
      await logAdminAction(ctx, { action: 'REJECT_PHOTO', targetType: 'MEDIA', targetId: input.photoId, newData: { reason: input.reason } });
      return { success: true };
    }),

  /**
   * Admin Actions from admin_actions.router.ts
   */
  setShadowBan: adminProcedure
    .input(z.object({ userId: z.number(), status: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(schema.users).set({ isShadowBanned: input.status }).where(eq(schema.users.id, input.userId));
      await logAdminAction(ctx, { action: input.status ? 'SHADOWBAN_ENABLE' : 'SHADOWBAN_DISABLE', targetType: 'USER', targetId: input.userId, newData: { isShadowBanned: input.status } });
      return { success: true };
    }),

  getAuditLogs: adminProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(50), offset: z.number().int().min(0).default(0) }))
    .query(async ({ input }) => {
      return await db.query.auditLogs.findMany({
        limit: input.limit,
        offset: input.offset,
        orderBy: (logs, { desc }) => [desc(logs.createdAt)],
        with: { admin: true }
      });
    }),

  adjustLoyalty: adminProcedure
    .input(z.object({ userId: z.number(), points: z.number(), reason: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await db.select().from(schema.users).where(eq(schema.users.id, input.userId));
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
      await db.transaction(async (tx) => {
        await tx.update(schema.users).set({ loyaltyPoints: (user.loyaltyPoints || 0) + input.points }).where(eq(schema.users.id, input.userId));
        await tx.insert(schema.loyaltyTransactions).values({
          userId: input.userId,
          amount: input.points,
          type: input.points >= 0 ? 'earn' : 'spend',
          description: `Admin Müdahalesi: ${input.reason}`
        });
      });
      await logAdminAction(ctx, { action: 'ADJUST_LOYALTY', targetType: 'USER', targetId: input.userId, newData: { adjustAmount: input.points, reason: input.reason } });
      return { success: true };
    }),

  getPendingProfileUpdates: adminProcedure
    .input(z.object({ limit: z.number().int().min(1).max(100).default(20), offset: z.number().int().min(0).default(0) }))
    .query(async ({ input }) => {
      const profiles = await db.query.escortProfiles.findMany({
        where: (p, { eq }) => eq(p.hasPendingUpdate, true),
        limit: input.limit,
        offset: input.offset,
        with: { user: true }
      });
      return profiles.map(p => ({
        ...p,
        pendingDataParsed: p.pendingData ? JSON.parse(p.pendingData) : null
      }));
    }),

  approveProfileUpdate: adminProcedure
    .input(z.object({ profileId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [profile] = await db.select().from(schema.escortProfiles).where(eq(schema.escortProfiles.id, input.profileId));
      if (!profile || !profile.pendingData) throw new TRPCError({ code: 'BAD_REQUEST' });
      // Onay anında yeniden doğrula (eski kayıtlarda 18 yaş altı vb. kalmış olabilir)
      const parsed = updateProfileInputSchema.safeParse(JSON.parse(profile.pendingData));
      if (!parsed.success) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: `Bekleyen güncelleme geçersiz: ${parsed.error.issues[0]?.message ?? 'doğrulama hatası'}` });
      }
      // Şema yalnız izinli alanları taşır (zod bilinmeyen anahtarları atar)
      const safeChanges = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined));
      await db.update(schema.escortProfiles).set({ ...safeChanges, pendingData: null, hasPendingUpdate: false }).where(eq(schema.escortProfiles.id, input.profileId));
      await logAdminAction(ctx, { action: 'APPROVE_PROFILE_UPDATE', targetType: 'ESCORT_PROFILE', targetId: input.profileId, newData: safeChanges });
      return { success: true };
    }),
});

