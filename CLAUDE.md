# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start dev server (Vite, port 3000, host 0.0.0.0)
- `npm run build` - Production build via Vite (output: `dist/`)
- `npm run preview` - Preview production build

No test framework or linter is configured.

## What This Is

Lumina OS Portfolio is a bento-grid portfolio UI with an "OS-like" dark matte aesthetic. It renders configurable tiles in a responsive grid, each with hover-triggered glow effects, organ chord sounds (Web Audio API), and optional background media (images/video). Tiles are editable at runtime via a built-in editor, with customizations persisted to `localStorage` and exportable/importable as JSON.

Originally scaffolded from Google AI Studio (Gemini), but no AI/API features are currently used.

## Architecture

**Single-page React 19 app** with no routing, no state management library, and no backend. All state lives in React `useState` + `localStorage`.

### Data Flow

1. `constants.tsx` defines `PORTFOLIO_TILES` (the default tile configurations) and `APP_METADATA` (header text)
2. On load, `utils/storage.ts:applyStoredConfigToTiles()` merges localStorage overrides onto the defaults
3. `App.tsx` owns the tile array state, edit mode state, and the "Start" animation sequence
4. Edits via `TileEditor` save to localStorage as `EditableTileConfig[]` under key `lumina-tiles-config`

### Key Files

- `types.ts` - `TileConfig`, `EditableTileConfig`, `TileType`/`TileSize` enums
- `constants.tsx` - Default tile definitions (icons are inline JSX from lucide-react)
- `App.tsx` - Root component, animation sequence logic, edit mode orchestration
- `components/Tile.tsx` - Individual tile rendering with glow, hover, sound, video playback, and all visual states
- `components/TileEditor.tsx` - Modal form for editing tile properties (supports drag & drop image upload as base64)
- `components/FloatingDock.tsx` - Bottom toolbar with edit toggle, export/import, start button
- `components/MediaOverlay.tsx` - Fullscreen media viewer (currently not wired into App)
- `utils/sound.ts` - Web Audio API organ synth (minor triads with triangle+sine oscillators, envelope shaping)
- `utils/storage.ts` - localStorage CRUD for tile customizations, JSON export/import

### Styling

Tailwind CSS loaded via **CDN script tag** in `index.html` (not installed as dependency). Custom theme extensions (glow shadows, surface colors, equalizer animations) are configured inline in the `<script>` tag. Font: Inter via Google Fonts.

### Path Alias

`@/*` maps to project root (configured in both `tsconfig.json` and `vite.config.ts`).

## Conventions

- UI text is in **German** (editor labels, alerts, confirm dialogs)
- Tile IDs are string numbers ("1", "2", etc.)
- Icons come from `lucide-react` - used as inline JSX in `constants.tsx`, not as string references
- Sound keys are minor chord names: `Cm`, `Dm`, `Em`, `Fm`, `Gm`, `Am`
- The "Start" button runs a roulette-style animation that highlights random tiles with accelerating speed, then opens the final tile's link
