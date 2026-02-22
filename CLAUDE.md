# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start dev server (Vite, port 3000, host 0.0.0.0)
- `npm run build` - Production build via Vite (output: `dist/`)
- `npm run preview` - Preview production build

No test framework or linter is configured.

## What This Is

Lumina OS Portfolio is a bento-grid portfolio UI with an "OS-like" dark matte aesthetic. It renders configurable tiles in a responsive grid, each with hover-triggered glow effects, organ chord sounds (Web Audio API), and optional background media (images/video). Tiles are editable at runtime via a built-in side-panel editor (admin-only).

Originally scaffolded from Google AI Studio (Gemini), but no AI/API features are currently used.

## Architecture

**Single-page React 19 app** with no routing, no state management library, and no backend. All state lives in React `useState` (in-memory only, no localStorage persistence).

### Data Flow

1. `constants.tsx` defines `PORTFOLIO_TILES` (the default tile configurations) and `APP_METADATA` (header text)
2. `App.tsx` initializes tile state directly from `PORTFOLIO_TILES` and owns edit mode, admin auth, media overlay, and the "Start" animation sequence
3. Edits via `TileEditor` update tiles in-memory via `onUpdate` callback (changes are lost on refresh)
4. Admin access is required to enter edit mode — triggered via a hidden star icon (bottom-right corner)

### Key Files

- `types.ts` - `TileConfig`, `TileType`/`TileSize` enums, `SoundKey` type
- `constants.tsx` - Default tile definitions (icons are inline JSX from lucide-react)
- `App.tsx` - Root component, animation sequence, edit mode orchestration, admin gate
- `components/Tile.tsx` - Individual tile with glow, hover, sound, video playback, mute toggle, "ghost mode" (`showMediaOnHoverOnly`), text alignment
- `components/TileEditor.tsx` - Right-side panel editor for tile properties (size, content, colors, media URLs/uploads, active state, reveal-on-hover toggle)
- `components/FloatingDock.tsx` - Bottom toolbar with Start button, edit toggle (admin-only), and decorative Command icon
- `components/MediaOverlay.tsx` - Fullscreen media viewer for image/video tiles (ESC to close)
- `components/AdminLogin.tsx` - Simple name/password modal for admin access
- `utils/sound.ts` - Web Audio API organ synth (minor triads with triangle+sine oscillators, envelope shaping)

### Styling

Tailwind CSS loaded via **CDN script tag** in `index.html` (not installed as dependency). Custom theme extensions (glow shadows, surface colors, equalizer animations) are configured inline in the `<script>` tag. Font: Inter via Google Fonts.

### Path Alias

`@/*` maps to project root (configured in both `tsconfig.json` and `vite.config.ts`).

## Conventions

- Tile IDs are string numbers ("1", "2", etc.)
- Icons come from `lucide-react` - used as inline JSX in `constants.tsx`, not as string references
- Sound keys are minor chord names: `Cm`, `Dm`, `Em`, `Fm`, `Gm`, `Am`
- The "Start" button runs a roulette-style animation that highlights random tiles with accelerating speed, then opens the final tile's link
- Edit mode uses single-click on tiles (not double-click) to open the side-panel editor
- The `EditableTileConfig` type from `types.ts` is no longer used — `TileEditor` works directly with `TileConfig`
