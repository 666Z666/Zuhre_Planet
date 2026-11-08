/**
 * Digital Member Card Component
 * 
 * Kullanıcı üyeliğini, QR kodunu ve statüsünü gösteren premium, animasyonlu dijital kart.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  QrCode, 
  Star,
  Layers
} from 'lucide-react';

export type MemberTier = 'free' | 'gold' | 'platinum' | 'vip' | 'diamond' | 'elite';

interface MemberCardProps {
  userName: string;
  memberId: string;
  tier: MemberTier;
  points: number;
  validUntil: string;
}

const TIER_STYLES: Record<MemberTier, { bg: string; accent: string; label: string; glow: string }> = {
  free: {
    bg: 'from-slate-700 to-slate-900',
    accent: 'text-slate-400',
    label: 'Standard Member',
    glow: 'shadow-slate-500/10'
  },
  gold: {
    bg: 'from-amber-600 to-amber-900',
    accent: 'text-amber-300',
    label: 'Gold Member',
    glow: 'shadow-amber-500/20'
  },
  platinum: {
    bg: 'from-emerald-600 to-blue-900',
    accent: 'text-emerald-300',
    label: 'Platinum Member',
    glow: 'shadow-emerald-500/20'
  },
  vip: {
    bg: 'from-rose-600 to-rose-900',
    accent: 'text-rose-300',
    label: 'VIP Member',
    glow: 'shadow-rose-500/20'
  },
  diamond: {
    bg: 'from-gold-600 to-emerald-900',
    accent: 'text-gold-300',
    label: 'Diamond Member',
    glow: 'shadow-gold-500/30'
  },
  elite: {
    bg: 'from-zinc-800 to-black',
    accent: 'text-zinc-100',
    label: 'Elite Member',
    glow: 'shadow-white/10'
  }
};

export function MemberCard({
  userName,
  memberId,
  tier,
  points,
  validUntil
}: MemberCardProps) {
  const style = TIER_STYLES[tier];

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotateY: 5 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full max-w-md aspect-[1.6/1] rounded-[2rem] overflow-hidden p-8 flex flex-col justify-between group cursor-pointer bg-gradient-to-br ${style.bg} border border-white/20 shadow-2xl ${style.glow} transition-all duration-500`}
      style={{ perspective: '1000px' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.14)_1px,transparent_0)] bg-[length:18px_18px] opacity-10 mix-blend-overlay" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className={`w-5 h-5 ${style.accent}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${style.accent}`}>{style.label}</span>
          </div>
          <h2 className="text-2xl font-black font-orbitron uppercase tracking-tighter text-white">{userName}</h2>
        </div>
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <QrCode className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-8">
        <div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">MEMBER ID</p>
          <p className="font-orbitron font-bold text-white tracking-widest">{memberId}</p>
        </div>
        <div className="h-8 w-px bg-white/10" />
        <div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">REWARD POINTS</p>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-yellow-400 fill-current" />
            <p className="font-orbitron font-bold text-white">{points}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-4">
           <div className="flex -space-x-2">
             {[1, 2, 3].map(i => (
               <div key={i} className="w-6 h-6 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                 <Star className="w-2.5 h-2.5 text-white/60" />
               </div>
             ))}
           </div>
           <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">LOYALTY LVL {Math.floor(points / 100) + 1}</span>
        </div>
        <div className="text-right">
           <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">VALID THRU</p>
           <p className="text-[10px] font-black text-white">{validUntil}</p>
        </div>
      </div>

      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        className="absolute bottom-6 right-6 z-20"
      >
        <div className="p-2 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
    </motion.div>
  );
}
