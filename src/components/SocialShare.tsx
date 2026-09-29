import React, { useState } from 'react';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';

export interface SocialShareProps {
  url: string;
  title: string;
  summary?: string;
  variant?: 'compact' | 'full' | 'buttons-only' | 'floating';
  language?: 'ta' | 'en';
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  summary,
  variant = 'compact',
  language = 'ta',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const cleanUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(cleanUrl);
  const encodedTitle = encodeURIComponent(title || '');
  const whatsappText = encodeURIComponent(`${title ? title + '\n\n' : ''}${cleanUrl}`);

  const handleCopyLink = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(cleanUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = cleanUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary || title,
          url: cleanUrl
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // WhatsApp Icon SVG
  const WhatsAppIcon = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );

  // Facebook Icon SVG
  const FacebookIcon = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  // Twitter / X Icon SVG
  const TwitterXIcon = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  // 1. Compact Variant (For top toolbar next to font resizer & audio reader)
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95"
          title={language === 'ta' ? 'WhatsApp-ல் பகிர்க' : 'Share on WhatsApp'}
        >
          <WhatsAppIcon />
          <span className="hidden xs:inline">WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-[#1877F2] hover:bg-[#166fe5] text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95"
          title={language === 'ta' ? 'Facebook-ல் பகிர்க' : 'Share on Facebook'}
        >
          <FacebookIcon />
          <span className="hidden xs:inline">Facebook</span>
        </a>

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-black hover:bg-neutral-800 text-white text-[11px] font-bold shadow-2xs transition-all active:scale-95"
          title={language === 'ta' ? 'Twitter / X-ல் பகிர்க' : 'Share on Twitter / X'}
        >
          <TwitterXIcon />
          <span className="hidden xs:inline">X</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xs bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-[11px] font-medium transition-colors cursor-pointer"
          title={language === 'ta' ? 'இணைப்பை நகலெடு' : 'Copy link'}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (language === 'ta' ? 'நகலானது!' : 'Copied!') : (language === 'ta' ? 'நகல்' : 'Copy')}</span>
        </button>
      </div>
    );
  }

  // 2. Buttons-Only Variant (Quick grid without boxes)
  if (variant === 'buttons-only') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <a
          href={`https://api.whatsapp.com/send?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-sm shadow-2xs transition-all active:scale-95"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold rounded-sm shadow-2xs transition-all active:scale-95"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-sm shadow-2xs transition-all active:scale-95"
        >
          <TwitterXIcon />
          <span>Twitter / X</span>
        </a>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-sm border border-neutral-700 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'இணைப்பை நகலெடு' : 'Copy Link')}</span>
        </button>

        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-sm border border-neutral-700 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'மேலும்...' : 'More...'}</span>
        </button>
      </div>
    );
  }

  // 3. Full Variant (The dedicated, high-impact post share card)
  return (
    <div className={`p-5 bg-neutral-900 text-white rounded-lg shadow-sm border border-neutral-800 ${className}`}>
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
          href={`https://api.whatsapp.com/send?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-md shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <WhatsAppIcon />
          <span>WhatsApp-ல் பகிர்க</span>
        </a>
      </div>

      {/* Permanent URL display and 1-tap Copy */}
      <div className="bg-neutral-950 p-2.5 rounded-md border border-neutral-800 flex items-center justify-between gap-2 mb-3">
        <div className="font-mono text-xs text-neutral-300 truncate select-all flex-1">
          {cleanUrl}
        </div>
        <button
          onClick={handleCopyLink}
          className="px-3 py-1.5 bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold rounded flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (language === 'ta' ? 'நகலெடுக்கப்பட்டது!' : 'Copied!') : (language === 'ta' ? 'இணைப்பை நகலெடு' : 'Copy Link')}</span>
        </button>
      </div>

      {/* Social Share Grid */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-800">
        <a
          href={`https://api.whatsapp.com/send?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <FacebookIcon />
          <span>Facebook</span>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold rounded border border-neutral-700 flex items-center gap-1.5 transition-colors"
        >
          <TwitterXIcon />
          <span>Twitter / X</span>
        </a>

        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-[#24A1DE] hover:bg-[#2092c7] text-white text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span>Telegram</span>
        </a>

        <button
          onClick={handleNativeShare}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded border border-neutral-700 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'மேலும் பகிர' : 'More...'}</span>
        </button>
      </div>
    </div>
  );
};
