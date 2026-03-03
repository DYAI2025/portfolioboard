import { AccentColor } from '../types';

// Alle Klassen als vollständige Strings → Tailwind-Content-Scanner erkennt sie sicher

export const GLOW_GRADIENT: Record<AccentColor, string> = {
  blue:    'from-blue-400 via-blue-500 to-blue-600',
  purple:  'from-violet-400 via-violet-500 to-violet-600',
  white:   'from-white via-neutral-100 to-neutral-300',
  orange:  'from-orange-400 via-orange-500 to-orange-600',
  green:   'from-emerald-400 via-emerald-500 to-emerald-600',
  sky:     'from-sky-300 via-sky-400 to-sky-500',
  rose:    'from-rose-300 via-rose-400 to-rose-500',
  amber:   'from-amber-300 via-amber-400 to-amber-500',
  teal:    'from-teal-300 via-teal-400 to-teal-500',
  indigo:  'from-indigo-400 via-indigo-500 to-indigo-600',
  lime:    'from-lime-300 via-lime-400 to-lime-500',
  cyan:    'from-cyan-400 via-cyan-500 to-cyan-600',
  fuchsia: 'from-fuchsia-400 via-fuchsia-500 to-fuchsia-600',
  red:     'from-red-400 via-red-500 to-red-600',
  yellow:  'from-yellow-300 via-yellow-400 to-yellow-500',
};

export const ACTIVE_BORDER: Record<AccentColor, string> = {
  blue:    'ring-blue-400/50',
  purple:  'ring-violet-400/50',
  white:   'ring-white/50',
  orange:  'ring-orange-400/50',
  green:   'ring-emerald-400/50',
  sky:     'ring-sky-400/50',
  rose:    'ring-rose-400/50',
  amber:   'ring-amber-400/50',
  teal:    'ring-teal-400/50',
  indigo:  'ring-indigo-400/50',
  lime:    'ring-lime-400/50',
  cyan:    'ring-cyan-400/50',
  fuchsia: 'ring-fuchsia-400/50',
  red:     'ring-red-400/50',
  yellow:  'ring-yellow-400/50',
};

export const ACTIVE_SHADOW: Record<AccentColor, string> = {
  blue:    'shadow-[0_0_50px_-12px_rgba(59,130,246,0.6)]',
  purple:  'shadow-[0_0_50px_-12px_rgba(139,92,246,0.6)]',
  white:   'shadow-[0_0_50px_-12px_rgba(255,255,255,0.4)]',
  orange:  'shadow-[0_0_50px_-12px_rgba(249,115,22,0.6)]',
  green:   'shadow-[0_0_50px_-12px_rgba(16,185,129,0.6)]',
  sky:     'shadow-[0_0_50px_-12px_rgba(14,165,233,0.6)]',
  rose:    'shadow-[0_0_50px_-12px_rgba(244,63,94,0.6)]',
  amber:   'shadow-[0_0_50px_-12px_rgba(245,158,11,0.6)]',
  teal:    'shadow-[0_0_50px_-12px_rgba(20,184,166,0.6)]',
  indigo:  'shadow-[0_0_50px_-12px_rgba(99,102,241,0.6)]',
  lime:    'shadow-[0_0_50px_-12px_rgba(132,204,22,0.6)]',
  cyan:    'shadow-[0_0_50px_-12px_rgba(6,182,212,0.6)]',
  fuchsia: 'shadow-[0_0_50px_-12px_rgba(217,70,239,0.6)]',
  red:     'shadow-[0_0_50px_-12px_rgba(239,68,68,0.6)]',
  yellow:  'shadow-[0_0_50px_-12px_rgba(234,179,8,0.6)]',
};

export const ACTIVE_TINT: Record<AccentColor, string> = {
  blue:    'from-blue-500/10 to-transparent',
  purple:  'from-violet-500/10 to-transparent',
  white:   'from-white/10 to-transparent',
  orange:  'from-orange-500/10 to-transparent',
  green:   'from-emerald-500/10 to-transparent',
  sky:     'from-sky-500/10 to-transparent',
  rose:    'from-rose-500/10 to-transparent',
  amber:   'from-amber-500/10 to-transparent',
  teal:    'from-teal-500/10 to-transparent',
  indigo:  'from-indigo-500/10 to-transparent',
  lime:    'from-lime-500/10 to-transparent',
  cyan:    'from-cyan-500/10 to-transparent',
  fuchsia: 'from-fuchsia-500/10 to-transparent',
  red:     'from-red-500/10 to-transparent',
  yellow:  'from-yellow-500/10 to-transparent',
};

// Für TileEditor Color-Picker: Swatch-Darstellung
export const COLOR_PICKER_STYLE: Record<AccentColor, string> = {
  blue:    'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]',
  purple:  'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]',
  white:   'bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)]',
  orange:  'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]',
  green:   'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]',
  sky:     'bg-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.4)]',
  rose:    'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
  amber:   'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]',
  teal:    'bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.4)]',
  indigo:  'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]',
  lime:    'bg-lime-400 shadow-[0_0_10px_rgba(132,204,22,0.4)]',
  cyan:    'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]',
  fuchsia: 'bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.6)]',
  red:     'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]',
  yellow:  'bg-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.6)]',
};

// Farbgruppen für den Editor
export const SOFT_COLORS: AccentColor[] = ['white', 'sky', 'rose', 'amber', 'teal', 'indigo', 'lime'];
export const VIVID_COLORS: AccentColor[] = ['blue', 'purple', 'orange', 'green', 'cyan', 'fuchsia', 'red', 'yellow'];

export const COLOR_LABEL: Record<AccentColor, string> = {
  blue: 'Blue', purple: 'Purple', white: 'White', orange: 'Orange', green: 'Green',
  sky: 'Sky', rose: 'Rose', amber: 'Amber', teal: 'Teal', indigo: 'Indigo', lime: 'Lime',
  cyan: 'Cyan', fuchsia: 'Fuchsia', red: 'Red', yellow: 'Yellow',
};
