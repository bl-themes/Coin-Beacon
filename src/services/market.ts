import { GlobalMarketData } from '../types';
import { fetchGlobalMarket } from './coingecko';

export async function getGlobalMarketData(): Promise<{ data: GlobalMarketData; source: string; isDelayed?: boolean }> {
  return fetchGlobalMarket();
}
