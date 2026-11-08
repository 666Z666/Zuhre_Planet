/**
 * Şehir / ilçe ilan sayfası — /konum/:city/:district?
 *
 * Rakip analizi (D.3): ilçe kırılımı Türkiye'de gerçek farklılaştırıcı, ama boş ya da
 * az ilanlı sayfalar "doorway page" sayılıp tüm alan adını cezalandırır. Bu yüzden:
 *  - < MIN_LISTINGS_FOR_INDEX ilan → noindex
 *  - VITE_SEO_INDEXING !== 'true' (hukuki onay yok) → her durumda noindex
 *  - Sayfada gerçek sayı ve gerçek ilanlar; uydurma metin yok.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { MapPin, BadgeCheck, ChevronRight } from 'lucide-react';
import { SEOManager } from '@/components/SEOManager';
import { SeductiveCard } from '@/components/ui/SeductiveCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { listingService } from '@/services/listingService';
import { resolveCityName, resolveDistrictName, getDistrictsByCity, sameLocation } from '@/data/locations';
import type { ListingProfile } from '@/types/domain';
import { useT } from '@/contexts/LanguageContext';

export const MIN_LISTINGS_FOR_INDEX = 3;

export function locationIndexable(count: number, indexingEnabled: boolean): boolean {
  return indexingEnabled && count >= MIN_LISTINGS_FOR_INDEX;
}

export function slugOf(name: string): string {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };
  return name
    .normalize('NFC')
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşüâîû]/g, (c) => map[c] ?? c)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const isVerified = (l: ListingProfile) => Boolean(l.hasVerifiedBadge || l.verificationStatus === 'verified');

export default function LocationListings() {
  const params = useParams<{ city: string; district?: string }>();
  const t = useT();
  const cityName = resolveCityName(params.city) ?? params.city;
  const districtName = params.district ? resolveDistrictName(params.city, params.district) : undefined;

  const [listings, setListings] = useState<ListingProfile[]>([]);
  const [cityListings, setCityListings] = useState<ListingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    // Şehrin tüm ilanları: hem bu sayfa hem "diğer ilçeler" bağlantıları için
    listingService
      .getListings({ city: cityName, limit: 100 })
      .then((all) => {
        if (cancelled) return;
        setCityListings(all);
        setListings(districtName ? all.filter((l) => sameLocation(l.district, districtName)) : all);
      })
      .catch(() => { if (!cancelled) { setCityListings([]); setListings([]); } })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [cityName, districtName]);

  // Sıralama: doğrulanmış > öne çıkarılmış (sunucuyla aynı kural)
  const sorted = useMemo(
    () => [...listings].sort((a, b) =>
      (isVerified(b) ? 2 : 0) + (b.isBoosted ? 1 : 0) - ((isVerified(a) ? 2 : 0) + (a.isBoosted ? 1 : 0))),
    [listings],
  );

  // Aynı şehirde ilanı olan diğer ilçeler (yalnız gerçek arzı olanlara iç bağlantı)
  const siblingDistricts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of cityListings) if (l.district) counts.set(l.district, (counts.get(l.district) ?? 0) + 1);
    return [...counts.entries()]
      .filter(([d]) => !sameLocation(d, districtName))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24);
  }, [cityListings, districtName]);

  const count = listings.length;
  const verifiedCount = listings.filter(isVerified).length;
  const placeLabel = districtName ? `${districtName}, ${cityName}` : cityName;
  const indexingEnabled = import.meta.env.VITE_SEO_INDEXING === 'true';
  const indexable = !isLoading && locationIndexable(count, indexingEnabled);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const citySlug = slugOf(cityName);
  const path = districtName ? `/konum/${citySlug}/${slugOf(districtName)}` : `/konum/${citySlug}`;
  const knownCity = getDistrictsByCity(cityName).length > 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t('location.home'), item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: cityName, item: `${origin}/konum/${citySlug}` },
          ...(districtName ? [{ '@type': 'ListItem', position: 3, name: districtName, item: `${origin}${path}` }] : []),
        ],
      },
      {
        '@type': 'ItemList',
        name: t('location.listings', { place: placeLabel }),
        numberOfItems: count,
        itemListElement: sorted.slice(0, 20).map((l, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${origin}/escort/${l.id}`,
          name: l.displayName,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-transparent pb-40">
      <SEOManager
        title={t('location.listings', { place: placeLabel })}
        description={
          count > 0
            ? `${t('location.listings', { place: placeLabel })}: ${t('location.active', { count })}${verifiedCount ? `, ${t('location.verified', { count: verifiedCount })}` : ''}.`
            : t('location.empty', { place: placeLabel })
        }
        canonical={`${origin}${path}`}
        noindex={!indexable}
      />
      {count > 0 && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-28 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label={t('filters.location')} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/50">
          <Link href="/" className="hover:text-primary">{t('location.home')}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/konum/${citySlug}`} className="hover:text-primary">{cityName}</Link>
          {districtName && (<><ChevronRight className="w-3 h-3" /><span className="text-white/80">{districtName}</span></>)}
        </nav>

        <header className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary" /> {placeLabel}
          </h1>
          {!isLoading && (
            <p className="text-sm font-bold text-white/70 flex flex-wrap items-center gap-4">
              <span>{t('location.active', { count })}</span>
              {verifiedCount > 0 && (
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <BadgeCheck className="w-4 h-4" /> {t('location.verified', { count: verifiedCount })}
                </span>
              )}
            </p>
          )}
          {!knownCity && !isLoading && (
            <p className="text-xs text-amber-300">{t('location.unknown')}</p>
          )}
        </header>

        {isLoading ? (
          <div className="py-24 flex justify-center"><LoadingSpinner size="lg" /></div>
        ) : count > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((l) => <SeductiveCard key={l.id} profile={l} />)}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <p className="text-white/70 font-bold">{t('location.empty', { place: placeLabel })}</p>
            <Link href="/catalog" className="inline-block text-primary font-black uppercase tracking-widest text-xs hover:underline">
              {t('location.browseAll')}
            </Link>
          </div>
        )}

        {siblingDistricts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-white/60">
              {t('location.otherDistricts', { city: cityName })}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {siblingDistricts.map(([d, n]) => (
                <li key={d}>
                  <Link
                    href={`/konum/${citySlug}/${slugOf(d)}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-white/80 hover:border-primary/50"
                  >
                    {d} <span className="text-white/40">{n}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
