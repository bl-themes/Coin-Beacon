import React, { useState, useEffect } from 'react';
import { NavView, Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { GlobalOverview } from './components/market/GlobalOverview';
import { MarketTicker } from './components/market/MarketTicker';
import { TrendingBar } from './components/market/TrendingBar';
import { CoinTable } from './components/market/CoinTable';
import { CategoryGrid } from './components/market/CategoryGrid';
import { CoinHeader } from './components/coin/CoinHeader';
import { PriceChart } from './components/coin/PriceChart';
import { MarketStatsGrid } from './components/coin/MarketStatsGrid';
import { AIInsightsCard } from './components/coin/AIInsightsCard';
import { CoinDescription } from './components/coin/CoinDescription';
import { CoinDetailView } from './components/coin/CoinDetailView';
import { NewsSection } from './components/news/NewsSection';
import { LearnSection } from './components/learn/LearnSection';
import { WatchlistView } from './components/watchlist/WatchlistView';
import { SearchModal } from './components/search/SearchModal';
import { ErrorCard } from './components/common/ErrorCard';
import { TableSkeleton } from './components/common/LoadingSkeleton';
import { Breadcrumb, BreadcrumbItem } from './components/common/Breadcrumb';
import { SEOHead } from './components/seo/SEOHead';

import { Coin, GlobalMarketData, CoinDetail, CategoryItem } from './types';
import { getGlobalMarketData } from './services/market';
import { getTopCoins, getCoinDetail } from './services/coins';
import { getCategories } from './services/content';

export default function App() {
  const [currentView, setCurrentView] = useState<NavView | 'coin-detail'>('home');
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);

  // Data states
  const [globalMarket, setGlobalMarket] = useState<GlobalMarketData | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [coinDetail, setCoinDetail] = useState<CoinDetail | null>(null);

  // Status flags
  const [loadingMarket, setLoadingMarket] = useState(true);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDelayedNotice, setIsDelayedNotice] = useState(false);
  const [apiSource, setApiSource] = useState('live');

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Watchlist state with LocalStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('coinbeacon_watchlist');
      return saved ? JSON.parse(saved) : ['bitcoin', 'ethereum', 'solana'];
    } catch {
      return ['bitcoin', 'ethereum', 'solana'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('coinbeacon_watchlist', JSON.stringify(watchlist));
    } catch (err) {
      console.error('Failed to save watchlist:', err);
    }
  }, [watchlist]);

  const toggleWatchlist = (coinId: string) => {
    setWatchlist((prev) =>
      prev.includes(coinId) ? prev.filter((id) => id !== coinId) : [...prev, coinId]
    );
  };

  // Initial load
  const loadInitialData = async () => {
    setLoadingMarket(true);
    setLoadingCoins(true);

    try {
      const [marketRes, coinsRes, catRes] = await Promise.all([
        getGlobalMarketData(),
        getTopCoins(1, 100),
        getCategories(),
      ]);

      setGlobalMarket(marketRes.data);
      setCoins(coinsRes.data || []);
      setCategories(catRes || []);

      if (marketRes.isDelayed || coinsRes.isDelayed) {
        setIsDelayedNotice(true);
        setApiSource('cached');
      } else {
        setIsDelayedNotice(false);
        setApiSource('live');
      }
    } catch (error) {
      console.error('Initial data fetch error:', error);
      setIsDelayedNotice(true);
      setApiSource('fallback');
    } finally {
      setLoadingMarket(false);
      setLoadingCoins(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle Coin Selection
  const handleSelectCoin = async (coinId: string) => {
    setSelectedCoinId(coinId);
    setCurrentView('coin-detail');
    setLoadingDetail(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const res = await getCoinDetail(coinId);
      setCoinDetail(res.data);
    } catch (err) {
      console.error(`Error loading coin detail for ${coinId}:`, err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleNavSelect = (view: NavView) => {
    setCurrentView(view);
    if (view !== 'coin-detail') setSelectedCoinId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Construct Breadcrumbs
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    if (currentView === 'coin-detail' && coinDetail) {
      items.push({
        label: 'Markets',
        onClick: () => handleNavSelect('home'),
      });
      items.push({
        label: coinDetail.name,
        active: true,
      });
    } else if (currentView === 'coins') {
      items.push({ label: 'Top 100 Cryptocurrencies', active: true });
    } else if (currentView === 'categories') {
      items.push({ label: 'Crypto Sectors & Categories', active: true });
    } else if (currentView === 'watchlist') {
      items.push({ label: 'Personal Watchlist', active: true });
    } else if (currentView === 'news') {
      items.push({ label: 'Crypto News & Analysis', active: true });
    } else if (currentView === 'learn') {
      items.push({ label: 'CoinBeacon Academy', active: true });
    }

    return items;
  };

  // Dynamic SEO title
  const getSeoTitle = () => {
    if (currentView === 'coin-detail' && coinDetail) {
      const price = coinDetail.market_data?.current_price?.usd || 0;
      return `${coinDetail.name} (${coinDetail.symbol.toUpperCase()}) $${price.toLocaleString()} Price & Chart | CoinBeacon`;
    }
    return 'CoinBeacon - Navigate the Crypto Market with Confidence';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] text-slate-800 dark:text-slate-200 font-sans antialiased selection:bg-[#daff41]/40 selection:text-slate-900 flex flex-col justify-between transition-colors duration-200">
      <SEOHead title={getSeoTitle()} />

      {/* Main Navbar */}
      <Navbar
        currentView={currentView === 'coin-detail' ? 'coins' : (currentView as NavView)}
        onSelectView={handleNavSelect}
        onOpenSearch={() => setIsSearchOpen(true)}
        watchlistCount={watchlist.length}
        apiSource={apiSource}
      />

      {/* Continuous Animated Market Ticker */}
      <MarketTicker
        globalMarket={globalMarket}
        coins={coins}
        onSelectCoin={handleSelectCoin}
      />

      {/* Global Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow">
        {/* Connection Notice banner if using cached fallbacks */}
        {isDelayedNotice && (
          <div className="mt-4">
            <ErrorCard isDelayedNotice={true} onRetry={loadInitialData} />
          </div>
        )}

        {/* Breadcrumb Navigation */}
        {currentView !== 'home' && <Breadcrumb items={getBreadcrumbs()} />}

        {/* VIEW 1: HOMEPAGE / MARKETS */}
        {currentView === 'home' && (
          <section className="animate-in fade-in duration-200">
            {/* Global Overview Header */}
            <GlobalOverview
              data={globalMarket}
              loading={loadingMarket}
              onSelectCoin={handleSelectCoin}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Trending & Gainers/Losers Bar */}
            <TrendingBar coins={coins} onSelectCoin={handleSelectCoin} />

            {/* Top 100 Cryptocurrency Table */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
                  Top 100 Cryptocurrencies by Market Capitalization
                </h2>
              </div>
              {loadingCoins ? (
                <TableSkeleton rows={10} />
              ) : (
                <CoinTable
                  coins={coins}
                  onSelectCoin={handleSelectCoin}
                  watchlist={watchlist}
                  onToggleWatchlist={toggleWatchlist}
                />
              )}
            </div>

            {/* Categories Overview Section */}
            <CategoryGrid categories={categories} />
          </section>
        )}

        {/* VIEW 2: TOP 100 COINS */}
        {currentView === 'coins' && (
          <section className="animate-in fade-in duration-200 py-4">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Cryptocurrency Prices by Market Cap</h1>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-6">
              Track top cryptocurrencies ranked by total valuation, 24h liquidity volume, and 7-day price action.
            </p>
            {loadingCoins ? (
              <TableSkeleton rows={15} />
            ) : (
              <CoinTable
                coins={coins}
                onSelectCoin={handleSelectCoin}
                watchlist={watchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            )}
          </section>
        )}

        {/* VIEW 3: CATEGORIES */}
        {currentView === 'categories' && (
          <section className="animate-in fade-in duration-200 py-4">
            <CategoryGrid categories={categories} />
          </section>
        )}

        {/* VIEW 4: WATCHLIST */}
        {currentView === 'watchlist' && (
          <section className="animate-in fade-in duration-200 py-4">
            <WatchlistView
              coins={coins}
              watchlist={watchlist}
              onSelectCoin={handleSelectCoin}
              onRemoveFromWatchlist={(id) => toggleWatchlist(id)}
              onGoToCoins={() => handleNavSelect('coins')}
            />
          </section>
        )}

        {/* VIEW 5: NEWS */}
        {currentView === 'news' && (
          <section className="animate-in fade-in duration-200 py-4">
            <NewsSection />
          </section>
        )}

        {/* VIEW 6: ACADEMY / LEARN */}
        {currentView === 'learn' && (
          <section className="animate-in fade-in duration-200 py-4">
            <LearnSection />
          </section>
        )}

        {/* VIEW 7: COIN DETAIL PAGE */}
        {currentView === 'coin-detail' && (
          <CoinDetailView
            coin={coinDetail}
            loading={loadingDetail}
            watchlist={watchlist}
            allCoins={coins}
            onToggleWatchlist={toggleWatchlist}
            onSelectCoin={handleSelectCoin}
            onRetry={() => selectedCoinId && handleSelectCoin(selectedCoinId)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onSelectView={handleNavSelect} />

      {/* Global Search Modal Triggered by ⌘K */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCoin={handleSelectCoin}
      />
    </div>
  );
}
