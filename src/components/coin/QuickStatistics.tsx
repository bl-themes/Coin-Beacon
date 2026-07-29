import React from 'react';
import { CoinDetailMarketData } from '../../types';
import { formatCurrency, formatNumber, formatDate, formatPercent } from '../../utils/formatters';
import { Award, Database, Maximize2, Layers, TrendingUp, TrendingDown, Calendar, Hash } from 'lucide-react';

interface QuickStatisticsProps {
  marketData: CoinDetailMarketData;
  symbol: string;
  rank: number;
}

export const QuickStatistics: React.FC<QuickStatisticsProps> = ({
  marketData,
  symbol,
  rank,
}) => {
  const circulating = marketData?.circulating_supply || 0;
  const total = marketData?.total_supply || circulating;
  const max = marketData?.max_supply || null;

  const ath = marketData?.ath?.usd || 0;
  const athChange = marketData?.ath_change_percentage?.usd || 0;
  const athDate = marketData?.ath_date?.usd || '';

  const atl = marketData?.atl?.usd || 0;
  const atlChange = marketData?.atl_change_percentage?.usd || 0;
  const atlDate = marketData?.atl_date?.usd || '';

  const statCards = [
    {
      title: 'Market Cap Rank',
      value: `#${rank}`,
      sub: 'Top Tier Digital Asset',
      icon: Hash,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Circulating Supply',
      value: `${formatNumber(circulating)} ${symbol.toUpperCase()}`,
      sub: max ? `${((circulating / max) * 100).toFixed(1)}% of Max Supply` : 'Active Coins',
      icon: Database,
      iconColor: 'text-indigo-500',
    },
    {
      title: 'Max Supply',
      value: max ? `${formatNumber(max)} ${symbol.toUpperCase()}` : 'Unlimited',
      sub: max ? 'Hard Capped' : 'Inflationary Schedule',
      icon: Maximize2,
      iconColor: 'text-sky-500',
    },
    {
      title: 'Total Supply',
      value: `${formatNumber(total)} ${symbol.toUpperCase()}`,
      sub: 'Minted Coins',
      icon: Layers,
      iconColor: 'text-purple-500',
    },
    {
      title: 'All-Time High (ATH)',
      value: formatCurrency(ath),
      sub: `${formatPercent(athChange)} from peak`,
      icon: TrendingUp,
      iconColor: 'text-green-500',
      badgeClass: athChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    },
    {
      title: 'ATH Date',
      value: athDate ? formatDate(athDate) : 'N/A',
      sub: 'Peak Historical Valuation',
      icon: Calendar,
      iconColor: 'text-amber-500',
    },
    {
      title: 'All-Time Low (ATL)',
      value: formatCurrency(atl),
      sub: `+${formatPercent(atlChange)} from lowest`,
      icon: TrendingDown,
      iconColor: 'text-red-500',
      badgeClass: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'ATL Date',
      value: atlDate ? formatDate(atlDate) : 'N/A',
      sub: 'Genesis Floor Recorded',
      icon: Calendar,
      iconColor: 'text-teal-500',
    },
  ];

  return (
    <section aria-labelledby="quick-stats-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <h2 id="quick-stats-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2 font-sans">
        <Award size={18} className="text-blue-500" /> Quick Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 hover:border-blue-500/40 transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">
                <span>{stat.title}</span>
                <Icon size={16} className={`${stat.iconColor} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white truncate">
                {stat.value}
              </div>
              <div className={`text-[11px] font-mono mt-1 ${stat.badgeClass || 'text-slate-500 dark:text-slate-400'}`}>
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
