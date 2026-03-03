import React from 'react';

export enum TileType {
  LINK = 'link',
  TEXT = 'text',
  NUMBER = 'number',
  IMAGE = 'image',
  ACTION = 'action',
  AUDIO = 'audio',
  VIDEO = 'video'
}

export enum TileSize {
  SMALL = '1x1',
  WIDE = '2x1',
  TALL = '1x2',
  LARGE = '2x2'
}

export type SoundKey = 'Cm' | 'Dm' | 'Em' | 'Fm' | 'Gm' | 'Am';

// Erweiterte Glow-Farbpalette (15 Farben: 5 bestehend + 6 sanft + 4 kräftig)
export type AccentColor =
  // Bestehend
  | 'blue' | 'purple' | 'white' | 'orange' | 'green'
  // Sanft
  | 'sky' | 'rose' | 'amber' | 'teal' | 'indigo' | 'lime'
  // Kräftig
  | 'cyan' | 'fuchsia' | 'red' | 'yellow';

export interface TileShadowConfig {
  default?: string;
  hover?: string;
  active?: string;
}

export interface TileConfig {
  id: string;
  type: TileType;
  size: TileSize;
  title?: string;
  subtitle?: string;
  value?: string | number;
  icon?: React.ReactNode;

  // Media & Backgrounds
  imageUrl?: string;
  videoUrl?: string;        // mp4/webm — XOR mit audioUrl
  audioUrl?: string;        // mp3/m4a/ogg/wav — XOR mit videoUrl
  videoThumbnail?: string;  // Poster-Bild für Video-Kacheln
  backgroundClass?: string;
  showMediaOnHoverOnly?: boolean;

  // Link Configuration
  link?: string;
  linkTarget?: '_blank' | '_self' | '_parent' | '_top';

  // State & Style
  active?: boolean;
  accentColor?: AccentColor;
  visualizerStyle?: 'bars' | 'wave' | 'spectrum';
  shadows?: TileShadowConfig;
  soundKey?: SoundKey;
  textAlign?: 'left' | 'center' | 'right';
}
