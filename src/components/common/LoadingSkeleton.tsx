import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="w-full space-y-3">
      <div className="h-10 bg-slate-200 dark:bg-[#161e2e] rounded-lg animate-pulse border border-slate-300 dark:border-[#232d3f]"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-slate-100 dark:bg-[#161e2e]/60 rounded-lg animate-pulse border border-slate-200 dark:border-[#232d3f]/50 flex items-center px-4 gap-4"
        >
          <div className="w-6 h-4 bg-slate-200 dark:bg-gray-700/50 rounded"></div>
          <div className="w-8 h-8 bg-slate-200 dark:bg-gray-700/50 rounded-full"></div>
          <div className="w-24 h-4 bg-slate-200 dark:bg-gray-700/50 rounded"></div>
          <div className="ml-auto w-20 h-4 bg-slate-200 dark:bg-gray-700/50 rounded"></div>
          <div className="w-16 h-4 bg-slate-200 dark:bg-gray-700/50 rounded hidden md:block"></div>
          <div className="w-24 h-4 bg-slate-200 dark:bg-gray-700/50 rounded hidden lg:block"></div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-80 bg-white dark:bg-[#161e2e] rounded-xl border border-slate-200 dark:border-[#232d3f] p-6 animate-pulse flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="h-6 w-32 bg-slate-200 dark:bg-gray-700/50 rounded"></div>
        <div className="flex gap-2">
          {['1D', '7D', '1M', '1Y', 'ALL'].map((r) => (
            <div key={r} className="h-8 w-10 bg-slate-200 dark:bg-gray-700/30 rounded"></div>
          ))}
        </div>
      </div>
      <div className="h-48 w-full bg-slate-100 dark:bg-gray-800/40 rounded-lg flex items-end justify-between p-4 gap-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-200 dark:bg-gray-700/40 rounded-t w-full"
            style={{ height: `${20 + Math.sin(i) * 30 + Math.random() * 40}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};
