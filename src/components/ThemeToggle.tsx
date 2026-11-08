import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { setTheme, actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetTheme, setTargetTheme] = useState<'light' | 'dark' | null>(null);

  const toggleTheme = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const newTheme = isDark ? 'light' : 'dark';
    setTargetTheme(newTheme);
    setTheme(newTheme);
    
    setTimeout(() => {
      setIsTransitioning(false);
      setTargetTheme(null);
    }, 3000); 
  };

  return (
    <div className="relative group">
      {/* 3D Slot / Yuva Efekti */}
      <div className="absolute inset-0 bg-black/40 rounded-full blur-[2px] scale-110 -z-10 shadow-inner" />

      <motion.button
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="relative w-14 h-14 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.1)]"
        style={{
          background: isDark
            ? 'radial-gradient(circle at 30% 30%, #1e1b4b 0%, #020617 100%)'
            : 'radial-gradient(circle at 30% 30%, #fbbf24 0%, #f59e0b 100%)',
          marginTop: '-15px',
          marginBottom: '-15px'
        }}
        aria-label="Tema degistir"
      >
        <AnimatePresence mode="wait">
          {isTransitioning ? (
            <motion.div
              key={targetTheme === 'light' ? "to-sun-anim" : "to-moon-anim"}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <img
                src={targetTheme === 'light' ? "/assets/theme/to-sun.gif" : "/assets/theme/to-moon.gif"}
                alt="Donusuyor..."
                className="w-[140%] h-[140%] object-cover max-w-none"
              />
            </motion.div>
          ) : (
            <motion.div
              key={isDark ? "moon-static" : "sun-static"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <img
                src={isDark ? "/assets/theme/moon-icon.png" : "/assets/theme/sun-icon.png"}
                alt={isDark ? "Ay Modu" : "Gunes Modu"}
                // Gunes iconunun icindeki bosluktan dolayi kucuk gorunmesini engellemek icin sun iconuna daha buyuk scale verildi
                className={isDark 
                  ? "w-[110%] h-[110%] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                  : "w-[155%] h-[155%] object-contain max-w-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                }
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Cam Bombesi */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none border-t border-white/20"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)"
          }}
        />
      </motion.button>
    </div>
  );
}

export default ThemeToggle;
