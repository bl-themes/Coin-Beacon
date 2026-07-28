import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try searching with a different cryptocurrency symbol, name, or ticker.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="bg-[#161e2e] border border-[#232d3f] rounded-2xl p-8 text-center max-w-sm mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-3">
        <SearchX size={22} />
      </div>
      <h4 className="text-base font-semibold text-gray-200 mb-1">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 bg-[#1f293d] hover:bg-[#28354f] text-gray-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
