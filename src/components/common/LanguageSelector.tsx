import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('EN');

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'JA', name: '日本語' },
    { code: 'DE', name: 'Deutsch' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#161e2e] dark:hover:bg-[#1f293d] border border-slate-200 dark:border-[#232d3f] text-xs font-medium text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Language and Currency Settings"
      >
        <Globe size={14} className="text-slate-500 dark:text-gray-400" />
        <span>{currency}</span>
        <span className="text-slate-400 dark:text-gray-500">|</span>
        <span>{language}</span>
        <ChevronDown size={12} className="text-slate-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#161e2e] border border-slate-200 dark:border-[#232d3f] rounded-xl shadow-xl dark:shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 block mb-1.5 font-mono">
              Currency
            </span>
            <div className="grid grid-cols-3 gap-1">
              {currencies.map((curr) => (
                <button
                  key={curr}
                  onClick={() => {
                    setCurrency(curr);
                    setIsOpen(false);
                  }}
                  className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                    currency === curr
                      ? 'bg-[#daff41] text-slate-950 font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#111827] text-slate-700 dark:text-gray-300 dark:hover:bg-[#1f293d]'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 block mb-1.5 font-mono">
              Language
            </span>
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-xs flex justify-between items-center transition-colors ${
                    language === lang.code
                      ? 'bg-[#daff41]/20 dark:bg-[#daff41]/15 text-[#455c00] dark:text-[#daff41] font-bold'
                      : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-[#1f293d]'
                  }`}
                >
                  <span>{lang.name}</span>
                  <span className="text-[10px] font-mono opacity-60">{lang.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
