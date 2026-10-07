import React, { useState, useRef, useEffect } from 'react';
import {
  Save,
  Eye,
  ArrowLeft,
  Quote,
  Bold,
  Italic,
  Star,
  Film,
  AlertCircle,
  Sparkles,
  Download,
  RefreshCw,
  CheckCircle2,
  Code,
  FileText,
  List,
  Eraser
} from 'lucide-react';
import { Article, Category, User, ArticleStatus } from '../../types';
import { fetchFullNewsArticle, htmlToPlainText, plainTextToHtml } from '../../services/articleExtractor';

interface ArticleEditorProps {
  initialArticle?: Article | null;
  categories: Category[];
  currentUser: User;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  initialArticle,
  categories,
  currentUser,
  onSave,
  onCancel
}) => {
  const isEditing = !!initialArticle;

  // URL Auto-Fill State
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialArticle?.title || '');
  const [titleEn, setTitleEn] = useState(initialArticle?.titleEn || '');
  const [subtitle, setSubtitle] = useState(initialArticle?.subtitle || '');
  const [subtitleEn, setSubtitleEn] = useState(initialArticle?.subtitleEn || '');
  const [categoryId, setCategoryId] = useState(initialArticle?.categoryId || 'kollywood');
  const [summary, setSummary] = useState(initialArticle?.summary || '');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Content and Editor Modes: 'visual' (WYSIWYG), 'plain' (Clean text paragraphs), 'html' (Source)
  const [content, setContent] = useState(initialArticle?.content || '');
  const [contentMode, setContentMode] = useState<'visual' | 'plain' | 'html'>('visual');
  const [plainContentText, setPlainContentText] = useState(() => htmlToPlainText(initialArticle?.content || ''));
  const visualEditorRef = useRef<HTMLDivElement>(null);

  // Sync visual editor DOM when entering visual mode or content updates externally
  useEffect(() => {
    if (contentMode === 'visual' && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== content) {
        visualEditorRef.current.innerHTML = content || '';
      }
    }
  }, [contentMode, content]);

  // Strip all HTML tags to clean plain paragraphs
  const handleCleanAllHtmlTags = () => {
    const clean = htmlToPlainText(content);
    setPlainContentText(clean);
    const semantic = plainTextToHtml(clean);
    setContent(semantic);
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = semantic;
    }
  };

  // Switch modes smoothly
  const handleSwitchMode = (mode: 'visual' | 'plain' | 'html') => {
    if (mode === 'plain') {
      const clean = htmlToPlainText(content);
      setPlainContentText(clean);
    } else if (mode === 'visual') {
      if (contentMode === 'plain') {
        const semantic = plainTextToHtml(plainContentText);
        setContent(semantic);
      }
    }
    setContentMode(mode);
  };

  // Visual editor command execution
  const executeVisualCommand = (command: string, value: string | undefined = undefined) => {
    if (contentMode !== 'visual') return;
    document.execCommand(command, false, value);
    if (visualEditorRef.current) {
      setContent(visualEditorRef.current.innerHTML);
      setPlainContentText(htmlToPlainText(visualEditorRef.current.innerHTML));
    }
  };
  const [featuredImage, setFeaturedImage] = useState(
    initialArticle?.featuredImage || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80'
  );
  const [imageCaption, setImageCaption] = useState(initialArticle?.imageCaption || '');
  const [photographerCredit, setPhotographerCredit] = useState(initialArticle?.photographerCredit || 'Chudar Cinema Desk');
  const [location, setLocation] = useState(initialArticle?.location || currentUser.location || 'Chennai & Colombo');

  // Cinema specific fields
  const [rating, setRating] = useState<number>(initialArticle?.rating || 4.0);
  const [movieVerdict, setMovieVerdict] = useState(initialArticle?.movieVerdict || 'Blockbuster');
  const [director, setDirector] = useState(initialArticle?.director || '');
  const [cast, setCast] = useState(initialArticle?.cast || '');
  const [musicDirector, setMusicDirector] = useState(initialArticle?.musicDirector || '');

  const [isBreaking, setIsBreaking] = useState(initialArticle?.isBreaking || false);
  const [isFeatured, setIsFeatured] = useState(initialArticle?.isFeatured || false);
  const [isTrending, setIsTrending] = useState(initialArticle?.isTrending || false);
  const [editorPick, setEditorPick] = useState(initialArticle?.editorPick || false);
  const [tagsStr, setTagsStr] = useState(initialArticle?.tags?.join(', ') || 'சினிமா, கோலிவுட், Kollywood');
  const [status, setStatus] = useState<ArticleStatus>(
    initialArticle?.status || (currentUser.role === 'reporter' ? 'pending_review' : 'published')
  );
  const [previewMode, setPreviewMode] = useState(false);

  // Synchronize state when initialArticle changes
  useEffect(() => {
    if (initialArticle) {
      setTitle(initialArticle.title || '');
      setTitleEn(initialArticle.titleEn || '');
      setSubtitle(initialArticle.subtitle || '');
      setSubtitleEn(initialArticle.subtitleEn || '');
      setCategoryId(initialArticle.categoryId || 'kollywood');
      setSummary(initialArticle.summary || '');
      setContent(initialArticle.content || '');
      setPlainContentText(htmlToPlainText(initialArticle.content || ''));
      setFeaturedImage(initialArticle.featuredImage || '');
      setImageCaption(initialArticle.imageCaption || '');
      setPhotographerCredit(initialArticle.photographerCredit || 'Chudar Cinema Desk');
      setLocation(initialArticle.location || currentUser.location || 'Chennai & Colombo');
      setRating(initialArticle.rating || 4.0);
      setMovieVerdict(initialArticle.movieVerdict || 'Blockbuster');
      setDirector(initialArticle.director || '');
      setCast(initialArticle.cast || '');
      setMusicDirector(initialArticle.musicDirector || '');
      setIsBreaking(initialArticle.isBreaking || false);
      setIsFeatured(initialArticle.isFeatured || false);
      setIsTrending(initialArticle.isTrending || false);
      setEditorPick(initialArticle.editorPick || false);
      setTagsStr(initialArticle.tags?.join(', ') || 'சினிமா, கோலிவுட், Kollywood');
      setStatus(initialArticle.status || (currentUser.role === 'reporter' ? 'pending_review' : 'published'));
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = initialArticle.content || '';
      }
    }
  }, [initialArticle]);

  // Formatting buttons
  const insertFormatting = (tag: string) => {
    if (tag === 'b') setContent((prev) => prev + '<strong>தடித்த எழுத்து</strong> ');
    if (tag === 'i') setContent((prev) => prev + '<em>சாய்வெழுத்து</em> ');
    if (tag === 'h3') setContent((prev) => prev + '\n<h3>புதிய உட்தலைப்பு</h3>\n<p>');
    if (tag === 'quote') setContent((prev) => prev + '\n<blockquote>"முக்கிய வசனம் அல்லது அறிக்கை"</blockquote>\n<p>');
    if (tag === 'p') setContent((prev) => prev + '\n<p>புதிய பத்தி...</p>\n');
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim() || !summary.trim()) {
      setValidationError('தயவுசெய்து தலைப்பு மற்றும் சுருக்க விவரத்தை நிரப்பவும் (Please fill in both the title and summary).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setValidationError(null);

    const tags = tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
    const slug = initialArticle?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50) || `cinema-${Date.now()}`;

    let finalStatus = status;
    if (currentUser.role === 'reporter' && status === 'published') {
      finalStatus = 'pending_review';
    }

    const finalContent =
      contentMode === 'plain'
        ? plainTextToHtml(plainContentText) || `<p>${summary.trim()}</p>`
        : content.trim() || `<p>${summary.trim()}</p>`;

    const savedArticle: Article = {
      id: initialArticle?.id || 'art-' + Date.now(),
      title: title.trim(),
      titleEn: titleEn.trim(),
      subtitle: subtitle.trim(),
      subtitleEn: subtitleEn.trim(),
      slug,
      categoryId,
      summary: summary.trim(),
      summaryEn: '',
      content: finalContent,
      featuredImage: featuredImage.trim(),
      imageCaption: imageCaption.trim() || title.trim(),
      photographerCredit: photographerCredit.trim(),
      authorId: initialArticle?.authorId || currentUser.id,
      authorName: initialArticle?.authorName || currentUser.name,
      authorRole: initialArticle?.authorRole || (currentUser.role === 'reporter' ? 'Field Reporter' : 'Cinema Editor'),
      authorAvatar: initialArticle?.authorAvatar || currentUser.avatar,
      location: location.trim(),
      status: finalStatus,
      publishedAt: initialArticle?.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBreaking,
      isFeatured,
      isTrending,
      editorPick,
      allowComments: true,
      viewCount: initialArticle?.viewCount || 0,
      shareCount: initialArticle?.shareCount || 0,
      tags,
      seoTitle: title.trim() + ' | Chudar Cinema',
      seoDescription: summary.trim(),
      rating: categoryId === 'reviews' ? rating : undefined,
      movieVerdict: categoryId === 'reviews' ? movieVerdict : undefined,
      director: director.trim() || undefined,
      cast: cast.trim() || undefined,
      musicDirector: musicDirector.trim() || undefined
    };

    onSave(savedArticle);
  };

  const handleAutoFillFromUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = importUrl.trim();
    if (!cleanUrl) return;

    setIsImporting(true);
    setImportMsg(null);
    setImportError(null);

    try {
      const extracted = await fetchFullNewsArticle(cleanUrl);
      setTitle(extracted.title);
      // Clean subtitle (no source credits)
      if (extracted.summary) setSubtitle(extracted.summary.slice(0, 140));
      if (extracted.summary) setSummary(extracted.summary);
      
      // Clean content without messy inline tags or external source credits
      let cleanPlain = extracted.plainContent || htmlToPlainText(extracted.content);
      cleanPlain = cleanPlain
        .replace(/மூல\s*செய்தி[^\n]*/gi, '')
        .replace(/செய்தி\s*மூலம்[^\n]*/gi, '')
        .replace(/மூலம்:[^\n]*/gi, '')
        .replace(/CineUlagam/gi, '')
        .replace(/சினி\s*உலகம்/gi, '')
        .trim();

      const cleanHtml = plainTextToHtml(cleanPlain);
      setContent(cleanHtml);
      setPlainContentText(cleanPlain);

      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = cleanHtml;
      }

      if (extracted.image) setFeaturedImage(extracted.image);
      if (extracted.imageCaption) setImageCaption(extracted.imageCaption);
      // Always credit Chudar Media as photographer / media desk
      setPhotographerCredit('சுடர் மீடியா / சினிமா பிரிவு');
      setImportMsg(
        `வெற்றிகரமாக முழு செய்தி பெறப்பட்டது! (${extracted.paragraphsCount} பத்திகள் • ${extracted.wordCount} வார்த்தைகள் - நேரடி வாசிப்பு வடிவில் தயாராக உள்ளது)`
      );
    } catch (err: any) {
      setImportError(err.message || 'செய்தி உள்ளடக்கத்தைப் பெறுவதில் பிழை ஏற்பட்டுள்ளது.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-sm p-5 sm:p-7 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-neutral-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-[#C8102E] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-neutral-500" />
            <span>{previewMode ? 'Back to Editor' : 'Preview Article'}</span>
          </button>

          {!previewMode && (
            <button
              type="button"
              onClick={() => handleFormSubmit()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Save Changes' : 'Publish Article'}</span>
            </button>
          )}
        </div>
      </div>

      {validationError && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{validationError}</span>
        </div>
      )}

      {previewMode ? (
        <div className="border border-neutral-200 p-6 rounded bg-neutral-50">
          <div className="text-xs text-[#C8102E] font-bold uppercase mb-2">PREVIEW MODE</div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-serif-tamil text-neutral-900 mb-2">{title || 'Story Title'}</h1>
          <h2 className="text-xs sm:text-sm text-neutral-600 mb-4">{subtitle}</h2>
          <img src={featuredImage} alt={title} className="w-full h-72 object-cover rounded mb-4" />
          <div className="font-semibold text-neutral-800 mb-4">{summary}</div>
          <div className="prose text-neutral-800 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: content || summary }} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick 1-Click Auto Fill from URL Bar */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-neutral-50 border border-neutral-300 rounded text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-[#C8102E]" />
                <span>1-Click Auto-Fill from Live News URL (நேரடி செய்தி இணைப்பு மூலம் நிரப்புக)</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Real Full Article Extractor</span>
            </div>

            <form onSubmit={handleAutoFillFromUrl} className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="Paste news URL (e.g. CineUlagam, BBC Tamil, Dinamalar, Dinamani...)"
                className="flex-1 px-3 py-1.5 border border-neutral-300 rounded bg-white text-xs"
              />
              <button
                type="submit"
                disabled={isImporting}
                className="px-4 py-1.5 bg-[#C8102E] hover:bg-[#a50d25] text-white font-bold rounded cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>செய்தி எடுக்கப்படுகிறது...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Auto-Fill Full Story</span>
                  </>
                )}
              </button>
            </form>

            {importMsg && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{importMsg}</span>
              </div>
            )}

            {importError && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-1.5 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{importError}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
          {currentUser.role === 'reporter' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Reporter Workflow:</strong> Your submission will be submitted for editorial approval (Pending Review) before public release.
              </span>
            </div>
          )}

          {/* Category, Status, Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-medium"
              >
                {categories.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameEn} ({cat.nameTa})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white font-medium"
              >
                <option value="published">Publish Immediately</option>
                <option value="draft">Save as Draft</option>
                <option value="pending_review">Submit for Editorial Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
                Reporting Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Chennai, Colombo, Jaffna, London"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
          </div>

          {/* Movie Review Specific Meta (Visible if category is reviews) */}
          {categoryId === 'reviews' && (
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Movie Review Rating & Cast Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Star Rating (out of 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Verdict Badge</label>
                  <input
                    type="text"
                    value={movieVerdict}
                    onChange={(e) => setMovieVerdict(e.target.value)}
                    placeholder="Must Watch, Blockbuster, Hit"
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Director</label>
                  <input
                    type="text"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    placeholder="e.g. Vetrimaaran"
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Lead Cast</label>
                  <input
                    type="text"
                    value={cast}
                    onChange={(e) => setCast(e.target.value)}
                    placeholder="e.g. Vijay, Nayanthara"
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Titles */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              Tamil Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="செய்தியின் தமிழ் தலைப்பு..."
              className="w-full px-3.5 py-2.5 text-base border border-neutral-300 rounded bg-white font-serif-tamil font-bold focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tamil Subtitle / Deck
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="துணைத் தலைப்பு..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                English Headline (Optional)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="English headline..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase mb-1">
              Lead Summary *
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Key highlights and opening summary of the story..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-neutral-300 rounded bg-white leading-relaxed focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          {/* Content Body - Multi-Mode Visual & Clean Paragraphs Editor */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-neutral-800 uppercase flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>முழுச் செய்தி உள்ளடக்கம் (Full Article Content) *</span>
                </label>
                <span className="text-[11px] text-neutral-500">
                  HTML குறியீடுகள் இன்றி இயல்பான தமிழ் பத்திகளாக எளிதாக எழுதலாம் அல்லது திருத்தலாம்.
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded border border-neutral-300">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('visual')}
                  className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition-colors ${
                    contentMode === 'visual'
                      ? 'bg-white text-[#C8102E] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="நேரடி வாசிப்பு வடிவத்தில் திருத்துக"
                >
                  <Eye className="w-3 h-3" />
                  <span>நேரடி பார்வை (Visual Editor)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchMode('plain')}
                  className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition-colors ${
                    contentMode === 'plain'
                      ? 'bg-white text-[#C8102E] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  title="எந்த குறியீடும் இன்றி எளிய பத்திகளாக திருத்துக"
                >
                  <FileText className="w-3 h-3" />
                  <span>எளிய பத்திகள் (Clean Text)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchMode('html')}
                  className={`px-2.5 py-1 text-xs font-bold rounded flex items-center gap-1 cursor-pointer transition-colors ${
                    contentMode === 'html'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  title="HTML மூலக்குறியீடு வடிவம்"
                >
                  <Code className="w-3 h-3" />
                  <span>HTML</span>
                </button>
              </div>
            </div>

            {/* Editor Toolbar & Strip Tags Helper */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-neutral-50 border border-neutral-300 rounded-t border-b-0">
              <div className="flex items-center gap-1 flex-wrap">
                {contentMode === 'visual' && (
                  <>
                    <button
                      type="button"
                      onClick={() => executeVisualCommand('bold')}
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 font-bold cursor-pointer"
                      title="தடித்த எழுத்து (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeVisualCommand('italic')}
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 italic cursor-pointer"
                      title="சாய்வெழுத்து (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeVisualCommand('formatBlock', '<h3>')}
                      className="px-2 py-1 rounded hover:bg-neutral-200 text-xs font-bold text-neutral-800 cursor-pointer"
                      title="உட்தலைப்பு (Heading 3)"
                    >
                      H3 தலைப்பு
                    </button>
                    <button
                      type="button"
                      onClick={() => executeVisualCommand('formatBlock', '<blockquote>')}
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                      title="மேற்கோள் (Quote)"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeVisualCommand('insertUnorderedList')}
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                      title="புல்லட் பட்டியல் (List)"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => executeVisualCommand('removeFormat')}
                      className="p-1.5 rounded hover:bg-neutral-200 text-neutral-500 cursor-pointer"
                      title="வடிவமைப்பை நீக்கு (Remove Format)"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {contentMode === 'plain' && (
                  <span className="text-xs text-neutral-600 font-medium px-1">
                    ஒவ்வொரு புதிய பத்திக்கும் Enter அழுத்தவும். HTML குறியீடுகள் தேவையில்லை.
                  </span>
                )}

                {contentMode === 'html' && (
                  <span className="text-xs text-amber-700 font-mono px-1">
                    HTML மூலக்குறியீடு வடிவம்: நேரடி டேக் எடிட்டிங்
                  </span>
                )}
              </div>

              {/* 1-Click Clean HTML to Plain Text */}
              <button
                type="button"
                onClick={handleCleanAllHtmlTags}
                className="px-2.5 py-1 text-[11px] font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title="எல்லா HTML குறியீடுகளையும் நீக்கி சுத்தமான தமிழ் பத்திகளாக மாற்றும்"
              >
                <Sparkles className="w-3 h-3 text-[#C8102E]" />
                <span>🧹 HTML நீக்கி சுத்தமாக்கு (Strip HTML Tags)</span>
              </button>
            </div>

            {/* Active Content Area */}
            {contentMode === 'visual' && (
              <div
                ref={visualEditorRef}
                contentEditable
                onInput={() => {
                  if (visualEditorRef.current) {
                    setContent(visualEditorRef.current.innerHTML);
                    setPlainContentText(htmlToPlainText(visualEditorRef.current.innerHTML));
                  }
                }}
                className="article-prose spacious-mode min-h-[260px] max-h-[520px] overflow-y-auto p-4 border border-neutral-300 rounded-b bg-white text-neutral-900 text-sm sm:text-base leading-[2.1] focus:outline-none focus:border-[#C8102E] font-serif-tamil max-w-none"
              />
            )}

            {contentMode === 'plain' && (
              <textarea
                rows={10}
                value={plainContentText}
                onChange={(e) => {
                  setPlainContentText(e.target.value);
                  setContent(plainTextToHtml(e.target.value));
                }}
                placeholder="இங்கு செய்தியின் பத்திகளை சாதாரணமாக எழுதவும். ஒவ்வொரு பத்திக்கும் இடையே Enter அழுத்தி இடைவெளி விட்டு எழுதவும்..."
                className="w-full p-4 border border-neutral-300 rounded-b bg-white text-neutral-900 text-sm sm:text-base leading-[2.1] focus:outline-none focus:border-[#C8102E] font-serif-tamil"
              />
            )}

            {contentMode === 'html' && (
              <textarea
                rows={10}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setPlainContentText(htmlToPlainText(e.target.value));
                }}
                className="w-full p-3 font-mono text-xs border border-neutral-300 rounded-b bg-neutral-900 text-emerald-400 leading-relaxed focus:outline-none focus:border-[#C8102E]"
              />
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-500 pt-1.5 gap-1 border-t border-neutral-100">
              <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                <span>💡</span>
                <span>பத்திகளுக்கு இடையே Enter கொடுத்து எழுதுங்கள்; வாசகர்களுக்கு இடைவெளியுடன் பந்தி பந்தியாக அழகாகத் தெரியும்.</span>
              </span>
              <span className="text-emerald-700 font-semibold self-end sm:self-auto">
                {plainContentText.split(/\n\s*\n/).filter(Boolean).length || 1} பத்திகள் • {contentMode === 'visual' ? '✓ நேரடி காட்சி' : contentMode === 'plain' ? '✓ எளிய உரை' : '✓ HTML'}
              </span>
            </div>
          </div>

          {/* Featured Image Details */}
          <div className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Featured Poster / Image Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                  Photo Credit
                </label>
                <input
                  type="text"
                  value={photographerCredit}
                  onChange={(e) => setPhotographerCredit(e.target.value)}
                  placeholder="Chudar Cinema / Production Banner"
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                Image Caption
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Caption displayed under the main image..."
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
          </div>

          {/* Editorial Flags & Tags */}
          <div className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Editorial Placement Flags
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#C8102E]">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-[#C8102E]"
                />
                <span>Breaking Alert</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-neutral-900"
                />
                <span>Hero Spotlight</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded text-neutral-900"
                />
                <span>Trending Feed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
                <input
                  type="checkbox"
                  checked={editorPick}
                  onChange={(e) => setEditorPick(e.target.checked)}
                  className="rounded text-neutral-900"
                />
                <span>Editor's Pick</span>
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="தளபதிவிஜய், Kollywood, Cinema, BoxOffice"
                className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C8102E] hover:bg-[#a50d25] text-white rounded text-xs sm:text-sm font-bold tracking-wide transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>
                {currentUser.role === 'reporter'
                  ? 'Submit for Editorial Review'
                  : isEditing
                  ? 'Update Cinema Article'
                  : 'Publish to Chudar Media'}
              </span>
            </button>
          </div>
        </form>
        </div>
      )}
    </div>
  );
};
