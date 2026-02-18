import React from 'react';
import Tile from './components/Tile';
import FloatingDock from './components/FloatingDock';
import { PORTFOLIO_TILES, APP_METADATA } from './constants';

const App: React.FC = () => {
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
            <Tile key={tileConfig.id} config={tileConfig} />
          ))}
        </div>
      </main>

      {/* Bottom Floating Control */}
      <FloatingDock />
      
    </div>
  );
};

export default App;