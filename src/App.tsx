/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  initializeStore,
  subscribeToStore,
  getArticles,
  getCategories,
  getBreakingNews,
  getUsers,
  getCurrentUser,
  setCurrentUser as setStoredCurrentUser,
  getAdvertisements,
  getRssSources,
  getImportedStories,
  getLiveStreamConfig,
  getSiteSettings,
  getMediaItems,
  getVideoTrailers
} from './services/storage';

import {
  Article,
  Category,
  BreakingNews,
  User,
  Advertisement,
  RssSource,
  ImportedStory,
  LiveStreamConfig,
  SiteSettings,
  MediaItem,
  VideoTrailer
} from './types';

import { Header } from './components/Header';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { HeroSection } from './components/HeroSection';
import { MovieReviewsSection } from './components/MovieReviewsSection';
import { TrendingSection } from './components/TrendingSection';
import { LatestNewsSection } from './components/LatestNewsSection';
import { Sidebar } from './components/Sidebar';
import { SpecialSections } from './components/SpecialSections';
import { Footer } from './components/Footer';
import { ArticleView } from './components/ArticleView';
import { LiveTvView } from './components/LiveTvView';
import { SearchModal } from './components/SearchModal';
import { StaticPages } from './components/StaticPages';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SEOHead } from './components/SEOHead';
import { MobileBottomNav } from './components/MobileBottomNav';

type ViewMode = 'home' | 'article' | 'livetv' | 'admin' | 'static';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  // Core Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [rssSources, setRssSources] = useState<RssSource[]>([]);
  const [importedStories, setImportedStories] = useState<ImportedStory[]>([]);
  const [liveStreamConfig, setLiveStreamConfig] = useState<LiveStreamConfig | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [videoTrailers, setVideoTrailers] = useState<VideoTrailer[]>([]);

  // Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [staticPageType, setStaticPageType] = useState<
    'about' | 'editorial-policy' | 'advertise' | 'contact' | 'privacy' | 'terms'
  >('about');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [language, setLanguage] = useState<'ta' | 'en'>('ta');

  // Load state from reactive storage
  const loadData = () => {
    setArticles(getArticles());
    setCategories(getCategories());
    setBreakingNews(getBreakingNews());
    setUsers(getUsers());
    setCurrentUser(getCurrentUser());
    setAdvertisements(getAdvertisements());
    setRssSources(getRssSources());
    setImportedStories(getImportedStories());
    setLiveStreamConfig(getLiveStreamConfig());
    setSiteSettings(getSiteSettings());
    setMediaItems(getMediaItems());
    setVideoTrailers(getVideoTrailers());
  };

  // Parse URL and navigate to the requested post, category, or view
  const syncRouteFromUrl = (articlesList?: Article[]) => {
    const list = articlesList || getArticles();
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const pathname = window.location.pathname;

    // 1. Check article parameter: ?article=... or ?id=... or ?p=... or #article=...
    let articleId =
      searchParams.get('article') ||
      searchParams.get('id') ||
      searchParams.get('post') ||
      searchParams.get('p');

    if (!articleId && hash.startsWith('#article=')) {
      articleId = hash.replace('#article=', '');
    } else if (!articleId && hash.startsWith('#/article/')) {
      articleId = hash.replace('#/article/', '');
    } else if (!articleId && pathname.includes('/article/')) {
      const parts = pathname.split('/article/');
      if (parts[1]) articleId = parts[1].split('/')[0];
    }

    if (articleId && list.length > 0) {
      const matched = list.find((a) => a.id === articleId || a.slug === articleId);
      if (matched) {
        setCurrentArticle(matched);
        setViewMode('article');
        return;
      }
    }

    // 2. Check Live TV
    if (searchParams.get('view') === 'livetv' || hash === '#livetv') {
      setViewMode('livetv');
      setCurrentArticle(null);
      return;
    }

    // 3. Check Admin
    if (searchParams.get('admin') === 'true' || hash === '#admin') {
      setViewMode('admin');
      return;
    }

    // 4. Check Static page
    const pageParam = searchParams.get('page');
    if (pageParam && ['about', 'editorial-policy', 'advertise', 'contact', 'privacy', 'terms'].includes(pageParam)) {
      setStaticPageType(pageParam as any);
      setViewMode('static');
      setCurrentArticle(null);
      return;
    }

    // 5. Check Category
    const catId = searchParams.get('category') || searchParams.get('cat');
    if (catId) {
      setActiveCategoryId(catId);
      setViewMode('home');
      setCurrentArticle(null);
      return;
    }

    // Default to home if nothing specified
    if (!articleId) {
      setViewMode('home');
      setCurrentArticle(null);
    }
  };

  useEffect(() => {
    initializeStore();
    const initialArticles = getArticles();
    loadData();
    setIsReady(true);

    // Initial URL sync for shared links
    syncRouteFromUrl(initialArticles);

    // Check if URL has ?admin=login or hash
    const query = window.location.search;
    const hash = window.location.hash;
    if (query.includes('admin=login') || query.includes('login=true') || hash === '#login') {
      setIsAdminLoginOpen(true);
    }

    // Handle browser Back / Forward buttons
    const handlePopState = () => {
      syncRouteFromUrl();
    };
    window.addEventListener('popstate', handlePopState);

    // Secret Keyboard Shortcut: Ctrl + Shift + A (or Cmd + Shift + A on Mac)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminLoginOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const unsubscribe = subscribeToStore(() => {
      loadData();
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribe();
    };
  }, []);

  if (!isReady || !currentUser || !siteSettings || !liveStreamConfig) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-neutral-800 tracking-wider">
            CHUDAR MEDIA | சுடர் மீடியா லோடிங் ஆகிறது...
          </span>
        </div>
      </div>
    );
  }

  // Navigation Actions with URL Update for Sharable Links
  const handleSelectArticle = (article: Article, pushHistory: boolean = true) => {
    setCurrentArticle(article);
    setViewMode('article');
    if (pushHistory) {
      const url = new URL(window.location.href);
      url.searchParams.set('article', article.id);
      url.searchParams.delete('category');
      url.searchParams.delete('view');
      url.searchParams.delete('page');
      window.history.pushState({ view: 'article', articleId: article.id }, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticleById = (articleId: string, pushHistory: boolean = true) => {
    const art = articles.find((a) => a.id === articleId) || getArticles().find((a) => a.id === articleId);
    if (art) {
      handleSelectArticle(art, pushHistory);
    }
  };

  const handleSelectCategory = (catId: string, pushHistory: boolean = true) => {
    setActiveCategoryId(catId);
    setViewMode('home');
    setCurrentArticle(null);
    if (pushHistory) {
      const url = new URL(window.location.href);
      url.searchParams.delete('article');
      url.searchParams.delete('id');
      url.searchParams.delete('view');
      url.searchParams.delete('page');
      if (catId === 'all') {
        url.searchParams.delete('category');
        window.history.pushState({ view: 'home', categoryId: 'all' }, '', url.pathname);
      } else {
        url.searchParams.set('category', catId);
        window.history.pushState({ view: 'home', categoryId: catId }, '', url.toString());
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = (pushHistory: boolean = true) => {
    setViewMode('home');
    setActiveCategoryId('all');
    setCurrentArticle(null);
    if (pushHistory) {
      const url = new URL(window.location.href);
      url.searchParams.delete('article');
      url.searchParams.delete('id');
      url.searchParams.delete('category');
      url.searchParams.delete('view');
      url.searchParams.delete('page');
      window.history.pushState({ view: 'home' }, '', url.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLiveTv = (pushHistory: boolean = true) => {
    setViewMode('livetv');
    setCurrentArticle(null);
    if (pushHistory) {
      const url = new URL(window.location.href);
      url.searchParams.delete('article');
      url.searchParams.delete('category');
      url.searchParams.delete('page');
      url.searchParams.set('view', 'livetv');
      window.history.pushState({ view: 'livetv' }, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: User) => {
    setStoredCurrentUser(user);
    setCurrentUser(user);
    setViewMode('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setViewMode('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStaticPage = (
    page: 'about' | 'editorial-policy' | 'advertise' | 'contact' | 'privacy' | 'terms',
    pushHistory: boolean = true
  ) => {
    setStaticPageType(page);
    setViewMode('static');
    setCurrentArticle(null);
    if (pushHistory) {
      const url = new URL(window.location.href);
      url.searchParams.delete('article');
      url.searchParams.delete('category');
      url.searchParams.delete('view');
      url.searchParams.set('page', page);
      window.history.pushState({ view: 'static', page }, '', url.toString());
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'ta' ? 'en' : 'ta'));
  };

  const currentCategory = categories.find((c) => c.id === activeCategoryId);
  const topAd = advertisements.find((a) => a.active && a.placement === 'home_top');

  return (
    <div className={`min-h-screen flex flex-col bg-white text-[#202124] w-full max-w-full min-w-0 overflow-x-hidden ${viewMode !== 'admin' ? 'pb-16 md:pb-0' : ''}`}>
      {/* SEO & Structured Data Controller */}
      <SEOHead
        currentArticle={currentArticle || undefined}
        currentCategory={currentCategory}
        siteSettings={siteSettings}
        pageType={viewMode}
        staticPageTitle={viewMode === 'static' ? staticPageType.toUpperCase() : undefined}
        language={language}
      />

      {/* Admin Dashboard view */}
      {viewMode === 'admin' ? (
        <AdminDashboard
          articles={articles}
          categories={categories}
          breakingNews={breakingNews}
          users={users}
          currentUser={currentUser}
          advertisements={advertisements}
          rssSources={rssSources}
          importedStories={importedStories}
          liveStreamConfig={liveStreamConfig}
          siteSettings={siteSettings}
          mediaItems={mediaItems}
          videoTrailers={videoTrailers}
          onGoHome={handleGoHome}
          onLogout={handleLogout}
          language={language}
        />
      ) : (
        <>
          {/* Main Header */}
          <Header
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleSelectCategory}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenLiveTv={handleOpenLiveTv}
            onGoHome={handleGoHome}
            siteSettings={siteSettings}
            language={language}
            onToggleLanguage={handleToggleLanguage}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
          />

          {/* Breaking News Ticker */}
          <BreakingNewsTicker
            breakingItems={breakingNews}
            onSelectArticleById={handleSelectArticleById}
            language={language}
          />

          {/* Top Leaderboard Movie Banner */}
          {topAd && viewMode === 'home' && (
            <div className="ad-banner max-w-7xl mx-auto px-3.5 sm:px-6 pt-4 pb-2 w-full min-w-0 max-w-full text-center overflow-hidden">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
                திரைப்பட விளம்பரம் (SPONSORED LEADERBOARD)
              </span>
              <a
                href={topAd.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xs border border-neutral-200 hover:opacity-95 transition-opacity"
              >
                <img
                  src={topAd.imageUrl}
                  alt={topAd.title}
                  referrerPolicy="no-referrer"
                  className="w-full max-h-24 sm:max-h-28 object-cover"
                />
              </a>
            </div>
          )}

          {/* Body Content Router */}
          <main className="flex-1 w-full min-w-0 max-w-full overflow-hidden">
            {viewMode === 'home' && (
              <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 w-full min-w-0 max-w-full overflow-hidden">
                {/* 1. Hero Section (Compact Cinema Slider) */}
                {activeCategoryId === 'all' && (
                  <HeroSection
                    articles={articles}
                    categories={categories}
                    onSelectArticle={handleSelectArticle}
                    language={language}
                  />
                )}

                {/* 2. Movie Reviews Section with Star Ratings (As specifically requested!) */}
                {activeCategoryId === 'all' && (
                  <MovieReviewsSection
                    articles={articles}
                    onSelectArticle={handleSelectArticle}
                    language={language}
                  />
                )}

                {/* 3. Trending Cinema News (Numbered 01 to 05) */}
                {activeCategoryId === 'all' && (
                  <TrendingSection
                    articles={articles}
                    categories={categories}
                    onSelectArticle={handleSelectArticle}
                    language={language}
                  />
                )}

                {/* 4. Main Split Grid: Latest News (Left) + Sidebar (Right with movie boxes) */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full min-w-0 max-w-full overflow-hidden">
                  <LatestNewsSection
                    articles={articles}
                    categories={categories}
                    selectedCategoryId={activeCategoryId}
                    onSelectCategory={handleSelectCategory}
                    onSelectArticle={handleSelectArticle}
                    language={language}
                  />

                  <Sidebar
                    articles={articles}
                    categories={categories}
                    advertisements={advertisements}
                    onSelectArticle={handleSelectArticle}
                    language={language}
                  />
                </div>

                {/* 5. Special Sections (Trailers Showcase & Photo Gallery) */}
                {activeCategoryId === 'all' && (
                  <SpecialSections
                    articles={articles}
                    videoTrailers={videoTrailers}
                    onSelectArticle={handleSelectArticle}
                    language={language}
                  />
                )}
              </div>
            )}

            {/* News Article Reader View */}
            {viewMode === 'article' && currentArticle && (
              <ArticleView
                article={currentArticle}
                allArticles={articles}
                categories={categories}
                advertisements={advertisements}
                onBack={handleGoHome}
                onSelectArticle={handleSelectArticle}
                language={language}
              />
            )}

            {/* Live TV & Video Bulletins View */}
            {viewMode === 'livetv' && (
              <LiveTvView
                config={liveStreamConfig}
                onGoHome={handleGoHome}
                language={language}
              />
            )}

            {/* Static Institutional Pages */}
            {viewMode === 'static' && (
              <StaticPages
                pageType={staticPageType}
                siteSettings={siteSettings}
                onBack={handleGoHome}
                language={language}
              />
            )}
          </main>

          {/* Live Search Modal */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            articles={articles}
            categories={categories}
            onSelectArticle={handleSelectArticle}
            language={language}
          />

          {/* Discreet Admin Login Modal (Accessible from footer Staff Login) */}
          <AdminLoginModal
            isOpen={isAdminLoginOpen}
            onClose={() => setIsAdminLoginOpen(false)}
            users={users}
            onLoginSuccess={handleLoginSuccess}
          />

          {/* Footer */}
          <Footer
            categories={categories}
            siteSettings={siteSettings}
            onSelectCategory={handleSelectCategory}
            onOpenPage={(p) => handleOpenStaticPage(p as any)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            language={language}
          />

          {/* Native App-Style Bottom Navigation for Mobile */}
          <MobileBottomNav
            currentView={viewMode}
            onGoHome={handleGoHome}
            onSelectCinema={() => handleSelectCategory('kollywood')}
            onOpenLiveTv={handleOpenLiveTv}
            onOpenSearch={() => setIsSearchOpen(true)}
            language={language}
            onToggleLanguage={handleToggleLanguage}
          />
        </>
      )}
    </div>
  );
}
