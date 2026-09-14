import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 my-4">
      <button
        onClick={items[0]?.onClick}
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        aria-label="Home"
      >
        <Home size={13} />
        <span>Home</span>
      </button>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={12} className="text-slate-400 dark:text-gray-600 shrink-0" />
          {item.active ? (
            <span className="text-[#455c00] dark:text-[#daff41] font-bold font-mono">{item.label}</span>
          ) : (
            <button
              onClick={item.onClick}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
