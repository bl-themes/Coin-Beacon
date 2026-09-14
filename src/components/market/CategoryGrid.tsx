import React from 'react';
import { CategoryItem } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { Layers, TrendingUp } from 'lucide-react';

interface CategoryGridProps {
  categories: CategoryItem[];
  onSelectCategory?: (id: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onSelectCategory }) => {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
            <Layers size={20} className="text-[#455c00] dark:text-[#daff41]" /> Crypto Sectors & Categories
          </h2>
          <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">
            Track capital allocation across major cryptocurrency market sectors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const isPositive = cat.market_cap_change_24h >= 0;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-5 hover:border-[#daff41]/40 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-pointer group shadow-xs dark:shadow-none"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-[#455c00] dark:group-hover:text-[#daff41] transition-colors">
                  {cat.name}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isPositive ? 'text-green-600 dark:text-green-500 bg-green-500/10' : 'text-red-600 dark:text-red-500 bg-red-500/10'
                  }`}
                >
                  {formatPercent(cat.market_cap_change_24h)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-200 dark:border-slate-800/60 pt-3">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono block">
                    Sector Market Cap
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                    {formatCurrency(cat.market_cap, 0, true)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-mono block">
                    24h Volume
                  </span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                    {formatCurrency(cat.volume_24h, 0, true)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
