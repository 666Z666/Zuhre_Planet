# Zühre Planet — Hazırlık Turu (8 Kasım 2026)

Temel: `ssrxs/Zuhre_Planet@main` (d6dfd18, 22 Mayıs 2026). Bu sürüm **temiz geçmişle** yeni depoya aktarılmak üzere hazırlandı; eski depodaki sızan Telegram oturum dosyaları yeni geçmişte yer almaz.

## Doğrulama
| Kontrol | Önce | Sonra |
|---|---|---|
| Sunucu `tsc` | derlenmiyordu (`admin.router.ts` sözdizimi bozuk) | 0 hata |
| İstemci `tsc` | 236 hata | 0 hata |
| Testler | 19 | 26 (CSRF, oturum, e-posta, tier testleri eklendi) |
| `vite build` / `build:server` | build:server çalışmıyordu (alias'lar) | ikisi de geçiyor |
| ESLint (hata) | 1 | 0 |
| İlk yükleme JS | three.js (~1 MB) dahil | three.js lazy chunk'ta |

## Güvenlik
- **Sızan secret**: `stb_session.session`, `stb_bot_session.session` (Telegram/Telethon SQLite oturumları) kaldırıldı; `.gitignore` güçlendirildi. → **Telegram'da bu oturumları sonlandırın.**
- **CSRF**: eski middleware token'ı istemciye hiç vermiyordu (login fiilen 403) ve herkes için tek "anonymous" token üretiyordu. Double-submit cookie (`zp_csrf` + `x-csrf-token`) ile değiştirildi; REST **ve** tRPC mutation'ları korunuyor. `GET /api/auth/csrf`.
- **WebSocket**: JWT artık URL'de taşınmıyor (yalnızca HttpOnly çerez); Origin kontrolü eklendi (Cross-Site WebSocket Hijacking).
- **Oturum**: REST ve tRPC tek modülden (`server/lib/session.ts`) çerez basıyor; tRPC login 1 gün sabit süre yerine `ACCESS_TOKEN_EXPIRY` kullanıyor ve refresh çerezi veriyor. Token'lar yanıt gövdesinde dönmüyor.
- **Brute-force**: e-posta + IP bazlı login limiti, IP bazlı kayıt limiti (REST + tRPC). Zamanlama eşitleme (sabit bcrypt).
- **Hesap keşfi**: tRPC login'de ban durumu şifre doğrulanmadan önce açıklanıyordu → düzeltildi.
- **Veri sızıntısı**: `escort.list` / `escort.getBySlug` ham satır döndürüyordu (`verificationPhotoUrl` = kimlik doğrulama fotoğrafı, `pendingData`, `userId`, abonelik tarihleri). Public projeksiyon eklendi; `getBySlug` gizli profilleri artık göstermiyor; yalnızca onaylı + public medya ve public yorumlar.
- **Forum**: adı olmayan kullanıcıların e-postası public uçlarda görünüyordu → `Üye #id`.
- **Google girişi**: `GOOGLE_CLIENT_ID` yoksa `aud` kontrolü atlanıyordu (token ikamesi) → zorunlu.
- **protectedProcedure**: banlı kullanıcıya FORBIDDEN yerine UNAUTHORIZED dönüyordu → düzeltildi.
- **DoS**: tüm `limit/page/offset` girdileri sınırlandı; JSON gövdesi 1 MB; LIKE joker karakterleri escape.
- **CSP**: `index.html`'deki `*` joker meta-CSP kaldırıldı; Vercel/Netlify CSP sıkılaştırıldı (`unsafe-eval` yok) ve Google Fonts'a izin verildi (önceden yayında fontlar bloklanıyordu).
- Production'da kaynak haritaları yayınlanmıyor; `x-powered-by` kapalı; `trust proxy`.

## Çalışmayan özellikler (düzeltildi)
- Ana sayfa yayında sonsuz yükleme ekranında kalıyordu (3D başlık 404 veren harici font URL'si bekliyordu) → font self-host, CosmicCanvas lazy + izole Suspense.
- Catalog: harita görünümü (`MapListing` default export yok + `profiles` verilmiyordu), kart tıklama, filtre paneli (her zaman açık), çift header, ham HTML başlık.
- Eksik import'lar nedeniyle çöken sayfalar: Catalog, CustomerDashboard, EscortList, EscortProfile, DetailedListingPage, ProfileEditor, ThemeTab, SubmitReviewModal (`Lock` DOM sınıfına çözülüyordu).
- Mesajlar: sohbet seçilmeden çökme, hızlı yanıt butonları boş, presence durumu yanlış tip.
- Analitik yenileme butonu (olmayan fonksiyonlar), AdminMediaApprovals (yanlış alanlar + bozuk Türkçe), 3D sahnede mobil buffer hatası.
- Tema: rota bazlı "planet" teması `--primary` HSL token'ını hex ile eziyordu.
- `npm run build:server` / `npm start` çalışmıyordu → esbuild bundle (Dockerfile ile aynı).

## Marka — "Zümrüt & Altın"
- Logo konseptlerinden palet; `src/config/brand.ts` (tek kaynak) + `src/components/brand/Logo.tsx`.
- `src/styles/brand.css`: koyu **Zümrüt Gece** (varsayılan), açık **Krem & Zümrüt** token'ları; 7 parça CSS dosyası birleştirildi.
- SVG amblem, favicon, PWA ikonları, OG/Twitter görseli; konseptler `/brand-identity` sayfasında.
- 906 dekoratif marka dışı renk sınıfı (sky/cyan/indigo/violet/purple/fuchsia) marka paletine taşındı.
- Yaş doğrulama ekranı, Header, Footer, Admin girişi yeniden tasarlandı.
- Stok fotoğraflar: mock escort profillerinde gerçek kişilerin Unsplash fotoğrafları kullanılıyordu (107 adet) → soyut marka yer tutucuları.

## Bilinçli kararlar
- `robots: noindex` — yayın/hukuki onay sonrası açılmalı.
- Varsayılan tema koyu; açık mod token'ları hazır ama sayfalardaki ~3000 sabit `text-white/bg-black` sınıfı henüz taşınmadı (TODO §1).
- Katalog hâlâ `MockListingService` kullanıyor; backend `escort.list` hazır (TODO §7).

## Kurulum
```bash
git init && git add -A   # paket zaten commit'li gelir, bu adım gerekmez
git remote add origin https://github.com/<kullanici>/<yeni-depo>.git
git push -u origin main
cp .env.example .env     # JWT_SECRET / JWT_REFRESH_SECRET ≥32 karakter, CORS_ORIGINS, DATABASE_URL, GOOGLE_CLIENT_ID
npm ci && npm run db:migrate && npm run db:seed
npm run dev:server & npm run dev
```
Docker: `docker compose -f docker-compose.prod.yml up -d --build` (pnpm lockfile güncel).
