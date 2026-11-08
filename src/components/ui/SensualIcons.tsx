/**
 * Zühre Planet V3.2 - Shadow-X Erotica Icon Set (Optimized)
 * 
 * Custom-designed seductive SVG icons with neon magenta glows and
 * glassmorphic effects. Memoized for high performance and 0-warning.
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface IconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const LipsIcon = memo(({ className = "", size = 24, glow = true }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.8))' }}
  >
    <path 
      d="M2 13C2 12 3 10 7 10C11 10 12 12 12 12C12 12 13 10 17 10C21 10 22 12 22 13C22 14 21 18 12 18C3 18 2 14 2 13Z" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <path 
      d="M7 10C8.5 10 10.5 8 12 8C13.5 8 15.5 10 17 10" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    {glow && (
      <path 
        d="M6 13.5H18" 
        stroke="hsl(var(--primary))" strokeWidth={0.5} strokeLinecap="round" strokeLinejoin="round" 
        className="animate-pulse"
      />
    )}
  </motion.svg>
));

export const HeelsIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ rotate: -15, scale: 1.1 }}
  >
    <path 
      d="M4 18L7 6L16 6C18 6 20 8 20 10C20 12 18 14 16 14L8 14L6 20" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <path d="M12 14L10 21" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
  </motion.svg>
));

export const MaskIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ y: -5 }}
  >
    <path 
      d="M2 12C2 10 4 8 7 8C10 8 11 10 12 10C13 10 14 8 17 8C20 8 22 10 22 12C22 16 18 19 12 19C6 19 2 16 2 12Z" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <circle cx="7.5" cy="12.5" r="1.5" stroke="currentColor" strokeWidth={1.5} />
    <circle cx="16.5" cy="12.5" r="1.5" stroke="currentColor" strokeWidth={1.5} />
  </motion.svg>
));

export const CorsetIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scale: 1.1 }}
  >
    <path 
      d="M6 4C6 4 8 6 12 6C16 6 18 4 18 4V20C18 20 16 18 12 18C8 18 6 20 6 20V4Z" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <path d="M9 8L15 10M9 12L15 14M9 16L15 12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
  </motion.svg>
));

export const SilkBowIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ rotate: 10, scale: 1.1 }}
  >
    <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth={1.5} />
    <path 
      d="M10 12C10 12 6 8 4 12C2 16 6 16 6 16L10 12Z" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <path 
      d="M14 12C14 12 18 8 20 12C22 16 18 16 18 16L14 12Z" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <path d="M11 14L9 20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    <path d="M13 14L15 20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
  </motion.svg>
));

LipsIcon.displayName = 'LipsIcon';
HeelsIcon.displayName = 'HeelsIcon';
MaskIcon.displayName = 'MaskIcon';
CorsetIcon.displayName = 'CorsetIcon';
SilkBowIcon.displayName = 'SilkBowIcon';

// --- NEW SHADOW DIAMOND METAPHOR ICONS ---

export const ShadowDiamondIcon = memo(({ className = "", size = 24, glow = true }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scale: 1.15, filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.8))' }}
  >
    {/* Diamond Outer Shape */}
    <path 
      d="M12 21L3 10L7 4H17L21 10L12 21Z" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <path d="M3 10H21" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    <path d="M7 4L12 10L17 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 21V10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Yonic Cleft (The Metaphor) */}
    {glow && (
      <path 
        d="M12 12C12 12 14 15 12 18C10 15 12 12 12 12Z" 
        fill="hsl(var(--primary))" fillOpacity={0.8}
        className="animate-pulse"
      />
    )}
  </motion.svg>
));

export const DarkLotusIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ y: -2, scale: 1.1, filter: 'drop-shadow(0 0 10px rgba(212,175,55,0.5))' }}
  >
    {/* Center petal (Yoni form) */}
    <path 
      d="M12 20C12 20 6 14 12 4C18 14 12 20 12 20Z" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    {/* Side petals */}
    <path 
      d="M12 20C12 20 3 17 5 10C8 13 12 15 12 15" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <path 
      d="M12 20C12 20 21 17 19 10C16 13 12 15 12 15" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    <circle cx="12" cy="17" r="1" fill="hsl(var(--primary))" className="animate-pulse"/>
  </motion.svg>
));

export const SacredPortalIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scale: 1.1 }}
  >
    {/* Ogive Arch Geometry */}
    <path 
      d="M12 3C18 10 18 21 18 21H6C6 21 6 10 12 3Z" 
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
    />
    {/* Inner Passage */}
    <path 
      d="M12 7C15 12 15 21 15 21H9C9 21 9 12 12 7Z" 
      stroke="hsl(var(--primary))" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" 
      strokeOpacity={0.8}
    />
  </motion.svg>
));

export const YonicBurningFeather = ({ size = 200, className = "" }: IconProps) => {
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      whileHover="hover"
    >
      {/* HEAT CORE RADIANCE */}
      <motion.div 
        className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
        animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <svg viewBox="0 0 200 300" fill="none" className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]">
        <defs>
          <linearGradient id="feather-fire-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="30%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="#2D0A1A" />
          </linearGradient>
          <filter id="yoni-glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        {/* THE OUTER FEATHER (Silhouette) */}
        <motion.path 
          d="M100 250 C40 200 40 100 100 20 C160 100 160 200 100 250" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeOpacity="0.3"
          strokeDasharray="4 2"
        />

        {/* THE YONIC CLEFT (Inside the Feather) */}
        <g filter="url(#yoni-glow)">
          {/* Labia Majora (Feather Edges) */}
          <motion.path 
            d="M100 250 C70 200 70 120 100 60 C130 120 130 200 100 250" 
            stroke="url(#feather-fire-gradient)" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          
          {/* Labia Minora (Inner Soft Curves) */}
          <motion.path 
            d="M100 230 C85 190 85 140 100 100 C115 140 115 190 100 230" 
            fill="var(--primary)" 
            fillOpacity="0.2"
            animate={{ fillOpacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* THE BURNING EMBER (Clitoral Apex) */}
          <motion.circle 
            cx="100" cy="85" r="5" 
            fill="white" 
            className="shadow-[0_0_10px_white]"
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />

          {/* RADIATING FIBERS (Heat Waves) */}
          {[...Array(6)].map((_, i) => (
            <motion.path 
              key={i}
              d={`M100 ${100 + i * 20} L${i % 2 === 0 ? 120 : 80} ${90 + i * 20}`}
              stroke="var(--primary)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              animate={{ x: [0, i % 2 === 0 ? 5 : -5, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: 1 + i * 0.2, repeat: Infinity }}
            />
          ))}
        </g>

        {/* VAGINAL CANAL GLOW (The Depth) */}
        <motion.path 
          d="M100 90 L100 220" 
          stroke="white" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeOpacity="0.5"
          animate={{ strokeOpacity: [0.2, 0.8, 0.2], strokeWidth: [0.5, 1.5, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
};

export const SpiderWebIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ rotate: 45, scale: 1.15 }}
    transition={{ duration: 0.5 }}
  >
    {/* Octagonal Web Base */}
    <path d="M12 2L19 5L22 12L19 19L12 22L5 19L2 12L5 5L12 2Z" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
    <path d="M12 6L16 8L18 12L16 16L12 18L8 16L6 12L8 8L12 6Z" stroke="hsl(var(--primary))" strokeOpacity={0.5} strokeWidth={1.5} strokeLinejoin="round" />
    
    {/* Radiating lines */}
    <path d="M12 2V22M2 12H22M5 5L19 19M5 19L19 5" stroke="currentColor" strokeWidth={1} />
  </motion.svg>
));

export const GoldenYoniDiamondIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 100 100" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.8))' }}
  >
    <defs>
      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#996515" />
      </linearGradient>
      <filter id="inner-glow">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    
    {/* Diamond Outer Structure */}
    <path 
      d="M50 5 L85 50 L50 95 L15 50 L50 5Z" 
      fill="url(#gold-grad)" 
      stroke="#FFD700" 
      strokeWidth={0.5}
    />
    
    {/* Diamond Facets */}
    <path d="M50 5 L50 35 L85 50 L50 5Z" fill="white" fillOpacity={0.2} />
    <path d="M50 5 L50 35 L15 50 L50 5Z" fill="white" fillOpacity={0.1} />
    <path d="M50 95 L50 65 L85 50 L50 95Z" fill="black" fillOpacity={0.2} />
    <path d="M50 95 L50 65 L15 50 L50 95Z" fill="black" fillOpacity={0.3} />
    
    {/* THE CENTRAL YONI CLEFT (Crystal Interior) */}
    <path 
      d="M50 35 C60 50 60 50 50 65 C40 50 40 50 50 35Z" 
      fill="#1A0033" 
      stroke="#d4af37" 
      strokeWidth={1}
      filter="url(#inner-glow)"
    />
    <path 
      d="M50 40 C55 50 55 50 50 60 C45 50 45 50 50 40Z" 
      fill="#d4af37" 
      fillOpacity={0.3}
      className="animate-pulse"
    />
  </motion.svg>
));

ShadowDiamondIcon.displayName = 'ShadowDiamondIcon';
DarkLotusIcon.displayName = 'DarkLotusIcon';
SacredPortalIcon.displayName = 'SacredPortalIcon';
SpiderWebIcon.displayName = 'SpiderWebIcon';

// --- V3.8 ANATOMICAL METRICS ICONS ---

export const MetricHeightIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scaleY: 1.2, y: -2 }}
  >
    <path d="M7 3V21M7 3H11M7 21H11M7 7H10M7 12H11M7 17H10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    <path d="M14 6L18 3L22 6M18 3V21" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
));

export const MetricWeightIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ rotate: [0, -5, 5, 0] }}
  >
    <path d="M20 10V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V10M4 10H20" stroke="currentColor" strokeWidth={1.5} />
    <path d="M4 10C4 15.5228 8.47715 20 14 20C19.5228 20 20 15.5228 20 10" stroke="currentColor" strokeWidth={1.5} />
    <circle cx="12" cy="14" r="3" stroke="hsl(var(--primary))" strokeWidth={1.5} />
    <path d="M12 14L14 12" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeLinecap="round" />
  </motion.svg>
));

export const MetricChestIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scale: 1.15 }}
  >
     <path d="M12 18C16 18 19 15 19 11C19 7 16 4 12 4C8 4 5 7 5 11C5 15 8 18 12 18Z" stroke="currentColor" strokeWidth={1.5} strokeOpacity={0.4} />
     <path d="M6 10C6 10 8 13 12 13C16 13 18 10 18 10" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeLinecap="round" />
     <circle cx="12" cy="11" r="1" fill="hsl(var(--primary))" className="animate-pulse" />
  </motion.svg>
));

export const MetricWaistIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scaleX: 0.9, scaleY: 1.1 }}
  >
    <path d="M5 4C8 10 8 14 5 20M19 4C16 10 16 14 19 20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    <path d="M8 12H16" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="2 2" />
  </motion.svg>
));

export const MetricHipsIcon = memo(({ className = "", size = 24 }: IconProps) => (
  <motion.svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    xmlns="http://www.w3.org/2000/svg" className={className}
    whileHover={{ scale: 1.1 }}
  >
    <path d="M4 6C4 6 7 12 12 12C17 12 20 6 20 6" stroke="currentColor" strokeWidth={1} strokeOpacity={0.3} />
    <path d="M3 10C3 10 6 20 12 20C18 20 21 10 21 10" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    <path d="M9 13C9 13 10 15 12 15C14 15 15 13 15 13" stroke="hsl(var(--primary))" strokeWidth={1.5} strokeLinecap="round" />
  </motion.svg>
));

MetricHeightIcon.displayName = 'MetricHeightIcon';
MetricWeightIcon.displayName = 'MetricWeightIcon';
MetricChestIcon.displayName = 'MetricChestIcon';
MetricWaistIcon.displayName = 'MetricWaistIcon';
MetricHipsIcon.displayName = 'MetricHipsIcon';

