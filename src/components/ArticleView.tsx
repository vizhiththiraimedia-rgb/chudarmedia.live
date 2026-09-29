import React, { useState, useEffect } from 'react';
import {
  Clock,
  Eye,
  Share2,
  Printer,
  Volume2,
  VolumeX,
  ThumbsUp,
  MessageSquare,
  ChevronLeft,
  Copy,
  Check,
  Send,
  Calendar,
  MapPin,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import { Article, Category, Comment, Advertisement } from '../types';
import {
  incrementArticleView,
  getComments,
  addComment,
  likeComment,
  recordAdClick
} from '../services/storage';

interface ArticleViewProps {
  article: Article;
  allArticles: Article[];
  categories: Category[];
  advertisements: Advertisement[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  language: 'ta' | 'en';
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles,
  categories,
  advertisements,
  onBack,
  onSelectArticle,
  language
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentEmail, setNewCommentEmail] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // In-article ad
  const inlineAd = advertisements.find((a) => a.active && a.placement === 'article_inline');

  // Increment view count on mount
  useEffect(() => {
    incrementArticleView(article.id);
    setComments(getComments(article.id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  // Track scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? (language === 'ta' ? cat.nameTa : cat.nameEn) : 'செய்திகள்';
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString([], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const directArticleUrl = `${window.location.origin}${window.location.pathname}?article=${article.id}`;
  const shareUrl = encodeURIComponent(directArticleUrl);
  const shareTitle = encodeURIComponent(article.title);

  const handleCopyLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(directArticleUrl);
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = directArticleUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: directArticleUrl
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSpeechToggle = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const cleanText = article.summary + '. ' + article.content.replace(/<[^>]*>?/gm, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ta-LK'; // Tamil speech
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentName.trim() && newCommentContent.trim()) {
      const created = addComment({
        articleId: article.id,
        authorName: newCommentName.trim(),
        authorEmail: newCommentEmail.trim(),
        content: newCommentContent.trim(),
        status: 'approved'
      });
      setComments((prev) => [created, ...prev]);
      setNewCommentContent('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    }
  };

  const handleLikeComment = (commentId: string) => {
    likeComment(commentId);
    setComments(getComments(article.id));
  };

  // Related stories (same category or recent)
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && a.status === 'published')
    .filter((a) => a.categoryId === article.categoryId || a.isFeatured)
    .slice(0, 4);

  // Font size classes
  const fontClass =
    fontSize === 'xlarge'
      ? 'text-lg sm:text-xl leading-relaxed sm:leading-loose'
      : fontSize === 'large'
      ? 'text-base sm:text-lg leading-relaxed'
      : 'text-sm sm:text-base leading-relaxed';

  return (
    <div className="article-container max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Reading Progress Indicator Bar (Fixed at very top) */}
      <div
        className="fixed top-0 left-0 h-1 bg-[#C8102E] z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      ></div>

      {/* Back button & Breadcrumb Navigation */}
      <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-neutral-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 hover:text-[#C8102E] transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{language === 'ta' ? 'முகப்புக்குத் திரும்புக' : 'Back to News'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>{language === 'ta' ? 'முகப்பு' : 'Home'}</span>
          <span>/</span>
          <span className="text-[#C8102E] font-medium">{getCategoryName(article.categoryId)}</span>
        </div>
      </div>

      {/* Article Header */}
      <header className="mb-6">
        {/* Category & Status Indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-[#C8102E] text-white text-xs font-bold uppercase tracking-wider rounded-xs">
            {getCategoryName(article.categoryId)}
          </span>
          {article.isBreaking && (
            <span className="px-2 py-0.5 bg-amber-400 text-neutral-900 text-xs font-black uppercase rounded-xs">
              {language === 'ta' ? 'முக்கியச் செய்தி' : 'BREAKING'}
            </span>
          )}
        </div>

        {/* Main Headline */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-serif-tamil text-[#111111] leading-snug sm:leading-relaxed mb-3">
          {language === 'ta' ? article.title : (article.titleEn || article.title)}
        </h1>

        {/* Subtitle / Deck */}
        {(() => {
          const rawSub = language === 'ta' ? article.subtitle : (article.subtitleEn || article.subtitle);
          if (!rawSub) return null;
          // Filter out external source disclaimers like "செய்தி மூலம்: CineUlagam" or "Source: CineUlagam"
          if (/மூல\s*செய்தி|செய்தி\s*மூலம்|source:/i.test(rawSub) && /cineulagam|சினி\s*உலகம்/i.test(rawSub)) {
            return null;
          }
          const cleanSub = rawSub
            .replace(/செய்தி\s*மூலம்:[^\n]*/gi, '')
            .replace(/மூல\s*செய்தி:[^\n]*/gi, '')
            .replace(/CineUlagam(\s*\(சினிஉலகம்\))?/gi, '')
            .replace(/சினி\s*உலகம்/gi, '')
            .trim();
          if (!cleanSub) return null;
          return (
            <h2 className="text-xs sm:text-sm font-medium text-neutral-600 leading-normal mb-4 border-l-2 border-[#C8102E] pl-2.5">
              {cleanSub}
            </h2>
          );
        })()}

        {/* Author Byline & Date strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-neutral-200 text-xs text-neutral-600">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <img
              src={article.authorAvatar}
              alt={article.authorName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-neutral-300"
            />
            <div>
              <div className="font-bold text-neutral-900 text-sm">{article.authorName}</div>
              <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
                <span>{article.authorRole}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-[#C8102E]" />
                  {article.location}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps & Stats */}
          <div className="flex flex-col sm:items-end text-neutral-500 text-[11px] gap-0.5">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>வெளியீடு: {formatDateTime(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-mono">
                <Eye className="w-3 h-3" />
                {article.viewCount?.toLocaleString() || '1,000'} பார்வைகள்
              </span>
              <span>·</span>
              <span>3 நிமிட வாசிப்பு</span>
            </div>
          </div>
        </div>

        {/* Reader Tools & Social Share Toolbar (Zero dead-clicks!) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 py-3 border-b border-neutral-200 bg-neutral-50 px-3 rounded-xs my-4">
          {/* Audio reader simulation + Font resize */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeechToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors cursor-pointer ${
                isPlayingAudio
                  ? 'bg-[#C8102E] text-white animate-pulse'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C8102E]" />}
              <span>{isPlayingAudio ? 'நிறுத்து' : 'செய்தியைக் கேட்க'}</span>
            </button>

            {/* Font size adjustment */}
            <div className="flex items-center gap-1 border border-neutral-300 rounded-sm bg-white p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 text-xs font-medium rounded-xs cursor-pointer ${
                  fontSize === 'normal' ? 'bg-[#111111] text-white' : 'text-neutral-600 hover:text-black'
                }`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 text-xs font-bold rounded-xs cursor-pointer ${
                  fontSize === 'large' ? 'bg-[#111111] text-white' : 'text-neutral-600 hover:text-black'
                }`}
                title="Large Font Size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 text-xs font-extrabold rounded-xs cursor-pointer ${
                  fontSize === 'xlarge' ? 'bg-[#111111] text-white' : 'text-neutral-600 hover:text-black'
                }`}
                title="Extra Large Font Size"
              >
                A++
              </button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-1.5">
            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-sm bg-[#25D366] text-white hover:opacity-90 transition-opacity"
              title="Share on WhatsApp"
            >
              <span className="text-[11px] font-bold px-1">WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-sm bg-[#1877F2] text-white hover:opacity-90 transition-opacity"
              title="Share on Facebook"
            >
              <span className="text-[11px] font-bold px-1">Facebook</span>
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-sm bg-[#24A1DE] text-white hover:opacity-90 transition-opacity"
              title="Share on Telegram"
            >
              <span className="text-[11px] font-bold px-1">Telegram</span>
            </a>

            {/* X / Twitter */}
            <a
              href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-sm bg-black text-white hover:opacity-90 transition-opacity"
              title="Share on X"
            >
              <span className="text-[11px] font-bold px-1">X</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-sm bg-neutral-200 text-neutral-800 hover:bg-neutral-300 transition-colors flex items-center gap-1 text-[11px] font-medium cursor-pointer"
              title="இணைப்பை நகலெடு"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'நகலெடுக்கப்பட்டது!' : 'நகல்'}</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-sm bg-neutral-200 text-neutral-800 hover:bg-neutral-300 transition-colors cursor-pointer"
              title="அச்சிடுக"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Featured Image with Caption */}
      <figure className="mb-8">
        <div className="aspect-16/9 w-full bg-neutral-900 rounded-sm overflow-hidden">
          <img
            src={article.featuredImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-xs text-neutral-500 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 italic">
          <span>{article.imageCaption || article.title}</span>
          <span className="text-neutral-400 not-italic font-mono text-[11px]">
            படம்: {(article.photographerCredit || 'சுடர் மீடியா').replace(/cineulagam/gi, 'சுடர் மீடியா').replace(/சினி\s*உலகம்/gi, 'சுடர் மீடியா')}
          </span>
        </figcaption>
      </figure>

      {/* Key Highlights Deck */}
      <div className="bg-neutral-50 border-l-4 border-[#C8102E] p-4 sm:p-5 rounded-r-sm mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8102E] mb-1.5">
          {language === 'ta' ? 'செய்திச் சுருக்கம்' : 'KEY HIGHLIGHTS'}
        </h4>
        <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-medium">
          {language === 'ta' ? article.summary : (article.summaryEn || article.summary)}
        </p>
      </div>

      {/* Main Article Body Content */}
      <div
        className={`article-prose prose prose-neutral max-w-none text-neutral-800 ${fontClass} mb-10`}
        dangerouslySetInnerHTML={{
          __html: (() => {
            const raw = article.content || '';
            // Strip any external source attribution or CineUlagam mentions
            const stripped = raw
              .replace(/<[^>]*>.*?மூல\s*செய்தி.*?<\/[^>]*>/gi, '')
              .replace(/<[^>]*>.*?CineUlagam.*?<\/[^>]*>/gi, '')
              .replace(/மூல\s*செய்தி[^\n<]*/gi, '')
              .replace(/செய்தி\s*மூலம்[^\n<]*/gi, '')
              .replace(/மூலம்:[^\n<]*/gi, '')
              .replace(/CineUlagam(\s*\(சினிஉலகம்\))?/gi, '')
              .replace(/சினி\s*உலகம்/gi, '')
              .trim();

            if (stripped.includes('<p') || stripped.includes('<div') || stripped.includes('<h')) {
              return stripped;
            }
            return stripped
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((p) => `<p>${p.trim()}</p>`)
              .join('');
          })()
        }}
      />

      {/* Tags List */}
      {(() => {
        const cleanTags = (article.tags || []).filter(
          (t) => !/cineulagam|சினி\s*உலகம்/i.test(t)
        );
        if (cleanTags.length === 0) return null;

        return (
          <div className="flex flex-wrap items-center gap-2 pt-4 pb-6 border-t border-neutral-200">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">குறிச்சொற்கள்:</span>
            {cleanTags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-neutral-600 hover:text-[#C8102E] transition-colors cursor-pointer"
              >
                #{tag}
                {idx < cleanTags.length - 1 && <span className="text-neutral-300 ml-2" aria-hidden="true">·</span>}
              </span>
            ))}
          </div>
        );
      })()}

      {/* Dedicated Post Share Box with Direct Permanent Link */}
      <div className="no-print my-8 p-5 bg-neutral-900 text-white rounded-lg shadow-sm border border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">
              {language === 'ta' ? 'செய்தியைப் பகிர்க' : 'SHARE THIS ARTICLE'}
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5">
              {language === 'ta'
                ? 'உங்கள் நண்பர்கள் & குடும்பத்தினருடன் இந்த செய்தியைப் பகிருங்கள்'
                : 'Share this verified story with friends and family'}
            </h4>
          </div>

          {/* Direct WhatsApp Big Button */}
          <a
            href={`https://api.whatsapp.com/send?text=${shareTitle}%0A${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-md shadow-sm transition-transform active:scale-95 shrink-0"
          >
            <span className="text-sm">💬</span>
            <span>WhatsApp-ல் பகிர்க</span>
          </a>
        </div>

        {/* Permanent URL display and 1-tap Copy */}
        <div className="bg-neutral-950 p-2.5 rounded-md border border-neutral-800 flex items-center justify-between gap-2 mb-3">
          <div className="font-mono text-xs text-neutral-300 truncate select-all flex-1">
            {directArticleUrl}
          </div>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'நகலெடுக்கப்பட்டது!' : 'இணைப்பை நகலெடு'}</span>
          </button>
        </div>

        {/* Social Share Grid */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#1877F2] hover:opacity-90 text-white text-xs font-bold rounded flex items-center gap-1"
          >
            <span>Facebook</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#24A1DE] hover:opacity-90 text-white text-xs font-bold rounded flex items-center gap-1"
          >
            <span>Telegram</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded border border-neutral-700 flex items-center gap-1"
          >
            <span>X (Twitter)</span>
          </a>

          <button
            onClick={handleNativeShare}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded border border-neutral-700 flex items-center gap-1 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'மேலும் பகிர' : 'More...'}</span>
          </button>
        </div>
      </div>

      {/* Inline Advertisement Banner */}
      {inlineAd && (
        <div className="no-print my-8 p-4 bg-neutral-100 border border-neutral-200 rounded-sm text-center">
          <span className="text-[9px] uppercase tracking-wider text-neutral-400 block mb-2">
            விளம்பரம் (ADVERTISEMENT)
          </span>
          <div
            onClick={() => {
              recordAdClick(inlineAd.id);
              window.open(inlineAd.targetUrl, '_blank', 'noopener,noreferrer');
            }}
            className="cursor-pointer group"
          >
            <img
              src={inlineAd.imageUrl}
              alt={inlineAd.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-48 object-cover rounded-xs"
            />
            <div className="mt-2 text-xs font-bold text-neutral-800 group-hover:text-[#C8102E] flex items-center justify-center gap-1">
              <span>{inlineAd.title}</span>
              <ExternalLink className="w-3 h-3 text-[#C8102E]" />
            </div>
          </div>
        </div>
      )}

      {/* Author Card Box */}
      <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-sm flex items-start gap-4 mb-10">
        <img
          src={article.authorAvatar}
          alt={article.authorName}
          referrerPolicy="no-referrer"
          className="w-14 h-14 rounded-full object-cover border-2 border-neutral-300 shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-neutral-900">{article.authorName}</h4>
            <span className="text-xs text-[#C8102E] font-medium">{article.authorRole}</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed mb-2">
            சுடர் மீடியாவின் களச் செய்தியாளர். அரசியல், பொருளாதாரம் மற்றும் சமூகவியல் சார்ந்து கள ஆய்வுக் கட்டுரைகளை எழுதுபவர்.
          </p>
          <span className="text-[11px] text-neutral-400">
            இடம்: {article.location} · தொடர்புக்கு: editorial@chudarmedia.com
          </span>
        </div>
      </div>

      {/* Interactive Comments Section */}
      <section className="no-print pt-6 border-t-2 border-neutral-900 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#C8102E]" />
            <h3 className="text-lg sm:text-xl font-bold font-serif-tamil text-neutral-900">
              {language === 'ta' ? 'வாசகர் கருத்துக்கள்' : 'READER COMMENTS'}
            </h3>
            <span className="text-xs font-mono text-neutral-500">
              ({comments.length})
            </span>
          </div>
          <span className="text-xs text-neutral-500">
            {language === 'ta' ? 'கருத்துக்கள் உடனுக்குடன் சரிபார்க்கப்படும்' : 'Moderated Discussion'}
          </span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="bg-neutral-50 p-4 sm:p-5 rounded-sm border border-neutral-200 mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
            {language === 'ta' ? 'உங்கள் கருத்தைப் பதிவு செய்யுங்கள்' : 'LEAVE A COMMENT'}
          </h4>

          {commentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs mb-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{language === 'ta' ? 'உங்கள் கருத்து வெற்றிகரமாக பதிவு செய்யப்பட்டது!' : 'Comment posted successfully!'}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-neutral-600 font-medium block mb-1">
                {language === 'ta' ? 'உங்கள் பெயர் *' : 'Your Name *'}
              </label>
              <input
                type="text"
                required
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                placeholder="எ.கா. கதிர்காமநாதன்"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-600 font-medium block mb-1">
                {language === 'ta' ? 'மின்னஞ்சல் (வெளிப்படையாகத் தெரியாது)' : 'Email (Private)'}
              </label>
              <input
                type="email"
                value={newCommentEmail}
                onChange={(e) => setNewCommentEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-neutral-600 font-medium block mb-1">
              {language === 'ta' ? 'கருத்து விவரம் *' : 'Comment Message *'}
            </label>
            <textarea
              required
              rows={3}
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              placeholder="செய்தி குறித்த உங்கள் கருத்துக்களை பண்பான முறையில் பகிருங்கள்..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'கருத்தை வெளியிடுக' : 'POST COMMENT'}</span>
          </button>
        </form>

        {/* Comments List */}
        <div className="flex flex-col gap-4">
          {comments.map((comm) => (
            <div key={comm.id} className="p-4 bg-white border border-neutral-200 rounded-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-xs text-neutral-900">{comm.authorName}</div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  {new Date(comm.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed mb-3">
                {comm.content}
              </p>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <button
                  onClick={() => handleLikeComment(comm.id)}
                  className="flex items-center gap-1 hover:text-[#C8102E] transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono">{comm.likes || 0}</span>
                </button>
                <span className="text-[11px] text-neutral-400">சரிபார்க்கப்பட்ட வாசகர்</span>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-6 text-neutral-500 text-xs italic">
              முதல் வாசகராக உங்கள் கருத்தைப் பதிவு செய்யுங்கள்.
            </div>
          )}
        </div>
      </section>

      {/* Related News Section */}
      <section className="no-print pt-6 border-t-2 border-neutral-900">
        <h3 className="text-lg sm:text-xl font-bold font-serif-tamil text-neutral-900 mb-6">
          {language === 'ta' ? 'தொடர்புடைய முக்கியச் செய்திகள்' : 'RELATED STORIES'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedArticles.map((rel) => (
            <div
              key={rel.id}
              onClick={() => onSelectArticle(rel)}
              className="group cursor-pointer flex flex-col bg-white border border-neutral-200 rounded-sm overflow-hidden hover:border-neutral-300 transition-all"
            >
              <div className="aspect-16/10 w-full overflow-hidden bg-neutral-900">
                <img
                  src={rel.featuredImage}
                  alt={rel.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3 flex flex-col justify-between flex-1">
                <h4 className="text-xs font-bold font-serif-tamil text-neutral-900 group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug mb-2">
                  {language === 'ta' ? rel.title : (rel.titleEn || rel.title)}
                </h4>
                <span className="text-[10px] text-neutral-400">
                  {formatDateTime(rel.publishedAt).split(',')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
