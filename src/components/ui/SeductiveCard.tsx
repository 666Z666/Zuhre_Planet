import React, { memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, MapPin, ShieldCheck } from 'lucide-react';
import { LipsIcon, SilkBowIcon } from './SensualIcons';
import { ListingProfile } from '@/types/domain';
import { useAdminSettings } from '@/contexts/AdminSettingsContext';

interface SeductiveCardProps {
  profile: ListingProfile;
  onQuickView?: (profile: ListingProfile) => void;
  size?: 'sm' | 'md' | 'lg';
}

const Badge = memo(({ label, color, icon }: { label: string; color: 'gold' | 'magenta', icon?: React.ReactNode }) => {
  const styles = {
    gold: 'bg-secondary/10 text-secondary border-secondary/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]',
    magenta: 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
  };
  return (
    <div className={`px-3 py-1 sm:px-5 sm:py-2 rounded-2xl border backdrop-blur-2xl text-[8px] sm:text-[10px] font-black tracking-[0.2em] flex items-center gap-1.5 sm:gap-2 italic w-fit ${styles[color]}`}>
      {icon}
      {label}
    </div>
  );
});
Badge.displayName = 'Badge';

const SeductiveCardComponent = ({ profile, onQuickView, size = 'sm' }: SeductiveCardProps) => {
  const { settings } = useAdminSettings();
  
  // Parallax / 3D Hologram Değerleri
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const name = profile.displayName || profile.stageName;
  const tier = profile.membershipTier;
  const isVip = ['vip', 'platinum', 'diamond', 'elite'].includes(tier);
  const isLarge = size === 'lg';
  const isMedium = size === 'md';

  const glowIntensities = {
    soft: 'blur-2xl opacity-10',
    medium: 'blur-3xl opacity-20',
    hard: 'blur-[60px] opacity-40'
  };

  return (
    <motion.div
      layoutId={`card-${profile.id}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
      className={`relative w-full rounded-[2.5rem] md:rounded-[3.5rem] group cursor-pointer perspective-1200 preserve-3d transition-all duration-700 ease-out hover:z-50 border border-white/5 will-change-transform ${
        isLarge ? 'aspect-[4/5] md:aspect-[1/1] lg:col-span-2 lg:row-span-2' : 
        isMedium ? 'aspect-[4/5] md:aspect-[2/1.5] lg:col-span-2 lg:row-span-1' : 
        'aspect-[4/5] md:aspect-[2/3]'
      }`}
      onClick={() => onQuickView?.(profile)}
    >
      {/* PREMIUM GLOW */}
      {isVip && settings.showPremiumGlow && (
        <div className={`absolute -inset-4 sm:-inset-6 rounded-[5rem] transition-all duration-1000 pointer-events-none ${glowIntensities[settings.glowIntensity]}`}>
           <div className={`absolute inset-0 rounded-[5rem] ${tier === 'diamond' ? 'bg-secondary' : 'bg-primary'}`} />
        </div>
      )}

      {/* HEARTBEAT AURA */}
      {(isVip || profile.isLive) && (
        <div className="absolute -inset-4 sm:-inset-8 rounded-[5rem] transition-opacity duration-1000 pointer-events-none z-[-1]">
          {profile.isLive ? (
            <>
              <div className="absolute inset-0 rounded-[5rem] border-2 border-primary/40 animate-[ping_3s_infinite] opacity-30" />
              <div className="absolute inset-2 rounded-[5rem] border border-emerald-400/20 animate-[pulse_4s_infinite] opacity-40" />
              <div className="absolute inset-[-1rem] rounded-[6rem] blur-[60px] opacity-30 bg-primary animate-[pulse_2s_infinite]" />
              <div className="absolute inset-[-2rem] rounded-[7rem] blur-[80px] opacity-10 bg-emerald-400 animate-[pulse_5s_infinite]" />
              <div className="absolute inset-[-3rem] rounded-[8rem] blur-[100px] opacity-5 bg-primary animate-[pulse_6s_infinite]" />
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[5rem]">
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-[scrolling-bg_20s_linear_infinite]" />
              </div>
            </>
          ) : (
            <>
              <div className={`absolute inset-0 rounded-[5rem] border animate-[ping_4s_infinite] opacity-10 group-hover:opacity-30 ${tier === 'diamond' ? 'border-secondary' : 'border-primary'}`} />
              <div className={`absolute inset-0 rounded-[5rem] blur-3xl animate-pulse ${tier === 'diamond' ? 'bg-secondary/20' : 'bg-primary/10'}`} />
            </>
          )}
        </div>
      )}
      
      {/* MAIN CARD BODY */}
      <div className={`absolute inset-0 glass-layered border border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.9)] bg-black/60 flex flex-col transition-shadow duration-700 ${isVip ? 'ring-[1px] ring-white/20' : ''}`}>
        
        <motion.div 
          className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.4) 0%, transparent 60%)',
            '--x': glareX,
            '--y': glareY
          } as any}
        />

        <div 
          className="relative flex-1 w-full overflow-hidden translate-z-m20 preserve-3d"
        >
          <motion.img
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
            src={profile.avatarUrl}
            alt={name}
            decoding="async"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 contrast-125 hover:contrast-135 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-black/40 to-transparent opacity-100 mix-blend-multiply" />
          
          {profile.verificationStatus === 'verified' && settings.showVerificationBadge && (
             <div className="absolute z-30 top-4 left-4 translate-z-30">
                <div className="relative flex items-center gap-1.5 bg-black/60 backdrop-blur-3xl border border-emerald-500/50 px-3 py-1.5 rounded-2xl shadow-2xl">
                   <ShieldCheck className="w-3 h-3 text-emerald-400" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 italic">ONAYLI</span>
                </div>
             </div>
          )}

          <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-20 translate-z-10">
             {isVip && (
               <Badge 
                 label={tier.toUpperCase()} 
                 color={tier === 'diamond' || tier === 'elite' ? 'gold' : 'magenta'} 
                 icon={tier === 'diamond' ? <SilkBowIcon size={12} /> : <LipsIcon size={12} />} 
               />
             )}
             {profile.isLive && (
               <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-2xl px-3 py-1.5 rounded-[1.2rem] border border-primary/40">
                 <div className="w-2 h-2 bg-primary rounded-full animate-ping absolute inset-0" />
                 <div className="w-2 h-2 bg-gradient-to-tr from-primary to-emerald-400 rounded-full relative z-10" />
                 <span className="text-[8px] font-black uppercase text-white tracking-[0.2em] italic">LIVE</span>
               </div>
             )}
          </div>
        </div>

        <div 
          className="w-full flex-none p-5 flex flex-col gap-3 relative z-30 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent translate-z-30 preserve-3d"
        >
           <div className="space-y-1">
             <div className="flex items-center justify-between">
               <h3 className={`${isLarge ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'} font-black font-orbitron uppercase tracking-tighter text-white group-hover:text-primary transition-all duration-700 group-hover:tracking-wider drop-shadow-2xl truncate text-shadow-premium`}>
                 {name}
               </h3>
               <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-secondary fill-current" />
                  <span className="text-[10px] font-black text-gray-100 italic">{profile.rating || 5.0}</span>
               </div>
             </div>
             <div className="flex items-center justify-between text-gray-300 text-[9px] font-bold uppercase tracking-[0.3em] italic">
                <MapPin className="w-2.5 h-2.5 text-primary" />
                <span className="truncate">{profile.district || profile.city}</span>
             </div>
           </div>
           
           <div className="flex items-center justify-between pt-3 border-t border-white/20">
              <div className="flex items-center gap-4 text-[9px] text-gray-100 font-black tracking-widest">
                 <span>{profile.age || 21} YAŞ</span>
                 <span>{profile.height || '---'} CM</span>
              </div>
              <button className="text-[9px] font-black uppercase tracking-[0.4em] italic text-primary hover:text-white transition-all">
                 DETAY
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SeductiveCard = memo(SeductiveCardComponent);
