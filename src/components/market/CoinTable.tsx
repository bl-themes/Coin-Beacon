import React, { useState, useMemo } from 'react';
import { Coin } from '../../types';
import { formatCurrency, formatPercent, formatNumber } from '../../utils/formatters';
import { PriceBadge } from '../common/PriceBadge';
import { MiniSparkline } from './MiniSparkline';
import { Star, ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';

interface CoinTableProps {
  coins: Coin[];
  onSelectCoin: (coinId: string) => void;
  watchlist: string[];
  onToggleWatchlist: (coinId: string, coinSymbol: string, coinName: string) => void;
  loading?: boolean;
}

type SortField = 'rank' | 'price' | 'change24h' | 'change7d' | 'marketCap' | 'volume';
type SortOrder = 'asc' | 'desc';

export const CoinTable: React.FC<CoinTableProps> = ({
  coins,
  onSelectCoin,
  watchlist,
  onToggleWatchlist,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Category tags mapping
  const categoryFilters = [
    { id: 'all', label: 'All Cryptos' },
    { id: 'l1', label: 'Layer 1' },
    { id: 'defi', label: 'DeFi' },
    { id: 'ai', label: 'AI & Infra' },
    { id: 'meme', label: 'Meme' },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'rank' ? 'asc' : 'desc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={11} className="opacity-40 hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="text-[#455c00] dark:text-[#daff41] animate-in fade-in duration-150" />
    ) : (
      <ArrowDown size={12} className="text-[#455c00] dark:text-[#daff41] animate-in fade-in duration-150" />
    );
  };

  const filteredCoins = useMemo(() => {
    let result = [...coins];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(term) || c.symbol.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'l1') {
        result = result.filter((c) =>
          ['bitcoin', 'ethereum', 'solana', 'cardano', 'avalanche-2', 'near', 'sui', 'aptos', 'toncoin'].includes(c.id)
        );
      } else if (selectedCategory === 'defi') {
        result = result.filter((c) => ['uniswap', 'chainlink', 'aave', 'maker', 'lido-dao', 'thorchain'].includes(c.id));
      } else if (selectedCategory === 'ai') {
        result = result.filter((c) => ['bittensor', 'render-token', 'near', 'fetch-ai', 'singularitynet'].includes(c.id));
      } else if (selectedCategory === 'meme') {
        result = result.filter((c) => ['dogecoin', 'shiba-inu', 'pepe', 'dogwifhat', 'floki', 'bonk'].includes(c.id));
      }
    }

    result.sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      switch (sortField) {
        case 'rank':
          valA = a.market_cap_rank || 999;
          valB = b.market_cap_rank || 999;
          break;
        case 'price':
          valA = a.current_price || 0;
          valB = b.current_price || 0;
          break;
        case 'change24h':
          valA = a.price_change_percentage_24h || 0;
          valB = b.price_change_percentage_24h || 0;
          break;
        case 'change7d':
          valA = a.price_change_percentage_7d_in_currency ?? a.price_change_percentage_24h ?? 0;
          valB = b.price_change_percentage_7d_in_currency ?? b.price_change_percentage_24h ?? 0;
          break;
        case 'marketCap':
          valA = a.market_cap || 0;
          valB = b.market_cap || 0;
          break;
        case 'volume':
          valA = a.total_volume || 0;
          valB = b.total_volume || 0;
          break;
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [coins, searchTerm, selectedCategory, sortField, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCoins.length / pageSize) || 1;
  const paginatedCoins = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCoins.slice(start, start + pageSize);
  }, [filteredCoins, currentPage, pageSize]);

  return (
    <div className="bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800/80 rounded-3xl overflow-hidden my-8 shadow-xl dark:shadow-2xl transition-all">
      {/* Table Top Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/90 dark:bg-[#141824]/90 backdrop-blur-md">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#daff41] text-slate-950 shadow-md shadow-[#daff41]/25 ring-1 ring-[#daff41]/50'
                  : 'bg-slate-200/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/80 dark:hover:bg-slate-800/80 border border-slate-300/80 dark:border-slate-800/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filter Search Box & Page Size */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name or ticker..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#daff41] focus:ring-1 focus:ring-[#daff41]/30 transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono">
            <SlidersHorizontal size={13} className="text-slate-400 shrink-0" />
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none cursor-pointer"
            >
              <option value={25} className="bg-white dark:bg-[#121622] text-slate-900 dark:text-white">25 rows</option>
              <option value={50} className="bg-white dark:bg-[#121622] text-slate-900 dark:text-white">50 rows</option>
              <option value={100} className="bg-white dark:bg-[#121622] text-slate-900 dark:text-white">100 rows</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Container with Sticky Header */}
      <div className="overflow-x-auto max-h-[750px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800 relative">
        <table className="w-full text-left text-xs border-collapse">
          {/* Sticky Table Header */}
          <thead className="sticky top-0 z-20 bg-slate-100/95 dark:bg-[#0E121E]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <tr className="text-slate-600 dark:text-slate-400 font-mono uppercase tracking-wider text-[11px] font-semibold select-none">
              <th className="py-3.5 px-3 w-10 text-center">
                <span className="text-slate-400 dark:text-slate-500">★</span>
              </th>
              <th
                onClick={() => handleSort('rank')}
                className={`py-3.5 px-3 w-12 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors ${
                  sortField === 'rank' ? 'text-[#455c00] dark:text-[#daff41] font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  # {renderSortIcon('rank')}
                </div>
              </th>
              <th className="py-3.5 px-4 min-w-[170px]">Asset</th>
              <th
                onClick={() => handleSort('price')}
                className={`py-3.5 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors ${
                  sortField === 'price' ? 'text-[#455c00] dark:text-[#daff41] font-bold' : ''
                }`}
              >
                <div className="flex items-center justify-end gap-1">
                  Price {renderSortIcon('price')}
                </div>
              </th>
              <th
                onClick={() => handleSort('change24h')}
                className={`py-3.5 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors ${
                  sortField === 'change24h' ? 'text-[#455c00] dark:text-[#daff41] font-bold' : ''
                }`}
              >
                <div className="flex items-center justify-end gap-1">
                  24h % {renderSortIcon('change24h')}
                </div>
              </th>
              <th
                onClick={() => handleSort('change7d')}
                className={`py-3.5 px-4 text-right hidden sm:table-cell cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors ${
                  sortField === 'change7d' ? 'text-[#455c00] dark:text-[#daff41] font-bold' : ''
                }`}
              >
                <div className="flex items-center justify-end gap-1">
                  7d % {renderSortIcon('change7d')}
                </div>
              </th>
              <th
                onClick={() => handleSort('marketCap')}
                className={`py-3.5 px-4 text-right hidden lg:table-cell cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors ${
                  sortField === 'marketCap' ? 'text-[#455c00] dark:text-[#daff41] font-bold' : ''
                }`}
              >
                <div className="flex items-center justify-end gap-1">
                  Market Cap {renderSortIcon('marketCap')}
                </div>
              </th>
              <th
                onClick={() => handleSort('volume')}
                className={`py-3.5 px-4 text-right hidden xl:table-cell cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors ${
                  sortField === 'volume' ? 'text-[#455c00] dark:text-[#daff41] font-bold' : ''
                }`}
              >
                <div className="flex items-center justify-end gap-1">
                  24h Volume {renderSortIcon('volume')}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right hidden xl:table-cell">Circulating Supply</th>
              <th className="py-3.5 px-4 text-center hidden md:table-cell w-[140px]">7D Price Trend</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/50">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-3 text-center"><div className="w-4 h-4 bg-slate-200 dark:bg-slate-800/60 rounded mx-auto"></div></td>
                  <td className="py-4 px-3"><div className="w-6 h-4 bg-slate-200 dark:bg-slate-800/60 rounded"></div></td>
                  <td className="py-4 px-4"><div className="w-32 h-5 bg-slate-200 dark:bg-slate-800/60 rounded-lg"></div></td>
                  <td className="py-4 px-4"><div className="w-20 h-5 bg-slate-200 dark:bg-slate-800/60 rounded ml-auto"></div></td>
                  <td className="py-4 px-4"><div className="w-16 h-5 bg-slate-200 dark:bg-slate-800/60 rounded ml-auto"></div></td>
                  <td className="py-4 px-4 hidden sm:table-cell"><div className="w-16 h-5 bg-slate-200 dark:bg-slate-800/60 rounded ml-auto"></div></td>
                  <td className="py-4 px-4 hidden lg:table-cell"><div className="w-24 h-5 bg-slate-200 dark:bg-slate-800/60 rounded ml-auto"></div></td>
                  <td className="py-4 px-4 hidden xl:table-cell"><div className="w-24 h-5 bg-slate-200 dark:bg-slate-800/60 rounded ml-auto"></div></td>
                  <td className="py-4 px-4 hidden xl:table-cell"><div className="w-28 h-5 bg-slate-200 dark:bg-slate-800/60 rounded ml-auto"></div></td>
                  <td className="py-4 px-4 hidden md:table-cell"><div className="w-24 h-8 bg-slate-200 dark:bg-slate-800/60 rounded mx-auto"></div></td>
                </tr>
              ))
            ) : paginatedCoins.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-500 dark:text-slate-400 font-sans">
                  No cryptocurrencies found matching &quot;<span className="text-slate-900 dark:text-white font-semibold">{searchTerm}</span>&quot;.
                </td>
              </tr>
            ) : (
              paginatedCoins.map((coin) => {
                const isSaved = watchlist.includes(coin.id);
                const change24 = coin.price_change_percentage_24h || 0;
                const change7d = coin.price_change_percentage_7d_in_currency ?? change24;
                const sparklineData = coin.sparkline_in_7d?.price || [];

                return (
                  <tr
                    key={coin.id}
                    onClick={() => onSelectCoin(coin.id)}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:shadow-inner transition-all duration-150 cursor-pointer group"
                  >
                    {/* Star Watchlist Button */}
                    <td
                      className="py-3.5 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(coin.id, coin.symbol, coin.name);
                      }}
                    >
                      <button
                        className="text-slate-400 dark:text-slate-600 hover:text-amber-400 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50"
                        title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star
                          size={15}
                          className={isSaved ? 'fill-amber-400 text-amber-400' : 'group-hover:text-slate-600 dark:group-hover:text-slate-400'}
                        />
                      </button>
                    </td>

                    {/* Rank */}
                    <td className="py-3.5 px-3 font-mono text-slate-500 dark:text-slate-400 text-xs font-medium">
                      {coin.market_cap_rank || '-'}
                    </td>

                    {/* Coin Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700/50 group-hover:border-[#daff41]/60 transition-colors"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-[#455c00] dark:group-hover:text-[#daff41] transition-colors truncate font-sans">
                            {coin.name}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider font-semibold">
                              {coin.symbol}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                      {formatCurrency(coin.current_price)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3.5 px-4 text-right">
                      <PriceBadge value={change24} size="sm" />
                    </td>

                    {/* 7d Change */}
                    <td className="py-3.5 px-4 text-right hidden sm:table-cell">
                      <PriceBadge value={change7d} size="sm" />
                    </td>

                    {/* Market Cap */}
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700 dark:text-slate-200 text-xs hidden lg:table-cell">
                      {formatCurrency(coin.market_cap, 0, true)}
                    </td>

                    {/* 24h Volume */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300 text-xs hidden xl:table-cell">
                      {formatCurrency(coin.total_volume, 0, true)}
                    </td>

                    {/* Circulating Supply */}
                    <td className="py-3.5 px-4 text-right hidden xl:table-cell">
                      <div className="font-mono text-xs text-slate-800 dark:text-slate-200">
                        {formatNumber(coin.circulating_supply)}{' '}
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">{coin.symbol}</span>
                      </div>
                      {coin.max_supply || coin.total_supply ? (
                        <div className="w-24 ml-auto bg-slate-200 dark:bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden border border-slate-300 dark:border-slate-800">
                          <div
                            className="bg-[#daff41] h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                100,
                                (coin.circulating_supply /
                                  (coin.max_supply || coin.total_supply || 1)) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      ) : null}
                    </td>

                    {/* 7D Mini Chart */}
                    <td className="py-3.5 px-4 text-center hidden md:table-cell">
                      <div className="flex justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                        <MiniSparkline
                          data={sparklineData}
                          isPositive={change7d >= 0}
                          width={120}
                          height={32}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#141824]">
        <div className="font-sans">
          Showing{' '}
          <span className="text-slate-900 dark:text-white font-mono font-bold">
            {filteredCoins.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="text-slate-900 dark:text-white font-mono font-bold">
            {Math.min(currentPage * pageSize, filteredCoins.length)}
          </span>{' '}
          of <span className="text-slate-900 dark:text-white font-mono font-bold">{filteredCoins.length}</span> coins
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-800 dark:text-white flex items-center justify-center"
            title="Previous Page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-mono text-slate-700 dark:text-slate-300 px-3 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-800 dark:text-white flex items-center justify-center"
            title="Next Page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

