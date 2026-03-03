import React, { useState, useRef, useEffect } from 'react';
import { TileConfig, TileSize, TileType } from '../types';
import { playChord } from '../utils/sound';
import { GLOW_GRADIENT, ACTIVE_BORDER, ACTIVE_SHADOW, ACTIVE_TINT } from '../utils/tileStyles';
import { Edit3, Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

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
    audioUrl,
    videoThumbnail,
    backgroundClass,
    link,
    linkTarget,
    shadows,
    soundKey,
    textAlign,
    showMediaOnHoverOnly
  } = config;

  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'spectrum'>(config.visualizerStyle || 'bars');
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const isEffectiveHover = isHovered || forceHighlight;

  const stopSoundRef = useRef<(() => void) | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- GRID SPAN ---
  const spanClass = {
    [TileSize.SMALL]: 'col-span-1 row-span-1',
    [TileSize.WIDE]:  'col-span-2 row-span-1',
    [TileSize.TALL]:  'col-span-1 row-span-2',
    [TileSize.LARGE]: 'col-span-2 row-span-2',
  }[size];

  // --- COLOUR LOOKUPS (via tileStyles maps — all full Tailwind class strings) ---
  const color = accentColor || 'white';
  const glowColorClass   = GLOW_GRADIENT[color]  ?? GLOW_GRADIENT.white;
  const activeBorderClass = ACTIVE_BORDER[color]  ?? ACTIVE_BORDER.white;
  const activeShadowClass = ACTIVE_SHADOW[color]  ?? ACTIVE_SHADOW.white;
  const activeTintClass   = ACTIVE_TINT[color]    ?? ACTIVE_TINT.white;

  // --- SURFACE ---
  const defaultGradient = active
    ? 'bg-gradient-to-b from-[#2e2e2e] to-[#1a1a1a]'
    : 'bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f]';
  const surfaceClass = backgroundClass || defaultGradient;

  // --- BEVEL + SHADOW ---
  const bevelClass = active
    ? `shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.05)] ring-1 ${activeBorderClass}`
    : 'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.02)] ring-1 ring-white/5';
  const shadowClass = active ? activeShadowClass : '';

  const customBoxShadow = (() => {
    if (!shadows) return undefined;
    if (active && shadows.active) return shadows.active;
    if (isEffectiveHover && shadows.hover) return shadows.hover;
    return shadows.default;
  })();

  // --- ANIMATION STATES ---
  const glowOpacityState = (active || isEffectiveHover)
    ? 'opacity-100 saturate-200'
    : 'opacity-0 group-hover:opacity-60 group-hover:saturate-150';
  const activeGlowBlur = (active || isEffectiveHover)
    ? 'blur-3xl'
    : 'blur-xl group-hover:blur-2xl';
  const indicatorColor = (active || isEffectiveHover) ? 'text-white' : 'text-neutral-500';

  // --- MEDIA STATE CLASSIFICATION ---
  // Spec media states: A=video, B=image+mp3, C=mp3-only, D=image-only
  const effectiveImage  = videoThumbnail || imageUrl;   // visual background/poster
  const hasVisualMedia  = Boolean(effectiveImage || videoUrl);
  const hasAnyMedia     = Boolean(effectiveImage || videoUrl || audioUrl);
  const hasAudioOnly    = Boolean(audioUrl && !videoUrl);

  // Container BG: black if visual media exists (video/image cover), else tile surface
  const containerBgClass = hasVisualMedia ? 'bg-black' : surfaceClass;

  // Ghost mode: pulse text if ANY media is hidden
  const ghostTextClass = (showMediaOnHoverOnly && !isEffectiveHover && hasAnyMedia)
    ? 'animate-pulse text-neutral-400'
    : '';

  const baseOpacity = showMediaOnHoverOnly ? 'opacity-0' : 'opacity-60';
  const isVideoVisible = videoUrl && (isVideoPlaying || !effectiveImage);
  const isImageVisible  = effectiveImage && !isVideoPlaying;

  // --- EFFECTS ---

  // Video play/pause on hover
  useEffect(() => {
    if (!videoRef.current) return;
    if (isEffectiveHover) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
    }
  }, [isEffectiveHover]);

  // Organ chord on roulette highlight
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

  // --- INTERACTION HANDLERS ---

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
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

  // Click-Priorität (Spec): 1. Edit  2. Link  3. Visualizer  4. Media lightbox  5. Fullscreen
  const Tag = (link && !isEditing) ? 'a' : 'div';

  const handleInteraction = (e: React.MouseEvent) => {
    // 1. Edit-Mode → TileEditor öffnen
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
      if (onEdit) onEdit(config);
      return;
    }

    // 2. Link → <a>-Tag übernimmt das href-Verhalten, wir tun nichts weiter
    if (link) return;

    // 3. AUDIO-Typ: Visualizer-Modus wechseln
    if (type === TileType.AUDIO && active) {
      e.preventDefault();
      setVisualizerMode(prev => {
        if (prev === 'bars') return 'wave';
        if (prev === 'wave') return 'spectrum';
        return 'bars';
      });
      return;
    }

    // 4. Image/Video → Lightbox (nur wenn kein Link)
    if ((type === TileType.IMAGE || type === TileType.VIDEO) && onOpenMedia) {
      e.preventDefault();
      onOpenMedia(config);
      return;
    }

    // 5. Video → Fullscreen-Fallback
    if (type === TileType.VIDEO && videoUrl && videoRef.current && !onOpenMedia) {
      e.preventDefault();
      videoRef.current.requestFullscreen?.();
      setIsMuted(false);
    }
  };

  // --- VISUALIZER SUB-COMPONENT ---
  const renderVisualizer = () => {
    const barBase = 'bg-current rounded-full shadow-[0_0_10px_currentColor] transition-all duration-300 ease-in-out';

    if (visualizerMode === 'wave') {
      return (
        <div className={`flex items-end gap-[3px] h-5 mb-1 ${indicatorColor}`} title="Wave">
          {[0, 1, 2, 3, 4].map(i => (
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

  // --- STYLES ---
  const editModeClass = isEditing
    ? 'ring-2 ring-dashed ring-yellow-400/50 cursor-alias hover:ring-yellow-400'
    : '';

  const scaleClass = isEffectiveHover
    ? '-translate-y-2 scale-[1.02] z-40'
    : 'hover:-translate-y-2 hover:scale-[1.02] z-20 hover:z-40';

  const textAlignClass = {
    left:   'text-left items-start',
    center: 'text-center items-center',
    right:  'text-right items-end',
  }[textAlign || 'left'];

  return (
    <div
      className={`relative group ${spanClass} select-none ${scaleClass} transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Backlight Glow Layer */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${glowColorClass} rounded-[24px] ${activeGlowBlur} transition-all duration-500 ease-out ${glowOpacityState}`}
      />

      {/* Edit Badge */}
      {isEditing && (
        <div className="absolute -top-2 -right-2 z-50 bg-yellow-400 text-black p-1 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform">
          <Edit3 size={12} />
        </div>
      )}

      {/* 2. Main Tile Container */}
      <Tag
        href={link}
        target={link ? (linkTarget || '_blank') : undefined}
        rel={link ? 'noopener noreferrer' : undefined}
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

        {/* 3a. Background Image / Video Thumbnail */}
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

        {/* 3b. Video Element */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            muted={isMuted}
            loop
            playsInline
            onPlaying={() => setIsVideoPlaying(true)}
            onEnded={() => setIsVideoPlaying(false)}
            className={`
              absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out z-0
              ${isVideoVisible
                ? (showMediaOnHoverOnly && !isEffectiveHover ? 'opacity-0' : 'opacity-100')
                : 'opacity-0'
              }
            `}
          />
        )}

        {/* 3c. Hidden Audio Element */}
        {audioUrl && !videoUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            loop
            onPlaying={() => setIsAudioPlaying(true)}
            onPause={() => setIsAudioPlaying(false)}
            onEnded={() => setIsAudioPlaying(false)}
            onError={() => setIsAudioPlaying(false)}
          />
        )}

        {/* Video: Play-icon overlay (visible on hover, before video starts) */}
        {videoUrl && (
          <div
            className={`
              absolute inset-0 flex items-center justify-center z-20
              transition-all duration-300 pointer-events-none
              ${(isHovered && !isVideoPlaying) ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
            `}
          >
            <div className="bg-black/30 backdrop-blur-sm p-4 rounded-full border border-white/20 shadow-xl">
              <Play fill="white" className="text-white w-6 h-6 translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Audio: Play/Pause Button (hover-reveal or always visible in non-ghost mode) */}
        {hasAudioOnly && (
          <div
            className={`
              absolute inset-0 flex items-center justify-center z-20
              transition-all duration-300
              ${isEffectiveHover ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
            `}
          >
            <button
              onClick={toggleAudio}
              aria-label={isAudioPlaying ? 'Audio pausieren' : 'Audio abspielen'}
              className="bg-black/30 backdrop-blur-sm p-4 rounded-full border border-white/20 shadow-xl hover:bg-white/20 transition-colors"
            >
              {isAudioPlaying
                ? <Pause fill="white" className="text-white w-6 h-6" />
                : <Play fill="white" className="text-white w-6 h-6 translate-x-0.5" />
              }
            </button>
          </div>
        )}

        {/* Audio: subtle music note indicator (non-ghost, non-hover) */}
        {hasAudioOnly && !showMediaOnHoverOnly && !isEffectiveHover && (
          <div className="absolute top-4 right-4 z-20 transition-opacity duration-300">
            <Music size={14} className="text-white/25" />
          </div>
        )}

        {/* 4. Scrim / Tint (only for visual media) */}
        {hasVisualMedia && (
          <div
            className={`
              absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
              z-0 pointer-events-none transition-opacity duration-500
              ${showMediaOnHoverOnly && !isEffectiveHover ? 'opacity-0' : 'opacity-100'}
            `}
          />
        )}

        {/* 5. Active Colour Tint */}
        {active && (
          <div className={`absolute inset-0 bg-gradient-to-br ${activeTintClass} pointer-events-none z-0 mix-blend-overlay`} />
        )}

        {/* 6. Foreground Content */}
        <div className="flex flex-col justify-between h-full p-5 z-10 relative">

          {/* Header Row */}
          <div className="flex justify-between items-start">
            {icon && (
              <div className={`
                p-2 rounded-full
                ${(active || hasVisualMedia) ? 'bg-white/10 text-white backdrop-blur-md border border-white/10' : 'bg-[#2a2a2a] text-neutral-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.05)]'}
                group-hover:text-white group-hover:bg-white/20 transition-all duration-300
                ${forceHighlight ? '!text-white !bg-white/20' : ''}
                ${ghostTextClass}
              `}>
                {icon}
              </div>
            )}

            {type === TileType.NUMBER && (
              <span className={`text-4xl font-light tracking-tighter ${active ? 'text-white' : 'text-neutral-200'} ${ghostTextClass}`}>
                {value}
              </span>
            )}

            {type === TileType.AUDIO && active && renderVisualizer()}

            {/* Active Dot (generic, not for NUMBER/AUDIO with visual bg) */}
            {active && type !== TileType.NUMBER && type !== TileType.AUDIO && !hasVisualMedia && (
              <div className="w-2 h-2 rounded-full bg-white/60 ring-1 ring-white/30" />
            )}
          </div>

          {/* Video: Mute Toggle */}
          {videoUrl && isVideoVisible && (!showMediaOnHoverOnly || isEffectiveHover) && (
            <div
              role="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Stummschalten aufheben' : 'Stummschalten'}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 text-white/90 hover:bg-white/20 hover:text-white backdrop-blur-md border border-white/10 shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </div>
          )}

          {/* Footer Row */}
          <div className={`flex flex-col ${textAlignClass}`}>
            {type === TileType.AUDIO && (
              <div className="w-full bg-black/40 h-1 rounded-full mb-3 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                <div className="bg-white/80 h-full w-1/3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
            )}

            <h3 className={`
              font-medium tracking-wide
              ${size === TileSize.WIDE || size === TileSize.LARGE ? 'text-xl' : 'text-base'}
              text-neutral-100 group-hover:text-white transition-colors drop-shadow-md
              ${forceHighlight ? '!text-white' : ''} ${ghostTextClass}
            `}>
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
