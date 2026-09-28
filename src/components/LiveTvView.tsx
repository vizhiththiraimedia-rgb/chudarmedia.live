import React, { useState } from 'react';
import { Tv, Radio, Calendar, Clock, User, Share2, Volume2, ShieldCheck, ChevronRight } from 'lucide-react';
import { LiveStreamConfig } from '../types';

interface LiveTvViewProps {
  config: LiveStreamConfig;
  onGoHome: () => void;
  language: 'ta' | 'en';
}

export const LiveTvView: React.FC<LiveTvViewProps> = ({ config, onGoHome, language }) => {
  const [streamVolume, setStreamVolume] = useState(true);

  // Parse stream URL to decide if YouTube embed or direct video
  const isYouTube = config.streamUrl.includes('youtube.com') || config.streamUrl.includes('youtu.be');

  // Video bulletins archive
  const bulletins = [
    {
      time: 'இன்று 12:00 PM',
      title: 'மதியச் சுடர்: கொழும்பு துறைமுக விவகாரம் மற்றும் உலகச் செய்திகள்',
      views: '4.2K'
    },
    {
      time: 'இன்று 08:00 AM',
      title: 'காலைச் சுடர்: தமிழக சட்டப்பேரவை நேரடி விவாதங்கள் மற்றும் செய்திகள்',
      views: '6.8K'
    },
    {
      time: 'நேற்று 09:00 PM',
      title: 'பிரைம் டைம் இரவுச் சுடர்: ஆசியக் கிண்ண கிரிக்கெட் சிறப்பாய்வு',
      views: '12.4K'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-[#C8102E] transition-colors cursor-pointer"
          >
            ← {language === 'ta' ? 'முகப்பு' : 'Home'}
          </button>
          <span className="text-neutral-300">/</span>
          <span className="text-xs sm:text-sm font-bold text-[#C8102E] uppercase">
            CHUDAR TV 24/7 LIVE
          </span>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          {config.isLive ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#C8102E] text-white text-xs font-black uppercase rounded-sm tracking-wider animate-pulse shadow-xs">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>ON AIR · நேரலை</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-neutral-700 text-white text-xs font-semibold rounded-sm">
              <span>நேரலை இடைவேளை</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Player (8 Cols) + Live Schedule (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-12">
        {/* Live Player Container */}
        <div className="lg:col-span-8 flex flex-col bg-black text-white rounded-sm overflow-hidden shadow-xl">
          {/* Video Frame */}
          <div className="relative aspect-16/9 w-full bg-neutral-950">
            {config.isLive && config.streamUrl ? (
              isYouTube ? (
                <iframe
                  src={config.streamUrl.includes('?') ? `${config.streamUrl}&autoplay=1` : `${config.streamUrl}?autoplay=1`}
                  title="Chudar TV Live Stream"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={config.streamUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                ></video>
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-900">
                <Radio className="w-12 h-12 text-[#C8102E] mb-3 animate-pulse" />
                <h3 className="text-lg font-bold text-white mb-1">
                  நேரலை தற்சமயம் இடைநிறுத்தப்பட்டுள்ளது
                </h3>
                <p className="text-xs text-neutral-400 max-w-md">
                  அடுத்த நேரலை செய்தி அறிக்கை அட்டவணைப்படி விரைவில் தொடங்கும். முந்தைய செய்தித் தொகுப்புகளை கீழே காணலாம்.
                </p>
              </div>
            )}
          </div>

          {/* Program Information Strip */}
          <div className="p-4 sm:p-6 bg-neutral-900 border-t border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#C8102E] uppercase tracking-wider">
                  தற்போதைய நிகழ்ச்சி:
                </span>
                <h2 className="text-base sm:text-lg font-bold font-serif-tamil text-white">
                  {config.currentProgram}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <User className="w-3.5 h-3.5 text-[#C8102E]" />
                <span>தொகுப்பாளர்: {config.presenter}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
              {config.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>ஸ்ட்ரீம் தரம்: 1080p 60fps Full HD</span>
              </div>
              <div className="flex items-center gap-3">
                <span>கொழும்பு · சென்னை ஸ்டுடியோஸ்</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Broadcast Schedule (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white border border-neutral-200 rounded-sm p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-neutral-200">
              <Calendar className="w-4 h-4 text-[#C8102E]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                {language === 'ta' ? 'இன்றைய ஒளிபரப்பு அட்டவணை' : 'BROADCAST SCHEDULE'}
              </h3>
            </div>

            <div className="divide-y divide-neutral-100">
              {config.schedule.map((item, idx) => (
                <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-[#C8102E]">{item.time}</span>
                    <span className="text-[10px] text-neutral-500 uppercase">{item.category}</span>
                  </div>
                  <div className="font-semibold text-xs text-neutral-800 leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    தொகுப்பு: {item.host}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Bulletins Archive */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-sm p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
              முந்தைய செய்தித் தொகுப்புகள் (ARCHIVE)
            </h4>
            <div className="flex flex-col gap-2">
              {bulletins.map((b, i) => (
                <div key={i} className="p-2.5 bg-white border border-neutral-200 rounded text-xs cursor-pointer hover:border-[#C8102E] transition-colors">
                  <span className="text-[10px] text-[#C8102E] font-mono block mb-0.5">{b.time}</span>
                  <div className="font-medium text-neutral-800 line-clamp-1">{b.title}</div>
                  <div className="text-[10px] text-neutral-400 mt-1">{b.views} பார்வைகள்</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
