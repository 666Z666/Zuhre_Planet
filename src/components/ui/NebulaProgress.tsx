import React from 'react';
import { motion } from 'framer-motion';

interface NebulaProgressProps {
  value: number; // 0-100
  label?: string;
  nextRank?: string;
  pointsToNext?: number;
}

/**
 * Zühre Planet V4.0 - NebulaProgress component
 * Cinematic progress bar with stardust and glowing effects.
 */
export function NebulaProgress({ value, label, nextRank, pointsToNext }: NebulaProgressProps) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">
          {label || 'GALAKTİK İLERLEME'}
        </span>
        {nextRank && (
          <span className="text-[10px] font-black text-primary uppercase tracking-widest italic animate-pulse">
            → {nextRank}
          </span>
        )}
      </div>

      <div className="relative h-5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 group">
        {/* Glow Layer */}
        <div className="absolute inset-0 bg-primary/5 blur-sm" />
        
        {/* Progress Bar Body */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary via-gold-500 to-emerald-400 relative z-10 shadow-[0_0_25px_rgba(var(--primary-rgb),0.6)]"
        >
          {/* Shimmer Effect */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </motion.div>

        {/* Stardust Texture Overlay */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none mix-blend-overlay" />
      </div>

      <div className="flex justify-between items-center text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">
        <span>%{value} SİNGÜLERİTE</span>
        {pointsToNext && <span>{pointsToNext} NP KALDI</span>}
      </div>
    </div>
  );
}
