/**
 * Loyalty & Points System Module
 * 
 * Comprehensive reward and loyalty system for the escort platform. Manages user loyalty levels,
 * points transactions, referral programs, visibility boosts, and profile completeness rewards.
 * This system incentivizes user engagement through tiered benefits and multiple earning mechanisms.
 * 
 * @module types/loyalty
 * @category Types - Loyalty & Rewards
 * 
 * Exported Types/Interfaces:
 * - LoyaltyPoints: User's current and lifetime loyalty points with level information
 * - PointsTransaction: Individual points earning/spending transactions with categorization
 * - ReferralCode: Referral code with rewards configuration and usage tracking
 * - VisibilityBoost: Temporary visibility multiplier configuration for profile boosting
 * - ProfileCompleteness: Profile completion tracking with bonus rewards structure
 * 
 * Constants & Configurations:
 * - LOYALTY_LEVELS: 5-tier loyalty system (Bronze → Silver → Gold → Platinum → Diamond)
 * - POINTS_EARNING: Points earning methods for customers and escorts with point values
 * - POINTS_SPENDING: Point redemption options with costs and benefits
 * - VISIBILITY_MULTIPLIERS: Visibility boost multipliers for different user statuses
 * - REFERRAL_SYSTEM: Referral program configuration and reward structure
 * - LOYALTY_CONTENT: User-facing content explaining the loyalty system
 * 
 * Functions:
 * - calculateProfileCompleteness(): Calculates profile completion percentage and associated bonuses
 * - calculateVisibilityScore(): Calculates final visibility score with multiple multiplier factors
 * 
 * Key Features:
 * - Multi-tier loyalty levels with progressive benefits
 * - Points earning from reviews, appointments, referrals, and profile completion
 * - Visibility multipliers based on loyalty status, profile completeness, verification
 * - Referral system with different rewards for customers and escorts
 * - Profile completeness bonuses (points, discounts, visibility boost)
 * - Points spending options for visibility boost, badges, and coupons
 * 
 * @example
 * ```typescript
 * import { 
 *   LoyaltyPoints, 
 *   calculateProfileCompleteness,
 *   calculateVisibilityScore,
 *   LOYALTY_LEVELS 
 * } from '@/types/loyalty';
 * 
 * // Calculate profile completeness
 * const completeness = calculateProfileCompleteness({
 *   avatar: true,
 *   coverPhoto: true,
 *   personalInfo: true,
 *   description: true,
 *   services: true,
 *   location: true,
 *   contact: true,
 *   workingHours: true,
 *   photos: 12
 * });
 * 
 * // Calculate visibility score with multipliers
 * const visibility = calculateVisibilityScore(100, {
 *   loyaltyLevel: 'gold',
 *   isCompleteProfile: true,
 *   isVerified: true
 * });
 * ```
 */

// Sadakat ve Puan Sistemi
// Escort platformu için kapsamlı ödül sistemi

export interface LoyaltyPoints {
  current: number;
  lifetime: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  nextLevel: {
    name: string;
    points: number;
    reward: string;
  };
}

export interface PointsTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'bonus';
  amount: number;
  reason: string;
  date: Date;
  category: 'review' | 'appointment' | 'referral' | 'complete_profile' | 'bonus' | 'visibility_boost';
}

export interface ReferralCode {
  code: string;
  referrerId: string;
  maxUses: number;
  usedCount: number;
  reward: {
    discount: number; // percentage
    currency: 'TL' | 'points';
    points?: number;
  };
  expiresAt: Date;
  createdAt: Date;
}

export interface VisibilityBoost {
  boostType: 'points' | 'vip' | 'complete_profile' | 'loyalty';
  multiplier: number; // 1x to 10x visibility
  duration: number; // in days
  expiresAt: Date;
}

// Puan seviyeleri ve ödülleri
export const LOYALTY_LEVELS = {
  bronze: {
    name: 'Bronz',
    minPoints: 0,
    color: 'from-emerald-700 to-blue-800',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-700/10',
    border: 'border-emerald-700/30',
    benefits: [
      '%5 daha fazla görünürlük',
      '1 indirim hakkı'
    ],
    icon: '🥉'
  },
  silver: {
    name: 'Gümüş',
    minPoints: 100,
    color: 'from-gray-400 to-gray-500',
    textColor: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    border: 'border-gray-400/30',
    benefits: [
      '%10 daha fazla görünürlük',
      '3 indirim hakkı',
      'Haftalık 1 boost'
    ],
    icon: '🥈'
  },
  gold: {
    name: 'Altın',
    minPoints: 500,
    color: 'from-emerald-400 to-blue-500',
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    benefits: [
      '%25 daha fazla görünürlük',
      '10 indirim hakkı',
      'Haftalık 2 boost',
      'Öncelikli destek'
    ],
    icon: '🥇'
  },
  platinum: {
    name: 'Platin',
    minPoints: 1500,
    color: 'from-slate-300 to-slate-400',
    textColor: 'text-slate-300',
    bgColor: 'bg-slate-300/10',
    border: 'border-slate-300/30',
    benefits: [
      '%50 daha fazla görünürlük',
      'Sınırsız indirim hakkı',
      'Günlük 1 boost',
      'Özel profil rozeti',
      'VIP destek hattı'
    ],
    icon: '💎'
  },
  diamond: {
    name: 'Elmas',
    minPoints: 5000,
    color: 'from-emerald-400 to-blue-500',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    border: 'border-emerald-400/30',
    benefits: [
      '%100 daha fazla görünürlük',
      'Sınırsız her şey',
      'Günlük 3 boost',
      'Özel danışman',
      'VIP tüm özellikler',
      'Özel kampanyalar'
    ],
    icon: '💠'
  }
};

// Puan kazanma yöntemleri
export const POINTS_EARNING = {
  // Müşteri puanları
  customer_review: {
    points: 25,
    title: 'Yorum Yap',
    description: 'Randevu sonunda yorum yazın',
    icon: '⭐',
    category: 'review' as const
  },
  customer_review_detailed: {
    points: 50,
    title: 'Detaylı Yorum',
    description: '100+ karakter yorum yazın',
    icon: '📝',
    category: 'review' as const
  },
  customer_appointment_complete: {
    points: 20,
    title: 'Randevu Tamamla',
    description: 'Başarılı randevu sonrası',
    icon: '✅',
    category: 'appointment' as const
  },
  customer_verify_phone: {
    points: 100,
    title: 'Telefon Doğrula',
    description: 'Bir kerelik bonus',
    icon: '📱',
    category: 'bonus' as const
  },
  customer_complete_profile: {
    points: 50,
    title: 'Profili Tamamla',
    description: 'Tüm bilgileri doldur',
    icon: '👤',
    category: 'complete_profile' as const
  },
  customer_referral_signup: {
    points: 100,
    title: 'Davet Koduyla Kayıt',
    description: 'Arkadaşınızın koduyla üye olun',
    icon: '🎁',
    category: 'referral' as const
  },
  customer_referral_bonus: {
    points: 50,
    title: 'İlk Randevu Bonusu',
    description: 'Davet koduyla ilk randevu',
    icon: '🎊',
    category: 'referral' as const
  },

  // Escort puanları
  escort_review_response: {
    points: 15,
    title: 'Yorum Yanıtı',
    description: 'Müşteri yorumuna cevap verin',
    icon: '💬',
    category: 'review' as const
  },
  escort_appointment_complete: {
    points: 50,
    title: 'Başarılı Randevu',
    description: 'Müşteri memnuniyeti',
    icon: '✅',
    category: 'appointment' as const
  },
  escort_complete_profile: {
    points: 200,
    title: 'Eksiksiz Profil',
    description: 'Tüm bilgiler + 10+ fotoğraf',
    icon: '📸',
    category: 'complete_profile' as const
  },
  escort_get_verified: {
    points: 500,
    title: 'Onaylı Üye Ol',
    description: 'Admin onayı sonrası',
    icon: '✓',
    category: 'bonus' as const
  },
  escort_first_booking: {
    points: 100,
    title: 'İlk Randevu',
    description: 'İlk müşteri',
    icon: '🎉',
    category: 'appointment' as const
  },
  escort_5star_review: {
    points: 30,
    title: '5 Yıldızlı Yorum',
    description: 'Her 5 yıldızlı yorum için',
    icon: '⭐',
    category: 'review' as const
  },
  escort_customer_rating: {
    points: 20,
    title: 'Müşteri Değerlendir',
    description: 'Müşteriyi puanlayın',
    icon: '📊',
    category: 'review' as const
  },
  escort_warning_validated: {
    points: 50,
    title: 'Uyarı Doğrulandı',
    description: 'Diğer escortlar uyarınızı onayladı',
    icon: '⚠️',
    category: 'bonus' as const
  },

  // Ortak (her iki taraf)
  referral_signup: {
    points: 500,
    title: 'Arkadaş Davet',
    description: 'Arkadaşınız üye olduğunda',
    icon: '👥',
    category: 'referral' as const
  },
  referral_first_booking: {
    points: 1000,
    title: 'İlk Randevu Bonusu',
    description: 'Davet edilen ilk randevu',
    icon: '🎊',
    category: 'referral' as const
  },
  daily_login: {
    points: 5,
    title: 'Günlük Giriş',
    description: 'Her gün giriş yapın',
    icon: '📅',
    category: 'bonus' as const
  },
  weekly_streak: {
    points: 50,
    title: 'Haftalık Seri',
    description: '7 gün üst üste giriş',
    icon: '🔥',
    category: 'bonus' as const
  }
};

// Görünürlük artırma çarpanları
export const VISIBILITY_MULTIPLIERS = {
  points_boost: {
    name: 'Puanlarla Boost',
    pointsPerLevel: 100,
    maxMultiplier: 3,
    description: '100 puan = %10 daha fazla görünürlük (maks. %300)'
  },
  loyalty_level: {
    multipliers: {
      bronze: 1.0,
      silver: 1.1,
      gold: 1.25,
      platinum: 1.5,
      diamond: 2.0
    },
    description: 'Sadakat seviyeniz kalıcı görünürlük artışı sağlar'
  },
  complete_profile: {
    multiplier: 1.5,
    description: 'Eksiksiz profil = %50 daha fazla görünürlük'
  },
  verified_status: {
    multiplier: 2.0,
    description: 'Onaylı üye = %100 daha fazla görünürlük'
  },
  vip_status: {
    multiplier: 5.0,
    description: 'VIP üye = %400 daha fazla görünürlük'
  }
};

// Arkadaş getirme sistemi
export const REFERRAL_SYSTEM = {
  codeLength: 8,
  maxReferrals: 50,
  // Davet eden (referrer) ödülleri
  referrerReward: {
    signup: { points: 500, discountPercent: 10 },
    firstBooking: { points: 1000, discountPercent: 25 }
  },
  // Davet edilen (referee) ödülleri
  refereeReward: {
    discountPercent: 15, // İlk üye olan %15 indirim
    points: 100
  },
  // Müşteri referansı ödülleri
  customerReferral: {
    referrerReward: {
      signup: { points: 200, discountPercent: 5 },
      firstBooking: { points: 500, discountPercent: 10 }
    },
    refereeReward: {
      discountPercent: 10, // Müşteri %10 indirim
      points: 100
    }
  },
  validityDays: 90 // Kod 90 gün geçerli
};

// Eksiksiz profil kontrolü
export interface ProfileCompleteness {
  required: {
    avatar: boolean;
    coverPhoto: boolean;
    personalInfo: boolean; // age, height, weight, etc.
    description: boolean;
    services: boolean;
    location: boolean;
    contact: boolean;
    workingHours: boolean;
  };
  optional: {
    photos: number; // min 10
    videos: number;
    socialMedia: boolean;
  };
  completeness: number; // 0-100
  isComplete: boolean;
  bonus: {
    points: number;
    discount: number;
    visibilityBoost: number;
  };
}

export function calculateProfileCompleteness(data: Partial<ProfileCompleteness['required'] & { photos: number; videos?: number }>): ProfileCompleteness {
  const required: ProfileCompleteness['required'] = {
    avatar: data.avatar || false,
    coverPhoto: data.coverPhoto || false,
    personalInfo: data.personalInfo || false,
    description: data.description || false,
    services: data.services || false,
    location: data.location || false,
    contact: data.contact || false,
    workingHours: data.workingHours || false
  };

  const requiredFields = Object.keys(required).length;
  const completedFields = Object.values(required).filter(Boolean).length;
  const requiredCompleteness = (completedFields / requiredFields) * 70; // %70 weight

  const photos = data.photos || 0;
  const videos = data.videos || 0;
  const mediaCompleteness = Math.min((photos * 5) + (videos * 10), 30); // %30 weight

  const totalCompleteness = requiredCompleteness + mediaCompleteness;

  const bonus = {
    points: 0,
    discount: 0,
    visibilityBoost: 0
  };

  if (totalCompleteness >= 100) {
    bonus.points = 200;
    bonus.discount = 15;
    bonus.visibilityBoost = 50;
  } else if (totalCompleteness >= 90) {
    bonus.points = 150;
    bonus.discount = 10;
    bonus.visibilityBoost = 35;
  } else if (totalCompleteness >= 80) {
    bonus.points = 100;
    bonus.discount = 5;
    bonus.visibilityBoost = 20;
  }

  return {
    required,
    optional: { photos, videos: videos || 0, socialMedia: false },
    completeness: Math.round(totalCompleteness),
    isComplete: totalCompleteness >= 100,
    bonus
  };
}

// Görünürlük hesaplama
export function calculateVisibilityScore(baseScore: number, factors: {
  loyaltyLevel?: keyof typeof LOYALTY_LEVELS;
  isCompleteProfile?: boolean;
  isVerified?: boolean;
  isVip?: boolean;
  pointsBoost?: number;
}): number {
  let multiplier = 1.0;

  // Sadakat seviyesi bonusu
  if (factors.loyaltyLevel) {
    multiplier *= VISIBILITY_MULTIPLIERS.loyalty_level.multipliers[factors.loyaltyLevel];
  }

  // Eksiksiz profil bonusu
  if (factors.isCompleteProfile) {
    multiplier *= VISIBILITY_MULTIPLIERS.complete_profile.multiplier;
  }

  // Onaylı üye bonusu
  if (factors.isVerified) {
    multiplier *= VISIBILITY_MULTIPLIERS.verified_status.multiplier;
  }

  // VIP bonusu
  if (factors.isVip) {
    multiplier *= VISIBILITY_MULTIPLIERS.vip_status.multiplier;
  }

  // Puan boost bonusu
  if (factors.pointsBoost) {
    const boostMultiplier = Math.min(
      Math.floor(factors.pointsBoost / 100) * 0.1 + 1,
      VISIBILITY_MULTIPLIERS.points_boost.maxMultiplier
    );
    multiplier *= boostMultiplier;
  }

  return Math.round(baseScore * multiplier);
}

// Puan harcama seçenekleri
export const POINTS_SPENDING = {
  boost_day: {
    cost: 100,
    benefit: '1 günlük %50 görünürlük artışı',
    icon: '🚀'
  },
  boost_week: {
    cost: 500,
    benefit: '7 günlük %100 görünürlük artışı',
    icon: '⭐'
  },
  premium_badge: {
    cost: 200,
    benefit: '30 günlük rozet',
    icon: '🏷️'
  },
  highlight_profile: {
    cost: 50,
    benefit: '24 saat öne çıkarma',
    icon: '💡'
  },
  discount_coupon: {
    cost: 300,
    benefit: '%20 indirim kuponu',
    icon: '🎫'
  },
  extra_photos: {
    cost: 150,
    benefit: '+5 fotoğraf hakkı',
    icon: '📸'
  }
};

// Örnek puan transaction kayıtları
export const sampleTransactions: PointsTransaction[] = [
  {
    id: '1',
    userId: 'user_1',
    type: 'earned',
    amount: 25,
    reason: 'Yorum yapıldı',
    date: new Date('2024-01-15'),
    category: 'review'
  },
  {
    id: '2',
    userId: 'user_1',
    type: 'earned',
    amount: 200,
    reason: 'Eksiksiz profil bonusu',
    date: new Date('2024-01-14'),
    category: 'complete_profile'
  },
  {
    id: '3',
    userId: 'user_1',
    type: 'spent',
    amount: -100,
    reason: '1 günlük boost',
    date: new Date('2024-01-13'),
    category: 'visibility_boost'
  }
];

// İçerik için açıklamalar
export const LOYALTY_CONTENT = {
  title: '🎁 Sadakat Sistemi ile Kazanın',
  sections: [
    {
      heading: '⭐ Puan Nasıl Kazanılır?',
      content: `Platformda aktif olarak puan kazanın:

**Yorum Yaparak:**
• Her yorum = 25 puan
• Detaylı yorum (100+ karakter) = 50 puan

**Randevu Tamamlayarak:**
• Müşteriler = 20 puan
• Escortlar = 50 puan

**Profil Güncelleyerek:**
• Eksiksiz profil = 200 puan
• Yeni fotoğraf = 10 puan
• Onaylı üye = 500 puan

**Arkadaş Davet Ederek:**
• Üye olursa = 500 puan
• Randevu alırsa = 1000 puan`
    },
    {
      heading: '🚀 Puanlar Ne İşe Yarar?',
      content: `Kazandığınız puanlarla:

**Görünürlük Artışı:**
• 100 puan = %10 daha fazla görüntülenme
• Profilinizi üst sıralara taşıyın

**Ücretsiz Özellikler:**
• Boost kullanın
• Rozet alın
• İndirim kuponu kazanın

**Sadakat Seviyeleri:**
• Bronz → Gümüş → Altın → Platin → Elmas
• Her seviye kalıcı bonuslar sunar`
    },
    {
      heading: '👥 Arkadaş Getir, Kazan!',
      content: `Arkadaşınızı platforma davet edin:

**Escort İçin Ödüller:**
• Üye olursa = 500 puan + %10 indirim
• İlk randevu aldığında = 1000 puan + %25 indirim

**Müşteri İçin Ödüller:**
• Üye olursa = 200 puan + %5 indirim
• İlk randevu aldığında = 500 puan + %10 indirim

**Davet Edilen Kazanır:**
• Escortlar: %15 indirim + 100 puan
• Müşteriler: %10 indirim + 100 puan

**Nasıl Çalışır?**
1. Size özel davet kodunuzu alın
2. Arkadaşınızla paylaşın
3. Üye olduğunda otomatik ödül
4. Herkes kazanır!`
    },
    {
      heading: '✨ Eksiksiz Profil Bonusu',
      content: `Profilinizi eksiksiz doldurunca büyük ödüller:

**%100 Tamamlama =**
• 200 puan bonus
• %15 indirim
• %50 daha fazla görünürlük

**Gerekenler:**
✓ Profil fotoğrafı
✓ Kapak fotoğrafı
✓ Kişisel bilgiler
✓ Açıklama
✓ Hizmetler
✓ Konum
✓ İletişim
✓ Çalışma saatleri
✓ En az 10 fotoğraf

Eksiksiz profiller 3 kat daha fazla randevu alır!`
    },
    {
      heading: '💎 Sadakat Seviyeleri',
      content: `Ne kadar aktif olursanız, o çok kazanırsınız:

**🥉 Bronz (0+ puan)**
• %5 görünürlük artışı
• 1 indirim hakkı

**🥈 Gümüş (100+ puan)**
• %10 görünürlük artışı
• 3 indirim hakkı + Haftalık boost

**🥇 Altın (500+ puan)**
• %25 görünürlük artışı
• 10 indirim hakkı + 2 boost/hafta

**💎 Platin (1500+ puan)**
• %50 görünürlük artışı
• Sınırsız indirim + Günlük boost

**💠 Elmas (5000+ puan)**
• %100 görünürlük artışı
• Sınırsız her şey + Özel danışman`
    }
  ]
};
