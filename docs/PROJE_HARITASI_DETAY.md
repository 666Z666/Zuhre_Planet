> **Not (10 Kasım 2026):** Bu, ayrıntılı başvuru haritasıdır (ortam değişkenleri, sayfalar, sunucu uçları, tablolar, güvenlik kararları). Özet ve güncel durum için [PROJE_HARITASI.md](./PROJE_HARITASI.md). Buradaki commit/test sayıları 8–10 Kasım tarihlidir; Manus turları 1–4 ile gelen değişiklikler özet haritada ve `docs/QUALITY_AUDIT_2026-11-10.md` içindedir.

# Zühre Planet — Proje Haritası

**Teslim tarihi:** 8 Kasım 2026 · **Dal:** `gelistirme/rakip-analizi` (temel: `main` = `d9327d6`, temiz başlangıç)
**Durum:** Yerel geliştirme tamamlandı; GitHub'a henüz gönderilmedi (eski depo silinip temiz yeniden açılacak).

Bu belge projenin tamamını tek yerden anlatır: ne olduğu, nasıl kurulduğu, klasörler, sayfalar, sunucu uçları,
veritabanı, güvenlik kararları, bu turda yapılanlar ve açık kararlar.

---

## 1. Ürün özeti

Türkiye odaklı, **yalnız ilan/reklam panosu** modelinde yetişkin ilan platformu. Platform:
- ilan sahibinden görünürlük/üyelik bedeli alır; **randevu, rezervasyon, ödeme aracılığı yapmaz**,
- iletişimi ilan sahibiyle doğrudan kurdurur (numara sayfada görünmez, tıklamada açılır),
- 18 yaş sınırını her katmanda uygular, doğrulanmış profili öne alır,
- sömürü / insan ticareti işaretlerini admin'e gösterir.

Hukuki çerçeve için: `docs/RAKIP_ANALIZI_GAP_2026-11-08.md` (TCK m.227, 5651, 6493, KVKK notları).
**Yayından önce Türk ceza/vergi hukukçusu onayı şarttır.** Bu yüzden site genelinde `noindex` açık.

## 2. Teknoloji

| Katman | Teknoloji |
|---|---|
| İstemci | React 18, Vite 5, TypeScript 5.7, Tailwind 3, wouter (yönlendirme), framer-motion, three.js (lazy), sonner (bildirim) |
| API | tRPC 11 (Express 5 üzerinde), zod doğrulama |
| Veritabanı | PostgreSQL + Drizzle ORM 0.38 |
| Test | Vitest (110 test), Playwright (e2e altyapısı) |
| Dağıtım | Dockerfile + `docker-compose.prod.yml`, nginx; Vercel/Netlify yapılandırmaları mevcut |

## 3. Kurulum

```bash
cp .env.example .env          # aşağıdaki değişkenleri doldurun
npm ci
npm run db:migrate            # drizzle/migrations (0000–0006)
npm run db:seed               # test hesapları (şifre: Test123!)
npm run dev:server            # API :4000
npm run dev                   # istemci :5173
```

**Önemli:** `0000_careful_blazing_skull.sql` mevcut şemanın gerisinde (eski sapma). Boş veritabanına kurmadan önce
`npx drizzle-kit generate` ile yeniden üretin veya şemayı `drizzle-kit push` ile uygulayın; 0001–0006 bu turda eklendi.

### Ortam değişkenleri (`.env`)

| Değişken | Zorunlu | Not |
|---|---|---|
| `DATABASE_URL` | evet | PostgreSQL bağlantısı |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | evet | ≥32 karakter |
| `CORS_ORIGINS` | evet | virgülle ayrılmış adresler |
| `CONTACT_ENC_KEY` | **yayında evet** | 64 hex (32 bayt). Telefon/WhatsApp şifreleme + kör indeks anahtarı. **Kaybolursa kayıtlı numaralar açılamaz — yedekleyin.** Üret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_HOST/PORT` | yayında evet | Şifre sıfırlama e-postası |
| `APP_URL` | önerilir | E-posta bağlantıları ve site haritası için |
| `VITE_LISTING_SOURCE` | — | `api` = gerçek veri (**yayında zorunlu**), `mock` = demo |
| `SEO_INDEXING`, `VITE_SEO_INDEXING` | — | Hukuki onaydan sonra `true` |
| `VITE_PAYMENTS_ENABLED` | — | Ödeme kararı verilene kadar boş |
| `GOOGLE_CLIENT_ID` | — | Google girişi kullanılacaksa zorunlu |
| `IYZICO_*` | — | Kart altyapısı bu dikeyde muhtemelen onaylanmaz (bkz. raporlar) |

### Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` / `dev:server` | Geliştirme sunucuları |
| `npm run build` | İstemci + sunucu derlemesi |
| `npm run typecheck` | Sunucu + istemci tip denetimi |
| `npx vitest run` | Birim testleri |
| `npm run test:e2e` | Playwright (gerçek DB gerekir) |

## 4. Klasör haritası

```
Zuhre_Planet/
├── server/                    API (Express + tRPC)
│   ├── server.ts              Express: güvenlik başlıkları, CSRF, REST auth, /sitemap-locations.xml, /health
│   ├── router.ts              Tüm tRPC router'larının kaydı
│   ├── router.core.ts         public / protected / admin prosedürleri, son aktiflik güncellemesi
│   ├── routers/               Alan bazlı uçlar (aşağıda §6)
│   ├── lib/                   Saf iş mantığı (test edilir)
│   │   ├── listing.ts         Filtre/sıralama şemaları, 18+ doğrulama, trSlug, konum site haritası
│   │   ├── activity.ts        Son aktiflik dilimleri (tam zaman damgası public dönmez)
│   │   ├── contactCrypto.ts   AES-256-GCM, TR numara normalizasyonu, maskeleme, HMAC kör indeks
│   │   ├── safetySignals.ts   Ortak numara/fotoğraf gruplama
│   │   ├── rates.ts           Fiyat tablosu doğrulama, saatlik ücret türetme
│   │   ├── passwordReset.ts   Token üretimi (yalnız özeti saklanır), e-posta şablonu
│   │   ├── contactForm.ts     İletişim formu şeması (bot tuzaklı)
│   │   ├── session.ts, authRateLimit.ts, email.ts, tiers.ts
│   └── __tests__/             Sunucu testleri
├── src/
│   ├── pages/                 Sayfalar (aşağıda §5); App.tsx = yönlendirme
│   ├── components/            UI; contact/, rates/, admin/ (SafetySignalsCard, ContactInboxCard), ui/
│   ├── services/              listingService (mock) ↔ apiListingService (gerçek API)
│   ├── contexts/              Auth, Theme, Language (TR/EN/AR/RU)
│   ├── locales/               tr.json, en.json, ar.json, ru.json
│   ├── data/locations.ts      81 il + ilçeler (slug'lar düzeltildi)
│   ├── drizzle/schema.ts      Veritabanı şeması (§7)
│   └── tests/                 İstemci testleri
├── drizzle/migrations/        0000–0006 + meta/_journal.json
├── docs/                      Bu harita, rakip analizi/gap, sürüm notları, mimari belgeler
├── public/                    Marka varlıkları, ikonlar, textures/noise.svg
└── Dockerfile, docker-compose*.yml, nginx*.conf, vercel.json, netlify.toml
```

## 5. Sayfa haritası

**Herkese açık**
| Adres | Sayfa | Not |
|---|---|---|
| `/` | Ana sayfa | 3D başlık (lazy), tanıtım bölümleri |
| `/catalog`, `/escorts` | Katalog / liste | Filtre paneli: şehir-ilçe, son aktiflik, doğrulanmış, yaş, ücret; sıralama doğrulanmış > boost > üyelik |
| `/escort/:id`, `/profile/:id` | Profil | Son aktiflik, favori, fiyat tablosu, Ara/WhatsApp (sunucudan açılır), yorumlar |
| `/konum/:il/:ilçe?` | Şehir/ilçe ilanları | Gerçek sayılar, iç bağlantılar, JSON-LD; <3 ilan → noindex |
| `/membership` | Üyelik | Gerçek puan bakiyesi; ödeme "yakında" bilgisi |
| `/red-room`, `/blog`, `/about`, `/pricing`, `/faq`, `/support`, `/how-it-works`, `/contact` | Bilgi sayfaları | İletişim formu admin gelen kutusuna kaydeder |
| `/terms-of-service`, `/privacy-policy`, `/cookie-policy`, `/kvkk`, `/safety` | Yasal | |
| `/forum`, `/forum/:slug`, `/forum/topic/:slug`, `/forum/new-topic` | Forum | Sunucu yoksa "tekrar dene" |
| `/login`, `/escort/login`, `/admin/login`, `/register*` | Giriş/kayıt | |
| `/forgot-password`, `/reset-password` | Şifre sıfırlama | Yeni |

**Giriş gerektiren**
| Adres | Sayfa |
|---|---|
| `/customer/dashboard` | Müşteri genel bakış (gerçek favoriler, puan, sohbetler) |
| `/favorites` | Favorilerim (gerçek) |
| `/messages`, `/reviews`, `/customer/loyalty`, `/dashboard/wallet`, `/settings` | Mesajlar, yorumlar*, sadakat, cüzdan, ayarlar |
| `/escort/dashboard`, `/dashboard/profile` | İlan sahibi paneli; profil düzenleyicide **iletişim numarası** ve **fiyat tablosu** kartları |
| `/dashboard/gallery`, `/schedule`, `/interactions`, `/loyalty`, `/intel`, `/store` | İlan sahibi araçları* |
| `/admin/dashboard` | Admin: onay kuyruğu (güvenlik sinyalleri, iletişim gelen kutusu, numara onayları, profil/medya onayları) |

\* Hâlâ demo veri kullanan sayfalar — Kaptan kararıyla şimdilik olduğu gibi (bkz. §10).

**Yönlendirmeler:** `/tours`, `/agencies`, `/nightlife` → katalog (kaldırıldı) · `/appointments` → müşteri paneli ·
`/privacy`, `/terms`, `/cookies`, `/vip`, `/market`, `/analytics`, `/reports`, `/customer/*` eski bağlantıları doğru sayfalara.

## 6. Sunucu uçları (tRPC)

`public` = herkes · `protected` = giriş yapmış · `admin` = yalnız admin

| Router | Uçlar |
|---|---|
| `auth` | register, login, socialAuth (public) · completeProfile, acceptChatRules, me (protected) · **requestPasswordReset, resetPassword** (public, hız sınırlı) |
| `escort` | list (filtreler + doğrulama öncelikli sıralama), **locationStats**, getBySlug, **getById** (public) · getMyTierInfo, activateBoost, **getMyRates, setMyRates**, updateProfile (18+ doğrulama, admin onaylı) |
| `contact` | setMine, getMine (protected, ilan sahibi) · availability, **reveal** (public, IP başına 30/10 dk, profil başına 5/10 dk) · listPending, review (admin, denetim kaydı) |
| `favorites` | toggle, ids, list (protected) |
| `safety` | signals (admin): ortak numara, ortak fotoğraf, aynı yerden toplu hesap |
| `support` | contact (public, saatte 5, bot tuzağı) · inbox, setStatus (admin) |
| `subscription` | getSubscriptionBenefits, getMySubscription, spendLoyaltyPoints (atomik), referans uçları (protected) · **upgradeSubscription (admin, ödeme referansı zorunlu)**, checkAndDowngradeExpiredSubscriptions (admin) |
| `loyalty` | getMyStatus, referans, getLeaderboard (protected) · **addPoints (admin)**, adminAdjustPoints (admin) |
| `appointment` | create **kapalı** (platform randevu almaz) · list, updateStatus (protected) |
| `admin` | istatistik, kullanıcı/ilan/yorum/rapor yönetimi, medya onayı, shadowban, denetim kayıtları, profil güncelleme onayı (yeniden doğrulamalı) |
| `messaging`, `chat` | Sohbetler ve mesajlar (protected) |
| `forum` | kategoriler/konular/mesajlar |
| `media`, `verification`, `moderation` | Medya ayarları, kimlik doğrulama başvurusu, moderasyon (admin) |

**REST/Express:** `/api/auth/*` (csrf, login, register, me), `/sitemap-locations.xml`, `/health`.

## 7. Veritabanı

| Tablo | Amaç |
|---|---|
| `users` | Hesaplar; + `signup_ip_hash` (HMAC, ham IP yok) |
| `escort_profiles` | İlanlar; `hourly_rate` fiyat tablosundan türetilir, `last_active` son aktiflik |
| `customer_profiles`, `loyalty_transactions`, `notifications`, `audit_logs`, `reports`, `user_blocks` | Mevcut |
| `media` | + `content_hash` (aynı fotoğraf tespiti) |
| `reviews`, `appointments` | Mevcut (randevu oluşturma kapalı) |
| `escort_contacts` | **Yeni** — şifreli numaralar, bekleyen değişiklikler, kör indeksler |
| `contact_clicks` | **Yeni** — tıklama sayacı (kanal + zaman, kişisel veri yok) |
| `escort_rates` | **Yeni** — süre × görüşme yeri fiyatları |
| `password_reset_tokens` | **Yeni** — token özeti, tek kullanım, 30 dk |
| `contact_messages` | **Yeni** — iletişim formu gelen kutusu |
| `favorites` | **Yeni** — kullanıcı → ilan |
| `chat_*`, `forum_*`, `escort_photos` | Mevcut |

Migration'lar: `0001_contact_masking`, `0002_safety_signals`, `0003_escort_rates`, `0004_password_reset`,
`0005_contact_messages`, `0006_favorites`.

## 8. Güvenlik ve gizlilik kararları

- **18+**: profil güncellemesi, admin onayı ve filtrelerde yaş ≥ 18 zorunlu.
- **Numara maskeleme**: AES-256-GCM; numara HTML'de yok, tıklamada açılır; değişiklik admin onaylı.
- **Kör indeks (HMAC)**: numara/IP çözülmeden "aynı mı" karşılaştırması (güvenlik sinyalleri).
- **Son aktiflik**: public uçlar yalnız kaba dilim döner (izlenebilirliği azaltır).
- **Kapatılan açıklar (bu tur)**: ödemesiz üyelik yükseltme, sınırsız puan ekleme, eksi bakiye yarışı.
- **Hız sınırları**: giriş/kayıt, şifre sıfırlama, numara açma, iletişim formu.
- **Hesap keşfi**: şifre sıfırlama her durumda aynı yanıtı verir.
- **Bilinçli olarak yapılmayanlar**: ajans paneli, turneler, "escort dostu mekân" listesi, randevu/rezervasyon,
  ek hizmet fiyatlandırması (TCK m.227 aracılık / yer temini riski).

## 9. Bu turda yapılanlar (commit sırasıyla)

1. Filtreler, doğrulama öncelikli sıralama, 18+ doğrulama, `locationStats`
2. Gerçek API ilan servisi, `getById`, katalog filtreleri; hukuki araştırma notları
3. Filtre paneli, gerçek yorumlar, 29 bozuk konum slug'ı düzeltmesi
4. Telefon maskeleme + WhatsApp yönlendirme + tıklama istatistiği
5. "Şu an müsait" yerine son aktiflik
6. Şehir/ilçe sayfaları + konum site haritası
7. Güvenlik (sömürü) sinyalleri
8. Fiyat tablosu
9. Dil desteği: Rusça, Türkçe geri düşüş, yeni özellikler 4 dilde
10. Site taraması: rota sırası (giriş/panel 404), 12 kırık bağlantı, şifre sıfırlama, forum hata durumları
11. Turneler/Ajanslar/Gece Hayatı ve randevu düğmesi kaldırıldı
12. Ödemesiz üyelik ve sınırsız puan açıkları, iletişim gelen kutusu, dürüst ödeme bildirimi
13. Gerçek favoriler ve müşteri paneli; ölü bileşenler silindi
14. 18 `alert()` → site bildirimi
15. Görsel düzeltmeler: kesilen başlık, mobil logo/profil, kırık Stripe rozeti, sahte "Özel Arşiv"

Doğrulama: `typecheck` temiz · `vitest` 110/110 · istemci + sunucu derlemesi başarılı ·
62 sayfa tarayıcıda hatasız (Playwright, demo modunda, veritabanı olmadan).

## 10. Açık kararlar ve yapılacaklar

| Konu | Durum |
|---|---|
| GitHub | Eski `666Z666/Zuhre_Planet` silinecek (sızmış Telegram oturumu içeriyor), aynı adla özel açılıp bu dal birleştirilecek |
| Telegram | Sızan oturumlar Telegram'dan sonlandırılmalı |
| Hukuk | TCK m.227, 5651, KVKK yurt dışı aktarım — avukat onayı; sonra `noindex` ve `SEO_INDEXING` |
| Ödeme | Kart yerine havale/EFT eşleştirme veya kripto — karar bekliyor; o zamana kadar admin `upgradeSubscription` ile elle açar |
| Yorum sistemi | Raporlar ilk 6 ay kapalı öneriyor — "Yorumlarım" demo veride, karar bekliyor |
| Mesajlaşma | Raporlar sonraya bırakmayı öneriyor — açık duruyor |
| Demo veri sayfaları | İlan sahibi gizli paneli, müşteri istihbaratı, bildirimler, geçmiş — şimdilik olduğu gibi |
| Ana sayfa metinleri | "4.9/5 rating", "ilk krediniz bizden", "uçtan uca şifreli", "otel… buluşmalar" — gerçeğe uyarlanmalı |
| Medya yükleme | Sunucu yükleme akışı yok; yazılınca `media.content_hash` doldurulmalı |
| `0000` migration | Yeniden üretilmeli |
| Eski sayfa metinleri | Sabit Türkçe metinlerin `t()` çevirisine taşınması |

## 11. Teslim paketi içeriği

| Dosya | Açıklama |
|---|---|
| `PROJE_HARITASI.md` | Bu belge |
| `kaynak/` | Dalın son hâli (yalnız takip edilen dosyalar; `node_modules`, `dist`, `.env` yok) |
| `zuhre-planet.bundle` | Tam git geçmişi (`main` + `gelistirme/rakip-analizi`). Açmak: `git clone zuhre-planet.bundle Zuhre_Planet` |
| `SHA256SUMS.txt` | Dosya özetleri |
