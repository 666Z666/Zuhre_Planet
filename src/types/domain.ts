/**
 * Domain-specific Types
 * 
 * Zühre Planet uygulaması için escort profilleri, listelemeler ve üyelik tipleri.
 */

export type UserRole = 'customer' | 'escort' | 'admin' | 'moderator';

export type MembershipTier = 'free' | 'standard' | 'gold' | 'platinum' | 'vip' | 'diamond' | 'elite';

/** Escort profile status */
export type ProfileStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

/** Media access and visibility settings */
export interface MediaSettings {
  maxPhotos: number;
  maxVideos: number;
  allowPublicView: boolean;
  blurLevel?: number;
  mediaPrivacySettings?: Record<string, unknown>; // Medya gizlilik ayarları
}

/** Escort profile representation */
export interface EscortProfile {
  id: string;
  userId: string;
  stageName: string;
  displayName?: string; // UI Alias
  age: number;
  city: string;
  district?: string;
  bio?: string;
  avatarUrl?: string;
  membershipTier: MembershipTier;
  status: ProfileStatus;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  lastSeen?: string;
  verifiedAt?: string;
  services?: string[];
  languages?: string[];
  mediaSettings: MediaSettings;
}

/** Customer profile representation */
export interface CustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  membershipTier: MembershipTier;
  points: number;
  avatarUrl?: string;
  updatedAt: Date;
  isLive?: boolean;
  lastActiveAt?: Date;
  metadata?: Record<string, unknown>;
}

/** Physical characteristics of an escort */
export interface PhysicalTraits {
  height: number;
  weight: number;
  bodyType: 'slim' | 'athletic' | 'curvy' | 'plus';
  hairColor: 'blonde' | 'brunette' | 'black' | 'red' | 'auburn';
  eyeColor: 'brown' | 'blue' | 'green' | 'hazel';
  breastType: 'natural' | 'silicone';
  chest?: number;
  waist?: number;
  hips?: number;
  measurements?: string; // e.g., "90-60-90"
}

/** Listing entry for the search page */
export interface ListingProfile {
  id: string | number;
  stageName: string;
  displayName: string;
  age: number;
  city: string;
  district: string;
  neighborhood?: string;
  avatarUrl: string;
  coverImage?: string;
  thumbnailVideo?: string;
  gallery?: string[] | { url: string; id: string }[];
  membershipTier: MembershipTier;
  verificationStatus?: 'pending' | 'verified' | 'unverified';
  hasVerifiedVideo?: boolean;
  isIndependent?: boolean;
  rating: number;
  reviewCount?: number;
  viewCount?: number;
  isOnline: boolean;
  isLive?: boolean;
  biography?: string;
  services: string[];
  serviceTags?: string[]; // e.g., ["Massage", "Dinner Date"]
  physicalTraits?: PhysicalTraits;
  hairColor?: string;
  eyeColor?: string;
  height?: number;
  weight?: number;
  languages?: string[];
  price?: number;
  phoneNumber?: string;
  whatsappNumber?: string;
  rates?: {
    hourly?: number;
    daily?: number;
    currency?: string;
  };
  /** Backend `escortProfiles.tier` alanı (membershipTier ile eşlenir) */
  tier?: MembershipTier;
  slug?: string;
  slogan?: string;
  isBoosted?: boolean;
  hasVerifiedBadge?: boolean;
  lastActiveAt?: string | Date;
  coordinates?: {
    lat: number;
    lng: number;
  };
  pendingChanges?: Partial<ListingProfile>;
  unpublishRequested?: boolean;
}

/** Katalog filtreleri (listingService.getListings) */
export interface FilterOptions {
  city?: string;
  district?: string;
  search?: string;
  minAge?: number;
  maxAge?: number;
  minPrice?: number;
  maxPrice?: number;
  tier?: MembershipTier;
  isOnline?: boolean;
  isVerified?: boolean;
  services?: string[];
  sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

/** Ad Slot for the Bulletin Board */
export interface AdSlot {
  id: string;
  position: number; // 1-20
  status: 'empty' | 'full' | 'reserved';
  escortId?: string;
  escortName?: string;
  escortThumbnail?: string;
  type: 'vip' | 'gold' | 'pro' | 'standard';
  expiresAt?: string;
  price?: number;
}

/** Public review for an escort */
export interface Review {
  id: string;
  escortId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1-5
  comment: string;
  isVerified: boolean;
  createdAt: string;
}

/** Private intelligence record for a customer (Escort-only) */
export interface ClientIntel {
  id: string;
  customerId: string;
  customerPhone?: string;
  postedByEscortId: string;
  safetyRating: number; // 1-5
  punctualityRating: number; // 1-5
  communicationRating: number; // 1-5
  isBlacklisted: boolean;
  privateNote: string;
  createdAt: string;
}
