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
  videoUrl?: string; // Support for background videos (mp4/webm)
  videoThumbnail?: string; // Specific thumbnail for video tiles
  backgroundClass?: string; // Custom CSS class for background (gradients, animations, etc.)
  showMediaOnHoverOnly?: boolean; // New: If true, media is hidden until hover
  
  // Link Configuration
  link?: string;
  linkTarget?: '_blank' | '_self' | '_parent' | '_top'; // Configurable link target
  
  // State & Style
  active?: boolean; // If true, mimics the "lit up" state from the reference
  accentColor?: 'blue' | 'purple' | 'white' | 'orange' | 'green';
  visualizerStyle?: 'bars' | 'wave' | 'spectrum';
  shadows?: TileShadowConfig;
  soundKey?: SoundKey; // Key for the organ sound (Cm, Dm, etc.)
  textAlign?: 'left' | 'center' | 'right'; // New alignment property
}