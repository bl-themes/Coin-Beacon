import { SearchResult } from '../types';

export async function searchCoinsAndCategories(query: string): Promise<SearchResult> {
  if (!query || query.trim().length === 0) {
    return { coins: [], categories: [] };
  }
  try {
    const res = await fetch(`/api/coingecko/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data || { coins: [], categories: [] };
  } catch (err) {
    console.error('Search request failed:', err);
    return { coins: [], categories: [] };
  }
}
