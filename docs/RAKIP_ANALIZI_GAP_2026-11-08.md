# Rakip Analizi → Zühre Planet Gap Listesi (8 Kasım 2026)

Kaynaklar: `escort-dizin-pazar-analizi.md` (16 Eki 2026), `turkiye-odakli-yurutme-plani.md` (17 Eki 2026), `escort-directory-gap-analysis.md`.
Dal: `gelistirme/rakip-analizi` (yerel, push edilmedi).

## Bu turda yapılanlar (backend)
| Öneri (rapor bölümü) | Yapılan |
|---|---|
| Çok kriterli filtre (E.1, gap §3) | `escort.list`: `district`, `verifiedOnly`, `minPrice/maxPrice`, `minAge/maxAge` eklendi; ters aralıklar reddedilir |
| Doğrulama satın alınamaz (F.2) | Sıralama: **doğrulanmış → boost → seçilen sıralama**. Eskiden boost her şeyin önündeydi |
| Yaş kapısı 18+ (G.1, gap §7) | `updateProfile` yaşı 18–99 tam sayı ile sınırlıyor (önceden herhangi bir sayı geçiyordu). Admin onayında bekleyen veri **yeniden doğrulanıyor** |
| Ölçülü metin alanları | bio 500, biography 5000, slogan 120 karakter sınırı |
| İlçe SEO + "boş sayfa indekslenmez" (D.3) | Yeni `escort.locationStats`: şehir/ilçe başına canlı ve doğrulanmış ilan sayısı + `indexable` (≥3 ilan) |
| `hourlyRate` güncellenebilir | Profil güncellemesine fiyat eklendi (admin onaylı) |

Kod: `server/lib/listing.ts`, `server/routers/escort.router.ts`, `server/routers/admin.router.ts`; testler `server/__tests__/listing.test.ts` (12 yeni test).
Doğrulama: `typecheck` 0 hata · `vitest` 38/38 · `build:server` ✅.

## Zaten var olanlar
Yaş kapısı (`AgeGateOverlay`), şikâyet diyaloğu (`ReportEscortDialog`) + admin raporlar sekmesi, medya onay kuyruğu, harita görünümü (`MapListing`), iletişim kilidi (`ContactLock`), TR/EN/AR dil dosyaları (`src/locales`, henüz bağlı değil), ajans sayfası (statik), tier/boost/sadakat çarpanı.

## Kalan önemli boşluklar (öncelik sırasıyla)
1. ~~Katalog mock~~ → **2. tur:** `ApiListingService` (`VITE_LISTING_SOURCE=api`), `escort.getById`, Katalog URL filtrelerini sunucuya iletiyor, istemci sıralaması da doğrulanmış > boost > tier. Kalan: EscortProfile'ın galeri/yorum alanlarını API şekline uyarlamak, filtre paneline ilçe/fiyat/yaş/doğrulanmış kontrolleri.
2. ~~Telefon maskeleme + WhatsApp~~ → **4. tur:** `escort_contacts` (AES-256-GCM, `CONTACT_ENC_KEY`) + `contact_clicks` (IP/kişi verisi yok), migration `0001_contact_masking`. `contact.setMine` (numara → admin onayına), `contact.getMine` (maskeli + 30 gün tıklama), `contact.reveal` (tıklamada bağlantı, IP başına 30/10 dk ve profil başına 5/10 dk sınır), `contact.listPending/review` (denetim kaydı). UI: profil düzenleyicide numara kartı, admin onay kuyruğunda numara onayları, profil sayfası düğmeleri sunucudan açıyor.
   - Not: `0000` migration mevcut şemanın gerisinde (önceden kalma sapma); temiz DB kurulumundan önce `drizzle-kit generate` ile yeniden üretilmeli.
3. **"Şu an müsait" rozeti** — `available_until timestamp` kolonu + migration; filtre ve sıralamaya ek.
4. **İlçe sayfaları** — `/:city/:district` rotası, `locationStats.indexable=false` ise `noindex`; `ItemList` JSON-LD, sitemap'e yalnız indekslenebilir sayfalar.
5. **Ajans paneli** — çoklu profil yönetimi (`agencies` tablosu, `escort_profiles.agency_id`). Raporlara göre arzın büyük kısmı ajanslarda.
6. **Fiyat tablosu** — tek `hourlyRate` yerine süre/incall-outcall satırları (`escort_rates`).
7. **i18n bağlantısı** — `src/locales` var ama `useTranslation` hiçbir yerde kullanılmıyor; RU dosyası yok; `hreflang`.
8. **Ödeme** — raporlar kart altyapısının bu dikeyde kapalı olduğunu söylüyor; iyzico kodu (`src/lib/payment`) büyük ihtimalle onaylanmayacak → havale/EFT eşleştirme + kripto akışı ayrıca değerlendirilmeli. **Hukuki/ödeme kararı Kaptan'da ve avukatta.**
9. **Yorum sistemi riski** — raporlar ilk 6 ay yorumları kapalı tutmayı öneriyor; mevcut public yorumlar için karar gerekli.

## Not
Raporlardaki hukuki değerlendirmeler (TCK m.227, 6493) avukat görüşü değildir; yayın öncesi Türk ceza/vergi hukukçusuyla teyit edilmeli. `robots: noindex` bu yüzden açık kalıyor.

## Hukuki/operasyonel araştırma (2. tur, 8 Kasım 2026)
- **Erişim engeli riski (5651 m.8):** fuhuşla bağlantılı içerikte karar kural olarak sulh ceza hâkimliğinden çıkar; gecikmede sakınca varsa savcı. Kaynaklar, yalnız yetişkin içeriğin yetmediğini, fuhşa teşvik/aracılıkla somut bağın gerektiğini belirtiyor. Kararlar itiraz edilebilir. → Ürün dili, kategori ve moderasyon bu bağı kurmayacak şekilde tasarlanmalı; içerik kaldırma bildirimine hızlı yanıt süreci (yer sağlayıcı yükümlülüğü, m.5) yazılı olmalı.
- **Engelleme pratiği:** 2025–2026'da flört/sohbet ve LGBTİ+ uygulamalarına toplu erişim engelleri getirildi (ör. 20 Ağu 2025, 29 uygulama; 2 Tem 2026). Alan adı engeli gerçek bir operasyonel risk; bir karar gelirse doğru yol itiraz ve hukuki süreçtir (engeli dolanmak için ayna alan adı açmak ayrı bir hukuki sorun yaratır).
- **KVKK:** cinsel hayata ilişkin veriler özel nitelikli. Yurt dışına aktarım 1 Eyl 2024'ten beri açık rızayla değil standart sözleşme + bildirimle yapılıyor; bildirim yapmamanın 2026 idari para cezası 90.308–1.806.377 TL. Yurt dışı hosting kararı (yürütme planı §1) bu yükümlülüğü doğurur. Kimlik/doğrulama fotoğrafları şifreli ve ayrı saklanmalı (zaten public uçlardan dönmüyor).
- Kaynaklar: mihci.av.tr ve harbiyehukuk.com "Fuhuş Sitelerine Erişimin Engellenmesi", kadimhukuk.com.tr "Erişimin Engellenmesi ve İçerik Kaldırma", tamindir.com ve bianet.org erişim engeli haberleri, kvkk.gov.tr Standart Sözleşmeler, gun.av.tr KVKK 2026 notu. Hepsi avukatla teyit edilmeli.

## Rakip sitelerin canlı taraması
Yapılmadı: arama aracı belirli şehirlerdeki escort ilan sitelerini listelemeyi reddediyor; bu sınırı aşacak şekilde (tarayıcı vb.) tarama yapılmadı. Mevcut saha gözlemi kaynak raporların B.3 bölümündedir.
