/**
 * Listing Service (Abstraction Layer)
 * 
 * İlan verilerine erişimi yöneten servis katmanı.
 * Dependency Inversion prensibi gereği, UI bu servisi kullanır, 
 * verinin kaynağını (Mock veya API) bilmez.
 */

import { ListingProfile, FilterOptions } from '@/types/domain';
import { ApiListingService } from './apiListingService';

// --- INTERFACE ---

export interface IListingService {
  getListings(filters?: FilterOptions): Promise<ListingProfile[]>;
  getListingBySlug(slug: string): Promise<ListingProfile | null>;
  getListingById(id: number | string): Promise<ListingProfile | null>;
  getFeaturedListings(): Promise<ListingProfile[]>;
  /** İletişim bağlantısını tıklamada açar (tel: / wa.me). Numara sayfada tutulmaz. */
  revealContact(id: number | string, channel: 'phone' | 'whatsapp'): Promise<{ url: string } | { error: string }>;
}

// --- MOCK DATA ---


const MOCK_LISTINGS: ListingProfile[] = [
  {
    id: '1',
    stageName: 'Elara Moon',
    displayName: 'Elara Moon',
    age: 24,
    city: 'İstanbul',
    district: 'Şişli',
    avatarUrl: '/brand/placeholders/portrait-3.svg',
    coverImage: '/brand/placeholders/portrait-3.svg',
    thumbnailVideo: 'https://cdn.coverr.co/videos/coverr-fashion-photoshoot-in-neon-lights-5683/1080p.mp4',
    membershipTier: 'diamond',
    verificationStatus: 'verified',
    hasVerifiedVideo: true,
    rating: 4.9,
    reviewCount: 128,
    viewCount: 5420,
    isOnline: true,
    phoneNumber: '+905321234567',
    whatsappNumber: '+905321234567',
    biography: 'Merhaba, ben Elara. Yüksek standartlarda, entelektüel ve unutulmaz anlar için buradayım.',
    services: ['classic', 'tantric', 'dinner_date'],
    serviceTags: ['Sensual', 'Elite'],
    physicalTraits: {
      height: 175,
      weight: 55,
      bodyType: 'slim',
      hairColor: 'blonde',
      eyeColor: 'blue',
      breastType: 'natural',
      chest: 90,
      waist: 60,
      hips: 92,
      measurements: '90-60-92'
    },
    isLive: true,
    lastActiveAt: new Date()
  },
  {
    id: '2',
    stageName: 'Zara Sport',
    displayName: 'Zara Sport',
    age: 22,
    city: 'İstanbul',
    district: 'Kadıköy',
    avatarUrl: '/brand/placeholders/portrait-3.svg',
    membershipTier: 'gold',
    verificationStatus: 'verified',
    rating: 4.7,
    reviewCount: 45,
    viewCount: 1200,
    isOnline: false,
    phoneNumber: '+905333334455',
    whatsappNumber: '+905333334455',
    services: ['sport', 'classic'],
    physicalTraits: {
      height: 170,
      weight: 58,
      bodyType: 'athletic',
      hairColor: 'brunette',
      eyeColor: 'brown',
      breastType: 'natural'
    }
  },
  {
    id: '3',
    stageName: 'Selin',
    displayName: 'Selin',
    age: 26,
    city: 'Ankara',
    district: 'Çankaya',
    avatarUrl: '/brand/placeholders/portrait-1.svg',
    membershipTier: 'standard',
    verificationStatus: 'pending',
    rating: 4.5,
    reviewCount: 22,
    viewCount: 890,
    isOnline: true,
    phoneNumber: '+905445556677',
    whatsappNumber: '+905445556677',
    services: ['classic'],
    physicalTraits: {
      height: 168,
      weight: 54,
      bodyType: 'slim',
      hairColor: 'black',
      eyeColor: 'hazel',
      breastType: 'silicone',
      chest: 95,
      waist: 65,
      hips: 98
    },
    isLive: true,
    lastActiveAt: new Date()
  },
  {
    id: '4',
    stageName: 'Milena',
    displayName: 'Milena',
    age: 21,
    city: 'Antalya',
    district: 'Lara',
    avatarUrl: '/brand/placeholders/portrait-5.svg',
    membershipTier: 'elite',
    verificationStatus: 'verified',
    hasVerifiedVideo: true,
    rating: 5.0,
    reviewCount: 210,
    viewCount: 15000,
    isOnline: true,
    phoneNumber: '+905307778899',
    whatsappNumber: '+905307778899',
    services: ['tantric', 'relaxation'],
    physicalTraits: {
      height: 172,
      weight: 52,
      bodyType: 'slim',
      hairColor: 'blonde',
      eyeColor: 'green',
      breastType: 'natural'
    }
  },
  {
    id: '5',
    stageName: 'Ayşe',
    displayName: 'Ayşe',
    age: 23,
    city: 'İstanbul',
    district: 'Beşiktaş',
    avatarUrl: '/brand/placeholders/portrait-5.svg',
    membershipTier: 'standard',
    verificationStatus: 'verified',
    rating: 4.2,
    reviewCount: 15,
    viewCount: 600,
    isOnline: false,
    services: ['classic'],
    physicalTraits: {
      height: 165,
      weight: 50,
      bodyType: 'slim',
      hairColor: 'brunette',
      eyeColor: 'brown',
      breastType: 'natural'
    }
  },
  {
    id: '6',
    stageName: 'Luna',
    displayName: 'Luna',
    age: 25,
    city: 'İzmir',
    district: 'Alsancak',
    avatarUrl: '/brand/placeholders/portrait-6.svg',
    membershipTier: 'platinum',
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 90,
    viewCount: 3200,
    isOnline: true,
    services: ['classic', 'tantric'],
    physicalTraits: {
      height: 169,
      weight: 56,
      bodyType: 'curvy',
      hairColor: 'red',
      eyeColor: 'green',
      breastType: 'natural'
    }
  }
];

// --- IMPLEMENTATION ---

export class MockListingService implements IListingService {
  async getListings(filters?: FilterOptions): Promise<ListingProfile[]> {
    // Demo modunda da sunucuyla aynı filtre mantığı (bkz. server/lib/listing.ts)
    if (!filters) return MOCK_LISTINGS;
    const tr = (s?: string) => (s ?? '').toLocaleLowerCase('tr-TR');
    return MOCK_LISTINGS.filter((l) => {
      const price = l.rates?.hourly ?? l.price;
      if (filters.city && tr(l.city) !== tr(filters.city)) return false;
      if (filters.district && tr(l.district) !== tr(filters.district)) return false;
      if (filters.isVerified && !(l.hasVerifiedBadge || l.verificationStatus === 'verified')) return false;
      if (filters.minAge !== undefined && l.age < filters.minAge) return false;
      if (filters.maxAge !== undefined && l.age > filters.maxAge) return false;
      if (filters.minPrice !== undefined && (price === undefined || price < filters.minPrice)) return false;
      if (filters.maxPrice !== undefined && (price === undefined || price > filters.maxPrice)) return false;
      return true;
    });
  }

  async getListingBySlug(slug: string): Promise<ListingProfile | null> {
    return MOCK_LISTINGS.find(l => l.slug === slug) || null;
  }

  async getListingById(id: number | string): Promise<ListingProfile | null> {
    return MOCK_LISTINGS.find(l => String(l.id) === String(id)) || null;
  }

  async getFeaturedListings(): Promise<ListingProfile[]> {
    return MOCK_LISTINGS.filter(l => l.isBoosted);
  }

  async revealContact(id: number | string, channel: 'phone' | 'whatsapp'): Promise<{ url: string } | { error: string }> {
    const l = MOCK_LISTINGS.find(x => String(x.id) === String(id));
    const n = channel === 'phone' ? l?.phoneNumber : l?.whatsappNumber;
    if (!n) return { error: 'Bu ilan için bu iletişim kanalı açık değil.' };
    return { url: channel === 'phone' ? `tel:${n}` : `https://wa.me/${n.replace(/^\+/, '')}` };
  }
}

// Singleton Instance — kaynak: VITE_LISTING_SOURCE=api → gerçek backend, aksi halde mock.
// Mock yalnız geliştirme/demo içindir; yayında mutlaka "api" olmalı.
export const LISTING_SOURCE: 'api' | 'mock' =
  import.meta.env.VITE_LISTING_SOURCE === 'api' ? 'api' : 'mock';

export const listingService: IListingService =
  LISTING_SOURCE === 'api' ? new ApiListingService() : new MockListingService();
