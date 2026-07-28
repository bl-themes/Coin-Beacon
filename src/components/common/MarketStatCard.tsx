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
      <div className="bg-[#161e2e] border border-[#232d3f] rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-gray-700/50 rounded w-1/2 mb-3"></div>
        <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700/30 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#161e2e] hover:bg-[#1c263a] transition-colors border border-[#232d3f] rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xl font-bold font-mono text-gray-100 tracking-tight">{value}</span>
        {change !== undefined && <PriceBadge value={change} size="sm" />}
      </div>

      {subtext && <span className="text-xs text-gray-500 mt-1.5 font-sans">{subtext}</span>}
    </div>
  );
};
