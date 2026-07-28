import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n, useCurrency, Language, Currency } from '../../context/AppContext';

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const { currency, setCurrency } = useCurrency();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencies: Currency[] = ['USD', 'IDR'];
  const languages: { code: Language; name: string; short: string }[] = [
    { code: 'en', name: 'English', short: 'EN' },
    { code: 'id', name: 'Bahasa Indonesia', short: 'ID' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-sm"
        aria-label="Language and Currency Settings"
      >
        <Globe size={14} className="text-blue-600 dark:text-blue-400" />
        <span className="font-mono font-bold text-slate-900 dark:text-white">{currency}</span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="uppercase font-semibold">{language}</span>
        <ChevronDown size={12} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Currency Section */}
          <div className="mb-3.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              {t('common.selectCurrency')}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {currencies.map((curr) => {
                const isSelected = currency === curr;
                return (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{curr}</span>
                    {isSelected && <Check size={12} className="text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Section */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              {t('common.selectLanguage')}
            </span>
            <div className="space-y-1">
              {languages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex justify-between items-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {lang.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
