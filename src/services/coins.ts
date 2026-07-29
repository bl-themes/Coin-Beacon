import { Coin, CoinDetail, TimeRange } from '../types';

export async function getTopCoins(page = 1, perPage = 100): Promise<{ data: Coin[]; source: string; isDelayed?: boolean }> {
  try {
    const res = await fetch(`/api/coingecko/coins?page=${page}&per_page=${perPage}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch top coins:', err);
    throw err;
  }
}

export async function getCoinDetail(id: string): Promise<{ data: CoinDetail; source: string; isDelayed?: boolean }> {
  try {
    const res = await fetch(`/api/coingecko/coin/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch coin detail for ${id}:`, err);
    throw err;
  }
}

export async function getCoinChartData(id: string, range: TimeRange = '7D'): Promise<{
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

  try {
    const res = await fetch(`/api/coingecko/coin/${id}/chart?days=${days}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch chart for ${id}:`, err);
    throw err;
  }
}
