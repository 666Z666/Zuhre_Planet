# ZÜHRE PLANET - MASTER PROJE DÖKÜMANI

## 1. Proje Vizyonu ve Amaç
Zühre Planet, yüksek etkileşimli, 3D kozmik arayüzü ile desteklenen, premium escort/hizmet ve içerik yönetim platformudur. Temel amacımız, kullanıcı deneyimini (UX) kozmik ve sürükleyici bir temayla birleştirerek, güvenli ve şeffaf bir moderasyon sistemi üzerinde yüksek performanslı bir pazar yeri sunmaktır.

## 2. Teknik Mimari
- **Frontend:** React + Vite, TypeScript, TailwindCSS (CSS-in-JS kaçınılmıştır, Vanilla CSS ile estetik arayüzler), Three.js (Kozmik 3D deneyimi).
- **Backend:** Node.js (Express), tRPC (Tip güvenli iletişim).
- **Veritabanı:** Drizzle ORM + PostgreSQL.
- **Entegrasyonlar:** Real-time WebSocket (Chat), S3/Cloudinary (Medya yönetimi), Iyzico (Ödemeler).

## 3. Yapılan İşler (Geçmiş ve Mevcut Durum)
- [x] **Altyapı Konsolidasyonu:** Skill çakışmaları ve MCP yapılandırmaları düzeltildi.
- [x] **Linting ve Tip Güvenliği:** ESLint (Flat Config) kurulumu, tip hatalarının %90'ı giderildi.
- [x] **Kod Temizliği:** Ölü/Kullanılmayan 9+ bileşen silindi.
- [x] **Versiyon Kontrolü:** CI/CD süreçleri ve GitHub depo senkronizasyonu aktif.

## 4. Teknik Borçlar ve Eksikler (TODO)
- **Kritik:** Hook bağımlılık hataları (`exhaustive-deps`) ve `any` türlerinin tamamen temizlenmesi.
- **Özellik:** WebSocket entegrasyonu (Mock'tan Real'e geçiş).
- **Finansal:** Iyzico ödeme sistemi ve webhook handler kurulumu.
- **Medya:** Watermark sistemi ve otomatik görsel işleme hattı.

## 5. Gelecek Adımlar (Yol Haritası)

### Adım 1: Kod Sağlığı Sprinti (Bu hafta)
- [ ] Hook'larda `exhaustive-deps` hatalarını `useCallback` ile refactor et.
- [ ] Tüm `any` tiplerini `src/types/` altındaki interfacelerle değiştir.
- [ ] `no-console` kurallarını uygulayarak logları `browserLogger.ts` servisine taşı.

### Adım 2: WebSocket & İletişim Sprinti
- [ ] `src/services/realWebSocket.ts` gerçek bağlantı servisini kodla.
- [ ] Chat arayüzünü (ChatWindow.tsx) gerçek soket olaylarına bağla.

### Adım 3: Ödeme & Finans Sprinti
- [ ] Iyzico API entegrasyonunu `/api/payment` rotasına ekle.
- [ ] Webhook handler ile başarılı ödemeleri veritabanına işle.

---
*Proje durumu her sprint sonunda güncellenecektir.*
