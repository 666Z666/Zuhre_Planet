import { describe, it, expect, beforeAll } from 'vitest';
import { groupShared } from '../lib/safetySignals';
import { blindIndex } from '../lib/contactCrypto';

beforeAll(() => { process.env.CONTACT_ENC_KEY = 'c'.repeat(64); });

describe('groupShared', () => {
  it('farklı profillerde ortak anahtarı gruplar', () => {
    const g = groupShared([
      { key: 'A', profileId: 1 }, { key: 'A', profileId: 2 },
      { key: 'B', profileId: 3 },
    ]);
    expect(g).toEqual([{ profileIds: [1, 2] }]);
  });
  it('aynı profilin kendi tekrarını sinyal saymaz', () => {
    expect(groupShared([{ key: 'A', profileId: 1 }, { key: 'A', profileId: 1 }])).toEqual([]);
  });
  it('aynı profil kümesini tek grupta birleştirir, büyük grubu öne alır', () => {
    const g = groupShared([
      { key: 'tel', profileId: 1 }, { key: 'tel', profileId: 2 },
      { key: 'wa', profileId: 2 }, { key: 'wa', profileId: 1 },
      { key: 'x', profileId: 5 }, { key: 'x', profileId: 6 }, { key: 'x', profileId: 7 },
    ]);
    expect(g).toEqual([{ profileIds: [5, 6, 7] }, { profileIds: [1, 2] }]);
  });
});

describe('blindIndex', () => {
  it('aynı değer aynı özet; değer özette görünmez', () => {
    const a = blindIndex('phone', '+905321234567');
    expect(a).toBe(blindIndex('phone', '+905321234567'));
    expect(a).not.toContain('5321234567');
  });
  it('kapsamlar birbirine eşlenmez', () => {
    expect(blindIndex('phone', '1.2.3.4')).not.toBe(blindIndex('ip', '1.2.3.4'));
  });
});
