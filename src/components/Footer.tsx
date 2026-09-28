import React from 'react';
import { Logo } from './Logo';
import { Category, SiteSettings } from '../types';
import { Mail, Phone, MapPin, ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  categories: Category[];
  siteSettings: SiteSettings;
  onSelectCategory: (categoryId: string) => void;
  onOpenPage: (page: string) => void;
  onOpenAdminLogin: () => void;
  language: 'ta' | 'en';
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  siteSettings,
  onSelectCategory,
  onOpenPage,
  onOpenAdminLogin,
  language
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print bg-[#111111] text-neutral-300 pt-12 pb-8 border-t-4 border-[#C8102E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Tier: Logo & Mission Statement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-neutral-800">
          {/* Brand Info (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Logo variant="dark" size="lg" showTagline={true} customLogoUrl={siteSettings.logoUrl} />
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-md">
              சுடர் மீடியா சினிமா (CHUDAR MEDIA CINEMA) – தமிழ் சினிமா, இலங்கை சினிமா, சிங்கள சினிமா, இந்திய மற்றும் உலகத் திரைப்படங்களுக்கான சர்வதேச தரத்திலான முன்னணி டிஜிட்டல் பொழுதுபோக்குத் தளம்.
            </p>
            <div className="flex flex-col gap-1 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                <span>{siteSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                <span>{siteSettings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                <span>{siteSettings.contactPhone}</span>
              </div>
            </div>
          </div>

          {/* Quick Cinema Categories Links (4 Cols) */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 pb-1 border-b border-neutral-800 flex items-center justify-between">
              <span>{language === 'ta' ? 'சினிமாப் பிரிவுகள்' : 'CINEMA CATEGORIES'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    scrollToTop();
                  }}
                  className="text-left text-neutral-400 hover:text-white hover:translate-x-1 transition-all cursor-pointer py-1"
                >
                  {language === 'ta' ? cat.nameTa : cat.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* Institutional Policies & Social Links (3 Cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 pb-1 border-b border-neutral-800">
              {language === 'ta' ? 'பொறுப்பு & கொள்கைகள்' : 'EDITORIAL & ABOUT'}
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onOpenPage('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  எங்களைப் பற்றி (About Us)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('editorial-policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  விமர்சனக் கொள்கை (Review Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('advertise')}
                  className="hover:text-white transition-colors cursor-pointer text-[#C8102E] font-semibold"
                >
                  திரைப்பட விளம்பரங்களுக்கு (Movie Promos)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  தனியுரிமைக் கொள்கை (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPage('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  தொடர்புகளுக்கு (Contact)
                </button>
              </li>
            </ul>

            {/* Social channels */}
            <div className="mt-4">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                இணைந்திருங்கள்:
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={siteSettings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-neutral-800 hover:bg-[#FF0000] text-white flex items-center justify-center transition-colors text-xs font-bold"
                  title="YouTube"
                >
                  YT
                </a>
                <a
                  href={siteSettings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-neutral-800 hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors text-xs font-bold"
                  title="Facebook"
                >
                  FB
                </a>
                <a
                  href={siteSettings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-neutral-800 hover:bg-black text-white flex items-center justify-center transition-colors text-xs font-bold"
                  title="X (Twitter)"
                >
                  X
                </a>
                <a
                  href={siteSettings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded bg-neutral-800 hover:bg-[#25D366] text-white flex items-center justify-center transition-colors text-xs font-bold"
                  title="WhatsApp"
                >
                  WA
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span onDoubleClick={onOpenAdminLogin} className="select-none cursor-default">
              © {new Date().getFullYear()} CHUDAR MEDIA CINEMA. All rights reserved.
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>பிரதம ஆசிரியர்: {siteSettings.editorInChief}</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-[#C8102E] text-neutral-300 hover:text-white transition-colors cursor-pointer text-xs font-medium"
          >
            <span>மேலே செல்க</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
