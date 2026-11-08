/**
 * Standard Card Component
 * 
 * Kozmik temaya uygun, okunaklılığı artırılmış profil kartı.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, ShieldCheck, Clock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { ListingProfile } from '@/types/domain';
import { VerifiedBadge } from './VerifiedBadge';

import { Link, useLocation } from 'wouter';

interface StandardCardProps {
  profile: ListingProfile;
  onQuickView?: (profile: ListingProfile) => void;
  isOverlay?: boolean;
}

export const StandardCard: React.FC<StandardCardProps> = ({ profile, onQuickView, isOverlay = false }) => {
  const { theme } = useTheme();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';

  const handleClick = () => {
    if (!isOverlay && onQuickView) {
      onQuickView(profile);
    } else {
      setLocation(`/profile/${profile.id}`);
    }
  };

  return (
    <motion.div
      className="glass-panel group overflow-hidden border-none cursor-pointer content-layer"
      whileHover={{ y: -15, rotateX: 2, rotateY: -1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={profile.avatarUrl || '/brand/placeholders/portrait-1.svg'}
          alt={profile.displayName}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 elevate-2">
          <div className="flex flex-col gap-2">
            {(profile.tier === 'diamond' || profile.tier === 'elite') && (
              <span className="bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-2xl italic border border-white/20">
                VIP
              </span>
            )}
            {profile.hasVerifiedBadge && (
              <VerifiedBadge size="sm" showText={false} />
            )}
          </div>
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-2xl border border-white/20 shadow-2xl elevate-1
            ${profile.isOnline ? 'bg-green-500/30' : 'bg-gray-500/30'}`}>
            <div className={`w-2 h-2 rounded-full ${profile.isOnline ? 'bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'bg-gray-400'}`} />
            <span className="text-white text-[9px] font-black uppercase tracking-[0.15em] italic">
              {profile.isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 elevate-3">
          <div className="flex justify-between items-end mb-1">
            <div className="perspective-1000">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] h-premium text-3d mb-1">
                {profile.displayName}
              </h3>
              <div className="flex items-center gap-1.5 text-white/80">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.1em] italic">
                  {profile.city || 'İstanbul'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-3xl px-2.5 py-1 rounded-xl border border-white/20 shadow-2xl">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-black italic">{profile.rating || '4.9'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 space-y-4 elevate-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] italic ${isDark ? 'text-white/50' : 'text-slate-900/60'}`}>
              Saatlik
            </span>
          </div>
          <span className="text-xl font-black italic text-primary">
            ₺{profile.rates?.hourly || '5000'}
          </span>
        </div>

        <div className={`flex items-center gap-2.5 p-3 rounded-2xl border border-dashed elevate-1
          ${isDark ? 'bg-white/5 border-white/20' : 'bg-primary/5 border-primary/30'}`}>
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className={`text-[9px] font-black uppercase tracking-[0.1em] italic leading-tight ${isDark ? 'text-white/40' : 'text-slate-900/50'}`}>  
            GÜVENİLİR VE DOĞRULANMIŞ PROFİL
          </span>
        </div>

        <motion.button
          className="w-full py-4 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.25em] italic shadow-[0_10px_20px_rgba(var(--primary-rgb),0.2)]"
          whileTap={{ scale: 0.95 }}
        >
          Profili İncele
        </motion.button>
      </div>
    </motion.div>
  );
};
