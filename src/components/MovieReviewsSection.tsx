import React from 'react';
import { Star, Award, Film, ChevronRight } from 'lucide-react';
import { Article } from '../types';

interface MovieReviewsSectionProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  language: 'ta' | 'en';
}

export const MovieReviewsSection: React.FC<MovieReviewsSectionProps> = ({
  articles,
  onSelectArticle,
  language
}) => {
  // Filter movie reviews
  const reviewArticles = articles.filter(
    (a) => a.categoryId === 'reviews' || a.rating !== undefined || a.movieVerdict !== undefined
  );

  if (reviewArticles.length === 0) return null;

  return (
    <section className="mb-10 bg-neutral-900 text-white p-5 sm:p-7 rounded-sm border-t-4 border-[#C8102E]">
      <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg sm:text-xl font-black font-serif-tamil tracking-tight text-white flex items-center gap-2">
            <span>{language === 'ta' ? 'திரை விமர்சனங்கள் (Movie Reviews)' : 'MOVIE REVIEWS'}</span>
          </h2>
        </div>
        <span className="text-xs text-neutral-400">
          {language === 'ta' ? 'நடுநிலையான மதிப்பீடுகள் & ரேட்டிங்ஸ்' : 'Unbiased Ratings & Verdicts'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviewArticles.slice(0, 4).map((review) => {
          const rating = review.rating || 4.0;
          return (
            <div
              key={review.id}
              onClick={() => onSelectArticle(review)}
              className="group cursor-pointer bg-neutral-950 border border-neutral-800 hover:border-neutral-600 rounded-sm overflow-hidden flex flex-col justify-between transition-all"
            >
              <div>
                {/* Poster / Stills */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-black">
                  <img
                    src={review.featuredImage}
                    alt={review.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Star Rating Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-1 bg-black/85 text-amber-300 rounded font-black text-xs flex items-center gap-1 border border-amber-400/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono">{rating.toFixed(1)} / 5</span>
                  </div>

                  {review.movieVerdict && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#C8102E] text-white text-[10px] font-bold uppercase rounded-xs">
                      {review.movieVerdict}
                    </div>
                  )}
                </div>

                {/* Review Details */}
                <div className="p-3.5">
                  <h3 className="text-xs sm:text-sm font-bold font-serif-tamil text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-2">
                    {language === 'ta' ? review.title : (review.titleEn || review.title)}
                  </h3>

                  {(review.director || review.cast) && (
                    <div className="text-[11px] text-neutral-400 space-y-0.5 mb-2 border-l-2 border-neutral-700 pl-2">
                      {review.director && <div>இயக்கம்: <strong className="text-neutral-200">{review.director}</strong></div>}
                      {review.cast && <div className="truncate">நடிப்பு: {review.cast}</div>}
                    </div>
                  )}

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {review.summary}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:text-amber-300">
                <span>முழு விமர்சனம் வாசிக்க</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
