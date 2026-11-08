import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import tr from '../locales/tr.json';
import en from '../locales/en.json';
import ar from '../locales/ar.json';
import ru from '../locales/ru.json';

export type Language = 'tr' | 'en' | 'ar' | 'ru';
export const LANGUAGES: readonly Language[] = ['tr', 'en', 'ar', 'ru'];
const STORAGE_KEY = 'zuhre-lang';

type Dict = { [k: string]: string | Dict };
const translations: Record<Language, Dict> = { tr, en, ar, ru };

/** Noktalı anahtarı sözlükte arar; bulunamazsa undefined. */
function lookup(dict: Dict, path: string): string | undefined {
  let cur: string | Dict | undefined = dict;
  for (const k of path.split('.')) {
    if (cur && typeof cur === 'object' && k in cur) cur = cur[k];
    else return undefined;
  }
  return typeof cur === 'string' ? cur : undefined;
}

/**
 * Çeviri: seçili dil → Türkçe (kaynak dil) → anahtarın kendisi.
 * `{name}` yer tutucuları `vars` ile doldurulur.
 */
export function translate(language: Language, path: string, vars?: Record<string, string | number>): string {
  const raw = lookup(translations[language], path) ?? lookup(translations.tr, path) ?? path;
  return vars ? raw.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : raw;
}

function readStoredLanguage(): Language {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && (LANGUAGES as readonly string[]).includes(v)) return v as Language;
  } catch {
    /* gizli sekme / engellenmiş depolama */
  }
  return 'tr';
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* depolama yoksa yalnız bu oturumda geçerli */
    }
  }, []);

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => translate(language, key, vars), [language]);
  const value = useMemo(() => ({ language, setLanguage, t, isRTL }), [language, setLanguage, t, isRTL]);

  return (
    <LanguageContext.Provider value={value}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

/** Provider dışında (testler, izole bileşenler) Türkçeye düşen güvenli sürüm. */
export const useT = () => {
  const context = useContext(LanguageContext);
  return context?.t ?? ((key: string, vars?: Record<string, string | number>) => translate('tr', key, vars));
};
