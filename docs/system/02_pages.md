# 📜 ZUHRE PLANET - SAYFALAR VE YÖNLENDİRME (02_pages.md)
**Sürüm:** 1.0.0
**Konsept:** Wouter-based Routing, Page-based Data Fetching (tRPC)

## 🗺️ 1. Sayfa Hiyerarşisi (Directory Structure)
Uygulamanın görünen yüzü `src/pages/` altında 8 ana kategoriye bölünmüştür.

### 👑 1.1 Ana Giriş (`App.tsx`)
*   Uygulamanın ana navigasyon ve yönlendirme merkezidir.
*   **Router:** Wouter (Hafif ve hızlı React router).
*   **Providers:** 
    *   `TRPCProvider`: Backend ile konuşmak için.
    *   `ThemeProvider`: Açık/Koyu (Kozmik/Buzul) modlar için.
    *   `Toaster`: Bildirim balonları (Sonner) için.

### 🏠 1.2 Genel Sayfalar (`/general`)
*   **`Home.tsx`**: Karşılama, trend escortlar ve hızlı arama.
*   **`Catalog.tsx`**: Gelişmiş filtreleme ve kategori bazlı liste.
*   **`Pricing.tsx`**: Gold, Platinum ve VIP üyelik planları.
*   **`FAQ.tsx`, `Support.tsx`**: Kullanıcı destek ve sık sorulan sorular.

### 🔑 1.3 Yetkilendirme (`/auth`)
*   **`CustomerLogin.tsx`**: Müşteriler için giriş (JWT-based).
*   **`EscortLogin.tsx`**: Escortlar için premium giriş arayüzü.
*   **`AdminLogin.tsx`**: Yönetici girişi (2FA & Role-gate).

### 👤 1.4 Kullanıcı Panelleri
*   **`/customer`**: Müşteri dashboard'u, favoriler, mesajlar, cüzdan ve randevu yönetimi.
*   **`/dashboard`**: Escort ana paneli, gelir raporları ve profil yönetimi.
*   **`/admin`**: İlan onayları (`AdminMediaApprovals.tsx`), kullanıcı yönetimi ve finansal raporlar.

---

## 🚦 2. Yönlendirme Mantığı (Routing Logic)
Uygulama, kullanıcının rolüne göre (Customer, Escort, Admin) farklı router ağaçları kullanır.

*   **Public Routes**: Herkese açık sayfalar (`/home`, `/catalog`, `/login`).
*   **Protected Routes**: Giriş yapmamış kullanıcıların erişemediği sayfalar (`/wallet`, `/profile-edit`).
*   **Role-based Routes**: Sadece belirli rollerin görebildiği sayfalar (Örn: `/admin/*` -> Sadece Admin).

---
[Sonraki Döküman: 03_components.md]
