import React from 'react';
import { Tag } from 'lucide-react';

interface CategoriesBadgesProps {
  categories: string[];
  onSelectCategory?: (category: string) => void;
}

export const CategoriesBadges: React.FC<CategoriesBadgesProps> = ({
  categories,
  onSelectCategory,
}) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section aria-labelledby="categories-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <h2 id="categories-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-3 flex items-center gap-2 font-sans">
        <Tag size={18} className="text-[#455c00] dark:text-[#daff41]" /> Asset Categories & Ecosystems
      </h2>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => onSelectCategory?.(cat)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/60 hover:bg-[#daff41]/20 dark:hover:bg-[#daff41]/10 hover:text-[#455c00] dark:hover:text-[#daff41] hover:border-[#daff41]/40 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
          >
            <Tag size={12} className="text-slate-400" />
            <span>{cat}</span>
          </button>
        ))}
      </div>
    </section>
  );
};
