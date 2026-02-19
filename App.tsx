import React, { useEffect, useState } from 'react';
import Tile from './components/Tile';
import FloatingDock from './components/FloatingDock';
import TileEditor from './components/TileEditor';
import { PORTFOLIO_TILES, APP_METADATA } from './constants';
import { TileConfig } from './types';
import { initAudio } from './utils/sound';

const App: React.FC = () => {
  // --- STATE ---
  const [tiles, setTiles] = useState<TileConfig[]>(PORTFOLIO_TILES);
  const [highlightedTileId, setHighlightedTileId] = useState<string | null>(null);
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);
  
  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);

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
    if (isSequenceRunning || isEditMode) return; // Disable animation during edit mode
    setIsSequenceRunning(true);
    initAudio(); 

    // 1. Tone Ladder
    for (const tile of tiles) {
      setHighlightedTileId(tile.id);
      await sleep(120);
    }
    setHighlightedTileId(null);
    await sleep(200);

    // 2. Roulette Selection
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

    // 3. Final Selection
    await sleep(800);
    
    const finalTile = tiles.find(t => t.id === lastId);
    if (finalTile?.link) {
      window.open(finalTile.link, finalTile.linkTarget || '_blank');
    }

    await sleep(1000);
    setHighlightedTileId(null);
    setIsSequenceRunning(false);
  };

  // --- EDITING HANDLERS ---
  
  const handleEditClick = (tile: TileConfig) => {
    setEditingTileId(tile.id);
  };

  const handleTileUpdate = (updatedTile: TileConfig) => {
    setTiles(prevTiles => prevTiles.map(t => t.id === updatedTile.id ? updatedTile : t));
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

      {/* Main Grid Layout */}
      <main className="w-full max-w-[1200px] relative z-10 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-4 md:gap-6">
          {tiles.map((tileConfig) => (
            <Tile 
              key={tileConfig.id} 
              config={tileConfig} 
              forceHighlight={highlightedTileId === tileConfig.id}
              isEditing={isEditMode}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      </main>

      {/* GUI Editor Modal (Side Panel) */}
      {isEditMode && activeEditingTile && (
        <TileEditor 
          tile={activeEditingTile}
          onUpdate={handleTileUpdate}
          onClose={() => setEditingTileId(null)}
        />
      )}

      {/* Bottom Floating Control */}
      <FloatingDock 
        onStart={handleStartSequence} 
        onToggleEdit={() => {
            setIsEditMode(!isEditMode);
            setEditingTileId(null);
        }}
        isEditing={isEditMode}
      />
      
    </div>
  );
};

export default App;