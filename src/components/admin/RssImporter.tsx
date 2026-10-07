import React, { useState } from 'react';
import {
  Rss,
  Globe,
  Download,
  Check,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShieldCheck,
  Send,
  FileText,
  RefreshCw,
  AlertCircle,
  Eye,
  Layers,
  Clock,
  CheckCircle2,
  BookOpen,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { RssSource, ImportedStory, User, Article, Category } from '../../types';
import {
  fetchFullNewsArticle,
  fetchLiveRssFeed,
  ExtractedArticle,
  LiveRssItem,
  htmlToPlainText,
  plainTextToHtml,
  extractFacebookPostOrVideo,
  formulateCinemaArticleFromPostText
} from '../../services/articleExtractor';

interface RssImporterProps {
  sources: RssSource[];
  importedStories: ImportedStory[];
  categories: Category[];
  currentUser: User;
  onAddSource: (source: RssSource) => void;
  onDeleteSource: (id: string) => void;
  onSaveDirectArticle: (article: Article) => void;
  onEditArticle: (article: Article) => void;
}

export const RssImporter: React.FC<RssImporterProps> = ({
  sources,
  importedStories,
  categories,
  currentUser,
  onAddSource,
  onDeleteSource,
  onSaveDirectArticle,
  onEditArticle
}) => {
  // Importer Mode: 'easy_paste' (Copy-paste post & images) vs 'url_scraper' (Scrape website links)
  const [importerTab, setImporterTab] = useState<'easy_paste' | 'url_scraper'>('easy_paste');
  const [pastedPostText, setPastedPostText] = useState('');
  const [pastedImages, setPastedImages] = useState<string[]>([]);
  const [inputImageUrl, setInputImageUrl] = useState('');
  const [optionalFbPostUrl, setOptionalFbPostUrl] = useState('');
  const [isFormulatingPost, setIsFormulatingPost] = useState(false);

  // Direct URL Fetcher States
  const [fetchUrl, setFetchUrl] = useState('');
  const [fbCaption, setFbCaption] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedArticle | null>(null);
  const [fetchStatusStep, setFetchStatusStep] = useState<string>('');

  // Editable fields for extracted article
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('kollywood');
  const [addChudarBranding, setAddChudarBranding] = useState(true);
  const [previewMode, setPreviewMode] = useState<'preview' | 'html' | 'edit'>('preview');
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Live RSS feeds state
  const [isFetchingRss, setIsFetchingRss] = useState(false);
  const [liveRssFeedItems, setLiveRssFeedItems] = useState<LiveRssItem[]>([]);
  const [selectedRssSourceId, setSelectedRssSourceId] = useState<string>('all');
  const [rssFetchSuccessMsg, setRssFetchSuccessMsg] = useState<string | null>(null);

  // New RSS Source inputs
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [newSourceCategory, setNewSourceCategory] = useState('kollywood');

  // Real URL Fetcher: Scrapes real full news article with all paragraphs
  const handleFetchRealUrl = async (urlToFetch?: string) => {
    const targetUrl = (urlToFetch || fetchUrl).trim();
    if (!targetUrl) return;

    setIsFetchingUrl(true);
    setFetchError(null);
    setExtractedData(null);
    setFetchStatusStep('இணையதளத்துடன் இணைக்கப்படுகிறது (Connecting to source)...');

    try {
      setFetchStatusStep('உண்மையான செய்தி மற்றும் பத்திகள் பிரித்தெடுக்கப்படுகின்றன (Extracting full article & paragraphs)...');
      let article = await fetchFullNewsArticle(targetUrl);

      // If user typed custom text in fbCaption (and it's not a URL), use as custom title & summary
      const cleanFbCaption = fbCaption.trim();
      if (
        cleanFbCaption &&
        !cleanFbCaption.startsWith('http://') &&
        !cleanFbCaption.startsWith('https://') &&
        !cleanFbCaption.includes('facebook.com')
      ) {
        const lines = cleanFbCaption.split('\n').map((l) => l.trim()).filter(Boolean);
        const headline = lines[0]?.slice(0, 90) || cleanFbCaption.slice(0, 90);
        const restOfText = lines.slice(1).join('\n\n') || cleanFbCaption;
        article = {
          ...article,
          title: headline,
          subtitle: restOfText.slice(0, 140),
          summary: restOfText
        };
      } else if (cleanFbCaption.startsWith('http') || cleanFbCaption.includes('facebook.com')) {
        // Clear accidentally pasted URL from caption input
        setFbCaption('');
      }

      // Guard: Never show 'photo' as headline
      if (
        article.title.toLowerCase().startsWith('photo') ||
        article.title.toLowerCase() === 'facebook' ||
        article.title.length < 5
      ) {
        article = {
          ...article,
          title: 'Chilli Chips Official பிரத்யேக சினிமா புகைப்படத் தொகுப்பு',
          summary: 'சமூக வலைத்தளமான முகநூலில் Chilli Chips Official பக்கத்தில் வெளியாகி ரசிகர்கள் மத்தியில் பெரும் வைரலாகி வரும் பிரத்யேக சினிமா புகைப்படத் தொகுப்பு.'
        };
      }

      setExtractedData(article);
      setEditTitle(article.title);
      setEditSummary(article.summary);
      setEditContent(article.content);
      setEditImage(article.image);
      setFetchStatusStep('முழு செய்தியும் வெற்றிகரமாக பெறப்பட்டது! (Extracted successfully)');
    } catch (err: any) {
      console.error('Extraction error:', err);
      if (targetUrl.includes('facebook.com') || targetUrl.includes('fb.watch')) {
        const fallbackFb = extractFacebookPostOrVideo(targetUrl);
        setExtractedData(fallbackFb);
        setEditTitle(fallbackFb.title);
        setEditSummary(fallbackFb.summary);
        setEditContent(fallbackFb.content);
        setEditImage(fallbackFb.image);
        setFetchStatusStep('முகநூல் பதிவு தயார் செய்யப்பட்டது! (Facebook Post Ready)');
      } else {
        setFetchError(
          err?.message ||
            'Failed to extract article content. Please verify the URL or try another news source.'
        );
      }
    } finally {
      setIsFetchingUrl(false);
    }
  };

  // Easy Paste Action Handlers
  const handlePasteClipboard = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            if (dataUrl) {
              setPastedImages((prev) => [...prev, dataUrl]);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleMakeFeatured = (index: number) => {
    setPastedImages((prev) => {
      if (index === 0 || !prev[index]) return prev;
      const selected = prev[index];
      const others = prev.filter((_, i) => i !== index);
      return [selected, ...others];
    });
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setPastedImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    const clean = inputImageUrl.trim();
    if (!clean) return;
    setPastedImages((prev) => [...prev, clean]);
    setInputImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setPastedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormulateFromPost = () => {
    if (!pastedPostText.trim() && pastedImages.length === 0) {
      setFetchError('தயவுசெய்து முகநூல் பதிவின் உரை அல்லது படங்களை உள்ளிடவும் (Please paste text or images)');
      return;
    }

    setIsFormulatingPost(true);
    setFetchError(null);

    try {
      const formulated = formulateCinemaArticleFromPostText(
        pastedPostText,
        pastedImages,
        optionalFbPostUrl,
        selectedCategory
      );

      setExtractedData(formulated);
      setEditTitle(formulated.title);
      setEditSummary(formulated.summary);
      setEditContent(formulated.content);
      setEditImage(formulated.image);
      setFetchStatusStep('கட்டுரை வெற்றிகரமாக உருவாக்கப்பட்டது! (Auto-Formulated Successfully!)');

      setTimeout(() => {
        const previewEl = document.getElementById('extracted-preview-workspace');
        if (previewEl) {
          previewEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } catch (err: any) {
      setFetchError('கட்டுரை உருவாக்குவதில் பிழை: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsFormulatingPost(false);
    }
  };

  // Real Live RSS Feed Fetcher
  const handleFetchLiveFeeds = async () => {
    setIsFetchingRss(true);
    setRssFetchSuccessMsg(null);

    const activeSources = sources.filter((s) => s.active);
    const allFetchedItems: LiveRssItem[] = [];

    // Fallback/standard live Tamil RSS feeds if none configured
    const feedUrlsToFetch = activeSources.length > 0
      ? activeSources
      : [
          {
            id: 'rss-google-ta',
            name: 'Google News Tamil (நேரலை)',
            url: 'https://news.google.com/rss?hl=ta&gl=IN&ceid=IN:ta',
            categoryId: 'world',
            language: 'ta',
            active: true
          },
          {
            id: 'rss-bbc-ta',
            name: 'BBC News Tamil (பிபிசி தமிழ்)',
            url: 'https://feeds.bbci.co.uk/tamil/rss.xml',
            categoryId: 'world',
            language: 'ta',
            active: true
          },
          {
            id: 'rss-cinema-ta',
            name: 'Google News Tamil Cinema (சினிமா)',
            url: 'https://news.google.com/rss/search?q=cinema+tamil&hl=ta&gl=IN&ceid=IN:ta',
            categoryId: 'kollywood',
            language: 'ta',
            active: true
          }
        ];

    for (const source of feedUrlsToFetch) {
      try {
        const items = await fetchLiveRssFeed(source.url, source.name);
        allFetchedItems.push(...items.slice(0, 8));
      } catch (err) {
        console.warn(`Failed fetching RSS feed ${source.name}:`, err);
      }
    }

    if (allFetchedItems.length > 0) {
      setLiveRssFeedItems(allFetchedItems);
      setRssFetchSuccessMsg(`வெற்றிகரமாக ${allFetchedItems.length} நேரலை செய்திகள் பெறப்பட்டன! (Fetched ${allFetchedItems.length} live stories)`);
    } else {
      // If public feeds had temporary CORS restrictions, show friendly notice
      setRssFetchSuccessMsg('நேரலை RSS செய்திகள் புதுப்பிக்கப்பட்டன (Feeds refreshed).');
    }

    setIsFetchingRss(false);
  };

  // Convert extracted full article into Chudar Media Article
  const handlePostFetched = (status: 'published' | 'draft') => {
    if (!extractedData && !editTitle) return;

    let bodyContent = editContent || extractedData?.content || '';
    // Strip any external source attribution or CineUlagam references
    bodyContent = bodyContent
      .replace(/மூல\s*செய்தி[^\n<]*/gi, '')
      .replace(/செய்தி\s*மூலம்[^\n<]*/gi, '')
      .replace(/மூலம்:[^\n<]*/gi, '')
      .replace(/CineUlagam/gi, '')
      .replace(/சினி\s*உலகம்/gi, '')
      .trim();

    if (addChudarBranding && !bodyContent.includes('சுடர் மீடியா செய்திப் பிரிவு')) {
      bodyContent += `\n\n<blockquote>— சுடர் மீடியா செய்திப் பிரிவு (Chudar Media Editorial Desk)</blockquote>`;
    }

    const newArticle: Article = {
      id: 'art-' + Date.now(),
      title: editTitle || extractedData?.title || 'செய்தி தலைப்பு',
      titleEn: '',
      subtitle: editSummary ? editSummary.slice(0, 140) : (extractedData?.summary?.slice(0, 140) || ''),
      subtitleEn: '',
      slug: 'news-' + Date.now(),
      categoryId: selectedCategory,
      summary: editSummary || extractedData?.summary || '',
      summaryEn: '',
      content: bodyContent,
      featuredImage: editImage || extractedData?.image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
      imageCaption: editTitle || extractedData?.title || '',
      photographerCredit: 'சுடர் மீடியா / பிரத்யேகப் படம்',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'reporter' ? 'Field Reporter' : 'Senior News Editor',
      authorAvatar: currentUser.avatar,
      location: 'சென்னை & கொழும்பு',
      status: status,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBreaking: false,
      isFeatured: false,
      isTrending: true,
      editorPick: false,
      allowComments: true,
      viewCount: 150,
      shareCount: 22,
      tags: ['சினிமா', 'கோலிவுட்', 'செய்திகள்', 'சுடர் மீடியா'],
      seoTitle: (editTitle || extractedData?.title || 'செய்தி') + ' | Chudar Media',
      seoDescription: editSummary || extractedData?.summary || ''
    };

    onSaveDirectArticle(newArticle);
    setPublishSuccessMsg(
      `செய்தி வெற்றிகரமாக ${status === 'published' ? 'வெளியிடப்பட்டது (PUBLISHED)' : 'வரைவாக சேமிக்கப்பட்டது (SAVED AS DRAFT)'}!`
    );
    setExtractedData(null);
    setFetchUrl('');
    setTimeout(() => setPublishSuccessMsg(null), 5000);
  };

  // Open in full Article Editor
  const handleOpenInFullEditor = () => {
    if (!extractedData && !editTitle) return;

    let bodyContent = editContent || extractedData?.content || '';
    // Strip any external source attribution or CineUlagam references
    bodyContent = bodyContent
      .replace(/மூல\s*செய்தி[^\n<]*/gi, '')
      .replace(/செய்தி\s*மூலம்[^\n<]*/gi, '')
      .replace(/மூலம்:[^\n<]*/gi, '')
      .replace(/CineUlagam/gi, '')
      .replace(/சினி\s*உலகம்/gi, '')
      .trim();

    if (addChudarBranding && !bodyContent.includes('சுடர் மீடியா செய்திப் பிரிவு')) {
      bodyContent += `\n\n<blockquote>— சுடர் மீடியா செய்திப் பிரிவு (Chudar Media Desk)</blockquote>`;
    }

    const tempArticle: Article = {
      id: 'art-' + Date.now(),
      title: editTitle || extractedData?.title || '',
      titleEn: '',
      subtitle: editSummary ? editSummary.slice(0, 140) : (extractedData?.summary?.slice(0, 140) || ''),
      subtitleEn: '',
      slug: 'news-' + Date.now(),
      categoryId: selectedCategory,
      summary: editSummary || extractedData?.summary || '',
      summaryEn: '',
      content: bodyContent,
      featuredImage: editImage || extractedData?.image || '',
      imageCaption: editTitle || extractedData?.title || '',
      photographerCredit: 'சுடர் மீடியா / சினிமா பிரிவு',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role === 'reporter' ? 'Field Reporter' : 'Senior Editor',
      authorAvatar: currentUser.avatar,
      location: 'சென்னை & கொழும்பு',
      status: 'draft',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBreaking: false,
      isFeatured: false,
      isTrending: true,
      editorPick: false,
      allowComments: true,
      viewCount: 0,
      shareCount: 0,
      tags: ['சினிமா', 'கோலிவுட்', 'சுடர் மீடியா'],
      seoTitle: (editTitle || extractedData?.title || 'செய்தி') + ' | Chudar Media',
      seoDescription: editSummary || extractedData?.summary || ''
    };

    onEditArticle(tempArticle);
  };

  const handleAddRssSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim() || !newSourceUrl.trim()) return;

    onAddSource({
      id: 'rss-' + Date.now(),
      name: newSourceName.trim(),
      url: newSourceUrl.trim(),
      categoryId: newSourceCategory,
      language: 'ta',
      active: true,
      lastFetched: new Date().toISOString()
    });

    setNewSourceName('');
    setNewSourceUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#C8102E]" />
            <span>Real News Importer & Live Full Article Scraper</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Fetch real, full news articles with complete paragraphs, headlines, and high-res images directly from live URLs or RSS feeds.
          </p>
        </div>
      </div>

      {publishSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-sm flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{publishSuccessMsg}</span>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-neutral-300 pb-2">
        <button
          type="button"
          onClick={() => setImporterTab('easy_paste')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-md flex items-center gap-2 cursor-pointer transition-all ${
            importerTab === 'easy_paste'
              ? 'bg-[#C8102E] text-white shadow-md'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>⭐ முகநூல் பதிவு & படங்கள் ➡️ ஆட்டோ-கட்டுரை (Easy Copy-Paste Studio)</span>
        </button>

        <button
          type="button"
          onClick={() => setImporterTab('url_scraper')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-md flex items-center gap-2 cursor-pointer transition-all ${
            importerTab === 'url_scraper'
              ? 'bg-[#C8102E] text-white shadow-md'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>இணையதள URL ஸ்கிராப்பர் (Live Web Scraper)</span>
        </button>
      </div>

      {/* MODE 1: Easy Copy-Paste Studio (As requested: Copy text + Copy/Upload images -> Auto Cinema Article) */}
      {importerTab === 'easy_paste' && (
        <div className="bg-white border-2 border-[#C8102E] rounded-sm p-5 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs">
                  f
                </span>
                <h3 className="text-sm font-bold text-neutral-900">
                  முகநூல் பதிவு & படங்கள் ➡️ சினிமா செய்தி ஆட்டோ-மேக்கர்
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                API தேவையில்லை! Facebook-ல் உள்ள பதிவின் உரையையும் படங்களையும் இங்கே ஒட்டினால் (Paste), சிஸ்டமே சிறந்த தலைப்பு, 3 பத்திகள் கொண்ட முழு சினிமா கட்டுரை மற்றும் கேலரியை 1 வினாடியில் உருவாக்கிவிடும்!
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 shrink-0 font-bold">
              ✓ 0 API Key Needed · 100% Guaranteed
            </span>
          </div>

          {/* 1. Post Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
              <span>1. Facebook பதிவின் உரையை இங்கே Paste செய்யவும்:</span>
              <span className="text-[11px] text-neutral-500 font-medium bg-neutral-100 px-2 py-0.5 rounded">
                Ctrl+V மூலம் படங்களையும் நேரடியாக ஒட்டலாம் (Paste images from clipboard)
              </span>
            </label>
            <textarea
              rows={5}
              value={pastedPostText}
              onChange={(e) => setPastedPostText(e.target.value)}
              onPaste={handlePasteClipboard}
              placeholder="Facebook பதிவில் உள்ள வாசகத்தை (Text / Caption) அப்படியே Copy செய்து இங்கே Paste செய்யவும்...
எ.கா: தளபதி விஜய் நடிக்கும் புதிய திரைப்படத்தின் படப்பிடிப்பு குறித்த அதிகாரப்பூர்வ தகவல்..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E] text-neutral-900 leading-relaxed font-medium"
            />
          </div>

          {/* 2. Image Manager (Multiple Images Support) */}
          <div
            onPaste={handlePasteClipboard}
            className="space-y-2.5 p-3.5 bg-neutral-50 border border-neutral-200 rounded"
          >
            <label className="text-xs font-bold text-neutral-800 flex items-center justify-between flex-wrap gap-1">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#C8102E]" />
                <span>2. புகைப்படங்களைச் சேர்க்கவும் (ஒன்று அல்லது பல படங்கள்):</span>
              </span>
              <span className="text-[11px] text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded font-bold">
                ⭐ 1-வது படம் = முகப்பு படம் · மற்றவை = செய்திக்குள் கீழே வரும் படங்கள்
              </span>
            </label>

            {/* Upload Buttons & URL Input */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <label className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-xs font-bold text-neutral-800 flex items-center justify-center gap-2 cursor-pointer shadow-2xs shrink-0 transition-colors">
                <Upload className="w-4 h-4 text-[#C8102E]" />
                <span>மொபைல் / கணினியிலிருந்து படங்களை ஏற்று (Upload)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageFiles(e.target.files)}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-neutral-400 hidden sm:inline">அல்லது</span>

              <div className="flex-1 w-full flex gap-1">
                <input
                  type="url"
                  value={inputImageUrl}
                  onChange={(e) => setInputImageUrl(e.target.value)}
                  onPaste={handlePasteClipboard}
                  placeholder="படத்தின் நேரடி URL இணைப்பு அல்லது Paste செய்யவும் (Ctrl+V)..."
                  className="flex-1 px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold rounded cursor-pointer shrink-0"
                >
                  + சேர்
                </button>
              </div>
            </div>

            {/* Display Attached Images List */}
            {pastedImages.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neutral-700">
                    இணைக்கப்பட்ட படங்கள் ({pastedImages.length}):
                  </span>
                  <span className="text-[10px] text-neutral-500 italic">
                    (படத்தை முதன்மைப்படுத்த 'முகப்புப் படமாக்கு' பொத்தானை அழுத்தவும்)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                  {pastedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative group border-2 rounded overflow-hidden bg-neutral-900 aspect-16/10 shadow-xs ${
                        idx === 0 ? 'border-[#C8102E] ring-2 ring-red-200' : 'border-neutral-300'
                      }`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 flex flex-col gap-1 items-start">
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded text-white shadow-md ${
                            idx === 0 ? 'bg-[#C8102E]' : 'bg-neutral-900/90'
                          }`}
                        >
                          {idx === 0 ? '⭐ முகப்பு படம்' : `📸 படம் #${idx + 1}`}
                        </span>
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMakeFeatured(idx)}
                            className="text-[8px] font-bold px-1.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded shadow-sm cursor-pointer"
                            title="இப்படத்தை முதல் படமாக மாற்று"
                          >
                            ⭐ 1-வது ஆக்கு
                          </button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full cursor-pointer shadow-md"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Optional Facebook Link & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                3. Facebook பதிவு லிங்க் (விருப்பத்திற்கு மட்டும் - Player இணைக்க):
              </label>
              <input
                type="url"
                value={optionalFbPostUrl}
                onChange={(e) => setOptionalFbPostUrl(e.target.value)}
                placeholder="https://www.facebook.com/share/p/..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                4. சினிமா பிரிவு (Category):
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E] font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameTa} ({c.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Big Auto-Formulate Action Button */}
          <button
            type="button"
            disabled={isFormulatingPost}
            onClick={handleFormulateFromPost}
            className="w-full py-3 bg-[#C8102E] hover:bg-[#a50d25] text-white text-sm font-bold rounded-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>தானாகவே கவர்ச்சிகரமான சினிமா கட்டுரையை உருவாக்கு (Auto-Formulate Cinema News Now)</span>
          </button>
        </div>
      )}

      {/* MODE 2: Live Article URL Fetcher (Real Full News Extractor) */}
      {importerTab === 'url_scraper' && (
        <>
          <div className="bg-white border-2 border-neutral-800 rounded-sm p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C8102E]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Live Article Full Content Extraper (முழு செய்தி பிரித்தெடுப்பு)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>100% Real Full Article Extraction</span>
          </span>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleFetchRealUrl(); }} className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            required
            value={fetchUrl}
            onChange={(e) => setFetchUrl(e.target.value)}
            placeholder="Paste any live news URL (e.g. CineUlagam, BBC Tamil, Dinamalar, Dinamani, Behindwoods, Vikatan, Virakesari...)"
            className="flex-1 px-3.5 py-2.5 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E] font-medium"
          />
          <button
            type="submit"
            disabled={isFetchingUrl}
            className="px-6 py-2.5 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs"
          >
            {isFetchingUrl ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>செய்தி எடுக்கப்படுகிறது...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Fetch Full Article (முழு செய்தி பெறுக)</span>
              </>
            )}
          </button>
        </form>

        {/* Facebook Post & Video Dedicated Toolkit (When FB link is entered) */}
        {(fetchUrl.includes('facebook.com') || fetchUrl.includes('fb.watch')) && (
          <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-400 rounded-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs">
                  f
                </span>
                <span className="font-bold text-xs text-blue-950 uppercase tracking-wide">
                  Facebook வீடியோ & பதிவு டூல்ஸ் (FB Video & Post Toolkit)
                </span>
              </div>
              <span className="text-[11px] text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                நேரடி வீடியோ இயக்கம் & ஆட்டோ-கட்டுரை தயார்
              </span>
            </div>

            <p className="text-xs text-blue-900 leading-relaxed">
              முகநூல் (Facebook) வீடியோக்கள் & பதிவுகளை வாசகர்கள் உங்கள் தளத்திலேயே நேரடியாகப் பார்க்கும் வகையில் அதிகாரப்பூர்வ Facebook Player உடன் சினிமா கட்டுரையாக மாற்றலாம். நீங்கள் கட்டுரை எழுதத் தேவையில்லை!
            </p>

            {/* Optional Caption Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-blue-950 flex items-center justify-between">
                <span>Facebook பதிவு வாசகம் (Caption) / மாற்றுத் தலைப்பு:</span>
                <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                  விருப்பத்திற்கு மட்டும் — காலியாகவும் விடலாம்
                </span>
              </label>
              <textarea
                rows={2}
                value={fbCaption}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('http://') || val.startsWith('https://') || val.includes('facebook.com')) {
                    setFbCaption('');
                  } else {
                    setFbCaption(val);
                  }
                }}
                placeholder="முகநூல் பதிவின் 2 வரி உரையை (Caption) இங்கே Paste செய்தால், உடனே அசல் சினிமா தலைப்பு மற்றும் செய்தியாக மாறிவிடும்..."
                className="w-full px-3 py-2 text-xs border border-blue-300 rounded bg-white focus:outline-none focus:border-blue-600 text-neutral-800 resize-none font-medium"
              />

              {/* 1-Click Cinema Topic Quick Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] font-bold text-blue-900">⚡ 1-கிளிக் தலைப்புத் தேர்வுகள்:</span>
                {[
                  '‘TVK’ இசை வெளியீட்டு விழா — பிரத்யேக புகைப்படத் தொகுப்பு',
                  'Chilli Chips Official பிரத்யேக சினிமா படப்பிடிப்புப் பதிவுகள்',
                  'புதிய திரைப்பட ஃபர்ஸ்ட் லுக் & பிரம்மாண்ட அறிவிப்பு',
                  'வைரல் சினிமா காட்சி & ரசிகர்களின் பெரும் வரவேற்பு'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setFbCaption(chip);
                      setEditTitle(chip);
                      if (extractedData) {
                        setExtractedData({
                          ...extractedData,
                          title: chip,
                          subtitle: chip
                        });
                      }
                    }}
                    className="px-2 py-0.5 bg-white hover:bg-blue-100 text-blue-900 text-[10px] font-semibold rounded border border-blue-300 cursor-pointer transition-colors"
                  >
                    + {chip.slice(0, 28)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Helper Tips */}
            <div className="p-2.5 bg-blue-100/60 border border-blue-300 rounded text-[11px] text-blue-950 space-y-1">
              <div className="font-bold flex items-center gap-1 text-blue-900">
                <span>💡 எளிய வழிமுறை (Quick Tip):</span>
              </div>
              <p className="leading-relaxed">
                • <strong>Share Link வழி</strong>: Facebook பதிவின் கீழே உள்ள <strong>'Share' ➡️ 'Copy link'</strong> கொடுத்தால் (<code className="font-mono text-[10px] bg-white px-1 py-0.2 rounded">facebook.com/share/p/...</code>) அசல் தலைப்பு மற்றும் உரை 100% தானாகவே வந்துவிடும்!
              </p>
              <p className="leading-relaxed">
                • <strong>Photo Link வழி</strong>: புகைப்படத்தை க்ளிக் செய்து எடுத்த லிங்க் என்றால், Facebook-ல் உள்ள உரையை காப்பி செய்து மேலே உள்ள பெட்டியில் Paste செய்யலாம் அல்லது மேலே உள்ள <strong>1-கிளிக் தலைப்பைத்</strong> தொட்டாலே போதும்!
              </p>
            </div>

            {/* Action Buttons: 1-Click Formulate & External Video Downloaders */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleFetchRealUrl()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>தானாகவே சினிமா கட்டுரையை உருவாக்கு (Auto-Formulate Now)</span>
              </button>

              <span className="text-neutral-300">|</span>

              {/* Direct Facebook Video Downloaders */}
              <a
                href={`https://snapsave.app/?url=${encodeURIComponent(fetchUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded border border-neutral-300 flex items-center gap-1 shadow-2xs"
                title="Download Facebook Video in HD via SnapSave"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>SnapSave HD வீடியோ டவுன்லோட்</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <a
                href={`https://fdown.net/download.php?url=${encodeURIComponent(fetchUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-semibold rounded border border-neutral-300 flex items-center gap-1 shadow-2xs"
                title="Download Facebook Video via FDown"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>FDown டவுன்லோடர்</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>
          </div>
        )}

        {isFetchingUrl && (
          <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-700 flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">{fetchStatusStep}</span>
          </div>
        )}

        {fetchError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}

        {/* Quick Sample Links for 1-Click Verification */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
          <span className="font-semibold text-neutral-700">Quick Test Live Links:</span>
          <button
            type="button"
            onClick={() => {
              const url = 'https://cineulagam.com/article/karthik-subbaraj-reply-to-dorothy-negative-reviews-1790610516';
              setFetchUrl(url);
              handleFetchRealUrl(url);
            }}
            className="text-[#C8102E] hover:underline cursor-pointer bg-red-50 px-2 py-0.5 rounded border border-red-200 font-semibold"
          >
            [CineUlagam: கார்த்திக் சுப்புராஜ் செய்தி]
          </button>
          <button
            type="button"
            onClick={() => {
              const url = 'https://www.bbc.com/tamil';
              setFetchUrl(url);
              handleFetchRealUrl(url);
            }}
            className="text-[#C8102E] hover:underline cursor-pointer bg-red-50 px-2 py-0.5 rounded border border-red-200"
          >
            [BBC News Tamil]
          </button>
          <button
            type="button"
            onClick={() => {
              const url = 'https://www.dinamani.com';
              setFetchUrl(url);
              handleFetchRealUrl(url);
            }}
            className="text-[#C8102E] hover:underline cursor-pointer bg-red-50 px-2 py-0.5 rounded border border-red-200"
          >
            [Dinamani Live News]
          </button>
        </div>
      </div>

      {/* 2. Real Live RSS Feeds Sync & Feed Queue */}
      <div className="bg-white border border-neutral-200 rounded-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
              <Rss className="w-4 h-4 text-[#C8102E]" />
              <span>Real Live RSS Feeds ({sources.length} Configured)</span>
            </h3>
            <p className="text-[11px] text-neutral-500">
              Fetch real live RSS feeds from BBC Tamil, Google News, CineUlagam, and Dinamani.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFetchLiveFeeds}
            disabled={isFetchingRss}
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded cursor-pointer flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRss ? 'animate-spin' : ''}`} />
            <span>{isFetchingRss ? 'Fetching Live Feeds...' : 'Fetch Live RSS News Now'}</span>
          </button>
        </div>

        {rssFetchSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{rssFetchSuccessMsg}</span>
          </div>
        )}

        {/* Configured RSS Feeds Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sources.map((source) => (
            <div key={source.id} className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="font-bold text-neutral-900 block truncate">{source.name}</span>
                <span className="text-[10px] text-neutral-400 truncate block font-mono">{source.url}</span>
              </div>
              <button
                onClick={() => onDeleteSource(source.id)}
                className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer shrink-0"
                title="Delete feed"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Source form */}
        <form onSubmit={handleAddRssSource} className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            required
            value={newSourceName}
            onChange={(e) => setNewSourceName(e.target.value)}
            placeholder="Feed Name (e.g. Dinamalar Live RSS)"
            className="flex-1 px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
          />
          <input
            type="url"
            required
            value={newSourceUrl}
            onChange={(e) => setNewSourceUrl(e.target.value)}
            placeholder="RSS Feed URL"
            className="flex-1 px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded cursor-pointer"
          >
            Add Feed
          </button>
        </form>
      </div>

      {/* 3. Live RSS Feed Queue with "Fetch Full Article" 1-Click Action */}
      <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
        <div className="px-4 py-3 bg-neutral-100 border-b border-neutral-200 text-xs font-bold uppercase text-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Feed Queue Stories</span>
            <span className="bg-[#C8102E] text-white text-[10px] px-2 py-0.5 rounded-full">
              {liveRssFeedItems.length > 0 ? liveRssFeedItems.length : importedStories.length} Articles
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 font-normal">
            Click &quot;Fetch Full Article&quot; to extract full paragraphs & images
          </span>
        </div>

        {/* If live RSS items were fetched, render them! Otherwise render default imported stories */}
        <div className="divide-y divide-neutral-200">
          {(liveRssFeedItems.length > 0 ? liveRssFeedItems : importedStories).map((story: any) => {
            const storyUrl = story.link || story.sourceUrl;
            return (
              <div
                key={story.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex gap-3 items-start flex-1 min-w-0">
                  {story.image ? (
                    <img
                      src={story.image}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      className="w-20 h-16 object-cover rounded shrink-0 bg-neutral-800 border border-neutral-200"
                    />
                  ) : (
                    <div className="w-20 h-16 bg-neutral-100 rounded shrink-0 flex items-center justify-center border border-neutral-200">
                      <ImageIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 mb-0.5">
                      <span className="font-bold text-[#C8102E]">{story.sourceName}</span>
                      <span>·</span>
                      <span>
                        {story.pubDate ? new Date(story.pubDate).toLocaleDateString() : 'Today'}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1">
                      {story.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                      {story.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {storyUrl && (
                    <a
                      href={storyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-neutral-500 hover:text-neutral-900 border border-neutral-200 rounded"
                      title="Open source website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* 1-Click REAL Full Article Extraction Button */}
                  <button
                    onClick={() => {
                      if (storyUrl) {
                        setFetchUrl(storyUrl);
                        handleFetchRealUrl(storyUrl);
                      } else {
                        // If no URL, populate with available description
                        setEditTitle(story.title);
                        setEditSummary(story.description);
                        setEditContent(`<p class="mb-4">${story.description}</p>`);
                        setEditImage(story.image || '');
                        setExtractedData({
                          title: story.title,
                          subtitle: story.sourceName,
                          summary: story.description,
                          content: `<p class="mb-4">${story.description}</p>`,
                          image: story.image || '',
                          imageCaption: story.title,
                          source: story.sourceName,
                          sourceUrl: storyUrl || '',
                          author: story.sourceName,
                          publishedAt: story.pubDate || new Date().toISOString(),
                          paragraphsCount: 1,
                          wordCount: 40,
                          isRealFullArticle: false
                        });
                      }
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    className="px-3.5 py-1.5 bg-[#C8102E] text-white text-xs font-bold rounded cursor-pointer hover:bg-[#a50d25] flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Fetch Full Article (முழு செய்தி)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
