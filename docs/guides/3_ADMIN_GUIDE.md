# 📕 KİTAP 3: YÖNETİCİ (ADMİN) KULLANIM KILAVUZU
**Sistemin Hakimi.** Bu kılavuz, platformun güvenliğini, finansal akışını ve kullanıcı onay süreçlerini yöneten Moderatörler ve Yöneticiler içindir.

---

## 📖 BÖLÜM 1: Güvenli Giriş ve Kontrol Paneli
Yönetici paneli üst düzey güvenlik önlemleriyle korunmaktadır.
*   🖼️ **[Görsel Temsil: Koyu tema, sol menüde gelişmiş seçenekler, ortada KPI (Kazanç, Kullanıcı) metrikleri]**

### 1.1 Admin Girişi ve İki Aşamalı Doğrulama (2FA)
Normal girişten farklı olarak, adminlerin İki Aşamalı Doğrulama kodunu girmesi gerekir. Tüm admin hareketleri veritabanına loglanır (`auditLogs`).
*   **İlgili Sayfa:** `src/pages/auth/AdminLogin.tsx`

### 1.2 Dashboard (Ana Ekran)
Platformun anlık durumunu, bekleyen onay sayısını ve günlük kazanç grafiğini gösterir.
*   **İlgili Sayfa:** `src/pages/AdminDashboard.tsx`
*   **Özet Sekmesi:** `src/components/admin/tabs/OverviewTab.tsx`

---

## 📖 BÖLÜM 2: Medya ve İlan Moderasyonu
Escortların platforma eklediği her fotoğraf, video ve ilan kesinlikle admin onayından geçer.
*   🖼️ **[Görsel Temsil: Yan yana orijinal fotoğraf ile AI analiz sonucu. Onayla (Yeşil) ve Reddet (Kırmızı) butonları]**

### 2.1 İlan Onaylama (Listing Management)
Yeni kayıt olan escortların profilleri "Beklemede" durumundadır. İnceleyip onay verebilir veya reddedebilirsiniz.
*   **İlgili Sekme:** `src/components/admin/tabs/ListingsTab.tsx`
*   **Arka Plan İşlemi:** `server/routers/admin.router.ts`

### 2.2 Medya (Fotoğraf/Video) Onayları
AI tarafından riskli veya sahte (Deepfake) bulunan fotoğraflar panele düşer. Manuel olarak kontrol edip karar verirsiniz.
*   **Medya Paneli:** `src/pages/admin/AdminMediaApprovals.tsx`

---

## 📖 BÖLÜM 3: Kullanıcı Yönetimi
Müşteriler ve Escortlar üzerindeki tam kontrol yetkisi.
*   🖼️ **[Görsel Temsil: Kullanıcı veri tablosu. İşlem (Action) menüsünde Banla, Rütbe Yükselt, Logları İncele seçenekleri]**

### 3.1 Kullanıcı Filtreleme ve Yasaklama (Ban)
Kural ihlali yapan kullanıcıları kalıcı veya geçici olarak sistemden uzaklaştırabilirsiniz (Görünmez ban / Shadow ban dahil).
*   **İlgili Sekme:** `src/components/admin/tabs/UsersTab.tsx`
*   **Kullanıcı Yönetimi:** `src/components/admin/UserManagement.tsx`

---

## 📖 BÖLÜM 4: Finans ve Ekonomi
Platformun can damarı olan para akışının izlenmesi.
*   🖼️ **[Görsel Temsil: Pasta grafikler (Bakiye yüklemeleri vs. VIP paket alımları), ciro tablosu]**

### 4.1 Gelir ve Gider Raporları
Sistemdeki tüm Iyzico işlemlerinin (Transactions) listesi ve toplam komisyon kazançları raporlanıp dışa aktarılabilir.
*   **İlgili Sekme:** `src/components/admin/tabs/EconomyTab.tsx`
*   **Finans Raporları:** `src/components/admin/FinancialReports.tsx`
