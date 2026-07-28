import React, { createContext, useContext, useState } from 'react';
import { en } from '../i18n/locales/en';
import { id } from '../i18n/locales/id';
import { formatCurrency } from '../utils/formatters';

export type Language = 'en' | 'id';
export type Currency = 'USD' | 'IDR';

const dictionaries: Record<Language, any> = { en, id };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrencyVal: (
    value: number | null | undefined,
    digits?: number,
    compact?: boolean
  ) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state with browser auto-detection & persistence
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('coinbeacon_language');
    if (saved === 'en' || saved === 'id') return saved;
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('id')) {
        return 'id';
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('coinbeacon_language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = dictionaries[language] || dictionaries.en;
    const keys = key.split('.');
    let val: any = dict;

    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        // Fallback to English
        let fallbackVal: any = dictionaries.en;
        for (const fk of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fk in fallbackVal) {
            fallbackVal = fallbackVal[fk];
          } else {
            return key;
          }
        }
        val = fallbackVal;
        break;
      }
    }

    if (typeof val !== 'string') return key;

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        val = (val as string).replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      });
    }

    return val;
  };

  // 2. Currency state with persistence
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('coinbeacon_currency');
    if (saved === 'USD' || saved === 'IDR') return saved as Currency;
    return 'USD';
  });

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('coinbeacon_currency', curr);
  };

  const formatCurrencyVal = (
    value: number | null | undefined,
    digits: number = 2,
    compact: boolean = false
  ) => {
    return formatCurrency(value, currency, digits, compact);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrencyVal }}>
        {children}
      </CurrencyContext.Provider>
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within AppProvider');
  return ctx;
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within AppProvider');
  return ctx;
};
