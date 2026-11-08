/**
 * API tabanlı ilan servisi (trpc.escort.*). `VITE_LISTING_SOURCE=api` ile etkinleşir.
 * Backend yalnızca public + onaylı veriyi döner; telefon/WhatsApp gibi alanlar
 * bilinçli olarak yoktur (iletişim maskeleme ayrı akışta yapılacak).
 */
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../server';
import { SERVER_BASE_URL, secureFetch } from '@/lib/apiSecurity';
import type { ListingProfile, FilterOptions, MembershipTier, ActivityBucket } from '@/types/domain';
import type { IListingService } from './listingService';

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${SERVER_BASE_URL}/api/trpc`,
      fetch: (url, options) => secureFetch(url, options as RequestInit),
    }),
  ],
});

const PLACEHOLDER = '/brand/placeholders/portrait-3.svg';

/** Backend satırı (PUBLIC_PROFILE_COLUMNS) — yalnız kullandığımız alanlar. */
export interface ApiProfileRow {
  id: number;
  stageName: string;
  displayName?: string | null;
  slug?: string | null;
  city: string;
  district?: string | null;
  age?: number | null;
  bio?: string | null;
  biography?: string | null;
  slogan?: string | null;
  coverImage?: string | null;
  thumbnailVideo?: string | null;
  tier?: string | null;
  isBoosted?: boolean | null;
  viewCount?: number | null;
  hasVerifiedBadge?: boolean | null;
  isVerifiedByAdmin?: boolean | null;
  /** Backend tam zaman damgası yerine dilim döner */
  activity?: ActivityBucket;
  hourlyRate?: number | null;
  rating?: number | null;
  averageRating?: string | number | null;
  reviewCount?: number | null;
  media?: { url: string; watermarkedUrl?: string | null; id: number }[];
  reviews?: { id: number; rating: number; comment?: string | null; createdAt?: string | Date | null }[];
}

export function mapApiProfile(r: ApiProfileRow): ListingProfile {
  const verified = Boolean(r.hasVerifiedBadge || r.isVerifiedByAdmin);
  const avg = r.averageRating != null ? Number(r.averageRating) : NaN;
  return {
    id: r.id,
    stageName: r.stageName,
    displayName: r.displayName || r.stageName,
    slug: r.slug ?? undefined,
    age: r.age ?? 0,
    city: r.city,
    district: r.district ?? '',
    avatarUrl: r.coverImage || PLACEHOLDER,
    coverImage: r.coverImage ?? undefined,
    thumbnailVideo: r.thumbnailVideo ?? undefined,
    gallery: r.media?.map((m) => ({ id: String(m.id), url: m.watermarkedUrl || m.url })),
    membershipTier: (r.tier ?? 'free') as MembershipTier,
    tier: (r.tier ?? 'free') as MembershipTier,
    verificationStatus: verified ? 'verified' : 'unverified',
    hasVerifiedBadge: verified,
    rating: Number.isFinite(avg) && avg > 0 ? avg : r.rating ?? 0,
    reviewCount: r.reviewCount ?? 0,
    viewCount: r.viewCount ?? 0,
    isOnline: r.activity === 'online',
    activity: r.activity ?? 'inactive',
    isBoosted: Boolean(r.isBoosted),
    biography: r.biography || r.bio || undefined,
    slogan: r.slogan ?? undefined,
    price: r.hourlyRate ?? undefined,
    rates: r.hourlyRate != null ? { hourly: r.hourlyRate, currency: 'TRY' } : undefined,
    services: [],
    publicReviews: r.reviews?.map((rv) => ({
      id: String(rv.id),
      rating: rv.rating,
      comment: rv.comment ?? '',
      createdAt: rv.createdAt ? new Date(rv.createdAt).toISOString() : '',
    })),
  };
}

const BACKEND_TIERS = ['free', 'gold', 'platinum', 'vip'] as const;
type BackendTier = (typeof BACKEND_TIERS)[number];

/** UI filtrelerini backend `escort.list` girdisine çevirir. */
export function toListInput(f: FilterOptions = {}) {
  const sort =
    f.sortBy === 'price_asc' ? { sortBy: 'hourlyRate' as const, sortOrder: 'asc' as const }
    : f.sortBy === 'price_desc' ? { sortBy: 'hourlyRate' as const, sortOrder: 'desc' as const }
    : f.sortBy === 'newest' ? { sortBy: 'createdAt' as const, sortOrder: 'desc' as const }
    : f.sortBy === 'recent' ? { sortBy: 'lastActive' as const, sortOrder: 'desc' as const }
    : { sortBy: 'rating' as const, sortOrder: 'desc' as const };
  const tier = BACKEND_TIERS.includes(f.tier as BackendTier) ? (f.tier as BackendTier) : undefined;
  const clampAge = (a?: number) => (a === undefined ? undefined : Math.max(18, Math.min(99, Math.round(a))));
  return {
    page: f.page ?? 1,
    limit: f.limit ?? 24,
    city: f.city || undefined,
    district: f.district || undefined,
    search: f.search?.trim() || undefined,
    tier,
    verifiedOnly: f.isVerified || undefined,
    activeWithin: f.activeWithin,
    minPrice: f.minPrice,
    maxPrice: f.maxPrice,
    minAge: clampAge(f.minAge),
    maxAge: clampAge(f.maxAge),
    ...sort,
  };
}

export class ApiListingService implements IListingService {
  async getListings(filters?: FilterOptions): Promise<ListingProfile[]> {
    const res = await client.escort.list.query(toListInput(filters));
    return (res.profiles as ApiProfileRow[]).map((p) => mapApiProfile(p));
  }

  async getListingBySlug(slug: string): Promise<ListingProfile | null> {
    try {
      return mapApiProfile((await client.escort.getBySlug.query({ slug })) as ApiProfileRow);
    } catch {
      return null;
    }
  }

  async getListingById(id: number | string): Promise<ListingProfile | null> {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) return null;
    try {
      return mapApiProfile((await client.escort.getById.query({ id: n })) as ApiProfileRow);
    } catch {
      return null;
    }
  }

  async getFeaturedListings(): Promise<ListingProfile[]> {
    const res = await client.escort.list.query({ ...toListInput({ limit: 12 }), isBoosted: true });
    return (res.profiles as ApiProfileRow[]).map((p) => mapApiProfile(p));
  }

  async revealContact(id: number | string, channel: 'phone' | 'whatsapp'): Promise<{ url: string } | { error: string }> {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) return { error: 'Geçersiz ilan.' };
    try {
      return await client.contact.reveal.mutate({ profileId: n, channel });
    } catch (e) {
      return { error: e instanceof Error ? e.message : 'İletişim bilgisi alınamadı.' };
    }
  }

  /** Şehir/ilçe canlı ilan sayıları (filtre paneli + ilçe SEO sayfaları). */
  async getLocationStats(city?: string) {
    return client.escort.locationStats.query(city ? { city } : undefined);
  }
}
