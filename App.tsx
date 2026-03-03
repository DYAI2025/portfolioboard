import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import Tile from './components/Tile';
import FloatingDock from './components/FloatingDock';
import TileEditor from './components/TileEditor';
import MediaOverlay from './components/MediaOverlay';
import AdminLogin from './components/AdminLogin';
import { PORTFOLIO_TILES, APP_METADATA } from './constants';
import { TileConfig } from './types';
import { initAudio } from './utils/sound';

const STORAGE_KEY = 'lumina_tiles_v1';

// Bereinigt Blob-URLs — nach Reload sind sie ungültig
function sanitizeMediaField(url: string | undefined): string | undefined {
  if (url?.startsWith('blob:')) {
    console.warn('Lumina: Blob-URL nach Reload ungültig, wird entfernt:', url);
    return undefined;
  }
  return url;
}

function loadTiles(): TileConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<TileConfig>[];
      return PORTFOLIO_TILES.map(defaultTile => {
        const saved = parsed.find(t => t.id === defaultTile.id);
        if (!saved) return defaultTile;
        return {
          ...defaultTile,
          ...saved,
          // Blob-URLs bereinigen (EC-01)
          imageUrl:   sanitizeMediaField(saved.imageUrl),
          videoUrl:   sanitizeMediaField(saved.videoUrl),
          audioUrl:   sanitizeMediaField(saved.audioUrl),
          // Icon ist nicht serialisierbar → immer vom Default
          icon: defaultTile.icon,
        };
      });
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return PORTFOLIO_TILES;
}

function saveTiles(tiles: TileConfig[]) {
  try {
    const serializable = tiles.map(({ icon: _icon, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    console.warn('Lumina: Tiles konnten nicht in localStorage gespeichert werden (QuotaExceeded?).');
  }
}

const App: React.FC = () => {
  // --- STATE ---
  const [tiles, setTiles] = useState<TileConfig[]>(loadTiles);
  const [highlightedTileId, setHighlightedTileId] = useState<string | null>(null);
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);

  // Edit Mode
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Media Overlay
  const [selectedMediaTile, setSelectedMediaTile] = useState<TileConfig | null>(null);

  // Import file input ref
  const importInputRef = useRef<HTMLInputElement>(null);

  // --- AUDIO INIT ---
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // --- PERSIST on change ---
  useEffect(() => {
    saveTiles(tiles);
  }, [tiles]);

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // --- ROULETTE SEQUENCE ---
  const handleStartSequence = async () => {
    if (isSequenceRunning || isEditMode) return;
    setIsSequenceRunning(true);
    initAudio();

    // 1. Tone Ladder
    for (const tile of tiles) {
      setHighlightedTileId(tile.id);
      await sleep(120);
    }
    setHighlightedTileId(null);
    await sleep(200);

    // 2. Roulette
    const candidates = tiles.filter(t => t.link && t.link.length > 1);
    const pool = candidates.length > 0 ? candidates : tiles;
    let speed = 40;
    let lastId = '';

    while (speed < 700) {
      let randomTile;
      do {
        randomTile = pool[Math.floor(Math.random() * pool.length)];
      } while (pool.length > 1 && randomTile.id === lastId);

      setHighlightedTileId(randomTile.id);
      lastId = randomTile.id;
      await sleep(speed);

      if (speed < 100) speed *= 1.1;
      else speed *= 1.2;
    }

    // 3. Final
    await sleep(800);
    const finalTile = tiles.find(t => t.id === lastId);
    if (finalTile?.link) {
      window.open(finalTile.link, finalTile.linkTarget || '_blank');
    }

    await sleep(1000);
    setHighlightedTileId(null);
    setIsSequenceRunning(false);
  };

  // --- HANDLERS ---

  const handleEditClick = (tile: TileConfig) => setEditingTileId(tile.id);

  const handleTileUpdate = (updatedTile: TileConfig) => {
    setTiles(prev => prev.map(t => t.id === updatedTile.id ? updatedTile : t));
  };

  const handleOpenMedia = (tile: TileConfig) => setSelectedMediaTile(tile);

  const handleResetTiles = () => {
    if (!window.confirm('Alle Kacheln auf Standard zurücksetzen? Gespeicherte Änderungen gehen verloren.')) return;
    localStorage.removeItem(STORAGE_KEY);
    setTiles(PORTFOLIO_TILES);
  };

  // Export: Tiles als JSON-Datei herunterladen
  const handleExportTiles = () => {
    const serializable = tiles.map(({ icon: _icon, ...rest }) => rest);
    const json = JSON.stringify(serializable, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina-tiles-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import: JSON-Datei lesen und Tiles mergen
  const handleImportTiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target?.result as string) as Partial<TileConfig>[];
        const merged = PORTFOLIO_TILES.map(defaultTile => {
          const imp = imported.find(t => t.id === defaultTile.id);
          if (!imp) return defaultTile;
          return {
            ...defaultTile,
            ...imp,
            imageUrl: sanitizeMediaField(imp.imageUrl),
            videoUrl: sanitizeMediaField(imp.videoUrl),
            audioUrl: sanitizeMediaField(imp.audioUrl),
            icon: defaultTile.icon,
          };
        });
        setTiles(merged);
      } catch {
        alert('Import fehlgeschlagen: Ungültiges JSON-Format.');
      }
    };
    reader.readAsText(file);
    // Input zurücksetzen, damit dieselbe Datei erneut geladen werden kann
    e.target.value = '';
  };

  const activeEditingTile = tiles.find(t => t.id === editingTileId);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-12 px-4 sm:px-6 selection:bg-violet-500/30">

      {/* Ambient Background Light */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="mb-12 text-center relative z-10">
        <h1 className="text-4xl font-light tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
          {APP_METADATA.header}
        </h1>
        <p className="text-neutral-500 text-sm uppercase tracking-[0.2em]">
          {isEditMode ? 'Configuration Mode' : APP_METADATA.subHeader}
        </p>
      </header>

      {/* Main Grid */}
      <main className="w-full max-w-[1200px] relative z-10 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-4 md:gap-6">
          {tiles.map(tileConfig => (
            <Tile
              key={tileConfig.id}
              config={tileConfig}
              forceHighlight={highlightedTileId === tileConfig.id}
              isEditing={isEditMode}
              onEdit={handleEditClick}
              onOpenMedia={handleOpenMedia}
            />
          ))}
        </div>
      </main>

      {/* Media Lightbox */}
      {selectedMediaTile && (
        <MediaOverlay tile={selectedMediaTile} onClose={() => setSelectedMediaTile(null)} />
      )}

      {/* TileEditor */}
      {isEditMode && activeEditingTile && (
        <TileEditor
          tile={activeEditingTile}
          onUpdate={handleTileUpdate}
          onClose={() => setEditingTileId(null)}
        />
      )}

      {/* Admin Login */}
      {showLogin && (
        <AdminLogin
          onLogin={success => setIsAdmin(success)}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Hidden Import Input */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImportTiles}
      />

      {/* Floating Dock */}
      <FloatingDock
        onStart={handleStartSequence}
        onToggleEdit={() => { setIsEditMode(!isEditMode); setEditingTileId(null); }}
        onReset={handleResetTiles}
        onExport={handleExportTiles}
        onImport={() => importInputRef.current?.click()}
        isEditing={isEditMode}
        isAdmin={isAdmin}
      />

      {/* Hidden Admin Trigger */}
      {!isAdmin && (
        <div
          className="fixed bottom-4 right-4 z-50 opacity-10 hover:opacity-100 cursor-pointer p-2 transition-opacity duration-300"
          onClick={() => setShowLogin(true)}
          title="Admin Access"
        >
          <Star size={12} className="text-neutral-600" />
        </div>
      )}
    </div>
  );
};

export default App;
