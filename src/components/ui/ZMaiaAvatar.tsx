import React from 'react';
import { motion } from 'framer-motion';

export function ZMaiaAvatar({ size = 60, status = 'idle' }: { size?: number, status?: 'idle' | 'thinking' | 'talking' }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      
      {/* Outer Pulse Rings */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute inset-x-[-20%] inset-y-[-20%] rounded-full border border-primary/30 blur-sm"
      />
      
      {/* Neural Interface Background (Threads) */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 100 100">
        {[0, 1, 2, 3].map((i) => (
          <motion.path
            key={i}
            d={`M50,50 L${20 + i * 20},${10 + i * 5} Q50,30 ${80 - i * 15},${70 + i * 10}`}
            stroke="url(#threadGradient)"
            strokeWidth="0.5"
            fill="none"
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <defs>
          <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Outer Glow Halo */}
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute inset-x-[-30%] inset-y-[-30%] rounded-full bg-primary/20 blur-[40px] mix-blend-screen"
      />
      
      {/* Core Portal (Liquid Spirit Morph) */}
      <motion.div 
        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none"
        style={{ filter: 'drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.8))' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="maiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>
          
          {/* Morphing Liquid Form */}
          <motion.path
            initial={{ d: "M50 10 C 20 40, 20 60, 50 90 C 80 60, 80 40, 50 10 Z" }}
            animate={{ 
              d: status === 'thinking' 
                ? [
                    "M50 10 C 10 40, 30 70, 50 90 C 70 70, 90 40, 50 10 Z",
                    "M50 15 C 30 45, 10 65, 50 85 C 90 65, 70 45, 50 15 Z",
                    "M50 10 C 10 40, 30 70, 50 90 C 70 70, 90 40, 50 10 Z"
                  ]
                : status === 'talking'
                ? [
                    "M50 8 C 15 38, 15 62, 50 92 C 85 62, 85 38, 50 8 Z",
                    "M50 12 C 25 42, 25 58, 50 88 C 75 58, 75 42, 50 12 Z",
                    "M50 8 C 15 38, 15 62, 50 92 C 85 62, 85 38, 50 8 Z"
                  ]
                : [
                    "M50 10 C 20 40, 20 60, 50 90 C 80 60, 80 40, 50 10 Z",
                    "M50 12 C 22 42, 22 58, 50 88 C 78 58, 78 42, 50 12 Z",
                    "M50 10 C 20 40, 20 60, 50 90 C 80 60, 80 40, 50 10 Z"
                  ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            fill="url(#maiaGradient)"
          />

          {/* Neural Core Spark */}
          <motion.circle
            cx="50" cy="50" r="4" fill="#ffffff"
            animate={{ 
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 1.4, 1],
              filter: ['blur(1px)', 'blur(3px)', 'blur(1px)']
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </svg>
      </motion.div>

      {/* Orbiting Stardust Particles (Enhanced) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
           key={i}
           animate={{ rotate: 360, scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
           transition={{ repeat: Infinity, duration: i + 4, ease: 'linear' }}
           className="absolute w-1 h-1 bg-white rounded-full blur-[1px] shadow-[0_0_5px_rgba(255,255,255,0.8)]"
           style={{ 
             top: '10%', 
             left: '45%',
             transformOrigin: `50% ${size / 2}px`
           }}
        />
      ))}
    </div>
  );
}
