# Zühre Planet Geliştirme Planı - 2026-04-26

Bu plan mevcut env/security düzeltmesinden sonra izlenecek yerel geliştirme sırasını tanımlar. Amaç önce çalışma temelini sağlamlaştırmak, sonra ürün modüllerini kontrollü şekilde genişletmektir.

## 1. Stabil Temel

- Merkezi env doğrulamasını tek kaynak olarak koru: `src/config/env.ts`.
- `process.env` kullanımını server tarafında kademeli olarak merkezi `env` nesnesine taşı.
- `npm run build:server`, `npm run build`, `npm run test:ci` kapıları geçmeden yeni özellik tamamlanmış sayılmayacak.
- Yerel çalışma için Postgres, `.env`, migrasyon ve seed akışı birlikte doğrulanacak.

## 2. Güvenlik ve Oturum

- REST auth ve tRPC auth akışlarında access/refresh token ayrımı tamamlanacak.
- Refresh token rotaları sadece `JWT_REFRESH_SECRET` ile doğrulanacak.
- CSRF kapsamı route bazında tekrar gözden geçirilecek; login/register gibi state-changing endpointler açık bırakılmayacak.
- CORS allowlist sadece merkezi env doğrulamasından beslenecek.

## 3. Ödeme ve Email

- Production ortamında Iyzico ve SMTP secret eksikse uygulama fail-fast davranacak.
- Development ortamında gerçek secret yoksa ödeme mock akışı ve email json transport açıkça kullanılacak.
- Ödeme callback URL kaynağı `APP_URL` / `VITE_APP_URL` üzerinden standardize edilecek.
- Iyzico webhook ve ödeme doğrulama testleri ayrı dosyada eklenecek.

## 4. Ürün Modülleri

- Admin panelinde kullanıcı, ilan, medya onayı ve rapor akışları öncelikli stabilizasyon alanı.
- Escort profil düzenleme, fotoğraf yönetimi ve takvim modülleri gerçek API kontratlarıyla temizlenecek.
- Customer mesaj, geçmiş, ayarlar ve sadakat ekranları mock bağımlılıklarından ayrıştırılacak.
- Forum/topluluk akışı için persistence ve moderation kuralları tekrar test edilecek.

## 5. Dokümantasyon ve Operasyon

- `docs/system/*` dosyaları gerçek dosya haritasıyla güncel tutulacak.
- Her büyük teknik değişiklik için kısa doğrulama notu ve çalıştırılan komutlar dokümana eklenecek.
- GitHub güncellemeleri küçük, konu bazlı commitlerle yapılacak.
