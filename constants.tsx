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
  // Row 1: Large primary interaction (Prompt input visual)
  {
    id: '1',
    type: TileType.TEXT,
    size: TileSize.WIDE,
    title: 'Ask anything...',
    subtitle: 'DeepThink Enabled',
    icon: <Terminal size={20} />,
    active: false,
    accentColor: 'purple'
  },
  {
    id: '2',
    type: TileType.ACTION,
    size: TileSize.SMALL,
    title: 'Voice',
    icon: <Mic size={24} />,
    active: false,
    accentColor: 'white'
  },
  {
    id: '3',
    type: TileType.ACTION,
    size: TileSize.SMALL,
    title: 'Send',
    icon: <Send size={24} />,
    active: true, // Lit up state
    accentColor: 'blue'
  },

  // Row 2: Stats & Projects
  {
    id: '4',
    type: TileType.NUMBER,
    size: TileSize.SMALL,
    title: 'Projects',
    value: '14',
    active: true,
    accentColor: 'purple'
  },
  {
    id: '5',
    type: TileType.LINK,
    size: TileSize.SMALL,
    title: 'Github',
    icon: <Code size={28} />,
    link: 'https://github.com',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=400&auto=format&fit=crop', // Example: Link with background image
    accentColor: 'white'
  },
  {
    id: '6',
    type: TileType.IMAGE,
    size: TileSize.LARGE,
    title: 'Photography',
    subtitle: 'Latest shots',
    imageUrl: 'https://picsum.photos/seed/photo/400/400?grayscale',
    link: '#',
    accentColor: 'white'
  },

  // Row 3
  {
    id: '7',
    type: TileType.LINK,
    size: TileSize.TALL,
    title: 'System',
    subtitle: 'Optimized',
    icon: <Cpu size={32} />,
    active: false,
    accentColor: 'blue'
  },
  {
    id: '8',
    type: TileType.TEXT,
    size: TileSize.SMALL,
    title: 'Status',
    subtitle: 'Online',
    icon: <Activity size={20} />,
    accentColor: 'green'
  },
  
  // Row 4
  {
    id: '9',
    type: TileType.LINK,
    size: TileSize.WIDE,
    title: 'Design System',
    subtitle: 'Figma / CSS',
    icon: <Layers size={24} />,
    accentColor: 'purple'
  },
  {
    id: '10',
    type: TileType.ACTION,
    size: TileSize.SMALL,
    title: 'Search',
    icon: <Search size={24} />,
    active: false,
    accentColor: 'white'
  },
  {
    id: '11',
    type: TileType.LINK,
    size: TileSize.SMALL,
    title: 'Settings',
    icon: <Settings size={24} />,
    active: false,
    accentColor: 'white'
  },
  // Row 5
  {
    id: '12',
    type: TileType.AUDIO,
    size: TileSize.WIDE,
    title: 'Neural Mix',
    subtitle: 'Focus Playlist',
    icon: <Music size={24} />,
    active: true,
    accentColor: 'orange'
  },
  // Row 6
  {
    id: '13',
    type: TileType.VIDEO,
    size: TileSize.LARGE,
    title: 'Showreel 2025',
    subtitle: '4K • 60fps',
    // Using a reliable sample video URL (usually works for demos)
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', 
    link: 'https://youtube.com',
    active: false,
    accentColor: 'blue'
  }
];

export const APP_METADATA = {
  header: 'Lumina OS',
  subHeader: 'Portfolio v2.0'
};