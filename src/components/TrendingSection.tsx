import React from 'react';
import { TrendingUp, Flame, Eye } from 'lucide-react';
import { Article, Category } from '../types';

interface TrendingSectionProps {
  articles: Article[];
  categories: Category[];
  onSelectArticle: (article: Article) => void;
  language: 'ta' | 'en';
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({
  articles,
  categories,
  onSelectArticle,
  language
}) => {
  // Sort articles by viewCount or isTrending
  const trendingArticles = [...articles]
    .filter((a) => a.status === 'published')
    .sort((a, b) => {
      if (a.isTrending && !b.isTrending) return -1;
      if (!a.isTrending && b.isTrending) return 1;
      return (b.viewCount || 0) - (a.viewCount || 0);
    })
    .slice(0, 5);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? (language === 'ta' ? cat.nameTa : cat.nameEn) : '';
  };

  return (
    <section className="mb-10 bg-neutral-50 p-4 sm:p-6 rounded border border-neutral-200 w-full min-w-0 max-w-full overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-200 w-full min-w-0 max-w-full flex-wrap gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <TrendingUp className="w-5 h-5 text-[#C8102E] shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold font-serif-tamil tracking-tight text-[#111111] truncate">
            {language === 'ta' ? 'பிரபலமான சினிமா செய்திகள் & வைரல்' : 'TRENDING & VIRAL CINEMA'}
          </h2>
        </div>
        <span className="text-xs text-neutral-400 font-medium">
          {language === 'ta' ? 'கடந்த 24 மணி நேரம்' : 'Past 24 Hours'}
        </span>
      </div>

      {/* 5-Column Grid with Ranking Indices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full min-w-0 max-w-full">
        {trendingArticles.map((article, idx) => {
          const rank = `0${idx + 1}`;
          return (
            <article
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer bg-white p-4 rounded-sm border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Ranking Digit & Category */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-2xl font-black text-neutral-300 group-hover:text-[#C8102E] transition-colors">
                    {rank}
                  </span>
                  <span className="text-[11px] font-bold text-[#C8102E] uppercase">
                    {getCategoryName(article.categoryId)}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-xs sm:text-sm font-bold font-serif-tamil text-[#111111] group-hover:text-[#C8102E] transition-colors leading-snug line-clamp-3 mb-3">
                  {language === 'ta' ? article.title : (article.titleEn || article.title)}
                </h3>
              </div>

              {/* View count & location metadata */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="truncate max-w-[100px]">{article.location}</span>
                <span className="flex items-center gap-1 font-mono">
                  <Eye className="w-3 h-3" />
                  {article.viewCount?.toLocaleString() || '1,000'}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
