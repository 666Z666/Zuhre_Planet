# Zühre Planet

Türkiye odaklı, yetişkinlere yönelik ilan/listeme ürünü için React istemci ve Express/tRPC API. Bu depo bir **geliştirme tabanıdır**; hukuki, kimlik/yaş güvencesi, moderasyon, veri koruma ve operasyonel yayın kapıları tamamlanmadan production'a çıkarılmamalıdır.

> Platform içi yaş beyanı tek başına kimlik veya yaş doğrulaması değildir. Herkese açık ilanlar için sunucu tarafında ortak yayın koşulu kullanılır; bu, gerçek dünyadaki güvence/uyum yükümlülüklerinin yerine geçmez. Platform randevu/rezervasyon aracılığı yapmamalı; kapsam değişikliği hukuk incelemesine tabidir.

## Kaynak belgeler

- [Türkçe proje haritası](./docs/PROJE_HARITASI.md) — geçerli mimari, dizinler ve doğrulanmış durum.
- [Yol haritası](./docs/ROADMAP.md) — önceliklendirilmiş açık işler ve kabul koşulları.
- [Aktif teknik işler](./DEVELOPMENT_TODO.md) ve [kısa görev özeti](./TODO.md).
- [Yetişkin ilan pazaryerleri için güvenlik becerisi](./.agent/skills/adult-marketplace-safety-engineering/SKILL.md).

## Teknoloji

- React 18, TypeScript, Vite 5, Tailwind CSS, wouter.
- Node.js, Express 5, tRPC 11, Zod.
- PostgreSQL, Drizzle ORM.
- Vitest; Playwright E2E altyapısı.

## Yerel kurulum (Windows PowerShell)

Gereksinimler: Node.js sürümü ve bağımlılıklar için `package.json` / lockfile'ı esas alın; PostgreSQL yalnız API ve DB gerektiren akışlar için gerekir.

```powershell
Copy-Item .env.example .env
npm ci
```

`.env` içindeki yerel DB bağlantısını ve geliştirme secret'larını kendi makinenize göre düzenleyin. Örnek değerleri production'da kullanmayın. `CONTACT_ENC_KEY` gerçek telefon verisi saklanacak bir ortamda gizli ve yedekli tutulmalıdır; anahtar kaybı şifreli iletişim verisini erişilemez kılabilir.

Şemayı yalnızca izole yerel geliştirme veritabanında uygulayın:

```powershell
npm run db:migrate
```

İki ayrı terminal açın:

```powershell
# Terminal 1 — API (PORT varsayılanı .env'de 4000)
npm run dev:server
```

```powershell
# Terminal 2 — Vite istemcisi
npm run dev
```

Varsayılan adresler: istemci `http://127.0.0.1:5173`, API `http://127.0.0.1:4000`. `.env.example` demo/mock modu için güvenli geliştirme varsayılanları içerir. API test etmek isterseniz `VITE_LISTING_SOURCE=api` ve `VITE_ENABLE_REAL_API=true` ayarlarının kullanıldığı ayrı yerel ortamı yapılandırın. Production listelemesi gerçek API'ye kapalı devre bağlanır; mock veri production kaynağı olarak kullanılmamalıdır.

## Doğrulama komutları

```powershell
npm run typecheck
npm run test:ci
npm run check:docs
npm run build
```

`npm run lint` ve `npm run lint:strict` komutları repo genelindeki mevcut ESLint kapsamını tarar; bilinen ESLint yapılandırma/uyarı borcu henüz temizlenmemiştir. Bu nedenle lint sonucu temizmiş gibi kabul etmeyin; release öncesi [roadmap'teki lint/CI maddelerini](./docs/ROADMAP.md) tamamlayın. `npm run test:e2e` yalnızca ayrılmış ve güvenli test DB'si/yapılandırmasıyla çalıştırılmalıdır; production verisine karşı çalıştırmayın.

`npm run db:reset` `public` şemasını geri alınamaz biçimde siler. Komut yalnız `NODE_ENV=development` veya `test`, loopback PostgreSQL URL'si ve açık `ALLOW_DB_RESET=true` onayıyla çalışır; yine de yalnız atılabilir veritabanında kullanın. PowerShell örneği:

```powershell
$env:ALLOW_DB_RESET = 'true'
npm run db:reset
Remove-Item Env:ALLOW_DB_RESET
```

Bu koruma production/staging ya da uzak DB hedeflerini reddeder; gerçek veri içeren yerel DB'de kullanmayı güvenli hâle getirmez.

## Güvenlik ve yayın kapıları

- İlanın public olma koşulu sunucudaki ortak `server/lib/publicListing.ts` kuralında tutulur; public API uçları bu kuralı paylaşır.
- Yaş kapısı bir öz-beyandır; gerçek yaş/kimlik kontrolü olarak sunulmamalıdır.
- İletişim verisi ve kişisel bilgiler hassastır. Ham numarayı loglamayın; secret'ları repoya koymayın.
- Admin aksiyonlarını, onay/red durumlarını, medya akışını ve raporları ayrıcalık en azlığı ve denetim iziyle doğrulayın.
- Hukuki inceleme, gerçek age/identity assurance tasarımı, veri saklama/ihlal planı, moderasyon iş akışı ve production secrets tamamlanana kadar indeksleme kapalı tutulmalıdır (`SEO_INDEXING=false`, `VITE_SEO_INDEXING=false`).
- Ödeme, iletişim aracılığı, randevu/rezervasyon veya yeni ürün kapsamı için ayrıca hukuk ve güvenlik incelemesi gerekir; mevcut entegrasyon/dependency varlığı etkin veya onaylı ürün yeteneği anlamına gelmez.

## Trafik ve pazar araştırması

Bu kopyada doğrulanmış production alan adı veya Similarweb trafik verisi bulunmuyor; bu teslimde trafik/rekabet metriği üretilmedi. Alan adı ve yetkili kapsam netleştiğinde Similarweb tahminleri kaynak, tarih ve sınırlılıklarıyla ayrı raporlanmalı; tahminleri birinci taraf analitik/veri gibi sunmamalıdır.

## Proje içi beceri

Yetişkin ilan dizinleri/pazaryerleri için yeniden kullanılabilir güvenlik ve yayın kontrol becerisi `.agent/skills/adult-marketplace-safety-engineering/` altındadır. Proje yönergeleri için `AGENTS.md` ve becerinin `SKILL.md` dosyasını okuyun.
