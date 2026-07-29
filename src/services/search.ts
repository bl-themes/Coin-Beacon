import { SearchResult } from '../types';
import { searchCoinGecko } from './coingecko';

export async function searchCoinsAndCategories(query: string): Promise<SearchResult> {
  return searchCoinGecko(query);
}
