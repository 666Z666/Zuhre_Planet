# Kalite Taraması Bulguları — Devam Eylem Planı

> **Durum:** Bu plan, 18+ yayın kapısı düzeltmesi hariç kalan kalite taraması işlerini sonraki geliştirici/AI için sıraya koyar. P0 yayın kapısı bu oturumda uygulanıyor; test ve typecheck sonuçları aşağıya eklenecek.

**Hedef:** Kalite taramasında kalan veri doğruluğu, ölçeklenebilirlik, kullanıcıya yanlış bilgi gösterimi, kurulum dokümantasyonu, erişilebilirlik/dayanıklılık ve derleme performansı bulgularını bağımsız ve doğrulanabilir iş paketleriyle kapatmak.

**Yaklaşım:** Her paket ayrı test döngüsüne ve kabul kriterine sahip. Önce güvenlik/veri doğruluğu ve kullanıcıya yanlış bilgi üreten davranışlar; sonra performans ve bakım kolaylığı ele alınır. Üretim veritabanında otomatik kayıt değiştirme, gizli `.env` okuma veya SEO indekslemeyi hukuki/ürün onayı olmadan açma kapsam dışıdır.

**Teknoloji:** TypeScript, Express/tRPC, Drizzle ORM, React/Vite, Vitest.

**Kaynak:** `docs/QUALITY_AUDIT_2026-11-10.md` ve `server/AGENTS.md`/kök `AGENTS.md` yönergeleri.

## Genel kısıtlar

- Public ilan için yaş en az 18, admin onayı ve `visibilityStatus='public'` birlikte gerekir.
- `npm run typecheck`, `npm run test:ci`, `npm run build` mevcut doğrulama kapılarıdır; değişiklik kapsamına göre lint ve ilgili e2e testi de çalıştırılır.
- `.env`, üretim DB'si ve gerçek sırlar okunmaz; veritabanı testi yalnız izole localhost test DB'siyle yapılır.
- `SEO_INDEXING=true` hukuki/ürün onayı verilene kadar etkinleştirilmez.
- Mevcut API yanıt şekli ve admin pagination sözleşmesi istemciyle uyumlu tutulur; değişirse ilgili hook ve bileşenler birlikte güncellenir.

## İnceleme odağı

1. KPI için sıfır satır, boş tablo ve DB hatası olduğunda arayüz “gerçek 0” ile “veri kullanılamıyor” durumunu ayırmalı.
2. Admin filtreleri, toplam sayım ve sayfa sınırlarında kayıt atlama/tekrar olmamalı; durum filtreleri bellekteki eski sonuçla aynı anlamı korumalı.
3. Profil alanı `null`, `0`, boş dizi, onaysız rozet, gerçek puansız/yorumsuz hâllerde gerçek olmayan özellik veya puan üretmemeli.
4. `localStorage` engelli/bozukken yaş kapısı sayfayı kilitlememeli; modal klavye odağı içinde kalmalı.
5. Escape kısayolu form girdileri veya modal açıkken istemsiz harici gezinmeye yol açmamalı; kısayolun erişilebilir ve test edilebilir açıklaması olmalı.
6. Bundle optimizasyonu mevcut route lazy-loading davranışını ve görsel sahne işlevlerini bozmamalı; büyük parça yalnız gerçekten gerektiğinde yüklenmeli.

---

## İş paketi A — Admin KPI doğruluğu

**Öncelik:** P1  
**Dosyalar:** `server/routers/admin.router.ts`, `src/hooks/useAdminData.ts`, `src/components/admin/tabs/OverviewTab.tsx` (veya gerçek Overview KPI kartının sahibi), ilgili testler.

### Adımlar

- [ ] `getPlatformStats` içindeki `activeNow` rastgele üretimini kaldır. Paylaşılan/kalıcı online oturum kaynağı mevcut değilse API'den `null`/“kullanılamıyor” dön ve kartı nötr açıklamayla göster; mevcutta gösterilen uydurma 10–59 değerlerini bırakma.
- [ ] Şemada tanımlı olmayan `transactions` tablosu için sessiz `catch => 0` davranışını kaldır. Ödeme/işlem kaynağı doğrulanana kadar aylık gelir değerini “henüz yapılandırılmadı” olarak sun; para birimi ve tarih aralığı veri kaynağıyla belgelenmeden KPI açma.
- [ ] Aktif ilan sayımında ortak yayın kapısı kullanıldığını doğrula; reddedilmiş/18 altı/yaşı null profiller sayılmamalı.
- [ ] Stats hook, UI ve API tiplerinde nullable/availability durumunu uçtan uca taşı.

**Kabul ölçütleri:** Rastgele sayı üreten kod yok; yapılandırılmamış gelir 0 TL gibi görünmüyor; gerçek aktif ilan sayısı yalnız yayın kapısını geçen kayıtları sayıyor. Bu durumlar için API veya yardımcı fonksiyon testleri ve KPI bileşen testi var.

---

## İş paketi B — Yönetici listelerinde DB sayfalaması ve rapor N+1

**Öncelik:** P1  
**Dosyalar:** `server/routers/admin.router.ts`, `src/hooks/useAdminData.ts`, `src/types/admin.ts`, admin liste bileşenleri ve router testleri.

### Adımlar

- [ ] `getUsers` için arama, rol ve durum filtrelerini SQL koşuluna taşı; `limit/offset` ve ayrı `count(*)` uygula. `banned`, `suspended`, `pending`, `active` durum önceliğini bugün kullanılan `getUserStatus` semantiğiyle eşleştir.
- [ ] `getListings` için durum/arama filtresini veritabanında uygula; listeleme için bütün medya kayıtlarını ve profilleri belleğe alma. Admin kartı için gereken sınırlı alanları ve gerekiyorsa ilk uygun medya kaydını getir.
- [ ] `getReviews` için görünürlük, arama ve ilişkili ad alanlarında DB tarafı sayfalama/toplam sayımını uygula; gerekli join'lerin duplicate satır oluşturmamasını güvenceye al.
- [ ] `getReports` için raporları durum ve sayfaya göre DB'den al. Hedef adını her kayıt için ayrı sorgulamak yerine targetType'a göre ID'leri gruplayıp toplu yükle/join et; arama davranışı korunamıyorsa sorgu sınırını açıkça belirle ve UI sözleşmesini değiştirmeden önce test ekle.
- [ ] Eski API sayfalama yanıtını (`items`, `total`, `page`, `limit`, `hasMore`, `totalPages`) koru.

**Kabul ölçütleri:** Her endpoint sorgu limitinden fazla satırı uygulama belleğine çekmiyor; aynı veri setinde sayfalar çakışmıyor/atlamıyor; filtrelenmiş toplam doğru; rapor başına DB sorgusu artmıyor. En az 101 fixture ile 1./2. sayfa ve status/search testleri, ayrıca hedef sorgu sayısı kontrolü bulunuyor.

---

## İş paketi C — Profilde uydurma fiziksel değerleri ve SEO varsayımlarını kaldır

**Öncelik:** P1  
**Dosyalar:** `src/pages/EscortProfile.tsx`, `src/services/apiListingService.ts` gerekirse, profil bileşen testleri ve JSON-LD testleri.

### Adımlar

- [ ] Boy, kilo, göğüs, bel ve kalçada sabit `175/55/90/60/92` yedeklerini kaldır. Değer yoksa alanı gizle veya yerelleştirilmiş “Belirtilmedi” göster.
- [ ] Saç/göz/dil/vücut için Sarışın/Mavi/Türkçe-İngilizce/Kıvrımlı varsayımlarını kaldır. Mock verinin demo kaynağı ile gerçek API verisini birbirinden ayır.
- [ ] JSON-LD'de hardcoded `gender`, `price: 0`, `ratingValue: 5`, `reviewCount: 1` alanlarını çıkar. Yalnız API'de gerçekten bulunan, pozitif ve anlamlı değerleri ekle; rating yoksa `aggregateRating` hiç üretme.
- [ ] SEO başlık/açıklamadaki “doğrulanmış”, hizmet, yaş/saç rengi ve “randevu” iddialarını gerçek alanlarla koşullandır. Ürün/hukuk onayı gelmeden indekslemeyi etkinleştirme ve schema.org iddialarını kamuya açma.
- [ ] `apiListingService` null/eksik yaş için `0` kullanıyorsa domain tipiyle uyumlu şekilde unknown değeri korumayı değerlendir; tüm kullanım yerlerinde hesaplama ve filtrelemeyi test et.

**Kabul ölçütleri:** Eksik profil alanı ekranda gerçek değer gibi görünmüyor; eksik ücret/yorum JSON-LD'ye sıfır/puan olarak yazılmıyor; onaysız profil “doğrulanmış” diye etiketlenmiyor. Testler null, boş dizi, sıfır rating ve gerçek dolu profil durumlarını kapsıyor.

---

## İş paketi D — README ve gerçek kurulum komutlarını eşitle

**Öncelik:** P2  
**Dosyalar:** `README.md`, gerekiyorsa `.env.example`, `docs/PROJE_HARITASI.md`.

### Adımlar

- [ ] README'den olmayan `db:push` ve `dev:client` komutlarını çıkar veya gerçekten gerekiyorsa package script ekle; tercihen mevcut `npm run db:migrate` ve `npm run dev`/`npm run dev:server` komutlarını kullan.
- [ ] Frontend `127.0.0.1:5173`, API `127.0.0.1:4000` olarak ayrı süreçlerle açıklansın; `npm run dev` yalnız Vite'ı başlatır ve API proxy'si backend bekler bilgisini ekle.
- [ ] PostgreSQL gereksinimini, zorunlu ortam değişkeni isimlerini, local-only örnek değerleri ve migrasyon sırasını `.env.example` ile tutarlı yaz. Gerçek anahtar veya çalışan kullanıcı parolası ekleme.
- [ ] `package.json` betik adlarıyla README kod bloklarını otomatik/manuel karşılaştır; temiz kurulumda başlangıç yönergesini uygula.

**Kabul ölçütleri:** Belgede listelenen her npm komutu `package.json`'da var; portlar yapılandırmayla tutarlı; README temiz bir geliştiricinin API'siz UI önizlemesini ve DB'li API geliştirmesini ayırt etmesini sağlıyor.

---

## İş paketi E — Age gate ve Panic Protocol dayanıklılık/erişilebilirlik

**Öncelik:** P2; Panic Protocol dış gezinme davranışı P1 güvenlik/mahremiyet etkisiyle ayrıca gözden geçirilsin.  
**Dosyalar:** `src/components/AgeGateOverlay.tsx`, `src/pages/App.tsx`, ilgili locale metinleri, component testleri.

### Adımlar

- [ ] `localStorage.getItem/setItem` try/catch ile güvenli hâle getir; depolama erişimi yoksa mevcut sekme belleğinde onay durumunu koru ve uygulamanın render/etkileşimini bozma.
- [ ] Yaş kapısını gerçek modal semantiğiyle kur: başlık ilişkisi, başlangıç odağı, Tab/Shift+Tab sınırı, kapatılabilirlik politikası ve onay sonrası mantıklı odak dönüşü. Mevcut `autoFocus` tek başına odak tuzağı değildir.
- [ ] Panic Protocol için form kontrolleri, contenteditable alanlar, modal/dialog açık durumu ve IME/klavye olayı ayrıntılarını ele al. Etkileşimli input'ta tek/çift Escape'in istemsiz harici gezinme üretmediğini test et.
- [ ] Kısayolu kullanıcıya erişilebilir biçimde tanıt; olay listener'ını komponent unmount'ında temizle ve yönlendirme testi ekle.
- [ ] “Evet, 18 yaşından büyüğüm” beyanının gerçek kimlik/yaş doğrulaması olmadığı ayrımını ürün notlarında açıkça tut; yalnız frontend kapısına güvenerek backend yaş yayın kapısını kaldırma.

**Kabul ölçütleri:** Storage API hata verse bile sayfa çalışır; klavye odağı modal dışına kaçmaz; Panic Protocol yalnız hedeflenen koşulda yönlendirir; ekran okuyucu anlamlı başlık ve düğme adlarını okur. Otomatik testlerin yanında klavye ile manuel smoke-test notu bulunur.

---

## İş paketi F — Büyük JavaScript chunk'ı ve ilk yük performansı

**Öncelik:** P2  
**Dosyalar:** `vite.config.ts`, `src/pages/Home.tsx` veya `Sparkles` bileşen/asset kaynağının gerçek yolu; ölçüm notu.

### Adımlar

- [ ] Bundle analyzer veya Vite manifest üzerinden 808 KB `Sparkles` chunk'ının gerçek modül girişini belirle; körlemesine `manualChunks` kuralı ekleme.
- [ ] Ağır animasyon/sahne içeriği ilk ekranda zorunlu değilse mevcut route lazy-loading sınırını koruyarak bileşeni dinamik yükle; gerçekten ortak vendor ise doğru vendor grubuna al.
- [ ] Önce/sonra gzip ve raw boyutları, ilk yüklenen chunk sayısı ve gerekli etkileşimlerin çalışmasını karşılaştır.
- [ ] Vite chunk eşiğini yalnız bilinçli bir bütçe kararıyla değiştir; uyarıyı gizleyerek performans sorununu çözülmüş sayma.

**Kabul ölçütleri:** Büyük chunk'ın kaynağı belgeli; ilk rota yükünde kullanılmayan ağır modül indirilmez veya ayrı gerekçeyle bütçeye alınır; üretim build başarılı; ana sayfa ve animasyon/sahne smoke-testleri geçer.

---

## Son kabul kapısı ve teslim sırası

- [ ] Paket A tamamlanınca ilgili API/UI testleri ve `npm run typecheck`.
- [ ] Paket B tamamlanınca hedeflenen router testleri, sorgu sayısı kontrolü ve 101+ kayıtlı pagination testi.
- [ ] Paket C tamamlanınca profil bileşeni/JSON-LD testleri.
- [ ] Paket D tamamlanınca README/package script tutarlılık kontrolü.
- [ ] Paket E tamamlanınca Vitest erişilebilirlik/key event testleri ve klavyeyle manuel kontrol.
- [ ] Paket F tamamlanınca `npm run build` önce/sonra bundle kanıtı.
- [ ] Tüm paketler sonunda `npm run lint:strict`, `npm run typecheck`, `npm run test:ci`, `npm run build`; `npm run test:e2e` yalnız izole localhost test DB'si hazırsa.
- [ ] `docs/QUALITY_AUDIT_2026-11-10.md` içinde her bulguyu `Açık / Düzeltildi / Kabul edildi` şeklinde durumlandır; doğrulanmayanları tamamlandı diye işaretleme.

## P0 yayın kapısı — bu turdaki değişiklik için takip

- [x] Regresyon testi uygulamadan önce çalıştırıldı ve beklenen import eksikliğiyle kırmızı sonuç verdi.
- [x] Yaş uygunluğu ve public SQL koşulunu merkezileştiren `server/lib/publicListing.ts` eklendi.
- [x] Public profil, liste, lokasyon sayımı ve sitemap aynı koşula bağlandı.
- [x] Admin onayı yaşı olmayan/18 altı profili reddediyor; DB update koşulu yaşı tekrar atomik biçimde kontrol ediyor.
- [x] Admin reddi görünürlüğü de kapatıyor; aktif ilan sayımı yalnız yayın koşulunu geçen profilleri sayıyor.
- [ ] Yeni regresyon testi, typecheck, tüm testler ve build tekrar çalıştırılıp gerçek çıkış kodları bu bölüme yazılacak.
