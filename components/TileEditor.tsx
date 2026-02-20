import React, { useState, useEffect, useRef } from 'react';
import { TileConfig, EditableTileConfig } from '../types';
import { X, Save, Image as ImageIcon, Video, Link as LinkIcon, Upload } from 'lucide-react';

interface TileEditorProps {
  tile: TileConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: EditableTileConfig) => void;
}

const TileEditor: React.FC<TileEditorProps> = ({ tile, isOpen, onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EditableTileConfig>({
    id: '',
    title: '',
    subtitle: '',
    link: '',
    linkTarget: '_blank',
    imageUrl: '',
    videoUrl: '',
    mediaType: 'none',
  });

  useEffect(() => {
    if (tile) {
      const mediaType: 'none' | 'image' | 'video' = tile.videoUrl 
        ? 'video' 
        : tile.imageUrl 
          ? 'image' 
          : 'none';

      setFormData({
        id: tile.id,
        title: tile.title || '',
        subtitle: tile.subtitle || '',
        link: tile.link || '',
        linkTarget: tile.linkTarget || '_blank',
        imageUrl: tile.imageUrl || '',
        videoUrl: tile.videoUrl || '',
        mediaType,
      });
    }
  }, [tile]);

  // Convert file to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Bitte nur Bilddateien hochladen (JPG, PNG, WebP, GIF)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Bild darf maximal 2MB groß sein');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const base64 = await fileToBase64(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: base64,
        mediaType: 'image',
      }));
    } catch (error) {
      setUploadError('Fehler beim Hochladen des Bildes');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (
    field: keyof EditableTileConfig,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMediaTypeChange = (type: 'none' | 'image' | 'video') => {
    setUploadError(null);
    setFormData((prev) => ({
      ...prev,
      mediaType: type,
      // Clear the other media URL when switching
      imageUrl: type === 'image' ? prev.imageUrl : '',
      videoUrl: type === 'video' ? prev.videoUrl : '',
    }));
  };

  // Clear upload state when closing
  useEffect(() => {
    if (!isOpen) {
      setUploadError(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen || !tile) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Editor Panel */}
      <div className="relative w-full max-w-lg bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Tile bearbeiten</h2>
            <p className="text-sm text-neutral-400 mt-1">ID: {tile.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Titel
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
              placeholder="z.B. Photography"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Subtext
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
              placeholder="z.B. Latest shots"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              <LinkIcon size={16} className="inline mr-2 -mt-0.5" />
              Link URL
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => handleChange('link', e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
              placeholder="https://example.com"
            />
            <div className="mt-3">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Link Ziel
              </label>
              <select
                value={formData.linkTarget}
                onChange={(e) => handleChange('linkTarget', e.target.value as any)}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
              >
                <option value="_blank">_blank (neuer Tab)</option>
                <option value="_self">_self (gleicher Tab)</option>
                <option value="_parent">_parent (Parent Frame)</option>
                <option value="_top">_top (Top Frame)</option>
              </select>
            </div>
          </div>

          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-3">
              Hintergrund-Medium
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleMediaTypeChange('none')}
                className={`flex-1 px-4 py-3 rounded-xl border transition-all ${
                  formData.mediaType === 'none'
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-[#0a0a0a] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                Kein Medium
              </button>
              <button
                type="button"
                onClick={() => handleMediaTypeChange('image')}
                className={`flex-1 px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  formData.mediaType === 'image'
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-[#0a0a0a] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <ImageIcon size={18} />
                Image
              </button>
              <button
                type="button"
                onClick={() => handleMediaTypeChange('video')}
                className={`flex-1 px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  formData.mediaType === 'video'
                    ? 'bg-violet-600 border-violet-500 text-white'
                    : 'bg-[#0a0a0a] border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <Video size={18} />
                Video
              </button>
            </div>
          </div>

          {/* Image URL */}
          {formData.mediaType === 'image' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Bild hochladen oder URL einfügen
              </label>
              
              {/* Upload Area */}
              <div
                onClick={triggerFileInput}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    const event = { target: { files: [file] } } as any;
                    handleImageUpload(event);
                  }
                }}
                className={`
                  relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                  transition-all duration-200
                  ${isUploading 
                    ? 'border-violet-500 bg-violet-500/10' 
                    : 'border-white/10 hover:border-violet-500/50 hover:bg-white/5'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-violet-400">Bild wird geladen...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-neutral-400" />
                    <span className="text-sm text-neutral-400">
                      Bild hier ablegen oder <span className="text-violet-400">klicken zum Auswählen</span>
                    </span>
                    <span className="text-xs text-neutral-500">
                      JPG, PNG, WebP, GIF (max. 2MB)
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Error */}
              {uploadError && (
                <p className="mt-2 text-sm text-red-400">{uploadError}</p>
              )}

              {/* URL Input (Alternative) */}
              <div className="mt-4">
                <label className="block text-xs text-neutral-400 mb-2">
                  Oder Bild-URL einfügen
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all text-sm"
                  placeholder="https://example.com/bild.jpg"
                />
              </div>

              {/* Preview */}
              {formData.imageUrl && (
                <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23333" width="100" height="100"/%3E%3Ctext fill="%23666" x="50%" y="50%" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Video URL */}
          {formData.mediaType === 'video' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Video URL (MP4/WebM)
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                placeholder="https://example.com/video.mp4"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Das Video wird bei Hover tonlos abgespielt und automatisch an die Kachelgröße angepasst.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-all"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TileEditor;
