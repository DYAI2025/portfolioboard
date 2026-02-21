import { TileConfig, EditableTileConfig } from '../types';
import { PORTFOLIO_TILES } from '../constants';

const STORAGE_KEY = 'lumina-tiles-config';

/**
 * Speichert die editierten Tile-Konfigurationen im LocalStorage
 */
export const saveTilesToStorage = (tiles: EditableTileConfig[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tiles));
  } catch (e) {
    console.warn('Failed to save tiles to localStorage:', e);
  }
};

/**
 * Lädt die editierten Tile-Konfigurationen aus dem LocalStorage
 * und merged sie mit den Default-Konfigurationen
 */
export const loadTilesFromStorage = (): Map<string, EditableTileConfig> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Map();
    
    const parsed: EditableTileConfig[] = JSON.parse(stored);
    return new Map(parsed.map(t => [t.id, t]));
  } catch (e) {
    console.warn('Failed to load tiles from localStorage:', e);
    return new Map();
  }
};

/**
 * Updated eine einzelne Tile-Konfiguration im LocalStorage
 */
export const updateTileInStorage = (editableConfig: EditableTileConfig): void => {
  const existing = loadTilesFromStorage();
  existing.set(editableConfig.id, editableConfig);
  saveTilesToStorage(Array.from(existing.values()));
};

/**
 * Wendet die gespeicherten Editierungen auf die Default-Tiles an
 */
export const applyStoredConfigToTiles = (defaultTiles: TileConfig[]): TileConfig[] => {
  const stored = loadTilesFromStorage();
  
  return defaultTiles.map(tile => {
    const editable = stored.get(tile.id);
    if (!editable) return tile;

    const updatedTile: TileConfig = {
      ...tile,
      title: editable.title || tile.title,
      subtitle: editable.subtitle || tile.subtitle,
      link: editable.link || tile.link,
      linkTarget: editable.linkTarget || tile.linkTarget,
      imageUrl: editable.mediaType === 'image' ? editable.imageUrl : tile.imageUrl,
      videoUrl: editable.mediaType === 'video' ? editable.videoUrl : tile.videoUrl,
    };

    // Remove image if mediaType is none or video
    if (editable.mediaType === 'none' || editable.mediaType === 'video') {
      delete updatedTile.imageUrl;
    }

    // Remove video if mediaType is none or image
    if (editable.mediaType === 'none' || editable.mediaType === 'image') {
      delete updatedTile.videoUrl;
    }

    return updatedTile;
  });
};

/**
 * Setzt alle gespeicherten Konfigurationen zurück
 */
export const resetTilesToDefault = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Exportiert die aktuelle Tile-Konfiguration als JSON-String
 */
export const exportTilesToJSON = (): string => {
  const stored = loadTilesFromStorage();
  const exported = Array.from(stored.values());
  return JSON.stringify(exported, null, 2);
};

/**
 * Lädt Tile-Konfigurationen aus einem JSON-String
 */
export const importTilesFromJSON = (jsonString: string): EditableTileConfig[] => {
  try {
    const parsed: EditableTileConfig[] = JSON.parse(jsonString);
    return parsed;
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return [];
  }
};

/**
 * Speichert Tile-Konfigurationen aus JSON-Import im LocalStorage
 */
export const saveImportedTiles = (tiles: EditableTileConfig[]): void => {
  saveTilesToStorage(tiles);
};
