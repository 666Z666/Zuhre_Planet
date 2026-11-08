import { describe, it, expect } from 'vitest';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import ru from '@/locales/ru.json';
import { translate } from '@/contexts/LanguageContext';

type Dict = { [k: string]: string | Dict };
const keys = (d: Dict, p = ''): string[] =>
  Object.entries(d).flatMap(([k, v]) => (typeof v === 'string' ? [`${p}${k}`] : keys(v, `${p}${k}.`)));
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const get = (d: Dict, path: string) => path.split('.').reduce<string | Dict>((a, k) => (a as Dict)[k], d) as string;

describe('dil dosyaları', () => {
  const base = keys(tr as Dict).sort();
  it.each([['en', en], ['ar', ar], ['ru', ru]] as const)('%s: TR ile aynı anahtarlar', (_c, d) => {
    expect(keys(d as Dict).sort()).toEqual(base);
  });
  it.each([['en', en], ['ar', ar], ['ru', ru]] as const)('%s: yer tutucular TR ile aynı', (_c, d) => {
    for (const k of base) expect(placeholders(get(d as Dict, k))).toEqual(placeholders(get(tr as Dict, k)));
  });
});

describe('translate', () => {
  it('değişken doldurur', () => {
    expect(translate('tr', 'location.active', { count: 12 })).toBe('12 aktif ilan');
    expect(translate('ru', 'rates.hours', { n: 2 })).toBe('2 ч');
  });
  it('eksik anahtarda Türkçeye, o da yoksa anahtara düşer', () => {
    expect(translate('en', 'yok.boyle.anahtar')).toBe('yok.boyle.anahtar');
  });
});
