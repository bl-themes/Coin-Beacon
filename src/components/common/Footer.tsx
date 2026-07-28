import React, { useState } from 'react';
import { Compass, Send, ShieldCheck, Zap, Globe, Github, Twitter, Check } from 'lucide-react';

interface FooterProps {
  onSelectView: (view: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectView }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-100 dark:bg-[#0B0E14] border-t border-slate-200 dark:border-slate-800/60 mt-20 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass size={18} />
              </div>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
                Coin<span className="text-blue-600 dark:text-blue-500">Beacon</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Navigate the Crypto Market with Confidence. High-precision real-time cryptocurrency intelligence, AI market synthesis, and institutional-grade analytics powered by CoinGecko API.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 text-xs font-mono text-green-600 dark:text-green-500">
                <ShieldCheck size={13} /> SSL Secured
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/60 text-xs font-mono text-blue-600 dark:text-blue-400">
                <Zap size={13} /> Low Latency
              </span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 font-mono">
              Markets & Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectView('coins')} className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer">
                  Top 100 Cryptocurrencies
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('categories')} className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer">
                  Crypto Categories
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('watchlist')} className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer">
                  Personal Watchlist
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('news')} className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer">
                  Market News & Analysis
                </button>
              </li>
              <li>
                <button onClick={() => onSelectView('learn')} className="hover:text-blue-600 dark:hover:text-white transition-colors cursor-pointer">
                  CoinBeacon Academy
                </button>
              </li>
            </ul>
          </div>

          {/* Educational / Features */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 font-mono">
              Resources & Data
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">
                CoinGecko API Integration
              </li>
              <li className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">
                Gemini AI Market Intelligence
              </li>
              <li className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">
                Global BTC/ETH Dominance
              </li>
              <li className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">
                Live Sparkline Charts
              </li>
              <li className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">
                24h Gainers & Losers
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3 font-mono">
              Intelligence Briefing
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
              Subscribe for weekly AI-synthesized crypto insights & macro alerts.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-500 text-xs">
                <Check size={16} /> Subscribed to briefings!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter institutional email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800/60 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send size={12} /> Join Newsletter
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl leading-relaxed text-[11px]">
            <strong className="text-slate-700 dark:text-slate-400">Financial Disclaimer:</strong> Data provided on CoinBeacon is for informational purposes only. CoinBeacon does not provide financial or investment advice. Always conduct independent research before making cryptocurrency transactions.
          </p>
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
            <span>© 2026 CoinBeacon Platform. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
