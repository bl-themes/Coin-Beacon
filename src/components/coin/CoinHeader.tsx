import React, { useState } from 'react';
import { CoinDetail } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { PriceBadge } from '../common/PriceBadge';
import { Star, Share2, Copy, Check, Sparkles } from 'lucide-react';

interface CoinHeaderProps {
  coin: CoinDetail;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

export const CoinHeader: React.FC<CoinHeaderProps> = ({
  coin,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  const currentPrice = coin.market_data?.current_price?.usd || 0;
  const change24h = coin.market_data?.price_change_percentage_24h || 0;
  const rank = coin.market_cap_rank || 1;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setShareToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setShareToast(null), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${coin.name} (${coin.symbol.toUpperCase()}) Price & Market Cap`,
          text: `Check out live price and market stats for ${coin.name} on CoinBeacon.`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share or failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <header className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#daff41]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Share Toast Notification */}
      {shareToast && (
        <div className="absolute top-4 right-4 z-50 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-green-400" /> {shareToast}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Coin Branding & Badges */}
        <div className="flex items-start sm:items-center gap-4">
          <img
            src={coin.image?.large || coin.image?.small || coin.image?.thumb}
            alt={`${coin.name} logo`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
                {coin.name}
              </h1>
              <span className="text-xs font-mono font-bold uppercase text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                {coin.symbol}
              </span>
              <span className="text-xs font-mono font-bold text-[#455c00] dark:text-[#daff41] bg-[#daff41]/20 dark:bg-[#daff41]/10 px-2.5 py-1 rounded-md border border-[#daff41]/40">
                Rank #{rank}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {coin.categories?.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Price Overview & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-200 dark:border-slate-800/60">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Sparkles size={12} className="text-[#455c00] dark:text-[#daff41]" /> Live Market Price (USD)
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {formatCurrency(currentPrice)}
              </span>
              <PriceBadge value={change24h} size="lg" />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Watchlist Toggle */}
            <button
              onClick={onToggleWatchlist}
              aria-label={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer ${
                isWatchlisted
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Star
                size={16}
                className={isWatchlisted ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}
              />
              <span>{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              aria-label="Share coin details"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Share Coin"
            >
              <Share2 size={16} />
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              aria-label="Copy page link"
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Copy Page Link"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
