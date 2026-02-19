import React, { useEffect, useState } from 'react';
import Tile from './components/Tile';
import FloatingDock from './components/FloatingDock';
import { PORTFOLIO_TILES, APP_METADATA } from './constants';
import { initAudio } from './utils/sound';

const App: React.FC = () => {
  const [highlightedTileId, setHighlightedTileId] = useState<string | null>(null);
  const [isSequenceRunning, setIsSequenceRunning] = useState(false);

  // Try to initialize audio context on mount or first interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      // Remove listener after first successful interaction to avoid overhead
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

  const handleStartSequence = async () => {
    if (isSequenceRunning) return;
    setIsSequenceRunning(true);
    initAudio(); // Ensure audio is ready

    // 1. Tone Ladder: Play all tiles in order
    for (const tile of PORTFOLIO_TILES) {
      setHighlightedTileId(tile.id);
      // Fast ladder speed
      await sleep(120);
    }
    setHighlightedTileId(null);
    await sleep(200);

    // 2. Roulette Selection
    // Filter only tiles that have a valid link or are actionable projects
    // We assume a 'valid' link is not just '#' (unless it's a placeholder we want to open)
    // For this demo, let's include all tiles that act as links or have video
    const candidates = PORTFOLIO_TILES.filter(t => t.link && t.link.length > 1);
    const pool = candidates.length > 0 ? candidates : PORTFOLIO_TILES;

    let speed = 40; // Start very fast (40ms)
    let lastId = '';
    
    // Run until speed becomes very slow
    // The curve: speed * 1.15 exponential slowdown
    while (speed < 700) {
        // Pick random
        let randomTile;
        do {
           randomTile = pool[Math.floor(Math.random() * pool.length)];
        } while (pool.length > 1 && randomTile.id === lastId); // Avoid repeat if possible
        
        setHighlightedTileId(randomTile.id);
        lastId = randomTile.id;
        
        await sleep(speed);
        
        // Decelerate
        // If speed is fast, decelerate slowly. If speed is slow, decelerate faster (snap to end)
        if (speed < 100) speed *= 1.1;
        else speed *= 1.2;
    }

    // 3. Final Selection
    // The loop exits with 'lastId' still highlighted. 
    // Wait a moment for the user to register the winner.
    await sleep(800);
    
    const finalTile = PORTFOLIO_TILES.find(t => t.id === lastId);
    if (finalTile?.link) {
      window.open(finalTile.link, finalTile.linkTarget || '_blank');
    }

    // Reset after a delay
    await sleep(1000);
    setHighlightedTileId(null);
    setIsSequenceRunning(false);
  };

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
          {APP_METADATA.subHeader}
        </p>
      </header>

      {/* Main Grid Layout */}
      <main className="w-full max-w-[1200px] relative z-10 pb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-4 md:gap-6">
          {PORTFOLIO_TILES.map((tileConfig) => (
            <Tile 
              key={tileConfig.id} 
              config={tileConfig} 
              forceHighlight={highlightedTileId === tileConfig.id}
            />
          ))}
        </div>
      </main>

      {/* Bottom Floating Control */}
      <FloatingDock onStart={handleStartSequence} />
      
    </div>
  );
};

export default App;