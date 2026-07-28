import { Coin, GlobalMarketData, NewsItem, EducationalArticle, CategoryItem } from '../types';

export const FALLBACK_GLOBAL_MARKET: GlobalMarketData = {
  total_market_cap: { usd: 2480000000000 },
  total_volume: { usd: 94200000000 },
  market_cap_percentage: { btc: 56.4, eth: 14.8, usdt: 4.8 },
  market_cap_change_percentage_24h_usd: 2.34,
  active_cryptocurrencies: 14280,
  markets: 1120,
  updated_at: Date.now(),
};

export const FALLBACK_TOP_COINS: Coin[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 67840.50,
    market_cap: 1338000000000,
    market_cap_rank: 1,
    fully_diluted_valuation: 1424000000000,
    total_volume: 38400000000,
    high_24h: 68450.00,
    low_24h: 66120.00,
    price_change_24h: 1720.50,
    price_change_percentage_24h: 2.60,
    price_change_percentage_7d_in_currency: 4.12,
    circulating_supply: 19720000,
    total_supply: 19720000,
    max_supply: 21000000,
    ath: 73737,
    ath_change_percentage: -8.00,
    ath_date: '2024-03-14T07:10:36.635Z',
    atl: 67.81,
    sparkline_in_7d: {
      price: [65100, 65400, 64900, 66200, 66800, 67200, 67840.5]
    }
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3480.20,
    market_cap: 418000000000,
    market_cap_rank: 2,
    fully_diluted_valuation: 418000000000,
    total_volume: 18900000000,
    high_24h: 3540.00,
    low_24h: 3390.00,
    price_change_24h: 90.20,
    price_change_percentage_24h: 2.66,
    price_change_percentage_7d_in_currency: 6.45,
    circulating_supply: 120100000,
    total_supply: 120100000,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -28.65,
    ath_date: '2021-11-10T14:24:19.604Z',
    atl: 0.432979,
    sparkline_in_7d: {
      price: [3270, 3310, 3290, 3380, 3420, 3450, 3480.2]
    }
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 182.40,
    market_cap: 85200000000,
    market_cap_rank: 3,
    fully_diluted_valuation: 105000000000,
    total_volume: 6400000000,
    high_24h: 186.50,
    low_24h: 172.10,
    price_change_24h: 10.30,
    price_change_percentage_24h: 5.98,
    price_change_percentage_7d_in_currency: 12.80,
    circulating_supply: 467000000,
    total_supply: 580000000,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -29.83,
    ath_date: '2021-11-06T21:54:35.825Z',
    atl: 0.500801,
    sparkline_in_7d: {
      price: [161, 163, 167, 172, 178, 180, 182.4]
    }
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 584.10,
    market_cap: 85800000000,
    market_cap_rank: 4,
    fully_diluted_valuation: 85800000000,
    total_volume: 1200000000,
    high_24h: 590.00,
    low_24h: 575.00,
    price_change_24h: 9.10,
    price_change_percentage_24h: 1.58,
    price_change_percentage_7d_in_currency: 3.20,
    circulating_supply: 147000000,
    total_supply: 147000000,
    max_supply: 200000000,
    ath: 717.48,
    ath_change_percentage: -18.59,
    ath_date: '2024-06-06T15:10:00.000Z',
    atl: 0.0398177,
    sparkline_in_7d: {
      price: [565, 568, 572, 578, 580, 582, 584.1]
    }
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.612,
    market_cap: 34200000000,
    market_cap_rank: 5,
    fully_diluted_valuation: 61200000000,
    total_volume: 2100000000,
    high_24h: 0.635,
    low_24h: 0.589,
    price_change_24h: 0.023,
    price_change_percentage_24h: 3.90,
    price_change_percentage_7d_in_currency: 18.50,
    circulating_supply: 55800000000,
    total_supply: 99900000000,
    max_supply: 100000000000,
    ath: 3.84,
    ath_change_percentage: -84.06,
    ath_date: '2018-01-04T00:00:00.000Z',
    atl: 0.00268621,
    sparkline_in_7d: {
      price: [0.51, 0.52, 0.54, 0.57, 0.59, 0.60, 0.612]
    }
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.425,
    market_cap: 15200000000,
    market_cap_rank: 6,
    fully_diluted_valuation: 19100000000,
    total_volume: 480000000,
    high_24h: 0.438,
    low_24h: 0.410,
    price_change_24h: 0.015,
    price_change_percentage_24h: 3.66,
    price_change_percentage_7d_in_currency: 8.20,
    circulating_supply: 35700000000,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -86.25,
    ath_date: '2021-09-02T06:00:10.474Z',
    atl: 0.01925275,
    sparkline_in_7d: {
      price: [0.39, 0.40, 0.41, 0.41, 0.42, 0.42, 0.425]
    }
  },
  {
    id: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    current_price: 28.50,
    market_cap: 11200000000,
    market_cap_rank: 7,
    fully_diluted_valuation: 20500000000,
    total_volume: 390000000,
    high_24h: 29.80,
    low_24h: 27.10,
    price_change_24h: 1.40,
    price_change_percentage_24h: 5.16,
    price_change_percentage_7d_in_currency: -2.10,
    circulating_supply: 393000000,
    total_supply: 443000000,
    max_supply: 720000000,
    ath: 144.96,
    ath_change_percentage: -80.34,
    ath_date: '2021-11-21T14:10:00.000Z',
    atl: 2.80,
    sparkline_in_7d: {
      price: [29.1, 28.8, 28.2, 27.5, 27.9, 28.1, 28.5]
    }
  },
  {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    current_price: 14.20,
    market_cap: 8600000000,
    market_cap_rank: 8,
    fully_diluted_valuation: 14200000000,
    total_volume: 320000000,
    high_24h: 14.60,
    low_24h: 13.70,
    price_change_24h: 0.50,
    price_change_percentage_24h: 3.65,
    price_change_percentage_7d_in_currency: 11.40,
    circulating_supply: 608000000,
    total_supply: 1000000000,
    max_supply: 1000000000,
    ath: 52.70,
    ath_change_percentage: -73.06,
    ath_date: '2021-05-10T00:00:00.000Z',
    atl: 0.148183,
    sparkline_in_7d: {
      price: [12.7, 12.9, 13.2, 13.5, 13.9, 14.0, 14.2]
    }
  },
  {
    id: 'near',
    symbol: 'near',
    name: 'NEAR Protocol',
    image: 'https://assets.coingecko.com/coins/images/10365/large/near.png',
    current_price: 5.85,
    market_cap: 6400000000,
    market_cap_rank: 9,
    fully_diluted_valuation: 7000000000,
    total_volume: 290000000,
    high_24h: 6.10,
    low_24h: 5.50,
    price_change_24h: 0.35,
    price_change_percentage_24h: 6.36,
    price_change_percentage_7d_in_currency: 14.20,
    circulating_supply: 1090000000,
    total_supply: 1200000000,
    max_supply: null,
    ath: 20.42,
    ath_change_percentage: -71.35,
    ath_date: '2022-01-16T17:40:00.000Z',
    atl: 0.525,
    sparkline_in_7d: {
      price: [5.1, 5.2, 5.3, 5.5, 5.7, 5.8, 5.85]
    }
  },
  {
    id: 'sui',
    symbol: 'sui',
    name: 'Sui',
    image: 'https://assets.coingecko.com/coins/images/26375/large/sui-ocean-square.png',
    current_price: 1.95,
    market_cap: 5200000000,
    market_cap_rank: 10,
    fully_diluted_valuation: 19500000000,
    total_volume: 410000000,
    high_24h: 2.05,
    low_24h: 1.82,
    price_change_24h: 0.13,
    price_change_percentage_24h: 7.14,
    price_change_percentage_7d_in_currency: 22.10,
    circulating_supply: 2660000000,
    total_supply: 10000000000,
    max_supply: 10000000000,
    ath: 2.33,
    ath_change_percentage: -16.30,
    ath_date: '2024-03-27T00:00:00.000Z',
    atl: 0.364,
    sparkline_in_7d: {
      price: [1.59, 1.62, 1.70, 1.81, 1.88, 1.91, 1.95]
    }
  }
];

export const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Bitcoin Surges Past $67,000 as Institutional ETF Inflows Accelerate',
    description: 'Spot Bitcoin ETFs recorded over $450M in single-day net inflows, led by BlackRock and Fidelity, signaling strong institutional appetite.',
    url: '#',
    source: 'CoinBeacon Insights',
    published_at: '2026-07-27T22:15:00Z',
    category: 'Market Analysis',
    read_time: '3 min read',
    sentiment: 'Bullish'
  },
  {
    id: 'news-2',
    title: 'Ethereum Layer-2 Network Activity Hits All-Time High Following Dencun Upgrades',
    description: 'Transaction fees on Arbitrum, Optimism, and Base remain under $0.01, propelling total active addresses across L2s above 5 million daily.',
    url: '#',
    source: 'DeFi Intelligence',
    published_at: '2026-07-27T19:40:00Z',
    category: 'DeFi & Layer 2',
    read_time: '4 min read',
    sentiment: 'Bullish'
  },
  {
    id: 'news-3',
    title: 'Global Regulators Propose Harmonized Framework for Cross-Border Stablecoin Transfers',
    description: 'Financial Stability Board outlines updated guidelines emphasizing reserve transparency and strict audit compliance for major USD-pegged stablecoins.',
    url: '#',
    source: 'Macro Crypto Policy',
    published_at: '2026-07-27T16:05:00Z',
    category: 'Policy & Regulation',
    read_time: '5 min read',
    sentiment: 'Neutral'
  },
  {
    id: 'news-4',
    title: 'Decentralized AI Networks Gain Momentum as Compute Demand Skyrockets',
    description: 'Tokens in the AI intelligence sector outpace broad market benchmarks as GPU rental protocols report record revenue growth.',
    url: '#',
    source: 'Tech & AI Trends',
    published_at: '2026-07-27T12:30:00Z',
    category: 'AI & Infra',
    read_time: '4 min read',
    sentiment: 'Bullish'
  }
];

export const FALLBACK_LEARN_ARTICLES: EducationalArticle[] = [
  {
    id: 'learn-1',
    title: 'Understanding Crypto Market Cycles and Halving Mechanics',
    category: 'Basics',
    summary: 'A deep dive into Bitcoin supply issuance, block rewards, macro liquidity cycles, and how supply shock influences long-term market trends.',
    readTime: '6 min read',
    level: 'Beginner',
    publishedAt: '2026-06-15',
    icon: 'BookOpen',
    content: [
      'The Bitcoin Halving is a fundamental programmatic mechanism built into the Bitcoin protocol. Occurring roughly every 210,000 blocks (or approximately every 4 years), the block reward issued to miners is reduced by 50%.',
      'Historically, the halving compresses daily new supply, creating a structural supply shock if demand remains constant or expands. Understanding this 4-year cycle helps investors analyze long-term liquidity dynamics.',
      'Key takeaways include monitoring exchange net flows, miner hash rate security, and macro central bank interest rate environment.'
    ]
  },
  {
    id: 'learn-2',
    title: 'Demystifying Layer 2 Scaling: Rollups, ZK vs Optimistic Architecture',
    category: 'Layer 2',
    summary: 'Explore how Layer 2 scaling protocols offload transaction execution from Ethereum L1 while inheriting mainnet security through cryptographic proofs.',
    readTime: '8 min read',
    level: 'Intermediate',
    publishedAt: '2026-06-20',
    icon: 'Layers',
    content: [
      'Layer 2 (L2) solutions address the blockchain trilemma by separating transaction processing from settlement and data availability.',
      'Optimistic Rollups assume transactions are valid by default and use fraud proofs during a dispute window. ZK-Rollups (Zero-Knowledge) generate mathematical validity proofs instantly.',
      'With EIP-4844 Blob transactions, L2 operational costs dropped by over 90%, enabling micro-transactions, decentralized social apps, and high-frequency trading.'
    ]
  },
  {
    id: 'learn-3',
    title: 'Self-Custody & Key Security: Hardware Wallets vs Smart Contract Multisigs',
    category: 'Security',
    summary: 'Learn best practices for safeguarding digital assets against phishing, smart contract exploits, and seed phrase compromise.',
    readTime: '7 min read',
    level: 'Intermediate',
    publishedAt: '2026-07-02',
    icon: 'Shield',
    content: [
      'Self-custody is the cornerstone of sovereign financial freedom. However, with true control comes the responsibility of managing cryptographic private keys.',
      'Hardware wallets keep private keys completely isolated from internet-connected malware. Smart contract wallets with account abstraction offer social recovery and daily spending limits.',
      'Always verify smart contract allowances, revoke unused approvals periodically, and never enter seed phrases on web forms.'
    ]
  },
  {
    id: 'learn-4',
    title: 'DeFi Yield Dynamics: Liquidity Pools, Impermanent Loss & Staking',
    category: 'DeFi',
    summary: 'Master the mechanics of Automated Market Makers (AMMs), staking yields, concentrated liquidity ranges, and risk management.',
    readTime: '10 min read',
    level: 'Advanced',
    publishedAt: '2026-07-10',
    icon: 'TrendingUp',
    content: [
      'Automated Market Makers replace order books with liquidity pools using constant-product formulas (x * y = k).',
      'Impermanent loss occurs when the price ratio of pooled tokens diverges from when they were deposited. Understanding volatile vs pegged assets is crucial for liquidity providers.',
      'Liquid Staking Tokens (LSTs) and Re-staking protocols allow capital efficiency by unlocking liquidity while earning native network consensus yields.'
    ]
  }
];

export const FALLBACK_CATEGORIES: CategoryItem[] = [
  { id: 'layer-1', name: 'Layer 1 (L1)', market_cap: 1850000000000, market_cap_change_24h: 2.8, volume_24h: 58000000000, top_3_coins: ['bitcoin', 'ethereum', 'solana'] },
  { id: 'smart-contract-platform', name: 'Smart Contract Platforms', market_cap: 620000000000, market_cap_change_24h: 3.4, volume_24h: 28000000000, top_3_coins: ['ethereum', 'solana', 'binancecoin'] },
  { id: 'decentralized-finance-defi', name: 'DeFi (Decentralized Finance)', market_cap: 98000000000, market_cap_change_24h: 1.9, volume_24h: 8400000000, top_3_coins: ['uniswap', 'chainlink', 'aave'] },
  { id: 'artificial-intelligence', name: 'Artificial Intelligence (AI)', market_cap: 38000000000, market_cap_change_24h: 6.2, volume_24h: 4200000000, top_3_coins: ['bittensor', 'render-token', 'fetch-ai'] },
  { id: 'layer-2', name: 'Layer 2 (L2)', market_cap: 22000000000, market_cap_change_24h: 4.1, volume_24h: 1900000000, top_3_coins: ['arbitrum', 'optimism', 'polygon-ecosystem-token'] },
  { id: 'meme-token', name: 'Meme Tokens', market_cap: 58000000000, market_cap_change_24h: -1.2, volume_24h: 6500000000, top_3_coins: ['dogecoin', 'shiba-inu', 'pepe'] },
];
