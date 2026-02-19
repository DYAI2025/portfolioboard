import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { TileConfig, TileType } from '../types';

interface MediaOverlayProps {
  tile: TileConfig;
  onClose: () => void;
}

const MediaOverlay: React.FC<MediaOverlayProps> = ({ tile, onClose }) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Determine content source
  const isVideo = tile.type === TileType.VIDEO || !!tile.videoUrl;
  const src = isVideo ? tile.videoUrl : tile.imageUrl;

  if (!src) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      
      {/* Backdrop with Blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md cursor-pointer"
      />

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 group"
      >
        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Content Container */}
      <div 
        className="relative z-10 w-full h-full max-w-7xl max-h-[90vh] flex flex-col items-center justify-center pointer-events-none"
      >
        {/* Media */}
        <div className="relative w-full h-full flex items-center justify-center pointer-events-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-300">
          
          {isVideo ? (
            <video
              src={src}
              className="w-full h-full object-contain bg-black"
              autoPlay
              controls
              playsInline
              loop
            />
          ) : (
            <img
              src={src}
              alt={tile.title || 'Media'}
              className="w-full h-full object-contain"
            />
          )}

          {/* Caption Overlay (Bottom) */}
          {(tile.title || tile.subtitle) && (
            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-center">
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight mb-1">
                {tile.title}
              </h2>
              {tile.subtitle && (
                <p className="text-neutral-400 text-sm md:text-base uppercase tracking-widest">
                  {tile.subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaOverlay;