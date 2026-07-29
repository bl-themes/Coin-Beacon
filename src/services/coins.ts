import { Coin, CoinDetail, TimeRange } from '../types';
import { fetchTopCoins, fetchCoinDetail, fetchCoinChart } from './coingecko';

export async function getTopCoins(
  page = 1,
  perPage = 100,
  vsCurrency = 'usd'
): Promise<{ data: Coin[]; source: string; isDelayed?: boolean }> {
  return fetchTopCoins(page, perPage, vsCurrency);
}

export async function getCoinDetail(
  id: string,
  vsCurrency = 'usd'
): Promise<{ data: CoinDetail; source: string; isDelayed?: boolean }> {
  return fetchCoinDetail(id, vsCurrency);
}

export async function getCoinChartData(
  id: string,
  range: TimeRange = '7D',
  vsCurrency = 'usd'
): Promise<{
  data: { prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] };
  source: string;
  isDelayed?: boolean;
}> {
  return fetchCoinChart(id, range, vsCurrency);
}

