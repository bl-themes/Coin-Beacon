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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161e2e] hover:bg-[#1f293d] border border-[#232d3f] text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
        aria-label="Language and Currency Settings"
      >
        <Globe size={14} className="text-gray-400" />
        <span>{currency}</span>
        <span className="text-gray-500">|</span>
        <span>{language}</span>
        <ChevronDown size={12} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#161e2e] border border-[#232d3f] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
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
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-[#111827] text-gray-300 hover:bg-[#1f293d]'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
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
                      ? 'bg-blue-600/20 text-blue-400 font-medium'
                      : 'text-gray-300 hover:bg-[#1f293d]'
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
