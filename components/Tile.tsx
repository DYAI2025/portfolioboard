import React, { useState, useRef, useEffect } from 'react';
import { TileConfig, TileSize, TileType } from '../types';
import { playChord } from '../utils/sound';
import { Edit2 } from 'lucide-react';

interface TileProps {
  config: TileConfig;
  forceHighlight?: boolean;
  isEditMode?: boolean;
  onTileSelect?: (tile: TileConfig) => void;
}

const Tile: React.FC<TileProps> = ({ 
  config, 
  forceHighlight = false,
  isEditMode = false,
  onTileSelect,
}) => {
  const {
    size,
    type,
    active,
    accentColor,
    title,
    subtitle,
    icon,
    value,
    imageUrl,
    videoUrl,
    videoThumbnail,
    backgroundClass,
    link,
    linkTarget,
    shadows,
    soundKey
  } = config;

  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'spectrum'>(config.visualizerStyle || 'bars');
  const [isHovered, setIsHovered] = useState(false);
  const stopSoundRef = useRef<(() => void) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isEffectiveHover = isHovered || forceHighlight;

  const spanClass = {
    [TileSize.SMALL]: 'col-span-1 row-span-1',
    [TileSize.WIDE]: 'col-span-2 row-span-1',
    [TileSize.TALL]: 'col-span-1 row-span-2',
    [TileSize.LARGE]: 'col-span-2 row-span-2',
  }[size];

  const glowColorClass = {
    blue: 'from-blue-600 via-blue-500 to-blue-400',
    purple: 'from-violet-600 via-violet-500 to-purple-400',
    white: 'from-white via-neutral-100 to-neutral-300',
    orange: 'from-orange-600 via-orange-500 to-orange-400',
    green: 'from-emerald-600 via-emerald-500 to-emerald-400',
  }[accentColor || 'white'];

  const defaultGradient = active
    ? 'bg-gradient-to-b from-[#2e2e2e] to-[#1a1a1a]'
    : 'bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f]';

  const surfaceClass = backgroundClass || defaultGradient;

  const activeBorderClass = {
    blue: 'ring-blue-400/50',
    purple: 'ring-violet-400/50',
    white: 'ring-white/50',
    orange: 'ring-orange-400/50',
    green: 'ring-emerald-400/50',
  }[accentColor || 'white'];

  const bevelClass = active
    ? `shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.05)] ring-1 ${activeBorderClass}`
    : 'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.02)] ring-1 ring-white/5';

  const activeShadowClass = {
    blue: 'shadow-[0_0_50px_-12px_rgba(59,130,246,1)]',
    purple: 'shadow-[0_0_50px_-12px_rgba(139,92,246,1)]',
    white: 'shadow-[0_0_50px_-12px_rgba(255,255,255,0.8)]',
    orange: 'shadow-[0_0_50px_-12px_rgba(249,115,22,1)]',
    green: 'shadow-[0_0_50px_-12px_rgba(16,185,129,1)]',
  }[accentColor || 'white'];

  const shadowClass = active ? activeShadowClass : '';

  const customBoxShadow = (() => {
    if (!shadows) return undefined;
    if (active && shadows.active) return shadows.active;
    if (isEffectiveHover && shadows.hover) return shadows.hover;
    return shadows.default;
  })();

  const activeTintClass = {
    blue: 'from-blue-500/10 to-transparent',
    purple: 'from-violet-500/10 to-transparent',
    white: 'from-white/10 to-transparent',
    orange: 'from-orange-500/10 to-transparent',
    green: 'from-emerald-500/10 to-transparent',
  }[accentColor || 'white'];

  const glowOpacityState = (active || isEffectiveHover)
    ? 'opacity-100'
    : 'opacity-10 group-hover:opacity-40';

  const activeGlowBlur = (active || isEffectiveHover) ? 'blur-2xl' : 'blur-xl';
  const indicatorColor = (active || isEffectiveHover) ? 'text-white' : 'text-neutral-500';

  useEffect(() => {
    if (!videoRef.current) return;
    if (isEffectiveHover) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {});
      }
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isEffectiveHover]);

  useEffect(() => {
    if (forceHighlight && soundKey) {
       if (stopSoundRef.current) stopSoundRef.current();
       stopSoundRef.current = playChord(soundKey);
    }
    return () => {
       if (forceHighlight && stopSoundRef.current) {
         stopSoundRef.current();
         stopSoundRef.current = null;
       }
    };
  }, [forceHighlight, soundKey]);

  const Tag = link ? 'a' : 'div';

  const handleInteraction = (e: React.MouseEvent) => {
    if (link) return;
    if (type === TileType.AUDIO && active) {
      e.preventDefault();
      setVisualizerMode(prev => {
        if (prev === 'bars') return 'wave';
        if (prev === 'wave') return 'spectrum';
        return 'bars';
      });
    }
    if (type === TileType.VIDEO && videoUrl && videoRef.current) {
      e.preventDefault();
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
        videoRef.current.muted = false;
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen();
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditMode && onTileSelect) {
      onTileSelect(config);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!forceHighlight && soundKey) {
      if (stopSoundRef.current) stopSoundRef.current();
      stopSoundRef.current = playChord(soundKey);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!forceHighlight && stopSoundRef.current) {
      stopSoundRef.current();
      stopSoundRef.current = null;
    }
  };

  const renderVisualizer = () => {
    const barBase = "bg-current rounded-full shadow-[0_0_10px_currentColor] transition-all duration-300 ease-in-out";
    if (visualizerMode === 'wave') {
      return (
        <div className={`flex items-end gap-[3px] h-5 mb-1 ${indicatorColor}`} title="Wave">
           {[0, 1, 2, 3, 4].map((i) => (
             <div key={i} className={`w-1 ${barBase} ${isEffectiveHover ? 'animate-wave-slow' : 'h-1.5'}`} style={isEffectiveHover ? { animationDelay: `${i * 0.15}s` } : undefined} />
           ))}
        </div>
      );
    }
    if (visualizerMode === 'spectrum') {
      return (
         <div className={`flex items-end gap-[2px] h-6 mb-1 ${indicatorColor}`} title="Spectrum">
             {[1, 2, 4, 3, 1, 4].map((n, i) => (
                <div key={i} className={`w-[3px] ${barBase} ${isEffectiveHover ? `animate-spec-${n}` : 'h-1'}`} />
             ))}
         </div>
      );
    }
    return (
       <div className={`flex items-end gap-1 h-5 mb-1 ${indicatorColor}`} title="Bars">
           {[1, 2, 3, 4].map((n, i) => (
             <div key={i} className={`w-1 ${barBase} ${isEffectiveHover ? `animate-eq-${n}` : 'h-1.5'}`} />
           ))}
       </div>
    );
  };

  const effectiveImage = videoThumbnail || imageUrl;
  const hasBackgroundMedia = Boolean(effectiveImage || videoUrl);
  const isVideoVisible = videoUrl && (isEffectiveHover || !effectiveImage);
  const isImageVisible = effectiveImage && !isVideoVisible;
  const containerBgClass = hasBackgroundMedia ? 'bg-black' : surfaceClass;

  const scaleClass = isEffectiveHover
    ? '-translate-y-1 scale-[1.01] z-30'
    : 'group-hover:-translate-y-1 group-hover:scale-[1.01] z-20 hover:z-30';

  return (
    <div
      className={`relative group ${spanClass} select-none ${scaleClass} transition-all duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      {isEditMode && (
        <div className="absolute -top-2 -right-2 z-50 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center shadow-lg animate-in fade-in zoom-in duration-200">
          <Edit2 size={14} className="text-white" />
        </div>
      )}

      <div
        className={`absolute -inset-1 bg-gradient-to-br ${glowColorClass} rounded-[30px] ${activeGlowBlur} transition-opacity duration-300 ease-out ${glowOpacityState}`}
      />

      <Tag
        href={link}
        target={link ? (linkTarget || '_blank') : undefined}
        rel={link ? "noopener noreferrer" : undefined}
        onClick={handleInteraction}
        className={`
          relative h-full w-full block
          rounded-[24px]
          ${containerBgClass}
          ${!customBoxShadow ? bevelClass : ''}
          ${!customBoxShadow ? shadowClass : ''}
          flex flex-col overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
          active:scale-[0.98] active:translate-y-0
          cursor-pointer no-underline
        `}
        style={customBoxShadow ? { boxShadow: customBoxShadow } : undefined}
      >
        <div
            className="absolute inset-0 z-[2] opacity-[0.04] pointer-events-none mix-blend-overlay"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px'
            }}
        />

        {effectiveImage && (
           <img
            src={effectiveImage}
            alt={title}
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-0
              ${isImageVisible ? 'opacity-60 group-hover:opacity-80' : 'opacity-0'}
              ${forceHighlight ? '!opacity-80' : ''}
            `}
          />
        )}

        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-0
              ${isVideoVisible ? 'opacity-100' : 'opacity-0'}
            `}
          />
        )}

        {hasBackgroundMedia && (
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0 pointer-events-none" />
        )}

        {active && (
          <div className={`absolute inset-0 bg-gradient-to-br ${activeTintClass} pointer-events-none z-0 mix-blend-overlay`} />
        )}

        <div className="flex flex-col justify-between h-full p-5 z-10 relative">
          <div className="flex justify-between items-start">
            {icon && (
              <div className={`
                p-2 rounded-full
                ${(active || hasBackgroundMedia) ? 'bg-white/10 text-white backdrop-blur-md border border-white/10' : 'bg-[#2a2a2a] text-neutral-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.05)]'}
                group-hover:text-white group-hover:bg-white/20 transition-all duration-300
                ${forceHighlight ? '!text-white !bg-white/20' : ''}
              `}>
                {icon}
              </div>
            )}

            {type === TileType.NUMBER && (
               <span className={`text-4xl font-light tracking-tighter ${active ? 'text-white drop-shadow-glow' : 'text-neutral-200'}`}>
                 {value}
               </span>
            )}

            {type === TileType.AUDIO && active && renderVisualizer()}

            {active && type !== TileType.NUMBER && type !== TileType.AUDIO && !hasBackgroundMedia && (
              <div className={`w-2 h-2 rounded-full bg-${accentColor === 'blue' ? 'blue' : 'violet'}-400 shadow-[0_0_10px_currentColor] ring-1 ring-white/30`} />
            )}

            {type === TileType.VIDEO && !icon && !link && (
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                 <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            )}
          </div>

          <div>
            {type === TileType.AUDIO && (
               <div className="w-full bg-black/40 h-1 rounded-full mb-3 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                  <div className="bg-white/80 h-full w-1/3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
               </div>
            )}

            <h3 className={`font-medium tracking-wide ${size === TileSize.WIDE || size === TileSize.LARGE ? 'text-xl' : 'text-base'} text-neutral-100 group-hover:text-white transition-colors drop-shadow-md ${forceHighlight ? '!text-white' : ''}`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-neutral-400 text-xs mt-1 group-hover:text-neutral-200 transition-colors font-medium ${forceHighlight ? '!text-neutral-200' : ''}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </Tag>
    </div>
  );
};

export default Tile;
