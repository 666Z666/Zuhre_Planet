# 🗄️ ZUHRE PLANET - VERİTABANI VE DRIZZLE ORM (05_database_schema.md)
**Sürüm:** 1.0.0
**Konsept:** PostgreSQL-based Database, Drizzle-Powered Schema Management

## 📊 1. Veri Modeli (`src/drizzle/schema.ts`)
Projenin tüm tabloları ve aralarındaki ilişkiler TypeScript tabanlı olarak burada tanımlanır.

### 👤 1.1 Ana Kullanıcılar (`users` tablosu)
Sistemin merkezindeki ana tablodur.
*   **Roller (`userRoleEnum`):** `customer`, `escort`, `admin`, `super_mod`, `moderator`.
*   **Üyelik (`subscriptionTierEnum`):** `free`, `gold`, `platinum`, `vip`.

### 👑 1.2 Profiller (`profiles` tablosu)
Escortların fiziksel özellikleri, fiyatları ve biyografileri burada tutulur.
*   **Boy, Kilo, Göz Rengi**: Fiziksel arama filtrelerinde kullanılan veriler.
*   **Biyografi**: Lüks ve lirik profil açıklamaları.

### 🗓️ 1.3 Randevular (`appointments` tablosu)
*   **Durum (`appointmentStatusEnum`):** `pending`, `confirmed`, `completed`, `cancelled`.
*   **Fiyat ve Süre**: Her randevu için özel olarak tanımlanan maliyet ve zaman dilimi.

### 💳 1.4 Finansal İşlemler (`transactions` tablosu)
*   **Bakiye Yükleme**: Iyzico entegrasyonu ile yapılan yüklemeler.
*   **Harcamalar**: Üyelik paketleri, ilan öne çıkarma ve platform ödemeleri.

### 💬 1.5 Mesajlaşma (`messages` tablosu)
*   **Tip (`chatMessageTypeEnum`):** `text`, `image`, `audio`, `video`.
*   **Okundu Bilgisi**: Mesajların görüldüğüne dair zaman damgaları.

---

## 🔗 2. İlişkisel Harita (Database Relations)
*   **1:1**: Her `User`, bir `Profile`'a (Escort ise) sahiptir.
*   **1:N**: Bir `User`, birden fazla `Appointment` veya `Message`'a sahip olabilir.
*   **M:N**: `Users` ve `Favorites` arasındaki beğeni ilişkileri.

---

## 🚀 3. Veritabanı Araçları (`src/drizzle/`)
*   **`db.ts`**: PostgreSQL bağlantı havuzu (Pooling) yapılandırması.
*   **`seed.ts`**: İlk kurulumda oluşturulan Admin ve Test hesapları.
*   **`migrate.ts`**: Tablo değişikliklerini veritabanına uygulayan orkestratör.

---
[Sonraki Döküman: 06_scripts_automation.md]
