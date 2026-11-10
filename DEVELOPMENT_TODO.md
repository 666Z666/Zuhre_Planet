# Teknik İş Listesi — 10 Kasım 2026

Bu liste production hazırlığı kanıtı değildir. Öncelik ve kabul koşullarının tek kaynağı [docs/ROADMAP.md](./docs/ROADMAP.md).

## Bu kalite turunda tamamlananlar

- [x] Age gate fail-closed storage davranışı, odağı yönetme ve self-attestation açıklaması; 18 yaşını kapsayan metin/storage anahtarı.
- [x] Panic Protocol metin alanı, modal ve IME sırasında kısayolu engelliyor; regresyon testleri mevcut.
- [x] Profil yapılandırılmış verisinden kaynağı olmayan fiziksel özellik/fiyat/yorum/doğrulanmışlık değerlerini temizle.
- [x] Admin overview'dan ölçülmeyen gelir/aktif kullanıcı KPI'larını kaldır.
- [x] Admin filtre/status eşlemesi, BAD_REQUEST doğrulaması, sayfalama ve rapor hedefi N+1 iyileştirmesi.
- [x] Admin user/listing/review/report cevaplarında gerçek olmayan tarih/online/priority/fiyat alanlarını null olarak göster; favorite/contact sayaçlarını batch sorgula.
- [x] Face mask overlay'i veri anonymize eden güvenlik özelliği gibi sunma; kaynak/yüklenen görseli değiştirmediğini görünür açıkla.
- [x] No-op “Kanıtları Gör” rapor eylemini kaldır; kanıt görüntüleyici desteğinin olmadığını açıkla.
- [x] Admin kişisel veri export'u kapsam ve denetim kaydı belirlenene kadar devre dışı bırak.
- [x] ESLint flat config TS parser kapsamını bütün proje TS/TSX dosyalarına genişlet; strict lint'ten 2 parse/unused-directive hatasını gider (ilk lint baseline: 389 warning).
- [x] `npm run check:docs`, proje yerelinde yetişkin ilan güvenliği becerisi ve güncel kaynak haritası.
- [x] `db:reset` şema düşürmeden önce yalnız development/test + loopback PostgreSQL + açık `ALLOW_DB_RESET=true` koşullarını doğrular; 12 saf regresyon testi remote/production ve hatalı hedefleri kapsar.
- [x] Lint cleanup: doğrulanmış dead imports/locals kaldırıldı; admin filtre/API row, notification metadata, WebSocket, Scout action ve Button asChild sınırları güvenli tiplendi; regex/locale ve cookie preference erişilebilirliği düzeltildi (389 → 77 warning).

## Devam eden teknik işler

- [ ] Drizzle şemasıyla migrasyon zincirini disposable test DB'sinde karşılaştır; boş kurulum/upgrade/rollback provası yap.
- [ ] Disposable PostgreSQL hizmeti bulunduğunda migrasyon zincirini gerçek DB'de doğrula; bu makinede Docker/psql yoktu, henüz DB entegrasyon testi çalıştırılmadı.
- [ ] Admin mutasyonları ve `publicListingCondition` için gerçek DB/API integration testleri ekle.
- [ ] `npm run lint:strict` kalan 61 warning (10 Kasım 2026 son ölçüm; 0 error): unused-symbol/API-prop, explicit-any sözleşmeleri ve 1 generic hook dependency uyarısı. Kapatma/ignore yerine kaynağı doğrula; hook uyarısı `src/hooks/admin/useAdminBase.ts` çağrılarındaki sabit kullanım şekilleriyle ayrıca tasarlanmalı.
- [ ] CI: lockfile `npm ci`, check:docs, typecheck, unit, lint, build ve ayrı test DB E2E.
- [ ] Büyük bundle/performans bütçesi: `Sparkles` (three + @react-three) 808.03 kB, gzip 218.62 kB. Yalnız ana sayfanın lazy 3D sahnesiyle yüklenir; ilk yükte modulepreload edilmez. 3D paketlerini `manualChunks`'a koymayın — her sayfada önceden yüklenip ilk yükü ~860 kB artırır (Manus turu 4'te denendi, geri alındı).

## Yayın kapıları

- [ ] Hukuk, yaş/kimlik güvencesi, rıza, şikâyet/escalation, KVKK/veri saklama ve incident planı yazılı onay.
- [ ] Production secret manager, rotasyon, backup/restore, MFA, monitoring ve on-call.
- [ ] Media ingest/moderasyon/takedown ancak privacy-safe operasyon ve hukuk onayından sonra.
- [ ] Payment, chat, analytics veya SEO yalnız ürün/hukuk onayı ve uçtan uca test sonrası.
- [ ] Similarweb/traffic çalışması için doğrulanmış alan adı gerekir; bu teslimde ölçüm yapılmadı.

İlk sıradaki aksiyonlar ve kabul kriterleri: [Yol haritası](./docs/ROADMAP.md).
