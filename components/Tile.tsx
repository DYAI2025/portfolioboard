import React, { useState, useRef, useEffect } from 'react';
import { TileConfig, TileSize, TileType } from '../types';
import { playChord } from '../utils/sound';

interface TileProps {
  config: TileConfig;
}

const Tile: React.FC<TileProps> = ({ config }) => {
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
    link, 
    linkTarget,
    shadows,
    soundKey
  } = config;

  // Local state for visualizer mode and hover state
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'spectrum'>(config.visualizerStyle || 'bars');
  const [isHovered, setIsHovered] = useState(false);
  
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
    blue: 'from-blue-600 via-blue-500 to-blue-400',
    purple: 'from-violet-600 via-violet-500 to-purple-400',
    white: 'from-white via-neutral-100 to-neutral-300',
    orange: 'from-orange-600 via-orange-500 to-orange-400',
    green: 'from-emerald-600 via-emerald-500 to-emerald-400',
  }[accentColor || 'white'];

  // 2. Surface Gradient (Fallback if no media)
  const surfaceGradient = active
    ? 'bg-gradient-to-b from-[#2e2e2e] to-[#1a1a1a]' 
    : 'bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f]';

  // 3. Bevel / Ring
  const bevelClass = active
    ? 'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.05)] ring-1 ring-white/10'
    : 'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.02)] ring-1 ring-white/5';

  // 4. Ambient Shadow
  const activeShadowClass = {
    blue: 'shadow-[0_0_50px_-12px_rgba(59,130,246,1)]',
    purple: 'shadow-[0_0_50px_-12px_rgba(139,92,246,1)]',
    white: 'shadow-[0_0_50px_-12px_rgba(255,255,255,0.8)]',
    orange: 'shadow-[0_0_50px_-12px_rgba(249,115,22,1)]',
    green: 'shadow-[0_0_50px_-12px_rgba(16,185,129,1)]',
  }[accentColor || 'white'];

  const shadowClass = active ? activeShadowClass : '';

  // 5. Custom Shadow Stack
  const customBoxShadow = (() => {
    if (!shadows) return undefined;
    if (active && shadows.active) return shadows.active;
    if (isHovered && shadows.hover) return shadows.hover;
    return shadows.default;
  })();

  // 6. Active Tint (Internal overlay)
  const activeTintClass = {
    blue: 'from-blue-500/10 to-transparent',
    purple: 'from-violet-500/10 to-transparent',
    white: 'from-white/10 to-transparent',
    orange: 'from-orange-500/10 to-transparent',
    green: 'from-emerald-500/10 to-transparent',
  }[accentColor || 'white'];

  // Animation States
  const glowOpacityState = active 
    ? 'opacity-100 group-hover:opacity-100' 
    : 'opacity-0 group-hover:opacity-40';
  const activeGlowBlur = active ? 'blur-2xl' : 'blur-xl'; 
  const indicatorColor = active ? 'text-white' : 'text-neutral-500';

  // --- INTERACTION ---
  
  // Video Handling Effect
  useEffect(() => {
    if (!videoRef.current) return;
    
    // If there is no image URL, we might want the video to be visible always.
    // However, to keep the "preview" feel, we stick to hover unless user specifically wants background video.
    // For this implementation, hover triggers play.
    if (isHovered) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.debug("Autoplay prevented", error);
        });
      }
    } else {
      videoRef.current.pause();
      // If we want it to act like a GIF that resets:
      videoRef.current.currentTime = 0; 
    }
  }, [isHovered]);

  // Priority: If link exists, it is an Anchor tag. Otherwise Div.
  const Tag = link ? 'a' : 'div';
  
  const handleInteraction = (e: React.MouseEvent) => {
    // If link exists, propagate click normally (navigate).
    if (link) return;

    // 1. Audio Tile Interaction (Toggle Visualizer)
    if (type === TileType.AUDIO && active) {
      e.preventDefault();
      setVisualizerMode(prev => {
        if (prev === 'bars') return 'wave';
        if (prev === 'wave') return 'spectrum';
        return 'bars';
      });
    }

    // 2. Video Tile Interaction (Fullscreen)
    // Only if NO link is present.
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

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (soundKey) {
      if (stopSoundRef.current) stopSoundRef.current();
      stopSoundRef.current = playChord(soundKey);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (stopSoundRef.current) {
      stopSoundRef.current(); 
      stopSoundRef.current = null;
    }
  };

  // --- SUB-COMPONENT: VISUALIZER ---
  const renderVisualizer = () => {
    if (visualizerMode === 'wave') {
      return (
        <div className={`flex items-end gap-[3px] h-5 mb-1 ${indicatorColor}`} title="Wave">
           {[0, 1, 2, 3, 4].map((i) => (
             <div key={i} className="w-1 bg-current rounded-full animate-wave-slow shadow-[0_0_10px_currentColor]" style={{ animationDelay: `${i * 0.15}s` }} />
           ))}
        </div>
      );
    }
    if (visualizerMode === 'spectrum') {
      return (
         <div className={`flex items-end gap-[2px] h-6 mb-1 ${indicatorColor}`} title="Spectrum">
             <div className="w-[3px] bg-current rounded-full animate-spec-1 shadow-[0_0_5px_currentColor]" />
             <div className="w-[3px] bg-current rounded-full animate-spec-2 shadow-[0_0_5px_currentColor]" />
             <div className="w-[3px] bg-current rounded-full animate-spec-4 shadow-[0_0_5px_currentColor]" />
             <div className="w-[3px] bg-current rounded-full animate-spec-3 shadow-[0_0_5px_currentColor]" />
             <div className="w-[3px] bg-current rounded-full animate-spec-1 shadow-[0_0_5px_currentColor]" />
             <div className="w-[3px] bg-current rounded-full animate-spec-4 shadow-[0_0_5px_currentColor]" />
         </div>
      );
    }
    return (
       <div className={`flex items-end gap-1 h-5 mb-1 ${indicatorColor}`} title="Bars">
           <div className="w-1 bg-current rounded-full animate-eq-1 shadow-[0_0_10px_currentColor]" />
           <div className="w-1 bg-current rounded-full animate-eq-2 shadow-[0_0_10px_currentColor]" />
           <div className="w-1 bg-current rounded-full animate-eq-3 shadow-[0_0_10px_currentColor]" />
           <div className="w-1 bg-current rounded-full animate-eq-4 shadow-[0_0_10px_currentColor]" />
       </div>
    );
  };

  const hasBackgroundMedia = Boolean(imageUrl || videoUrl);
  
  // Logic to determine which media layer is visible
  // If video exists and is hovered (or if there's no image to fallback to), show video.
  const isVideoVisible = videoUrl && (isHovered || !imageUrl);
  const isImageVisible = imageUrl && !isVideoVisible;

  return (
    <div 
      className={`relative group ${spanClass} select-none`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Backlight Glow Layer */}
      <div 
        className={`absolute -inset-1 bg-gradient-to-br ${glowColorClass} rounded-[30px] ${activeGlowBlur} transition-opacity duration-500 ease-out ${glowOpacityState}`}
      />

      {/* 2. Main Tile Container */}
      <Tag 
        href={link}
        target={link ? (linkTarget || '_blank') : undefined}
        rel={link ? "noopener noreferrer" : undefined}
        onClick={handleInteraction}
        className={`
          relative h-full w-full block
          rounded-[24px] 
          ${hasBackgroundMedia ? 'bg-black' : surfaceGradient}
          ${!customBoxShadow ? bevelClass : ''}
          ${!customBoxShadow ? shadowClass : ''}
          flex flex-col overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
          group-hover:-translate-y-1 group-hover:scale-[1.01]
          active:scale-[0.98] active:translate-y-0
          cursor-pointer no-underline
        `}
        style={customBoxShadow ? { boxShadow: customBoxShadow } : undefined}
      >
        
        {/* 3. Background Media Layer */}
        {imageUrl && (
           <img 
            src={imageUrl} 
            alt={title} 
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-0
              ${isImageVisible ? 'opacity-60 group-hover:opacity-80' : 'opacity-0'}
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

        {/* 4. Scrim / Tint Layer (Better text readability) */}
        {hasBackgroundMedia && (
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-0 pointer-events-none" />
        )}
        
        {/* 5. Active Tint Overlay */}
        {active && (
          <div className={`absolute inset-0 bg-gradient-to-br ${activeTintClass} pointer-events-none z-0 mix-blend-overlay`} />
        )}

        {/* 6. Foreground Content Layer - Z-Index ensures visibility over media */}
        <div className="flex flex-col justify-between h-full p-5 z-10 relative">
          
          {/* Header Area */}
          <div className="flex justify-between items-start">
            {icon && (
              <div className={`
                p-2 rounded-full 
                ${(active || hasBackgroundMedia) ? 'bg-white/10 text-white backdrop-blur-md border border-white/10' : 'bg-[#2a2a2a] text-neutral-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.05)]'}
                group-hover:text-white group-hover:bg-white/20 transition-all duration-300
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
            
            {/* Generic Active Dot Indicator */}
            {active && type !== TileType.NUMBER && type !== TileType.AUDIO && !hasBackgroundMedia && (
              <div className={`w-2 h-2 rounded-full bg-${accentColor === 'blue' ? 'blue' : 'violet'}-400 shadow-[0_0_10px_currentColor] ring-1 ring-white/30`} />
            )}
            
            {/* Play Icon for Video visual if no icon provided */}
            {type === TileType.VIDEO && !icon && !link && (
              <div className="
                w-10 h-10 rounded-full 
                bg-white/10 backdrop-blur-md 
                border border-white/20 
                flex items-center justify-center 
                shadow-[0_0_10px_rgba(0,0,0,0.2)]
              ">
                 <svg className="w-4 h-4 text-white fill-white ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            )}
            {/* Link Icon for Video visual if link provided */}
            {type === TileType.VIDEO && !icon && link && (
              <div className="
                w-10 h-10 rounded-full 
                bg-white/10 backdrop-blur-md 
                border border-white/20 
                flex items-center justify-center 
                shadow-[0_0_10px_rgba(0,0,0,0.2)]
              ">
                 <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path fill="none" stroke="currentColor" strokeWidth="2" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </div>
            )}
          </div>

          {/* Footer Area: Text & Subtitle */}
          <div>
            {type === TileType.AUDIO && (
               <div className="w-full bg-black/40 h-1 rounded-full mb-3 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                  <div className="bg-white/80 h-full w-1/3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
               </div>
            )}
            
            <h3 className={`font-medium tracking-wide ${size === TileSize.WIDE || size === TileSize.LARGE ? 'text-xl' : 'text-base'} text-neutral-100 group-hover:text-white transition-colors drop-shadow-md`}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-neutral-400 text-xs mt-1 group-hover:text-neutral-200 transition-colors font-medium">
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