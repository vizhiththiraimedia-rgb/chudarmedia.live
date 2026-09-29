import React from 'react';
import { Home, Film, Tv, Search, Globe } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onGoHome: () => void;
  onSelectCinema: () => void;
  onOpenLiveTv: () => void;
  onOpenSearch: () => void;
  language: 'ta' | 'en';
  onToggleLanguage: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onGoHome,
  onSelectCinema,
  onOpenLiveTv,
  onOpenSearch,
  language,
  onToggleLanguage,
}) => {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 h-14 items-center">
        {/* 1. Home */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-[#C8102E]' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold leading-none">
            {language === 'ta' ? 'முகப்பு' : 'Home'}
          </span>
        </button>

        {/* 2. Cinema News */}
        <button
          onClick={onSelectCinema}
          className="flex flex-col items-center justify-center h-full text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
        >
          <Film className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold leading-none">
            {language === 'ta' ? 'சினிமா' : 'Cinema'}
          </span>
        </button>

        {/* 3. Live TV Center Button (Highlighted) */}
        <button
          onClick={onOpenLiveTv}
          className="flex flex-col items-center justify-center h-full relative cursor-pointer group"
        >
          <div
            className={`w-10 h-10 -mt-3 rounded-full flex items-center justify-center shadow-md transition-transform group-active:scale-95 ${
              currentView === 'livetv' ? 'bg-[#111111] text-amber-300 ring-2 ring-[#C8102E]' : 'bg-[#C8102E] text-white'
            }`}
          >
            <div className="relative">
              <span className="animate-ping absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-white opacity-80"></span>
              <Tv className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#C8102E] leading-none mt-0.5">
            LIVE TV
          </span>
        </button>

        {/* 4. Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center h-full text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold leading-none">
            {language === 'ta' ? 'தேடல்' : 'Search'}
          </span>
        </button>

        {/* 5. Language Switcher */}
        <button
          onClick={onToggleLanguage}
          className="flex flex-col items-center justify-center h-full text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
          title="Switch Language"
        >
          <Globe className="w-5 h-5 mb-0.5 text-neutral-600" />
          <span className="text-[10px] font-bold leading-none">
            {language === 'ta' ? 'English' : 'தமிழ்'}
          </span>
        </button>
      </div>
    </nav>
  );
};
