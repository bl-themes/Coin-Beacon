import { getGlobalMarketData } from './market';
import { getTopCoins, getCoinDetail, getCoinChartData } from './coins';
import { searchCoinsAndCategories } from './search';

export const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchGlobalMarket = getGlobalMarketData;
export const fetchTopCoins = getTopCoins;
export const fetchCoinDetail = getCoinDetail;
export const fetchCoinChart = getCoinChartData;
export const searchCoinGecko = searchCoinsAndCategories;

