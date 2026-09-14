import React, { useState } from 'react';
import { GlobalMarketData, Coin } from '../../types';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Fuel, Flame, Pause, Play } from 'lucide-react';

interface MarketTickerProps {
  globalMarket: GlobalMarketData | null;
  coins: Coin[];
  onSelectCoin?: (coinId: string) => void;
}

export const MarketTicker: React.FC<MarketTickerProps> = ({
  globalMarket,
  coins,
  onSelectCoin,
}) => {
  const [isPausedManually, setIsPausedManually] = useState(false);

  const totalCap = globalMarket?.total_market_cap?.usd;
  const capChange = globalMarket?.market_cap_change_percentage_24h_usd ?? 0;
  const totalVol = globalMarket?.total_volume?.usd;
  const btcDom = globalMarket?.market_cap_percentage?.btc;
  const ethDom = globalMarket?.market_cap_percentage?.eth;

  // Selected top coins to display in ticker tape
  const tickerCoins = coins.length > 0 ? coins.slice(0, 15) : [];

  // Single set of items to render
  const renderTickerContent = () => (
    <div className="flex items-center gap-6 shrink-0 pr-6">
      {/* Macro items */}
      <div className="flex items-center gap-1.5 whitespace-nowrap bg-slate-200/50 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-300/40 dark:border-slate-800/60">
        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">Market Cap:</span>
        <span className="text-[#455c00] dark:text-[#daff41] font-bold">
          {totalCap != null ? `$${(totalCap / 1e12).toFixed(2)}T` : '$2.48T'}
        </span>
        <span
          className={`font-bold flex items-center ${
            capChange >= 0
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {capChange >= 0 ? '+' : ''}
          {capChange.toFixed(1)}%
        </span>
      </div>

      <div className="flex items-center gap-1.5 whitespace-nowrap bg-slate-200/50 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-300/40 dark:border-slate-800/60">
        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">24h Vol:</span>
        <span className="text-slate-900 dark:text-slate-200 font-bold">
          {totalVol != null ? `$${(totalVol / 1e9).toFixed(1)}B` : '$84.2B'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 whitespace-nowrap bg-slate-200/50 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-300/40 dark:border-slate-800/60">
        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">BTC Dom:</span>
        <span className="text-[#455c00] dark:text-[#daff41] font-bold">
          {btcDom != null ? `${btcDom.toFixed(1)}%` : '52.4%'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 whitespace-nowrap bg-slate-200/50 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-300/40 dark:border-slate-800/60">
        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">ETH Dom:</span>
        <span className="text-slate-900 dark:text-slate-200 font-bold">
          {ethDom != null ? `${ethDom.toFixed(1)}%` : '17.1%'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 whitespace-nowrap bg-slate-200/50 dark:bg-slate-800/40 px-2.5 py-1 rounded-md border border-slate-300/40 dark:border-slate-800/60">
        <Fuel size={11} className="text-[#455c00] dark:text-[#daff41]" />
        <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">ETH Gas:</span>
        <span className="text-[#455c00] dark:text-[#daff41] font-bold">14 Gwei</span>
      </div>

      {/* Top Coins Ticker Items */}
      {tickerCoins.map((coin) => {
        const change = coin.price_change_percentage_24h ?? 0;
        const isPos = change >= 0;

        return (
          <button
            key={coin.id}
            onClick={() => onSelectCoin && onSelectCoin(coin.id)}
            className="flex items-center gap-2 whitespace-nowrap px-2.5 py-1 rounded-md bg-white/70 dark:bg-slate-900/60 hover:bg-[#daff41]/10 dark:hover:bg-[#daff41]/15 hover:border-[#daff41]/50 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer group/item text-left"
            title={`View ${coin.name} analytics`}
          >
            {coin.image && (
              <img
                src={coin.image}
                alt={coin.name}
                className="w-3.5 h-3.5 rounded-full shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <span className="font-bold text-slate-800 dark:text-slate-200 group-hover/item:text-[#455c00] dark:group-hover/item:text-[#daff41] transition-colors">
              {coin.symbol.toUpperCase()}
            </span>
            <span className="text-slate-900 dark:text-white font-medium">
              {formatCurrency(coin.current_price)}
            </span>
            <span
              className={`flex items-center font-bold text-[10px] ${
                isPos
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPos ? <TrendingUp size={10} className="mr-0.5" /> : <TrendingDown size={10} className="mr-0.5" />}
              {isPos ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      aria-label="Real-time cryptocurrency ticker tape"
      className="border-b border-slate-200 dark:border-slate-800/60 bg-slate-100/90 dark:bg-[#070A0F] text-slate-700 dark:text-slate-300 py-1.5 px-2 relative flex items-center overflow-hidden text-[11px] font-mono group"
    >
      {/* Live Badge and Pause Button */}
      <div className="z-20 bg-slate-100/90 dark:bg-[#070A0F] pr-3 pl-2 flex items-center gap-2 shrink-0 border-r border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#daff41]/20 dark:bg-[#daff41]/10 border border-[#daff41]/40 text-[#455c00] dark:text-[#daff41] font-bold text-[10px] tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#455c00] dark:bg-[#daff41] animate-pulse"></span>
          <span>TICKER</span>
        </div>
        <button
          onClick={() => setIsPausedManually(!isPausedManually)}
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition-colors cursor-pointer"
          title={isPausedManually ? 'Resume ticker motion' : 'Pause ticker motion'}
          aria-label={isPausedManually ? 'Resume ticker motion' : 'Pause ticker motion'}
        >
          {isPausedManually ? <Play size={10} /> : <Pause size={10} />}
        </button>
      </div>

      {/* Infinite Scrolling Ticker Track */}
      <div className="overflow-hidden w-full relative flex items-center">
        {/* Subtle Edge Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-100 dark:from-[#070A0F] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-100 dark:from-[#070A0F] to-transparent z-10 pointer-events-none" />

        <div
          className={`animate-ticker-marquee flex items-center ${
            isPausedManually ? '[animation-play-state:paused]' : ''
          }`}
        >
          {/* Render twice for continuous, seamless infinite horizontal scroll */}
          {renderTickerContent()}
          {renderTickerContent()}
        </div>
      </div>
    </div>
  );
};
