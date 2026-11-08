# Zühre Planet - Yeni Geliştirme Planı

Tarih: 2026-04-26

Bu plan, mevcut TODO listesindeki açık işleri ürün değerine ve teknik riske göre sıraya koymak için oluşturuldu. İlk küçük başlangıç görevi olarak admin giriş ekranı kozmik tema ile tutarlı hale getirildi ve TODO güncellendi.

## 1. Kısa Vadeli Sağlık Kapısı

- `npm run build` ve `npm run test:ci` ana kalite kapısı olarak düzenli çalıştırılacak.
- Lint çıktısı ayrı ele alınacak; önce hata ve parse kırıkları, sonra uyarılar temizlenecek.
- Yerel `.env` ve test hesapları dokümantasyonla uyumlu tutulacak, secret içeren dosyalar paylaşılmayacak.

## 2. Kozmik Tema Konsolidasyonu

- `src/styles/` altındaki `cosmic-theme.css`, `premium-theme.css`, `space-theme.css`, `3d-effects.css` ve benzeri dosyalar sınıf çakışmaları için taranacak.
- Tekrarlanan glow, glass panel, başlık ve kart sınıfları ortak token/sınıf setine indirilecek.
- Auth ekranlarında kullanılan müşteri, escort ve admin paletleri korunacak: cyan, purple, rose.

## 3. 3D Arka Plan Entegrasyonu

- `src/components/3d/UniverseScene.tsx` gerçek kullanım noktası belirlenerek `App.tsx` veya layout seviyesinde kontrollü bağlanacak.
- Mobil cihazlarda performans için animasyon yoğunluğu ve render koşulları düşürülecek.
- İlk doğrulama hedefi: ana sayfa, login sayfaları ve dashboard açılışında görsel bozulma olmaması.

## 4. Admin Operasyon Akışı

- Admin dashboard üzerindeki kullanıcı, ilan, medya ve finans sekmeleri tek bir kontrol akışı olarak gözden geçirilecek.
- Kritik admin aksiyonları için başarı/hata durumları görünür hale getirilecek.
- Gerekli görülen yerlerde audit log ve kullanıcıya gösterilen geri bildirim metinleri standartlaştırılacak.

## 5. Test ve Dokümantasyon

- Login ve temel navigasyon için Playwright smoke senaryoları güncellenecek.
- Admin giriş ekranı için rol dışı kullanıcı erişim reddi senaryosu test planına eklenecek.
- `docs/PROJECT_MAP.md` ve `TODO.md`, tamamlanan işler sonrasında küçük ve düzenli güncellenecek.

## Sıradaki Önerilen Görev

Önce `npm run build` çıktısı temizlenmeli. Eğer build geçerse, sonraki uygulama görevi `src/styles/` tema sınıflarını envanterleyip tekrar eden glass/card/title stillerini tek bir küçük konsolidasyon PR'ına indirmek olmalı.
