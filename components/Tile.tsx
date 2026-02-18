import React, { useState } from 'react';
import { TileConfig, TileSize, TileType } from '../types';

interface TileProps {
  config: TileConfig;
}

const Tile: React.FC<TileProps> = ({ config }) => {
  const { size, type, active, accentColor, title, subtitle, icon, value, imageUrl, link, shadows } = config;

  // Local state for visualizer mode and hover state
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'spectrum'>(config.visualizerStyle || 'bars');
  const [isHovered, setIsHovered] = useState(false);

  // Grid spanning logic
  const spanClass = {
    [TileSize.SMALL]: 'col-span-1 row-span-1',
    [TileSize.WIDE]: 'col-span-2 row-span-1',
    [TileSize.TALL]: 'col-span-1 row-span-2',
    [TileSize.LARGE]: 'col-span-2 row-span-2',
  }[size];

  // 1. Backlight Glow: Vivid, high-quality gradients
  // Updated colors to match accent more closely (less hue shifting) for a pure, intense look
  const glowColorClass = {
    blue: 'from-blue-600 via-blue-500 to-blue-400',
    purple: 'from-violet-600 via-violet-500 to-purple-400',
    white: 'from-white via-neutral-100 to-neutral-300',
    orange: 'from-orange-600 via-orange-500 to-orange-400',
    green: 'from-emerald-600 via-emerald-500 to-emerald-400',
  }[accentColor || 'white'];

  // 2. Surface Material & Gradient (Matte Finish)
  const surfaceGradient = active
    ? 'bg-gradient-to-b from-[#2e2e2e] to-[#1a1a1a]' 
    : 'bg-gradient-to-b from-[#1c1c1c] to-[#0f0f0f]';

  // 3. The "Bevel" Effect (Refined for Matte)
  const bevelClass = active
    ? 'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.1),inset_0px_0px_0px_1px_rgba(255,255,255,0.05)] ring-1 ring-white/10'
    : 'shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_0px_0px_1px_rgba(255,255,255,0.02)] ring-1 ring-white/5';

  // 4. Ambient External Shadow (Glow spill)
  // Increased intensity (opacity ~1) and localization (tighter blur/spread)
  const activeShadowClass = {
    blue: 'shadow-[0_0_50px_-12px_rgba(59,130,246,1)]',
    purple: 'shadow-[0_0_50px_-12px_rgba(139,92,246,1)]',
    white: 'shadow-[0_0_50px_-12px_rgba(255,255,255,0.8)]',
    orange: 'shadow-[0_0_50px_-12px_rgba(249,115,22,1)]',
    green: 'shadow-[0_0_50px_-12px_rgba(16,185,129,1)]',
  }[accentColor || 'white'];

  const shadowClass = active ? activeShadowClass : '';

  // 5. Custom Shadow Stack Logic
  // If shadows config is present, it overrides the default shadow/bevel classes
  const customBoxShadow = (() => {
    if (!shadows) return undefined;
    if (active && shadows.active) return shadows.active;
    if (isHovered && shadows.hover) return shadows.hover;
    return shadows.default;
  })();

  // 5. Internal Tint
  const activeTintClass = {
    blue: 'from-blue-500/10 to-transparent',
    purple: 'from-violet-500/10 to-transparent',
    white: 'from-white/10 to-transparent',
    orange: 'from-orange-500/10 to-transparent',
    green: 'from-emerald-500/10 to-transparent',
  }[accentColor || 'white'];

  // Opacity & Blur settings
  const glowOpacityState = active 
    ? 'opacity-100 group-hover:opacity-100' // Max intensity when active
    : 'opacity-0 group-hover:opacity-40';

  // Use blur-2xl instead of 3xl to keep the glow tighter to the tile ("localized")
  const activeGlowBlur = active ? 'blur-2xl' : 'blur-xl'; 
  const indicatorColor = active ? 'text-white' : 'text-neutral-500';

  const handleClick = (e: React.MouseEvent) => {
    if (link) {
      window.open(link, '_blank');
    } else if (type === TileType.AUDIO && active) {
      e.preventDefault();
      // Toggle visualizer mode
      setVisualizerMode(prev => {
        if (prev === 'bars') return 'wave';
        if (prev === 'wave') return 'spectrum';
        return 'bars';
      });
    }
  };

  const renderVisualizer = () => {
    if (visualizerMode === 'wave') {
      return (
        <div className={`flex items-end gap-[3px] h-5 mb-1 ${indicatorColor}`} title="Wave">
           {[0, 1, 2, 3, 4].map((i) => (
             <div 
               key={i} 
               className="w-1 bg-current rounded-full animate-wave-slow shadow-[0_0_10px_currentColor]" 
               style={{ animationDelay: `${i * 0.15}s` }}
             />
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
    // Default: Bars
    return (
       <div className={`flex items-end gap-1 h-5 mb-1 ${indicatorColor}`} title="Bars">
           <div className="w-1 bg-current rounded-full animate-eq-1 shadow-[0_0_10px_currentColor]" />
           <div className="w-1 bg-current rounded-full animate-eq-2 shadow-[0_0_10px_currentColor]" />
           <div className="w-1 bg-current rounded-full animate-eq-3 shadow-[0_0_10px_currentColor]" />
           <div className="w-1 bg-current rounded-full animate-eq-4 shadow-[0_0_10px_currentColor]" />
       </div>
    );
  };

  return (
    <div 
      className={`relative group ${spanClass} select-none`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Backlight Glow Layer */}
      <div 
        className={`absolute -inset-1 bg-gradient-to-br ${glowColorClass} rounded-[30px] ${activeGlowBlur} transition-opacity duration-500 ease-out ${glowOpacityState}`}
      />

      {/* Main Tile Surface */}
      <div 
        className={`
          relative h-full w-full 
          rounded-[24px] 
          ${surfaceGradient}
          ${!customBoxShadow ? bevelClass : ''}
          ${!customBoxShadow ? shadowClass : ''}
          flex flex-col overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
          group-hover:-translate-y-1 group-hover:scale-[1.01]
          active:scale-[0.98] active:translate-y-0
          cursor-pointer
        `}
        style={customBoxShadow ? { boxShadow: customBoxShadow } : undefined}
      >
        
        {active && (
          <div className={`absolute inset-0 bg-gradient-to-br ${activeTintClass} pointer-events-none z-0 mix-blend-overlay`} />
        )}

        {type === TileType.VIDEO ? (
           <React.Fragment>
              {imageUrl ? (
                <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-0" />
              ) : (
                <div className="absolute inset-0 bg-neutral-900 z-0" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0" />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="
                  w-14 h-14 
                  rounded-full 
                  bg-white/10 backdrop-blur-md 
                  border border-white/20 
                  flex items-center justify-center 
                  group-hover:scale-110 group-hover:bg-white/20 
                  transition-all duration-300 
                  shadow-[0_0_20px_rgba(0,0,0,0.3)]
                ">
                  <svg className="w-6 h-6 text-white fill-white ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h3 className="text-white font-medium text-lg tracking-wide">{title}</h3>
                {subtitle && <p className="text-neutral-400 text-sm mt-1">{subtitle}</p>}
              </div>
           </React.Fragment>
        ) : (type === TileType.IMAGE && imageUrl) ? (
          <React.Fragment>
            <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0" />
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <h3 className="text-white font-medium text-lg tracking-wide">{title}</h3>
              {subtitle && <p className="text-neutral-400 text-sm mt-1">{subtitle}</p>}
            </div>
          </React.Fragment>
        ) : (
          <div className="flex flex-col justify-between h-full p-5 z-10 relative">
            <div className="flex justify-between items-start">
              {icon && (
                <div className={`
                  p-2 rounded-full 
                  ${active ? 'bg-white/20 text-white shadow-inner' : 'bg-[#2a2a2a] text-neutral-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.05)]'}
                  group-hover:text-white group-hover:bg-white/20 transition-all duration-300
                `}>
                  {icon}
                </div>
              )}
              {type === TileType.NUMBER && (
                 <span className={`text-4xl font-light tracking-tighter ${active ? 'text-white drop-shadow-glow' : 'text-neutral-400'}`}>
                   {value}
                 </span>
              )}
              
              {/* Audio Visualizer Render */}
              {type === TileType.AUDIO && active && renderVisualizer()}

              {active && type !== TileType.NUMBER && type !== TileType.AUDIO && (
                <div className={`w-2 h-2 rounded-full bg-${accentColor === 'blue' ? 'blue' : 'violet'}-400 shadow-[0_0_10px_currentColor] ring-1 ring-white/30`} />
              )}
            </div>

            <div>
              {type === TileType.AUDIO && (
                 <div className="w-full bg-black/40 h-1 rounded-full mb-3 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
                    <div className="bg-white/80 h-full w-1/3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                 </div>
              )}
              
              <h3 className={`font-medium tracking-wide ${size === TileSize.WIDE ? 'text-xl' : 'text-base'} text-neutral-200 group-hover:text-white transition-colors drop-shadow-md`}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-neutral-500 text-xs mt-1 group-hover:text-neutral-300 transition-colors font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tile;