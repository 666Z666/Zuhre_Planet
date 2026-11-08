# Zühre Planet — Teknik Borç & Geliştirme Listesi (26 Nisan 2026)

## 1. Kritik Teknik Borçlar (Sıfır Hata Hedefi)
- [x] `any` türlerinin `types/` klasöründeki interface/type tanımları ile değiştirilmesi.
- [ ] `no-console` kurallarına uymayan `console.log` ifadelerinin logger service ile değiştirilmesi.
- [ ] React Hook bağımlılık dizilerinin (`exhaustive-deps`) tamamlanması.

## 2. Eksik Özellikler (ROADMAP Entegrasyonu)
- [ ] **Ödeme:** Iyzico Sandbox testleri ve Webhook handler.
- [ ] **Mesajlaşma:** Gerçek WebSocket bağlantısı (`src/services/mockWebSocket.ts` -> `realWebSocket.ts`).
- [ ] **Medya:** Cloudinary entegrasyonu ve watermark sistemi.
- [ ] **Admin:** Finansal raporların gerçek verilerle (drizzle) güncellenmesi.

## 3. Yapılması Gereken Refactoring
- [ ] `src/lib/security` içerisindeki tüm rate-limit mantığının middleware katmanına taşınması.
- [ ] `src/pages/` altındaki çok büyük bileşenlerin (Örn: `EscortProfile.tsx`) daha küçük parçalara bölünmesi.
- [ ] i18n çeviri anahtarlarının `locales/` içerisine tam olarak taşınması.

## 4. Altyapı
- [ ] Docker production imajının optimize edilmesi (multi-stage build).
- [ ] CI/CD (GitHub Actions) ile otomatik test koşumu.

---
*Bu liste projenin otonom gelişimini sağlar.*

