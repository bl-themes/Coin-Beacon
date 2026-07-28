import React, { useState, useEffect } from 'react';
import {
  Compass,
  Search,
  Star,
  Newspaper,
  BookOpen,
  TrendingUp,
  Layers,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useI18n } from '../../context/AppContext';

export type NavView = 'home' | 'coins' | 'categories' | 'watchlist' | 'news' | 'learn' | 'coin-detail';

interface NavbarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenSearch: () => void;
  watchlistCount: number;
  apiSource?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenSearch,
  watchlistCount,
  apiSource = 'live',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home' as NavView, label: t('nav.markets'), icon: TrendingUp },
    { id: 'coins' as NavView, label: t('nav.top100'), icon: Compass },
    { id: 'categories' as NavView, label: t('nav.categories'), icon: Layers },
    {
      id: 'watchlist' as NavView,
      label: t('nav.watchlist'),
      icon: Star,
      badge: watchlistCount > 0 ? watchlistCount : undefined,
    },
    { id: 'news' as NavView, label: t('nav.news'), icon: Newspaper },
    { id: 'learn' as NavView, label: t('nav.academy'), icon: BookOpen },
  ];

  const handleNavClick = (view: NavView) => {
    onSelectView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0B0E14]/90 backdrop-blur-md border-slate-200 dark:border-slate-800/60 shadow-md dark:shadow-2xl'
          : 'bg-white/80 dark:bg-[#0B0E14]/80 backdrop-blur-md border-slate-200 dark:border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                <Compass size={18} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 font-sans">
                  Coin<span className="text-blue-600 dark:text-blue-500">Beacon</span>
                </span>
              </div>
            </button>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer relative ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-500 font-semibold'
                        : 'hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
            >
              <Search size={14} className="text-slate-400 dark:text-slate-500" />
              <span className="hidden sm:inline text-xs">Search assets, news...</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-[#0B0E14] border border-slate-300 dark:border-slate-800 rounded text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* API Status Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiSource === 'live'
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-400'
                }`}
              ></span>
              <span className="capitalize">{apiSource === 'live' ? 'Live API' : 'Cached Data'}</span>
            </div>

            {/* Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-[#161e2e] border border-slate-200 dark:border-[#232d3f] text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0e1420] border-b border-slate-200 dark:border-[#232d3f] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-blue-600 dark:text-white bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30'
                      : 'text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-[#161e2e] border border-slate-200 dark:border-[#232d3f]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#232d3f]">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
};
