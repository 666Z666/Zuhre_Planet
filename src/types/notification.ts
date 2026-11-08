/**
 * Notification Types
 *
 * Type definitions for the notification system.
 * Supports push, email, SMS, and in-app notifications.
 *
 * @module types/notification
 * @category Types
 */

/**
 * Notification categories for grouping
 */
export type NotificationCategory =
  | 'message'
  | 'booking'
  | 'review'
  | 'system'
  | 'promotion'
  | 'security'
  | 'payment'
  | 'profile';

/**
 * Notification priority levels
 */
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Notification channels
 * Note: 'in_app' is an alias for 'in-app' for backward compatibility
 */
export type NotificationChannel = 'web' | 'email' | 'sms' | 'push' | 'in-app' | 'in_app';

/**
 * Base notification interface
 */
export interface Notification {
  id: string;
  userId: string;
  type: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  actionLabel?: string;
  icon?: string;
  imageUrl?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
  channels: NotificationChannel[];
  sent?: {
    push?: boolean;
    email?: boolean;
    sms?: boolean;
    inApp?: boolean;
  };
}

/**
 * Notification type definitions
 */
export interface NotificationType {
  id: string;
  category: NotificationCategory;
  title: string;
  bodyTemplate: string;
  priority: NotificationPriority;
  defaultChannels: NotificationChannel[];
  expireAfter?: number; // in hours
  actionable?: boolean;
  icon?: string;
}

/**
 * Notification preferences per user
 */
export interface NotificationPreferences {
  enabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  categories: Partial<Record<NotificationCategory, {
    enabled: boolean;
    channels: NotificationChannel[];
  }>>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
  digest: {
    enabled: boolean;
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  };
}

/**
 * Notification delivery status
 */
export interface NotificationDelivery {
  notificationId: string;
  userId: string;
  channel: NotificationChannel;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  attempts: number;
  lastAttemptAt?: Date;
  error?: string;
  deliveredAt?: Date;
}

/**
 * Notification template variables
 */
export interface NotificationTemplate {
  id: string;
  type: string;
  titleTemplate: string;
  bodyTemplate: string;
  variables: string[];
  channels: {
    push?: { titleTemplate: string; bodyTemplate: string };
    email?: { subjectTemplate: string; bodyTemplate: string };
    sms?: { bodyTemplate: string };
    inApp?: { titleTemplate: string; bodyTemplate: string };
  };
}

/**
 * Push notification payload
 */
export interface PushNotificationPayload {
  notification: {
    title: string;
    body: string;
    icon?: string;
    image?: string;
    badge?: string;
    sound?: string;
    data?: Record<string, unknown>;
  };
  data?: Record<string, unknown>;
  webpush?: {
    fcmOptions?: {
      link?: string;
    };
  };
}

/**
 * Email notification data
 */
export interface EmailNotificationData {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding: string;
  }>;
}

/**
 * SMS notification data
 */
export interface SMSNotificationData {
  to: string;
  body: string;
  from?: string;
}

/**
 * Notification rule for filtering
 */
export interface NotificationRule {
  id: string;
  userId: string;
  name: string;
  conditions: {
    type?: string[];
    category?: NotificationCategory[];
    priority?: NotificationPriority[];
  };
  actions: {
    enabled?: boolean;
    channels?: NotificationChannel[];
    mute?: boolean;
    markAsRead?: boolean;
  };
  createdAt: Date;
}

/**
 * Notification stats
 */
export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Partial<Record<NotificationCategory, number>>;
  byPriority: Partial<Record<NotificationPriority, number>>;
  todayCount: number;
  weekCount: number;
}

/**
 * Notification device
 */
export interface NotificationDevice {
  id: string;
  userId: string;
  token: string;
  platform: 'web' | 'ios' | 'android';
  userAgent?: string;
  active: boolean;
  lastUsedAt: Date;
  createdAt: Date;
}

/**
 * Notification queue item
 */
export interface NotificationQueueItem {
  id: string;
  notification: Notification;
  scheduledFor?: Date;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: Date;
  status: 'pending' | 'processing' | 'sent' | 'failed';
}

/**
 * Notification event types
 */
export type NotificationEventType =
  | 'notification:received'
  | 'notification:read'
  | 'notification:deleted'
  | 'notification:action_clicked'
  | 'preferences:updated'
  | 'device:registered'
  | 'device:unregistered';

/**
 * Notification event
 */
export interface NotificationEvent {
  type: NotificationEventType;
  notificationId?: string;
  userId: string;
  data?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Built-in notification types
 */
export const NOTIFICATION_TYPES: Record<string, NotificationType> = {
  // Messages
  MESSAGE_NEW: {
    id: 'message_new',
    category: 'message',
    title: 'Yeni Mesaj',
    bodyTemplate: '{{senderName}} size bir mesaj gönderdi: {{messagePreview}}',
    priority: 'normal',
    defaultChannels: ['push', 'in_app'],
    icon: '💬',
  },
  MESSAGE_TYPING: {
    id: 'message_typing',
    category: 'message',
    title: 'Yazıyor...',
    bodyTemplate: '{{senderName}} yazıyor...',
    priority: 'low',
    defaultChannels: ['in_app'],
    expireAfter: 0.1, // 6 minutes
    icon: '✍️',
  },

  // Bookings
  BOOKING_CREATED: {
    id: 'booking_created',
    category: 'booking',
    title: 'Yeni Randevu Talebi',
    bodyTemplate: '{{customerName}} {{date}} tarihi için randevu talep etti',
    priority: 'high',
    defaultChannels: ['push', 'email', 'in_app'],
    actionable: true,
    icon: '📅',
  },
  BOOKING_CONFIRMED: {
    id: 'booking_confirmed',
    category: 'booking',
    title: 'Randevu Onaylandı',
    bodyTemplate: 'Randevunuz onaylandı: {{date}} - {{time}}',
    priority: 'high',
    defaultChannels: ['push', 'email', 'in_app'],
    actionable: true,
    icon: '✅',
  },
  BOOKING_CANCELLED: {
    id: 'booking_cancelled',
    category: 'booking',
    title: 'Randevu İptal Edildi',
    bodyTemplate: 'Randevunuz iptal edildi: {{reason}}',
    priority: 'high',
    defaultChannels: ['push', 'email', 'in_app'],
    icon: '❌',
  },
  BOOKING_REMINDER: {
    id: 'booking_reminder',
    category: 'booking',
    title: 'Randevu Hatırlatma',
    bodyTemplate: 'Randevunuz {{hoursLeft}} saat sonra: {{date}} - {{time}}',
    priority: 'normal',
    defaultChannels: ['push', 'email', 'sms'],
    icon: '⏰',
  },

  // Reviews
  REVIEW_NEW: {
    id: 'review_new',
    category: 'review',
    title: 'Yeni Değerlendirme',
    bodyTemplate: '{{reviewerName}} size {{rating}} yıldız verdi',
    priority: 'normal',
    defaultChannels: ['push', 'in_app'],
    actionable: true,
    icon: '⭐',
  },
  REVIEW_REPLY: {
    id: 'review_reply',
    category: 'review',
    title: 'Yanıt Geldi',
    bodyTemplate: '{{escortName}} değerlendirmenize yanıt verdi',
    priority: 'normal',
    defaultChannels: ['push', 'email', 'in_app'],
    icon: '💬',
  },

  // System
  SYSTEM_MAINTENANCE: {
    id: 'system_maintenance',
    category: 'system',
    title: 'Bakım Bildirimi',
    bodyTemplate: 'Sistem {{startTime}} - {{endTime}} arasında bakımda olacak',
    priority: 'high',
    defaultChannels: ['push', 'email', 'in_app'],
    icon: '🔧',
  },
  SYSTEM_UPDATE: {
    id: 'system_update',
    category: 'system',
    title: 'Yeni Özellikler',
    bodyTemplate: 'Yeni özellikler eklendi! Detaylar için tıklayın.',
    priority: 'low',
    defaultChannels: ['in_app'],
    icon: '🎉',
  },

  // Promotion
  PROMOTION_OFFER: {
    id: 'promotion_offer',
    category: 'promotion',
    title: 'Özel Fırsat!',
    bodyTemplate: '{{discount}} indirim! {{expiry}} kadar geçerli.',
    priority: 'normal',
    defaultChannels: ['push', 'email', 'in_app'],
    actionable: true,
    icon: '🎁',
  },
  PROMOTION_VIP: {
    id: 'promotion_vip',
    category: 'promotion',
    title: 'VIP Üyelik',
    bodyTemplate: 'VIP üyelik avantajlarından yararlanın!',
    priority: 'normal',
    defaultChannels: ['push', 'email', 'in_app'],
    actionable: true,
    icon: '👑',
  },

  // Security
  SECURITY_LOGIN: {
    id: 'security_login',
    category: 'security',
    title: 'Yeni Giriş',
    bodyTemplate: 'Hesabınıza {{location}} konumundan giriş yapıldı',
    priority: 'high',
    defaultChannels: ['push', 'email', 'sms'],
    icon: '🔐',
  },
  SECURITY_PASSWORD_CHANGE: {
    id: 'security_password_change',
    category: 'security',
    title: 'Şifre Değiştirildi',
    bodyTemplate: 'Hesap şifreniz değiştirildi',
    priority: 'urgent',
    defaultChannels: ['push', 'email', 'sms'],
    icon: '🔑',
  },

  // Payment
  PAYMENT_SUCCESS: {
    id: 'payment_success',
    category: 'payment',
    title: 'Ödeme Başarılı',
    bodyTemplate: '{{amount}} ödeme alındı',
    priority: 'high',
    defaultChannels: ['push', 'email', 'in_app'],
    icon: '💳',
  },
  PAYMENT_FAILED: {
    id: 'payment_failed',
    category: 'payment',
    title: 'Ödeme Başarısız',
    bodyTemplate: 'Ödeme başarısız: {{reason}}',
    priority: 'high',
    defaultChannels: ['push', 'email', 'in_app'],
    actionable: true,
    icon: '❌',
  },

  // Profile
  PROFILE_VERIFIED: {
    id: 'profile_verified',
    category: 'profile',
    title: 'Profil Onaylandı',
    bodyTemplate: 'Tebrikler! Profiliniz onaylandı ✓',
    priority: 'high',
    defaultChannels: ['push', 'email', 'in_app'],
    icon: '✅',
  },
  PROFILE_REJECTED: {
    id: 'profile_rejected',
    category: 'profile',
    title: 'Profil Reddedildi',
    bodyTemplate: 'Profiliniz onaylanmadı: {{reason}}',
    priority: 'high',
    defaultChannels: ['push', 'email', 'in_app'],
    actionable: true,
    icon: '⚠️',
  },
};

/**
 * Default notification preferences
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  channels: {
    push: true,
    email: true,
    sms: false,
    inApp: true,
  },
  categories: {
    message: { enabled: true, channels: ['push', 'in_app'] },
    booking: { enabled: true, channels: ['push', 'email', 'sms'] },
    review: { enabled: true, channels: ['push', 'in_app'] },
    system: { enabled: true, channels: ['push', 'email'] },
    promotion: { enabled: true, channels: ['email'] },
    security: { enabled: true, channels: ['push', 'email', 'sms'] },
    payment: { enabled: true, channels: ['push', 'email'] },
    profile: { enabled: true, channels: ['push', 'email'] },
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
    timezone: 'Europe/Istanbul',
  },
  digest: {
    enabled: false,
    frequency: 'daily',
  },
};

/**
 * Notification category info
 */
export const NOTIFICATION_CATEGORY_INFO: Record<NotificationCategory, {
  category: NotificationCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}> = {
  message: {
    category: 'message',
    label: 'Mesajlar',
    icon: '💬',
    color: 'blue',
    description: 'Yeni mesajlar ve konuşma bildirimleri',
  },
  booking: {
    category: 'booking',
    label: 'Randevular',
    icon: '📅',
    color: 'purple',
    description: 'Randevu talepleri, onaylar ve hatırlatmalar',
  },
  review: {
    category: 'review',
    label: 'Değerlendirmeler',
    icon: '⭐',
    color: 'yellow',
    description: 'Yeni yorumlar ve puanlar',
  },
  system: {
    category: 'system',
    label: 'Sistem',
    icon: '🔧',
    color: 'gray',
    description: 'Bakım ve güncelleme bildirimleri',
  },
  promotion: {
    category: 'promotion',
    label: 'Promosyonlar',
    icon: '🎁',
    color: 'pink',
    description: 'İndirimler ve özel teklifler',
  },
  security: {
    category: 'security',
    label: 'Güvenlik',
    icon: '🔐',
    color: 'red',
    description: 'Giriş ve şifre değişiklikleri',
  },
  payment: {
    category: 'payment',
    label: 'Ödemeler',
    icon: '💳',
    color: 'green',
    description: 'Ödeme durumları ve faturalar',
  },
  profile: {
    category: 'profile',
    label: 'Profil',
    icon: '👤',
    color: 'indigo',
    description: 'Profil onay ve güncelleme bildirimleri',
  },
};

/**
 * Sound options for notifications
 */
export const NOTIFICATION_SOUNDS = [
  { id: 'default', name: 'Varsayılan', file: '/sounds/notification.mp3' },
  { id: 'chime', name: 'Çan', file: '/sounds/chime.mp3' },
  { id: 'bell', name: 'Zil', file: '/sounds/bell.mp3' },
  { id: 'soft', name: 'Yumuşak', file: '/sounds/soft.mp3' },
  { id: 'none', name: 'Sessiz', file: '' },
] as const;

/**
 * Helper to get notification type
 */
export function getNotificationType(typeId: string): NotificationType | undefined {
  return NOTIFICATION_TYPES[typeId.toUpperCase()];
}

/**
 * Helper to format notification with variables
 */
export function formatNotificationTemplate(
  template: string,
  variables: Record<string, unknown>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return (variables[key] as string | number | boolean | undefined | null)?.toString() || `{{${key}}}`;
  });
}
