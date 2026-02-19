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
  Video,
  LayoutDashboard
} from 'lucide-react';

export const PORTFOLIO_TILES: TileConfig[] = [
  // Row 1 - Dashboard as first tile
  {
    id: 'dashboard',
    type: TileType.LINK,
    size: TileSize.WIDE,
    title: 'Dashboard',
    icon: <LayoutDashboard size={24} />,
    link: 'https://dashboard.dyai.cloud/',
    linkTarget: '_blank',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    accentColor: 'blue',
    soundKey: 'Cm'
  },
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
    linkTarget: '_blank',
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
    title: 'QuissMe',
    subtitle: 'Astrology App',
    icon: <Globe size={32} />,
    link: 'https://quissme.dyai.cloud/',
    linkTarget: '_blank',
    imageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=400&auto=format&fit=crop',
    accentColor: 'purple',
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
    title: 'BAFE Engine',
    subtitle: 'Astrology API',
    icon: <Layers size={24} />,
    link: 'https://bafe.fly.dev/',
    linkTarget: '_blank',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
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
    title: 'DYAI Pro',
    icon: <Settings size={24} />,
    link: 'https://dyai-pro-page.vercel.app/',
    linkTarget: '_blank',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop',
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
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
    active: false,
    accentColor: 'purple',
    soundKey: 'Cm'
  }
];

export const APP_METADATA = {
  header: 'Lumina OS',
  subHeader: 'Portfolio v2.0'
};
