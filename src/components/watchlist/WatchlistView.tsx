import React from 'react';
import { Coin } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { Star, Trash2, ArrowRight, Bookmark } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface WatchlistViewProps {
  coins: Coin[];
  watchlist: string[];
  onSelectCoin: (coinId: string) => void;
  onRemoveFromWatchlist: (coinId: string) => void;
  onGoToCoins: () => void;
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  coins,
  watchlist,
  onSelectCoin,
  onRemoveFromWatchlist,
  onGoToCoins,
}) => {
  const watchlistedCoins = coins.filter((c) => watchlist.includes(c.id));

  if (watchlistedCoins.length === 0) {
    return (
      <div className="my-12">
        <EmptyState
          title="Your Watchlist is empty"
          description="Star cryptocurrencies from the Top 100 table or Coin detail pages to build your personal market monitoring hub."
          actionLabel="Explore Top 100 Cryptos"
          onAction={onGoToCoins}
        />
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
            <Bookmark size={24} className="text-amber-400" /> Personal Crypto Watchlist ({watchlistedCoins.length})
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Real-time price tracking and metrics for your starred assets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {watchlistedCoins.map((coin) => {
          const change24 = coin.price_change_percentage_24h || 0;
          return (
            <div
              key={coin.id}
              onClick={() => onSelectCoin(coin.id)}
              className="bg-[#14171F] border border-slate-800/60 rounded-2xl p-5 hover:border-amber-500/40 hover:bg-slate-900/40 transition-all cursor-pointer group shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full bg-slate-900"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                        {coin.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {coin.symbol} • Rank #{coin.market_cap_rank || '-'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(coin.id);
                    }}
                    className="p-1.5 rounded-lg bg-slate-900/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800/60 transition-colors cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="my-4 pt-3 border-t border-slate-800/60">
                  <div className="text-[10px] uppercase font-mono text-slate-400 mb-0.5">Live Price</div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-2xl font-bold font-mono text-white">
                      {formatCurrency(coin.current_price)}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        change24 >= 0 ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
                      }`}
                    >
                      {formatPercent(change24)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3 border-t border-slate-800/60">
                <span>Cap: {formatCurrency(coin.market_cap, 0, true)}</span>
                <span className="text-blue-400 font-medium group-hover:underline flex items-center gap-1">
                  View Detail <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
