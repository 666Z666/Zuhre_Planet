import React from 'react';
import { motion } from 'framer-motion';

interface HolographicBadgeProps {
  label: string;
  icon?: React.ReactNode;
  color?: 'magenta' | 'gold' | 'cyan';
  className?: string;
}

/**
 * Zühre Planet V5.0 - HolographicBadge component
 * Glowing, rotating 3D effect badge for ranks and statuses.
 */
export function HolographicBadge({ label, icon, color = 'magenta', className = '' }: HolographicBadgeProps) {
  const colorMap = {
    magenta: 'from-primary to-gold-400 border-primary/40 shadow-[0_0_15px_rgba(212,175,55,0.3)]',
    gold: 'from-amber-600 to-yellow-300 border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    cyan: 'from-blue-600 to-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 10, rotateX: 10 }}
      className={`relative px-4 py-1.5 rounded-xl border bg-black/40 backdrop-blur-md flex items-center gap-2 overflow-hidden group ${colorMap[color]} ${className}`}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {/* Glint effect */}
      <motion.div 
        animate={{ x: ['-200%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
      />
      
      {icon && <div className="relative z-10 transition-transform group-hover:scale-110">{icon}</div>}
      <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] italic text-white whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  );
}
