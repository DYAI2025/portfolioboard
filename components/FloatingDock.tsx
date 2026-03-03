import React from 'react';
import { Command, Edit2, Play, RotateCcw, Download, Upload } from 'lucide-react';

interface FloatingDockProps {
  onStart?: () => void;
  onToggleEdit?: () => void;
  onReset?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  isEditing?: boolean;
  isAdmin?: boolean;
}

const FloatingDock: React.FC<FloatingDockProps> = ({
  onStart,
  onToggleEdit,
  onReset,
  onExport,
  onImport,
  isEditing,
  isAdmin,
}) => {
  const handleReset = () => {
    // Bestätigung liegt in App.tsx (handleResetTiles)
    onReset?.();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-4">

      {/* Main Dock */}
      <div className="
        relative
        flex items-center justify-between
        h-16 px-2
        bg-[#0a0a0a]/80 backdrop-blur-xl
        border border-white/5 border-t-white/10
        rounded-[2rem]
        shadow-2xl
      ">
        {/* Glow behind dock */}
        <div className="absolute -inset-4 bg-violet-500/20 blur-2xl -z-10 rounded-full pointer-events-none" />

        {/* Start / Roulette */}
        <div
          onClick={onStart}
          role="button"
          aria-label="Roulette starten"
          className="flex-1 h-full rounded-[1.5rem] bg-[#1a1a1a] mx-1 flex items-center justify-center border border-white/5 active:bg-[#222] transition-colors cursor-pointer group gap-2"
        >
          <Play size={14} className="text-neutral-400 group-hover:text-white transition-colors fill-current" />
          <span className="text-neutral-400 text-sm font-medium group-hover:text-white transition-colors">Start</span>
        </div>

        {/* Edit Toggle (Admin only) */}
        {isAdmin && (
          <div
            onClick={onToggleEdit}
            role="button"
            aria-pressed={isEditing}
            aria-label="Edit-Mode umschalten"
            title="Edit Mode"
            className={`
              w-14 h-12 mx-1 flex items-center justify-center rounded-[1.5rem] border transition-colors cursor-pointer
              ${isEditing
                ? 'bg-yellow-400 text-black border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                : 'bg-[#1a1a1a] border-white/5 text-neutral-400 hover:text-white hover:bg-[#252525]'
              }
            `}
          >
            <Edit2 size={18} />
          </div>
        )}

        {/* Reset (Admin + Edit-Mode) */}
        {isAdmin && isEditing && (
          <div
            onClick={handleReset}
            role="button"
            aria-label="Auf Standard zurücksetzen"
            title="Zurücksetzen"
            className="w-14 h-12 mx-1 flex items-center justify-center rounded-[1.5rem] bg-[#1a1a1a] border border-white/5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
          </div>
        )}

        {/* Command (dekorativ) */}
        <div className="w-14 h-12 mx-1 flex items-center justify-center rounded-[1.5rem] bg-[#1a1a1a] border border-white/5 text-neutral-400 hover:text-white hover:bg-[#252525] transition-colors cursor-pointer">
          <Command size={20} />
        </div>
      </div>

      {/* Status / Export-Import Bar */}
      <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/50 border border-white/5 text-[10px] text-neutral-500 uppercase tracking-widest">
          {isEditing ? '✏ Edit Mode — auto-saved' : '◆ Lumina OS · Portfolio v2.0'}
        </span>

        {/* Export / Import (Admin + Edit-Mode) */}
        {isAdmin && isEditing && (
          <>
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/60 border border-white/5 text-[10px] text-neutral-500 hover:text-white hover:border-white/10 transition-colors uppercase tracking-widest"
              title="Tiles als JSON exportieren"
            >
              <Download size={9} /> Export
            </button>
            <button
              onClick={onImport}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/60 border border-white/5 text-[10px] text-neutral-500 hover:text-white hover:border-white/10 transition-colors uppercase tracking-widest"
              title="Tiles aus JSON importieren"
            >
              <Upload size={9} /> Import
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FloatingDock;
