import React, { useState, useEffect } from 'react';
import { AIAnalysis } from '../../types';
import { fetchAIAnalysis } from '../../services/ai';
import { Sparkles, CheckCircle2, AlertTriangle, TrendingUp, RefreshCw, Cpu } from 'lucide-react';

interface AIInsightsCardProps {
  coinId: string;
  coinName: string;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  volume: number;
}

export const AIInsightsCard: React.FC<AIInsightsCardProps> = ({
  coinId,
  coinName,
  currentPrice,
  priceChange24h,
  marketCap,
  volume,
}) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadAI = async () => {
    setLoading(true);
    try {
      const data = await fetchAIAnalysis({
        coinId,
        coinName,
        currentPrice,
        priceChange24h,
        marketCap,
        volume,
      });
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to load AI analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAI();
  }, [coinId]);

  const sentimentColors = {
    Bullish: 'text-green-700 bg-green-500/10 border-green-500/30 dark:text-green-500',
    Bearish: 'text-red-700 bg-red-500/10 border-red-500/30 dark:text-red-500',
    Neutral: 'text-amber-700 bg-amber-500/10 border-amber-500/30 dark:text-amber-400',
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-600/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-6 my-6 shadow-sm dark:shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-200 dark:border-slate-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-600/30 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Cpu size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
              CoinBeacon AI Intelligence Synthesis
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Powered by Gemini Quantitative Model
            </span>
          </div>
        </div>

        <button
          onClick={loadAI}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 dark:bg-slate-900/50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50 shadow-xs dark:shadow-none"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          <span>Regenerate Analysis</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse py-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800/80 rounded w-1/3"></div>
          <div className="h-16 bg-slate-200 dark:bg-slate-800/50 rounded-xl"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 bg-slate-200 dark:bg-slate-800/40 rounded-lg"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-800/40 rounded-lg"></div>
          </div>
        </div>
      ) : analysis ? (
        <div className="space-y-5">
          {/* Sentiment & Score Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                sentimentColors[analysis.sentiment] || sentimentColors.Neutral
              }`}
            >
              Market Sentiment: {analysis.sentiment}
            </span>

            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none">
              AI Confidence: <strong className="text-blue-600 dark:text-blue-400">{analysis.confidenceScore}%</strong>
            </span>
          </div>

          {/* Executive Summary */}
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/80 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 font-sans shadow-xs dark:shadow-none">
            {analysis.summary}
          </p>

          {/* Key Takeaways & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Takeaways */}
            {analysis.keyTakeaways && analysis.keyTakeaways.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-xl p-4 shadow-xs dark:shadow-none">
                <h4 className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-500 font-mono mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Structural Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {analysis.keyTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Factors */}
            {analysis.riskFactors && analysis.riskFactors.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-xl p-4 shadow-xs dark:shadow-none">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500 font-mono mb-2 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Risk Vectors
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {analysis.riskFactors.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 dark:text-red-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Technical Outlook */}
          {analysis.technicalOutlook && (
            <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 font-mono shadow-xs dark:shadow-none">
              <TrendingUp size={14} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-slate-200">Technical Momentum:</strong> {analysis.technicalOutlook}
              </span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
