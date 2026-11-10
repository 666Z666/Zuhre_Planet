# Zühre Planet - Geliştirme Görev Takip (TODO)

Bu dosya, projenin geri kalan geliştirmelerinin düzenli bir şekilde yapılabilmesi için oluşturulmuştur. Görevleri tamamladıkça kutucukları işaretleyiniz (`[x]`).

## 1. Marka Teması — "Zümrüt & Altın" (logo konseptlerinden) ✅
> Eski "Deep Space / Ice & Frost" ve "Velvet Eclipse" yönleri, logo konseptleri doğrultusunda tek bir marka temasında birleştirildi.
- [x] `UniverseScene` tüm sayfaların arkasında (`BackgroundScene`): lazy chunk, `prefers-reduced-motion`, WebGL / veri tasarrufu kontrolü, açık modda statik gradyan.
- [x] Stil dosyaları tek kaynakta: `src/styles/brand.css` (+ `index.css`). Eski 7 parça dosya kaldırıldı.
- [x] Koyu mod: **Zümrüt Gece** paleti (varsayılan).
- [x] Açık mod: **Krem & Zümrüt** paleti (token'lar hazır).
- [x] `.glass-card-sm`, `.card-cosmic`, `.text-3d-premium`, `.text-3d-gold` sınıfları tanımlandı ve kullanımda.
- [x] Marka tek kaynak: `src/config/brand.ts` + `src/components/brand/Logo.tsx`, favicon / PWA ikonları / OG görseli.
- [ ] Açık mod: sayfalardaki sabit `text-white` / `bg-black` sınıflarının (≈3000 adet, 172 dosya) token'lara taşınması.
- [ ] Nihai logo seçimi → `BRAND.assets` güncellemesi (konseptler: `/brand-identity`).

## 2. Eksik Sayfaların Tamamlanması
### 2.1. Kimlik Doğrulama (Auth) Sayfaları
- [x] `src/pages/auth/CustomerLogin.tsx` sayfasını kozmik temaya uygun tasarla. ✅ **Tamamlandı** - Glassmorphism, animasyonlar, marka paleti
- [x] `src/pages/auth/EscortLogin.tsx` sayfasını kozmik temaya uygun tasarla. ✅ **Tamamlandı** - Premium tasarım, marka paleti, Crown ikonu
- [x] `src/pages/auth/AdminLogin.tsx` sayfasını kozmik temaya uygun tasarla. ✅ **Tamamlandı** - Zümrüt & Altın, marka amblemi, yönetim konsolu vurgusu

### 2.2. Müşteri Paneli (`src/pages/customer/`)
- [x] `CustomerDashboard.tsx` alt sekmelerini tamamla (Routing veya Tab yapısı ile). ✅ **Mevcut**
- [x] `CustomerFavorites.tsx`: `mockEscorts` verileri ile doldurulmuş, çalışan bir UI yap. ✅ **Tamamlandı** - Grid layout, silme işlevi, mock veriler
- [x] `CustomerAppointments.tsx`: Yaklaşan, geçmiş randevular listesi (mock verilerle). ✅ **Tamamlandı** - Filtreler, istatistikler, durum rozetleri
- [x] `CustomerMessages.tsx`: Mesajlaşma arayüzü tasarımı. ✅ **Mevcut** - useChat hook entegre
- [x] `CustomerReviews.tsx`: Müşterinin yaptığı yorumlar. ✅ **Tamamlandı** - Mock veriler, faydalı oy, düzenleme/silme
- [x] `CustomerSettings.tsx`: Profil düzenleme ve ayarlar. ✅ **Mevcut** - Tab yapısı, form alanları
- [x] `Wallet.tsx`: Bakiye ve işlem geçmişi arayüzü. ✅ **Mevcut** - Mock işlem verileri

### 2.3. Escort Paneli (`src/pages/dashboard/`)
- [x] `InteractionsCenter.tsx`: Mesajlar ve bildirimler merkezi.
- [x] `ProfileEditor.tsx`: Profil düzenleme, bio, fiziksel özellikler vb. formları.
- [x] `ScheduleManager.tsx`: Çalışma saatleri ve takvim yönetimi.
- [x] `ImageEditor.tsx`: Fotoğraf yükleme ve düzenleme arayüzü.

## 3. İkili Üyelik Sistemi (Tier) Entegrasyonu
- [x] **Müşteri Kısıtlamaları:** Frontend'de `free` müşteri için fotoğraf/video kısıtlamalarını uygula (blur efekti, kilit ikonu). ✅ **Tamamlandı** - `TierGate.tsx` bileşeni oluşturuldu
- [x] **Escort Kısıtlamaları:** Frontend'de `free` escort için fotoğraf yükleme sınırı vb. UI kısıtlamalarını uygula.
- [x] **Backend Middleware:** tRPC router'larına (`escort.router.ts`, `media.router.ts` vb.) üyelik seviyesine göre (free, gold, platinum, vip) yetki kontrolü ekle.
- [x] **Süre Kontrolü:** `subscription.checkAndDowngradeExpiredSubscriptions` endpoint'ini admin paneline bağla.

## 4. Sadakat ve Puan Sistemi (Gamification)
- [x] **Puan Kazanma Backend:** `moderation.router.ts` (yorum yapma), `appointment.router.ts` (randevu tamamlama) işlemlerine puan artışı ekle.
- [x] **Referans Kodu:** `auth.router.ts` içerisine referans kodu kullanımıyla +500 puan ekleme mantığı yaz.
- [x] **Profil Tamamlama:** Profil %100 olduğunda puan verme mantığını entegre et.
- [x] **Visibility Boost:** `escort.router.ts` listeleme sorgusunda kullanıcının `userRank` değerine göre (Bronze 1.05x -> Diamond 2.00x) sıralama çarpanı ekle.
- [x] **Frontend:** Escortlar için `src/components/LoyaltyDashboard.tsx` bileşenini tam işlevsel hale getir. ✅ **Tamamlandı** - Rütbe seviyeleri, puan göstergesi, ilerleme çubuğu

## 5. Kapsamlı Admin Paneli (`/admin/dashboard`) - KRİTİK ONARIMLAR
- [x] **Import Hataları:** `AdminDashboard.tsx` içindeki `next/link` ve `next/router` importlarını `wouter` ile değiştir. ✅
- [x] **Eksik Bileşenler:** `CardContent` importunu ekle. ✅
- [x] **Hook & Tab Uyumu:** `useAdminData.ts` hook'larının dönüş yapısını `UsersTab.tsx` ve `ListingsTab.tsx` bileşenlerinin beklediği `{ data, total, totalPages }` yapısına uygun hale getir. ✅
- [x] **API Konsolidasyonu:** `admin.router.ts` gerçek sorgularla güncellendi, tRPC önceliklendirildi. ✅
- [x] **Kullanıcı Yönetimi:** Müşteri ve Escort'ları listeleme, detay görme, manuel Tier atama, Ban/Unban işlemleri. ✅ (Backend & Frontend Entegre)
- [x] **İlan Onay Sistemi:** Yeni escort profillerini onaylama (`isVerifiedByAdmin = true`) veya reddetme. ✅ (Backend & Frontend Entegre)
- [x] **Finansal Raporlar:** Mock veriler yerine veritabanından çekilen üyelik satın alımlarını grafikleştirme altyapısı kuruldu. ✅ (Backend Entegre)
- [x] **Medya Moderasyonu:** Escortların yüklediği medya dosyalarını onaylama/reddetme arayüzü. ✅ **Tamamlandı** - AdminMediaApprovals (nested layout düzeltildi) + ApprovalsTab (mock → tRPC entegrasyonu)

## 6. Test Hesapları ve Seed Verisi
- [x] `scripts/seed.ts` dosyasını güncelle: Her rol (Admin, Escort, Customer) ve her tier (free, gold, platinum, vip) için ayrı ayrı hesaplar oluştur.
- [x] Tüm test hesaplarının şifresi `Test123!` olacak şekilde ayarla.
- [x] Seed script'ini çalıştır ve veritabanını doldur.

## 7. Yayın Öncesi (Kasım 2026 hazırlık turu sonrası)
- [x] Üretimde `listingService` gerçek `apiListingService`'ı zorunlu kullanır; mock yalnızca yerel geliştirme ve test içindir.
- [ ] Ödeme (iyzico) akışı router'lara bağlanacak (`src/lib/payment/*` henüz kullanılmıyor).
- [ ] `robots` meta `noindex` → hukuki onaydan sonra açılacak.
- [ ] Gerçek DB ile e2e smoke test (`npm run test:e2e`).

## 8. Kasım 2026 Yerel Kalite ve Çalıştırma
- [x] Üretim listeleme kaynağı gerçek API'ye kapanır; demo/mock kayıtları production'da seçilemez.
- [x] Ana sayfadaki doğrulanmamış vaatler kaldırıldı; 18+ ilan panosu kapsamı ve aracılık/ödeme yapılmadığı açıklandı.
- [x] Ana başlık görünür semantik HTML metni; 3D/GSAP/CSS hareketi azaltılmış hareket tercihine uyar.
- [x] `public/manus-routes.json` 73 canlı Wouter route'u içerir; 404-only rota eklenmemiş ve eşleşme doğrulanmıştır.

## 9. Kalan Kalite Bakımı
- [ ] Repo geneli ESLint parser yapılandırması ve mevcut uyarılar temizlenecek; kapsamlı çalıştırma şu an 6 hata ve 389 uyarıyla kapanıyor.
- [ ] `Sparkles` bundle parçası optimize edilecek; son build'de 808 KB (gzip 218.62 KB) uyarısı verdi.
- [x] Browserslist `caniuse-lite` veritabanı bağımlılık güncellemesi sırasında yenilenecek; son build verinin 9 aylık olduğunu bildirdi.
