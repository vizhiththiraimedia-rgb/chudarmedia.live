import React, { useState } from 'react';
import { Flame, Bell, ChevronRight, Pause, Play, ExternalLink } from 'lucide-react';
import { BreakingNews } from '../types';

interface BreakingNewsTickerProps {
  breakingItems: BreakingNews[];
  onSelectArticleById?: (articleId: string) => void;
  language: 'ta' | 'en';
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  breakingItems,
  onSelectArticleById,
  language
}) => {
  const [isPaused, setIsPaused] = useState(false);

  const activeItems = breakingItems.filter((item) => item.active);

  if (activeItems.length === 0) {
    return null;
  }

  // Duplicate the items for seamless infinite horizontal scrolling
  const displayItems = [...activeItems, ...activeItems, ...activeItems];

  return (
    <div
      className="breaking-ticker bg-[#C8102E] text-white overflow-hidden relative shadow-inner z-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Left Sticky Badge */}
        <div className="shrink-0 bg-[#A00B22] px-2.5 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 font-black text-[11px] sm:text-xs md:text-sm tracking-wider uppercase z-10 shadow-md">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
          <span className="whitespace-nowrap font-bold">
            <span className="sm:hidden">{language === 'ta' ? 'முக்கியம்' : 'FLASH'}</span>
            <span className="hidden sm:inline">{language === 'ta' ? 'முக்கிய செய்திகள்' : 'BREAKING NEWS'}</span>
          </span>
          <span className="hidden md:inline-block w-2 h-2 rounded-full bg-white animate-ping"></span>
        </div>

        {/* Scrolling Ticker Rail */}
        <div className="flex-1 overflow-hidden relative py-2">
          <div
            className={`whitespace-nowrap inline-flex items-center gap-8 ${
              isPaused ? '' : 'animate-ticker'
            }`}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
              willChange: 'transform'
            }}
          >
            {displayItems.map((item, idx) => {
              const headline = language === 'ta' ? item.headlineTa : (item.headlineEn || item.headlineTa);
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => {
                    if (item.articleId && onSelectArticleById) {
                      onSelectArticleById(item.articleId);
                    }
                  }}
                  className="inline-flex items-center gap-2 cursor-pointer group hover:text-amber-200 transition-colors text-xs sm:text-sm font-medium"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-300"></span>
                  <span className="group-hover:underline">{headline}</span>
                  {item.articleId && (
                    <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Ticker Pause Indicator */}
        <div className="hidden sm:flex shrink-0 items-center px-3 text-white/80 hover:text-white cursor-pointer">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded hover:bg-black/20 transition-colors"
            title={isPaused ? 'Play Ticker' : 'Pause Ticker'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
