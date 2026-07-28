import React, { useState } from 'react';
import { CoinDetail } from '../../types';
import { formatDate } from '../../utils/formatters';
import { BookOpen, ChevronDown, ChevronUp, Sparkles, Calendar } from 'lucide-react';

interface CoinDescriptionProps {
  coin: CoinDetail;
}

export const CoinDescription: React.FC<CoinDescriptionProps> = ({ coin }) => {
  const [expanded, setExpanded] = useState(false);

  const rawDescription = coin.description?.en || '';
  
  // Clean CoinGecko HTML links safely to pure text or clean paragraphs
  const cleanDescription = rawDescription
    .replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '');

  const paragraphs = cleanDescription.split('\n').filter((p) => p.trim().length > 0);

  return (
    <section aria-labelledby="coin-description-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 id="coin-description-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
          <BookOpen size={18} className="text-blue-500" /> About {coin.name} ({coin.symbol.toUpperCase()})
        </h2>
        {coin.genesis_date && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
            <Calendar size={13} />
            <span>Genesis: {formatDate(coin.genesis_date)}</span>
          </div>
        )}
      </div>

      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans space-y-3">
        {paragraphs.length > 0 ? (
          <>
            {(expanded ? paragraphs : paragraphs.slice(0, 2)).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            {paragraphs.length > 2 && (
              <button
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                className="mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {expanded ? (
                  <>
                    Show Less <ChevronUp size={14} />
                  </>
                ) : (
                  <>
                    Read Full Overview <ChevronDown size={14} />
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 italic">
            {coin.name} is a leading digital asset and decentralized cryptocurrency protocol powering global web3 infrastructure.
          </p>
        )}
      </div>
    </section>
  );
};
