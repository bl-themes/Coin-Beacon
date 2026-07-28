import React from 'react';
import { Coin } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { PriceBadge } from '../common/PriceBadge';
import { Layers, ArrowRight } from 'lucide-react';

interface RelatedCoinsSectionProps {
  currentCoinId: string;
  coins: Coin[];
  onSelectCoin: (coinId: string) => void;
}

export const RelatedCoinsSection: React.FC<RelatedCoinsSectionProps> = ({
  currentCoinId,
  coins,
  onSelectCoin,
}) => {
  // Filter out the current coin and pick top 4 related coins
  const relatedList = coins
    .filter((c) => c.id !== currentCoinId)
    .slice(0, 4);

  if (relatedList.length === 0) return null;

  return (
    <section aria-labelledby="related-coins-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="related-coins-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
            <Layers size={18} className="text-blue-500" /> Related Cryptocurrencies
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Similar high-cap cryptocurrencies and ecosystem assets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedList.map((coin) => (
          <div
            key={coin.id}
            onClick={() => onSelectCoin(coin.id)}
            className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 hover:border-blue-500/50 rounded-xl p-4 transition-all cursor-pointer group shadow-xs hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-0.5"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {coin.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                    {coin.symbol} • Rank #{coin.market_cap_rank}
                  </span>
                </div>
              </div>
              <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                {formatCurrency(coin.current_price)}
              </span>
              <PriceBadge value={coin.price_change_percentage_24h} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
