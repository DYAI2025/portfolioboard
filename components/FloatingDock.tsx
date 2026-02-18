import React from 'react';
import { Smartphone, Command } from 'lucide-react';

const FloatingDock: React.FC = () => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[340px] px-4">
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

        <div className="flex-1 h-full rounded-[1.5rem] bg-[#1a1a1a] mx-1 flex items-center justify-center border border-white/5 active:bg-[#222] transition-colors cursor-pointer group">
           <span className="text-neutral-400 text-sm font-medium group-hover:text-white transition-colors">Unlock</span>
        </div>

        <div className="w-16 h-12 mx-1 flex items-center justify-center rounded-[1.5rem] bg-[#1a1a1a] border border-white/5 text-neutral-400 hover:text-white hover:bg-[#252525] transition-colors cursor-pointer">
           <Command size={20} />
        </div>
      </div>
      
      <div className="text-center mt-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/50 border border-white/5 text-[10px] text-neutral-500 uppercase tracking-widest">
           <Smartphone size={10} /> 16 PRO MAX UI
        </span>
      </div>
    </div>
  );
};

export default FloatingDock;