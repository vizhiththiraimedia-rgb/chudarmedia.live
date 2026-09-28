import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Flame,
  Layers,
  Image as ImageIcon,
  Users,
  Globe,
  Tv,
  DollarSign,
  Settings,
  Plus,
  Search,
  CheckCircle,
  CheckCircle2,
  Eye,
  Trash2,
  Edit2,
  ArrowLeft,
  LogOut,
  Star,
  AlertTriangle,
  X,
  Video
} from 'lucide-react';
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
} from '../../types';
import {
  saveArticle,
  deleteArticle,
  saveBreakingNews,
  deleteBreakingNews,
  saveCategory,
  deleteCategory,
  saveUser,
  deleteUser,
  setCurrentUser,
  saveAdvertisement,
  deleteAdvertisement,
  saveRssSource,
  deleteRssSource,
  updateLiveStreamConfig,
  addMediaItem,
  deleteMediaItem,
  updateSiteSettings,
  getVideoTrailers,
  saveVideoTrailer,
  deleteVideoTrailer
} from '../../services/storage';

import { ArticleEditor } from './ArticleEditor';
import { BreakingNewsManager } from './BreakingNewsManager';
import { CategoryManager } from './CategoryManager';
import { MediaLibrary } from './MediaLibrary';
import { UserManager } from './UserManager';
import { RssImporter } from './RssImporter';
import { LiveTvManager } from './LiveTvManager';
import { AdManager } from './AdManager';
import { AnalyticsView } from './AnalyticsView';
import { SettingsManager } from './SettingsManager';
import { TrailerManager } from './TrailerManager';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  breakingNews: BreakingNews[];
  users: User[];
  currentUser: User;
  advertisements: Advertisement[];
  rssSources: RssSource[];
  importedStories: ImportedStory[];
  liveStreamConfig: LiveStreamConfig;
  siteSettings: SiteSettings;
  mediaItems: MediaItem[];
  videoTrailers?: VideoTrailer[];
  onGoHome: () => void;
  onLogout: () => void;
  language: 'ta' | 'en';
}

type TabType =
  | 'overview'
  | 'articles'
  | 'trailers'
  | 'breaking'
  | 'categories'
  | 'media'
  | 'users'
  | 'importer'
  | 'livetv'
  | 'ads'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  breakingNews,
  users,
  currentUser,
  advertisements,
  rssSources,
  importedStories,
  liveStreamConfig,
  siteSettings,
  mediaItems,
  videoTrailers,
  onGoHome,
  onLogout,
  language
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);
  const [articleFilterStatus, setArticleFilterStatus] = useState<string>('all');
  const [articleSearchQuery, setArticleSearchQuery] = useState('');

  // Local articles state for instant optimistic updates
  const [localArticles, setLocalArticles] = useState<Article[]>(articles);
  useEffect(() => {
    setLocalArticles(articles);
  }, [articles]);

  // Local video trailers state
  const [localTrailers, setLocalTrailers] = useState<VideoTrailer[]>(() =>
    videoTrailers && videoTrailers.length > 0 ? videoTrailers : getVideoTrailers()
  );
  useEffect(() => {
    if (videoTrailers && videoTrailers.length > 0) {
      setLocalTrailers(videoTrailers);
    }
  }, [videoTrailers]);

  const handleSaveTrailer = (trailer: VideoTrailer) => {
    saveVideoTrailer(trailer);
    setLocalTrailers((prev) => {
      const idx = prev.findIndex((t) => t.id === trailer.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = trailer;
        return copy;
      }
      return [trailer, ...prev];
    });
  };

  const handleDeleteTrailer = (id: string) => {
    deleteVideoTrailer(id);
    setLocalTrailers((prev) => prev.filter((t) => t.id !== id));
  };

  // In-app Delete Confirmation Modal State (replaces blocked native confirm)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // Toast feedback notification
  const [toastNotification, setToastNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastNotification({ type, message });
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Stats calculation
  const totalArticles = localArticles.length;
  const publishedArticles = localArticles.filter((a) => a.status === 'published').length;
  const draftArticles = localArticles.filter((a) => a.status === 'draft').length;
  const pendingArticles = localArticles.filter((a) => a.status === 'pending_review').length;

  // Start editing article with smooth scroll to top
  const handleStartEditArticle = (article: Article) => {
    setEditingArticle(article);
    setIsCreatingArticle(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save edited or new article
  const handleSaveArticle = (article: Article) => {
    const saved = saveArticle(article);
    setLocalArticles((prev) => {
      const idx = prev.findIndex((a) => a.id === article.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    setEditingArticle(null);
    setIsCreatingArticle(false);
    setActiveTab('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`"${article.title}" செய்தி வெற்றிகரமாக சேமிக்கப்பட்டது! (Saved successfully)`);
  };

  // Execute in-app delete
  const handleDeleteArticleConfirm = () => {
    if (!articleToDelete) return;
    const { id, title } = articleToDelete;

    // Immediately remove from local list
    setLocalArticles((prev) => prev.filter((a) => a.id !== id));
    // Persist to storage
    deleteArticle(id);

    setArticleToDelete(null);
    showToast(`"${title}" செய்தி வெற்றிகரமாக நீக்கப்பட்டது! (Article deleted successfully)`);
  };

  const handleApproveArticle = (article: Article) => {
    const approved = {
      ...article,
      status: 'published' as const,
      publishedAt: new Date().toISOString()
    };
    saveArticle(approved);
    setLocalArticles((prev) =>
      prev.map((a) => (a.id === article.id ? approved : a))
    );
    showToast(`"${article.title}" செய்தி வெளியிடப்பட்டது! (Published)`);
  };

  const filteredArticles = localArticles.filter((a) => {
    if (articleFilterStatus !== 'all' && a.status !== articleFilterStatus) return false;
    if (
      articleSearchQuery &&
      !a.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) &&
      !a.authorName.toLowerCase().includes(articleSearchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      {/* Top Admin Header Bar in English */}
      <header className="bg-neutral-900 text-white px-4 sm:px-6 py-3 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Website</span>
          </button>
          <div className="h-4 w-px bg-neutral-700"></div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]"></span>
            <span className="text-sm font-bold tracking-wide font-display text-white">
              CHUDAR MEDIA CINEMA · ADMIN BACKEND
            </span>
          </div>
        </div>

        {/* Current User & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-neutral-600"
            />
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-semibold text-neutral-200">{currentUser.name}</span>
              <span className="text-[10px] text-amber-400 uppercase font-mono">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
            title="Log out from Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Nav (3 Cols) */}
        <nav className="lg:col-span-3 bg-white border border-neutral-200 rounded-sm p-3 shadow-xs space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            Content Management
          </div>

          <button
            onClick={() => {
              setActiveTab('overview');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'overview' && !isCreatingArticle && !editingArticle
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('articles');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center justify-between cursor-pointer ${
              activeTab === 'articles' || isCreatingArticle || editingArticle
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Cinema Articles</span>
            </div>
            {pendingArticles > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-neutral-900 font-bold">
                {pendingArticles}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('trailers');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center justify-between cursor-pointer ${
              activeTab === 'trailers'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Video className="w-4 h-4" />
              <span>Videos & Trailers (டிரெய்லர்கள்)</span>
            </div>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              activeTab === 'trailers' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-800'
            }`}>
              {localTrailers.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('importer');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'importer'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>URL Scraper & Importer</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('breaking');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'breaking'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Breaking News Ticker</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('media');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'media'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Poster & Media Library</span>
          </button>

          <div className="pt-3 px-3 pb-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-t border-neutral-100">
            Publishing Controls
          </div>

          <button
            onClick={() => {
              setActiveTab('categories');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Cinema Categories</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Staff & Roles (RBAC)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('livetv');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'livetv'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Live TV Broadcast</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ads');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'ads'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Movie Promos & Ads</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              setIsCreatingArticle(false);
              setEditingArticle(null);
            }}
            className={`w-full px-3 py-2.5 rounded text-xs font-bold text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#C8102E] text-white'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Portal Settings & Logo</span>
          </button>
        </nav>

        {/* Content View (9 Cols) */}
        <main className="lg:col-span-9">
          {/* Toast Notification */}
          {toastNotification && (
            <div
              className={`mb-4 p-3.5 rounded text-xs flex items-center justify-between shadow-xs transition-all ${
                toastNotification.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border border-red-300 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold">
                {toastNotification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{toastNotification.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastNotification(null)}
                className="text-neutral-500 hover:text-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isCreatingArticle || editingArticle ? (
            <ArticleEditor
              key={editingArticle ? `edit-${editingArticle.id}` : 'create-new-article'}
              initialArticle={editingArticle}
              categories={categories}
              currentUser={currentUser}
              onSave={handleSaveArticle}
              onCancel={() => {
                setIsCreatingArticle(false);
                setEditingArticle(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : activeTab === 'overview' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded border border-neutral-200">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Welcome, {currentUser.name}!
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Chudar Media Cinema Publishing Dashboard
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingArticle(true)}
                  className="px-4 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Cinema Story</span>
                </button>
              </div>

              <AnalyticsView
                articles={articles}
                categories={categories}
                advertisements={advertisements}
              />
            </div>
          ) : activeTab === 'articles' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-200">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Cinema Articles Management</h2>
                  <p className="text-xs text-neutral-500">Filter, edit, approve and publish entertainment stories</p>
                </div>
                <button
                  onClick={() => setIsCreatingArticle(true)}
                  className="px-4 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Story</span>
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded border border-neutral-200">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto">
                  <button
                    onClick={() => setArticleFilterStatus('all')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                      articleFilterStatus === 'all'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    All ({totalArticles})
                  </button>
                  <button
                    onClick={() => setArticleFilterStatus('published')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                      articleFilterStatus === 'published'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Published ({publishedArticles})
                  </button>
                  <button
                    onClick={() => setArticleFilterStatus('pending_review')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                      articleFilterStatus === 'pending_review'
                        ? 'bg-amber-500 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Pending Review ({pendingArticles})
                  </button>
                  <button
                    onClick={() => setArticleFilterStatus('draft')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                      articleFilterStatus === 'draft'
                        ? 'bg-neutral-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Drafts ({draftArticles})
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    placeholder="Search headlines, journalists..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
                  />
                </div>
              </div>

              {/* Articles Table */}
              <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-xs">
                <div className="divide-y divide-neutral-200">
                  {filteredArticles.map((article) => {
                    const catName = categories.find((c) => c.id === article.categoryId)?.nameEn || 'Cinema';

                    return (
                      <div
                        key={article.id}
                        className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex gap-3 items-start flex-1 min-w-0">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            referrerPolicy="no-referrer"
                            className="w-20 h-16 object-cover rounded shrink-0 bg-neutral-800"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-[#C8102E] uppercase">
                                {catName}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  article.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : article.status === 'pending_review'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-neutral-200 text-neutral-700'
                                }`}
                              >
                                {article.status.replace('_', ' ')}
                              </span>
                              {article.rating && (
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                  <span>{article.rating}★</span>
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug line-clamp-2">
                              {article.title}
                            </h4>

                            <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2">
                              <span>Reporter: <strong>{article.authorName}</strong></span>
                              <span>·</span>
                              <span className="flex items-center gap-1 font-mono">
                                <Eye className="w-3 h-3" />
                                {article.viewCount?.toLocaleString() || 0}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                          {article.status === 'pending_review' && currentUser.role !== 'reporter' && (
                            <button
                              type="button"
                              onClick={() => handleApproveArticle(article)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded cursor-pointer flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEditArticle(article)}
                            className="px-2.5 py-1.5 rounded border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
                            title="செய்தியை திருத்துக (Edit Article)"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setArticleToDelete(article)}
                            className="px-2.5 py-1.5 rounded border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold cursor-pointer flex items-center gap-1 transition-colors shadow-2xs"
                            title="செய்தியை நீக்குக (Delete Article)"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : activeTab === 'trailers' ? (
            <TrailerManager
              trailers={localTrailers}
              onSave={handleSaveTrailer}
              onDelete={handleDeleteTrailer}
            />
          ) : activeTab === 'importer' ? (
            <RssImporter
              sources={rssSources}
              importedStories={importedStories}
              categories={categories}
              currentUser={currentUser}
              onAddSource={saveRssSource}
              onDeleteSource={deleteRssSource}
              onSaveDirectArticle={(art) => {
                saveArticle(art);
                setActiveTab('articles');
              }}
              onEditArticle={(art) => {
                setEditingArticle(art);
                setActiveTab('articles');
              }}
            />
          ) : activeTab === 'breaking' ? (
            <BreakingNewsManager
              breakingItems={breakingNews}
              articles={articles}
              onSave={saveBreakingNews}
              onDelete={deleteBreakingNews}
            />
          ) : activeTab === 'categories' ? (
            <CategoryManager
              categories={categories}
              onSave={saveCategory}
              onDelete={deleteCategory}
            />
          ) : activeTab === 'media' ? (
            <MediaLibrary
              mediaItems={mediaItems}
              onAddMedia={addMediaItem}
              onDeleteMedia={deleteMediaItem}
            />
          ) : activeTab === 'users' ? (
            <UserManager
              users={users}
              currentUser={currentUser}
              onSaveUser={saveUser}
              onDeleteUser={deleteUser}
              onSwitchUser={(user) => {
                setCurrentUser(user);
                window.location.reload();
              }}
            />
          ) : activeTab === 'livetv' ? (
            <LiveTvManager
              config={liveStreamConfig}
              onSave={updateLiveStreamConfig}
            />
          ) : activeTab === 'ads' ? (
            <AdManager
              advertisements={advertisements}
              onSaveAd={saveAdvertisement}
              onDeleteAd={deleteAdvertisement}
            />
          ) : activeTab === 'settings' ? (
            <SettingsManager
              settings={siteSettings}
              onSaveSettings={updateSiteSettings}
            />
          ) : null}
        </main>
      </div>

      {/* In-App Delete Article Confirmation Modal (Zero blocked browser confirm dialogs) */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border-2 border-red-500 rounded-sm shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center gap-3 text-red-600 pb-2 border-b border-neutral-200">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  செய்தியை நீக்க உறுதிப்படுத்தவும் (Confirm Delete)
                </h3>
                <span className="text-[11px] text-neutral-500 font-mono">
                  ID: {articleToDelete.id}
                </span>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-neutral-50 p-3 rounded border border-neutral-200">
              {articleToDelete.featuredImage && (
                <img
                  src={articleToDelete.featuredImage}
                  alt={articleToDelete.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-12 object-cover rounded shrink-0 bg-neutral-800"
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug">
                  {articleToDelete.title}
                </h4>
                <div className="text-[10px] text-neutral-500 mt-1 flex items-center gap-2">
                  <span>செய்தியாளர்: {articleToDelete.authorName}</span>
                  <span>·</span>
                  <span className="uppercase font-bold text-[#C8102E]">{articleToDelete.categoryId}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-700 leading-relaxed">
              இந்த சினிமா கட்டுரையை நிச்சயமாக நீக்க விரும்புகிறீர்களா? நீக்கிய பிறகு இதை மீட்டெடுக்க முடியாது.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                ரத்து (Cancel)
              </button>
              <button
                type="button"
                onClick={handleDeleteArticleConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ஆம், நீக்குக (Yes, Delete Article)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
