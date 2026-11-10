/**
 * Escort Listings Page (Galaxy Edition)
 * 
 * Dinamik Tetris Grid yapısı, gelişmiş filtreleme ve Quick View özelliği ile
 * zenginleştirilmiş ilan listeleme sayfası.
 * "Deep Space Luxury" temasına uygun.
 * 
 * @module pages/EscortList
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Filter, Sparkles, Search, MapPin, 
  ChevronDown, Plus
} from 'lucide-react';

// Domain Types & Service
import { ListingProfile } from '@/types/domain';
import { listingService } from '@/services/listingService';

// UI Components
import { StandardCard } from '@/components/StandardCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/pages/SEO';
import { ProfileQuickViewOverlay } from '@/components/ProfileQuickViewOverlay';

export default function EscortList() {
  const [listings, setListings] = useState<ListingProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Quick View State
  const [selectedProfile, setSelectedProfile] = useState<ListingProfile | null>(null);

  // Veri Çekme
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const data = await listingService.getListings();
        setListings(data);
      } catch (error) {
        console.error("İlanlar yüklenirken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="Zuhre Planet | Seçkin İlanlar"
        description="Galaksinin en parlak yıldızlarını keşfedin."
      />

      {/* --- HERO HEADER --- */}
      <div className="relative pt-24 pb-12 md:pt-40 md:pb-20 overflow-hidden">
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 backdrop-blur-md px-4 py-1.5 uppercase tracking-widest text-[10px] font-black italic">
              <Sparkles className="w-3 h-3 mr-2" /> Kozmik Vitrin
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 text-white uppercase italic text-3d h-premium">
              Yıldızlar <span className="text-primary">Geçidi</span>
            </h1>
            <p className="text-white/40 text-sm md:text-lg max-w-2xl font-black uppercase tracking-widest italic">
              Aradığınız deneyimi bulmak için galaksinin en sekin profillerini inceleyin.
            </p>
          </motion.div>

          {/* --- FILTER BAR --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-stretch md:items-center gap-3 glass-panel border-none p-3 md:p-4 max-w-5xl mx-auto shadow-2xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
              <input
                type="text"
                placeholder="İsim, şehir veya özellik ara..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-white/20 font-black uppercase tracking-widest text-[10px] italic"
              />
            </div>

            <button className="flex items-center justify-between md:justify-start gap-3 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-white/60 font-black uppercase tracking-widest text-[10px] italic">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>İstanbul</span>
              </div>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>

            <Button className="bg-primary hover:bg-primary/80 text-white font-black py-7 px-8 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-[10px] italic">
              <Filter className="w-4 h-4 mr-2" />
              FİLTRELE
            </Button>
          </motion.div>
        </div>
      </div>

      {/* --- LISTING GRID (THE BULLETIN BOARD) --- */}
      <div className="container mx-auto px-4 pb-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
            </div>
            <span className="mt-6 text-primary/40 font-black tracking-widest uppercase text-xs animate-pulse italic">Sistem Taranıyor</span>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[340px] gap-4 md:gap-8 grid-flow-dense"
          >
            {/* We simulate a Grid of 16 slots */}
            {Array.from({ length: 16 }).map((_, slotIndex) => {
               const profile = listings[slotIndex];
               
               if (profile) {
                 return (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: slotIndex * 0.03 }}
                      className="relative group"
                    >
                      {/* Slot Badge */}
                      <div className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-[8px] font-black italic text-gray-500">
                         #{slotIndex + 1}
                      </div>

                      <StandardCard
                        profile={profile}
                        onQuickView={(p) => setSelectedProfile(p)}
                      />
                    </motion.div>
                 );
               }

               // Empty Slot Placeholder
               return (
                  <motion.div 
                    key={`empty-${slotIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-1 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center group hover:bg-primary/[0.02] hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Plus className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest italic group-hover:text-primary/70">BOŞ REKLAM ALANI</p>
                    <h4 className="text-xs font-black text-gray-800 uppercase italic mt-1 group-hover:text-white">#{slotIndex + 1} NOLU SLOT</h4>
                    
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button size="sm" variant="outline" className="h-8 rounded-lg border-primary/20 text-primary text-[8px] font-black uppercase italic hover:bg-primary hover:text-white">REZERVE ET</Button>
                    </div>
                  </motion.div>
               );
            })}
          </motion.div>
        )}
      </div>

      {/* --- QUICK VIEW OVERLAY --- */}
      <ProfileQuickViewOverlay
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </div>
  );
}
