import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'tr', label: 'TÜRKÇE', flag: '🇹🇷' },
    { code: 'en', label: 'ENGLISH', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
    { code: 'ru', label: 'РУССКИЙ', flag: '🇷🇺' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative pointer-events-auto">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition-all text-white backdrop-blur-md"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest italic">{currentLang?.code}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-48 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,1)] z-[110]"
          >
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as Language);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all group ${language === lang.code ? 'bg-primary/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg group-hover:scale-125 transition-transform">{lang.flag}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest italic text-left">{lang.label}</span>
                  </div>
                  {language === lang.code && (
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#d4af37]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
