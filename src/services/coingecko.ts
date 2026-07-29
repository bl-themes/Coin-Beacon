import { Coin, CoinDetail, GlobalMarketData, SearchResult, TimeRange } from '../types';
import {
  FALLBACK_GLOBAL_MARKET,
  FALLBACK_TOP_COINS,
} from '../constants/fallbackData';

export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const DEMO_API_KEY = 'CG-K2e3Lda3Byu2PoNuffrssMXr';

async function safeApiFetch<T>(
  endpoint: string,
  directGeckoUrl: string,
  fallbackData: T
): Promise<{ data: T; source: string; isDelayed?: boolean }> {
  // 1. Try local Express API proxy
  try {
    const res = await fetch(endpoint);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.data) return json;
    }
  } catch {
    // Local API failed or not running (e.g. Vercel static site)
  }

  // 2. Direct client-side fetch to CoinGecko API
  try {
    const directRes = await fetch(directGeckoUrl, {
      headers: {
        'Accept': 'application/json',
        'x-cg-demo-api-key': DEMO_API_KEY,
      },
    });
    if (directRes.ok) {
      const data = await directRes.json();
      return { data, source: 'coingecko-direct' };
    }
  } catch (err) {
    console.warn('Direct CoinGecko fetch failed:', err);
  }

  // 3. Fallback to offline static data
  return { data: fallbackData, source: 'fallback', isDelayed: true };
}

export async function fetchGlobalMarket(): Promise<{ data: GlobalMarketData; source: string; isDelayed?: boolean }> {
  const result = await safeApiFetch<any>(
    '/api/coingecko/global',
    `${COINGECKO_BASE_URL}/global`,
    FALLBACK_GLOBAL_MARKET
  );

  let rawData = result.data;
  if (rawData && rawData.data) {
    rawData = rawData.data;
  }

  if (!rawData || !rawData.total_market_cap) {
    rawData = FALLBACK_GLOBAL_MARKET;
  }

  return {
    ...result,
    data: rawData as GlobalMarketData,
  };
}

export async function fetchTopCoins(
  page = 1,
  perPage = 100,
  vsCurrency = 'usd'
): Promise<{ data: Coin[]; source: string; isDelayed?: boolean }> {
  const curr = vsCurrency.toLowerCase();
  const directUrl = `${COINGECKO_BASE_URL}/coins/markets?vs_currency=${curr}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;
  
  return safeApiFetch<Coin[]>(
    `/api/coingecko/coins?page=${page}&per_page=${perPage}&vs_currency=${curr}`,
    directUrl,
    FALLBACK_TOP_COINS
  );
}

export async function fetchCoinDetail(
  id: string,
  vsCurrency = 'usd'
): Promise<{ data: CoinDetail; source: string; isDelayed?: boolean }> {
  const curr = vsCurrency.toLowerCase();
  const directUrl = `${COINGECKO_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=true`;
  
  const dummyDetail: CoinDetail = {
    id,
    symbol: id.slice(0, 4),
    name: id.toUpperCase(),
    description: { en: 'Crypto asset details currently unavailable in offline fallback mode.' },
    image: {
      large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
      thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
    },
    market_cap_rank: 1,
    categories: ['Cryptocurrency'],
    genesis_date: '2009-01-03',
    sentiment_votes_up_percentage: 80,
    sentiment_votes_down_percentage: 20,
    links: {
      homepage: ['https://bitcoin.org'],
      blockchain_site: [],
      official_forum_url: [],
      chat_url: [],
      announcement_url: [],
      twitter_screen_name: '',
      telegram_channel_identifier: '',
      subreddit_url: '',
      repos_url: { github: [], bitbucket: [] },
    },
    market_data: {
      current_price: { [curr]: 100, usd: 100 },
      price_change_24h: 1.5,
      price_change_percentage_24h: 1.5,
      price_change_percentage_7d: 3.2,
      price_change_percentage_14d: 3.5,
      price_change_percentage_30d: 5.0,
      price_change_percentage_1y: 20.0,
      market_cap_change_percentage_24h: 2.0,
      market_cap: { [curr]: 1000000000, usd: 1000000000 },
      fully_diluted_valuation: { [curr]: 1000000000, usd: 1000000000 },
      total_volume: { [curr]: 50000000, usd: 50000000 },
      high_24h: { [curr]: 105, usd: 105 },
      low_24h: { [curr]: 95, usd: 95 },
      circulating_supply: 10000000,
      total_supply: 10000000,
      max_supply: 21000000,
      ath: { [curr]: 150, usd: 150 },
      ath_change_percentage: { [curr]: -33.3, usd: -33.3 },
      ath_date: { [curr]: '2024-01-01T00:00:00Z', usd: '2024-01-01T00:00:00Z' },
      atl: { [curr]: 1, usd: 1 },
      atl_change_percentage: { [curr]: 9900, usd: 9900 },
      atl_date: { [curr]: '2020-01-01T00:00:00Z', usd: '2020-01-01T00:00:00Z' },
    },
  };

  return safeApiFetch<CoinDetail>(
    `/api/coingecko/coin/${id}?vs_currency=${curr}`,
    directUrl,
    dummyDetail
  );
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
  const curr = vsCurrency.toLowerCase();
  const directUrl = `${COINGECKO_BASE_URL}/coins/${id}/market_chart?vs_currency=${curr}&days=${days}`;

  const dummyChart = {
    prices: Array.from({ length: 20 }, (_, i) => [Date.now() - (20 - i) * 3600000, 50000 + Math.sin(i) * 1000] as [number, number]),
    market_caps: Array.from({ length: 20 }, (_, i) => [Date.now() - (20 - i) * 3600000, 1000000000] as [number, number]),
    total_volumes: Array.from({ length: 20 }, (_, i) => [Date.now() - (20 - i) * 3600000, 50000000] as [number, number]),
  };

  return safeApiFetch<{ prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] }>(
    `/api/coingecko/coin/${id}/chart?days=${days}&vs_currency=${curr}`,
    directUrl,
    dummyChart
  );
}

export async function searchCoinGecko(query: string): Promise<SearchResult> {
  if (!query || query.trim().length === 0) {
    return { coins: [], categories: [] };
  }

  try {
    const res = await fetch(`/api/coingecko/search?q=${encodeURIComponent(query)}`);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.data) return json.data;
    }
  } catch {
    // Local API failed
  }

  // Direct CoinGecko search
  try {
    const directRes = await fetch(`${COINGECKO_BASE_URL}/search?query=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
        'x-cg-demo-api-key': DEMO_API_KEY,
      },
    });
    if (directRes.ok) {
      return await directRes.json();
    }
  } catch {
    // Ignore
  }

  return { coins: [], categories: [] };
}

