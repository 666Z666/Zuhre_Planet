# Zühre Planet — Ana Teknik Belge

**Güncelleme:** 10 Kasım 2026. Bu dosya mevcut source tree rehberidir; deploy, canlı veri, remote Git veya production onayı kanıtı değildir.

## Ürün çerçevesi

Yetişkin ilan/listeme uygulaması. Aracılık (randevu/buluşma/ödeme) kapsamını eklemeden önce hukuk/safety incelemesi yapılmalıdır. AgeGate yalnız öz-beyan; kimlik/yaş doğrulaması değildir. `server/lib/publicListing.ts` sunucu tarafı public ilan eligibility predicate'idir; teknik kontrol hukuki/operasyonel uyum sağlamaz.

## Mimari

- İstemci: React 18, TypeScript, Vite 5, Tailwind, wouter (`src/`).
- API: Express 5, tRPC, Zod (`server/`).
- Veri: PostgreSQL + Drizzle (`src/drizzle/schema.ts`, `drizzle/`, `scripts/`).
- Test: Vitest; Playwright E2E altyapısı (`src/tests/`, `server/__tests__/`, `tests/e2e/`).
- Repo talimatı/beceri: `AGENTS.md`, `.agent/skills/adult-marketplace-safety-engineering/`.

## Bu kalite turu

AgeGate storage/odak ve 18+ metnini, Panic Protocol bağlam koruması ve testlerini güçlendirdi. Profilde kaynaksız JSON-LD ve admin'de ölçülmeyen KPI'lar kaldırıldı. Admin filtre/istatistik/sayfalama sorguları iyileştirildi; kaynağı olmayan zaman, online, fiyat/priority null bilinmeyen değer olarak sunulur. Rapor hedefi N+1 iyileştirildi, fake “Kanıtları Gör” kaldırıldı, export privacy/audit kapsamı oluşana kadar kapalı. Face mask yalnız preview'dur; orijinal/yüklenen görseli anonimize etmez. `npm run check:docs` ve dokümantasyon güncellemeleri eklendi.

## Doğrulama ve sınırlar

Typecheck ve build başarılı; 22 Vitest dosyasında 134 test başarılı. Markdown npm script checker başarılı. ESLint strict sonucu 0 error/389 warning; `Sparkles` chunk 808.03 kB (gzip 218.62 kB) ve eşik üstü build uyarısı veriyor. Ayrılmış test PostgreSQL'i olmadığından Playwright/DB E2E ve migrasyon provası çalıştırılmadı. Canlı domain/Similarweb verisi yok.

Production hazır olduğu doğrulanmamıştır. Açık kapılar hukuk/kapsam, age/identity assurance, rıza/moderasyon, migration baseline, real DB integration, medya lifecycle, secret/MFA/backup/incident, lint/CI/E2E ve performance. Search indexing kapalı kalmalıdır.

## Operasyonel referanslar

- [Kurulum ve komutlar](./README.md)
- [Güncel mimari ve kod haritası](./docs/PROJE_HARITASI.md)
- [Öncelik/acceptance ve gelecek işler](./docs/ROADMAP.md)
- [Görev indeksi](./TODO.md)
