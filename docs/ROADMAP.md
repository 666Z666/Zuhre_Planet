# Zühre Planet — Yol Haritası ve Açık İşler

**Güncelleme:** 10 Kasım 2026 · Durum, teslim edilen kaynak ağacının incelemesine dayanır; production erişimi veya canlı kullanım kanıtı değildir.

## P0 — Yayın engelleri (ürün/uyum kararı olmadan başlatmayın)

- [ ] **Bağımsız hukuk incelemesi:** ürün sınırı, ilan modeli, ödeme, içerik, sorumluluk ve gerekli kayıt/başvuru yükümlülükleri için yazılı onay alın. Yeni işlevleri görüş öncesi yayına eklemeyin.
- [ ] **Yaş ve kimlik güvencesi:** UI yaşı öz-beyan ettiğini açıkça belirtir; buna rağmen mevzuat/risk modeline uygun, veri-minimizasyonlu gerçek age/identity assurance tasarlanmalı ve bypass, ret, itiraz, yeniden kontrol akışları belgelenmelidir.
- [ ] **Rıza ve sömürü önleme:** ilan sahibinin 18+ oluşu, içerik/iletişim üzerinde yetkisi ve yayın rızası için bağımsız süreç kurun; şüpheli/zorlanmış/üçüncü kişiye ait içerikte yayınlamama ve insan eskalasyonu tanımlayın.
- [ ] **Moderasyon operasyonu:** rapor alma, acil risk triajı, ilan/medya kaldırma, itiraz, olay kaydı, süre hedefi ve erişim yetkisini yazılı hale getirip test edin.
- [ ] **Veri koruma:** aydınlatma, saklama/silme, veri sahibi talepleri, tedarikçi/ülke aktarımı, yedekleme ve ihlal müdahalesi için hukuk/teknik onay alın.
- [ ] **Üretim erişimi ve secret:** secret manager, rotasyon, admin MFA/ayrıcalık en azlığı ve acil erişim prosedürünü doğrulayın.
- [ ] **İndeksleme:** yazılı hukuk/uyum, yaş güvencesi ve moderasyon onayı tamamlanana kadar `SEO_INDEXING=false`, `VITE_SEO_INDEXING=false` tutun.

**Kabul ölçütü:** her madde sahibini, kanıtını ve istisna/olay akışını içermeli; bu kanıtlar onaylanmadan public production yayını yok.

## P1 — Veri tabanı ve uçtan uca güvenlik

- [ ] Güncel Drizzle şemasını (`src/drizzle/schema.ts`) tüm migration'larla karşılaştırın; başlangıç migration'ının boş DB kurulumu, upgrade ve rollback provasını disposable test ortamında yapın. Production'da kör reset/push çalıştırmayın.
- [ ] Gerçek test DB'sinde `publicListingCondition` için public/private, onaysız/onaylı, 18 altı/18+, ret/gizleme kombinasyonlarını test edin; tüm public list/profile/location/sitemap/favorite/contact yollarının aynı kuralı kullandığını doğrulayın.
- [ ] Admin list/mutation için yetki, Zod validation, audit log, sayfalama, filtre ve çoklu rol senaryolarını API seviyesinde test edin.
- [ ] Medya ingest pipeline yoksa production upload kapalı olsun. Eklenecekse MIME/codec/metadata, malware/abuse tarama, özel depolama/signed URL, moderasyon öncesi gizlilik ve kaldırma/itiraz akışı şart.
- [x] No-op “Kanıtları Gör” rapor eylemi kaldırıldı; ayrı kanıt görüntüleme bu sürümde desteklenmediği açıkça belirtiliyor. Gelecekte eklenecekse güvenli hedef erişimi ve audit trail gerekir.
- [x] Admin kişisel veri export'u, kapsam ve denetim kaydı tanımlı olmadığı için devre dışı bırakıldı.
- [ ] Test ve production verisini kesin ayırın; seed/example şifreleri disposable test DB'si dışına çıkarmayın.
- [x] Yıkıcı `db:reset` öncesi development/test ortamı, açık `ALLOW_DB_RESET=true` ve loopback PostgreSQL hedefi doğrulanır; uzak/production hedefler reddedilir (12 saf unit testi; gerçek DB provası değildir).

**Tamamlanan bu tur:** public listing kapısı, age/panic testleri, admin null/unknown veri gösterimi ve filtre haritalaması, sayfalama, rapor hedefi N+1 iyileştirmesi ve yalnız açık yerel/test opt-in ile çalışan yıkıcı DB-reset guard'ı. Bunlar release onayı değildir.

## P2 — Sürekli entegrasyon, kod sağlığı ve performans

- [x] ESLint flat-config kapsamı tüm TS/TSX dosyalarını TypeScript parser ile işleyecek biçimde düzeltildi; repo genel lint taramasındaki parser ve kullanılmayan disable hataları giderildi.
- [ ] `npm run lint:strict` taraması (10 Kasım 2026 son ölçüm): 0 error, **61 warning** (ilk ölçüm 389); unused, `any`, console ve hook uyarılarını kaynakta düzeltip temiz sonuç alın.
- [ ] CI kurun: lockfile `npm ci`, check:docs, typecheck, unit, lint, build ve ayrı test DB E2E; merge koşullarına bağlayın.
- [ ] Admin filtre/mutation ve yayın kapısı için server/API integration testleri ekleyin; AgeGate/Panic unit testlerini koruyun.
- [ ] Son Vite build'de `Sparkles` chunk `808.03 kB` (gzip `218.62 kB`) `600 kB` eşiğini aşıyor. Chunk yalnız ana sayfanın lazy 3D sahnesiyle yüklenir (ilk yükte preload yok). 3D paketlerini `manualChunks`'a koymak onları her sayfada preload ettirir; bunun yerine 3D'yi düşük güçlü cihazda/azaltılmış harekette hiç yüklememe ve ölçülebilir LCP/INP/CLS bütçesi üzerinde çalışın.
- [ ] Riskli rotalar için privacy-safe audit/operational logging, rate limit, alert ve incident playbook sağlayın.

## P3 — Ürün/veri yetenekleri (P0 onayı ve kullanım senaryosu netleşince)

- [ ] Ödeme/üyelik modelini hukuk ve sağlayıcı kabulünden sonra seçin; webhook imza doğrulama, idempotency, iade/uyuşmazlık ve muhasebe olmadan tahsilat açmayın. SDK varlığı, ödeme özelliğinin hazır olduğu anlamına gelmez.
- [ ] E-posta, mesajlaşma, forum, bildirim ve rapor sayfalarını gerçek API'ye bağlayın veya demo olduğunu görünür biçimde belirtin; sahte başarı/şifreleme/online göstergesi üretmeyin.
- [ ] Arama/analitik için amaç, rıza/hukuki dayanak, saklama ve opt-out tasarlayın; toplamadan önce gizlilik incelemesi yapın.
- [ ] Trafik/rekabet analizi istenirse doğrulanmış domain ile Similarweb tahminlerini tarih, kaynak ve sınırlılıklarıyla belgeleyin; bu teslimde canlı domain/Similarweb ölçümü yok.

## P4 — Erişilebilirlik, içerik ve bakım

- [ ] Keyboard, screen reader, modal focus, contrast ve reduced-motion akışlarını CI'a ekleyin.
- [ ] TR/EN ve desteklenen diğer dil dosyalarının anahtar/parite denetimini otomatikleştirin.
- [ ] Rating, fiyat, doğrulanmışlık, online, şifreleme ve hizmet vaatlerini kanıt/kaynakla eşleyin; kanıtsız iddiayı çıkarın. Görsel maske yalnız preview ise bu durumu upload öncesi görünür tutun.
- [ ] README, harita, TODO, sürüm notu ve komutları `npm run check:docs` ile güncel tutun.

## Sonraki adımlar

1. Önce P0 hukuk/ürün/safety kapsamı ve sahiplerini netleştirin; alan adı yoksa Similarweb ölçümü başlatmayın.
2. Disposable PostgreSQL test ortamında migration karşılaştırması ve public listing gate integration testleri kurun.
3. Lint warning'leri ve ayrı DB E2E/CI kabul ölçütlerini sıfırdan doğrulayın.
4. Büyük chunk'ı küçültün; kullanıcı verisi export veya medya kanıtı görüntüleme gerekirse kapsam/izin/audit tasarımından sonra açın.
