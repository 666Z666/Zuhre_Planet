# Release Readiness — [Proje] — [Tarih]

## Kapsam ve sınırlar
- İncelenen commit/snapshot:
- Ürün kapsamı ve açıkça kapsam dışı işler:
- İncelenen ortam (production secret/DB kullanılmadı mı?):

## Özet
[Durumu kanıta dayalı bir paragrafla açıklayın. Hukuk/ürün onayı varsaymayın.]

## Bulgular
| Öncelik | Bulgu | Kanıt / dosya | Durum | Düzeltme / bağımlılık |
|---|---|---|---|---|
| P0 | | | Açık / Düzeltildi / Bloke | |

## Doğrulama
| Komut / kontrol | Sonuç | Kanıt / sınır |
|---|---|---|
| Typecheck | | |
| Test | | |
| Build | | |
| Lint | | |
| E2E | | Test DB'si yoksa çalıştırılmadığını yazın. |

## Yayın kapıları
- [ ] Yaş/consent ve admin onay kapısı tüm public yüzeylerde test edildi
- [ ] Takedown/reddetme public erişimi kapatıyor
- [ ] İletişim/kimlik verisi minimizasyonu, şifreleme ve rate limit gözden geçirildi
- [ ] Gerçek dışı KPI/JSON-LD/ürün vaadi yok
- [ ] Hukuki ve ürün onayları yazılı alındı veya yayın bloke olarak işaretlendi
- [ ] DB migration/backup/rollback ve sırlar için operasyon planı onaylandı

## Gelecek işler
1. [İş] — öncelik, bağımlılık, kabul kriteri, sorumlu/karar sahibi.
