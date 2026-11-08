import React from 'react';
import { motion } from 'framer-motion';

interface MissZLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export function MissZLogo({ className = "", size = 120, glow = true }: MissZLogoProps) {
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      whileHover="hover"
    >
      {/* GLOBAL AURA GLOW */}
      {glow && (
        <motion.div 
          className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <svg 
        viewBox="0 0 200 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
          <filter id="neon-glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* GOLDEN YONI DIAMOND EMBLEM (The Core) */}
        <g filter="url(#neon-glow)">
          <path 
            d="M100 20 L135 60 L100 100 L65 60 L100 20Z" 
            fill="url(#logo-gradient)" 
            fillOpacity="0.1"
            stroke="var(--primary)" 
            strokeWidth="0.5"
          />
          {/* Inner Cleft */}
          <motion.path 
            d="M100 45 C110 60 110 60 100 75 C90 60 90 60 100 45Z" 
            fill="var(--primary)"
            animate={{ fillOpacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>

        {/* THE "Z" (Evolved Form) */}
        <g filter="url(#neon-glow)">
          <path 
            d="M60 40 H140 L60 80 H140" 
            stroke="white" 
            strokeWidth="8" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          
          {/* THE DEVIL'S TAIL (Kuyruk) */}
          <motion.path 
            d="M140 80 C165 80 180 60 170 35 C165 20 150 15 145 25" 
            stroke="var(--primary)" 
            strokeWidth="4" 
            strokeLinecap="round"
            variants={{
              hover: { pathLength: [1, 0.8, 1], transition: { duration: 1, repeat: Infinity } }
            }}
          />
          
          {/* THE SPADE TIP (Kuyruk Ucu) */}
          <motion.path 
            d="M145 25 L152 22 L148 32 Z" 
            fill="var(--primary)"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>
      </svg>
    </motion.div>
  );
}
