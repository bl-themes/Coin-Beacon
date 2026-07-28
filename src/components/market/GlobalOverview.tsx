import React, { useState, useEffect, useRef } from 'react';
import { GlobalMarketData, SearchResult } from '../../types';
import { formatCurrency, formatPercent, formatDate } from '../../utils/formatters';
import { searchCoinsAndCategories } from '../../services/search';
import {
  Coins,
  Activity,
  PieChart,
  Clock,
  Search,
  Loader2,
  Zap,
  ArrowRight,
  X,
} from 'lucide-react';
import { useCurrency } from '../../context/AppContext';

interface GlobalOverviewProps {
  data: GlobalMarketData | null;
  loading?: boolean;
  onSelectCoin?: (coinId: string) => void;
  onOpenSearch?: () => void;
}

export const GlobalOverview: React.FC<GlobalOverviewProps> = ({
  data,
  loading,
  onSelectCoin,
}) => {
  const { currency } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({ coins: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced live search integration
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ coins: [], categories: [] });
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchCoinsAndCategories(searchQuery);
      setSearchResults(res);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Reset keyboard selection index when search query or results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery, searchResults]);

  // Keyboard navigation & Escape handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;
      if (e.key === 'Escape') {
        setIsFocused(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const maxLen = Math.min(searchResults.coins.length, 8);
        if (maxLen > 0) {
          setSelectedIndex((prev) => (prev < maxLen - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const maxLen = Math.min(searchResults.coins.length, 8);
        if (maxLen > 0) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxLen - 1));
        }
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && searchResults.coins[selectedIndex]) {
          e.preventDefault();
          handleCoinClick(searchResults.coins[selectedIndex].id);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, searchResults, selectedIndex]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCoinClick = (coinId: string) => {
    setSearchQuery('');
    setIsFocused(false);
    if (onSelectCoin) {
      onSelectCoin(coinId);
    }
  };

  const quickPopularCoins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
    { id: 'solana', name: 'Solana', symbol: 'SOL' },
    { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  ];

  if (loading || !data) {
    return (
      <div className="bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 my-6 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-800/60 rounded w-1/6 mb-4"></div>
        <div className="h-8 bg-slate-200 dark:bg-slate-800/80 rounded w-2/3 mb-6"></div>
        <div className="h-14 bg-slate-100 dark:bg-slate-900/60 rounded-2xl mb-8 border border-slate-200 dark:border-slate-800/50"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/40"></div>
          ))}
        </div>
      </div>
    );
  }

  const currKey = currency.toLowerCase();
  const totalCap = data.total_market_cap?.[currKey] ?? data.total_market_cap?.usd ?? 0;
  const totalVol = data.total_volume?.[currKey] ?? data.total_volume?.usd ?? 0;
  const capChange = data.market_cap_change_percentage_24h_usd || 0;
  const btcDom = data.market_cap_percentage?.btc || 0;
  const ethDom = data.market_cap_percentage?.eth || 0;

  return (
    <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 dark:from-[#121622] dark:via-[#141826] dark:to-[#0D1017] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 my-6 shadow-xl dark:shadow-2xl relative z-30">
      {/* Background Glow Overlay Effects isolated in overflow-hidden container to avoid clipping search dropdown */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Header Content */}
      <div className="relative z-30 max-w-4xl">
        {/* Live Status Eyebrow */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            <span>Live CoinGecko Data</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800/60">
            <Clock size={12} className="text-blue-500 dark:text-blue-400" />
            <span>Updated {formatDate(data.updated_at * 1000)}</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] font-sans">
          Real-Time Crypto <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-500 bg-clip-text text-transparent">Market Intelligence</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mt-3 max-w-2xl font-sans">
          Track global market capitalization, 24h liquidity volume, asset dominance ratios, and quantitative sentiment in real time.
        </p>

        {/* Premium Interactive Hero Search Box */}
        <div className="mt-6 relative z-50" ref={searchContainerRef}>
          <div className="relative">
            <div
              className={`flex items-center gap-3 bg-white dark:bg-slate-900/90 border transition-all duration-200 rounded-2xl px-4 py-3.5 shadow-md dark:shadow-xl ${
                isFocused
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-900'
                  : 'border-slate-300 dark:border-slate-800/80 hover:border-slate-400 dark:hover:border-slate-700'
              }`}
            >
              <Search size={20} className={isFocused ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'} />
              <input
                type="text"
                placeholder="Search 10,000+ coins by name or ticker (e.g., Bitcoin, ETH, Solana)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsFocused(true);
                }}
                onFocus={() => setIsFocused(true)}
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none font-sans"
              />
              {isSearching && <Loader2 size={18} className="text-blue-500 dark:text-blue-400 animate-spin shrink-0" />}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] font-mono text-slate-500 dark:text-slate-400 select-none">
                <span>⌘</span>K
              </kbd>
            </div>

            {/* Live Search Results Dropdown - Directly anchored under input box */}
            {isFocused && (searchQuery.trim().length > 0 || searchResults.coins.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-150 max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center justify-center gap-2">
                    <Loader2 size={14} className="animate-spin text-blue-500 dark:text-blue-400" /> Searching CoinGecko markets...
                  </div>
                ) : searchResults.coins.length > 0 ? (
                  <div className="p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                      Cryptocurrencies ({searchResults.coins.length})
                    </div>
                    {searchResults.coins.slice(0, 8).map((coin, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={coin.id}
                          onClick={() => handleCoinClick(coin.id)}
                          className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-slate-800/90 border border-blue-200 dark:border-slate-700'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={coin.thumb}
                              alt={coin.name}
                              className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            <div>
                              <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {coin.name}
                              </div>
                              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">
                                {coin.symbol} {coin.market_cap_rank ? `• Rank #${coin.market_cap_rank}` : ''}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                            <span>View detail</span>
                            <ArrowRight size={12} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : searchQuery.trim().length > 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No assets found for &quot;<span className="text-slate-900 dark:text-white font-medium">{searchQuery}</span>&quot;
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Quick Popular Assets Suggestions below search input */}
          <div className="flex items-center gap-2 mt-3 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Popular:</span>
            {quickPopularCoins.map((coin) => (
              <button
                key={coin.id}
                onClick={() => handleCoinClick(coin.id)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono transition-all cursor-pointer flex items-center gap-1"
              >
                <span>{coin.name}</span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px]">{coin.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Global Market Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-0">
        {/* Total Market Cap Card */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 hover:border-blue-500/40 transition-all group shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-semibold font-mono text-[11px]">Total Market Cap</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Coins size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalCap, currency, 0, true)}
          </div>
          <div className="text-xs mt-2 font-mono flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md font-semibold text-xs ${capChange >= 0 ? 'text-green-600 dark:text-green-500 bg-green-500/10 border border-green-500/20' : 'text-red-600 dark:text-red-500 bg-red-500/10 border border-red-500/20'}`}>
              {formatPercent(capChange)}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">24h Valuation</span>
          </div>
        </div>

        {/* 24h Trading Volume Card */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/40 transition-all group shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-semibold font-mono text-[11px]">24h Volume</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Activity size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(totalVol, currency, 0, true)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">
            Active Markets: <span className="text-slate-800 dark:text-slate-200 font-semibold">{data.markets ? data.markets.toLocaleString() : '1,120'}</span>
          </div>
        </div>

        {/* Bitcoin Dominance Card */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 hover:border-amber-500/40 transition-all group shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-semibold font-mono text-[11px]">BTC Dominance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PieChart size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tracking-tight">
            {btcDom.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 dark:bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, btcDom)}%` }}></div>
          </div>
        </div>

        {/* Ethereum Dominance Card */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 hover:border-blue-500/40 transition-all group shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="uppercase tracking-wider font-semibold font-mono text-[11px]">ETH Dominance</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tracking-tight">
            {ethDom.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800/80 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ethDom)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

