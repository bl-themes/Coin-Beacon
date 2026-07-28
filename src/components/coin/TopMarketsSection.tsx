import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { ShieldCheck, Building2 } from 'lucide-react';
import { useCurrency } from '../../context/AppContext';

interface MarketPair {
  exchange: string;
  pair: string;
  price: number;
  volume24hUsd: number;
  volumeSharePct: number;
  trustScore: 'High' | 'Medium';
  category: 'CEX' | 'DEX';
}

interface TopMarketsSectionProps {
  coinName: string;
  symbol: string;
  currentPrice: number;
}

export const TopMarketsSection: React.FC<TopMarketsSectionProps> = ({
  coinName,
  symbol,
  currentPrice,
}) => {
  const { currency } = useCurrency();
  const symUpper = symbol.toUpperCase();

  const mockMarkets: MarketPair[] = [
    {
      exchange: 'Binance',
      pair: `${symUpper}/USDT`,
      price: currentPrice,
      volume24hUsd: 1420000000,
      volumeSharePct: 28.4,
      trustScore: 'High',
      category: 'CEX',
    },
    {
      exchange: 'Coinbase Exchange',
      pair: `${symUpper}/USD`,
      price: currentPrice * 1.0002,
      volume24hUsd: 840000000,
      volumeSharePct: 16.8,
      trustScore: 'High',
      category: 'CEX',
    },
    {
      exchange: 'Kraken',
      pair: `${symUpper}/EUR`,
      price: currentPrice * 0.9998,
      volume24hUsd: 380000000,
      volumeSharePct: 7.6,
      trustScore: 'High',
      category: 'CEX',
    },
    {
      exchange: 'Bybit',
      pair: `${symUpper}/USDT`,
      price: currentPrice,
      volume24hUsd: 620000000,
      volumeSharePct: 12.4,
      trustScore: 'High',
      category: 'CEX',
    },
    {
      exchange: 'OKX',
      pair: `${symUpper}/USDT`,
      price: currentPrice * 0.9999,
      volume24hUsd: 490000000,
      volumeSharePct: 9.8,
      trustScore: 'High',
      category: 'CEX',
    },
    {
      exchange: 'Uniswap V3',
      pair: `${symUpper}/USDC`,
      price: currentPrice * 1.0005,
      volume24hUsd: 210000000,
      volumeSharePct: 4.2,
      trustScore: 'High',
      category: 'DEX',
    },
  ];

  return (
    <section aria-labelledby="top-markets-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="top-markets-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
            <Building2 size={18} className="text-blue-500" /> Top Markets & Liquidity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Primary global spot and decentralized exchange order books for {coinName}.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
          Spot Markets
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Exchange</th>
              <th className="py-3 px-3">Pair</th>
              <th className="py-3 px-3 text-right">Price</th>
              <th className="py-3 px-3 text-right">24h Volume</th>
              <th className="py-3 px-3 text-right">Volume %</th>
              <th className="py-3 px-3 text-center">Trust Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {mockMarkets.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{m.exchange}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${m.category === 'DEX' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {m.category}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-blue-600 dark:text-blue-400 font-semibold">{m.pair}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(m.price, currency)}</td>
                <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{formatCurrency(m.volume24hUsd, currency, 0, true)}</td>
                <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">{m.volumeSharePct}%</td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                    <ShieldCheck size={12} /> {m.trustScore}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
