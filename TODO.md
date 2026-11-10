# Zühre Planet — Görev İndeksi

Eski tarihli, kaynak kodla uyuşmayan görev listeleri bu dosyada tutulmuyor. Öncelikli açık işler ve kabul ölçütleri [docs/ROADMAP.md](./docs/ROADMAP.md) içindedir.

## Bu teslimde tamamlanan bakım

- [x] Admin API filtre eşlemesi, BAD_REQUEST doğrulaması, sayfalama ve batch sayımları.
- [x] Sahte online/tarih/fiyat/priority alanlarını null veya bilinmiyor olarak gösterme.
- [x] Rapor hedefi N+1 sorgusunu kaldırma ve no-op “Kanıtları Gör” eylemini çıkarma.
- [x] Admin kişisel veri export'unu kapsam/audit akışı yokken kapatma.
- [x] Age gate ve panic shortcut regresyon testleri; storage ve yaş ifadesi düzeltmeleri.
- [x] Face mask overlay'in gerçek dosyayı maskelemediğini açıkça belirtme.
- [x] Dokümantasyon komut kontrolü, proje haritası ve güvenlik becerisi.

## Açık işin tek kaynağı

1. **P0:** Hukuk, yaş/kimlik güvencesi, rıza, moderasyon ve veri koruma — [ROADMAP P0](./docs/ROADMAP.md#p0--yayın-engelleri-ürünuyum-kararı-olmadan-başlatmayın).
2. **P1:** DB migration, gerçek DB gate/admin testleri, güvenli medya — [ROADMAP P1](./docs/ROADMAP.md#p1--veri-tabanı-ve-uçtan-uca-güvenlik).
3. **P2:** ESLint uyarı temizliği, CI, E2E ve performans — [ROADMAP P2](./docs/ROADMAP.md#p2--sürekli-entegrasyon-kod-sağlığı-ve-performans).
4. **P3–P4:** Ürün/veri kararları, erişilebilirlik ve içerik doğruluğu — [ROADMAP](./docs/ROADMAP.md).

Typecheck/test/docs/build komutları README'dedir. E2E yalnız disposable test DB'siyle çalıştırılır.
