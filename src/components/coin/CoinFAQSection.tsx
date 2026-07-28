import React, { useState } from 'react';
import { CoinDetail } from '../../types';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface CoinFAQSectionProps {
  coin: CoinDetail;
}

export const CoinFAQSection: React.FC<CoinFAQSectionProps> = ({ coin }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const price = coin.market_data?.current_price?.usd || 0;
  const marketCap = coin.market_data?.market_cap?.usd || 0;
  const rank = coin.market_cap_rank || 1;
  const ath = coin.market_data?.ath?.usd || 0;
  const athDate = coin.market_data?.ath_date?.usd || '';
  const circulating = coin.market_data?.circulating_supply || 0;
  const symbol = coin.symbol.toUpperCase();

  const faqs = [
    {
      question: `What is ${coin.name} (${symbol})?`,
      answer: `${coin.name} (${symbol}) is a leading digital asset ranked #${rank} by total market capitalization. ${
        coin.description?.en
          ? coin.description.en.replace(/<[^>]*>?/gm, '').slice(0, 250) + '...'
          : `${coin.name} operates on decentralized blockchain infrastructure designed for secure, transparent financial transactions.`
      }`,
    },
    {
      question: `What is the current ${coin.name} price?`,
      answer: `As of today, the live market price of ${coin.name} (${symbol}) is ${formatCurrency(price)} with a 24-hour trading volume of ${formatCurrency(coin.market_data?.total_volume?.usd || 0, 0, true)}.`,
    },
    {
      question: `What is ${coin.name}'s market capitalization and rank?`,
      answer: `${coin.name} has a market capitalization of ${formatCurrency(marketCap, 0, true)}, making it the #${rank} largest cryptocurrency on CoinBeacon.`,
    },
    {
      question: `What is ${coin.name}'s all-time high (ATH)?`,
      answer: `${coin.name} reached an all-time high price of ${formatCurrency(ath)}${
        athDate ? ` on ${formatDate(athDate)}` : ''
      }. The current price represents a ${coin.market_data?.ath_change_percentage?.usd ? coin.market_data.ath_change_percentage.usd.toFixed(2) + '%' : 'N/A'} change from its peak.`,
    },
    {
      question: `What is ${coin.name} used for and how does its circulating supply work?`,
      answer: `${coin.name} is utilized for decentralized transactions, smart contract execution, or value storage. Currently, there are ${formatNumber(circulating)} ${symbol} coins in active circulating supply out of a total supply of ${formatNumber(coin.market_data?.total_supply || circulating)} ${symbol}.`,
    },
  ];

  // FAQ Schema JSON-LD structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section aria-labelledby="faq-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      {/* Inject Structured FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 id="faq-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-sans">
            <HelpCircle size={18} className="text-blue-500" /> Frequently Asked Questions about {coin.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key information, price statistics, and historical background.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800/60 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40 transition-colors"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-question-${idx}`}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp size={16} className="text-blue-500 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/40 font-sans animate-in fade-in duration-150"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
