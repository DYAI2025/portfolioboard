import React, { useRef } from 'react';
import { TileConfig, TileSize, TileType } from '../types';
import { X, Check, LayoutGrid, Type, Image as ImageIcon, Video, AlignCenter, AlignLeft, Clapperboard, Upload, Eye, EyeOff } from 'lucide-react';

interface TileEditorProps {
  tile: TileConfig;
  onUpdate: (updatedTile: TileConfig) => void;
  onClose: () => void;
}

const TileEditor: React.FC<TileEditorProps> = ({ tile, onUpdate, onClose }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const handleChange = (field: keyof TileConfig, value: any) => {
    onUpdate({ ...tile, [field]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for the uploaded file
      const url = URL.createObjectURL(file);
      handleChange(field, url);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] z-[100] bg-[#0a0a0a]/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out animate-in slide-in-from-right">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
        <div>
          <h2 className="text-xl font-light text-white tracking-tight">Edit Tile</h2>
          <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">ID: {tile.id}</p>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable Form */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Section: Layout */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <LayoutGrid size={14} /> Layout & Size
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(TileSize).map((size) => (
              <button
                key={size}
                onClick={() => handleChange('size', size)}
                className={`
                  h-12 rounded-xl border flex items-center justify-center text-sm font-medium transition-all
                  ${tile.size === size 
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-200' 
                    : 'bg-[#1a1a1a] border-white/5 text-neutral-400 hover:bg-[#222]'
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Section: Content */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <Type size={14} /> Content
          </label>
          
          <div className="space-y-3">
            <div className="group relative">
              <input
                type="text"
                value={tile.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder=" "
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 pt-5 pb-2 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all peer"
              />
              <label className="absolute left-4 top-3.5 text-neutral-500 text-xs transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px]">
                Title
              </label>
            </div>

            <div className="group relative">
              <input
                type="text"
                value={tile.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder=" "
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 pt-5 pb-2 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all peer"
              />
              <label className="absolute left-4 top-3.5 text-neutral-500 text-xs transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px]">
                Subtitle
              </label>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center justify-between bg-[#1a1a1a] p-2 rounded-xl border border-white/5">
                <span className="text-xs text-neutral-400 ml-2">Text Alignment</span>
                <div className="flex gap-1">
                    <button 
                        onClick={() => handleChange('textAlign', 'left')}
                        className={`p-2 rounded-lg transition-colors ${!tile.textAlign || tile.textAlign === 'left' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <AlignLeft size={16} />
                    </button>
                    <button 
                        onClick={() => handleChange('textAlign', 'center')}
                        className={`p-2 rounded-lg transition-colors ${tile.textAlign === 'center' ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <AlignCenter size={16} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Section: Media */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <ImageIcon size={14} /> Media Source
          </label>
          
          {/* Visibility Toggle */}
          <div 
             onClick={() => handleChange('showMediaOnHoverOnly', !tile.showMediaOnHoverOnly)}
             className={`
               flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all
               ${tile.showMediaOnHoverOnly 
                 ? 'bg-neutral-900 border-white/20' 
                 : 'bg-[#1a1a1a] border-white/5 hover:bg-[#222]'
               }
             `}
          >
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tile.showMediaOnHoverOnly ? 'bg-white/10 text-white' : 'bg-black text-neutral-500'}`}>
                   {tile.showMediaOnHoverOnly ? <EyeOff size={16}/> : <Eye size={16}/>}
                </div>
                <div className="flex flex-col">
                   <span className="text-sm font-medium text-white">Reveal on Hover</span>
                   <span className="text-[10px] text-neutral-500">
                     {tile.showMediaOnHoverOnly ? 'Media hidden until interaction' : 'Media always visible'}
                   </span>
                </div>
             </div>
             <div className={`w-10 h-5 rounded-full relative transition-colors ${tile.showMediaOnHoverOnly ? 'bg-violet-500' : 'bg-neutral-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300 ${tile.showMediaOnHoverOnly ? 'left-6' : 'left-1'}`} />
             </div>
          </div>

          <div className="space-y-3">
             {/* Image Upload */}
             <div className="flex gap-2">
                 <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                        <ImageIcon size={16} />
                    </span>
                    <input
                        type="text"
                        value={tile.imageUrl || ''}
                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                        placeholder="Image URL"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-neutral-700"
                    />
                 </div>
                 <input 
                    type="file" 
                    ref={imageInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'imageUrl')}
                 />
                 <button 
                    onClick={() => imageInputRef.current?.click()}
                    className="w-12 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center hover:bg-[#222] hover:text-white text-neutral-500 transition-colors"
                    title="Upload Image"
                 >
                    <Upload size={18} />
                 </button>
             </div>
             
             {/* Video Upload */}
             <div className="flex gap-2">
                 <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                        <Video size={16} />
                    </span>
                    <input
                        type="text"
                        value={tile.videoUrl || ''}
                        onChange={(e) => handleChange('videoUrl', e.target.value)}
                        placeholder="Video URL"
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-neutral-700"
                    />
                 </div>
                 <input 
                    type="file" 
                    ref={videoInputRef} 
                    className="hidden" 
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'videoUrl')}
                 />
                 <button 
                    onClick={() => videoInputRef.current?.click()}
                    className="w-12 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center hover:bg-[#222] hover:text-white text-neutral-500 transition-colors"
                    title="Upload Video"
                 >
                    <Upload size={18} />
                 </button>
             </div>

             <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                    <Clapperboard size={16} />
                </span>
                <input
                    type="text"
                    value={tile.videoThumbnail || ''}
                    onChange={(e) => handleChange('videoThumbnail', e.target.value)}
                    placeholder="Video Thumbnail (Optional)"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-neutral-700"
                />
             </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 bg-[#050505]">
        <button 
          onClick={onClose}
          className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
        >
          <Check size={18} /> Done
        </button>
      </div>
    </div>
  );
};

export default TileEditor;