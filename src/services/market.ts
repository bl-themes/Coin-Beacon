import { GlobalMarketData } from '../types';
import { FALLBACK_GLOBAL_MARKET } from '../constants/fallbackData';

// In-memory cache to prevent unnecessary calls
let cachedGlobal: { data: GlobalMarketData; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache

export async function getGlobalMarketData(): Promise<{ data: GlobalMarketData; source: string; isDelayed?: boolean }> {
  // Use recent in-memory cache if available
  if (cachedGlobal && Date.now() - cachedGlobal.timestamp < CACHE_TTL_MS) {
    return { data: cachedGlobal.data, source: 'cache', isDelayed: false };
  }

  // 1. Try local server proxy endpoint first (works on Express dev server / Cloud Run)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch('/api/coingecko/global', { signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json?.data && !json.isDelayed) {
        cachedGlobal = { data: json.data, timestamp: Date.now() };
        return { data: json.data, source: json.source || 'proxy', isDelayed: false };
      }
    }
  } catch {
    // Server proxy not available or timed out (e.g. static hosting on Vercel)
  }

  // 2. Direct browser fetch to CoinGecko public API
  // Using visitor's browser IP avoids Vercel datacenter rate-limit blocks!
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const apiKey = import.meta.env.VITE_COINGECKO_API_KEY;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey;
    }

    const directRes = await fetch('https://api.coingecko.com/api/v3/global', {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (directRes.ok) {
      const json = await directRes.json();
      if (json?.data) {
        cachedGlobal = { data: json.data, timestamp: Date.now() };
        return { data: json.data, source: 'live', isDelayed: false };
      }
    }
  } catch (directErr) {
    console.warn('Direct CoinGecko global market fetch error:', directErr);
  }

  // 3. Fallback to existing cached data if we had one
  if (cachedGlobal) {
    return { data: cachedGlobal.data, source: 'cache', isDelayed: false };
  }

  // 4. Fallback to high-fidelity buffer if all live connections are unreachable
  return { data: FALLBACK_GLOBAL_MARKET, source: 'fallback', isDelayed: true };
}
