# 📘 KİTAP 1: MÜŞTERİ (ZİYARETÇİ) KULLANIM KILAVUZU
**Zühre Planet'e Hoş Geldiniz.** Bu kılavuz, platformu kullanacak olan ziyaretçiler ve müşteriler için hazırlanmıştır. Sistemin nasıl kullanılacağı ve arka planda hangi dosyaların çalıştığı görsel bir kitap formatında açıklanmıştır.

---

## 📖 BÖLÜM 1: Sisteme Giriş ve Kayıt
Zühre Planet'e adım attığınızda sizi lüks bir kozmik arayüz karşılar.
*   🖼️ **[Görsel Temsil: Kozmik giriş ekranı, altın renkli butonlar, 3D dönen galaksi arka planı]**

### 1.1 Nasıl Kayıt Olunur?
Kayıt olmak için sağ üstteki "Kayıt Ol" butonuna tıklayarak Müşteri (Client) formunu doldurmanız gerekir. Kayıt sonrası telefon doğrulaması istenir.
*   **İlgili Sayfa:** `src/pages/ClientRegister.tsx` (Kayıt formu ve adımları)
*   **Bileşenler:** `src/components/register/client/*` (Hesap, Telefon ve Profil adımları)

### 1.2 Nasıl Giriş Yapılır?
E-posta ve şifrenizle giriş yaparsınız. Giriş başarılı olduğunda oturumunuz güvenle başlatılır.
*   **İlgili Sayfa:** `src/pages/auth/CustomerLogin.tsx`

---

## 📖 BÖLÜM 2: Katalog ve Escort Arama
Platformun kalbi olan Katalog sayfası, en doğru eşleşmeyi bulmanız için gelişmiş filtreler sunar.
*   🖼️ **[Görsel Temsil: Sol tarafta fiyat/boy/kilo filtreleri, sağda Glassmorphism cam efektli eskort kartları]**

### 2.1 İlanları Filtreleme
Fiyat aralığı, fiziksel özellikler (göz rengi, saç rengi) ve sunulan hizmetlere göre filtreleme yapabilirsiniz.
*   **İlgili Sayfa:** `src/pages/Catalog.tsx` (Ana Katalog)
*   **Filtre Araçları:** `src/components/AdvancedFilter.tsx`, `src/components/admin/filters/RangeSlider.tsx`

### 2.2 İlanları İnceleme
Bir ilana tıkladığınızda Premium listeleme kartı üzerinden escortun detaylarına ulaşırsınız.
*   **Listeleme Kartı:** `src/components/listings/AdvancedListingCard.tsx`
*   **Detay Sayfası:** `src/pages/EscortProfile.tsx` (Müşterinin gördüğü vitrin)

---

## 📖 BÖLÜM 3: Müşteri Paneli ve Cüzdan
Giriş yaptıktan sonra "Hesabım" (Dashboard) sayfasına yönlendirilirsiniz.
*   🖼️ **[Görsel Temsil: Müşteri paneli, bakiye durumu, yaklaşan randevular ve mesaj bildirimleri]**

### 3.1 Müşteri Paneli (Dashboard)
Tüm işlemlerinizi buradan yönetirsiniz. Favori ilanlarınız ve geçmişiniz buradadır.
*   **İlgili Sayfa:** `src/pages/customer/CustomerDashboard.tsx`
*   **Görünüm (Layout):** `src/components/layout/CustomerDashboardLayout.tsx`

### 3.2 Cüzdan ve Bakiye Yükleme
Zühre Planet'te işlemler "Kredi/Bakiye" üzerinden yürütülür. Güvenli ödeme altyapısı ile bakiye yükleyebilirsiniz.
*   **İlgili Sayfa:** `src/pages/customer/Wallet.tsx`
*   **Ödeme Sistemi:** `src/components/PaymentCheckout.tsx`

---

## 📖 BÖLÜM 4: Randevu ve Mesajlaşma
Beğendiğiniz bir eskort ile canlı sohbete başlayabilir veya randevu talep edebilirsiniz.
*   🖼️ **[Görsel Temsil: WhatsApp benzeri, uçtan uca şifreli görünümlü lüks karanlık sohbet penceresi]**

### 4.1 Canlı Mesajlaşma
Mesajlaşma sistemi anlık (gerçek zamanlı) çalışır.
*   **İlgili Sayfa:** `src/pages/customer/CustomerMessages.tsx`
*   **Sohbet Arayüzü:** `src/components/ChatInterface.tsx`

### 4.2 Randevu Talebi
Escortun müsait olduğu saatleri seçip randevu onayına gönderirsiniz.
*   **İlgili Sayfa:** `src/pages/customer/CustomerAppointments.tsx`
*   **Randevu Formu:** `src/components/BookingForm.tsx`

---

## 📖 BÖLÜM 5: VIP ve Sadakat Programı
Platformu kullandıkça Puan kazanır ve rütbe atlarsınız.
*   🖼️ **[Görsel Temsil: Bronz'dan Elmas'a uzanan rütbe barı ve kazanılan sadakat madalyaları]**

### 5.1 Rütbeler ve Ödüller
Rütbeniz arttıkça indirimler veya VIP eskortların gizli fotoğraflarına erişim hakkı kazanırsınız.
*   **İlgili Sayfa:** `src/pages/customer/LoyaltyDashboard.tsx`
*   **Arka Plan (Backend):** `server/routers/loyalty.router.ts`
