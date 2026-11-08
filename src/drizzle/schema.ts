import {
  pgTable,
  text,
  integer,
  real,
  boolean,
  serial,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
  decimal
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum('user_role', ['customer', 'escort', 'admin', 'super_mod', 'moderator']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'gold', 'platinum', 'vip']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'completed', 'cancelled']);
export const loyaltyTransactionTypeEnum = pgEnum('loyalty_transaction_type', ['earn', 'spend', 'referral_bonus']);
export const verificationStatusEnum = pgEnum('verification_status', ['none', 'pending_ai', 'pending_admin', 'approved', 'rejected']);
export const visibilityStatusEnum = pgEnum('visibility_status', ['hidden', 'public']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);
export const photoPrivacyLevelEnum = pgEnum('photo_privacy_level', ['public', 'members', 'gold', 'platinum', 'vip']);
export const reviewVisibilityEnum = pgEnum('review_visibility', ['public', 'private']); // Yorum gizliliği
export const blockTypeEnum = pgEnum('block_type', ['temporary_ban', 'permanent_ban', 'shadow_ban']);
export const chatMessageTypeEnum = pgEnum('chat_message_type', ['text', 'image', 'audio', 'video', 'location']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'resolved', 'dismissed']);

// ============================================
// TABLES
// ============================================

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
  role: userRoleEnum('role').default('customer'),
  phoneNumber: text('phone_number').unique(),
  provider: text('provider').default('email'),
  providerId: text('provider_id'),
  isVerified: boolean('is_verified').default(false),
  isProfileComplete: boolean('is_profile_complete').default(false),
  hasAcceptedTerms: boolean('has_accepted_terms').default(false),
  termsAcceptedAt: timestamp('terms_accepted_at'),
  hasAcceptedChatRules: boolean('has_accepted_chat_rules').default(false),
  chatRulesAcceptedAt: timestamp('chat_rules_accepted_at'),
  loyaltyPoints: integer('loyalty_points').default(0),
  referralCode: text('referral_code').unique(),
  referredById: integer('referred_by_id'),
  experiencePoints: integer('experience_points').default(0),
  userRank: text('user_rank').default('Bronz'),
  isBanned: boolean('is_banned').default(false), // Ceza sistemi
  banExpiresAt: timestamp('ban_expires_at'), // Ceza bitiş tarihi
  isShadowBanned: boolean('is_shadow_banned').default(false), // Gizli ban
  isApprovedCustomer: boolean('is_approved_customer').default(false), // Onaylı müşteri rozeti
  /** Kayıt IP'sinin HMAC özeti (ham IP saklanmaz) — toplu hesap açma tespiti */
  signupIpHash: text('signup_ip_hash'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const escortProfiles = pgTable('escort_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  stageName: text('stage_name').notNull(),
  displayName: text('display_name'),
  slug: text('slug').unique(),
  city: text('city').notNull(),
  district: text('district'),
  age: integer('age'),
  bio: text('bio'),
  biography: text('biography'),
  slogan: text('slogan'),
  coverImage: text('cover_image'),
  thumbnailVideo: text('thumbnail_video'),
  tier: subscriptionTierEnum('tier').default('free'),
  isVip: boolean('is_vip').default(false),
  isBoosted: boolean('is_boosted').default(false),
  viewCount: integer('view_count').default(0),
  verificationStatus: verificationStatusEnum('verification_status').default('none'),
  visibilityStatus: visibilityStatusEnum('visibility_status').default('hidden'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  hasVerifiedBadge: boolean('has_verified_badge').default(false),
  pendingData: text('pending_data'),
  hasPendingUpdate: boolean('has_pending_update').default(false),
  lastActive: timestamp('last_active').defaultNow(),
  verificationPhotoUrl: text('verification_photo_url'),
  verifiedAt: timestamp('verified_at'),
  isVerifiedByAdmin: boolean('is_verified_by_admin').default(false),
  freeTrialEndsAt: timestamp('free_trial_ends_at'),
  hourlyRate: real('hourly_rate'),
  rating: real('rating').default(0),
  // Yorum Puanı
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
  reviewCount: integer('review_count').default(0),
});

export const customerProfiles = pgTable('customer_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  balance: real('balance').default(0),
  tier: subscriptionTierEnum('tier').default('free'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
});

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  escortId: integer('escort_id').notNull().references(() => escortProfiles.id),
  type: mediaTypeEnum('type').notNull(), // image, video
  url: text('url').notNull(),
  watermarkedUrl: text('watermarked_url'), // Filigranlı URL
  blurredUrl: text('blurred_url'), // Bulanıklaştırılmış URL
  isApproved: boolean('is_approved').default(false),
  privacyLevel: photoPrivacyLevelEnum('privacy_level').default('public'),
  /** Dosya içeriğinin SHA-256 özeti — aynı fotoğrafın farklı profillerde kullanımını yakalar */
  contentHash: text('content_hash'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => users.id),
  escortId: integer('escort_id').references(() => escortProfiles.id),
  date: text('date').notNull(),
  time: text('time').notNull(),
  duration: integer('duration').notNull(),
  status: appointmentStatusEnum('status').default('pending'),
  price: real('price').notNull(),
  notes: text('notes'),
  isReferralProcessed: boolean('is_referral_processed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Yorumlar için yeni tablo
export const reviews = pgTable('reviews', {
    id: serial('id').primaryKey(),
    appointmentId: integer('appointment_id').references(() => appointments.id),
    reviewerId: integer('reviewer_id').references(() => users.id), // Yorumu yapan (escort veya müşteri)
    revieweeId: integer('reviewee_id').references(() => users.id), // Yorum yapılan (escort veya müşteri)
    rating: integer('rating').notNull(),
    comment: text('comment'),
    visibility: reviewVisibilityEnum('visibility').default('public'), // Yorumun kimler tarafından görüleceği
    createdAt: timestamp('created_at').defaultNow(),
});

// Kullanıcı bloklama tablosu
export const userBlocks = pgTable('user_blocks', {
    id: serial('id').primaryKey(),
    blockerId: integer('blocker_id').references(() => users.id), // Engelleyen kullanıcı
    blockedId: integer('blocked_id').references(() => users.id), // Engellenen kullanıcı
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => {
    return {
        uniqueBlock: uniqueIndex('unique_block').on(table.blockerId, table.blockedId),
    };
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').default('info'),
  isRead: boolean('is_read').default(false),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => users.id),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: integer('target_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const loyaltyTransactions = pgTable('loyalty_transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  amount: integer('amount').notNull(),
  type: loyaltyTransactionTypeEnum('type').notNull(),
  description: text('description'),
  relatedAppointmentId: integer('related_appointment_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  reporterId: integer('reporter_id').references(() => users.id),
  targetId: integer('target_id').notNull(),
  targetType: text('target_type').notNull(), // 'user', 'listing', 'review'
  reason: text('reason').notNull(),
  description: text('description'),
  status: reportStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: integer('resolved_by').references(() => users.id),
});

// ============================================
// İLETİŞİM MASKELEME (rakip analizi, Kasım 2026)
// Numara sayfada/HTML'de asla düz yer almaz; AES-256-GCM ile şifreli saklanır,
// yalnız tıklamada, hız sınırlı bir uçtan açılır. Değişiklik admin onaylıdır.
// ============================================

export const contactChannelEnum = pgEnum('contact_channel', ['phone', 'whatsapp']);

export const escortContacts = pgTable('escort_contacts', {
  id: serial('id').primaryKey(),
  escortProfileId: integer('escort_profile_id').notNull().references(() => escortProfiles.id, { onDelete: 'cascade' }),
  phoneEnc: text('phone_enc'),
  whatsappEnc: text('whatsapp_enc'),
  pendingPhoneEnc: text('pending_phone_enc'),
  pendingWhatsappEnc: text('pending_whatsapp_enc'),
  /** Kör indeks (HMAC): şifreli numarayı çözmeden "aynı numara" karşılaştırması */
  phoneHash: text('phone_hash'),
  whatsappHash: text('whatsapp_hash'),
  pendingPhoneHash: text('pending_phone_hash'),
  pendingWhatsappHash: text('pending_whatsapp_hash'),
  hasPendingChange: boolean('has_pending_change').default(false),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  profileUnique: uniqueIndex('escort_contacts_profile_unique').on(t.escortProfileId),
}));

/** Tıklama sayacı — kişisel veri tutmaz (IP/kullanıcı yok), yalnız kanal + zaman. */
export const contactClicks = pgTable('contact_clicks', {
  id: serial('id').primaryKey(),
  escortProfileId: integer('escort_profile_id').notNull().references(() => escortProfiles.id, { onDelete: 'cascade' }),
  channel: contactChannelEnum('channel').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  profileCreatedIdx: index('contact_clicks_profile_created_idx').on(t.escortProfileId, t.createdAt),
}));

// ============================================
// FİYAT TABLOSU (rakip analizi: süre × görüşme yeri)
// ============================================

export const rateLocationEnum = pgEnum('rate_location', ['own_place', 'visit']);

export const escortRates = pgTable('escort_rates', {
  id: serial('id').primaryKey(),
  escortProfileId: integer('escort_profile_id').notNull().references(() => escortProfiles.id, { onDelete: 'cascade' }),
  durationMinutes: integer('duration_minutes').notNull(),
  location: rateLocationEnum('location').notNull(),
  price: integer('price').notNull(), // TRY, tam sayı
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  uniqueRow: uniqueIndex('escort_rates_profile_duration_location_unique').on(t.escortProfileId, t.durationMinutes, t.location),
}));

export const escortRatesRelations = relations(escortRates, ({ one }) => ({
  escortProfile: one(escortProfiles, { fields: [escortRates.escortProfileId], references: [escortProfiles.id] }),
}));

// ============================================
// RELATIONS
// ============================================

export const escortContactsRelations = relations(escortContacts, ({ one }) => ({
  escortProfile: one(escortProfiles, { fields: [escortContacts.escortProfileId], references: [escortProfiles.id] }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  escortProfile: one(escortProfiles, { fields: [users.id], references: [escortProfiles.userId] }),
  customerProfile: one(customerProfiles, { fields: [users.id], references: [customerProfiles.userId] }),
  reviewsWritten: many(reviews, { relationName: 'reviewsWritten' }),
  reviewsReceived: many(reviews, { relationName: 'reviewsReceived' }),
  blockedUsers: many(userBlocks, { relationName: 'blockedUsers' }),
  blockedBy: many(userBlocks, { relationName: 'blockedBy' }),
  notifications: many(notifications),
  referredBy: one(users, { fields: [users.referredById], references: [users.id], relationName: 'referrals' }),
  referrals: many(users, { relationName: 'referrals' }),
  reportsMade: many(reports, { relationName: 'reportsMade' }),
  reportsResolved: many(reports, { relationName: 'reportsResolved' }),
}));

export const escortProfilesRelations = relations(escortProfiles, ({ one, many }) => ({
  user: one(users, { fields: [escortProfiles.userId], references: [users.id] }),
  media: many(media),
  reviews: many(reviews, { relationName: 'reviewsReceived' }),
  photos: many(escortPhotos),
  appointments: many(appointments, { relationName: 'escortAppointments' }),
  rates: many(escortRates),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  customer: one(users, { fields: [appointments.customerId], references: [users.id] }),
  escort: one(escortProfiles, { fields: [appointments.escortId], references: [escortProfiles.id] }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  appointment: one(appointments, { fields: [reviews.appointmentId], references: [appointments.id] }),
  reviewer: one(users, { fields: [reviews.reviewerId], references: [users.id], relationName: 'reviewsWritten' }),
  reviewee: one(users, { fields: [reviews.revieweeId], references: [users.id], relationName: 'reviewsReceived' }),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  escort: one(escortProfiles, { fields: [media.escortId], references: [escortProfiles.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const userBlocksRelations = relations(userBlocks, ({ one }) => ({
    blocker: one(users, { fields: [userBlocks.blockerId], references: [users.id], relationName: 'blockedUsers' }),
    blocked: one(users, { fields: [userBlocks.blockedId], references: [users.id], relationName: 'blockedBy' }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(users, { fields: [auditLogs.adminId], references: [users.id] }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporterId], references: [users.id], relationName: 'reportsMade' }),
  resolver: one(users, { fields: [reports.resolvedBy], references: [users.id], relationName: 'reportsResolved' }),
}));

// ============================================
// CHAT TABLES (chat.router.ts)
// ============================================

export const chatConversations = pgTable('chat_conversations', {
  id: serial('id').primaryKey(),
  participantIds: text('participant_ids').notNull(), // JSON string: [userId1, userId2]
  lastMessageAt: timestamp('last_message_at').defaultNow(),
  disappearAfterHours: integer('disappear_after_hours'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').references(() => chatConversations.id),
  senderId: integer('sender_id').references(() => users.id),
  content: text('content').notNull(),
  type: chatMessageTypeEnum('type').default('text'),
  mediaUrl: text('media_url'),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at'),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  expiresAt: timestamp('expires_at'), // Kaybolan mesajlar
  isAiFlagged: boolean('is_ai_flagged').default(false),
  aiFlagReason: text('ai_flag_reason'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const chatConversationsRelations = relations(chatConversations, ({ many }) => ({
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, { fields: [chatMessages.conversationId], references: [chatConversations.id] }),
  sender: one(users, { fields: [chatMessages.senderId], references: [users.id] }),
}));

// ============================================
// ESCORT PHOTOS TABLE (media.router.ts)
// ============================================

export const escortPhotos = pgTable('escort_photos', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id').notNull().references(() => escortProfiles.id),
  url: text('url').notNull(),
  maskedUrl: text('masked_url'),
  isFaceHidden: boolean('is_face_hidden').default(false),
  privacyLevel: photoPrivacyLevelEnum('privacy_level').default('public'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const escortPhotosRelations = relations(escortPhotos, ({ one }) => ({
  profile: one(escortProfiles, { fields: [escortPhotos.profileId], references: [escortProfiles.id] }),
}));

// ============================================
// FORUM TABLES (forum.router.ts)
// ============================================

export const forumCategories = pgTable('forum_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const forumTopics = pgTable('forum_topics', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').notNull().references(() => forumCategories.id),
  authorId: integer('author_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  isSticky: boolean('is_sticky').default(false),
  isLocked: boolean('is_locked').default(false),
  viewCount: integer('view_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const forumPosts = pgTable('forum_posts', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id').references(() => forumTopics.id),
  authorId: integer('author_id').references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  topics: many(forumTopics),
}));

export const forumTopicsRelations = relations(forumTopics, ({ one, many }) => ({
  category: one(forumCategories, { fields: [forumTopics.categoryId], references: [forumCategories.id] }),
  author: one(users, { fields: [forumTopics.authorId], references: [users.id] }),
  posts: many(forumPosts),
}));

export const forumPostsRelations = relations(forumPosts, ({ one }) => ({
  topic: one(forumTopics, { fields: [forumPosts.topicId], references: [forumTopics.id] }),
  author: one(users, { fields: [forumPosts.authorId], references: [users.id] }),
}));

// ============================================
// TYPES
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type EscortProfile = typeof escortProfiles.$inferSelect;
export type NewEscortProfile = typeof escortProfiles.$inferInsert;
export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type NewCustomerProfile = typeof customerProfiles.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type UserBlock = typeof userBlocks.$inferSelect;
export type NewUserBlock = typeof userBlocks.$inferInsert;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type NewChatConversation = typeof chatConversations.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type EscortPhoto = typeof escortPhotos.$inferSelect;
export type NewEscortPhoto = typeof escortPhotos.$inferInsert;
export type ForumCategory = typeof forumCategories.$inferSelect;
export type NewForumCategory = typeof forumCategories.$inferInsert;
export type ForumTopic = typeof forumTopics.$inferSelect;
export type NewForumTopic = typeof forumTopics.$inferInsert;
export type ForumPost = typeof forumPosts.$inferSelect;
export type NewForumPost = typeof forumPosts.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
