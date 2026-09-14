import { SearchResult } from '../types';
import { FALLBACK_TOP_COINS, FALLBACK_CATEGORIES } from '../constants/fallbackData';

export async function searchCoinsAndCategories(query: string): Promise<SearchResult> {
  if (!query || query.trim().length === 0) {
    return { coins: [], categories: [] };
  }

  const cleanQuery = query.trim().toLowerCase();

  // 1. Try server proxy
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`/api/coingecko/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json.data && (json.data.coins?.length > 0 || json.data.categories?.length > 0)) {
        return json.data;
      }
    }
  } catch {
    // Proxy unavailable (e.g. Vercel static)
  }

  // 2. Direct browser CoinGecko search
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const directRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (directRes.ok) {
      const data = await directRes.json();
      if (data && (data.coins || data.categories)) {
        return {
          coins: data.coins || [],
          categories: data.categories || [],
        };
      }
    }
  } catch {
    // Direct search error
  }

  // 3. Local fast client search against top assets
  const matchingCoins = FALLBACK_TOP_COINS.filter(
    (c) => c.name.toLowerCase().includes(cleanQuery) || c.symbol.toLowerCase().includes(cleanQuery)
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
    cat.name.toLowerCase().includes(cleanQuery)
  ).map((cat) => ({ id: cat.id, name: cat.name }));

  return { coins: matchingCoins, categories: matchingCategories };
}
