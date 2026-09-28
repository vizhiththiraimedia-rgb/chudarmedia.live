import React, { useState, useEffect } from 'react';
import {
  Search,
  Tv,
  Menu,
  X,
  Clock,
  Calendar,
  Globe,
  Film,
  Sparkles,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Logo } from './Logo';
import { Category, SiteSettings } from '../types';

interface HeaderProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenSearch: () => void;
  onOpenLiveTv: () => void;
  onGoHome: () => void;
  siteSettings: SiteSettings;
  language: 'ta' | 'en';
  onToggleLanguage: () => void;
  onOpenAdminLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  onOpenSearch,
  onOpenLiveTv,
  onGoHome,
  siteSettings,
  language,
  onToggleLanguage,
  onOpenAdminLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString(language === 'ta' ? 'ta-LK' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );

      if (language === 'ta') {
        const tamilDays = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
        const tamilMonths = [
          'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
          'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
        ];
        const day = tamilDays[now.getDay()];
        const dateNum = now.getDate();
        const month = tamilMonths[now.getMonth()];
        const year = now.getFullYear();
        setCurrentDate(`${day}, ${dateNum} ${month} ${year}`);
      } else {
        setCurrentDate(
          now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        );
      }
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-40 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-[#111111] text-neutral-300 text-xs py-1.5 px-4 sm:px-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Date & Time */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C8102E]" />
              <span className="font-medium text-neutral-200">{currentDate}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span className="font-mono tabular-nums">{currentTime} (IST/SLST)</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-neutral-400 border-l border-neutral-800 pl-4">
              <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                <Film className="w-3 h-3" />
                {language === 'ta' ? 'சினிமா பதிப்புகள்:' : 'Cinema Editions:'}
              </span>
              <span className="text-neutral-300 hover:text-white cursor-pointer transition-colors">சென்னை</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-300 hover:text-white cursor-pointer transition-colors">கொழும்பு</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-300 hover:text-white cursor-pointer transition-colors">யாழ்ப்பாணம்</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-300 hover:text-white cursor-pointer transition-colors">மலேசியா</span>
            </div>
          </div>

          {/* Right: Box office quick tag & Language */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold border-r border-neutral-800 pr-3">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'ta' ? 'சினி உலகம் சினிமா செய்திகள்' : 'Tamil & Global Cinema'}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer text-xs font-medium"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Action Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="cursor-pointer" onClick={onGoHome}>
          <Logo showTagline={true} customLogoUrl={siteSettings.logoUrl} />
        </div>

        {/* Center / Right Functional Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live TV Button with Pulsing Dot */}
          <button
            onClick={onOpenLiveTv}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md bg-[#C8102E] text-white hover:bg-[#a50d25] transition-all shadow-xs cursor-pointer text-xs sm:text-sm font-bold tracking-wide"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <Tv className="w-4 h-4" />
            <span className="whitespace-nowrap uppercase">LIVE TV</span>
          </button>

          {/* Admin Login Button */}
          {onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-md border border-neutral-300 hover:border-[#C8102E] text-neutral-800 hover:text-[#C8102E] hover:bg-red-50/50 transition-colors text-xs font-bold cursor-pointer"
              title="Journalist & Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-2 rounded-md border border-neutral-300 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
            title="செய்திகளைத் தேடுக"
          >
            <Search className="w-4 h-4 text-neutral-600" />
            <span className="hidden md:inline text-neutral-500">செய்திகளைத் தேடுக...</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Primary Category Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-neutral-900 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ul className="flex items-center gap-0.5 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <li key={cat.id} className="shrink-0">
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-3 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer rounded-xs flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#C8102E] text-white shadow-xs'
                        : 'text-neutral-200 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {language === 'ta' ? cat.nameTa : cat.nameEn}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-900 text-white border-t border-neutral-800 px-4 py-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {categories.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3 py-2.5 rounded text-xs font-semibold text-left transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#C8102E] text-white font-bold'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                  }`}
                >
                  <span>{language === 'ta' ? cat.nameTa : cat.nameEn}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </button>
              );
            })}
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLiveTv();
              }}
              className="w-full py-2.5 px-3 rounded bg-[#C8102E] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              <span>சுடர் டிவி நேரலை (LIVE TV)</span>
            </button>

            {onOpenAdminLogin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full py-2.5 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-[#C8102E]" />
                <span>நிர்வாகி உள்நுழைவு (Admin Login)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
