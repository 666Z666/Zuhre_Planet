import { describe, it, expect } from 'vitest';
import {
  listInputSchema,
  updateProfileInputSchema,
  rankKey,
  shouldIndexLocation,
  MIN_AGE,
  trSlug,
  buildLocationSitemap,
} from '../lib/listing';

describe('updateProfileInputSchema — yaş sınırı', () => {
  it('18 yaş altını reddeder', () => {
    expect(updateProfileInputSchema.safeParse({ age: 17 }).success).toBe(false);
    expect(updateProfileInputSchema.safeParse({ age: 0 }).success).toBe(false);
  });
  it('18 ve üstünü kabul eder', () => {
    expect(updateProfileInputSchema.safeParse({ age: MIN_AGE }).success).toBe(true);
    expect(updateProfileInputSchema.safeParse({ age: 35 }).success).toBe(true);
  });
  it('ondalıklı yaşı reddeder', () => {
    expect(updateProfileInputSchema.safeParse({ age: 18.5 }).success).toBe(false);
  });
  it('bilinmeyen alanları (ör. tier, isVip) atar', () => {
    const r = updateProfileInputSchema.parse({ bio: 'merhaba', tier: 'vip', isVip: true } as Record<string, unknown>);
    expect(r).toEqual({ bio: 'merhaba' });
  });
  it('aşırı uzun metni reddeder', () => {
    expect(updateProfileInputSchema.safeParse({ bio: 'x'.repeat(501) }).success).toBe(false);
  });
});

describe('listInputSchema — filtreler', () => {
  it('varsayılanları doldurur', () => {
    const r = listInputSchema.parse({});
    expect(r.page).toBe(1);
    expect(r.limit).toBe(20);
    expect(r.sortBy).toBe('rating');
  });
  it('ilçe, fiyat ve yaş aralığını kabul eder', () => {
    const r = listInputSchema.parse({ city: 'İstanbul', district: 'Kadıköy', minPrice: 500, maxPrice: 2000, minAge: 21, maxAge: 35, verifiedOnly: true });
    expect(r.district).toBe('Kadıköy');
    expect(r.verifiedOnly).toBe(true);
  });
  it('ters fiyat/yaş aralığını reddeder', () => {
    expect(listInputSchema.safeParse({ minPrice: 3000, maxPrice: 1000 }).success).toBe(false);
    expect(listInputSchema.safeParse({ minAge: 40, maxAge: 25 }).success).toBe(false);
  });
  it('18 altı yaş filtresini reddeder', () => {
    expect(listInputSchema.safeParse({ minAge: 16 }).success).toBe(false);
  });
});

describe('rankKey — doğrulama satın alınamaz', () => {
  it('doğrulanmış profil, doğrulanmamış boost profilin önüne geçer', () => {
    const verified = { hasVerifiedBadge: true, isBoosted: false };
    const boostedOnly = { hasVerifiedBadge: false, isVerifiedByAdmin: false, isBoosted: true };
    expect(rankKey(verified)).toBeGreaterThan(rankKey(boostedOnly));
  });
  it('sıra: doğrulanmış+boost > doğrulanmış > boost > diğer', () => {
    const keys = [
      rankKey({ isVerifiedByAdmin: true, isBoosted: true }),
      rankKey({ isVerifiedByAdmin: true }),
      rankKey({ isBoosted: true }),
      rankKey({}),
    ];
    expect(keys).toEqual([3, 2, 1, 0]);
  });
});

describe('shouldIndexLocation', () => {
  it('az ilanlı konum sayfası indekslenmez', () => {
    expect(shouldIndexLocation(0)).toBe(false);
    expect(shouldIndexLocation(2)).toBe(false);
    expect(shouldIndexLocation(3)).toBe(true);
  });
});


describe('trSlug / buildLocationSitemap', () => {
  it('Türkçe slug', () => {
    expect(trSlug('İstanbul')).toBe('istanbul');
    expect(trSlug('Şişli')).toBe('sisli');
    expect(trSlug('Çankaya')).toBe('cankaya');
  });
  it('yalnız yeterli ilanı olan ilçe ve şehirleri listeler', () => {
    const xml = buildLocationSitemap('https://ornek.test/', [
      { city: 'İstanbul', district: 'Kadıköy', count: 5 },
      { city: 'İstanbul', district: 'Şişli', count: 1 },
      { city: 'Ankara', district: 'Çankaya', count: 1 },
    ]);
    expect(xml).toContain('<loc>https://ornek.test/konum/istanbul/kadikoy</loc>');
    expect(xml).toContain('<loc>https://ornek.test/konum/istanbul</loc>');
    expect(xml).not.toContain('sisli');
    expect(xml).not.toContain('ankara');
  });
  it('boş veride geçerli boş urlset döner', () => {
    expect(buildLocationSitemap('https://x.test', [])).toMatch(/<urlset[^>]*>\n<\/urlset>/);
  });
});
