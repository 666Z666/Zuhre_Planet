import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Zap, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LockedContentCardProps {
  id: string;
  previewUrl: string;
  price: number;
  type: 'image' | 'video';
}

export function LockedContentCard({ previewUrl, price, type }: LockedContentCardProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUnlocking(false);
    setIsUnlocked(true);
    toast.success('İçerik başarıyla açıldı! İyi seyirler dileriz.', {
        description: `${price} NP bakiyenizden düşüldü.`,
        icon: <Unlock className="text-primary" />
    });
  };

  return (
    <div className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden border border-white/10 glass-panel group shadow-2xl">
      
      {/* Media Content */}
      <div className="absolute inset-0">
        <img 
          src={previewUrl} 
          alt="Locked Content" 
          className={`w-full h-full object-cover transition-all duration-1000 ${!isUnlocked ? 'blur-2xl grayscale brightness-50' : 'blur-0 grayscale-0 brightness-100'}`} 
        />
        
        {/* Grid Pattern Overlay for Locked state */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10 pointer-events-none" />
        )}

        {/* LASER SCANLINE (Phase 1.3) */}
        {!isUnlocked && !isUnlocking && (
          <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-10 blur-[2px] opacity-70"
          />
        )}
      </div>

      {/* Holographic Price Ribbon (Phase 1.3) */}
      {!isUnlocked && (
        <div className="absolute top-0 right-0 overflow-hidden w-40 h-40 pointer-events-none z-30">
          <div className="absolute top-8 -right-12 w-56 py-2 bg-gradient-to-r from-primary via-gold-600 to-primary rotate-45 text-center shadow-2xl border-y border-white/20">
             <div className="relative overflow-hidden">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic text-shadow-premium">
                   {price} NP
                </span>
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/20 skew-x-[-20deg] blur-md"
                />
             </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {!isUnlocked && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div 
              animate={isUnlocking ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/20 mb-6 ${isUnlocking ? 'text-primary' : 'text-white'}`}
            >
              {isUnlocking ? <Zap className="w-10 h-10 animate-pulse" /> : <Lock className="w-8 h-8" />}
            </motion.div>

            <div className="space-y-2 mb-8">
              <h4 className="text-xl font-black uppercase italic tracking-tighter text-white text-shadow-premium">ÖZEL ARŞİV</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                Bu {type === 'video' ? 'video' : 'görsel'} sadece Nebula Points ile erişilebilir.
              </p>
            </div>

            <Button 
               onClick={handleUnlock}
               disabled={isUnlocking}
               className="w-full h-16 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest italic shadow-[0_15px_40px_rgba(var(--primary-rgb),0.5)] hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.7)] group transition-all relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                 {isUnlocking ? 'KOD ÇÖZÜLÜYOR...' : `KİLİDİ AÇ: ${price} NP`}
              </div>
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
              />
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 opacity-80">
               <EyeOff size={10} className="text-white" />
               <span className="text-[9px] font-black text-white uppercase tracking-widest italic text-shadow-premium">PRIVATE VAULT CONTENT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge for Type */}
      <div className="absolute top-6 left-6 z-20">
         <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{type}</span>
         </div>
      </div>

      {/* Unlocked Overlay */}
      {isUnlocked && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end"
        >
          <div>
             <span className="text-[9px] text-primary font-black uppercase tracking-widest block mb-1">ERİŞİM SAĞLANDI</span>
             <span className="text-xs font-bold text-white uppercase tabular-nums">UNLOCKED: 2026-X</span>
          </div>
          <Unlock className="w-4 h-4 text-primary" />
        </motion.div>
      )}

      {/* Holographic Shine for locked state */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
      )}
    </div>
  );
}
