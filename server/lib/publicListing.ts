import { and, eq, gte } from 'drizzle-orm';
import * as schema from '@/drizzle/schema';
import { MIN_AGE } from './listing';

/** İlan yalnız admin onaylı, görünür ve en az 18 yaş bilgisi mevcutsa yayınlanabilir. */
export function canPublishListing(age: number | null | undefined): boolean {
  return typeof age === 'number' && Number.isInteger(age) && age >= MIN_AGE;
}

/**
 * Admin listesindeki durum etiketi. "active", publicListingCondition ile aynı kapıyı kullanır
 * (public + approved + yaş >= 18); böylece etiket ile "Aktif" filtresi çelişmez.
 */
export function getListingStatus(profile: {
  verificationStatus: string | null;
  visibilityStatus: string | null;
  age: number | null | undefined;
}): 'active' | 'hidden' | 'pending' | 'rejected' {
  if (profile.verificationStatus === 'rejected') return 'rejected';
  if (profile.visibilityStatus === 'public' && profile.verificationStatus === 'approved' && canPublishListing(profile.age)) {
    return 'active';
  }
  if (profile.verificationStatus === 'approved') return 'hidden';
  return 'pending';
}

/** Tek kaynak: tüm public ilan okumaları bu koşulla filtrelenmelidir. */
export function publicListingCondition() {
  const profile = schema.escortProfiles;
  return and(
    eq(profile.visibilityStatus, 'public'),
    eq(profile.verificationStatus, 'approved'),
    gte(profile.age, MIN_AGE),
  )!;
}
