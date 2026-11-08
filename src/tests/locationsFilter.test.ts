import { describe, it, expect } from 'vitest';
import { resolveCityName, resolveDistrictName, sameLocation } from '@/data/locations';
import { MockListingService } from '@/services/listingService';

describe('konum çözümleme', () => {
  it('slug → isim (Türkçe karakterli)', () => {
    expect(resolveCityName('istanbul')).toBe('İstanbul');
    expect(resolveCityName('İSTANBUL')).toBe('İstanbul');
    expect(resolveCityName(undefined)).toBeUndefined();
  });
  it('ilçe slug → isim', () => {
    const name = resolveDistrictName('istanbul', 'kadikoy');
    expect(name && name.toLocaleLowerCase('tr-TR')).toBe('kadıköy');
  });
  it('sameLocation büyük/küçük harf ve İ/i duyarsız', () => {
    expect(sameLocation('İstanbul', 'istanbul')).toBe(true);
    expect(sameLocation('Ankara', 'İzmir')).toBe(false);
  });
});

describe('MockListingService filtreleri', () => {
  const svc = new MockListingService();
  it('filtresiz tüm demo ilanları döner', async () => {
    expect((await svc.getListings()).length).toBeGreaterThan(0);
  });
  it('yaş alt sınırı uygulanır', async () => {
    const all = await svc.getListings();
    const maxAge = Math.max(...all.map((l) => l.age));
    const r = await svc.getListings({ minAge: maxAge + 1 });
    expect(r).toHaveLength(0);
  });
  it('şehir filtresi Türkçe büyük harfe duyarsız', async () => {
    const r = await svc.getListings({ city: 'İSTANBUL' });
    expect(r.every((l) => l.city.toLocaleLowerCase('tr-TR') === 'istanbul')).toBe(true);
  });
});
