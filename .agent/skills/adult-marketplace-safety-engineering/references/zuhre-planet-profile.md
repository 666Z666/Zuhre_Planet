# Zühre Planet — Beceriye Özel Proje Profili

Bu referans başlangıç noktasıdır; her görevde aktif checkout üzerinde yeniden doğrula. Geçerli proje haritası `docs/PROJE_HARITASI.md`, açık işler `docs/ROADMAP.md` içindedir.

## Ürün ve güvenlik sınırları

- Türkiye odaklı yetişkin ilan/listeme iş akışı. Rezervasyon, buluşma, randevu, konaklama, ajans veya ödeme aracılığı kapsamını yeni hukuk/ürün kararı olmadan ekleme.
- `server/lib/publicListing.ts` ortak public yayın koşuludur; aktif kaynakta `visibilityStatus='public'`, moderation/admin approval ve yaş `>=18` gerekliliklerini yeniden doğrula. Tüm public list/id/slug/count/sitemap/favorite/contact yüzeylerinde aynı kuralı kullan.
- `AgeGateOverlay` kullanıcı öz-beyanıdır, kimlik/yaş doğrulaması değildir. Gerçek yaş güvencesi ve mevzuat gereklilikleri release blocker olarak ele alınır.
- SEO index varsayılanı kapalı tutulur; hukuk, ürün, yaş güvencesi, moderasyon ve veri koruma onayı olmadan açma.
- Telefon/WhatsApp verisini public HTML/API'de veya loglarda gösterme; şifreleme anahtarlarını secret manager'da yönet ve yedekleme/rotasyon planını doğrula.

## Hızlı kod haritası

- UI/route: `src/pages/App.tsx`, `src/pages/`, `src/components/`.
- API: `server/server.ts`, `server/router.ts`, `server/routers/*.router.ts`.
- İş kuralları: `server/lib/`, özellikle `publicListing.ts`.
- DB: `src/drizzle/schema.ts`, migrasyonlar `drizzle/`.
- Testler: `src/tests/`, `server/__tests__/`, Playwright `tests/e2e/`.
- Dokümantasyon denetleyici: `scripts/check-doc-commands.mjs`; npm komutu: `npm run check:docs`.
- Yerel UI: `npm run dev` → `127.0.0.1:5173`; API: `npm run dev:server` → `.env` varsayılan PORT `4000`; API için PostgreSQL ve `.env` gerekir.

## Açık yayın engelleri

Hukuk/ürün onayı; gerçek yaş/kimlik güvencesi; rıza, media review/takedown/appeal operasyonu; kişisel veri saklama/ihlal planı; migrasyon başlangıç şemasının güncel Drizzle modeliyle sınanması; gerçek DB'de yayın kapısı/admin integration testleri; admin evidence view; media upload lifecycle; production secrets/MFA/backup/monitoring; lint/CI/E2E. Canlı site alan adı veya Similarweb trafik ölçümü bu teslimde doğrulanmadı.

## Belge önceliği

`AGENTS.md` ve çalışan kod > tarihli audit/plan > güncel `docs/PROJE_HARITASI.md`/`docs/ROADMAP.md` > README > eski roadmap/TODO. Çelişki bulunursa kullanıcıya raporla; eski özellik veya release iddiasını sessizce tekrarlama.

## Temel doğrulama

`npm run typecheck`, `npm run test:ci`, `npm run check:docs`, `npm run build`; `npm run lint:strict` sonucunu ayrıca kaydet. E2E yalnız ayrılmış disposable test DB'sinde çalıştırılır; audit sırasında production DB'ye bağlanma veya migration yapma.
