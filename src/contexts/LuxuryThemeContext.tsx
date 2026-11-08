import React, { createContext, useContext, useState, useEffect } from 'react';

export type LuxuryThemeMode = 'ocean' | 'diamond' | 'velvet' | 'minimalist';

interface LuxuryThemeContextType {
  theme: LuxuryThemeMode;
  setTheme: (theme: LuxuryThemeMode) => void;
  accentColor: string;
  isStealthMode: boolean;
  setStealthMode: (val: boolean) => void;
  toggleStealthMode: () => void;
}

const LuxuryThemeContext = createContext<LuxuryThemeContextType | undefined>(undefined);

export const LuxuryThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isStealthMode, setStealthMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zuhre_stealth_mode') === 'true';
    }
    return false;
  });

  const [theme, setTheme] = useState<LuxuryThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zuhre_luxury_theme');
      return (saved as LuxuryThemeMode) || 'diamond';
    }
    return 'diamond';
  }); // Default to Diamond/Power
  
  const getAccentColor = (t: LuxuryThemeMode) => {
    switch (t) {
      case 'ocean': return '#9d174d'; // Deep Magenta
      case 'diamond': return '#ffd700'; // Gold
      case 'velvet': return '#b91c1c'; // Burgundy
      case 'minimalist': return '#ffffff'; // White/Silver
      default: return '#ffd700';
    }
  };

  useEffect(() => {
    // Sync with HTML class for tailwind/CSS usage
    const root = window.document.documentElement;
    root.classList.remove('theme-ocean', 'theme-diamond', 'theme-velvet', 'theme-minimalist');
    root.classList.add(`theme-${theme}`);
    
    // Also sync Dark mode (Minimalist can be Light optionally, others are Dark)
    if (theme === 'minimalist') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('zuhre_luxury_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zuhre_stealth_mode', isStealthMode.toString());
  }, [isStealthMode]);

  return (
    <LuxuryThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      accentColor: getAccentColor(theme),
      isStealthMode,
      setStealthMode,
      toggleStealthMode: () => setStealthMode(prev => !prev)
    }}>
      {children}
    </LuxuryThemeContext.Provider>
  );
};

export const useLuxuryTheme = () => {
  const context = useContext(LuxuryThemeContext);
  if (!context) throw new Error('useLuxuryTheme must be used within LuxuryThemeProvider');
  return context;
};
