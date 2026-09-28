import React, { useState } from 'react';
import { Clock, Eye, ChevronRight, Filter } from 'lucide-react';
import { Article, Category } from '../types';

interface LatestNewsSectionProps {
  articles: Article[];
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (catId: string) => void;
  onSelectArticle: (article: Article) => void;
  language: 'ta' | 'en';
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({
  articles,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onSelectArticle,
  language
}) => {
  const [displayCount, setDisplayCount] = useState<number>(6);

  // Filter articles
  const filteredArticles = articles.filter((a) => {
    if (a.status !== 'published') return false;
    if (selectedCategoryId === 'all' || selectedCategoryId === '') return true;
    return a.categoryId === selectedCategoryId;
  });

  // Sort newest first
  const sortedArticles = [...filteredArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const visibleArticles = sortedArticles.slice(0, displayCount);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? (language === 'ta' ? cat.nameTa : cat.nameEn) : '';
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="flex-1">
      {/* Section Header & Interactive Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-6 border-b-2 border-neutral-900">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-6 bg-[#C8102E] inline-block"></span>
          <h2 className="text-xl sm:text-2xl font-black font-serif-tamil tracking-tight text-[#111111]">
            {language === 'ta' ? 'சமீபத்திய சினிமா செய்திகள்' : 'LATEST CINEMA STORIES'}
          </h2>
          <span className="text-xs font-mono text-neutral-400">
            ({filteredArticles.length})
          </span>
        </div>

        {/* Filter Pills (Interactive button elements per Frontend Design rules) */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {categories.slice(0, 6).map((cat) => {
            const isActive = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {language === 'ta' ? cat.nameTa : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid (2 columns on tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="group cursor-pointer bg-white border border-neutral-200 hover:border-neutral-300 transition-all rounded-sm flex flex-col overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-900">
              <img
                src={article.featuredImage}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
              />
              <div className="absolute bottom-2.5 left-3">
                <span className="px-2 py-0.5 bg-[#C8102E] text-white text-[11px] font-bold uppercase rounded-xs shadow-xs">
                  {getCategoryName(article.categoryId)}
                </span>
              </div>
            </div>

            {/* Article Info */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                {/* Clean unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                  <span className="font-semibold text-neutral-700">{article.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    {formatTimestamp(article.publishedAt)}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-base sm:text-lg font-bold font-serif-tamil text-[#111111] group-hover:text-[#C8102E] transition-colors leading-snug line-clamp-2 mb-2">
                  {language === 'ta' ? article.title : (article.titleEn || article.title)}
                </h3>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                  {language === 'ta' ? article.summary : (article.summaryEn || article.summary)}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <span className="text-[#C8102E] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {language === 'ta' ? 'வாசிக்க' : 'Read'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-neutral-400 flex items-center gap-1 font-mono text-[11px]">
                  <Eye className="w-3 h-3" />
                  {article.viewCount?.toLocaleString() || '850'}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {visibleArticles.length === 0 && (
        <div className="text-center py-12 bg-neutral-50 rounded border border-neutral-200">
          <p className="text-neutral-600 font-medium">
            {language === 'ta'
              ? 'இந்த பிரிவில் தற்சமயம் செய்திகள் இல்லை.'
              : 'No articles currently found in this category.'}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {sortedArticles.length > displayCount && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setDisplayCount((prev) => prev + 4)}
            className="px-6 py-2.5 bg-neutral-900 hover:bg-[#C8102E] text-white text-xs sm:text-sm font-bold tracking-wide rounded-sm transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>{language === 'ta' ? 'மேலும் செய்திகளை ஏற்றுக' : 'LOAD MORE STORIES'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
