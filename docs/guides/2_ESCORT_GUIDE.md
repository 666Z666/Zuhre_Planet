# 📙 KİTAP 2: ESCORT (PARTNER) KULLANIM KILAVUZU
**Lüks Dünyaya Hoş Geldiniz.** Bu kılavuz, platformda hizmet veren partnerler (Escortlar) için hazırlanmıştır. Profil yönetimi, medya yükleme ve kazanç takibi süreçlerini açıklar.

---

## 📖 BÖLÜM 1: Kayıt, Onay ve Güvenlik
Zühre Planet'te kalite esastır. Kayıt olduktan sonra AI ve Admin doğrulamasından geçmeniz gerekir.
*   🖼️ **[Görsel Temsil: 6 adımlı kayıt sihirbazı, AI yüz doğrulama taraması animasyonu]**

### 1.1 Altı Adımlı Kayıt Sihirbazı
Fiziksel özelliklerinizi, sunacağınız hizmetleri ve fiyatlarınızı belirlersiniz.
*   **İlgili Sayfa:** `src/pages/EscortRegister.tsx`
*   **Sihirbaz:** `src/components/register/escort/*` (Adım 1'den Adım 6'ya kadar tüm formlar)

### 1.2 Profil Doğrulama (Verification)
Yüklediğiniz fotoğraflar AI (Görüntü İşleme) tarafından analiz edilir. Gerçeklik testi tamamlanınca "Onaylı" (Verified) rozeti alırsınız.
*   **Onay Modülü:** `src/components/escort/VerificationWizard.tsx`
*   **Arka Plan (AI):** `mcp-servers/image/` (Yapay zeka analiz motoru)

---

## 📖 BÖLÜM 2: Profil ve Medya Yönetimi
Vitrinizi en iyi şekilde sunmanız için geliştirilmiş editörler.
*   🖼️ **[Görsel Temsil: Sürükle-bırak fotoğraf yükleme alanı, bulanıklaştırma (blur) aracı]**

### 2.1 Profil Düzenleme
Biyografi, fiyat güncellemesi ve hizmet detaylarını anlık olarak güncelleyin.
*   **İlgili Sayfa:** `src/pages/dashboard/ProfileEditor.tsx`

### 2.2 Medya Yükleme ve AI Gizlilik Maskesi
Fotoğraf ve video yükleyebilirsiniz. İsterseniz fotoğraflarınızda yüzünüzü AI ile otomatik bulanıklaştırabilir (Face Mask) veya sadece VIP üyelere gösterecek şekilde kilitleyebilirsiniz.
*   **Galeri Yöneticisi:** `src/pages/dashboard/ImageEditor.tsx`
*   **Yüz Gizleme Aracı:** `src/components/media/FaceMaskOverlay.tsx`
*   **Yükleyici:** `src/components/EscortMediaUploader.tsx`

---

## 📖 BÖLÜM 3: Takvim ve Randevular
Zamanınızı yönetmek ve çifte rezervasyonları önlemek için akıllı takvim.
*   🖼️ **[Görsel Temsil: Haftalık takvim görünümü, rezerve edilmiş (kırmızı) ve müsait (yeşil) saat dilimleri]**

### 3.1 Çalışma Saatlerini Belirleme
Hangi günler ve saatler aktif olduğunuzu interaktif takvimden işaretleyin.
*   **İlgili Sayfa:** `src/pages/dashboard/ScheduleManager.tsx`

---

## 📖 BÖLÜM 4: Etkileşim ve Müşteri Yönetimi
Müşterilerden gelen mesajlar ve randevu talepleri tek bir merkezde toplanır.
*   🖼️ **[Görsel Temsil: Gelen kutusu, müşteri güvenilirlik skoru ve onaylama/reddetme butonları]**

### 4.1 Mesaj Merkezi (Interactions)
Canlı sohbet üzerinden müşterilerle konuşun. Gelen randevu taleplerini onaylayın veya reddedin.
*   **İlgili Sayfa:** `src/pages/dashboard/InteractionsCenter.tsx`

---

## 📖 BÖLÜM 5: Finans ve Üyelikler (Store)
Kazançlarınızı anlık olarak takip edin ve profilinizi öne çıkarın.
*   🖼️ **[Görsel Temsil: Kazanç grafiği (Line chart) ve VIP üyelik paketlerinin sergilendiği mağaza]**

### 5.1 Kazanç Raporları
Geçmiş randevulardan kazandığınız toplam tutar ve platform kesintileri.
*   **İlgili Sayfa:** `src/pages/escort/EarningsReport.tsx`

### 5.2 Profil Yükseltme (VIP Store)
İlanınızı öne çıkarmak veya profilinize "Gold/VIP" çerçevesi eklemek için mağazadan paket satın alın.
*   **Mağaza Sayfası:** `src/pages/membership/EscortStore.tsx`
