# Zühre Planet — Gelecek Planlar & Yol Haritası 🚀

> **Son Güncelleme:** Nisan 2026  
> **Mevcut Sürüm:** V4.0 Shadow Diamond Edition

---

## Öncelik Matrisi

| Öncelik | Kategori | Açıklama |
|---|---|---|
| 🔴 Kritik | Altyapı | Production deployment, SSL, CDN |
| 🟠 Yüksek | Özellik | Gerçek ödeme entegrasyonu |
| 🟡 Orta | UI/UX | Eksik sayfaları tamamla |
| 🟢 Düşük | Gelişim | Yeni özellikler |

---

## Faz 1 — Üretim Hazırlığı (Acil) 🔴

### 1.1 Gerçek Veritabanı Bağlantısı
- [ ] PostgreSQL production instance kurulumu (Supabase veya Railway önerilir)
- [ ] `DATABASE_URL` ortam değişkeni production'da ayarla
- [ ] `drizzle-kit push` ile şema senkronizasyonu
- [ ] Seed data: admin kullanıcı, test escort profilleri

### 1.2 Kimlik Doğrulama Backend
- [ ] JWT secret key production'da güçlü key ile değiştir
- [ ] Refresh token mekanizması tamamla
- [ ] Password reset e-posta akışı test et
- [ ] Rate limiting: Login endpoint'e brute-force koruması

### 1.3 Ortam Değişkenleri
```env
# Kritik — production'da mutlaka ayarla
DATABASE_URL=
JWT_SECRET=                  # Min 64 karakter random
VITE_API_URL=               # Production API URL
VITE_WS_URL=                # WebSocket URL (wss://)

# E-posta
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# Ödeme
IYZICO_API_KEY=
IYZICO_SECRET_KEY=
IYZICO_BASE_URL=            # Production: https://api.iyzipay.com

# Storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Opsiyonel
VITE_GA_ID=                 # Google Analytics
SENTRY_DSN=                 # Error tracking
```

### 1.4 Ölü Dosya Temizliği
Aşağıdaki dosyalar hiçbir yerde import edilmiyor — manuel silinmesi gerekiyor:

```bash
# Çalıştır (Git'e commit edilmeden önce):
rm src/components/CosmicNav.tsx
rm src/components/ModernNavBar.tsx
rm src/components/FloatingNavigation.tsx
rm src/components/CustomIcon.tsx
rm src/components/AdvancedFilter.tsx
rm src/components/AdminLoginPage.tsx      # auth/AdminLoginPage.tsx varken duplicate
rm src/components/SpaceBackground.tsx
rm src/components/SpaceTheme.tsx
rm src/components/StarryBackground.tsx
```

---

## Faz 2 — Temel Özellik Tamamlama (1-2 Hafta) 🟠

### 2.1 Ödeme Sistemi (Iyzico)
- [ ] Iyzico sandbox ortamında gerçek ödeme testi
- [ ] NP (Nebula Points) satın alma akışı tamamla
- [ ] Abonelik/membership satın alma backend bağlantısı
- [ ] Webhook handler: Ödeme başarı/başarısızlık eventi
- [ ] Otomatik fatura oluşturma (PDF)

### 2.2 Gerçek Zamanlı Mesajlaşma
- [ ] `mockWebSocket.ts` → gerçek WebSocket sunucusuna geçiş
- [ ] Mesaj şifreleme (uçtan uca veya server-side)
- [ ] Okundu bildirimleri backend ile sync
- [ ] Dosya paylaşımı (Cloudinary upload)
- [ ] Engelme ve şikayet mekanizması

### 2.3 Medya Yönetimi
- [ ] Cloudinary entegrasyonu — escort fotoğraf/video upload
- [ ] Admin medya onay sistemi (`AdminMediaApprovals.tsx` aktif edilecek)
- [ ] Otomatik watermark ekleme
- [ ] NSFW içerik tarama (API tabanlı)
- [ ] Lazy loading + blur-hash placeholder

### 2.4 Bildirim Sistemi
- [ ] Push notification (Browser Notification API)
- [ ] E-posta bildirimleri (MatchAlert, MessagesNotif)
- [ ] SMS bildirimleri (Twilio)

---

## Faz 3 — Gelişmiş Özellikler (2-4 Hafta) 🟡

### 3.1 Arama & Keşif
- [ ] Elastic Search / Meilisearch entegrasyonu
- [ ] Harita tabanlı arama (Leaflet.js)
- [ ] Gelişmiş filtrelerde gerçek veri (şu an mock)
- [ ] Arama olaylarını analytics'e kaydet

### 3.2 Admin Panel Güçlendirme
- [ ] Kullanıcı/escort yönetim CRUD tamamla
- [ ] İlan moderasyon akışı
- [ ] Finansal raporlar gerçek veriyle
- [ ] IP banlama ve güvenlik logları

### 3.3 Forum Sistemi
- [ ] Forum backend — konu/yorum CRUD
- [ ] Moderasyon araçları (edit/delete/pin)
- [ ] Upvote/downvote sistemi
- [ ] Spam filtresi

### 3.4 Sadakat & Gamification
- [ ] Puan kazanma event'leri backend ile sync
- [ ] Rozet sistemi gerçek trigger'larla
- [ ] Üyelik tier otomatik yükseltme
- [ ] Referral kod sistemi

---

## Faz 4 — Elite Ecosystem Genişlemesi (1 Ay+) 🟢

### 4.1 The Red Room Gerçek İçerik
- [ ] VIP/Platinum kullanıcılara özel içerik upload sistemi
- [ ] İçerik erişim log'u (kim ne gördü)
- [ ] Zaman sınırlı içerik (24h visibility)
- [ ] Escort'ların kendi Red Room galeri yönetimi

### 4.2 Turneler (Tours) Backend
- [ ] Escort tur duyurusu oluşturma API
- [ ] Tur rezervasyon sistemi
- [ ] Takvim entegrasyonu (Google Calendar API)
- [ ] Tur bildirim aboneliği

### 4.3 Ajans Yönetim Sistemi
- [ ] Ajans kayıt ve onay akışı
- [ ] Ajans altında escort profil yönetimi
- [ ] Ajans analytics dashboard

### 4.4 Mobil Uygulama (Uzun Vade)
- [ ] React Native taşıması veya PWA güçlendirme
- [ ] Biometrik giriş
- [ ] Offline mesaj kuyruğu

---

## Teknik Borç Takibi

| Borç | Ağırlık | Öncelik |
|---|---|---|
| Ölü dosyaların silinmesi | Orta | Bu Sprint |
| `any` tiplerini temizle | Yüksek | Bu Sprint |
| Mock data → gerçek API | Çok Yüksek | Faz 2 |
| Test coverage artırma | Orta | Faz 3 |
| i18n eksik çeviriler | Düşük | Faz 3 |
| SEO meta tag'leri tüm sayfalarda | Orta | Faz 2 |
| Performance: LCP optimizasyonu | Yüksek | Faz 2 |

---

## Güvenlik Kontrol Listesi (Pre-Production)

- [ ] Rate limiting her endpoint'te
- [ ] Input sanitization (XSS/SQL Injection)
- [ ] JWT token expiry: Access 15dk, Refresh 7 gün
- [ ] HTTPS zorunlu (HTTP redirect)
- [ ] Content Security Policy header
- [ ] CORS kısıtlaması (sadece domain listesi)
- [ ] Admin paneline 2FA (Google Authenticator)
- [ ] Dosya upload: mime-type kontrolü + boyut sınırı
- [ ] S3/Cloudinary signed URL'ler (public bucket değil)
- [ ] Audit log: Kim ne değiştirdi

---

*Bu roadmap canlı bir belge olarak takip edilecek ve her sprint güncelleneecektir.*
