# Zühre Planet — Proje Haritası

**Güncelleme:** 10 Kasım 2026 · **Kaynak:** teslim edilen `kaynak/` çalışma ağacı  
**Durum:** yerel geliştirme/inceleme sürüyor; production yayınına hazır olduğu doğrulanmadı. Aktif `.git`/remote bulunmadığından branch/commit iddiası bu çalışma ağacında doğrulanmadı.

## Ürün ve güvenlik sınırı

Zühre Planet yetişkin ilan/listeme iş akışıdır. Randevu/rezervasyon, buluşma ayarlama, para tahsil etme veya başka aracılık işlevlerini eklemeden önce hukuk ve güvenlik değerlendirmesi gerekir. `AgeGateOverlay` self-attestation'dır; kimlik veya yaş doğrulaması değildir. Ortak server-side ilan kapısı public visibility, moderation/admin onayı ve `age >= 18` koşullarını kullanır. Teknik kapı işletme/hukuk yükümlülüklerini kaldırmaz. Hukuk, gerçek yaş güvencesi, rıza/moderasyon, veri koruma ve olay müdahalesi onaylanmadan production/SEO açılmamalıdır.

## Mimari

| Katman | Uygulama |
|---|---|
| İstemci | React 18, TypeScript, Vite 5, Tailwind, wouter (`src/`) |
| API | Node.js, Express 5, tRPC, Zod (`server/`) |
| Veri | PostgreSQL + Drizzle (`src/drizzle/schema.ts`, `drizzle/`, `scripts/`) |
| Yayın koşulu | `server/lib/publicListing.ts` — public sorgulardaki ortak eligibility predicate |
| Test | Vitest (`src/tests`, `server/__tests__`); Playwright altyapısı `tests/e2e/` |
| Operasyon/belge | `AGENTS.md`, `README.md`, `docs/`, Docker/hosting ayarları |
| Güvenlik becerisi | `.agent/skills/adult-marketplace-safety-engineering/` |

## Kodda başlangıç noktaları

`src/pages/App.tsx` route/provider; `src/components/AgeGateOverlay.tsx` self-attestation; `src/lib/panicProtocol.ts` panic-shortcut eligibility; `src/pages/EscortProfile.tsx` public profile/JSON-LD; `src/pages/AdminDashboard.tsx` admin ekranı; `src/components/admin/tabs/` moderasyon UI; `src/hooks/useAdminData.ts` admin API client; `src/types/admin.ts` veri sözleşmeleri. Sunucu tarafında `server/server.ts`, `server/router.ts`, `server/routers/admin.router.ts`, `server/routers/escort.router.ts`, `server/lib/publicListing.ts` ve `src/drizzle/schema.ts` temel referanslardır.

## Bu turda tamamlanan bakım

Age gate storage hatasına dayanır, klavye odağını yönetir, 18 yaşını dahil eder ve öz-beyan olduğunu söyler. Panic kısayolu yazı alanı, modal ve IME'de tetiklenmez. Profil JSON-LD'sinden kaynaksız alanlar temizlenmiştir. Admin'de ölçülmeyen KPI'lar kaldırılmış; listeler UI filtreleriyle eşlenmiş, BAD_REQUEST doğrulaması, sayfalama ve batch sayımla N+1 azaltılmıştır. Gerçekte bulunmayan timestamp/online/fiyat/priority değerleri unknown/null'dır. Admin export, kapsam ve audit kaydı yokken devre dışıdır; no-op “Kanıtları Gör” kaldırılmıştır. Face mask overlay kaynak/yüklenen görseli anonimleştirmez; UI bunu açıkça belirtir.

`scripts/migrate.ts reset` artık `public` şemasını düşürmeden önce `NODE_ENV=development|test`, açık `ALLOW_DB_RESET=true` ve PostgreSQL loopback hedefini zorunlu kılar (`server/lib/databaseResetSafety.ts`). Bu, yanlış hedef riskini azaltır; atılabilir yerel DB şartını ortadan kaldırmaz ve canlı PostgreSQL entegrasyon provası değildir.

## Doğrulama (10 Kasım 2026)

TypeScript typecheck ve `npm run check:docs` başarılı; Vitest 23 dosya/146 test başarılı. Client/server production build başarılı; Vite `Sparkles` chunk'ı 808.03 kB (gzip 218.62 kB) ile 600 kB uyarı eşiğini aşar. Repo genel ESLint: 0 error, 389 warning; değişen reset/helper/test TypeScript dosyalarının hedefli lint'i temiz. 12 yeni DB-reset safety unit testi geçmiştir. PostgreSQL/DB integration, E2E ve migration provası çalıştırılmadı (makinede Docker/psql yok); production DB'ye dokunulmadı. Komutlar Windows yerel çalışma ağacında 10 Kasım 2026'da çalıştırıldı.

## Halen açık yayın kapıları

Bağımsız hukuk/ürün incelemesi; gerçek yaş/kimlik güvencesi ve rıza; insan moderasyonu/takedown/appeal; KVKK ve veri saklama/ihlâl planı; Drizzle başlangıç migrasyonlarının test DB'sinde sıfırdan kurulum/upgrade/rollback provası; admin ve publicListing integration testleri; medya ingest lifecycle; production secret/MFA/backup/monitoring/incident; CI/E2E ve lint warning temizliği; büyük chunk optimizasyonu. Doğrulanmış production domain/Similarweb ölçümü yoktur.

Öncelik/acceptance: [ROADMAP.md](./ROADMAP.md). Kurulum/komutlar: [README.md](../README.md). Görev indeksi: [TODO.md](../TODO.md).
