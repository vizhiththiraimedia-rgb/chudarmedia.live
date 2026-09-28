import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, Clock, ChevronRight, Filter } from 'lucide-react';
import { Article, Category } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  categories: Category[];
  onSelectArticle: (article: Article) => void;
  language: 'ta' | 'en';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  categories,
  onSelectArticle,
  language
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const popularSearches = [
    'கொழும்பு துறைமுகம்',
    'தமிழகம் நதிநீர்',
    'ஐ.நா. பிரகடனம்',
    'இஸ்ரோ',
    'கிரிக்கெட் ஆசியக்கிண்ணம்',
    'செயற்கை நுண்ணறிவு'
  ];

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && selectedCategory === 'all') return [];

    return articles.filter((article) => {
      if (article.status !== 'published') return false;

      // Category filter
      if (selectedCategory !== 'all' && article.categoryId !== selectedCategory) {
        return false;
      }

      if (!q) return true;

      // Query matching in Tamil title, English title, subtitle, summary, content, tags, author
      const titleMatch = article.title.toLowerCase().includes(q) || article.titleEn.toLowerCase().includes(q);
      const summaryMatch = article.summary.toLowerCase().includes(q) || article.summaryEn.toLowerCase().includes(q);
      const contentMatch = article.content.toLowerCase().includes(q);
      const authorMatch = article.authorName.toLowerCase().includes(q);
      const tagsMatch = article.tags.some((t) => t.toLowerCase().includes(q));

      return titleMatch || summaryMatch || contentMatch || authorMatch || tagsMatch;
    });
  }, [query, selectedCategory, articles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-10 sm:pt-16 px-4 pb-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#C8102E] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'செய்திகள், தலைப்புகள், கட்டுரைகள், அல்லது ஆசிரியரைத் தேடுக...'
                : 'Search headlines, articles, categories or journalists...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-md text-neutral-600 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter by Category bar */}
        <div className="px-4 py-2.5 bg-white border-b border-neutral-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-neutral-400 font-semibold shrink-0">பிரிவு:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-sm whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#C8102E] text-white font-bold'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            அனைத்தும்
          </button>
          {categories.filter((c) => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-sm whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {language === 'ta' ? cat.nameTa : cat.nameEn}
            </button>
          ))}
        </div>

        {/* Search Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* Query empty suggestions */}
          {!query && selectedCategory === 'all' && (
            <div>
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                {language === 'ta' ? 'அடிக்கடி தேடப்படுபவை' : 'POPULAR SEARCHES'}
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {popularSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-sm text-xs font-medium cursor-pointer transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                {language === 'ta' ? 'சமீபத்திய முக்கிய செய்திகள்' : 'RECENT STORIES'}
              </div>
              <div className="divide-y divide-neutral-100">
                {articles.slice(0, 4).map((art) => (
                  <div
                    key={art.id}
                    onClick={() => {
                      onSelectArticle(art);
                      onClose();
                    }}
                    className="py-2.5 flex items-center justify-between cursor-pointer group hover:bg-neutral-50 px-2 rounded"
                  >
                    <span className="text-xs sm:text-sm font-medium text-neutral-800 group-hover:text-[#C8102E] transition-colors line-clamp-1">
                      {art.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results Display */}
          {(query || selectedCategory !== 'all') && (
            <div>
              <div className="text-xs text-neutral-500 mb-4 flex items-center justify-between">
                <span>
                  முடிவுகள்: <strong>{searchResults.length}</strong> செய்திகள் கண்டறியப்பட்டன
                </span>
                {query && (
                  <span className="text-neutral-400">
                    தேடல்: &quot;{query}&quot;
                  </span>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-sm">
                  {language === 'ta'
                    ? 'பொருத்தமான செய்திகள் எதுவும் கண்டறியப்படவில்லை. வேறு சொற்களைக் கொண்டு தேடவும்.'
                    : 'No matching articles found. Please try different keywords.'}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {searchResults.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => {
                        onSelectArticle(article);
                        onClose();
                      }}
                      className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded border border-neutral-200 cursor-pointer transition-all flex gap-3 items-center group"
                    >
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-14 sm:w-20 sm:h-16 object-cover rounded-xs shrink-0 bg-neutral-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-0.5">
                          <span className="font-bold text-[#C8102E] uppercase">
                            {categories.find((c) => c.id === article.categoryId)?.nameTa || 'செய்திகள்'}
                          </span>
                          <span>·</span>
                          <span>{article.authorName}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#C8102E] line-clamp-1 leading-snug">
                          {article.title}
                        </h4>
                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                          {article.summary}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#C8102E] shrink-0" />
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
