import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Zap, Heart, Award } from 'lucide-react';

export type AchievementType = 'pioneer' | 'top_star' | 'loyalty_king' | 'vault_hunter' | 'nova_elite';

interface AchievementBadgeProps {
  type: AchievementType;
  label: string;
  count?: number;
}

const achievementConfigs: Record<AchievementType, { icon: React.ComponentType<{ className?: string }>, color: string, glow: string, border: string }> = {
  pioneer: { 
    icon: Zap, 
    color: 'from-[#ffcc33] via-[#ffb900] to-[#917500]', 
    glow: 'group-hover:shadow-[0_0_40px_rgba(251,191,36,0.6)]',
    border: 'border-amber-400/30'
  },
  top_star: { 
    icon: Star, 
    color: 'from-emerald-300 via-blue-500 to-blue-800', 
    glow: 'group-hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]',
    border: 'border-emerald-400/30'
  },
  loyalty_king: { 
    icon: Heart, 
    color: 'from-rose-400 via-pink-600 to-red-900', 
    glow: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.6)]',
    border: 'border-pink-500/30'
  },
  vault_hunter: { 
    icon: Shield, 
    color: 'from-gold-400 via-gold-600 to-emerald-900', 
    glow: 'group-hover:shadow-[0_0_40px_rgba(192,38,211,0.6)]',
    border: 'border-gold-500/30'
  },
  nova_elite: { 
    icon: Award, 
    color: 'from-emerald-300 via-teal-500 to-green-900', 
    glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]',
    border: 'border-emerald-500/30'
  }
};

export function AchievementBadge({ type, label, count }: AchievementBadgeProps) {
  const config = achievementConfigs[type];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.1, rotateY: 25, rotateX: -10 }}
      whileTap={{ scale: 0.95 }}
      className={`relative p-5 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent border ${config.border} backdrop-blur-2xl flex flex-col items-center justify-center gap-4 w-36 group cursor-pointer transition-all duration-700 ${config.glow} perspective-1000 preserve-3d`}
    >
      {/* Dynamic Aura Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 blur-[30px] transition-opacity duration-700`} />
      
      {/* 3D Medallion Core */}
      <div 
        className={`p-5 rounded-full bg-gradient-to-br ${config.color} text-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_10px_20px_rgba(0,0,0,0.5)] relative overflow-hidden translate-z-10`}
      >
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
           className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstripe-dark.png')]"
        />
        <Icon className="w-8 h-8 relative z-10" />
      </div>

      <div className="text-center translate-z-5">
        <div className="text-[11px] font-black uppercase tracking-tighter text-white italic drop-shadow-md leading-none">
          {label}
        </div>
        {count && (
          <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mt-2 italic decoration-primary underline-offset-4 decoration-2 underline">
            LVL {count}
          </div>
        )}
      </div>

      {/* Holographic Reflection Glint */}
      <motion.div 
        animate={{ x: ['-200%', '200%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-full w-12 bg-white/10 skew-x-[-25deg] pointer-events-none blur-md"
      />
    </motion.div>
  );
}
