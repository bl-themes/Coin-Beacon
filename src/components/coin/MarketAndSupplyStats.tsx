import React from 'react';
import { CoinDetailMarketData } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { PieChart, Database, Zap, ShieldCheck } from 'lucide-react';
import { useCurrency, useI18n } from '../../context/AppContext';

interface MarketAndSupplyStatsProps {
  marketData: CoinDetailMarketData;
  symbol: string;
}

export const MarketAndSupplyStats: React.FC<MarketAndSupplyStatsProps> = ({
  marketData,
  symbol,
}) => {
  const { currency } = useCurrency();
  const { t } = useI18n();

  const marketCap = marketData?.market_cap?.[currency.toLowerCase()] ?? marketData?.market_cap?.usd ?? 0;
  const fdv = marketData?.fully_diluted_valuation?.[currency.toLowerCase()] ?? marketData?.fully_diluted_valuation?.usd ?? marketCap;
  const volume24h = marketData?.total_volume?.[currency.toLowerCase()] ?? marketData?.total_volume?.usd ?? 0;

  const circulating = marketData?.circulating_supply || 0;
  const total = marketData?.total_supply || circulating;
  const max = marketData?.max_supply || null;

  const volumeToCapRatio = marketCap ? (volume24h / marketCap).toFixed(4) : 'N/A';
  const circulatingPctOfMax = max ? Math.min(Math.round((circulating / max) * 100), 100) : null;
  const circulatingPctOfTotal = total ? Math.min(Math.round((circulating / total) * 100), 100) : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
      {/* Market Statistics Section */}
      <section aria-labelledby="market-stats-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-2xl">
        <h2 id="market-stats-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2 font-sans">
          <PieChart size={18} className="text-blue-500" /> {t('coinDetail.marketStats')}
        </h2>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">{t('coinDetail.marketCap')}</span>
              <span className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(marketCap, currency, 0, true)}</span>
            </div>
            <Zap size={18} className="text-blue-500" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">{t('coinDetail.volume24h')}</span>
              <span className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(volume24h, currency, 0, true)}</span>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
              Vol/Cap: {volumeToCapRatio}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">{t('coinDetail.fdv')}</span>
              <span className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white">{formatCurrency(fdv, currency, 0, true)}</span>
            </div>
            <ShieldCheck size={18} className="text-indigo-500" />
          </div>
        </div>
      </section>

      {/* Supply Information Section */}
      <section aria-labelledby="supply-info-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 shadow-sm dark:shadow-2xl">
        <h2 id="supply-info-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2 font-sans">
          <Database size={18} className="text-indigo-500" /> {t('coinDetail.supplyInfo')}
        </h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">{t('coinDetail.circulatingSupply')}</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {formatNumber(circulating)} <span className="uppercase text-slate-400">{symbol}</span>
              </span>
            </div>
            {circulatingPctOfMax !== null && (
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${circulatingPctOfMax}%` }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between text-xs font-mono py-2 border-b border-slate-200 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">{t('coinDetail.totalSupply')}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {formatNumber(total)} <span className="uppercase text-slate-400">{symbol}</span>
            </span>
          </div>

          <div className="flex justify-between text-xs font-mono py-2 border-b border-slate-200 dark:border-slate-800/60">
            <span className="text-slate-500 dark:text-slate-400">{t('coinDetail.maxSupply')}</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {max ? `${formatNumber(max)} ${symbol.toUpperCase()}` : 'Unlimited (No Hard Cap)'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-500 dark:text-slate-400">
            <span>Verified Supply Ratio</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {circulatingPctOfMax !== null ? `${circulatingPctOfMax}% Circulating` : `${circulatingPctOfTotal}% Minted`}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
