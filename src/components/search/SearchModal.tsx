import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { searchCoinsAndCategories } from '../../services/search';
import { SearchResult } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCoin: (coinId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectCoin }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ coins: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ coins: [], categories: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ coins: [], categories: [] });
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchCoinsAndCategories(query);
      setResults(res);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#0e1420] border border-slate-200 dark:border-[#232d3f] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-[#232d3f] gap-3 bg-slate-50 dark:bg-[#131b2b]">
          <Search size={18} className="text-slate-400 dark:text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search Bitcoin, Ethereum, Solana, ticker, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none font-sans"
          />
          {loading && <Loader2 size={16} className="text-blue-500 animate-spin shrink-0" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-200 dark:bg-[#1f293d] text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-xs cursor-pointer font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {!query && (
            <div className="text-center py-8">
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">Popular searches: BTC, ETH, SOL, XRP, L1, DeFi</p>
            </div>
          )}

          {query && !loading && results.coins.length === 0 && results.categories.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-gray-400 text-sm">
              No matching cryptocurrency found for &quot;{query}&quot;.
            </div>
          )}

          {results.coins.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2 font-mono flex items-center gap-1">
                <TrendingUp size={12} /> Cryptocurrencies ({results.coins.length})
              </div>
              <div className="space-y-1">
                {results.coins.slice(0, 8).map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => {
                      onSelectCoin(coin.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#161e2e] transition-colors group cursor-pointer text-left border border-transparent hover:border-slate-200 dark:hover:border-[#232d3f]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={coin.thumb || coin.large}
                        alt={coin.name}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-gray-800"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{coin.name}</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400 font-mono uppercase">
                            {coin.symbol}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {coin.market_cap_rank && (
                        <span className="text-xs font-mono text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-[#161e2e] px-2 py-0.5 rounded border border-slate-200 dark:border-[#232d3f]">
                          Rank #{coin.market_cap_rank}
                        </span>
                      )}
                      <ArrowRight size={14} className="text-slate-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.categories.length > 0 && (
            <div className="pt-2 border-t border-slate-200 dark:border-[#232d3f]">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2 font-mono flex items-center gap-1">
                <Layers size={12} /> Categories
              </div>
              <div className="flex flex-wrap gap-2">
                {results.categories.slice(0, 6).map((cat) => (
                  <span
                    key={cat.id}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#161e2e] border border-slate-200 dark:border-[#232d3f] text-xs font-medium text-slate-700 dark:text-gray-300 flex items-center gap-1.5"
                  >
                    <Layers size={12} className="text-blue-600 dark:text-blue-400" />
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
