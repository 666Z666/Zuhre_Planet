# 🌌 Zühre Planet

> **Premium Escort İlan & Sosyal Eşleşme Platformu**  
> V4.0 — Shadow Diamond Edition

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11-398CCB?style=flat-square)](https://trpc.io/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square)](https://orm.drizzle.team/)

---

## 🗄️ Belgeler

| Belge | Açıklama |
|---|---|
| [📍 PROJECT_MAP.md](./docs/PROJECT_MAP.md) | Tüm klasör ve dosya haritası |
| [🚀 ROADMAP.md](./docs/ROADMAP.md) | Gelecek planlar ve yol haritası |
| [📦 TODO.md](./TODO.md) | Aktif görev listesi |

---

## 🏗️ Mimari

```
┌─────────────────────────────────────────────────────┐
│                  React SPA (Vite)                    │
│  wouter router · React.lazy · Framer Motion          │
│  Tailwind CSS · shadcn/ui · Three.js                 │
├─────────────────────────────────────────────────────┤
│               tRPC Client / HTTP                     │
├─────────────────────────────────────────────────────┤
│        Express + tRPC Server (server/)               │
│  Auth · Escort · Admin · Payment · Chat routers      │
├─────────────────────────────────────────────────────┤
│         Drizzle ORM · PostgreSQL Database            │
└─────────────────────────────────────────────────────┘
           ↕ WebSocket (gerçek zamanlı chat)
```

---

## ⚡ Hızlı Başlangıç

### Ön Koşullar
- Node.js 20+
- PostgreSQL 16+ (veya Supabase/Railway)
- pnpm (veya npm)

### 1. Projeyi Kur

```bash
git clone https://github.com/yourusername/zuhre-planet.git
cd zuhre-planet
npm install
```

### 2. Ortam Değişkenlerini Ayarla

```bash
cp .env.example .env
```

`.env` dosyasını düzenle:

```env
# Veritabanı
DATABASE_URL=postgresql://user:pass@localhost:5432/zuhre_planet

# Kimlik Doğrulama
JWT_SECRET=your-super-secret-key-min-64-chars

# API URL'leri
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/ws
```

### 3. Veritabanı Şemasını Oluştur

```bash
npm run db:push
```

### 4. Geliştirme Sunucusunu Başlat

```bash
# Frontend (Vite) + Backend (Express/tRPC)
npm run dev

# Sadece frontend
npm run dev:client

# Sadece backend
npm run dev:server
```

Frontend: `http://localhost:5173`  
API: `http://localhost:3000`

---

## 🔑 Demo Hesaplar (DEV Ortamı)

| Rol | E-posta | Şifre |
|---|---|---|
| 👑 Admin | admin@zuhre.com | Test123! |
| 💜 Escort | escort@zuhre.com | Test123! |
| 👤 Müşteri | ozan@gmail.com | Test123! |

> **Not:** Bu bilgiler yalnızca `DEV` modunda görünür. Production'da otomatik gizlenir (`DevCredentialsPanel`).

---

## 📁 Proje Yapısı (Özet)

```
zuhre-planet/
├── src/
│   ├── pages/          ← Uygulama sayfaları (lazy-loaded)
│   │   ├── App.tsx     ← Root router & provider tree
│   │   ├── auth/       ← Login sayfaları
│   │   ├── customer/   ← Müşteri dashboard
│   │   ├── dashboard/  ← Escort dashboard
│   │   ├── admin/      ← Admin sayfaları
│   │   ├── general/    ← Public sayfalar
│   │   ├── membership/ ← Üyelik & VIP sayfaları
│   │   └── forum/      ← Forum sistemi
│   ├── components/     ← Yeniden kullanılabilir bileşenler
│   │   ├── ui/         ← shadcn/ui temel bileşenleri
│   │   ├── auth/       ← Login form bileşenleri
│   │   ├── layout/     ← Layout bileşenleri
│   │   └── ...         ← Domain bileşenleri
│   ├── contexts/       ← React Context provider'ları
│   ├── hooks/          ← Özel React hook'ları
│   ├── services/       ← API & iş mantığı servisleri
│   ├── lib/            ← Yardımcı kütüphaneler
│   ├── types/          ← TypeScript tip tanımları
│   ├── data/           ← Mock & statik veriler
│   ├── constants/      ← Uygulama sabitleri (routes, vb.)
│   └── locales/        ← Çoklu dil dosyaları (TR/EN)
├── server/             ← Backend (Express + tRPC)
│   ├── server.ts       ← Sunucu başlatma
│   ├── router.ts       ← Ana tRPC router
│   └── routers/        ← Alt router modülleri
├── drizzle/            ← Veritabanı şeması ve migration'lar
├── docs/               ← Proje dokümantasyonu
│   ├── PROJECT_MAP.md  ← Tam dosya ve klasör haritası
│   └── ROADMAP.md      ← Gelecek planlar
├── public/             ← Statik dosyalar
├── tests/              ← Playwright E2E testler
├── .env.example        ← Ortam değişkeni şablonu
├── vite.config.ts      ← Vite konfigürasyonu
├── tailwind.config.js  ← Tailwind konfigürasyonu
└── drizzle.config.ts   ← Drizzle ORM konfigürasyonu
```

---

## 🎨 Tasarım Sistemi

### Renkler

| Token | Değer | Kullanım |
|---|---|---|
| `--primary` | `#0EA5E9` (Cyan) | Ana eylem, linkler |
| `--secondary` | `#7C3AED` (Purple) | Vurgu, VIP elementler |
| `--background` | `#080810` (Deep Space) | Sayfa arka planı |
| Kırmızı | `#DC2626` | The Red Room, uyarılar |
| Altın | `#F59E0B` | Elite/Premium elementler |

### Tipografi
- **Başlıklar:** `font-black uppercase tracking-tight` (Sert, cinematic)
- **Gövde:** `text-white/70` — WCAG AA uyumlu kontrast
- **Etiketler:** `text-[10px] font-bold uppercase tracking-[0.3em]` (Micro labels)

### Bileşen Sınıfları
- `.glass-panel` — Frosted glass efekti, koyu temada `rgba(8,8,16,0.88)`
- `.film-grain` — Sinematik film tanesi overlay
- `.animate-pulse` — Canlı/online göstergeleri
- `rounded-[2rem]` / `rounded-[2.5rem]` — Premium yuvarlatma

---

## 🛡️ Güvenlik Özellikleri

| Özellik | Açıklama |
|---|---|
| **PanicProtocol** | Çift ESC tuşu → Google'a anında yönlendirme |
| **AgeGateOverlay** | 18+ yaş doğrulama zorunlu |
| **ProtectedRoute** | Rol tabanlı sayfa erişim denetimi |
| **TierGate** | VIP/Platinum içerik koruma katmanı |
| **DevCredentialsPanel** | Dev bilgilerinin production'da otomatik gizlenmesi |
| **JWT Auth** | Stateless kimlik doğrulama |
| **Rate Limiting** | Brute-force koruması |

---

## 🧪 Testler

```bash
# Birim testler (Vitest)
npm run test

# E2E testler (Playwright)
npm run test:e2e

# Test UI
npm run test:ui
```

---

## 🚢 Production Deployment

### Docker ile

```bash
# Production image oluştur
docker build -t zuhre-planet .

# Çalıştır
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel/Netlify

```bash
npm run build
# dist/ klasörünü deploy et
```

Konfigürasyon dosyaları:
- `vercel.json` — Vercel ayarları
- `netlify.toml` — Netlify ayarları
- `nginx.conf` — Production nginx ayarları

---

## 🔑 Ortam Değişkenleri Referansı

| Değişken | Gerekli | Açıklama |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL bağlantı dizisi |
| `JWT_SECRET` | ✅ | JWT imzalama anahtarı (min 64 karakter) |
| `VITE_API_URL` | ✅ | Frontend→API URL |
| `VITE_WS_URL` | ✅ | WebSocket URL |
| `SMTP_HOST` | ⬜ | E-posta sunucusu |
| `SMTP_USER` | ⬜ | E-posta kullanıcı adı |
| `SMTP_PASS` | ⬜ | E-posta şifresi |
| `IYZICO_API_KEY` | ⬜ | Iyzico ödeme API anahtarı |
| `IYZICO_SECRET_KEY` | ⬜ | Iyzico gizli anahtar |
| `CLOUDINARY_CLOUD_NAME` | ⬜ | Medya depolama |
| `CLOUDINARY_API_KEY` | ⬜ | Cloudinary API |
| `CLOUDINARY_API_SECRET` | ⬜ | Cloudinary gizli |
| `VITE_GA_ID` | ⬜ | Google Analytics ID |
| `SENTRY_DSN` | ⬜ | Hata izleme (Sentry) |

---

## 🤝 Katkıda Bulunma

1. Yapılacaklar için [ROADMAP.md](./docs/ROADMAP.md) ve [TODO.md](./TODO.md)'u incele
2. Yeni özellik branch'i aç: `git checkout -b feature/ozellik-adi`
3. Commit: `git commit -m "feat: kısa açıklama"`
4. Push: `git push origin feature/ozellik-adi`
5. Pull Request aç

### Commit Kuralları
```
feat:     Yeni özellik
fix:      Hata düzeltme
refactor: Yeniden düzenleme
style:    Sadece stil değişikliği
docs:     Dokümantasyon
test:     Test ekleme/güncelleme
chore:    Build, bağımlılık güncellemeleri
```

---

## 📄 Lisans

Özel yazılım — Tüm hakları saklıdır.  
© 2026 Zühre Planet. İzinsiz kullanım ve dağıtım yasaktır.

---

*"Elegance is not about being noticed, it's about being remembered."*
