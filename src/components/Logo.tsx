import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  customLogoUrl?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  showTagline = false,
  customLogoUrl
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';
  const subTextSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]';

  const textColor = variant === 'dark' ? 'text-white' : 'text-[#111111]';
  const taglineColor = variant === 'dark' ? 'text-neutral-400' : 'text-[#666666]';

  // If user provided custom logo URL
  if (customLogoUrl && customLogoUrl.trim() !== '') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img
          src={customLogoUrl}
          alt="Chudar Media Logo"
          referrerPolicy="no-referrer"
          className="h-9 sm:h-11 object-contain"
        />
        {showTagline && (
          <div className="hidden sm:flex flex-col text-left pl-2 border-l border-neutral-300">
            <span className="text-[10px] font-bold text-[#C8102E]">சுடர் சினிமா</span>
            <span className={`text-[9px] ${taglineColor}`}>சினிமாவின் ஒளி... ரசிகர்களின் குரல்!</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Flame Icon Symbol (சுடர்) */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Flame Base Badge */}
          <rect width="40" height="40" rx="9" fill="#C8102E" />
          
          {/* Dynamic Flame / Torch Rays */}
          <path
            d="M20 6C20 6 25 12.5 25 18C25 21 23.5 23 21.5 24C24 24 27 21.5 27.5 19C29 23.5 26.5 28 23.5 30.5C20.5 33 15.5 33 13 30C10.5 27.5 10 23 12 19C12 19 13 21.5 15 22.5C15 19 16.5 14 20 6Z"
            fill="#FFAA00"
          />
          <path
            d="M20 15C20 15 22.5 18.5 22.5 21.5C22.5 23.5 21 25 19.5 26C18 24.5 17.5 23 18 21.5C18.5 19.5 19.5 17.5 20 15Z"
            fill="#FFFFFF"
          />
          <circle cx="20" cy="11" r="1.5" fill="#FFF4D0" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-extrabold tracking-tight font-display ${textSize} ${textColor}`}>
            CHUDAR
          </span>
          <span className={`font-black tracking-wider ${textSize} text-[#C8102E]`}>
            CINEMA
          </span>
        </div>
        
        {/* Tamil Brand Sub-kicker */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`font-semibold tracking-wide ${subTextSize} text-[#C8102E]`}>
            சுடர் சினிமா
          </span>
          {showTagline && (
            <>
              <span className="text-neutral-300 text-[10px]" aria-hidden="true">·</span>
              <span className={`font-medium ${subTextSize} ${taglineColor} hidden sm:inline`}>
                சினிமாவின் ஒளி... ரசிகர்களின் குரல்!
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
