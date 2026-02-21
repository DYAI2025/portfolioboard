import React, { useRef } from 'react';
import { Smartphone, Edit2, RotateCcw, Download, Upload, Play } from 'lucide-react';

interface FloatingDockProps {
  onStart?: () => void;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  onResetTiles?: () => void;
  onExportConfig?: () => void;
  onImportConfig?: (jsonString: string) => void;
}

const FloatingDock: React.FC<FloatingDockProps> = ({
  onStart,
  isEditMode = false,
  onToggleEditMode,
  onResetTiles,
  onExportConfig,
  onImportConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      onImportConfig?.(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[420px] px-4">
      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

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

        {/* Edit Mode Toggle */}
        <div
          onClick={onToggleEditMode}
          className={`h-full rounded-[1.5rem] mx-1 flex items-center justify-center border transition-all cursor-pointer ${
            isEditMode
              ? 'bg-violet-600 border-violet-500 text-white'
              : 'bg-[#1a1a1a] border-white/5 text-neutral-400 hover:bg-[#222] hover:text-white'
          }`}
          style={{ flex: '0 0 auto', width: '56px' }}
          title={isEditMode ? 'Bearbeitungsmodus deaktivieren' : 'Bearbeitungsmodus aktivieren'}
        >
           <Edit2 size={18} />
        </div>

        {/* Export Button (only visible in edit mode) */}
        {isEditMode && (
          <div
            onClick={onExportConfig}
            className="h-full rounded-[1.5rem] mx-1 flex items-center justify-center border border-white/5 bg-[#1a1a1a] text-neutral-400 hover:text-green-400 hover:bg-[#222] transition-colors cursor-pointer"
            style={{ flex: '0 0 auto', width: '56px' }}
            title="Config exportieren (tiles.json)"
          >
            <Download size={18} />
          </div>
        )}

        {/* Import Button (only visible in edit mode) */}
        {isEditMode && (
          <div
            onClick={handleImportClick}
            className="h-full rounded-[1.5rem] mx-1 flex items-center justify-center border border-white/5 bg-[#1a1a1a] text-neutral-400 hover:text-blue-400 hover:bg-[#222] transition-colors cursor-pointer"
            style={{ flex: '0 0 auto', width: '56px' }}
            title="Config importieren (tiles.json)"
          >
            <Upload size={18} />
          </div>
        )}

        {/* Start Button */}
        <div
          onClick={onStart}
          className="flex-1 h-full rounded-[1.5rem] bg-[#1a1a1a] mx-1 flex items-center justify-center border border-white/5 active:bg-[#222] transition-colors cursor-pointer group gap-2"
        >
           <Play size={14} className="text-neutral-400 group-hover:text-white transition-colors fill-current" />
           <span className="text-neutral-400 text-sm font-medium group-hover:text-white transition-colors">Start</span>
        </div>

        {/* Reset Button (only visible in edit mode) */}
        {isEditMode && (
          <div
            onClick={onResetTiles}
            className="h-full rounded-[1.5rem] mx-1 flex items-center justify-center border border-white/5 bg-[#1a1a1a] text-neutral-400 hover:text-red-400 hover:bg-[#222] transition-colors cursor-pointer"
            style={{ flex: '0 0 auto', width: '56px' }}
            title="Alle Anpassungen zurücksetzen"
          >
            <RotateCcw size={18} />
          </div>
        )}
      </div>

      <div className="text-center mt-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/50 border border-white/5 text-[10px] text-neutral-500 uppercase tracking-widest">
           <Smartphone size={10} /> {isEditMode ? 'EDIT MODE ACTIVE' : '16 PRO MAX UI'}
        </span>
      </div>
    </div>
  );
};

export default FloatingDock;
