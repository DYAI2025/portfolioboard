# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Lumina OS Portfolio — a bento-grid portfolio UI with a dark matte aesthetic, ambient lighting effects, and Web Audio API-based organ sounds. Originally scaffolded via Google AI Studio. Deployed to GitHub Pages at `lumina.dyai.cloud`.

## Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build → ./dist
npm run preview  # Preview production build locally
```

No test framework, linter, or formatter is configured.

## Architecture

Single-page React 19 app built with Vite + TypeScript. No router, no state management library — all state lives in `App.tsx` via `useState`.

### Key Files

- `index.html` — Tailwind CSS loaded via CDN (`cdn.tailwindcss.com`), custom Tailwind config inline (colors, animations, keyframes). Also contains an import map for ESM dependencies.
- `App.tsx` — Root component. Manages tile state, edit mode, admin auth, media overlay, and the "roulette" animation sequence that cycles through tiles and opens a random link.
- `types.ts` — `TileConfig` interface and enums (`TileType`, `TileSize`, `SoundKey`). This is the data model for every tile.
- `constants.tsx` — `PORTFOLIO_TILES` array (the tile data) and `APP_METADATA` (header/subheader text). Contains JSX (lucide-react icons) so it's `.tsx`.

### Components

- `Tile.tsx` — Renders a single bento tile. Handles hover glow, accent colors, background media (image/video), audio visualizer modes (bars/wave/spectrum), sound playback on hover/highlight, and edit-mode interaction.
- `FloatingDock.tsx` — Bottom dock bar with Start (roulette trigger), Edit toggle (admin only), and Command button.
- `TileEditor.tsx` — Slide-in side panel for editing tile properties (title, subtitle, size, accent color, media URLs, text alignment, active state, hover-reveal toggle).
- `MediaOverlay.tsx` — Fullscreen lightbox for viewing images/videos. ESC to close.
- `AdminLogin.tsx` — Modal with hardcoded credentials that gates edit mode access.

### Utilities

- `utils/sound.ts` — Web Audio API synthesizer. Generates minor triad organ chords (Cm through Am) with triangle + sine oscillators, lowpass filter, and ADSR envelope (~3s duration). `playChord()` returns a stop function for early cleanup.

## Styling Approach

Tailwind CSS is loaded from CDN in `index.html` — **not** installed as a dependency or PostCSS plugin. Custom theme extensions (surface colors, glow shadows, equalizer/wave/spectrum keyframe animations) are defined inline in the `<script>` block. The font is Inter via Google Fonts.

## Path Alias

`@/*` maps to the project root (configured in both `tsconfig.json` and `vite.config.ts`).

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys to GitHub Pages on push to `main`. Custom domain: `lumina.dyai.cloud` (configured via `public/CNAME`).

## Environment

`GEMINI_API_KEY` is referenced in `vite.config.ts` (exposed as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`) but is not currently used by any application code.
