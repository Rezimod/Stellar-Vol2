'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './en.json';
import ka from './ka.json';

type Locale = 'en' | 'ka';
type Translations = typeof en;

const translations: Record<Locale, Translations> = { en, ka };

interface LanguageContextValue {
  locale: Locale;
  t: (key: string) => string;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'ka',
  t: (key) => key,
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ka');

  useEffect(() => {
    const saved = localStorage.getItem('skywatcher-lang') as Locale | null;
    if (saved === 'en' || saved === 'ka') setLocaleState(saved);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('skywatcher-lang', newLocale);
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[locale];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
