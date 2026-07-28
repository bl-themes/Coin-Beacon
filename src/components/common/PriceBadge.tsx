import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercent } from '../../utils/formatters';

interface PriceBadgeProps {
  value: number | null | undefined;
  showIcon?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceBadge: React.FC<PriceBadgeProps> = ({
  value,
  showIcon = true,
  className = '',
  size = 'md',
}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return <span className="text-gray-500 font-mono text-xs">0.00%</span>;
  }

  const isPositive = value >= 0;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5 gap-0.5',
    md: 'text-sm px-2 py-0.5 gap-1 font-medium',
    lg: 'text-base px-2.5 py-1 gap-1 font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center rounded-md font-mono ${sizeClasses[size]} ${
        isPositive
          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
          : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
      } ${className}`}
    >
      {showIcon && (
        isPositive ? (
          <TrendingUp size={iconSizes[size]} className="shrink-0" />
        ) : (
          <TrendingDown size={iconSizes[size]} className="shrink-0" />
        )
      )}
      {formatPercent(value)}
    </span>
  );
};
