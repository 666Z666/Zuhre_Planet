# 📗 KİTAP 4: GELİŞTİRİCİ VE MİMARİ KULLANIM KILAVUZU
**Zühre Planet'in Anatomisi.** Bu kılavuz, projeye dahil olan yeni geliştiriciler ve AI Orkestrasyon Ajanları için hazırlanmıştır. Sistemin 0 hata (Zero Error) ile nasıl çalıştığını açıklar.

---

## 📖 BÖLÜM 1: Teknoloji Yığını ve Kalite Standartları
*   **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Wouter (Hızlı Yönlendirme).
*   **Backend:** Node.js, Express.js, tRPC (@trpc/server), JWT.
*   **Veritabanı:** PostgreSQL, Drizzle ORM (`drizzle-kit`).
*   **Kurallar:** Projede KOPYA BİLEŞEN KULLANILAMAZ. Tüm sistem ESLint testlerinden "0 Hata" ile geçmiştir.

---

## 📖 BÖLÜM 2: Klasör Mimarisi (Directory Map)
Tertemiz ve modüler bir yapı mevcuttur. Ölü kodlar tamamen silinmiştir.
*   🖼️ **[Görsel Temsil: VS Code dosya ağacı (Tree) görünümü, sıfır çöp dosya]**

### 2.1 Frontend (`src/`)
*   `src/pages/`: Uygulamanın yönlendirilebilir ana sayfaları (Örn: `Catalog.tsx`). Kullanıcı rollerine göre alt klasörlenmiştir (`/customer`, `/dashboard`, `/admin`).
*   `src/components/`: Tekrar kullanılabilir (Reusable) UI parçaları. `ui/` (Genel elementler), `admin/`, `media/`, `3d/` olarak görevlerine göre bölünmüştür.
*   `src/styles/`: `cosmic-theme.css` projenin ana lüks görünümünü ve Glassmorphism değişkenlerini tek başına barındıran "Master CSS" dosyasıdır.

### 2.2 Backend (`server/`)
*   `server/router.core.ts`: tRPC başlatma ve `protectedProcedure` (JWT kontrolü) middleware'inin kalbi.
*   `server/routers/`: Her alanın (Admin, Escort, Auth, Chat, Loyalty) kendi iş mantığını (Business Logic) yürüttüğü güvenli katman. Kopya router'lar (`admin_actions`) ana router ile birleştirilmiştir.

### 2.3 Veritabanı (`drizzle/`)
*   `drizzle/schema.ts`: PostgreSQL tabloları, `enum` tanımları (`userRoleEnum` vb.) ve ilişkiler (Relations).

---

## 📖 BÖLÜM 3: tRPC Akışı Nasıl Çalışır?
Geleneksel REST API (`fetch(/api/user)`) KULLANILMAZ. Tüm işlemler uçtan uca tip güvenliği (End-to-End Type Safety) ile korunur.

### 3.1 Yeni Bir Endpoint Yazmak
1.  **Backend (Router):** `server/routers/` içinde bir `query` (Veri çekmek) veya `mutation` (Veri yazmak) oluşturulur.
2.  **Veritabanı (Drizzle):** `await ctx.db.select().from(schema.users)` ile veri çekilir.
3.  **Frontend Çağrısı:** İlgili bileşende `const query = trpc.admin.getUsers.useQuery()` şeklinde çağrılır. TypeScript otomatik olarak dönüş tipini bilir. Veri yoksa hata verir.

---

## 📖 BÖLÜM 4: Sistem Araçları ve Otomasyon (Scripts)
Acil durumlar ve bakım için `scripts/` klasöründe kritik araçlar mevcuttur.
*   `tsx scripts/setup-admin.ts`: Sisteme anında bir Super Admin (Yönetici) tanımlar.
*   `tsx scripts/fix-db.ts`: Veritabanındaki rol ve ID eşleşme tutarsızlıklarını onarır.
*   `tsx scripts/migrate.ts`: Drizzle ORM güncellemelerini PostgreSQL'e yansıtır.

---

## 📖 BÖLÜM 5: Geliştirici Anayasası
1.  **Tek Doğruluk Kaynağı (Single Source of Truth):** Tasarım (CSS) ve Bileşenler tek bir merkezden yönetilir.
2.  **Temiz Kod (Clean Code):** Kullanılmayan dosyalar (Unused imports/components) anında sistemden silinmelidir. Sistem taranıp 25+ ölü dosyadan arındırılmıştır.
3.  **Güvenlik (Security):** Hassas işlemler mutlaka `protectedProcedure` ile korunmalıdır.
