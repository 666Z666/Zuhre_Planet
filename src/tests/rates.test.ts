import { describe, it, expect, vi } from 'vitest';
vi.mock('@/lib/trpc', () => ({ trpc: {} }));
import { gridToRates } from '@/components/rates/RatesEditorCard';
import { durationLabel } from '@/components/rates/RateTable';

describe('gridToRates', () => {
  it('boş hücreleri atlar, "1.500" gibi yazımı kabul eder', () => {
    const r = gridToRates({ '60:own_place': '1.500', '60:visit': '', '120:visit': '3000' });
    expect(r).toEqual({ rates: [
      { durationMinutes: 60, location: 'own_place', price: 1500 },
      { durationMinutes: 120, location: 'visit', price: 3000 },
    ] });
  });
  it('sıfırı reddeder', () => {
    expect('error' in gridToRates({ '60:visit': '0' })).toBe(true);
  });
});

describe('durationLabel', () => {
  it('etiketler', () => {
    expect(durationLabel(30)).toBe('30 dk');
    expect(durationLabel(90)).toBe('1 sa 30 dk');
    expect(durationLabel(120)).toBe('2 saat');
    expect(durationLabel(1440)).toBe('1 gün');
  });
});
