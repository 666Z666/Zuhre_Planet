import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  X, MapPin, Star, Phone, MessageCircle, Ruler, 
  Weight, User, ShieldCheck, ArrowRight
} from 'lucide-react';
import { ListingProfile } from '@/types/domain';
import { listingService } from '@/services/listingService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

interface QuickViewModalProps {
  profile: ListingProfile | null;
  onClose: () => void;
}

export function QuickViewModal({ profile, onClose }: QuickViewModalProps) {
  const [, setLocation] = useLocation();

  if (!profile) return null;

  const openContact = async (channel: 'phone' | 'whatsapp') => {
    const res = await listingService.revealContact(profile.id, channel);
    if ('error' in res) {
      toast.error(res.error);
      return;
    }
    if (channel === 'phone') window.location.href = res.url;
    else window.open(res.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {profile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
          />

          {/* Modal Content */}
          <motion.div
            layoutId={`card-${profile.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl h-full max-h-[90vh] bg-slate-950 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,1)]"
          >
            {/* Left: Image Gallery */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-full relative group">
              <img 
                src={profile.avatarUrl} 
                alt={profile.displayName} 
                className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                <Badge className="bg-primary hover:bg-primary/90 text-white font-black px-4 py-2 rounded-xl text-[10px] tracking-widest border-none shadow-2xl">
                  {profile.membershipTier.toUpperCase()}
                </Badge>
                {profile.verificationStatus === 'verified' && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-black px-4 py-2 rounded-xl text-[10px] tracking-widest backdrop-blur-xl">
                    <ShieldCheck className="w-3.5 h-3.5 mr-2" /> DOĞRULANMIŞ
                  </Badge>
                )}
              </div>

              <button 
                onClick={onClose}
                aria-label="Kapat"
                className="absolute top-8 right-8 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-xl border border-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-1/2 h-full overflow-y-auto p-8 md:p-14 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                    {profile.displayName}
                  </h2>
                  <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-2xl border border-secondary/20">
                    <Star className="w-4 h-4 text-secondary fill-current" />
                    <span className="text-lg font-black text-white italic">{profile.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-white/40 font-black uppercase text-[11px] tracking-widest mb-10 italic">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {profile.city} / {profile.district}
                  </div>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    {profile.age} YAŞ
                  </div>
                </div>

                {/* Physical DNA Sliders (Visualized) */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="glass-panel border-white/5 p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                      <div className="flex items-center gap-2"><Ruler className="w-4 h-4" /> BOY</div>
                      <span className="text-white">{profile.physicalTraits?.height || profile.height || '---'} cm</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: profile.physicalTraits?.height ? `${((profile.physicalTraits.height - 150) / 40) * 100}%` : '50%' }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="glass-panel border-white/5 p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                      <div className="flex items-center gap-2"><Weight className="w-4 h-4" /> KİLO</div>
                      <span className="text-white">{profile.physicalTraits?.weight || profile.weight || '---'} kg</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: profile.physicalTraits?.weight ? `${((profile.physicalTraits.weight - 40) / 60) * 100}%` : '50%' }}
                        className="h-full bg-secondary"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 italic">HİZMET VE ARZULAR</h4>
                  <div className="flex flex-wrap gap-3">
                    {profile.services.map((service, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/60 hover:border-primary/40 hover:text-white transition-all cursor-default">
                        {service.replace('_', ' ')}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-white/40 text-sm leading-relaxed uppercase tracking-widest font-medium mb-12 line-clamp-4">
                  {profile.biography || "Galaksinin derinliklerinden gelen bu özel yıldızın hikayesi henüz tam olarak keşfedilmedi. Premium bir deneyim için iletişime geçin."}
                </p>
              </div>

              {/* Actions - Premium 3D Responsive Buttons */}
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t border-white/5">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    onClick={() => void openContact('whatsapp')}
                    className="flex-1 h-14 md:h-16 bg-gradient-to-t from-primary/90 to-primary text-white font-black uppercase tracking-widest rounded-3xl sm:rounded-[2rem] group hover:-translate-y-1 active:translate-y-1 transition-all shadow-[0_8px_20px_rgba(18,122,89,0.3),inset_0_-4px_0_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(18,122,89,0.5),inset_0_-2px_0_rgba(0,0,0,0.2)] relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      WHATSAPP <MessageCircle className="w-5 h-5 ml-3 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                  </Button>
                  <Button
                    onClick={() => void openContact('phone')}
                    aria-label="Telefon ile Ara"
                    variant="outline"
                    className="h-14 sm:h-auto sm:w-20 md:w-24 bg-white/5 hover:bg-white/10 border-white/10 rounded-3xl sm:rounded-[2rem] shadow-[0_8px_20px_rgba(0,0,0,0.3),inset_0_-4px_0_rgba(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-1 transition-all group overflow-hidden relative"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-pulse" />
                    </span>
                    <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-150 rounded-full transition-transform duration-500 ease-in-out" />
                  </Button>
                </div>
                <Button 
                  onClick={() => {
                    onClose();
                    setLocation(`/escort/${profile.id}`);
                  }}
                  variant="secondary" 
                  className="w-full h-14 md:h-16 bg-gradient-to-t from-white/5 to-white/10 border border-white/5 hover:border-white/20 text-white font-black uppercase tracking-widest rounded-2xl sm:rounded-3xl group shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_-4px_0_rgba(0,0,0,0.2)] hover:-translate-y-1 active:translate-y-1 transition-all relative overflow-hidden"
                >
                   <span className="relative z-10 flex items-center justify-center">
                     TAM PROFİLİ GÖR <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
                   </span>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
