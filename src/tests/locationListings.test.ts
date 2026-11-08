import { describe, it, expect } from 'vitest';
import { slugOf, locationIndexable } from '@/pages/LocationListings';
import { TURKEY_LOCATIONS } from '@/data/locations';

describe('slugOf', () => {
  it('Türkçe adları veri dosyasıyla aynı slug kuralına çevirir', () => {
    expect(slugOf('İstanbul')).toBe('istanbul');
    expect(slugOf('Kadıköy')).toBe('kadikoy');
    expect(slugOf('Beşiktaş')).toBe('besiktas');
  });
  it('tüm şehir ve ilçe slugları veriyle tutarlı', () => {
    const mismatches = TURKEY_LOCATIONS.flatMap((c) => [
      ...(slugOf(c.name) === c.slug ? [] : [`${c.name}→${c.slug}`]),
      ...c.districts.filter((d) => slugOf(d.name) !== d.slug).map((d) => `${d.name}→${d.slug}`),
    ]);
    expect(mismatches).toEqual([]);
  });
});

describe('locationIndexable', () => {
  it('indeksleme kapalıysa asla indekslenmez', () => expect(locationIndexable(50, false)).toBe(false));
  it('az ilanlı sayfa indekslenmez', () => {
    expect(locationIndexable(2, true)).toBe(false);
    expect(locationIndexable(3, true)).toBe(true);
  });
});
