import React from 'react';
import { Coin } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';

interface TrendingBarProps {
  coins: Coin[];
  onSelectCoin: (coinId: string) => void;
}

export const TrendingBar: React.FC<TrendingBarProps> = ({ coins, onSelectCoin }) => {
  if (!coins || coins.length === 0) return null;

  // Compute gainers & losers
  const sortedBy24h = [...coins].sort(
    (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
  );

  const topGainers = sortedBy24h.slice(0, 3);
  const topLosers = [...sortedBy24h].reverse().slice(0, 3);
  const trending = coins.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {/* Trending Box */}
      <div className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 font-mono">
          <Flame size={15} /> Trending Coins
        </div>
        <div className="space-y-2">
          {trending.map((coin, idx) => (
            <button
              key={coin.id}
              onClick={() => onSelectCoin(coin.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer text-left border border-slate-200 dark:border-slate-800/40"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 w-4">#{idx + 1}</span>
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{coin.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">{coin.symbol}</span>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-slate-900 dark:text-white font-medium">{formatCurrency(coin.current_price)}</div>
                <div
                  className={
                    (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                  }
                >
                  {formatPercent(coin.price_change_percentage_24h)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top Gainers */}
      <div className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-500 mb-3 font-mono">
          <TrendingUp size={15} /> Top 24h Gainers
        </div>
        <div className="space-y-2">
          {topGainers.map((coin) => (
            <button
              key={coin.id}
              onClick={() => onSelectCoin(coin.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer text-left border border-slate-200 dark:border-slate-800/40"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{coin.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">{coin.symbol}</span>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-slate-900 dark:text-white font-medium">{formatCurrency(coin.current_price)}</div>
                <div className="text-green-600 dark:text-green-500 font-semibold">
                  {formatPercent(coin.price_change_percentage_24h)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500 mb-3 font-mono">
          <TrendingDown size={15} /> Top 24h Decliners
        </div>
        <div className="space-y-2">
          {topLosers.map((coin) => (
            <button
              key={coin.id}
              onClick={() => onSelectCoin(coin.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer text-left border border-slate-200 dark:border-slate-800/40"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-5 h-5 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">{coin.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">{coin.symbol}</span>
              </div>
              <div className="text-right font-mono text-xs">
                <div className="text-slate-900 dark:text-white font-medium">{formatCurrency(coin.current_price)}</div>
                <div className="text-red-600 dark:text-red-500 font-semibold">
                  {formatPercent(coin.price_change_percentage_24h)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
