import React from 'react';
import { TileConfig, TileSize, TileType } from './types';
import { 
  Terminal, 
  Mic, 
  Send, 
  Activity, 
  Aperture, 
  Code, 
  Cpu, 
  Globe, 
  Layers, 
  Music, 
  Settings,
  Search,
  Video
} from 'lucide-react';

export const PORTFOLIO_TILES: TileConfig[] = [
  // Row 1
  {
    id: '1',
    type: TileType.LINK,
    size: TileSize.SMALL,
    title: 'System',
    subtitle: 'Optimized',
    icon: <Cpu size={24} />,
    active: false,
    accentColor: 'blue',
    soundKey: 'Cm'
  },
  {
    id: '2',
    type: TileType.TEXT,
    size: TileSize.SMALL,
    title: 'Status',
    subtitle: 'Online',
    icon: <Activity size={24} />,
    accentColor: 'green',
    soundKey: 'Dm'
  },
  {
    id: '3',
    type: TileType.IMAGE,
    size: TileSize.WIDE,
    title: 'Photography',
    subtitle: 'Latest shots',
    imageUrl: 'https://picsum.photos/seed/photo/400/400?grayscale',
    link: '#',
    accentColor: 'white',
    soundKey: 'Em'
  },

  // Row 2
  {
    id: '4',
    type: TileType.LINK,
    size: TileSize.SMALL,
    title: 'Settings',
    icon: <Settings size={24} />,
    active: false,
    accentColor: 'white',
    soundKey: 'Fm'
  },
  {
    id: '5',
    type: TileType.LINK,
    size: TileSize.WIDE,
    title: 'Design System',
    subtitle: 'Figma / CSS',
    icon: <Layers size={24} />,
    active: false,
    accentColor: 'purple',
    soundKey: 'Gm'
  },
  {
    id: '6',
    type: TileType.ACTION,
    size: TileSize.SMALL,
    title: 'Search',
    icon: <Search size={24} />,
    active: false,
    accentColor: 'white',
    soundKey: 'Am'
  },

  // Row 3
  {
    id: '7',
    type: TileType.AUDIO,
    size: TileSize.WIDE,
    title: 'Neural Mix',
    subtitle: 'Focus Playlist',
    icon: <Music size={24} />,
    active: true, // Active state triggers the colored border and glow
    accentColor: 'orange',
    soundKey: 'Cm'
  },
  {
    id: '8',
    type: TileType.LINK,
    size: TileSize.WIDE,
    title: 'Github',
    subtitle: 'Source Code',
    icon: <Code size={24} />,
    link: 'https://github.com',
    linkTarget: '_blank',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=400&auto=format&fit=crop', 
    accentColor: 'white',
    soundKey: 'Dm'
  },

  // Row 4 (Large Video + fillers)
  {
    id: '9',
    type: TileType.VIDEO,
    size: TileSize.LARGE,
    title: 'Bazodia',
    subtitle: 'The Essence',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
    videoThumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
    active: false,
    accentColor: 'purple',
    soundKey: 'Em'
  },
  {
    id: '10',
    type: TileType.NUMBER,
    size: TileSize.SMALL,
    title: 'Projects',
    value: '14',
    active: true,
    accentColor: 'purple',
    soundKey: 'Fm'
  },
  {
    id: '11',
    type: TileType.ACTION,
    size: TileSize.SMALL,
    title: 'Voice',
    icon: <Mic size={24} />,
    active: false,
    accentColor: 'white',
    soundKey: 'Gm'
  },
  {
    id: '12',
    type: TileType.ACTION,
    size: TileSize.WIDE,
    title: 'Terminal',
    subtitle: 'DeepThink',
    icon: <Terminal size={20} />,
    active: false,
    accentColor: 'blue',
    soundKey: 'Am'
  }
];

export const APP_METADATA = {
  header: 'Lumina OS',
  subHeader: 'Portfolio v2.0'
};