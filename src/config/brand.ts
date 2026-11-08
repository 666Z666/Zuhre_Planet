/**
 * Marka yapılandırması — TEK KAYNAK.
 *
 * Logo değiştiğinde yalnızca bu dosyadaki yolları ve public/brand/ altındaki
 * dosyaları güncellemek yeterlidir; Header, AgeGate, login sayfaları, favicon
 * ve PWA ikonları buradan beslenir.
 *
 * Renk paleti logo konseptlerinden türetildi: zümrüt gezegen, altın halka,
 * krem/fildişi zemin, mint/adaçayı saten.
 */
export const BRAND = {
  name: 'Zühre Planet',
  shortName: 'Zühre',
  tagline: 'Seçkin Yörünge',
  domain: 'zuhreplanet.com',
  assets: {
    /** Header ve küçük alanlar için vektör amblem (tema bağımsız) */
    emblem: '/brand/emblem.svg',
    /** Tam logo (figür + yazı) — hero / yaş doğrulama ekranı */
    heroLogo: '/brand/concepts/logo-concept-6.webp',
    /** Yatay logo — sosyal paylaşım görseli kaynağı */
    horizontalLogo: '/brand/concepts/logo-concept-1.webp',
    ogImage: '/og-image.jpg',
  },
  colors: {
    emerald: '#127a59',
    emeraldDeep: '#063d2c',
    emeraldNight: '#04140f',
    mint: '#a8e6cf',
    sage: '#cfe8d9',
    gold: '#d4af37',
    goldLight: '#f6e3a1',
    goldDeep: '#9c7a1e',
    cream: '#fbf7ee',
    ivory: '#f5efe1',
  },
} as const;

export type BrandColors = typeof BRAND.colors;
