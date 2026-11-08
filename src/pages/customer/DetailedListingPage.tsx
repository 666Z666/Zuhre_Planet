/**
 * Detailed Listing Page
 * 
 * Escort profili detayları, galerisi, hizmetleri ve rezervasyon formu.
 */

import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEOManager } from '@/components/SEOManager';
import { FullPageLoading } from '@/components/LoadingStates';

// Mock data (API call simulation)
const MOCK_PROFILE = {
  id: '1',
  name: 'Alya',
  age: 24,
  city: 'İstanbul',
  district: 'Beşiktaş',
  rating: 4.9,
  reviews: 124,
  price: 2500,
  bio: 'Profesyonel modellik geçmişi olan, her zaman güler yüzlü ve kaliteli zaman geçirmeyi seven bir partnerim. Özel davetler ve akşam yemekleri için idealim.',
  images: [
    '/brand/placeholders/portrait-1.svg',
    '/brand/placeholders/portrait-1.svg',
    '/brand/placeholders/portrait-4.svg',
  ],
  services: ['Akşam Yemeği', 'Özel Davet', 'Modellik', 'Masaj', 'Eskort'],
  workingHours: '10:00 - 02:00',
  languages: ['Türkçe', 'İngilizce'],
  isOnline: true,
  verified: true
};

export default function DetailedListingPage() {
  const [, params] = useRoute('/listing/:id');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [params?.id]);

  if (loading) return <FullPageLoading />;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-20">
      <SEOManager 
        title={`${MOCK_PROFILE.name} - ${MOCK_PROFILE.city} Escort Profili`}
        description={`${MOCK_PROFILE.name} (${MOCK_PROFILE.age}), ${MOCK_PROFILE.city} - ${MOCK_PROFILE.district} bölgesinde hizmet vermektedir. Detaylı profil, resimler ve yorumlar için tıklayın.`}
        ogImage={MOCK_PROFILE.images[0]}
        ogType="profile"
      />

      {/* Top Header / Navigation */}
      <div className="sticky top-0 z-40 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button className="p-2 rounded-full hover:bg-white/5 transition-colors" onClick={() => window.history.back()}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-4">
          <button 
             onClick={() => setIsFavorite(!isFavorite)}
             className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-pink-500/20 text-pink-500 shadow-xl' : 'hover:bg-white/5 text-white/50'}`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 text-white/50 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Section */}
        <section className="space-y-4">
          <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
             <AnimatePresence mode="wait">
               <motion.img
                 key={activeImage}
                 src={MOCK_PROFILE.images[activeImage]}
                 initial={{ opacity: 0, scale: 1.1 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 className="w-full h-full object-cover"
               />
             </AnimatePresence>
             
             {/* Navigation Overlay */}
             <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between">
               <div className="flex gap-2">
                 {MOCK_PROFILE.images.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${activeImage === i ? 'w-8 bg-emerald-400' : 'w-2 bg-white/20'}`}
                    />
                 ))}
               </div>
               <div className="flex gap-2">
                 <button 
                   onClick={() => setActiveImage(prev => (prev > 0 ? prev - 1 : MOCK_PROFILE.images.length - 1))}
                   className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20"
                 >
                   <ChevronLeft className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={() => setActiveImage(prev => (prev < MOCK_PROFILE.images.length - 1 ? prev + 1 : 0))}
                   className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20"
                 >
                   <ChevronRight className="w-5 h-5" />
                 </button>
               </div>
             </div>

             {MOCK_PROFILE.isOnline && (
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase text-green-400 tracking-tighter">ONLINE</span>
                </div>
             )}
          </div>
        </section>

        {/* Info Section */}
        <section className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black font-orbitron uppercase tracking-tighter">{MOCK_PROFILE.name}</h1>
              {MOCK_PROFILE.verified && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-white font-bold">{MOCK_PROFILE.rating}</span>
                <span>({MOCK_PROFILE.reviews} yorum)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{MOCK_PROFILE.city}, {MOCK_PROFILE.district}</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Saatlik Ücret</span>
              <div className="text-2xl font-black text-white font-orbitron">{MOCK_PROFILE.price} <span className="text-xs text-emerald-500 uppercase tracking-widest ml-1">Kredi</span></div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="space-y-1 text-right">
              <span className="text-xs text-info font-bold uppercase tracking-widest">Yaş</span>
              <div className="text-2xl font-black text-white font-orbitron">{MOCK_PROFILE.age}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400">Hakkımda</h3>
            <p className="text-gray-400 leading-relaxed font-light text-lg">
              {MOCK_PROFILE.bio}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-pink-400">Hizmetler</h3>
            <div className="flex flex-wrap gap-2">
              {MOCK_PROFILE.services.map((service, i) => (
                <Badge key={i} className="bg-white/5 text-white/70 py-2 border-white/10 hover:bg-white/10 transition-all">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-gold-400" />
              <div className="text-xs">
                <p className="text-gray-500 font-bold uppercase mb-0.5">Çalışma Saatleri</p>
                <p className="text-white font-black">{MOCK_PROFILE.workingHours}</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <Globe className="w-5 h-5 text-emerald-400" />
              <div className="text-xs">
                <p className="text-gray-500 font-bold uppercase mb-0.5">Diller</p>
                <p className="text-white font-black">{MOCK_PROFILE.languages.join(', ')}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-4">
            <Button size="lg" className="flex-1 h-16 bg-white text-black hover:bg-gray-200 font-black uppercase text-sm tracking-widest rounded-2xl shadow-xl shadow-white/5">
              <MessageSquare className="w-5 h-5 mr-3" /> Mesaj Gönder
            </Button>
            <Button size="lg" variant="outline" className="flex-1 h-16 glass border-white/10 hover:bg-white/5 font-black uppercase text-sm tracking-widest rounded-2xl">
              <Calendar className="w-5 h-5 mr-3" /> Randevu Al
            </Button>
          </div>

          {/* Safety Warning */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
            <div className="text-xs leading-relaxed text-gray-500">
              <strong className="text-emerald-400 uppercase block mb-1">Kaptan Güvencesi</strong>
              Bu profil Zühre Planet AI Moderasyon ve Manuel İnceleme ekipleri tarafından %100 doğrulanmıştır. Ödemeleriniz Kaptan güvencesi altındadır.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
