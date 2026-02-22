import React, { useEffect, useState, useCallback } from 'react';
import Tile from './components/Tile';
import FloatingDock from './components/FloatingDock';
import TileEditor from './components/TileEditor';
import { PORTFOLIO_TILES, APP_METADATA } from './constants';
import { TileConfig } from './types';
import { initAudio } from './utils/sound';
import { applyStoredConfigToTiles, updateTileInStorage, EditableTileConfig, importTilesFromJSON, saveImportedTiles } from './utils/storage';

const App: React.FC = () => {
  // --- STATE ---
  const [tiles, setTiles] = useState<TileConfig[]>(() => applyStoredConfigToTiles(PORTFOLIO_TILES));
  const [highlightedTileId, setHighlightedTileId] = useState<string | null>(null);
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);

  // Editor State
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTile, setSelectedTile] = useState<TileConfig | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  // --- ANIMATION SEQUENCE ---
  const handleStartSequence = async () => {
    if (isSequenceRunning || isEditMode) return;
    setIsSequenceRunning(true);
    initAudio();

    for (const tile of tiles) {
      setHighlightedTileId(tile.id);
      await sleep(120);
    }
    setHighlightedTileId(null);
    await sleep(200);

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

    await sleep(800);

    const finalTile = tiles.find(t => t.id === lastId);
    if (finalTile?.link) {
      window.open(finalTile.link, finalTile.linkTarget || '_blank');
    }

    await sleep(1000);
    setHighlightedTileId(null);
    setIsSequenceRunning(false);
  };

  // Editor Handlers
  const handleTileSelect = useCallback((tile: TileConfig) => {
    if (isEditMode) {
      setSelectedTile(tile);
      setIsEditorOpen(true);
    }
  }, [isEditMode]);

  const handleSaveTile = useCallback((editableConfig: EditableTileConfig) => {
    updateTileInStorage(editableConfig);
    setTiles(prevTiles => applyStoredConfigToTiles(PORTFOLIO_TILES));
  }, []);

  const handleResetTiles = useCallback(() => {
    if (window.confirm('Alle Anpassungen zurücksetzen?')) {
      localStorage.removeItem('lumina-tiles-config');
      setTiles(PORTFOLIO_TILES);
    }
  }, []);

  // Export/Import Handlers
  const handleExportConfig = useCallback(() => {
    const stored = localStorage.getItem('lumina-tiles-config');
    if (!stored) {
      alert('Keine Änderungen zum Exportieren vorhanden. Bearbeite zuerst einige Kacheln.');
      return;
    }
    const blob = new Blob([stored], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiles.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const handleImportConfig = useCallback((jsonString: string) => {
    const importedTiles = importTilesFromJSON(jsonString);
    if (importedTiles.length > 0) {
      saveImportedTiles(importedTiles);
      setTiles(applyStoredConfigToTiles(PORTFOLIO_TILES));
      alert(`✅ ${importedTiles.length} Kachel-Konfigurationen importiert!`);
    } else {
      alert('❌ Ungültige JSON-Datei');
    }
  }, []);

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
        {isEditMode && (
          <p className="text-violet-400 text-xs mt-3 uppercase tracking-wider">
            ✏️ Doppelklick auf Kachel zum Bearbeiten
          </p>
        )}
      </header>

      {/* Main Grid Layout */}
      <main className="w-full max-w-[1200px] relative z-10 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-4 md:gap-6">
          {tiles.map((tileConfig) => (
            <Tile
              key={tileConfig.id}
              config={tileConfig}
              forceHighlight={highlightedTileId === tileConfig.id}
              isEditMode={isEditMode}
              onTileSelect={handleTileSelect}
            />
          ))}
        </div>
      </main>

      {/* Bottom Floating Control */}
      <FloatingDock
        onStart={handleStartSequence}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onResetTiles={handleResetTiles}
        onExportConfig={handleExportConfig}
        onImportConfig={handleImportConfig}
      />

      {/* Tile Editor Modal */}
      <TileEditor
        tile={selectedTile}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedTile(null);
        }}
        onSave={handleSaveTile}
      />

    </div>
  );
};

export default App;
