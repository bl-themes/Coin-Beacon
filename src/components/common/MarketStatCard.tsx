import React from 'react';
import { PriceBadge } from './PriceBadge';

interface MarketStatCardProps {
  title: string;
  value: string;
  change?: number;
  subtext?: string;
  icon?: React.ReactNode;
  loading?: boolean;
}

export const MarketStatCard: React.FC<MarketStatCardProps> = ({
  title,
  value,
  change,
  subtext,
  icon,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-slate-100 dark:bg-[#161e2e] border border-slate-200 dark:border-[#232d3f] rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-gray-700/50 rounded w-1/2 mb-3"></div>
        <div className="h-6 bg-slate-200 dark:bg-gray-700/50 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-200 dark:bg-gray-700/30 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#161e2e] hover:bg-slate-50 dark:hover:bg-[#1c263a] transition-colors border border-slate-200 dark:border-[#232d3f] rounded-xl p-4 flex flex-col justify-between shadow-xs dark:shadow-none">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-slate-400 dark:text-gray-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xl font-bold font-mono text-slate-900 dark:text-gray-100 tracking-tight">{value}</span>
        {change !== undefined && <PriceBadge value={change} size="sm" />}
      </div>

      {subtext && <span className="text-xs text-slate-500 dark:text-gray-500 mt-1.5 font-sans">{subtext}</span>}
    </div>
  );
};
