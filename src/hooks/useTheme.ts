import { useEffect, useState } from 'react';
import { Theme, getThemeColors, generateCSSVariables } from '@/styles/theme-config';

/**
 * Tema yönetim hook'u
 * 
 * Açık/Koyu tema geçişini yönetir ve localStorage'da kaydeder
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Tema tercihini localStorage'dan yükle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  // Tema değişikliğini DOM'a uygula
  const applyTheme = (newTheme: Theme) => {
    const html = document.documentElement;
    html.setAttribute('data-theme', newTheme);
    html.classList.toggle('dark', newTheme === 'dark');

    // CSS değişkenlerini ayarla
    const variables = generateCSSVariables(newTheme);
    Object.entries(variables).forEach(([key, value]) => {
      html.style.setProperty(key, value);
    });

    // localStorage'da kaydet
    localStorage.setItem('theme', newTheme);
  };

  // Tema geçişi yap
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Belirli bir temaya geç
  const switchTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Tema renklerini getir
  const colors = getThemeColors(theme);

  return {
    theme,
    toggleTheme,
    switchTheme,
    colors,
    mounted,
  };
};
