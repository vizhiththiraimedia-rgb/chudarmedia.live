import React, { useState } from 'react';
import {
  Flame,
  Star,
  Film,
  Calendar,
  ExternalLink,
  Mail,
  CheckCircle,
  Eye,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Article, Advertisement, Category } from '../types';
import { recordAdClick } from '../services/storage';

interface SidebarProps {
  articles: Article[];
  categories: Category[];
  advertisements: Advertisement[];
  onSelectArticle: (article: Article) => void;
  language: 'ta' | 'en';
}

export const Sidebar: React.FC<SidebarProps> = ({
  articles,
  categories,
  advertisements,
  onSelectArticle,
  language
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState<'trending' | 'boxoffice'>('trending');

  // Filter sidebar ad
  const sidebarAd = advertisements.find(
    (a) => a.active && (a.placement === 'home_sidebar' || a.placement === 'home_top')
  );

  // Trending articles
  const trendingArticles = [...articles]
    .filter((a) => a.status === 'published')
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  // Upcoming Movies Calendar
  const upcomingMovies = [
    { title: 'தளபதி விஜய் - 69', date: 'தீபாவளி 2026', stars: 'விஜய், பூஜா ஹெக்டே', lang: 'தமிழ்' },
    { title: 'கூலி (Coolie)', date: 'மே 2026', stars: 'ரஜினிகாந்த், நாகார்ஜுனா', lang: 'தமிழ்/பான்-இந்தியா' },
    { title: 'கங்குவா 2', date: 'ஆகஸ்ட் 2026', stars: 'சூர்யா, பாபி தியோல்', lang: 'தமிழ்/ஹிந்தி' },
    { title: 'ஈழத்து மண்', date: 'டிசம்பர் 2026', stars: 'கஜன், நிர்மலா', lang: 'இலங்கை சினிமா' }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => setNewsletterEmail(''), 3000);
    }
  };

  const handleAdClick = (ad: Advertisement) => {
    recordAdClick(ad.id);
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? (language === 'ta' ? cat.nameTa : cat.nameEn) : 'சினிமா';
  };

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-5 min-w-0 max-w-full overflow-hidden">
      {/* 1. Movie Poster Banner Ads (Small boxes for movie promos) */}
      {sidebarAd && (
        <div className="ad-banner bg-white border border-neutral-200 rounded-sm p-2 text-center shadow-xs">
          <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold mb-1">
            திரைப்பட விளம்பரம் (SPONSORED)
          </div>
          <div
            onClick={() => handleAdClick(sidebarAd)}
            className="cursor-pointer group relative overflow-hidden rounded-xs"
          >
            <img
              src={sidebarAd.imageUrl}
              alt={sidebarAd.title}
              referrerPolicy="no-referrer"
              className="w-full h-44 object-cover rounded-xs group-hover:opacity-95 transition-opacity"
            />
            <div className="p-2 bg-neutral-900 text-white text-left">
              <h5 className="text-xs font-bold group-hover:text-amber-300 line-clamp-1">
                {sidebarAd.title}
              </h5>
              <p className="text-[10px] text-neutral-400 flex items-center justify-between mt-1">
                <span>{sidebarAd.clientName}</span>
                <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                  முன்பதிவு <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Most Read / Box Office Tabbed Widget */}
      <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-xs">
        <div className="flex border-b border-neutral-200 bg-neutral-50">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-colors cursor-pointer ${
              activeTab === 'trending'
                ? 'bg-white text-[#C8102E] border-b-2 border-[#C8102E]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {language === 'ta' ? 'பிரபலமானவை' : 'TRENDING'}
          </button>
          <button
            onClick={() => setActiveTab('boxoffice')}
            className={`flex-1 py-2.5 text-xs font-bold text-center transition-colors cursor-pointer ${
              activeTab === 'boxoffice'
                ? 'bg-white text-[#C8102E] border-b-2 border-[#C8102E]'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {language === 'ta' ? 'பாக்ஸ் ஆபீஸ்' : 'BOX OFFICE'}
          </button>
        </div>

        {activeTab === 'trending' ? (
          <div className="divide-y divide-neutral-100 p-2">
            {trendingArticles.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => onSelectArticle(item)}
                className="p-2 hover:bg-neutral-50 transition-colors cursor-pointer flex gap-2.5 group"
              >
                <span className="font-mono text-xl font-black text-neutral-300 group-hover:text-[#C8102E] transition-colors leading-none pt-1">
                  0{idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[#C8102E] uppercase mb-0.5">
                    {getCategoryName(item.categoryId)}
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-800 group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug">
                    {language === 'ta' ? item.title : (item.titleEn || item.title)}
                  </h4>
                  <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1 font-mono">
                    <Eye className="w-3 h-3" />
                    {item.viewCount?.toLocaleString() || '1,200'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 divide-y divide-neutral-100 text-xs">
            <div className="py-2">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>1. விடாமுயற்சி (அஜித் குமார்)</span>
                <span className="text-[#C8102E] font-mono">₹280 கோடி</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">உலகளவில் ஆல்-டைம் பிளாக்பஸ்டர்</div>
            </div>
            <div className="py-2">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>2. வேட்டையன் (ரஜினிகாந்த்)</span>
                <span className="text-[#C8102E] font-mono">₹245 கோடி</span>
              </div>
              <div className="text-[10px] text-neutral-500">சூப்பர் ஹிட்</div>
            </div>
            <div className="py-2">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>3. அவதார் 3 (ஹாலிவுட்)</span>
                <span className="text-[#C8102E] font-mono">$850M</span>
              </div>
              <div className="text-[10px] text-neutral-500">குளோபல் ரெக்கார்ட்</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Upcoming Movies Calendar Widget */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-neutral-200">
          <Calendar className="w-4 h-4 text-[#C8102E]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            {language === 'ta' ? 'எதிர்வரும் திரைப்படங்கள் (Releases)' : 'UPCOMING RELEASES'}
          </h4>
        </div>

        <div className="space-y-2.5">
          {upcomingMovies.map((movie, i) => (
            <div key={i} className="p-2 bg-white rounded border border-neutral-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900">{movie.title}</span>
                <span className="text-[10px] font-bold text-[#C8102E] bg-red-50 px-1.5 py-0.5 rounded">
                  {movie.date}
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">{movie.stars}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Newsletter Subscription Box */}
      <div className="bg-[#111111] text-white border border-neutral-800 rounded-sm p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <Mail className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {language === 'ta' ? 'சுடர் சினிமா அப்டேட்ஸ்' : 'DAILY CINEMA BRIEFING'}
          </h4>
        </div>
        <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
          {language === 'ta'
            ? 'கோலிவுட், இலங்கை சினிமா மற்றும் உலக சினிமா முக்கிய செய்திகள் உங்கள் இன்பாக்ஸில்.'
            : 'Get daily verified cinema news, trailer drops and reviews.'}
        </p>

        {newsletterSubscribed ? (
          <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>பதிவு செய்யப்பட்டது! நன்றி.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="உங்கள் மின்னஞ்சல்..."
              className="w-full px-3 py-1.5 text-xs border border-neutral-700 rounded bg-neutral-900 text-white focus:outline-none focus:border-[#C8102E]"
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded transition-colors cursor-pointer"
            >
              இணையுங்கள் (SUBSCRIBE)
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};
