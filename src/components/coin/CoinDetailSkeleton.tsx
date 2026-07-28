import React from 'react';

export const CoinDetailSkeleton: React.FC = () => {
  return (
    <div className="py-2 space-y-6 animate-pulse">
      {/* Coin Header Skeleton */}
      <div className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="flex gap-2">
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-2 text-right">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded ml-auto" />
              <div className="h-8 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" />
            </div>
            <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Price Overview Skeleton */}
      <div className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-900/40 rounded-xl p-4 space-y-2">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
        <div className="h-12 bg-slate-100 dark:bg-slate-900/40 rounded-xl" />
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-56 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="h-80 w-full bg-slate-100 dark:bg-slate-900/40 rounded-xl" />
      </div>

      {/* Quick Statistics Skeleton */}
      <div className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6">
        <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-slate-900/40 rounded-xl p-4 space-y-2">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
