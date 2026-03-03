import React from 'react';
import { Command, Edit2, Play, RotateCcw } from 'lucide-react';

interface FloatingDockProps {
  onStart?: () => void;
  onToggleEdit?: () => void;
  onReset?: () => void;
  isEditing?: boolean;
  isAdmin?: boolean;
}

const FloatingDock: React.FC<FloatingDockProps> = ({ onStart, onToggleEdit, onReset, isEditing, isAdmin }) => {
  const handleReset = () => {
    if (window.confirm('Reset all tiles to default? This will clear your saved changes.')) {
      onReset?.();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[400px] px-4">
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

        {/* Start Button */}
        <div
          onClick={onStart}
          className="flex-1 h-full rounded-[1.5rem] bg-[#1a1a1a] mx-1 flex items-center justify-center border border-white/5 active:bg-[#222] transition-colors cursor-pointer group gap-2"
        >
          <Play size={14} className="text-neutral-400 group-hover:text-white transition-colors fill-current" />
          <span className="text-neutral-400 text-sm font-medium group-hover:text-white transition-colors">Start</span>
        </div>

        {/* Edit Toggle (Admin only) */}
        {isAdmin && (
          <div
            onClick={onToggleEdit}
            className={`
               w-14 h-12 mx-1 flex items-center justify-center rounded-[1.5rem] border transition-colors cursor-pointer
               ${isEditing
                  ? 'bg-yellow-400 text-black border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.4)]'
                  : 'bg-[#1a1a1a] border-white/5 text-neutral-400 hover:text-white hover:bg-[#252525]'
               }
            `}
            title="Toggle Edit Mode"
          >
            <Edit2 size={18} />
          </div>
        )}

        {/* Reset Button (only visible in edit mode) */}
        {isAdmin && isEditing && (
          <div
            onClick={handleReset}
            className="w-14 h-12 mx-1 flex items-center justify-center rounded-[1.5rem] bg-[#1a1a1a] border border-white/5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors cursor-pointer"
            title="Reset to defaults"
          >
            <RotateCcw size={16} />
          </div>
        )}

        {/* Command Icon */}
        <div className="w-14 h-12 mx-1 flex items-center justify-center rounded-[1.5rem] bg-[#1a1a1a] border border-white/5 text-neutral-400 hover:text-white hover:bg-[#252525] transition-colors cursor-pointer">
          <Command size={20} />
        </div>
      </div>

      <div className="text-center mt-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/50 border border-white/5 text-[10px] text-neutral-500 uppercase tracking-widest">
          {isEditing ? '✏ EDIT MODE — changes auto-saved' : '◆ LUMINA OS · PORTFOLIO v2.0'}
        </span>
      </div>
    </div>
  );
};

export default FloatingDock;
