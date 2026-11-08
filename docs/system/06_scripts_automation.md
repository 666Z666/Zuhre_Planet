# 🛠️ ZUHRE PLANET - ARAÇLAR VE OTOMASYON (06_scripts_automation.md)
**Sürüm:** 1.0.0
**Konsept:** DevOps Automation, System Maintenance, AI (MCP) Helpers

## 🛡️ 1. Sistem Bakım Araçları (`scripts/`)
Proje, kriz anlarında ve günlük bakımda kullanılan 10'dan fazla TypeScript tabanlı araca sahiptir.

### 👑 1.1 Yönetici Atama (`setup-admin.ts`, `force-admin.ts`)
*   Yeni bir yönetici hesabı oluşturmak veya mevcut bir kullanıcıyı Admin rolüne (Super Mod) yükseltmek için kullanılır.
*   **Kullanım:** `tsx scripts/setup-admin.ts` komutuyla hızlı bir admin oluşturulabilir.

### 🛡️ 1.2 Veri Onarımı (`fix-db.ts`, `fix-router-imports.ts`)
*   Veritabanındaki tutarsızlıkları (Örn: Boş roller, yanlış ID eşleşmeleri) tarar ve onarır.
*   Backend router'larındaki (tRPC) yanlış dosya yollarını cerrahi bir titizlikle düzeltir.

### 📜 1.3 Veritabanı Yönetimi (`migrate.ts`, `seed.ts`)
*   Yeni tablo ekleme veya alan güncelleme gibi şema değişikliklerini veritabanına uygular.
*   Test verilerini (Örnek Escortlar, Müşteriler, Yorumlar) saniyeler içinde oluşturur.

---

## 🤖 2. Yapay Zeka (AI) Otomasyonu (`mcp-servers/`)
Proje, Model Context Protocol (MCP) üzerinden AI servislerini sisteme entegre eder.

### 🖼️ 2.1 Görüntü Analizi (`/image`)
*   Escortların yüklediği fotoğrafları analiz ederek "Gerçeklik/AI Testi" ve "Güvenlik Kontrolü" (SafeSearch) yapar.
*   AI ile üretilen içerikleri tespit edip raporlar.

### 📂 2.2 Veri Analizi (`/db`)
*   Platform verimliliğini, kullanıcı trendlerini ve finansal raporları AI desteğiyle anlamlandırır.

---

## 🚀 3. Otomatik Görevler (Crons)
*   **`check-subscriptions.ts`**: Her gün gece yarısı çalışarak süresi biten Gold/Platinum/VIP üyeleri otomatik olarak `free` pakete düşürür.

---
[Sonraki Döküman: 00_MASTER_INDEX.md]
