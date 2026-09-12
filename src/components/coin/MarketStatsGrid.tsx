import React from 'react';
import { CoinDetailMarketData } from '../../types';
import { formatCurrency, formatNumber, formatDate, formatPercent } from '../../utils/formatters';
import { Coins, Database, PieChart, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MarketStatsGridProps {
  marketData: CoinDetailMarketData;
  symbol: string;
}

export const MarketStatsGrid: React.FC<MarketStatsGridProps> = ({ marketData, symbol }) => {
  const marketCap = marketData.market_cap?.usd || 0;
  const fdv = marketData.fully_diluted_valuation?.usd || 0;
  const volume24h = marketData.total_volume?.usd || 0;
  const high24h = marketData.high_24h?.usd || 0;
  const low24h = marketData.low_24h?.usd || 0;

  const circulating = marketData.circulating_supply || 0;
  const total = marketData.total_supply || circulating;
  const max = marketData.max_supply || null;

  const ath = marketData.ath?.usd || 0;
  const athChange = marketData.ath_change_percentage?.usd || 0;
  const athDate = marketData.ath_date?.usd || '';

  const atl = marketData.atl?.usd || 0;
  const atlChange = marketData.atl_change_percentage?.usd || 0;
  const atlDate = marketData.atl_date?.usd || '';

  const volumeToCapRatio = marketCap ? (volume24h / marketCap).toFixed(4) : 'N/A';

  return (
    <div className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-6 shadow-sm dark:shadow-2xl">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2 font-sans">
        <Activity size={18} className="text-blue-500" /> Market Capitalization & Valuation Stats
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Market Cap */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/40 rounded-xl p-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1 font-mono">
            Market Cap
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(marketCap, 0, true)}</div>
        </div>

        {/* Fully Diluted Valuation */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/40 rounded-xl p-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1 font-mono">
            Fully Diluted Val (FDV)
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(fdv, 0, true)}</div>
        </div>

        {/* 24h Trading Volume */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/40 rounded-xl p-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1 font-mono">
            24h Volume
          </span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(volume24h, 0, true)}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">Vol / Cap: {volumeToCapRatio}</div>
        </div>

        {/* 24h High / Low */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/40 rounded-xl p-4">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 block mb-1 font-mono">
            24h High / Low
          </span>
          <div className="text-sm font-bold font-mono text-slate-900 dark:text-white flex items-center justify-between">
            <span className="text-green-600 dark:text-green-500">{formatCurrency(high24h)}</span>
            <span className="text-slate-400 dark:text-slate-500">/</span>
            <span className="text-red-600 dark:text-red-500">{formatCurrency(low24h)}</span>
          </div>
        </div>
      </div>

      {/* Supply & Historical Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800/60">
        {/* Supply Details */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/40 rounded-xl p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5">
            <Database size={14} className="text-blue-500 dark:text-blue-400" /> Token Supply Dynamics
          </h4>

          <div className="flex justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-800/40">
            <span className="text-slate-500 dark:text-slate-400">Circulating Supply</span>
            <span className="font-mono text-slate-900 dark:text-white font-bold">
              {formatNumber(circulating)} <span className="text-slate-500 dark:text-slate-400 uppercase">{symbol}</span>
            </span>
          </div>

          <div className="flex justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-800/40">
            <span className="text-slate-500 dark:text-slate-400">Total Supply</span>
            <span className="font-mono text-slate-900 dark:text-white font-bold">
              {formatNumber(total)} <span className="text-slate-500 dark:text-slate-400 uppercase">{symbol}</span>
            </span>
          </div>

          <div className="flex justify-between text-xs py-1">
            <span className="text-slate-500 dark:text-slate-400">Max Supply</span>
            <span className="font-mono text-slate-900 dark:text-white font-bold">
              {max ? `${formatNumber(max)} ${symbol.toUpperCase()}` : 'Unlimited / Inflationary'}
            </span>
          </div>
        </div>

        {/* All Time Records */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/40 rounded-xl p-5 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono flex items-center gap-1.5">
            <Coins size={14} className="text-amber-500 dark:text-amber-400" /> All-Time Records
          </h4>

          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200 dark:border-slate-800/40">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">All-Time High (ATH)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{formatCurrency(ath)}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{formatDate(athDate)}</span>
            </div>
            <span className="font-mono text-red-600 dark:text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              {formatPercent(athChange)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs py-1">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">All-Time Low (ATL)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{formatCurrency(atl)}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{formatDate(atlDate)}</span>
            </div>
            <span className="font-mono text-green-600 dark:text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
              +{formatPercent(atlChange)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
