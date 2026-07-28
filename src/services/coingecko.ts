import { Coin, CoinDetail, GlobalMarketData, SearchResult, TimeRange } from '../types';

export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchGlobalMarket(): Promise<{ data: GlobalMarketData; source: string; isDelayed?: boolean }> {
  const res = await fetch('/api/coingecko/global');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchTopCoins(
  page = 1,
  perPage = 100,
  vsCurrency = 'usd'
): Promise<{ data: Coin[]; source: string; isDelayed?: boolean }> {
  const res = await fetch(
    `/api/coingecko/coins?page=${page}&per_page=${perPage}&vs_currency=${vsCurrency.toLowerCase()}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchCoinDetail(id: string): Promise<{ data: CoinDetail; source: string; isDelayed?: boolean }> {
  const res = await fetch(`/api/coingecko/coin/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function fetchCoinChart(
  id: string,
  range: TimeRange = '7D',
  vsCurrency = 'usd'
): Promise<{
  data: { prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] };
  source: string;
  isDelayed?: boolean;
}> {
  const daysMap: Record<string, string> = {
    '24H': '1',
    '1D': '1',
    '7D': '7',
    '30D': '30',
    '1M': '30',
    '90D': '90',
    '1Y': '365',
    'Max': 'max',
    'ALL': 'max',
  };
  const days = daysMap[range] || '7';
  const res = await fetch(
    `/api/coingecko/coin/${id}/chart?days=${days}&vs_currency=${vsCurrency.toLowerCase()}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

export async function searchCoinGecko(query: string): Promise<SearchResult> {
  if (!query || query.trim().length === 0) {
    return { coins: [], categories: [] };
  }
  const res = await fetch(`/api/coingecko/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data || { coins: [], categories: [] };
}
