import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isDelayedNotice?: boolean;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title = 'Data Connection Warning',
  message = 'Unable to fetch real-time market data directly from source. Displaying cached buffer values.',
  onRetry,
  isDelayedNotice = false,
}) => {
  if (isDelayedNotice) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={15} className="shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Live market updates temporarily delayed. Showing high-fidelity cached buffer.</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 font-semibold hover:underline text-amber-900 dark:text-amber-200 cursor-pointer ml-2 shrink-0"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#161e2e] border border-rose-500/30 rounded-2xl p-6 text-center max-w-md mx-auto my-8 shadow-md dark:shadow-2xl">
      <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-gray-400 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#daff41] hover:bg-[#cbf232] text-slate-950 font-bold rounded-lg text-sm transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-[#daff41]/20"
        >
          <RefreshCw size={16} /> Retry Request
        </button>
      )}
    </div>
  );
};
