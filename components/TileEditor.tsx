import React, { useRef, useEffect, useState } from 'react';
import { TileConfig, TileSize, TileType, AccentColor, SoundKey } from '../types';
import { COLOR_PICKER_STYLE, SOFT_COLORS, VIVID_COLORS, COLOR_LABEL } from '../utils/tileStyles';
import { playChord } from '../utils/sound';
import {
  X, Check, LayoutGrid, Type, Image as ImageIcon, Video,
  AlignCenter, AlignLeft, AlignRight, Clapperboard, Upload,
  Eye, EyeOff, Palette, Music, Link as LinkIcon, ExternalLink, Volume2
} from 'lucide-react';

interface TileEditorProps {
  tile: TileConfig;
  onUpdate: (updatedTile: TileConfig) => void;
  onClose: () => void;
}

// Blob-URLs dieser Editor-Session — werden beim Unmount widerrufen
const blobUrls = new Set<string>();

const SOUND_KEYS: SoundKey[] = ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am'];

function isValidUrl(url: string): boolean {
  if (!url) return true;
  if (url.startsWith('/')) return true;
  try { new URL(url); return true; } catch { return false; }
}

const TileEditor: React.FC<TileEditorProps> = ({ tile, onUpdate, onClose }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{ audio?: string; link?: string }>({});

  // Revoke all blob URLs when editor closes
  useEffect(() => {
    return () => {
      blobUrls.forEach(url => URL.revokeObjectURL(url));
      blobUrls.clear();
    };
  }, []);

  const handleChange = (field: keyof TileConfig, value: any) => {
    const updated = { ...tile, [field]: value };

    // XOR-Validierung: audioUrl XOR videoUrl
    const newErrors = { ...errors };
    if (field === 'audioUrl' && value && updated.videoUrl) {
      newErrors.audio = 'Nicht kombinierbar mit Video — entferne zuerst das Video.';
    } else if (field === 'videoUrl' && value && updated.audioUrl) {
      newErrors.audio = 'Nicht kombinierbar mit Audio — entferne zuerst die Audio-Datei.';
    } else if (field === 'audioUrl' || field === 'videoUrl') {
      delete newErrors.audio;
    }

    // Link-Validierung
    if (field === 'link') {
      if (!isValidUrl(value)) {
        newErrors.link = 'Ungültige URL — bitte https://… oder / verwenden.';
      } else {
        delete newErrors.link;
      }
    }

    setErrors(newErrors);
    if (!Object.values(newErrors).some(Boolean)) {
      onUpdate(updated);
    } else if (field !== 'audioUrl' && field !== 'videoUrl') {
      // Allow partial updates for non-blocking fields
      onUpdate(updated);
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'imageUrl' | 'videoUrl' | 'audioUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // MIME-Typ prüfen
    if (field === 'audioUrl' && !file.type.startsWith('audio/')) {
      setErrors(prev => ({ ...prev, audio: 'Nur Audio-Dateien erlaubt (mp3, m4a, ogg, wav).' }));
      return;
    }
    if (field === 'videoUrl' && !file.type.startsWith('video/')) return;
    if (field === 'imageUrl' && !file.type.startsWith('image/')) return;

    // Größen-Warnung für Audio
    if (field === 'audioUrl' && file.size > 20 * 1024 * 1024) {
      if (!window.confirm('Große Audiodatei (>20 MB) kann die Ladezeit erhöhen. Trotzdem verwenden?')) return;
    }

    // Alten Blob widerrufen
    const prevUrl = tile[field] as string | undefined;
    if (prevUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(prevUrl);
      blobUrls.delete(prevUrl);
    }

    const url = URL.createObjectURL(file);
    blobUrls.add(url);
    handleChange(field, url);
  };

  const previewSound = (key: SoundKey) => {
    playChord(key);
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const hasMediaConflict = Boolean(tile.audioUrl && tile.videoUrl);

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[420px] z-[100] bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-out animate-in slide-in-from-right">

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 shrink-0">
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

        {/* ── LAYOUT ── */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <LayoutGrid size={14} /> Layout & Größe
          </label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(TileSize).map(size => (
              <button
                key={size}
                onClick={() => handleChange('size', size)}
                className={`h-12 rounded-xl border flex items-center justify-center text-sm font-medium transition-all ${
                  tile.size === size
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-200'
                    : 'bg-[#1a1a1a] border-white/5 text-neutral-400 hover:bg-[#222]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </section>

        {/* ── CONTENT ── */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <Type size={14} /> Inhalt
          </label>
          <div className="space-y-3">
            {/* Title */}
            <div className="group relative">
              <input
                type="text"
                value={tile.title || ''}
                onChange={e => handleChange('title', e.target.value)}
                placeholder=" "
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 pt-5 pb-2 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all peer"
              />
              <label className="absolute left-4 top-3.5 text-neutral-500 text-xs transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px]">
                Titel
              </label>
            </div>
            {/* Subtitle */}
            <div className="group relative">
              <input
                type="text"
                value={tile.subtitle || ''}
                onChange={e => handleChange('subtitle', e.target.value)}
                placeholder=" "
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 pt-5 pb-2 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all peer"
              />
              <label className="absolute left-4 top-3.5 text-neutral-500 text-xs transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px]">
                Untertitel
              </label>
            </div>
            {/* Text Alignment */}
            <div className="flex items-center justify-between bg-[#1a1a1a] p-2 rounded-xl border border-white/5">
              <span className="text-xs text-neutral-400 ml-2">Ausrichtung</span>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align, i) => {
                  const Icon = [AlignLeft, AlignCenter, AlignRight][i];
                  return (
                    <button
                      key={align}
                      onClick={() => handleChange('textAlign', align)}
                      className={`p-2 rounded-lg transition-colors ${(!tile.textAlign && align === 'left') || tile.textAlign === align ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── HYPERLINK ── */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <LinkIcon size={14} /> Hyperlink
          </label>
          <div className="space-y-3">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                <ExternalLink size={16} />
              </span>
              <input
                type="url"
                value={tile.link || ''}
                onChange={e => handleChange('link', e.target.value)}
                placeholder="https://…"
                aria-describedby="link-hint"
                className={`w-full bg-[#1a1a1a] border rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-700 ${
                  errors.link ? 'border-red-500/50 focus:border-red-500/70' : 'border-white/10 focus:border-violet-500/50'
                }`}
              />
            </div>
            {errors.link && (
              <p className="text-red-400 text-xs" role="alert">{errors.link}</p>
            )}
            <p id="link-hint" className="text-neutral-600 text-[10px]">
              Klick öffnet den Link — kein Thumbnail-Effekt auf der Kachel.
            </p>
            {/* Link Target */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 mr-1">Ziel:</span>
              {(['_blank', '_self'] as const).map(target => (
                <button
                  key={target}
                  onClick={() => handleChange('linkTarget', target)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    (tile.linkTarget || '_blank') === target
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-200'
                      : 'bg-[#1a1a1a] border-white/5 text-neutral-400 hover:bg-[#222]'
                  }`}
                >
                  {target === '_blank' ? '↗ Neuer Tab' : '→ Gleicher Tab'}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── STYLE & COLOR ── */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <Palette size={14} /> Glow-Farbe
          </label>

          {/* Sanft */}
          <div className="space-y-2">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest px-1">Sanft</p>
            <div className="flex flex-wrap gap-2.5 p-3 bg-[#1a1a1a] border border-white/5 rounded-xl">
              {SOFT_COLORS.map(color => (
                <ColorSwatch
                  key={color}
                  color={color}
                  selected={tile.accentColor === color}
                  onSelect={() => handleChange('accentColor', color)}
                />
              ))}
            </div>
          </div>

          {/* Kräftig */}
          <div className="space-y-2">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest px-1">Kräftig</p>
            <div className="flex flex-wrap gap-2.5 p-3 bg-[#1a1a1a] border border-white/5 rounded-xl">
              {VIVID_COLORS.map(color => (
                <ColorSwatch
                  key={color}
                  color={color}
                  selected={tile.accentColor === color}
                  onSelect={() => handleChange('accentColor', color)}
                />
              ))}
            </div>
          </div>

          {/* Active Highlight Toggle */}
          <div
            onClick={() => handleChange('active', !tile.active)}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              tile.active ? 'bg-neutral-900 border-white/20' : 'bg-[#1a1a1a] border-white/5 hover:bg-[#222]'
            }`}
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white ml-1">Active Highlight</span>
              <span className="text-[10px] text-neutral-500 ml-1">Zeigt Glow-Rand und Leuchten</span>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${tile.active ? 'bg-violet-500' : 'bg-neutral-700'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300 ${tile.active ? 'left-6' : 'left-1'}`} />
            </div>
          </div>
        </section>

        {/* ── HOVER SOUND ── */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <Volume2 size={14} /> Hover-Ton
          </label>
          <div className="p-3 bg-[#1a1a1a] border border-white/5 rounded-xl space-y-3">
            <div className="flex flex-wrap gap-2">
              {SOUND_KEYS.map(key => (
                <button
                  key={key}
                  onClick={() => { handleChange('soundKey', key); previewSound(key); }}
                  aria-pressed={tile.soundKey === key}
                  aria-label={`Ton ${key} auswählen und vorschau`}
                  className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
                    tile.soundKey === key
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-200 shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                      : 'bg-[#111] border-white/5 text-neutral-400 hover:bg-[#222] hover:text-white'
                  }`}
                >
                  <Music size={10} />
                  {key}
                </button>
              ))}
              {/* "Kein Ton" Option */}
              <button
                onClick={() => handleChange('soundKey', undefined)}
                aria-pressed={!tile.soundKey}
                className={`px-3 py-2 rounded-lg text-xs border transition-all ${
                  !tile.soundKey
                    ? 'bg-neutral-700/50 border-neutral-600 text-neutral-300'
                    : 'bg-[#111] border-white/5 text-neutral-600 hover:bg-[#222] hover:text-neutral-400'
                }`}
              >
                Aus
              </button>
            </div>
            <p className="text-[10px] text-neutral-700">Ton spielt bei Hover und während der Roulette-Animation.</p>
          </div>
        </section>

        {/* ── MEDIA SOURCE ── */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <ImageIcon size={14} /> Medien
          </label>

          {/* Reveal on Hover Toggle */}
          <div
            onClick={() => handleChange('showMediaOnHoverOnly', !tile.showMediaOnHoverOnly)}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              tile.showMediaOnHoverOnly ? 'bg-neutral-900 border-white/20' : 'bg-[#1a1a1a] border-white/5 hover:bg-[#222]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${tile.showMediaOnHoverOnly ? 'bg-white/10 text-white' : 'bg-black text-neutral-500'}`}>
                {tile.showMediaOnHoverOnly ? <EyeOff size={16} /> : <Eye size={16} />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Reveal on Hover</span>
                <span className="text-[10px] text-neutral-500">
                  {tile.showMediaOnHoverOnly ? 'Medien versteckt bis zur Interaktion' : 'Medien immer sichtbar'}
                </span>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${tile.showMediaOnHoverOnly ? 'bg-violet-500' : 'bg-neutral-700'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-transform duration-300 ${tile.showMediaOnHoverOnly ? 'left-6' : 'left-1'}`} />
            </div>
          </div>

          <div className="space-y-3">
            {/* Image */}
            <MediaRow
              icon={<ImageIcon size={16} />}
              value={tile.imageUrl || ''}
              placeholder="Bild-URL"
              onChange={v => handleChange('imageUrl', v)}
              onUpload={() => imageInputRef.current?.click()}
            />
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'imageUrl')} />

            {/* Video — gesperrt wenn audioUrl gesetzt */}
            <div className={tile.audioUrl ? 'opacity-40 pointer-events-none' : ''}>
              <MediaRow
                icon={<Video size={16} />}
                value={tile.videoUrl || ''}
                placeholder="Video-URL"
                onChange={v => handleChange('videoUrl', v)}
                onUpload={() => videoInputRef.current?.click()}
                disabled={Boolean(tile.audioUrl)}
              />
            </div>
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => handleFileUpload(e, 'videoUrl')} />

            {/* Video Thumbnail */}
            {tile.videoUrl && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">
                  <Clapperboard size={16} />
                </span>
                <input
                  type="text"
                  value={tile.videoThumbnail || ''}
                  onChange={e => handleChange('videoThumbnail', e.target.value)}
                  placeholder="Video-Thumbnail (optional)"
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-neutral-700"
                />
              </div>
            )}

            {/* Audio — gesperrt wenn videoUrl gesetzt */}
            <div className={tile.videoUrl ? 'opacity-40 pointer-events-none' : ''}>
              <MediaRow
                icon={<Music size={16} />}
                value={tile.audioUrl || ''}
                placeholder="Audio-URL (mp3, m4a, ogg)"
                onChange={v => handleChange('audioUrl', v)}
                onUpload={() => audioInputRef.current?.click()}
                disabled={Boolean(tile.videoUrl)}
                hasError={Boolean(errors.audio)}
              />
            </div>
            <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={e => handleFileUpload(e, 'audioUrl')} />

            {/* Audio/Video Konflikt-Fehler */}
            {(errors.audio || hasMediaConflict) && (
              <p className="text-red-400 text-xs flex items-center gap-1.5" role="alert">
                <span>⚠</span>
                {errors.audio || 'Video und Audio können nicht gleichzeitig verwendet werden.'}
              </p>
            )}

            {/* Blob-URL Hinweis */}
            {(tile.audioUrl?.startsWith('blob:') || tile.videoUrl?.startsWith('blob:') || tile.imageUrl?.startsWith('blob:')) && (
              <p className="text-amber-600/80 text-[10px] flex gap-1.5">
                <span>⚠</span> Hochgeladene Dateien gehen beim Reload verloren. Für dauerhafte Nutzung externe URL verwenden.
              </p>
            )}
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/5 bg-[#050505] shrink-0">
        <button
          onClick={onClose}
          disabled={hasErrors || hasMediaConflict}
          className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Check size={18} /> Fertig
        </button>
      </div>
    </div>
  );
};

// ── Sub-Components ──

interface ColorSwatchProps {
  color: AccentColor;
  selected: boolean;
  onSelect: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, selected, onSelect }) => (
  <button
    onClick={onSelect}
    aria-pressed={selected}
    aria-label={`Glow-Farbe ${COLOR_LABEL[color]}`}
    title={COLOR_LABEL[color]}
    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all relative ${
      selected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a] scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
    }`}
  >
    <div className={`w-full h-full rounded-full ${COLOR_PICKER_STYLE[color]}`} />
    {selected && (
      <div className="absolute inset-0 flex items-center justify-center">
        <Check size={12} className="text-black/60 font-bold" />
      </div>
    )}
  </button>
);

interface MediaRowProps {
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onUpload: () => void;
  disabled?: boolean;
  hasError?: boolean;
}

const MediaRow: React.FC<MediaRowProps> = ({ icon, value, placeholder, onChange, onUpload, disabled, hasError }) => (
  <div className="flex gap-2">
    <div className="relative flex-1">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600">{icon}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full bg-[#1a1a1a] border rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-neutral-700 ${
          hasError ? 'border-red-500/50' : 'border-white/10 focus:border-violet-500/50'
        }`}
      />
    </div>
    <button
      onClick={onUpload}
      disabled={disabled}
      className="w-12 rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center hover:bg-[#222] hover:text-white text-neutral-500 transition-colors disabled:opacity-30"
      title="Datei hochladen"
    >
      <Upload size={18} />
    </button>
  </div>
);

export default TileEditor;
