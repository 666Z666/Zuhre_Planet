import { describe, it, expect } from 'vitest';
import { setRatesInputSchema, deriveHourlyRate, sortRates } from '../lib/rates';

describe('setRatesInputSchema', () => {
  it('geçerli tabloyu kabul eder', () => {
    expect(setRatesInputSchema.safeParse({ rates: [
      { durationMinutes: 60, location: 'own_place', price: 1500 },
      { durationMinutes: 60, location: 'visit', price: 2000 },
    ] }).success).toBe(true);
  });
  it('listede olmayan süreyi, sıfır/ondalık fiyatı ve tekrarı reddeder', () => {
    expect(setRatesInputSchema.safeParse({ rates: [{ durationMinutes: 45, location: 'visit', price: 100 }] }).success).toBe(false);
    expect(setRatesInputSchema.safeParse({ rates: [{ durationMinutes: 60, location: 'visit', price: 0 }] }).success).toBe(false);
    expect(setRatesInputSchema.safeParse({ rates: [{ durationMinutes: 60, location: 'visit', price: 10.5 }] }).success).toBe(false);
    expect(setRatesInputSchema.safeParse({ rates: [
      { durationMinutes: 60, location: 'visit', price: 100 },
      { durationMinutes: 60, location: 'visit', price: 200 },
    ] }).success).toBe(false);
  });
  it('boş tablo (fiyatları kaldırma) geçerli', () => {
    expect(setRatesInputSchema.safeParse({ rates: [] }).success).toBe(true);
  });
});

describe('deriveHourlyRate', () => {
  it('60 dk kendi yeri önceliklidir', () => {
    expect(deriveHourlyRate([
      { durationMinutes: 60, location: 'visit', price: 2000 },
      { durationMinutes: 60, location: 'own_place', price: 1500 },
    ])).toBe(1500);
  });
  it('60 dk yoksa en kısa sürenin saatlik karşılığı', () => {
    expect(deriveHourlyRate([{ durationMinutes: 30, location: 'visit', price: 900 }, { durationMinutes: 120, location: 'visit', price: 3000 }])).toBe(1800);
  });
  it('boşsa null', () => expect(deriveHourlyRate([])).toBeNull());
});

describe('sortRates', () => {
  it('süre artan, aynı sürede önce kendi yeri', () => {
    const s = sortRates([
      { durationMinutes: 120, location: 'visit', price: 1 },
      { durationMinutes: 60, location: 'visit', price: 1 },
      { durationMinutes: 60, location: 'own_place', price: 1 },
    ]);
    expect(s.map((r) => `${r.durationMinutes}:${r.location}`)).toEqual(['60:own_place', '60:visit', '120:visit']);
  });
});
