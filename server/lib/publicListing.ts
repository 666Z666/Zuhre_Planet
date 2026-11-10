import { and, eq, gte } from 'drizzle-orm';
import * as schema from '@/drizzle/schema';
import { MIN_AGE } from './listing';

/** İlan yalnız admin onaylı, görünür ve en az 18 yaş bilgisi mevcutsa yayınlanabilir. */
export function canPublishListing(age: number | null | undefined): boolean {
  return typeof age === 'number' && Number.isInteger(age) && age >= MIN_AGE;
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
