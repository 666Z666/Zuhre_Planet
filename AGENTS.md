# Repository Guidelines

Bu belge, Zühre Planet içinde çalışan geliştirici ve ajanlar için repo-yerel operasyon protokolüdür. Önce isteği netleştir, sonra kısa bir plan kur, ardından uygulamaya geç. Değişiklikleri repo sınırında tut; kişisel klasörlere, global araç ayarlarına veya makineye özel yollara dayanma. Çıktılar kısa, kanıta dayalı ve dosya/komut referanslı olmalı.

## Project Map

Ana uygulama `src/` altında yaşar. API ve tRPC akışı `server/` ile özellikle `server/routers/` içinde toplanır. Veritabanı şeması ve migration işleri `drizzle/` ve `src/drizzle/` altında durur. Uçtan uca senaryolar `tests/e2e/`, yardımcı otomasyonlar `scripts/`, kalıcı ürün dokümantasyonu `docs/` içindedir. Güncel bağlam için `docs/PROJE_HARITASI.md` kullan.

Etiketleri işin sınırını net tutmak için kullan:
- `frontend`: `src/pages`, `src/components`, `src/styles`
- `backend`: `server/`, `server/routers`
- `db`: `drizzle/`, `src/drizzle/`, `scripts/migrate.ts`
- `e2e`: `tests/e2e/*.spec.ts`
- `docs`: `docs/`, `README.md`
- `ops`: `Dockerfile`, `docker-compose.yml`, `vercel.json`, `netlify.toml`

## Yetişkin ilan güvenliği

`src/` veya `server/` içinde yaş beyanı/yaş kapısı, public ilan görünürlüğü, kimlik veya medya moderasyonu, iletişim mahremiyeti, raporlama/şikâyet, ödeme/aracılık, SEO/indeksleme veya release hazırlığını değiştirirken önce `.agent/skills/adult-marketplace-safety-engineering/SKILL.md` ve ilgili `references/zuhre-planet-profile.md` dosyasını okuyun. Kullanıcı öz-beyanını yaş doğrulaması gibi sunmayın. Hukuk/uyum ve operasyon kararı gerektiren başlıkları kendi başınıza “tamamlandı” saymayın; kanıt, varsayım ve blokajı ayırın.

## Commands

Yerel geliştirme için `npm run dev` ve API tarafı için `npm run dev:server` kullan. Üretim derlemesi `npm run build`, statik kontrol `npm run lint`, CI tipi birim testi `npm run test:ci`, uçtan uca akışlar `npm run test:e2e` ile çalışır. Veritabanı işleri için `npm run db:migrate` temel komuttur. `npm run db:reset` yıkıcıdır ve yalnız atılabilir local/test DB'de kullanılabilir. `npm run check:docs` README/roadmap komut referanslarını doğrular.

## Style And Tests

TypeScript `strict` modda çalışır. İçe aktarmalarda önce `@/*` alias yolunu tercih et. ESLint uyarıları görmezden gelinmez; sadece `_user`, `_error` gibi `_` önekli kullanılmayan değişkenler muaf kabul edilir. İsimlendirme repo ile uyumlu olmalı: `server/routers/auth.router.ts`, `src/hooks/admin/useAdminStats.ts` gibi.

Vitest dosyaları `src/**/*.{test,spec}.*`, Playwright dosyaları `tests/e2e/*.spec.ts` desenini izler. Kapsama hedefi en az `%70` çizgi/fonksiyon/dal/statement düzeyidir. İlgili lint veya test komutu çalıştırılmadan iş tamamlanmış sayılmaz.

## Delivery Rules

`.env` korunur; gerçek secret, token ve üretim anahtarı commit edilmez. Commit ve PR başlıkları mevcut geçmişe uygun olmalı: `feat: add loyalty webhook`, `fix: guard missing auth token`, `refactor: split admin router`. Özetler düşük gürültülü olsun; neyin değiştiği, hangi dosyada yapıldığı ve hangi komutla doğrulandığı açıkça yazılsın.
