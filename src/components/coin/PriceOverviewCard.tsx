import React from 'react';
import { CoinDetailMarketData } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Clock, Activity, BarChart2, DollarSign } from 'lucide-react';

interface PriceOverviewCardProps {
  marketData: CoinDetailMarketData;
  lastUpdated?: string | number;
}

export const PriceOverviewCard: React.FC<PriceOverviewCardProps> = ({
  marketData,
  lastUpdated,
}) => {
  const price = marketData?.current_price?.usd || 0;
  const high24h = marketData?.high_24h?.usd || 0;
  const low24h = marketData?.low_24h?.usd || 0;
  const change24h = marketData?.price_change_percentage_24h || 0;
  const marketCap = marketData?.market_cap?.usd || 0;
  const volume24h = marketData?.total_volume?.usd || 0;
  const fdv = marketData?.fully_diluted_valuation?.usd || marketCap;

  // Calculate high/low price position percentage for progress slider
  const range = high24h - low24h;
  const position = range > 0 ? Math.min(Math.max(((price - low24h) / range) * 100, 0), 100) : 50;

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Just now';

  return (
    <section aria-labelledby="price-overview-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 id="price-overview-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
          <Activity size={18} className="text-blue-500" /> Price & Market Overview
        </h2>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
          <Clock size={13} />
          <span>Updated: {formattedDate}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Current Price & 24h Change */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Current Price
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(price)}
          </div>
          <div className={`inline-flex items-center gap-1 text-xs font-mono font-bold mt-1 ${change24h >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {change24h >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{formatPercent(change24h)} (24h)</span>
          </div>
        </div>

        {/* Market Cap */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Market Cap
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(marketCap, 0, true)}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
            Rank #{marketData?.market_cap_change_percentage_24h ? marketData.market_cap_change_percentage_24h.toFixed(1) + '%' : '1'}
          </div>
        </div>

        {/* 24h Volume */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            24h Volume
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(volume24h, 0, true)}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
            Vol/Cap: {marketCap ? (volume24h / marketCap).toFixed(4) : 'N/A'}
          </div>
        </div>

        {/* Fully Diluted Valuation */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            FDV
          </span>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(fdv, 0, true)}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
            Fully Diluted Val
          </div>
        </div>
      </div>

      {/* 24h Price Range Slider */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">24h Low</span>
            <span className="text-red-600 dark:text-red-400 font-bold">{formatCurrency(low24h)}</span>
          </div>
          <div className="text-center">
            <span className="text-slate-500 dark:text-slate-400 block">24h Range</span>
            <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(price)}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 dark:text-slate-400 block">24h High</span>
            <span className="text-green-600 dark:text-green-400 font-bold">{formatCurrency(high24h)}</span>
          </div>
        </div>

        {/* Progress Bar with current price marker */}
        <div className="relative w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-500 via-amber-500 to-green-500 rounded-full"
            style={{ width: '100%' }}
          />
        </div>
        <div className="relative w-full h-2 mt-0.5">
          <div
            className="absolute top-0 -translate-x-1/2 w-3 h-3 bg-slate-900 dark:bg-white border-2 border-blue-500 rounded-full shadow-md"
            style={{ left: `${position}%` }}
          />
        </div>
      </div>
    </section>
  );
};
