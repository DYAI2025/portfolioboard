# Lumina OS Portfolio

## Projektübersicht

**Lumina OS Portfolio** ist eine moderne, visuell ansprechende Portfolio-Webanwendung mit einem futuristischen Dashboard-Interface im Stil eines Betriebssystem-UI. Die Anwendung präsentiert Projekte und Inhalte als interaktive Kacheln (Tiles) mit animierten Hintergründen, Soundeffekten und einer "Roulette"-Auswahl-Funktion.

**Live-Demo in AI Studio:** https://ai.studio/apps/drive/1kYyyGRzOQOf0nZ72XI8yojqtI_enIbyx

## Technologie-Stack

- **Framework:** React 19.2.4
- **Build-Tool:** Vite 6.2.0
- **Sprache:** TypeScript 5.8.2
- **UI-Bibliothek:** Lucide React (Icons)
- **Styling:** Tailwind CSS (über Klassen im Code)
- **Audio:** Web Audio API für generative Soundeffekte

## Architektur

```
portfolioboard/
├── App.tsx              # Hauptkomponente mit State-Management für Tile-Highlighting
├── index.tsx            # Entry Point
├── types.ts             # TypeScript-Interfaces (TileConfig, TileType, TileSize, etc.)
├── constants.tsx        # Tile-Konfigurationen und Metadaten
├── components/
│   ├── Tile.tsx         # Wiederverwendbare Tile-Komponente mit Media-Support
│   └── FloatingDock.tsx # Untere Navigationsleiste mit Start-Button
└── utils/
    └── sound.ts         # Audio-Engine für Akkord-Soundeffekte
```

### Kernkomponenten

- **Tile-System:** Unterstützt verschiedene Typen (LINK, TEXT, NUMBER, IMAGE, ACTION, AUDIO, VIDEO) und Größen (1x1, 2x1, 1x2, 2x2)
- **Audio-Engine:** Spielt Moll-Akkorde (Cm, Dm, Em, Fm, Gm, Am) mit Web Audio API, inklusive Hüllkurve und Filter
- **Roulette-Sequenz:** Interaktive Auswahlanimation mit beschleunigtem/dezeleriertem Highlighting

## Building und Running

### Voraussetzungen

- Node.js (aktuelle LTS-Version empfohlen)
- Gemini API Key (für AI Studio-Integration)

### Installation

```bash
npm install
```

### Entwicklung

```bash
npm run dev
```

Startet den Vite Development Server auf `http://localhost:3000`

### Production Build

```bash
npm run build
```

### Vorschau des Builds

```bash
npm run preview
```

### Umgebungsvariablen

Erstelle eine `.env.local` Datei mit:

```
GEMINI_API_KEY=dein_api_key_hier
```

## Entwicklungskonventionen

### Code-Struktur

- **TypeScript:** Strikte Typisierung mit Interfaces für alle Tile-Konfigurationen
- **Komponenten:** Funktionale Komponenten mit React Hooks
- **Styling:** Tailwind CSS Klassen direkt im JSX, keine separaten CSS-Dateien
- **Pfad-Aliase:** `@/*` verweist auf das Root-Verzeichnis (in `tsconfig.json` konfiguriert)

### Tile-Konfiguration

Tiles werden in `constants.tsx` definiert und unterstützen:

- **Medien:** `imageUrl`, `videoUrl`, `videoThumbnail`, `backgroundClass`
- **Links:** `link`, `linkTarget` (`_blank`, `_self`, etc.)
- **Styling:** `accentColor` (blue, purple, white, orange, green), `shadows`
- **Audio:** `soundKey` für akustisches Feedback
- **Visualizer:** `visualizerStyle` (bars, wave, spectrum) für Audio-Tiles

### Audio-System

- Jeder Akkord ist als Moll-Triade definiert
- Sound wird bei Hover und bei der Roulette-Sequenz abgespielt
- AudioContext wird bei erster User-Interaktion initialisiert (Browser-Autoplay-Richtlinien)

### Design-Prinzipien

- **Dark Theme:** Schwarzer Hintergrund (#050505) mit ambienten Lichteffekten
- **Glow-Effekte:** Mehrschichtige Schatten und Gradienten für Tiefe
- **Animationen:** Smooth transitions (300-500ms) mit cubic-bezier easing
- **Responsive:** Grid-Layout passt sich an (2 Spalten Mobile, 4 Spalten Desktop)

## Wichtige Features

1. **Interaktive Tiles:** Hover-Effekte, Sound-Feedback, visuelle Rückmeldung
2. **Video-Support:** Autoplay bei Hover, Fullscreen auf Klick
3. **Roulette-Auswahl:** Zufällige Tile-Auswahl mit animierter Beschleunigung/Verzögerung
4. **Audio-Visualizer:** Drei Modi (bars, wave, spectrum) für Audio-Tiles
5. **Responsive Design:** Funktioniert auf Mobile und Desktop

## Bekannte Einschränkungen

- Video-Autoplay kann durch Browser-Richtlinien blockiert werden
- Audio erfordert User-Interaktion für Initialisierung
- Externe Bilder/Videos benötigen gültige URLs
