# 🧩 ZUHRE PLANET - BİLEŞENLER VE UI SİSTEMİ (03_components.md)
**Sürüm:** 1.0.0
**Konsept:** Component-Driven Design, Lüks ve Modern UI

## 🧱 1. Bileşen Hiyerarşisi (`src/components/`)
Proje, her biri özel bir amaca hizmet eden 200'den fazla modüler bileşenden oluşur.

### 🏛️ 1.1 UI Kit (`/ui`) - Temel Arayüz
Projenin "Lüks" (Premium) hissiyatını veren ana görsel atomlar.
*   **`LuxuryText.tsx`**: Başlıklarda kullanılan altın ve cyan geçişli, gölgeli metin efekti.
*   **`SeductiveCard.tsx`**: Escort ilanları için tasarlanmış, özel cam efekti (Glassmorphism) ve animasyonlu kenarlıklar.
*   **`SensualIcons.tsx`**: Tac (Crown), Elmas (Diamond) gibi premium konseptli özel ikon kütüphanesi.
*   **`LoadingSpinner.tsx`**: Sayfa geçişlerinde dönen kozmik galaksi animasyonu.

### 🏛️ 1.2 Admin Araçları (`/admin`)
Yönetim paneli için tasarlanmış veri yoğunluklu bileşenler.
*   **`/tabs`**: `UsersTab`, `ListingsTab`, `EconomyTab` (Bölümlere ayrılmış dashboard sekmeleri).
*   **`StatCard.tsx`**: Gelir, kullanıcı sayısı gibi KPI verilerini gösteren şık kutular.
*   **`ListingManagement.tsx`**: İlanları onaylama/reddetme süreçlerini yöneten etkileşimli tablo.

### 🏛️ 1.3 Medya ve AI (`/media`)
Görsel içeriklerin işlendiği gelişmiş araçlar.
*   **`AIPhotoEditor.tsx`**: Fotoğraf üzerinde AI tabanlı blurlama ve sansürleme araçları.
*   **`FaceMaskOverlay.tsx`**: Gizlilik için yüz maskeleme ve düzenleme arayüzü.
*   **`EscortMediaUploader.tsx`**: Çoklu medya yükleme ve sürükle-bırak desteği.

---

## 🎨 2. Tasarım Sistemi (Design System)
Proje 5 farklı tema denemesini (Cosmic, Space, Premium, Enhanced, Global) destekleyen esnek bir yapıya sahiptir.

*   **Glassmorphism**: Arka plan bulanıklığı ve yarı saydamlık.
*   **3D Effects**: `Three.js` ile entegre, derinlik ve gölge oyunları.
*   **Gradients**: Cyan (#0ea5e9) ve Purple (#3b82f6) ağırlıklı lüks renk paletleri.

---
[Sonraki Döküman: 04_backend_api.md]
