import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

type Language = 'FR' | 'EN';

interface TranslationContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string) => string;
}

const translations = {
  EN: en,
  FR: fr
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode; defaultLang?: Language }> = ({ 
  children, 
  defaultLang = 'FR' 
}) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('auditax-lang') as Language;
    return saved === 'EN' || saved === 'FR' ? saved : defaultLang;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('auditax-lang', newLang);
    // Custom event to notify legacy components if needed
    window.dispatchEvent(new CustomEvent('auditax-lang-changed', { detail: newLang }));
  };

  // Helper function to resolve nested translation keys like 'billing.title'
  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[lang];

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        result = undefined;
        break;
      }
    }

    if (result && typeof result === 'string') {
      return result;
    }

    // Secondary fallback to standard list or return the key
    return path;
  };

  return (
    <TranslationContext.Provider value={{ lang, setLang, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  // If used outside of provider, fallback to local state hook gracefully
  if (!context) {
    // Elegant fallback to prevent errors in fast-moving components
    const [localLang, setLocalLang] = useState<Language>(() => {
      const saved = localStorage.getItem('auditax-lang') as Language;
      return saved === 'EN' || saved === 'FR' ? saved : 'FR';
    });

    const updateLang = (newLang: Language) => {
      setLocalLang(newLang);
      localStorage.setItem('auditax-lang', newLang);
    };

    const t = (path: string): string => {
      const keys = path.split('.');
      let result: any = translations[localLang];
      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          result = undefined;
          break;
        }
      }
      return typeof result === 'string' ? result : path;
    };

    return { t, lang: localLang, setLang: updateLang };
  }

  return context;
};
