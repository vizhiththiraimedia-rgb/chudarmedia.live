import React, { useState } from 'react';
import { Camera, Play, Video, X, Maximize2, Sparkles, Film } from 'lucide-react';
import { Article, VideoTrailer } from '../types';
import { getVideoTrailers } from '../services/storage';

interface SpecialSectionsProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  language: 'ta' | 'en';
  videoTrailers?: VideoTrailer[];
}

export const SpecialSections: React.FC<SpecialSectionsProps> = ({
  articles,
  onSelectArticle,
  language,
  videoTrailers: propVideoTrailers
}) => {
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; title: string; caption: string } | null>(null);

  // Dynamic Video Trailers from props or reactive storage
  const activeVideoTrailers = propVideoTrailers && propVideoTrailers.length > 0
    ? propVideoTrailers
    : getVideoTrailers();

  // Cinema Celebrity & Movie Stills Photo Gallery
  const photoGallery = [
    {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      title: 'நயன்தாரா பிரத்யேக போட்டோஷூட் ஸ்டில்ஸ்',
      caption: 'புதிய பான்-இந்திய திரைப்படத்திற்கான பிரத்யேக கெட்டப்',
      location: 'சென்னை'
    },
    {
      url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
      title: 'தளபதி விஜய் திரைப்பட போஸ்டர் ரிலீஸ் விழா',
      caption: 'ரசிகர்கள் கொண்டாடிய பிரம்மாண்ட கட்-அவுட் மற்றும் டிரெய்லர் காட்சி',
      location: 'ரோஹினி தியேட்டர், சென்னை'
    },
    {
      url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1200&q=80',
      title: '‘மண்ணின் மைந்தன்’ ஈழத்து சினிமா படப்பிடிப்பு காட்சிகள்',
      caption: 'மன்னார் கடற்கரை மற்றும் யாழ்ப்பாணத்து கிராமத்து வாழ்வியல் தருணங்கள்',
      location: 'மன்னார் & யாழ்ப்பாணம்'
    },
    {
      url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
      title: 'அஜித் குமார் ‘விடாமுயற்சி’ சர்வதேச தியேட்டர் ரிலீஸ்',
      caption: 'இலங்கை, மலேசியா மற்றும் லண்டன் திரையரங்குகளில் ரசிகர்கள் கொண்டாட்டம்',
      location: 'கொழும்பு & மலேசியா'
    }
  ];

  return (
    <section className="my-10 flex flex-col gap-10">
      {/* 1. Trailers & Cinema Video Showcases */}
      <div className="bg-[#111111] text-white p-5 sm:p-7 rounded-sm">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#C8102E]" />
            <h2 className="text-lg sm:text-xl font-black font-serif-tamil tracking-tight text-white flex items-center gap-2">
              <span>{language === 'ta' ? 'புதிய டிரெய்லர்கள் & வீடியோ பேட்டிகள்' : 'TRAILERS & EXCLUSIVE INTERVIEWS'}</span>
            </h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            Full HD 4K Trailers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeVideoTrailers.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveVideoModal(vid.embedId)}
              className="group cursor-pointer flex flex-col bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden hover:border-neutral-700 transition-all"
            >
              <div className="relative aspect-16/9 w-full bg-neutral-950 overflow-hidden">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white font-mono text-[10px] rounded">
                  {vid.duration}
                </span>
                {vid.category && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#C8102E] text-white text-[10px] font-bold uppercase rounded shadow-xs">
                    {vid.category}
                  </span>
                )}
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <h3 className="text-xs sm:text-sm font-bold font-serif-tamil text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                  {language === 'ta' ? vid.title : vid.titleEn}
                </h3>
                <div className="text-[11px] text-neutral-400 mt-2 flex items-center justify-between">
                  <span className="text-neutral-300 font-semibold text-[10px]">
                    {vid.category || (language === 'ta' ? 'சுடர் சினிமா வீடியோ' : 'Cinema Video')}
                  </span>
                  <span className="text-amber-400 font-semibold group-hover:underline">
                    {language === 'ta' ? 'டிரெய்லர் பார்க்க ▶' : 'Watch Now ▶'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Celebrity Photos & Stills Gallery */}
      <div className="bg-white border border-neutral-200 p-5 sm:p-7 rounded-sm">
        <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-neutral-900">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#C8102E]" />
            <h2 className="text-lg sm:text-xl font-black font-serif-tamil tracking-tight text-[#111111]">
              {language === 'ta' ? 'திரைப்படப் புகைப்படங்கள் & போட்டோஷூட்' : 'MOVIE STILLS & PHOTO GALLERY'}
            </h2>
          </div>
          <span className="text-xs text-neutral-500">
            {language === 'ta' ? 'பிரத்யேக புகைப்படத் தொகுப்பு' : 'Celebrity Photos'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {photoGallery.map((photo, i) => (
            <div
              key={i}
              onClick={() => setActivePhotoModal(photo)}
              className="group cursor-pointer relative aspect-4/3 overflow-hidden rounded-xs bg-neutral-900 border border-neutral-200"
            >
              <img
                src={photo.url}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <div className="text-[10px] text-amber-300 font-mono mb-0.5">{photo.location}</div>
                <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">
                  {photo.title}
                </h4>
                <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-300">
                  <span>பெரிதாக்க சொடுக்கவும்</span>
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-neutral-800 text-white hover:bg-[#C8102E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-16/9 w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoModal}?autoplay=1`}
                title="Cinema Trailer"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-neutral-900 text-white rounded overflow-hidden shadow-2xl">
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-800 text-white hover:bg-[#C8102E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[75vh] w-full flex items-center justify-center bg-black">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] max-w-full object-contain"
              />
            </div>
            <div className="p-4 sm:p-5 bg-neutral-900 border-t border-neutral-800">
              <h3 className="text-base font-bold font-serif-tamil text-white mb-1">
                {activePhotoModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                {activePhotoModal.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
