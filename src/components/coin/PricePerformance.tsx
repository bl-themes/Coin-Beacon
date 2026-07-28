import React from 'react';
import { CoinDetailMarketData } from '../../types';
import { formatPercent } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Gauge } from 'lucide-react';

interface PricePerformanceProps {
  marketData: CoinDetailMarketData;
}

export const PricePerformance: React.FC<PricePerformanceProps> = ({ marketData }) => {
  const perf24h = marketData?.price_change_percentage_24h || 0;
  const perf7d = marketData?.price_change_percentage_7d || 0;
  const perf14d = marketData?.price_change_percentage_14d || 0;
  const perf30d = marketData?.price_change_percentage_30d || 0;
  const perf1y = marketData?.price_change_percentage_1y || 0;

  const horizons = [
    { label: '24 Hours', value: perf24h },
    { label: '7 Days', value: perf7d },
    { label: '14 Days', value: perf14d },
    { label: '30 Days', value: perf30d },
    { label: '1 Year', value: perf1y },
  ];

  return (
    <section aria-labelledby="price-performance-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <h2 id="price-performance-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2 font-sans">
        <Gauge size={18} className="text-blue-500" /> Price Performance Matrix
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {horizons.map((h, idx) => {
          const isPositive = h.value >= 0;
          return (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all"
            >
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                {h.label}
              </span>
              <div
                className={`text-lg sm:text-xl font-bold font-mono flex items-center justify-center gap-1 ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{isPositive ? '+' : ''}{formatPercent(h.value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
