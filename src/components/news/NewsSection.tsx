import React, { useState, useEffect } from 'react';
import { NewsItem } from '../../types';
import { getNews } from '../../services/content';
import { formatDate } from '../../utils/formatters';
import { Newspaper, ExternalLink, Clock, Tag } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getNews();
      setNews(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="my-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
          <Newspaper size={24} className="text-blue-500" /> Cryptocurrency News & Market Intelligence
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Curated institutional breaking news, macroeconomic policy, and technological developments.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 bg-slate-900/40 rounded-2xl p-6 border border-slate-800/60"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item) => {
            const sentimentColors = {
              Bullish: 'text-green-500 bg-green-500/10 border-green-500/30',
              Bearish: 'text-red-500 bg-red-500/10 border-red-500/30',
              Neutral: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
            };

            return (
              <article
                key={item.id}
                className="bg-[#14171F] border border-slate-800/60 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-slate-900/40 transition-all flex flex-col justify-between group shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                      <Tag size={12} /> {item.category}
                    </span>
                    {item.sentiment && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          sentimentColors[item.sentiment] || sentimentColors.Neutral
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2 font-sans">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-3 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-medium">{item.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {item.read_time}
                    </span>
                  </div>
                  <span className="text-slate-500">{formatDate(item.published_at)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
