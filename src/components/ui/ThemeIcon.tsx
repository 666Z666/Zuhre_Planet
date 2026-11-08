import React from 'react';
import { useLuxuryTheme, LuxuryThemeMode } from '@/contexts/LuxuryThemeContext';
import { motion } from 'framer-motion';

type IconType = 'home' | 'user' | 'users' | 'chat' | 'shield' | 'diamond' | 'heart' | 'star' | 'zap' | 'sparkles' | 'eye' | 'map' | 'moon';

interface ThemeIconProps {
  type: IconType;
  size?: number;
  className?: string;
  animate?: boolean;
}

export const ThemeIcon: React.FC<ThemeIconProps> = ({ type, size = 24, className = '', animate = true }) => {
  const { theme } = useLuxuryTheme();

  const getStyle = (t: LuxuryThemeMode) => {
    switch (t) {
      case 'diamond': return { stroke: '#ffd700', strokeWidth: 2, filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.5))' };
      case 'ocean': return { stroke: '#3fae86', strokeWidth: 1.5, filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.4))' };
      case 'velvet': return { stroke: '#ef4444', strokeWidth: 2.5, filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.3))' };
      case 'minimalist': return { stroke: '#ffffff', strokeWidth: 0.8, filter: 'none' };
      default: return { stroke: 'currentColor', strokeWidth: 2, filter: 'none' };
    }
  };

  const style = getStyle(theme);

  const icons: Record<IconType, string> = {
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    diamond: "M6 3h12l4 6-10 12L2 9z M12 3v12 M2 9h20",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    sparkles: "M12 3l1.91 5.89L20 10.8l-4.59 4.49L16.5 21 12 18.11 7.5 21l1.09-5.71L4 10.8l6.09-1.91L12 3z",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    map: "M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  };

  const pathData = icons[type] || icons.star;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ duration: 0.5 }}
    >
      <motion.g
        animate={theme === 'velvet' && type === 'heart' ? { 
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
         <motion.path 
            d={pathData}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={style}
         />
         {theme === 'ocean' && (
           <motion.path 
              d={pathData}
              initial={{ pathLength: 0, x: 2, y: 2 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              style={{ ...style, stroke: '#ec4899', opacity: 0.3 }}
           />
         )}
      </motion.g>
    </motion.svg>
  );
};
