export interface Sparkline7d {
  price: number[];
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  sparkline_in_7d?: Sparkline7d;
}

export interface GlobalMarketData {
  total_market_cap: { usd: number; [key: string]: number };
  total_volume: { usd: number; [key: string]: number };
  market_cap_percentage: { btc: number; eth: number; usdt: number; [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
  active_cryptocurrencies: number;
  markets: number;
  updated_at: number;
}

export interface CoinLinks {
  homepage: string[];
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  twitter_screen_name: string;
  telegram_channel_identifier: string;
  subreddit_url: string;
  repos_url: {
    github: string[];
    bitbucket: string[];
  };
}

export interface CoinDetailMarketData {
  current_price: { usd: number; [key: string]: number };
  market_cap: { usd: number; [key: string]: number };
  fully_diluted_valuation: { usd: number; [key: string]: number };
  total_volume: { usd: number; [key: string]: number };
  high_24h: { usd: number; [key: string]: number };
  low_24h: { usd: number; [key: string]: number };
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_1y: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: { usd: number; [key: string]: number };
  ath_change_percentage: { usd: number; [key: string]: number };
  ath_date: { usd: string; [key: string]: string };
  atl: { usd: number; [key: string]: number };
  atl_change_percentage: { usd: number; [key: string]: number };
  atl_date: { usd: string; [key: string]: string };
  sparkline_7d?: Sparkline7d;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  categories: string[];
  description: { en: string; [key: string]: string };
  links: CoinLinks;
  image: { large: string; small: string; thumb: string };
  market_cap_rank: number;
  genesis_date: string | null;
  sentiment_votes_up_percentage: number | null;
  sentiment_votes_down_percentage: number | null;
  market_data: CoinDetailMarketData;
}

export interface ChartPoint {
  timestamp: number;
  dateStr: string;
  price: number;
  marketCap: number;
  volume: number;
}

export type TimeRange = '24H' | '7D' | '30D' | '90D' | '1Y' | 'Max' | '1D' | '1M' | 'ALL';

export interface SearchCoin {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large: string;
}

export interface SearchCategory {
  id: number | string;
  name: string;
}

export interface SearchResult {
  coins: SearchCoin[];
  categories: SearchCategory[];
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  category: string;
  read_time: string;
  imageUrl?: string;
  sentiment?: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: 'Basics' | 'DeFi' | 'Trading' | 'Security' | 'Layer 2';
  summary: string;
  readTime: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  publishedAt: string;
  content: string[];
  icon: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  volume_24h: number;
  top_3_coins: string[];
}

export interface AIAnalysis {
  coinId: string;
  coinName: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  confidenceScore: number; // 0 - 100
  summary: string;
  keyTakeaways: string[];
  riskFactors: string[];
  technicalOutlook: string;
  updatedAt: string;
}

export interface WatchlistItem {
  coinId: string;
  symbol: string;
  name: string;
  addedAt: number;
}
