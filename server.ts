import express, { Request, Response as ExpressResponse } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  FALLBACK_GLOBAL_MARKET,
  FALLBACK_TOP_COINS,
  FALLBACK_NEWS,
  FALLBACK_LEARN_ARTICLES,
  FALLBACK_CATEGORIES,
} from './src/constants/fallbackData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Cache implementation to avoid CoinGecko 429 Rate Limits
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string, ttlMs: number): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Fetch helper with timeout and rate-limit safety
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 6000): Promise<globalThis.Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CoinBeacon/1.0',
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Global Market Overview
app.get('/api/coingecko/global', async (_req: Request, res: ExpressResponse) => {
  const cacheKey = 'global_market';
  const cached = getCached(cacheKey, 5 * 60 * 1000); // 5 min
  if (cached) {
    return res.json({ data: cached, source: 'cache' });
  }

  try {
    const resp = await fetchWithTimeout('https://api.coingecko.com/api/v3/global');
    if (!resp.ok) throw new Error(`CoinGecko status: ${resp.status}`);
    const json = await resp.json();
    const data = json.data;
    setCache(cacheKey, data);
    return res.json({ data, source: 'live' });
  } catch (error) {
    console.warn('[CoinBeacon Server] Global market fetch failed, serving fallback:', error);
    return res.json({ data: FALLBACK_GLOBAL_MARKET, source: 'fallback', isDelayed: true });
  }
});

// 2. Top Coins Table
app.get('/api/coingecko/coins', async (req: Request, res: ExpressResponse) => {
  const page = Number(req.query.page) || 1;
  const perPage = Math.min(Number(req.query.per_page) || 100, 100);
  const vsCurrency = String(req.query.vs_currency || 'usd').toLowerCase();
  const cacheKey = `coins_page_${page}_per_${perPage}_${vsCurrency}`;

  const cached = getCached(cacheKey, 5 * 60 * 1000); // 5 min
  if (cached) {
    return res.json({ data: cached, source: 'cache' });
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${vsCurrency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`;
    const resp = await fetchWithTimeout(url);
    if (!resp.ok) throw new Error(`CoinGecko status: ${resp.status}`);
    const data = await resp.json();
    setCache(cacheKey, data);
    return res.json({ data, source: 'live' });
  } catch (error) {
    console.warn('[CoinBeacon Server] Coins fetch failed, serving fallback:', error);
    const multiplier = vsCurrency === 'idr' ? 16250 : 1;
    const adjustedFallback = FALLBACK_TOP_COINS.map((c) => ({
      ...c,
      current_price: c.current_price * multiplier,
      market_cap: c.market_cap * multiplier,
      total_volume: c.total_volume * multiplier,
      high_24h: c.high_24h * multiplier,
      low_24h: c.low_24h * multiplier,
      ath: c.ath * multiplier,
      atl: c.atl * multiplier,
    }));
    return res.json({ data: adjustedFallback, source: 'fallback', isDelayed: true });
  }
});

// 3. Single Coin Detail
app.get('/api/coingecko/coin/:id', async (req: Request, res: ExpressResponse) => {
  const coinId = req.params.id;
  const cacheKey = `coin_detail_${coinId}`;

  const cached = getCached(cacheKey, 5 * 60 * 1000);
  if (cached) {
    return res.json({ data: cached, source: 'cache' });
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=true&developer_data=false&sparkline=true`;
    const resp = await fetchWithTimeout(url);
    if (!resp.ok) throw new Error(`CoinGecko status: ${resp.status}`);
    const data = await resp.json();
    setCache(cacheKey, data);
    return res.json({ data, source: 'live' });
  } catch (error) {
    console.warn(`[CoinBeacon Server] Coin detail fetch failed for ${coinId}, constructing fallback:`, error);
    const topCoinMatch = FALLBACK_TOP_COINS.find((c) => c.id === coinId) || FALLBACK_TOP_COINS[0];
    const multiplier = 16250;

    const constructedFallback = {
      id: topCoinMatch.id,
      symbol: topCoinMatch.symbol,
      name: topCoinMatch.name,
      categories: ['Layer 1 (L1)', 'Smart Contract Platforms'],
      description: {
        en: `${topCoinMatch.name} (${topCoinMatch.symbol.toUpperCase()}) is a decentralized digital asset and leading blockchain protocol driving web3 innovation, global financial settlement, and decentralized applications.`
      },
      links: {
        homepage: ['https://bitcoin.org', 'https://ethereum.org'],
        blockchain_site: ['https://etherscan.io', 'https://blockchair.com'],
        official_forum_url: [],
        chat_url: [],
        announcement_url: [],
        twitter_screen_name: topCoinMatch.name,
        telegram_channel_identifier: topCoinMatch.symbol,
        subreddit_url: `https://reddit.com/r/${topCoinMatch.name}`,
        repos_url: { github: ['https://github.com/bitcoin/bitcoin'], bitbucket: [] }
      },
      image: { large: topCoinMatch.image, small: topCoinMatch.image, thumb: topCoinMatch.image },
      market_cap_rank: topCoinMatch.market_cap_rank,
      genesis_date: '2009-01-03',
      sentiment_votes_up_percentage: 84,
      sentiment_votes_down_percentage: 16,
      market_data: {
        current_price: { usd: topCoinMatch.current_price, idr: topCoinMatch.current_price * multiplier },
        market_cap: { usd: topCoinMatch.market_cap, idr: topCoinMatch.market_cap * multiplier },
        fully_diluted_valuation: { usd: topCoinMatch.fully_diluted_valuation || topCoinMatch.market_cap * 1.05, idr: (topCoinMatch.fully_diluted_valuation || topCoinMatch.market_cap * 1.05) * multiplier },
        total_volume: { usd: topCoinMatch.total_volume, idr: topCoinMatch.total_volume * multiplier },
        high_24h: { usd: topCoinMatch.high_24h, idr: topCoinMatch.high_24h * multiplier },
        low_24h: { usd: topCoinMatch.low_24h, idr: topCoinMatch.low_24h * multiplier },
        price_change_24h: topCoinMatch.price_change_24h,
        price_change_percentage_24h: topCoinMatch.price_change_percentage_24h,
        price_change_percentage_7d: topCoinMatch.price_change_percentage_7d_in_currency || 4.2,
        price_change_percentage_14d: 5.8,
        price_change_percentage_30d: 12.4,
        price_change_percentage_1y: 84.5,
        market_cap_change_percentage_24h: topCoinMatch.price_change_percentage_24h,
        circulating_supply: topCoinMatch.circulating_supply,
        total_supply: topCoinMatch.total_supply || topCoinMatch.circulating_supply,
        max_supply: topCoinMatch.max_supply,
        ath: { usd: topCoinMatch.ath, idr: topCoinMatch.ath * multiplier },
        ath_change_percentage: { usd: topCoinMatch.ath_change_percentage, idr: topCoinMatch.ath_change_percentage },
        ath_date: { usd: topCoinMatch.ath_date, idr: topCoinMatch.ath_date },
        atl: { usd: topCoinMatch.atl, idr: topCoinMatch.atl * multiplier },
        atl_change_percentage: { usd: 100000, idr: 100000 },
        atl_date: { usd: '2013-07-06', idr: '2013-07-06' },
        sparkline_7d: topCoinMatch.sparkline_in_7d
      }
    };

    return res.json({ data: constructedFallback, source: 'fallback', isDelayed: true });
  }
});

// 4. Coin Historical Chart
app.get('/api/coingecko/coin/:id/chart', async (req: Request, res: ExpressResponse) => {
  const coinId = req.params.id;
  const days = req.query.days || '7';
  const vsCurrency = String(req.query.vs_currency || 'usd').toLowerCase();
  const cacheKey = `coin_chart_${coinId}_${days}_${vsCurrency}`;

  const cached = getCached(cacheKey, 10 * 60 * 1000);
  if (cached) {
    return res.json({ data: cached, source: 'cache' });
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${vsCurrency}&days=${days}`;
    const resp = await fetchWithTimeout(url);
    if (!resp.ok) throw new Error(`CoinGecko chart status: ${resp.status}`);
    const data = await resp.json();
    setCache(cacheKey, data);
    return res.json({ data, source: 'live' });
  } catch (error) {
    console.warn(`[CoinBeacon Server] Chart fetch failed for ${coinId}, generating synthetic chart:`, error);
    const topCoinMatch = FALLBACK_TOP_COINS.find((c) => c.id === coinId) || FALLBACK_TOP_COINS[0];
    const multiplier = vsCurrency === 'idr' ? 16250 : 1;
    const basePrice = topCoinMatch.current_price * multiplier;
    const pointsCount = days === '1' ? 24 : days === '7' ? 28 : days === '30' ? 30 : 60;
    const now = Date.now();
    const interval = (Number(days) * 24 * 3600 * 1000) / pointsCount;

    const prices: [number, number][] = [];
    const market_caps: [number, number][] = [];
    const total_volumes: [number, number][] = [];

    let currentP = basePrice * (1 - (topCoinMatch.price_change_percentage_24h / 100));
    for (let i = 0; i < pointsCount; i++) {
      const timestamp = now - (pointsCount - i) * interval;
      const variation = (Math.sin(i * 0.4) * 0.015) + ((Math.random() - 0.48) * 0.02);
      currentP = currentP * (1 + variation);
      prices.push([timestamp, Number(currentP.toFixed(2))]);
      market_caps.push([timestamp, Math.round(currentP * topCoinMatch.circulating_supply)]);
      total_volumes.push([timestamp, Math.round(topCoinMatch.total_volume * multiplier * (0.8 + Math.random() * 0.4))]);
    }

    const syntheticData = { prices, market_caps, total_volumes };
    setCache(cacheKey, syntheticData);
    return res.json({ data: syntheticData, source: 'fallback', isDelayed: true });
  }
});

// 5. Search API
app.get('/api/coingecko/search', async (req: Request, res: ExpressResponse) => {
  const query = String(req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.json({ data: { coins: [], categories: [] } });
  }

  const cacheKey = `search_${query}`;
  const cached = getCached(cacheKey, 2 * 60 * 1000);
  if (cached) {
    return res.json({ data: cached, source: 'cache' });
  }

  try {
    const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
    const resp = await fetchWithTimeout(url);
    if (!resp.ok) throw new Error(`CoinGecko search status: ${resp.status}`);
    const data = await resp.json();
    setCache(cacheKey, data);
    return res.json({ data, source: 'live' });
  } catch (error) {
    console.warn('[CoinBeacon Server] Search fetch failed, local matching:', error);
    const matchingCoins = FALLBACK_TOP_COINS.filter(
      (c) => c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query)
    ).map((c) => ({
      id: c.id,
      name: c.name,
      api_symbol: c.symbol,
      symbol: c.symbol,
      market_cap_rank: c.market_cap_rank,
      thumb: c.image,
      large: c.image,
    }));

    const matchingCategories = FALLBACK_CATEGORIES.filter((cat) =>
      cat.name.toLowerCase().includes(query)
    ).map((cat) => ({ id: cat.id, name: cat.name }));

    return res.json({
      data: { coins: matchingCoins, categories: matchingCategories },
      source: 'fallback',
    });
  }
});

// 6. Gemini AI Market Intelligence Summary
app.post('/api/ai/summary', async (req: Request, res: ExpressResponse) => {
  const { coinId, coinName, currentPrice, priceChange24h, marketCap, volume } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      summary: {
        coinId: coinId || 'market',
        coinName: coinName || 'Crypto Market',
        sentiment: priceChange24h >= 0 ? 'Bullish' : 'Bearish',
        confidenceScore: 88,
        summary: `${coinName || 'The crypto market'} is currently displaying high liquidity consolidation with standard 24h price movement of ${priceChange24h ? priceChange24h.toFixed(2) : '2.3'}%. Institutional inflows and L2 activity support positive structural momentum.`,
        keyTakeaways: [
          'Solid trading volume with resilient buyer support across major spot exchanges.',
          'Derivatives open interest remains stable without extreme over-leveraged liquidation risk.',
          'Macro tailwinds and spot ETF inflows provide multi-month structural support.'
        ],
        riskFactors: [
          'Short-term resistance levels near recent swing highs.',
          'Macro economic interest rate announcement volatility.'
        ],
        technicalOutlook: 'Consolidating above the 20-day exponential moving average (EMA) with healthy RSI reset.',
        updatedAt: new Date().toISOString(),
      },
      source: 'fallback_template',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const prompt = `You are a senior quantitative crypto market analyst at CoinBeacon.
Analyze the following asset/market data and output a JSON response:
Asset Name: ${coinName || 'Global Crypto Market'}
Current Price: $${currentPrice || 'N/A'}
24h Price Change: ${priceChange24h}%
Market Cap: $${marketCap || 'N/A'}
24h Volume: $${volume || 'N/A'}

Provide a structured analysis in JSON format with strictly these keys:
{
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "confidenceScore": number (0 to 100),
  "summary": "2-3 concise sentences explaining current price action and fundamentals",
  "keyTakeaways": ["point 1", "point 2", "point 3"],
  "riskFactors": ["risk 1", "risk 2"],
  "technicalOutlook": "1 sentence technical momentum breakdown"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      summary: {
        coinId: coinId || 'market',
        coinName: coinName || 'Global Market',
        sentiment: parsed.sentiment || 'Bullish',
        confidenceScore: parsed.confidenceScore || 85,
        summary: parsed.summary || 'Market intelligence generated successfully.',
        keyTakeaways: parsed.keyTakeaways || [],
        riskFactors: parsed.riskFactors || [],
        technicalOutlook: parsed.technicalOutlook || '',
        updatedAt: new Date().toISOString(),
      },
      source: 'gemini_live',
    });
  } catch (error) {
    console.error('[Gemini AI Summary Error]:', error);
    return res.json({
      summary: {
        coinId: coinId || 'market',
        coinName: coinName || 'Global Market',
        sentiment: 'Neutral',
        confidenceScore: 75,
        summary: `Market intelligence for ${coinName || 'Crypto Market'} indicates consistent network activity and stable institutional liquidity.`,
        keyTakeaways: [
          'Network transaction throughput remains strong.',
          'Order book depth shows resilient bids near support zones.'
        ],
        riskFactors: ['Global macroeconomic uncertainty'],
        technicalOutlook: 'RSI in neutral domain with key support held firm.',
        updatedAt: new Date().toISOString(),
      },
      source: 'fallback_error',
    });
  }
});

// 7. News & Learn APIs
app.get('/api/news', (_req: Request, res: ExpressResponse) => {
  res.json({ data: FALLBACK_NEWS });
});

app.get('/api/learn', (_req: Request, res: ExpressResponse) => {
  res.json({ data: FALLBACK_LEARN_ARTICLES });
});

app.get('/api/categories', (_req: Request, res: ExpressResponse) => {
  res.json({ data: FALLBACK_CATEGORIES });
});

// -------------------------------------------------------------
// VITE DEV / PRODUCTION STATIC SERVER
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: ExpressResponse) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CoinBeacon] Server running on http://localhost:${PORT}`);
  });
}

startServer();
