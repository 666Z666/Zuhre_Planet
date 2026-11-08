import { describe, it, expect, vi } from 'vitest';

vi.mock('@trpc/client', () => ({
  createTRPCProxyClient: () => ({}),
  httpBatchLink: () => ({}),
}));
vi.mock('@/lib/apiSecurity', () => ({ SERVER_BASE_URL: '', secureFetch: vi.fn() }));

import { mapApiProfile, toListInput } from '@/services/apiListingService';

describe('mapApiProfile', () => {
  const now = Date.parse('2026-11-08T12:00:00Z');
  it('backend satırını UI modeline çevirir', () => {
    const p = mapApiProfile({
      id: 7, stageName: 'Ada', city: 'İstanbul', district: 'Kadıköy', age: 25,
      tier: 'gold', isVerifiedByAdmin: true, averageRating: '4.50', hourlyRate: 1500,
      lastActive: '2026-11-08T11:55:00Z',
    }, now);
    expect(p.displayName).toBe('Ada');
    expect(p.verificationStatus).toBe('verified');
    expect(p.rating).toBe(4.5);
    expect(p.isOnline).toBe(true);
    expect(p.rates).toEqual({ hourly: 1500, currency: 'TRY' });
    expect(p.avatarUrl).toMatch(/placeholder/);
  });
  it('15 dk üstü pasif profili çevrimdışı sayar, telefon alanı üretmez', () => {
    const p = mapApiProfile({ id: 1, stageName: 'B', city: 'Ankara', lastActive: '2026-11-08T10:00:00Z' }, now);
    expect(p.isOnline).toBe(false);
    expect(p.phoneNumber).toBeUndefined();
    expect(p.whatsappNumber).toBeUndefined();
  });
});

describe('toListInput', () => {
  it('UI sıralamasını backend sıralamasına çevirir', () => {
    expect(toListInput({ sortBy: 'price_asc' })).toMatchObject({ sortBy: 'hourlyRate', sortOrder: 'asc' });
    expect(toListInput({ sortBy: 'newest' })).toMatchObject({ sortBy: 'createdAt' });
  });
  it('backend dışı tier değerini düşürür, yaşı 18 altına indirmez', () => {
    const r = toListInput({ tier: 'diamond', minAge: 15, isVerified: true, district: 'Şişli' });
    expect(r.tier).toBeUndefined();
    expect(r.minAge).toBe(18);
    expect(r.verifiedOnly).toBe(true);
    expect(r.district).toBe('Şişli');
  });
});
