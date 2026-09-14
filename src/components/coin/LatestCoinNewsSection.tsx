import React from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  url: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

interface LatestCoinNewsSectionProps {
  coinName: string;
  symbol: string;
}

export const LatestCoinNewsSection: React.FC<LatestCoinNewsSectionProps> = ({
  coinName,
  symbol,
}) => {
  const mockNews: NewsArticle[] = [
    {
      id: '1',
      title: `${coinName} Institutional Inflows Reach New Monthly Peak Amid Market Momentum`,
      summary: `Institutional asset managers reported record weekly net inflows for ${coinName} derivatives and spot products according to institutional flow records.`,
      source: 'CoinDesk Intelligence',
      timeAgo: '2h ago',
      url: 'https://coindesk.com',
      sentiment: 'Bullish',
    },
    {
      id: '2',
      title: `Global Regulatory Frameworks Align to Provide Security Guarantees for ${symbol.toUpperCase()} Holders`,
      summary: `Financial authorities released updated guidelines clarifying staking, custody, and spot ETF operations for digital assets like ${coinName}.`,
      source: 'Bloomberg Crypto',
      timeAgo: '5h ago',
      url: 'https://bloomberg.com',
      sentiment: 'Neutral',
    },
    {
      id: '3',
      title: `${coinName} Network Upgrade Achieves 40% Throughput Efficiency Boost on Mainnet`,
      summary: `Core developers successfully completed network optimization upgrades, reducing gas fees and boosting transaction processing speed.`,
      source: 'CoinBeacon Insights',
      timeAgo: '8h ago',
      url: 'https://coinbeacon.app',
      sentiment: 'Bullish',
    },
  ];

  return (
    <section aria-labelledby="latest-news-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="latest-news-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
            <Newspaper size={18} className="text-[#455c00] dark:text-[#daff41]" /> Latest {coinName} News & Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Curated market news, protocol updates, and institutional coverage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockNews.map((news) => (
          <a
            key={news.id}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 hover:border-[#daff41]/40 rounded-xl p-4 flex flex-col justify-between transition-all group cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">{news.source}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  news.sentiment === 'Bullish'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {news.sentiment}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#455c00] dark:group-hover:text-[#daff41] transition-colors line-clamp-2 mb-2">
                {news.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {news.summary}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-3 mt-3 border-t border-slate-200 dark:border-slate-800/60">
              <span className="flex items-center gap-1">
                <Clock size={12} /> {news.timeAgo}
              </span>
              <span className="flex items-center gap-1 text-[#455c00] dark:text-[#daff41] font-semibold group-hover:underline">
                Read article <ExternalLink size={12} />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};
