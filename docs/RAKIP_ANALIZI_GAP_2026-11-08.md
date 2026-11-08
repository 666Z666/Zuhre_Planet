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
1. **Katalog hâlâ mock** — `listingService` → `trpc.escort.list` + yeni filtreler + `locationStats` (TODO §7). En büyük etki burada.
2. **Telefon maskeleme + WhatsApp yönlendirme** (E.1 "Türkiye'de hiç yok") — şemada telefon alanı yok. Öneri: `escort_contacts` tablosu (şifreli), `/go/:slug/whatsapp` yönlendirmesi + tıklama sayacı (sağlayıcı istatistiği de buradan beslenir).
3. **"Şu an müsait" rozeti** — `available_until timestamp` kolonu + migration; filtre ve sıralamaya ek.
4. **İlçe sayfaları** — `/:city/:district` rotası, `locationStats.indexable=false` ise `noindex`; `ItemList` JSON-LD, sitemap'e yalnız indekslenebilir sayfalar.
5. **Ajans paneli** — çoklu profil yönetimi (`agencies` tablosu, `escort_profiles.agency_id`). Raporlara göre arzın büyük kısmı ajanslarda.
6. **Fiyat tablosu** — tek `hourlyRate` yerine süre/incall-outcall satırları (`escort_rates`).
7. **i18n bağlantısı** — `src/locales` var ama `useTranslation` hiçbir yerde kullanılmıyor; RU dosyası yok; `hreflang`.
8. **Ödeme** — raporlar kart altyapısının bu dikeyde kapalı olduğunu söylüyor; iyzico kodu (`src/lib/payment`) büyük ihtimalle onaylanmayacak → havale/EFT eşleştirme + kripto akışı ayrıca değerlendirilmeli. **Hukuki/ödeme kararı Kaptan'da ve avukatta.**
9. **Yorum sistemi riski** — raporlar ilk 6 ay yorumları kapalı tutmayı öneriyor; mevcut public yorumlar için karar gerekli.

## Not
Raporlardaki hukuki değerlendirmeler (TCK m.227, 6493) avukat görüşü değildir; yayın öncesi Türk ceza/vergi hukukçusuyla teyit edilmeli. `robots: noindex` bu yüzden açık kalıyor.
