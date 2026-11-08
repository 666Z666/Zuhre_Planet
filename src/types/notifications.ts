/**
 * Notifications & Messaging System Module
 * 
 * Comprehensive notification and messaging system for the escort platform. Handles in-app
 * notifications, email notifications, push notifications, user warnings, chat rules enforcement,
 * and message sanitization. Includes profanity filtering, spam detection, and content moderation.
 * 
 * @module types/notifications
 * @category Types - Communications & Safety
 * 
 * Exported Types/Interfaces:
 * - NotificationType: Union type of all notification types (messages, bookings, reviews, warnings, etc.)
 * - Notification: Core notification object with user, type, content, and read status
 * - EmailNotification: Email-specific notification configuration
 * - UserWarning: User warning record with type, severity, and action information
 * 
 * Constants & Configurations:
 * - NOTIFICATION_CONFIG: Email settings, TTL (time-to-live), and preference defaults
 * - NOTIFICATION_TEMPLATES: Template definitions for all notification types with placeholders
 * - CHAT_RULES: Platform rules for escorts and customers with severity levels
 * - PROFANITY_FILTER: Profanity and inappropriate content word lists and patterns
 * - MESSAGE_RULES: Message length limits, forbidden content patterns, and spam detection thresholds
 * - WARNING_LEVELS: Warning severity levels with associated actions and UI styling
 * - BOOKING_REMINDERS: Reminder messages before/after bookings and reminder timing
 * 
 * Functions:
 * - createUserWarning(): Factory function for creating user warning records
 * - sanitizeMessage(): Sanitizes message content by filtering profanity and blocking contact info
 * - checkSpam(): Detects spam patterns including repeated messages, rate limiting, and caps lock
 * - createNotification(): Factory function for creating notification objects from templates
 * 
 * Key Features:
 * - 13+ notification types (messages, bookings, reviews, profile, VIP, points, warnings)
 * - Configurable notification preferences per channel (email, push, SMS)
 * - Profanity filtering in Turkish, English, and inappropriate terms
 * - Phone number and email address masking to prevent external contact
 * - Spam detection with rate limiting and pattern matching
 * - User warning system with severity levels and automatic actions
 * - Chat rules enforcement for both escorts and customers
 * - Template-based notification generation with data interpolation
 * 
 * @example
 * ```typescript
 * import {
 *   Notification,
 *   UserWarning,
 *   sanitizeMessage,
 *   createNotification,
 *   NOTIFICATION_TEMPLATES
 * } from '@/types/notifications';
 * 
 * // Sanitize user message
 * const { clean, violations } = sanitizeMessage('Call me at 05551234567');
 * console.log(clean); // 'Call me at ***'
 * console.log(violations); // ['Phone number sharing', ...]
 * 
 * // Create notification from template
 * const notif = createNotification('user_123', 'new_message', {
 *   sender: 'John Doe',
 *   actionUrl: '/messages/conv_456'
 * });
 * ```
 */

// Bildirim ve Mesajlaşma Sistemi

// Bildirim türleri
export type NotificationType =
  | 'new_message'
  | 'new_booking'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'review_received'
  | 'profile_approved'
  | 'profile_rejected'
  | 'vip_expiring'
  | 'points_earned'
  | 'referral_success'
  | 'warning'
  | 'system';

// Bildirim kategorileri
export type NotificationCategory =
  | 'messages'
  | 'bookings'
  | 'reviews'
  | 'profile'
  | 'vip'
  | 'points'
  | 'referral'
  | 'warning'
  | 'system'
  | 'promotions';

// Bildirim öncelik seviyeleri
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  priority?: NotificationPriority;
  title: string;
  message: string;
  icon?: string;
  data?: Record<string, any>;
  isRead: boolean;
  read?: boolean; // Alternative isRead için
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
}

// Notification category bilgileri
export const NOTIFICATION_CATEGORY_INFO: Record<NotificationCategory, {
  category: NotificationCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}> = {
  messages: {
    category: 'messages',
    label: 'Mesajlar',
    icon: '💬',
    color: 'text-blue-500',
    description: 'Mesaj bildirimleri'
  },
  bookings: {
    category: 'bookings',
    label: 'Randevular',
    icon: '📅',
    color: 'text-green-500',
    description: 'Randevu bildirimleri'
  },
  reviews: {
    category: 'reviews',
    label: 'Yorumlar',
    icon: '⭐',
    color: 'text-yellow-500',
    description: 'Yorum bildirimleri'
  },
  profile: {
    category: 'profile',
    label: 'Profil',
    icon: '👤',
    color: 'text-blue-500',
    description: 'Profil bildirimleri'
  },
  system: {
    category: 'system',
    label: 'Sistem',
    icon: '⚙️',
    color: 'text-gray-500',
    description: 'Sistem bildirimleri'
  },
  promotions: {
    category: 'promotions',
    label: 'Promosyonlar',
    icon: '🎁',
    color: 'text-emerald-500',
    description: 'Promosyon bildirimleri'
  },
  vip: {
    category: 'vip',
    label: 'VIP',
    icon: '👑',
    color: 'text-emerald-500',
    description: 'VIP üyelik bildirimleri'
  },
  points: {
    category: 'points',
    label: 'Puanlar',
    icon: '🏆',
    color: 'text-emerald-500',
    description: 'Puan bildirimleri'
  },
  warning: {
    category: 'warning',
    label: 'Uyarılar',
    icon: '⚠️',
    color: 'text-red-500',
    description: 'Uyarı bildirimleri'
  },
  referral: {
    category: 'referral',
    label: 'Davetler',
    icon: '🔗',
    color: 'text-emerald-500',
    description: 'Davet bildirimleri'
  }
};

export interface EmailNotification {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

// Bildirim yapılandırması
export const NOTIFICATION_CONFIG = {
  // Email ayarları
  email: {
    from: 'noreply@escortplatform.com',
    fromName: 'Escort Platform',
    replyTo: 'support@escortplatform.com'
  },

  // TTL (Time to Live)
  ttl: {
    message: 30, // gün
    booking: 7,
    warning: 90,
    system: 365
  },

  // Bildirim tercihleri
  preferences: {
    email: {
      new_message: true,
      new_booking: true,
      booking_reminder: true,
      review_received: true,
      vip_expiring: true,
      marketing: false
    },
    push: {
      new_message: true,
      new_booking: true,
      booking_reminder: true,
      review_received: true
    },
    sms: {
      new_booking: true,
      booking_reminder: true
    }
  }
};

// Bildirim şablonları
export const NOTIFICATION_TEMPLATES = {
  // Mesaj bildirimleri
  new_message: {
    title: 'Yeni Mesaj',
    message: '{sender} size mesaj gönderdi',
    emailSubject: 'Yeni mesajınız var',
    emailTemplate: 'new_message',
    category: 'messages' as const
  },

  // Randevu bildirimleri
  new_booking: {
    title: 'Yeni Randevu Talebi',
    message: '{customer} randevu talebiniz var: {date} {time}',
    emailSubject: 'Yeni randevu talebi',
    emailTemplate: 'new_booking',
    category: 'bookings' as const
  },
  booking_confirmed: {
    title: 'Randevu Onaylandı',
    message: 'Randevunuz onaylandı: {date} {time}',
    emailSubject: 'Randevu onaylandı',
    emailTemplate: 'booking_confirmed',
    category: 'bookings' as const
  },
  booking_cancelled: {
    title: 'Randevu İptal Edildi',
    message: '{reason} nedeniyle randevu iptal edildi',
    emailSubject: 'Randevu iptal edildi',
    emailTemplate: 'booking_cancelled',
    category: 'bookings' as const
  },
  booking_reminder: {
    title: 'Randevu Hatırlatma',
    message: 'Yarınki randevunuz: {date} {time}. Lütfen zamanında gidin.',
    emailSubject: 'Randevu hatırlatması',
    emailTemplate: 'booking_reminder',
    remindHoursBefore: [24, 2], // 24 saat ve 2 saat önce
    category: 'bookings' as const
  },

  // Yorum bildirimleri
  review_received: {
    title: 'Yeni Yorum Aldınız',
    message: '{customer} sizi {rating} yıldızla değerlendirdi',
    emailSubject: 'Yeni yorum aldınız',
    emailTemplate: 'review_received',
    category: 'reviews' as const
  },

  // Profil bildirimleri
  profile_approved: {
    title: 'Profiliniz Onaylandı',
    message: 'Tebrikler! Profiliniz artık yayında.',
    emailSubject: 'Profiliniz onaylandı',
    emailTemplate: 'profile_approved',
    category: 'profile' as const
  },
  profile_rejected: {
    title: 'Profil Güncellemesi Gerekli',
    message: 'Lütfen profili güncelleyin: {reason}',
    emailSubject: 'Profil güncellemesi gerekli',
    emailTemplate: 'profile_rejected',
    category: 'profile' as const
  },

  // VIP bildirimleri
  vip_expiring: {
    title: 'VIP Üyelik Sonlanıyor',
    message: 'VIP üyeliğiniz {days} gün sonra sonlanıyor',
    emailSubject: 'VIP üyelik sonlanıyor',
    emailTemplate: 'vip_expiring',
    warnDaysBefore: [7, 3, 1],
    category: 'vip' as const
  },

  // Puan bildirimleri
  points_earned: {
    title: 'Puan Kazandınız',
    message: 'Tebrikler! {points} puan kazandınız',
    emailSubject: 'Puan kazandınız',
    emailTemplate: 'points_earned',
    showOnlyIf: [100, 500, 1000], // Sadece bu miktarlarda bildirim
    category: 'points' as const
  },

  // Davet bildirimleri
  referral_success: {
    title: 'Davet Başarılı',
    message: '{referralName} üye oldu!',
    emailSubject: 'Davet başarılı',
    emailTemplate: 'referral_success',
    category: 'referral' as const
  },

  // Uyarılar
  warning: {
    title: 'Uyarı',
    message: '{warningMessage}',
    emailSubject: 'Platform uyarısı',
    emailTemplate: 'warning',
    severity: 'medium',
    category: 'warning' as const
  },

  // Sistem
  system: {
    title: 'Platform Bilgisi',
    message: '{message}',
    emailSubject: 'Platform bilgisi',
    emailTemplate: 'system',
    category: 'system' as const
  }
};

// Chat kuralları
export const CHAT_RULES = {
  // Escort kuralları
  escort: {
    title: 'Escort Kuralları',
    rules: [
      {
        id: 'no_explicit',
        title: 'Müstehcen İçerik Yasak',
        description: 'Mesajlarda açık, cinsel içerik yasaktır.',
        icon: '🚫',
        severity: 'high',
        violationAction: 'ban'
      },
      {
        id: 'no_external_contact',
        title: 'Dış İletişim Yasak',
        description: 'Telefon numarası veya e-posta istemek yasaktır.',
        icon: '📵',
        severity: 'medium',
        violationAction: 'warning'
      },
      {
        id: 'no_cash_discussion',
        title: 'Nakit Para Görüşmesi',
        description: 'Sadece platform üzerinden ödeme kabul edin.',
        icon: '💰',
        severity: 'high',
        violationAction: 'ban'
      },
      {
        id: 'be_respectful',
        title: 'Saygılı Olun',
        description: 'Her müşteriye nazik ve profesyonel olun.',
        icon: '🤝',
        severity: 'low',
        violationAction: 'warning'
      },
      {
        id: 'no_drugs',
        title: 'Uyuşturucu Yasak',
        description: 'Uyuşturucu teklif etmek kesinlikle yasaktır.',
        icon: '🚷',
        severity: 'high',
        violationAction: 'permanent_ban'
      }
    ],
    warningMessage: 'Kurallara uymazsanız hesabınız askıya alınır.'
  },

  // Müşteri kuralları
  customer: {
    title: 'Müşteri Kuralları',
    rules: [
      {
        id: 'be_respectful',
        title: 'Saygılı Olun',
        description: 'Escortlara nazik ve kibarlı davranın.',
        icon: '🤝',
        severity: 'high',
        violationAction: 'ban'
      },
      {
        id: 'no_negotiation',
        title: 'Pazarlık Yapmayın',
        description: 'İlan fiyatları üzerinden görüşün.',
        icon: '🚫',
        severity: 'medium',
        violationAction: 'warning'
      },
      {
        id: 'no_time_wasting',
        title: 'Zaman Kaybetmeyin',
        description: 'Ciddi değilseniz randevu almayın.',
        icon: '⏰',
        severity: 'medium',
        violationAction: 'warning'
      },
      {
        id: 'no_explicit_chat',
        title: 'Müstehcen İçerik Yasak',
        description: 'Ahlak dışı mesajlar yasaktır.',
        icon: '🚫',
        severity: 'high',
        violationAction: 'ban'
      },
      {
        id: 'keep_appointments',
        title: 'Randevulara Sadık Kalın',
        description: 'Son dakika iptallerden kaçının.',
        icon: '✅',
        severity: 'medium',
        violationAction: 'warning'
      }
    ],
    warningMessage: 'Kuralları ihlal etmek platformdan uzaklaştırılmanıza neden olabilir.'
  }
};

// Sansür listesi
export const PROFANITY_FILTER = {
  // Türkçe küfürler
  turkish: [
    'amk', 'şerefsiz', 'ibne', 'göt', 'yarrak', 'sikik', 'oç', 'piç', 'kahpe',
    'orospu', 'fahişe', 'yavşak', 'siktiğim', 'anneni', 'aneni'
  ],

  // İngilizce küfürler
  english: [
    'fuck', 'shit', 'bitch', 'whore', 'slut', 'bastard', 'damn', 'ass',
    'dick', 'cock', 'pussy', 'cunt', 'hell'
  ],

  // Uygunsuz terimler
  inappropriate: [
    'porn', 'seks', 'sex', 'hardcore', 'xxx', '18+', 'fetish', 'bdsm',
    'escort service', 'massage happy' // Spam/banned services
  ],

  // Telefon patternleri (block external contact attempts)
  phonePatterns: [
    /\d{10,11}/g, // Turkish phone numbers
    /\d{3}[-\s]?\d{3}[-\s]?\d{4}/g,
    /05\d{2}[-\s]?\d{3}[-\s]?\d{4}/g,
    /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g
  ],

  // E-posta patternleri
  emailPatterns: [
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    /gmail\.com/i,
    /hotmail\.com/i,
    /yahoo\.com/i
  ]
};

// Mesaj kuralları
export const MESSAGE_RULES = {
  maxLength: 500,
  maxImages: 3,
  maxVideos: 0, // Video gönderimi için ayrı özellik gerekir
  forbiddenContent: [
    {
      pattern: /\d{10,11}/,
      description: 'Telefon numarası',
      replacement: '***'
    },
    {
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      description: 'E-posta adresi',
      replacement: '***@***.***'
    }
  ],
  spamDetection: {
    repeatedMessageThreshold: 3,
    timeWindow: 60000, // 1 dakika
    maxMessagesPerMinute: 10,
    capsLockThreshold: 0.7, // %70 büyük harf = spam şüphesi
  }
};

// Uyarı seviyeleri
export const WARNING_LEVELS = {
  low: {
    label: 'Hafif Uyarı',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    icon: '⚠️',
    action: 'notify'
  },
  medium: {
    label: 'Orta Seviye Uyarı',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    icon: '🔶',
    action: 'suspend_24h'
  },
  high: {
    label: 'Ciddi Uyarı',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    icon: '🛑',
    action: 'suspend_7d'
  },
  critical: {
    label: 'Son Uyarı',
    color: 'text-red-800',
    bgColor: 'bg-red-200',
    icon: '⛔',
    action: 'ban'
  }
};

// Randevu hatırlatma mesajları
export const BOOKING_REMINDERS = {
  beforeBooking: {
    title: '💬 Nazik Bir Randevu Geçirin',
    messages: [
      {
        text: 'Lütfen randevu talebi oluştururken kibarlı ve nazik olun.',
        position: 'top',
        variant: 'info'
      },
      {
        text: 'Gereksiz yere randevu talebi oluşturmaktan kaçının.',
        position: 'top',
        variant: 'warning'
      }
    ]
  },
  afterBooking: {
    title: '✅ Randevu Oluşturuldu',
    messages: [
      {
        text: 'Randevu saatinde lütfen hazır ve temiz olun.',
        variant: 'info'
      },
      {
        text: 'Geç kalacağınızı en az 2 saat önce bildirin.',
        variant: 'warning'
      },
      {
        text: 'Randevuyu iptal edecekseniz 24 saat önce haber verin.',
        variant: 'info'
      }
    ]
  },
  reminders: {
    '24h': {
      title: '⏰ Yarın Randevunuz Var',
      message: 'Yarın {date} saat {time} randevunuz var. Hazırlanın!',
      actions: ['onayla', 'iptal_et']
    },
    '2h': {
      title: '🚀 2 Saat Sonra Randevu',
      message: '2 saat sonra randevunuz var. Yola çıkın!',
      actions: ['ona_geldim', 'geç_kalicami']
    }
  }
};

// Kullanıcı uyarı sistemi
export interface UserWarning {
  id: string;
  userId: string;
  type: keyof typeof WARNING_LEVELS;
  reason: string;
  description: string;
  issuedBy: 'system' | 'admin' | 'auto';
  issuedAt: Date;
  expiresAt?: Date;
  isRead: boolean;
  action?: {
    type: 'suspend' | 'ban' | 'restriction';
    duration?: number; // hours/days
  };
}

// Uyarı oluşturma fonksiyonu
export function createUserWarning(
  userId: string,
  type: keyof typeof WARNING_LEVELS,
  reason: string,
  description: string
): UserWarning {
  return {
    id: `warn_${Date.now()}_${userId}`,
    userId,
    type,
    reason,
    description,
    issuedBy: 'system',
    issuedAt: new Date(),
    isRead: false
  };
}

// Mesaj sansürleme fonksiyonu
export function sanitizeMessage(message: string): { clean: string; violations: string[] } {
  let cleanMessage = message;
  const violations: string[] = [];

  // Türkçe küfürleri sansürle
  PROFANITY_FILTER.turkish.forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(regex, '*'.repeat(word.length));
      violations.push(`Küfürlü dil kullanımı`);
    }
  });

  // İngilizce küfürleri sansürle
  PROFANITY_FILTER.english.forEach(word => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(regex, '*'.repeat(word.length));
      violations.push(`Uygunsuz İngilizce kelime`);
    }
  });

  // Uygunsuz terimleri sansürle
  PROFANITY_FILTER.inappropriate.forEach(term => {
    const regex = new RegExp(term, 'gi');
    if (regex.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(regex, '***');
      violations.push(`Yasak içerik: ${term}`);
    }
  });

  // Telefon numaralarını maskele
  PROFANITY_FILTER.phonePatterns.forEach(pattern => {
    if (pattern.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(pattern, '***');
      violations.push('Telefon numarası paylaşımı');
    }
  });

  // E-posta adreslerini maskele
  PROFANITY_FILTER.emailPatterns.forEach(pattern => {
    if (pattern.test(cleanMessage)) {
      cleanMessage = cleanMessage.replace(pattern, '***@***.***');
      violations.push('Dış iletişim bilgisi');
    }
  });

  return { clean: cleanMessage, violations };
}

// Spam kontrolü
export function checkSpam(messages: Array<{ content: string; timestamp: number }>): boolean {
  const now = Date.now();
  const timeWindow = MESSAGE_RULES.spamDetection.timeWindow;

  // Aynı mesaj tekrarı
  const recentMessages = messages.filter(m => now - m.timestamp < timeWindow);

  const messageCounts = new Map<string, number>();
  recentMessages.forEach(m => {
    const count = messageCounts.get(m.content) || 0;
    messageCounts.set(m.content, count + 1);
  });

  for (const [message, count] of messageCounts) {
    if (count >= MESSAGE_RULES.spamDetection.repeatedMessageThreshold) {
      return true;
    }
  }

  // Çok hızlı mesaj gönderimi
  if (recentMessages.length >= MESSAGE_RULES.spamDetection.maxMessagesPerMinute) {
    return true;
  }

  // Caps lock spam kontrolü
  recentMessages.forEach(m => {
    const upperCase = m.content.replace(/[^A-Z]/g, '').length;
    const total = m.content.replace(/[^a-zA-Z]/g, '').length;
    if (total > 0) {
      const ratio = upperCase / total;
      if (ratio >= MESSAGE_RULES.spamDetection.capsLockThreshold) {
        return true;
      }
    }
  });

  return false;
}

// Bildirim oluşturma helper'ı
export function createNotification(
  userId: string,
  type: NotificationType,
  data: Record<string, any>
): Notification {
  const template = NOTIFICATION_TEMPLATES[type];

  return {
    id: `notif_${Date.now()}_${userId}`,
    userId,
    type,
    title: template.title,
    message: template.message.replace(/\{(\w+)\}/g, (_, key) => data[key] || ''),
    data,
    isRead: false,
    createdAt: new Date(),
    actionUrl: data.actionUrl,
    category: template.category || 'system',
  };
}
