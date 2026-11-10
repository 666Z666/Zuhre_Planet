# Zühre Planet — İlk Kod Kalitesi ve Güvenlik Taraması

**Tarih:** 10 Kasım 2026  
**Kapsam:** `server/routers/escort.router.ts`, `server/routers/admin.router.ts`, `src/pages/EscortProfile.tsx`, `src/components/AgeGateOverlay.tsx`, `src/pages/App.tsx`, yapılandırma, README ve ilgili testler.  
**Yöntem:** İlk tur salt-okunur kod incelemesiydi ve normal terminal denemeleri ACL hatası verdi. Kullanıcının açık onayıyla tek seferlik erişim alınarak `npm ci --offline`, typecheck, test, build ve localhost önizlemesi çalıştırıldı; sonuçlar aşağıdadır. Statik bulgular, ayrıca belirtilmediği sürece çalışma anında tekrar üretildiği iddiası değildir.

## Öncelikli bulgular

| Öncelik | Bulgu ve kanıt | Önerilen doğrulama/düzeltme |
|---|---|---|
| **P0 — yayın öncesi** | **18+ yayın kuralı public sorgularda uygulanmıyor.** `schema.ts:74` yaş alanı nullable. `server/routers/escort.router.ts:80–105` tekil profil sorgusu, `:125–147` liste sorgusu yalnızca `visibilityStatus='public'` kontrol ediyor; yaşın en az 18 olmasını veya onay durumunu zorunlu tutmuyor. `admin.router.ts:472–483` ilanı doğrudan public yapıyor ve kayıtlı yaşı yeniden doğrulamıyor. API eşlemesi `apiListingService.ts:61` eksik yaşı `0` yapabiliyor. Eski/bozuk kayıt veya hatalı admin işlemi yetişkin olmayan ya da yaşı bilinmeyen profili yayımlayabilir. | Liste, slug/ID ve yayın mutasyonlarında tek bir `age >= 18` + uygun onay şartı uygula; geçersiz kayıtları yayından çıkar; testlerde yaşı `null`, 17, 18 olan kayıtları ve admin onayını kapsa. Önce mevcut veride geçersiz kayıt taraması yapılmalı. |
| **P1 — moderasyon** | **Reddedilen ilan public kalabilir.** `admin.router.ts:486–492` `rejectListing` yalnızca `verificationStatus='rejected'` yazar; görünürlüğü gizliye çevirmiyor. `escort.router.ts:85–88` ve `:133–136` public API yalnızca `visibilityStatus` kontrol ediyor. Önceden public olmuş bir ilan reddedilse bile public uçlardan servis edilmeye devam edebilir. | Reddetme işlemi görünürlüğü de kapatsın; public sorgular onay durumunu da kontrol etsin. API ve admin mutasyon testleriyle reddedilen profilin liste ve doğrudan bağlantıdan 404/sonuç dışı kaldığını kanıtla. |
| **P1 — veri doğruluğu** | **Admin KPI’ları gerçek olmayan değer gösterebilir.** `admin.router.ts:138` `activeNow` değerini rastgele üretir. `:121–131` gelir için şemada tanımlı olmayan ham `transactions` tablosunu sorgular ve her hatayı yutup `0` döndürür. Ödeme kararı belgelerde ertelenmiş (`docs/PROJE_HARITASI.md:58–60`). | “Şu an aktif” metriğini gerçek sorguya bağla veya kaldır/örnek diye işaretle. Gelir metriğini ödeme/işlem kaynağı ve tutarlı DB şeması oluşana kadar göstermeme; hata durumunu sessizce sıfırlama. |
| **P1 — performans** | **Yönetici listelerinde DB sayfalaması yok; raporlarda N+1 sorgu var.** `admin.router.ts:157–171`, `:222–228`, `:393–400` tüm kullanıcıları, ilanları/medyayı ve raporları yükleyip daha sonra bellekte arama/sayfalama yapıyor. Rapor başına `resolveReportTargetName` ek sorgu atıyor (`:402–404`, fonksiyon `:62–104`). Veri büyüdükçe yanıt süresi ve bellek kullanımı artar. | Arama/durum filtresi/sıralama, toplam sayımı ve limit-offset sayfalamasını SQL tarafına taşı; rapor hedef isimlerini toplu join/lookup ile getir. Büyük veri seti ve sorgu sayısı için test/ölçüm ekle. |
| **P1 — yanıltıcı içerik** | **Profilde olmayan değerler gerçekmiş gibi gösteriliyor.** `EscortProfile.tsx:354–358` eksik boy/kilo/ölçülere sabit `175/55/90/60/92` değerleri veriyor; `:381–384` saç, göz, dil ve vücut tipi için de varsayılan kişisel özellikler gösteriyor. Yanlış kullanıcı bilgisi üretir. | Bilinmeyen alanlarda “Belirtilmedi” göster veya alanı hiç çizme; tüm sabit kişisel özellik yedeklerini kaldır. Mock veriyi açıkça demo olarak ayır. |
| **P1 — SEO/ürün tutarlılığı** | **Profil SEO metni ve yapılandırılmış veri kanıtlanmamış iddialar içeriyor.** `EscortProfile.tsx:147–174` `gender: Female`, `price: 0`, `ratingValue: 5`, `reviewCount: 1` gibi yedek değerler üretiyor; `:176–184` “doğrulanmış”, saç rengi ve “randevu detayları” iddiaları kullanıyor. Proje haritası randevu/ödeme aracılığı yapılmadığını ve indekslemenin hukuki onay beklediğini belirtiyor (`docs/PROJE_HARITASI.md:56–60`). | Yalnızca gerçekten bulunan değerleri JSON-LD’ye koy; puan/fiyat yoksa alanı çıkar. Metni ürünün onaylı kapsamıyla eşleştir ve SEO açılmadan önce hukuki/ürün onayı al. |
| **P2 — kurulum** | **README’deki çalıştırma yönergeleri mevcut `package.json` ile uyuşmuyor.** README `npm run dev` için API+frontend, `dev:client`, `db:push`, port `3000` diyor (`README.md:79–99`). Gerçekte `dev` yalnız `vite`, `dev:server` ayrı, `db:push` ve `dev:client` tanımlı değil; API portu `4000` (`package.json:9–21`, `.env.example:9–22`, `vite.config.ts:14–23`). | README’yi `npm run dev` (5173) ve `npm run dev:server` (4000) olarak düzelt; DB için `db:migrate` ve yerel PostgreSQL gereksinimini açıkça yaz. Geliştirici başlangıç adımlarını temiz kurulumda dene. |
| **P2 — erişilebilirlik/dayanıklılık** | `AgeGateOverlay.tsx:16–25` `localStorage` okuma/yazmayı hatasız kabul ediyor; depolama kapalıysa yaş kapısı açılışı veya onay tıklaması hata verebilir. `role=dialog` var, fakat bu bileşende odak tuzağı görünmüyor. `App.tsx:139–154` çift Escape dinleyicisi bütün sayfada çalışıyor; metin alanı/dialog içindeki Escape kullanımı da 400 ms içinde ikinci basışta harici sayfaya yönlendirebilir. | Depolama erişimini try/catch ve bellek tabanlı oturum yedeğiyle ele al; gerçek modal odak yönetimini test et. Panic davranışında etkileşimli alanları ve modal durumlarını ele al; kısayol için erişilebilir açıklama ve test ekle. Yaş kapısının kendi başına yaş doğrulaması olmadığı ürün/hukuk ekibiyle netleştirilmeli. |

## Olumlu mevcut kontroller

- Public profil uçlarında alanlar açık allowlist ile seçiliyor; yorumlarda kimlik, `pendingData` ve doğrulama fotoğrafı public yanıta alınmıyor (`escort.router.ts:21–50`).
- Medya public profile yalnız onaylı ve public gizlilik seviyesindeyse ekleniyor (`escort.router.ts:89–94`).
- Yaş girdi şeması en az 18 şartı koyuyor ve bu kural için unit test var (`server/lib/listing.ts:47–60`, `server/__tests__/listing.test.ts:12–30`); sorun bunun public DB okuma ve admin yayınlama sınırında da uygulanmaması.
- Vite geliştirme sunucusu `127.0.0.1:5173` üzerinde, sıkı port kontrolüyle çalışacak şekilde yapılandırılmış (`vite.config.ts:14–23`).

## Önerilen iş sırası

1. Yaş/onay/görünürlük yayın kapısını sunucu okuma ve admin onay akışında kapat; mevcut veriyi güvenli biçimde kontrol et; test ekle.
2. Red sonrası yayından kaldırmayı garanti et ve admin moderasyon testlerini ekle.
3. Sahte admin metriklerini kaldır veya gerçek veri kaynağına bağla; admin listelerini veritabanında sayfalandır.
4. Profilde uydurma kişisel özellikleri ve JSON-LD varsayılanlarını kaldır; metinleri proje kapsamıyla uyumlu yap.
5. README yerel kurulum ve port talimatlarını düzelt; ardından erişilebilirlik/age-gate ve kalan lint/test bulgularını ele al.

## Doğrulama ve yerel çalıştırma notu

- İstenen komutlar: `npm run typecheck`, `npm run test:ci`, `npm run build`.
- Önizleme: Vite `npm run dev` ile `http://127.0.0.1:5173`; API ayrı olarak `npm run dev:server` ile `http://127.0.0.1:4000`.
- API başlangıcı `.env` veya eşdeğer `DATABASE_URL`, 32+ karakterli JWT secret'lar ve `CORS_ORIGINS` ister. API doğrulaması yapılırken yalnız localhost test veritabanı kullanılmalı; `.env` içeriği ve mevcut DB adresi incelenmedi. `npm run dev` tek başına frontend'i başlatır ve API proxy'si için 4000 portunda backend bekler.
- Normal terminal denemeleri ACL hatası verdi; kullanıcı onayıyla tek seferlik erişim sonrası komutlar çalıştırıldı. Test DB'si yalnızca localhost'a yönlendirildi; `.env` okunmadı ve Windows ACL'leri değiştirilmedi. Sonuçlar aşağıdadır.


## Çalıştırma sonuçları — 10 Kasım 2026

- Bağımlılıklar kilit dosyasından `npm ci --offline` ile kuruldu: 1.036 paket eklendi, 1.037 paket denetlendi, npm **0 bilinen güvenlik açığı** bildirdi. Ağ kullanılmadı. npm, 6 paketin kurulum betiğinin `allowScripts` kapsamında olmadığını belirtti; bunlar elle onaylanmadı.
- TypeScript: `npm run typecheck` — **çıkış kodu 0**.
- Birim testleri: `npm run test:ci` — **19 test dosyası, 115/115 test geçti**, başarısız test yok.
- Üretim derlemesi: `npm run build` — istemci ve sunucu derlemesi **çıkış kodu 0**. Vite, `Sparkles` chunk'ının **808,03 KB** küçültülmüş boyutla 600 KB uyarı eşiğini aştığını bildirdi; kod bölme önerisi sonraki performans işi olarak listelenmeli.
- Yerel önizleme: `npm run dev -- --host 127.0.0.1` — `http://127.0.0.1:5173/` adresi **HTTP 200** döndürdü; Vite oturumu açık bırakıldı. Önizleme mock ilan verisiyle frontend'dir. API sunucusu ve veritabanı başlatılmadı; API gerektiren ekran/işlemler bu kontrolde test edilmedi.
- İlk normal terminal denemeleri ACL hatası verdi; kullanıcı onaylı tek seferlik erişimle komutlar çalıştırıldı. Windows ACL'lerinde değişiklik yapılmadı. Lint ve görsel tarayıcı testi çalıştırılmadı.
