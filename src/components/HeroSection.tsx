import React, { useState } from 'react';
import { Clock, Eye, ArrowRight, ChevronLeft, ChevronRight, Star, Film, Flame } from 'lucide-react';
import { Article, Category } from '../types';

interface HeroSectionProps {
  articles: Article[];
  categories: Category[];
  onSelectArticle: (article: Article) => void;
  language: 'ta' | 'en';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  articles,
  categories,
  onSelectArticle,
  language
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Top featured cinema stories for the slider
  const featuredArticles = articles.filter(
    (a) => a.status === 'published' && (a.isFeatured || a.editorPick)
  );

  const sliderStories = featuredArticles.slice(0, 4);
  const currentStory = sliderStories[activeSlideIndex] || articles[0];

  // 3 Companion stories beside the slider
  const companionStories = articles
    .filter((a) => a.id !== currentStory?.id && a.status === 'published')
    .slice(0, 3);

  if (!currentStory) {
    return null;
  }

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return language === 'ta' ? 'சினிமா' : 'Cinema';
    return language === 'ta' ? cat.nameTa : cat.nameEn;
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlideIndex((prev) => (prev + 1) % sliderStories.length);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlideIndex((prev) => (prev - 1 + sliderStories.length) % sliderStories.length);
  };

  return (
    <section className="mb-8">
      {/* Cinema Section Bar */}
      <div className="flex items-center justify-between pb-2 mb-4 border-b-2 border-neutral-900">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-5 bg-[#C8102E] inline-block"></span>
          <h2 className="text-lg sm:text-xl font-black font-serif-tamil tracking-tight text-[#111111] flex items-center gap-2">
            <Film className="w-5 h-5 text-[#C8102E]" />
            <span>{language === 'ta' ? 'முதன்மைத் திரைச் செய்திகள்' : 'FEATURED CINEMA SPOTLIGHT'}</span>
          </h2>
        </div>
        <div className="text-xs text-neutral-500 font-medium hidden sm:block">
          {language === 'ta' ? 'கோலிவுட் · ஈழத்து சினிமா · ஹாலிவுட்' : 'Kollywood · Eelam · Hollywood'}
        </div>
      </div>

      {/* Grid: 8 Cols (Compact Slider) + 4 Cols (Companion Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Left Slider (8 Cols) - Compact & Sized Appropriately */}
        <div
          onClick={() => onSelectArticle(currentStory)}
          className="lg:col-span-8 group cursor-pointer flex flex-col bg-white border border-neutral-200 hover:border-neutral-300 transition-all rounded-xs overflow-hidden shadow-xs relative"
        >
          {/* Main Visual Asset with Compact Aspect Ratio */}
          <div className="relative aspect-16/9 w-full max-h-[360px] overflow-hidden bg-neutral-950">
            <img
              src={currentStory.featuredImage}
              alt={currentStory.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            {/* Badges on image */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#C8102E] text-white text-[11px] font-bold uppercase tracking-wider rounded-xs shadow-md">
                {getCategoryName(currentStory.categoryId)}
              </span>
              {currentStory.rating && (
                <span className="px-2 py-0.5 bg-amber-400 text-neutral-950 text-[11px] font-black rounded-xs flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{currentStory.rating} / 5</span>
                </span>
              )}
            </div>

            {/* Slider Navigation Arrows */}
            {sliderStories.length > 1 && (
              <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                <button
                  onClick={handlePrevSlide}
                  className="pointer-events-auto w-8 h-8 rounded-full bg-black/60 hover:bg-[#C8102E] text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="pointer-events-auto w-8 h-8 rounded-full bg-black/60 hover:bg-[#C8102E] text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bottom Slider Dots Indicator */}
            {sliderStories.length > 1 && (
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
                {sliderStories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlideIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      activeSlideIndex === idx ? 'w-5 bg-[#C8102E]' : 'bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Title inside bottom image for cinema punch */}
            <div className="absolute bottom-3 left-4 right-16">
              <h1 className="text-base sm:text-lg lg:text-xl font-extrabold font-serif-tamil text-white leading-snug line-clamp-2 drop-shadow-md group-hover:text-amber-300 transition-colors">
                {language === 'ta' ? currentStory.title : (currentStory.titleEn || currentStory.title)}
              </h1>
            </div>
          </div>

          {/* Story Body Footer */}
          <div className="p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-2">
              <span className="font-bold text-[#C8102E]">{currentStory.authorName}</span>
              <span aria-hidden="true">·</span>
              <span>{currentStory.location}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono">
                <Eye className="w-3 h-3" />
                {currentStory.viewCount?.toLocaleString() || '1,200'}
              </span>
            </div>

            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
              {language === 'ta' ? currentStory.summary : (currentStory.summaryEn || currentStory.summary)}
            </p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-[#C8102E] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {language === 'ta' ? 'முழு செய்தி வாசிக்க' : 'Read Full Story'}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              {currentStory.movieVerdict && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded border border-amber-200">
                  {currentStory.movieVerdict}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Companion Stories (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="bg-neutral-900 text-white px-3.5 py-2 rounded-xs flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#C8102E]" />
              {language === 'ta' ? 'அண்மைச் செய்திகள்' : 'LATEST CINEMA FEEDS'}
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">Live</span>
          </div>

          {companionStories.map((story) => (
            <article
              key={story.id}
              onClick={() => onSelectArticle(story)}
              className="group cursor-pointer p-3 bg-white border border-neutral-200 hover:border-neutral-300 transition-all rounded-xs flex gap-3 items-center"
            >
              <div className="relative w-24 h-18 shrink-0 overflow-hidden rounded-xs bg-neutral-900">
                <img
                  src={story.featuredImage}
                  alt={story.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-0.5">
                  <span className="font-bold text-[#C8102E] uppercase">
                    {getCategoryName(story.categoryId)}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{story.viewCount?.toLocaleString()}</span>
                </div>

                <h4 className="text-xs font-bold font-serif-tamil text-neutral-900 group-hover:text-[#C8102E] transition-colors leading-snug line-clamp-2">
                  {language === 'ta' ? story.title : (story.titleEn || story.title)}
                </h4>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
