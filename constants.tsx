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
    type: TileType.TEXT,
    size: TileSize.WIDE,
    title: 'Ask anything...',
    subtitle: 'DeepThink Enabled',
    icon: <Terminal size={20} />,
    active: false,
    accentColor: 'purple',
    soundKey: 'Cm'
  },
  {
    id: '2',
    type: TileType.ACTION,
    size: TileSize.SMALL,
    title: 'Voice',
    icon: <Mic size={24} />,
    active: false,
    accentColor: 'white',
    soundKey: 'Dm'
  },
  {
    id: '3',
    type: TileType.ACTION,
    size: TileSize.SMALL,
    title: 'Send',
    icon: <Send size={24} />,
    active: true, // Lit up state
    accentColor: 'blue',
    soundKey: 'Em'
  },

  // Row 2
  {
    id: '4',
    type: TileType.NUMBER,
    size: TileSize.SMALL,
    title: 'Projects',
    value: '14',
    active: true,
    accentColor: 'purple',
    soundKey: 'Fm'
  },
  {
    id: '5',
    type: TileType.LINK,
    size: TileSize.SMALL,
    title: 'Github',
    icon: <Code size={28} />,
    link: 'https://github.com',
    linkTarget: '_blank', // Explicitly open in new tab
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=400&auto=format&fit=crop', 
    accentColor: 'white',
    soundKey: 'Gm'
  },
  {
    id: '6',
    type: TileType.IMAGE,
    size: TileSize.LARGE,
    title: 'Photography',
    subtitle: 'Latest shots',
    imageUrl: 'https://picsum.photos/seed/photo/400/400?grayscale',
    link: '#',
    accentColor: 'white',
    soundKey: 'Am'
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
    accentColor: 'blue',
    soundKey: 'Cm' 
  },
  {
    id: '8',
    type: TileType.TEXT,
    size: TileSize.SMALL,
    title: 'Status',
    subtitle: 'Online',
    icon: <Activity size={20} />,
    accentColor: 'green',
    soundKey: 'Dm'
  },
  
  // Row 4
  {
    id: '9',
    type: TileType.LINK,
    size: TileSize.WIDE,
    title: 'Design System',
    subtitle: 'Figma / CSS',
    icon: <Layers size={24} />,
    accentColor: 'purple',
    soundKey: 'Em'
  },
  {
    id: '10',
    type: TileType.ACTION,
    size: TileSize.SMALL,
    title: 'Search',
    icon: <Search size={24} />,
    active: false,
    accentColor: 'white',
    soundKey: 'Fm'
  },
  {
    id: '11',
    type: TileType.LINK,
    size: TileSize.SMALL,
    title: 'Settings',
    icon: <Settings size={24} />,
    active: false,
    accentColor: 'white',
    soundKey: 'Gm'
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
    accentColor: 'orange',
    soundKey: 'Am'
  },
  // Row 6
  {
    id: '13',
    type: TileType.VIDEO,
    size: TileSize.LARGE,
    title: 'Bazodia',
    subtitle: 'The Essence',
    // Using a sample space/ethereal video that fits the "Bazodia" theme
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop', // Space nebula thumbnail
    active: false,
    accentColor: 'purple',
    soundKey: 'Cm'
  }
];

export const APP_METADATA = {
  header: 'Lumina OS',
  subHeader: 'Portfolio v2.0'
};