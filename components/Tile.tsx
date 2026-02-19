import React, { useState, useRef, useEffect } from 'react';
import { TileConfig, TileSize, TileType } from '../types';
import { playChord } from '../utils/sound';
import { Edit3, Volume2, VolumeX, Play } from 'lucide-react';

interface TileProps {
  config: TileConfig;
  forceHighlight?: boolean;
  isEditing?: boolean;
  onEdit?: (config: TileConfig) => void;
  onOpenMedia?: (config: TileConfig) => void;
}

const Tile: React.FC<TileProps> = ({ 
  config, 
  forceHighlight = false, 
  isEditing = false, 
  onEdit,
  onOpenMedia
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
    soundKey,
    textAlign,
    showMediaOnHoverOnly
  } = config;

  // Local state for visualizer mode and hover state
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'spectrum'>(config.visualizerStyle || 'bars');
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Derived state: active if hovered OR forced by sequence
  const isEffectiveHover = isHovered || forceHighlight;

  // Refs
  const stopSoundRef = useRef<(() => void) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Grid spanning logic
  const spanClass = {
    [TileSize.SMALL]: 'col-span-1 row-span-1',
    [TileSize.WIDE]: 'col-span-2 row-span-1',
    [TileSize.TALL]: 'col-span-1 row-span-2',
    [TileSize.LARGE]: 'col-span-2 row-span-2',
  }[size];

  // --- STYLING LOGIC ---

  // 1. Backlight Glow
  const glowColorClass = {
    blue: 'from-blue-400 via-blue-500 to-blue-600',
    purple: 'from-violet-400 via-violet-500 to-violet-600',
    white: 'from-white via-neutral-100 to-neutral-300',
    orange: 'from-orange-400 via-orange-500 to-orange-600',
    green: 'from-emerald-400 via-emerald-500 to-emerald-600',
  }[accentColor || 'white'];

  // 2. Surface Gradient (Fallback if no media)
  const defaultGradient = active
    ? 'bg-gradient-to-b from-[#2e2e2e] to-[#1a1a1a]' 
    : 'bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f]';
  
  const surfaceClass = backgroundClass || defaultGradient;

  // 3. Active Border Color Map
  const activeBorderClass = {
    blue: 'ring-blue-400/50',
    purple: 'ring-violet-400/50',
    white: 'ring-white/50',
    orange: 'ring-orange-400/50',
    green: 'ring-emerald-400/50',
  }[accentColor || 'white'];

  // 4. Bevel / Ring
  const bevelClass = active
    ? `shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.05)] ring-1 ${activeBorderClass}`
    : 'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.02)] ring-1 ring-white/5';

  // 5. Ambient Shadow
  const activeShadowClass = {
    blue: 'shadow-[0_0_50px_-12px_rgba(59,130,246,0.6)]',
    purple: 'shadow-[0_0_50px_-12px_rgba(139,92,246,0.6)]',
    white: 'shadow-[0_0_50px_-12px_rgba(255,255,255,0.4)]',
    orange: 'shadow-[0_0_50px_-12px_rgba(249,115,22,0.6)]',
    green: 'shadow-[0_0_50px_-12px_rgba(16,185,129,0.6)]',
  }[accentColor || 'white'];

  const shadowClass = active ? activeShadowClass : '';

  // 6. Custom Shadow Stack
  const customBoxShadow = (() => {
    if (!shadows) return undefined;
    if (active && shadows.active) return shadows.active;
    if (isEffectiveHover && shadows.hover) return shadows.hover;
    return shadows.default;
  })();

  // 7. Active Tint (Internal overlay)
  const activeTintClass = {
    blue: 'from-blue-500/10 to-transparent',
    purple: 'from-violet-500/10 to-transparent',
    white: 'from-white/10 to-transparent',
    orange: 'from-orange-500/10 to-transparent',
    green: 'from-emerald-500/10 to-transparent',
  }[accentColor || 'white'];

  // Animation States
  const glowOpacityState = (active || isEffectiveHover)
    ? 'opacity-100 saturate-200'
    : 'opacity-0 group-hover:opacity-40';
  
  const activeGlowBlur = (active || isEffectiveHover) ? 'blur-3xl' : 'blur-xl'; 
  const indicatorColor = (active || isEffectiveHover) ? 'text-white' : 'text-neutral-500';

  // --- INTERACTION ---
  
  // Video Handling Effect
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isEffectiveHover) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
           // Auto-play might be blocked
        });
      }
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; 
      setIsPlaying(false);
    }
  }, [isEffectiveHover]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  // Programmatic Sound Effect
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

  // Priority: If link exists, it is an Anchor tag. Otherwise Div.
  const Tag = (link && !isEditing) ? 'a' : 'div';
  
  const handleInteraction = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
      if (onEdit) onEdit(config);
      return;
    }

    if (link) return;

    if (type === TileType.AUDIO && active) {
      e.preventDefault();
      setVisualizerMode(prev => {
        if (prev === 'bars') return 'wave';
        if (prev === 'wave') return 'spectrum';
        return 'bars';
      });
      return;
    }

    if ((type === TileType.IMAGE || type === TileType.VIDEO) && onOpenMedia) {
       e.preventDefault();
       onOpenMedia(config);
       return;
    }

    if (type === TileType.VIDEO && videoUrl && videoRef.current && !onOpenMedia) {
      e.preventDefault();
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
        videoRef.current.muted = false; 
      }
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

  // --- SUB-COMPONENT: VISUALIZER ---
  const renderVisualizer = () => {
    const barBase = "bg-current rounded-full shadow-[0_0_10px_currentColor] transition-all duration-300 ease-in-out";

    if (visualizerMode === 'wave') {
      return (
        <div className={`flex items-end gap-[3px] h-5 mb-1 ${indicatorColor}`} title="Wave">
           {[0, 1, 2, 3, 4].map((i) => (
             <div 
               key={i} 
               className={`w-1 ${barBase} ${isEffectiveHover ? 'animate-wave-slow' : 'h-1.5'}`} 
               style={isEffectiveHover ? { animationDelay: `${i * 0.15}s` } : undefined} 
             />
           ))}
        </div>
      );
    }

    if (visualizerMode === 'spectrum') {
      return (
         <div className={`flex items-end gap-[2px] h-6 mb-1 ${indicatorColor}`} title="Spectrum">
             {[1, 2, 4, 3, 1, 4].map((n, i) => (
                <div 
                  key={i}
                  className={`w-[3px] ${barBase} ${isEffectiveHover ? `animate-spec-${n}` : 'h-1'}`}
                />
             ))}
         </div>
      );
    }

    return (
       <div className={`flex items-end gap-1 h-5 mb-1 ${indicatorColor}`} title="Bars">
           {[1, 2, 3, 4].map((n, i) => (
             <div 
               key={i} 
               className={`w-1 ${barBase} ${isEffectiveHover ? `animate-eq-${n}` : 'h-1.5'}`}
             />
           ))}
       </div>
    );
  };

  const effectiveImage = videoThumbnail || imageUrl;
  const hasBackgroundMedia = Boolean(effectiveImage || videoUrl);
  
  // -- MODE LOGIC: "Reveal on Hover" (Ghost) vs "Standard" --
  
  // Standard Mode: Opacity ~0.6, full on hover
  // Ghost Mode: Opacity 0, full on hover
  const baseOpacity = showMediaOnHoverOnly ? 'opacity-0' : 'opacity-60';
  
  // Video is visible if:
  // 1. URL exists
  // 2. We are playing it (active) OR there's no thumbnail to show
  // 3. BUT if showMediaOnHoverOnly is true, it must be hovered to be visible at all
  const isVideoVisible = videoUrl && (isPlaying || !effectiveImage);
  
  // Image is visible if it exists AND the video isn't overriding it
  const isImageVisible = effectiveImage && !isPlaying;
  
  const containerBgClass = hasBackgroundMedia ? 'bg-black' : surfaceClass;
  
  const editModeClass = isEditing 
    ? 'ring-2 ring-dashed ring-yellow-400/50 cursor-alias hover:ring-yellow-400' 
    : '';

  const scaleClass = isEffectiveHover 
    ? '-translate-y-1 scale-[1.01] z-30' 
    : 'group-hover:-translate-y-1 group-hover:scale-[1.01] z-20 hover:z-30';

  const textAlignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[textAlign || 'left'];

  // Ghost Mode Text Pulse Effect
  // If media is hidden (ghost mode active + not hovered), we pulse the text slightly
  const ghostTextClass = (showMediaOnHoverOnly && !isEffectiveHover && hasBackgroundMedia) 
      ? 'animate-pulse text-neutral-400' 
      : '';

  return (
    <div 
      className={`relative group ${spanClass} select-none ${scaleClass} transition-all duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Backlight Glow Layer */}
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${glowColorClass} rounded-[24px] ${activeGlowBlur} transition-all duration-500 ease-out ${glowOpacityState}`}
      />

      {/* Edit Mode Badge */}
      {isEditing && (
        <div className="absolute -top-2 -right-2 z-50 bg-yellow-400 text-black p-1 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform">
          <Edit3 size={12} />
        </div>
      )}

      {/* 2. Main Tile Container */}
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
          ${editModeClass}
          flex flex-col overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
          active:scale-[0.98] active:translate-y-0
          cursor-pointer no-underline
        `}
        style={customBoxShadow ? { boxShadow: customBoxShadow } : undefined}
      >
        
        {/* Matte Noise Texture */}
        <div 
            className="absolute inset-0 z-[2] opacity-[0.04] pointer-events-none mix-blend-overlay"
            style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '128px 128px' 
            }} 
        />

        {/* 3. Background Media Layer */}
        
        {/* Video Thumbnail / Image */}
        {effectiveImage && (
           <img 
            src={effectiveImage} 
            alt={title} 
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out z-0
              ${isImageVisible ? `${baseOpacity} group-hover:opacity-100` : 'opacity-0'}
              ${forceHighlight ? '!opacity-80' : ''} 
            `}
          />
        )}
        
        {/* Video Element */}
        {videoUrl && (
          <video 
            ref={videoRef}
            src={videoUrl} 
            muted 
            loop 
            playsInline
            onPlaying={() => setIsPlaying(true)}
            onEnded={() => setIsPlaying(false)}
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out z-0
              ${isVideoVisible ? (showMediaOnHoverOnly && !isEffectiveHover ? 'opacity-0' : 'opacity-100') : 'opacity-0'}
            `}
          />
        )}

        {/* Play Icon Overlay (Visible on Hover before Playing) */}
        {videoUrl && (
          <div 
            className={`
              absolute inset-0 flex items-center justify-center z-20 
              transition-all duration-300 pointer-events-none
              ${(isHovered && !isPlaying) ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
            `}
          >
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-full border border-white/20 shadow-xl">
               <Play fill="white" className="text-white w-6 h-6 translate-x-0.5" /> 
            </div>
          </div>
        )}

        {/* 4. Scrim / Tint Layer */}
        {hasBackgroundMedia && (
           <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0 pointer-events-none transition-opacity duration-500 ${showMediaOnHoverOnly && !isEffectiveHover ? 'opacity-0' : 'opacity-100'}`} />
        )}
        
        {/* 5. Active Tint Overlay */}
        {active && (
          <div className={`absolute inset-0 bg-gradient-to-br ${activeTintClass} pointer-events-none z-0 mix-blend-overlay`} />
        )}

        {/* 6. Foreground Content Layer */}
        <div className="flex flex-col justify-between h-full p-5 z-10 relative">
          
          {/* Header Area */}
          <div className="flex justify-between items-start">
            {icon && (
              <div className={`
                p-2 rounded-full 
                ${(active || hasBackgroundMedia) ? 'bg-white/10 text-white backdrop-blur-md border border-white/10' : 'bg-[#2a2a2a] text-neutral-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.05)]'}
                group-hover:text-white group-hover:bg-white/20 transition-all duration-300
                ${forceHighlight ? '!text-white !bg-white/20' : ''}
                ${ghostTextClass}
              `}>
                {icon}
              </div>
            )}
            
            {type === TileType.NUMBER && (
               <span className={`text-4xl font-light tracking-tighter ${active ? 'text-white drop-shadow-glow' : 'text-neutral-200'} ${ghostTextClass}`}>
                 {value}
               </span>
            )}
            
            {type === TileType.AUDIO && active && renderVisualizer()}
            
            {/* Generic Active Dot */}
            {active && type !== TileType.NUMBER && type !== TileType.AUDIO && !hasBackgroundMedia && (
              <div className={`w-2 h-2 rounded-full bg-${accentColor === 'blue' ? 'blue' : 'violet'}-400 shadow-[0_0_10px_currentColor] ring-1 ring-white/30`} />
            )}
          </div>

          {/* Mute Toggle (Only if video is actually playing and visible) */}
          {videoUrl && isVideoVisible && (!showMediaOnHoverOnly || isEffectiveHover) && (
             <div 
               role="button"
               onClick={toggleMute}
               className="absolute top-5 right-5 z-40 p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white backdrop-blur-xl border border-white/10 transition-all duration-200 hover:scale-110 active:scale-95 group/mute animate-in fade-in zoom-in"
               title={isMuted ? "Unmute" : "Mute"}
             >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
             </div>
          )}

          {/* Footer Area */}
          <div className={`flex flex-col ${textAlignClass}`}>
            {type === TileType.AUDIO && (
               <div className="w-full bg-black/40 h-1 rounded-full mb-3 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                  <div className="bg-white/80 h-full w-1/3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
               </div>
            )}
            
            <h3 className={`font-medium tracking-wide ${size === TileSize.WIDE || size === TileSize.LARGE ? 'text-xl' : 'text-base'} text-neutral-100 group-hover:text-white transition-colors drop-shadow-md ${forceHighlight ? '!text-white' : ''} ${ghostTextClass}`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-neutral-400 text-xs mt-1 group-hover:text-neutral-200 transition-colors font-medium ${forceHighlight ? '!text-neutral-200' : ''} ${ghostTextClass}`}>
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