export type ListingSource = 'api' | 'mock';

/** Production ortamında demo verisini hiçbir env ayarıyla etkinleştirme. */
export function resolveListingSource(isProduction: boolean, configuredSource?: string): ListingSource {
  if (isProduction) return 'api';
  return configuredSource === 'api' ? 'api' : 'mock';
}
