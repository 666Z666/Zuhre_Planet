import { z } from 'zod';

/**
 * İlan listeleme / profil güncelleme girdi şemaları.
 * Rakip analizi (Kasım 2026) önerileri:
 *  - Çok kriterli filtre: şehir + ilçe, fiyat aralığı, yaş aralığı, yalnız doğrulanmış.
 *  - Sıralamada doğrulama satın alınamaz: doğrulanmış profil, doğrulanmamış
 *    öne çıkarılmış (boost) profilin önünde gelir.
 *  - Yaş her yerde en az 18.
 */

export const MIN_AGE = 18;
export const MAX_AGE = 99;

const text = (max: number) => z.string().trim().max(max);

export const listInputSchema = z
  .object({
    page: z.number().int().min(1).max(1000).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    city: text(80).optional(),
    district: text(80).optional(),
    tier: z.enum(['free', 'gold', 'platinum', 'vip']).optional(),
    isBoosted: z.boolean().optional(),
    verifiedOnly: z.boolean().optional(),
    minPrice: z.number().min(0).max(1_000_000).optional(),
    maxPrice: z.number().min(0).max(1_000_000).optional(),
    minAge: z.number().int().min(MIN_AGE).max(MAX_AGE).optional(),
    maxAge: z.number().int().min(MIN_AGE).max(MAX_AGE).optional(),
    search: text(100).optional(),
    /** Son aktiflik filtresi: online (<15 dk), day (24 sa), week (7 gün) */
    activeWithin: z.enum(['online', 'day', 'week']).optional(),
    sortBy: z.enum(['rating', 'createdAt', 'hourlyRate', 'lastActive']).default('rating'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .refine((v) => v.minPrice === undefined || v.maxPrice === undefined || v.minPrice <= v.maxPrice, {
    message: 'minPrice, maxPrice değerinden büyük olamaz.',
    path: ['minPrice'],
  })
  .refine((v) => v.minAge === undefined || v.maxAge === undefined || v.minAge <= v.maxAge, {
    message: 'minAge, maxAge değerinden büyük olamaz.',
    path: ['minAge'],
  });

export type ListInput = z.infer<typeof listInputSchema>;

export const updateProfileInputSchema = z.object({
  displayName: text(60).min(1).optional(),
  bio: text(500).optional(),
  biography: text(5000).optional(),
  slogan: text(120).optional(),
  city: text(80).min(1).optional(),
  district: text(80).optional(),
  age: z
    .number()
    .int()
    .min(MIN_AGE, { message: `Yaş en az ${MIN_AGE} olmalıdır.` })
    .max(MAX_AGE)
    .optional(),
  hourlyRate: z.number().min(0).max(1_000_000).optional(),
});

/** Bir profilin "doğrulanmış" sayılması: rozet veya admin onayı. */
export function isVerified(p: { hasVerifiedBadge?: boolean | null; isVerifiedByAdmin?: boolean | null }): boolean {
  return Boolean(p.hasVerifiedBadge || p.isVerifiedByAdmin);
}

/**
 * Sıralama anahtarı (yüksek = önce). Doğrulama boost'tan ağır basar:
 * doğrulanmış+boost (3) > doğrulanmış (2) > boost (1) > diğer (0).
 * SQL tarafındaki ORDER BY ile aynı mantığı belgeler ve test edilir.
 */
export function rankKey(p: { hasVerifiedBadge?: boolean | null; isVerifiedByAdmin?: boolean | null; isBoosted?: boolean | null }): number {
  return (isVerified(p) ? 2 : 0) + (p.isBoosted ? 1 : 0);
}

/** İlçe/şehir sayfası yalnızca canlı arz varsa indekslenmeli (boş sayfa = doorway riski). */
export const MIN_LISTINGS_FOR_INDEX = 3;
export function shouldIndexLocation(activeCount: number): boolean {
  return activeCount >= MIN_LISTINGS_FOR_INDEX;
}

/**
 * Türkçe adı URL slug'ına çevirir (src/data/locations.ts slug'larıyla aynı kural):
 * "İstanbul" → "istanbul", "Kadıköy" → "kadikoy", "Beşiktaş" → "besiktas".
 */
export function trSlug(name: string): string {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
  return name
    .normalize('NFC')
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşüâîû]/g, (c) => map[c] ?? c)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Arama motoru indekslemesi yalnız SEO_INDEXING=true iken (hukuki onay sonrası) açılır. */
export function seoIndexingEnabled(): boolean {
  return process.env.SEO_INDEXING === 'true';
}

const xmlEscape = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

/** Konum site haritası: yalnız indekslenebilir (≥MIN_LISTINGS_FOR_INDEX) şehir/ilçe sayfaları. */
export function buildLocationSitemap(
  baseUrl: string,
  rows: { city: string; district: string | null; count: number }[],
): string {
  const base = baseUrl.replace(/\/+$/, '');
  const urls = new Set<string>();
  const cityTotals = new Map<string, number>();
  for (const r of rows) {
    cityTotals.set(r.city, (cityTotals.get(r.city) ?? 0) + r.count);
    if (r.district && shouldIndexLocation(r.count)) urls.add(`${base}/konum/${trSlug(r.city)}/${trSlug(r.district)}`);
  }
  for (const [city, total] of cityTotals) if (shouldIndexLocation(total)) urls.add(`${base}/konum/${trSlug(city)}`);
  const body = [...urls].sort().map((u) => `  <url><loc>${xmlEscape(u)}</loc><changefreq>daily</changefreq></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}${body ? '\n' : ''}</urlset>\n`;
}
