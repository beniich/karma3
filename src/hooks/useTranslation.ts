import { useState, useCallback } from 'react';
import en from '../locales/en.json';
import fr from '../locales/fr.json';

type Lang = 'FR' | 'EN';
const translations: Record<Lang, any> = { EN: en, FR: fr };

export function useTranslation(initialLang: Lang = 'FR') {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('auditax-lang') as Lang) || initialLang;
  });

  const setLang = useCallback((newLang: Lang) => {
    localStorage.setItem('auditax-lang', newLang);
    setLangState(newLang);
  }, []);

  const t = useCallback((path: string): string => {
    const keys = path.split('.');
    let result: any = translations[lang];
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? path; // fallback to the key if missing
  }, [lang]);

  return { t, lang, setLang };
}
