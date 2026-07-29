import { GlobalMarketData } from '../types';

export async function getGlobalMarketData(): Promise<{ data: GlobalMarketData; source: string; isDelayed?: boolean }> {
  try {
    const res = await fetch('/api/coingecko/global');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch global market data:', err);
    throw err;
  }
}
