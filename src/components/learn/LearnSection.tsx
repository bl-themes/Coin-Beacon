import React, { useState, useEffect } from 'react';
import { EducationalArticle } from '../../types';
import { getLearnArticles } from '../../services/content';
import { BookOpen, Shield, Layers, TrendingUp, Clock, X, ArrowRight } from 'lucide-react';

export const LearnSection: React.FC = () => {
  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getLearnArticles();
      setArticles(data);
      setLoading(false);
    }
    load();
  }, []);

  const levelColors = {
    Beginner: 'text-emerald-700 bg-emerald-500/10 border-emerald-500/30 dark:text-emerald-400',
    Intermediate: 'text-blue-700 bg-blue-500/10 border-blue-500/30 dark:text-blue-400',
    Advanced: 'text-purple-700 bg-purple-500/10 border-purple-500/30 dark:text-purple-400',
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />;
      case 'Layers':
        return <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />;
      case 'Shield':
        return <Shield size={20} className="text-emerald-600 dark:text-emerald-400" />;
      case 'TrendingUp':
        return <TrendingUp size={20} className="text-amber-600 dark:text-amber-400" />;
      default:
        return <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="my-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
          <BookOpen size={24} className="text-blue-500" /> CoinBeacon Academy
        </h2>
        <p className="text-sm text-slate-600 dark:text-gray-400 mt-1">
          Master cryptocurrency fundamentals, decentralized protocols, security paradigms, and macro market cycles.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/60"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-all cursor-pointer flex flex-col justify-between group shadow-sm dark:shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 flex items-center justify-center shrink-0">
                    {getIcon(art.icon)}
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      levelColors[art.level] || levelColors.Beginner
                    }`}
                  >
                    {art.level}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2 font-sans">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4 font-sans">
                  {art.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-3 border-t border-slate-200 dark:border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {art.readTime}
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline flex items-center gap-1">
                  Read Article <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Reader Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/60 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded border font-semibold ${
                    levelColors[selectedArticle.level]
                  }`}
                >
                  {selectedArticle.level}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {selectedArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-900/50 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight font-sans">
              {selectedArticle.title}
            </h2>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/60">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
