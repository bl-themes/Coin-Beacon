import React from 'react';
import { CoinLinks } from '../../types';
import { Globe, BookOpen, Github, Twitter, MessageSquare, ExternalLink, Link2 } from 'lucide-react';

interface OfficialLinksProps {
  links: CoinLinks;
  coinName: string;
}

export const OfficialLinks: React.FC<OfficialLinksProps> = ({ links, coinName }) => {
  const homepage = links?.homepage?.find((h) => h && h.length > 0) || '';
  const explorer = links?.blockchain_site?.find((b) => b && b.length > 0) || '';
  const forum = links?.official_forum_url?.find((f) => f && f.length > 0) || '';
  const github = links?.repos_url?.github?.find((g) => g && g.length > 0) || '';
  const twitter = links?.twitter_screen_name ? `https://twitter.com/${links.twitter_screen_name}` : '';
  const reddit = links?.subreddit_url || '';

  const linkItems = [
    { label: 'Official Website', url: homepage, icon: Globe, iconColor: 'text-blue-500' },
    { label: 'Blockchain Explorer', url: explorer, icon: BookOpen, iconColor: 'text-indigo-500' },
    { label: 'GitHub Repository', url: github, icon: Github, iconColor: 'text-purple-500' },
    { label: 'Official Forum', url: forum, icon: MessageSquare, iconColor: 'text-teal-500' },
    { label: 'Twitter / X', url: twitter, icon: Twitter, iconColor: 'text-sky-500' },
    { label: 'Reddit Community', url: reddit, icon: MessageSquare, iconColor: 'text-orange-500' },
  ].filter((item) => Boolean(item.url));

  return (
    <section aria-labelledby="official-links-heading" className="bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 my-4 shadow-sm dark:shadow-2xl">
      <h2 id="official-links-heading" className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4 flex items-center gap-2 font-sans">
        <Link2 size={18} className="text-blue-500" /> Official Resources & Verified Links
      </h2>

      {linkItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {linkItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5 font-medium text-xs font-sans">
                  <Icon size={16} className={`${item.iconColor} shrink-0`} />
                  <span>{item.label}</span>
                </span>
                <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">No official links cataloged for {coinName}.</p>
      )}
    </section>
  );
};
