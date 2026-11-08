import { useState, useMemo, useEffect, memo, lazy, Suspense } from 'react';
import { useSearchParams } from 'wouter';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { SeductiveCard } from '@/components/ui/SeductiveCard';
import { AdvancedFilterPanel } from '@/components/AdvancedFilterPanel';
import { PremiumHeroBanner } from '@/components/PremiumHeroBanner';
import { StoryRingGallery } from '@/components/StoryRing';
import { DiscoveryFeed } from '@/components/DiscoveryFeed';
import { Search, SlidersHorizontal, X, Map as MapIcon, Grid } from 'lucide-react';
import { LipsIcon, MaskIcon } from '@/components/ui/SensualIcons';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { SEOManager } from '@/components/SEOManager';
import { listingService } from '@/services/listingService';
import { ListingProfile } from '@/types/domain';
import { QuickViewModal } from '@/components/listings/QuickViewModal';
import logger from '@/lib/browserLogger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Phase 3: Lazy Load Heavy Map
// MapListing named export olduğu için default'a çevrilir (aksi halde harita görünümü açılırken çöker)
const MapListing = lazy(() => import('@/components/MapListing').then((m) => ({ default: m.MapListing })));

const CatalogHeader = memo(({ title, subtitle }: { title: string, subtitle: string }) => (
  <PremiumHeroBanner title={title} subtitle={subtitle} />
));
CatalogHeader.displayName = 'CatalogHeader';

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<ListingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedProfile, setSelectedProfile] = useState<ListingProfile | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const data = await listingService.getListings();
        setListings(data);
      } catch (error) {
        logger.error('Failed to fetch listings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Debounce Effect: Optimize Search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredEscorts = useMemo(() => {
    return listings.filter(escort => {
      const name = (escort.displayName || escort.stageName || '').toLowerCase();
      if (debouncedQuery && !name.includes(debouncedQuery.toLowerCase())) return false;
      const city = searchParams.get('location');
      if (city && escort.city.toLowerCase() !== city.toLowerCase()) return false;
      const district = searchParams.get('district');
      if (district && escort.district?.toLowerCase() !== district.toLowerCase()) return false;
      return true;
    });
  }, [listings, searchParams, debouncedQuery]);

  // Sort: Diamond > Platinum > Gold > Elite > Standard
  const sortedEscorts = useMemo(() => {
    const tierOrder: Record<string, number> = { 'diamond': 0, 'platinum': 1, 'gold': 2, 'elite': 3, 'vip': 4, 'standard': 5 };
    return [...filteredEscorts].sort((a, b) => {
      const tierA = tierOrder[a.membershipTier] ?? 99;
      const tierB = tierOrder[b.membershipTier] ?? 99;
      return tierA - tierB;
    });
  }, [filteredEscorts]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(key);
    setSearchParams(params);
  };

  const activeFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'q' && value) filters[key] = value;
    });
    return filters;
  }, [searchParams]);

  return (
    <div className={`min-h-screen bg-transparent pb-40 ${isDark ? 'heat-haze' : ''}`}>
      <SEOManager 
        title="Arzu Kataloğu - Zühre Planet" 
        description="Türkiye'nin en şehvetli ve elit escort kataloğu. Shadow-X lüks deneyimi." 
      />

      <CatalogHeader
        title="ARZU BÜLTENİ"
        subtitle="Zühre Planet'in en gizemli ve şehvetli yıldızlarını keşfetme zamanı."
      />

      <div className="relative z-20 -mt-24 mb-16 px-4">
        <StoryRingGallery 
          storyGroups={[
            { userId: '1', userName: 'Elara', avatar: '/brand/placeholders/portrait-3.svg', tier: 'vip', isVip: true, items: [{ id: 's1', type: 'image', url: '/brand/placeholders/portrait-2.svg', duration: 3 }] },
            { userId: '2', userName: 'Luna', avatar: '/brand/placeholders/portrait-3.svg', tier: 'platinum', isVip: true, items: [{ id: 's2', type: 'image', url: '/brand/placeholders/portrait-1.svg', duration: 4 }] }
          ]} 
        />
      </div>

      {/* Discovery Feed Section (Phase 2 Social Pulse) */}
      <div className="max-w-[1920px] mx-auto px-6 md:px-20">
         <DiscoveryFeed />
      </div>

      <main className="max-w-[1920px] mx-auto px-6 md:px-20 py-10 relative z-10">
        
        {/* Search & Layout Toggle */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 mb-12 md:mb-24 items-center justify-between border-b border-white/5 pb-10 md:pb-16">
          <div className="relative w-full lg:max-w-[700px] group">
            <Search className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 w-5 h-5 md:w-7 md:h-7 text-primary group-focus-within:scale-110 transition-transform" />
            <input
              type="text"
              placeholder="ARZU BÜLTENİNDE ARA..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-16 md:pl-24 pr-8 md:pr-12 py-5 md:py-8 focus:outline-none focus:border-primary/50 transition-all font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs italic text-white placeholder:text-white/20 text-shadow-premium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <Button
              onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
              variant="outline"
              className="flex-1 lg:flex-none h-14 md:h-20 px-8 md:px-12 rounded-full border-white/10 glass-panel hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] gap-3 italic"
            >
              {viewMode === 'grid' ? <MapIcon className="w-4 h-4 md:w-5 md:h-5 text-primary" /> : <Grid className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
              {viewMode === 'grid' ? 'HARİTADA GÖR' : 'LİSTEYE DÖN'}
            </Button>
            
            <Button
              onClick={() => setIsFilterOpen(true)}
              variant="outline"
              className="flex-1 lg:flex-none h-14 md:h-20 px-8 md:px-12 rounded-full border-white/10 glass-panel hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] gap-3 italic"
            >
              <SlidersHorizontal className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              FİLTRELE
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {Object.keys(activeFilters).length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-12 overflow-hidden"
            >
              {Object.entries(activeFilters).map(([key, value]) => (
                <Badge 
                  key={key} 
                  variant="secondary" 
                  className="px-5 md:px-8 py-2 md:py-3 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic"
                >
                  <span className="opacity-60">{key}:</span> {value}
                  <X 
                    className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:scale-120 transition-transform" 
                    onClick={() => removeFilter(key)}
                  />
                </Badge>
              ))}
              <Button 
                variant="link" 
                onClick={() => setSearchParams(new URLSearchParams())}
                className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white"
              >
                TEMİZLE
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Catalog Content (Grid or Map) */}
        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" text="GALAKSİ TARANIYOR..." />
          </div>
        ) : viewMode === 'map' ? (
          <div className="h-[800px] rounded-[3rem] overflow-hidden border border-white/5 relative glass-panel">
            <Suspense fallback={<LoadingSpinner text="HARİTA YÜKLENİYOR..." />}>
              <MapListing profiles={sortedEscorts} />
            </Suspense>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-10">
            {sortedEscorts.map((escort, i) => (
              <motion.div
                key={escort.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <SeductiveCard
                  profile={escort}
                  onQuickView={setSelectedProfile}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && sortedEscorts.length === 0 && (
          <div className="py-60 flex flex-col items-center text-center">
            <div className="w-24 h-24 mb-10 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center opacity-30">
              <MaskIcon size={40} className="text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4 uppercase italic tracking-tighter text-white">YÖRÜNGE DIŞI</h2>
            <p className="text-white/40 max-w-md font-black uppercase tracking-widest text-xs italic">Aramanıza uygun hiçbir yıldız bulunamadı. Filtreleri temizlemeyi deneyin.</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            key="filter-drawer"
            className="fixed inset-0 z-[120] flex justify-end bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Filtreler"
          >
            <motion.aside
              className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-background/95 p-6"
              initial={{ x: 40 }}
              animate={{ x: 0 }}
              exit={{ x: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex justify-end">
                <Button variant="ghost" size="icon" aria-label="Filtreleri kapat" onClick={() => setIsFilterOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <AdvancedFilterPanel
                onFilterChange={(filters) => {
                  handleFilterChange({ ...activeFilters, ...filters });
                }}
                onReset={() => setSearchParams(new URLSearchParams())}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedProfile && (
        <QuickViewModal
          onClose={() => setSelectedProfile(null)}
          profile={selectedProfile}
        />
      )}

      <Footer />
      <BottomNav />
    </div>
  );
}
