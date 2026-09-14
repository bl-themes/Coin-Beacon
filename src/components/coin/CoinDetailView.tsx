import React from 'react';
import { CoinDetail, Coin } from '../../types';
import { CoinDetailSEO } from './CoinDetailSEO';
import { CoinHeader } from './CoinHeader';
import { PriceOverviewCard } from './PriceOverviewCard';
import { PriceChart } from './PriceChart';
import { QuickStatistics } from './QuickStatistics';
import { MarketAndSupplyStats } from './MarketAndSupplyStats';
import { PricePerformance } from './PricePerformance';
import { CoinDescription } from './CoinDescription';
import { OfficialLinks } from './OfficialLinks';
import { CategoriesBadges } from './CategoriesBadges';
import { TopMarketsSection } from './TopMarketsSection';
import { RelatedCoinsSection } from './RelatedCoinsSection';
import { LatestCoinNewsSection } from './LatestCoinNewsSection';
import { CoinFAQSection } from './CoinFAQSection';
import { AIInsightsCard } from './AIInsightsCard';
import { CoinDetailSkeleton } from './CoinDetailSkeleton';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface CoinDetailViewProps {
  coin: CoinDetail | null;
  loading: boolean;
  watchlist: string[];
  allCoins: Coin[];
  onToggleWatchlist: (coinId: string) => void;
  onSelectCoin: (coinId: string) => void;
  onRetry?: () => void;
}

export const CoinDetailView: React.FC<CoinDetailViewProps> = ({
  coin,
  loading,
  watchlist,
  allCoins,
  onToggleWatchlist,
  onSelectCoin,
  onRetry,
}) => {
  if (loading) {
    return <CoinDetailSkeleton />;
  }

  if (!coin) {
    return (
      <div className="py-16 text-center bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-8 my-6 shadow-2xl">
        <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Cryptocurrency Data Unavailable</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          We were unable to load market details for this cryptocurrency. The CoinGecko API may be temporarily busy.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#daff41] hover:bg-[#cbf232] text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-[#daff41]/20"
          >
            <RefreshCw size={14} /> Retry Loading Coin
          </button>
        )}
      </div>
    );
  }

  const isWatchlisted = watchlist.includes(coin.id);
  const isPositive24h = (coin.market_data?.price_change_percentage_24h || 0) >= 0;

  return (
    <article className="animate-in fade-in duration-200 space-y-2 pb-12">
      {/* 1. Dynamic SEO Metadata & Schemas */}
      <CoinDetailSEO coin={coin} />

      {/* 2. Coin Header */}
      <CoinHeader
        coin={coin}
        isWatchlisted={isWatchlisted}
        onToggleWatchlist={() => onToggleWatchlist(coin.id)}
      />

      {/* 3. Price Overview */}
      {coin.market_data && (
        <PriceOverviewCard
          marketData={coin.market_data}
        />
      )}

      {/* 4. Interactive Price Chart */}
      <PriceChart
        coinId={coin.id}
        coinName={coin.name}
        isPositive={isPositive24h}
      />

      {/* CoinBeacon AI Intelligence Synthesis (Enhanced feature) */}
      <AIInsightsCard
        coinId={coin.id}
        coinName={coin.name}
        currentPrice={coin.market_data?.current_price?.usd || 0}
        priceChange24h={coin.market_data?.price_change_percentage_24h || 0}
        marketCap={coin.market_data?.market_cap?.usd || 0}
        volume={coin.market_data?.total_volume?.usd || 0}
      />

      {/* 5. Quick Statistics */}
      {coin.market_data && (
        <QuickStatistics
          marketData={coin.market_data}
          symbol={coin.symbol}
          rank={coin.market_cap_rank || 1}
        />
      )}

      {/* 6. Market Statistics & 7. Supply Information */}
      {coin.market_data && (
        <MarketAndSupplyStats
          marketData={coin.market_data}
          symbol={coin.symbol}
        />
      )}

      {/* 8. Price Performance */}
      {coin.market_data && (
        <PricePerformance marketData={coin.market_data} />
      )}

      {/* 9. Description */}
      <CoinDescription coin={coin} />

      {/* 10. Official Links */}
      {coin.links && (
        <OfficialLinks links={coin.links} coinName={coin.name} />
      )}

      {/* 11. Categories */}
      {coin.categories && coin.categories.length > 0 && (
        <CategoriesBadges categories={coin.categories} />
      )}

      {/* 12. Top Markets (placeholder) */}
      <TopMarketsSection
        coinName={coin.name}
        symbol={coin.symbol}
        currentPrice={coin.market_data?.current_price?.usd || 0}
      />

      {/* 13. Related Coins (placeholder) */}
      <RelatedCoinsSection
        currentCoinId={coin.id}
        coins={allCoins}
        onSelectCoin={onSelectCoin}
      />

      {/* 14. Latest News (placeholder) */}
      <LatestCoinNewsSection
        coinName={coin.name}
        symbol={coin.symbol}
      />

      {/* 15. FAQ */}
      <CoinFAQSection coin={coin} />
    </article>
  );
};
