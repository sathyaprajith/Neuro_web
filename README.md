# NeuroParadigm

AI-assisted clinical decision support for psychiatry and neurodevelopmental care.
Single-page marketing site: animated serif wordmark, 3D DNA double-helix research story,
and honest, confidence-first content. *Science that shows its work.*

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 (CSS-first tokens, light/dark themes)
- Framer Motion (scroll-driven storytelling)
- React Three Fiber + three.js (instanced helix)

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Command           | Purpose                        |
| ----------------- | ------------------------------ |
| `npm run dev`     | Dev server with HMR            |
| `npm run build`   | Typecheck + production build   |
| `npm run preview` | Serve the production build     |
| `npm run typecheck` | TypeScript only              |

## Structure

```
src/
  components/
    layout/        Navbar (scroll-spy + theme toggle), Footer
    sections/
      Hero/        Title reveal, lazy R3F helix canvas,
                   scroll-paced research cards, static fallback
      HomeAbout/   Mission narrative, signal-fusion visual, signal details
      Patents/     Patent cards
      Partners/    Marquee carousel
      Gallery/     Grid + lightbox
      Contact/     Form + stylized locate/zoom map
    ui/            Reveal, SectionHeader, icons, cn
  data/            signals.ts — the five research signals
  hooks/           useScrollSpy, usePrefersReducedMotion
  theme/           tokens.css (both themes), ThemeProvider, useTheme
```

## Notes

- Theme persists via `localStorage` (`np-theme`), defaults to system preference.
- Helix is lazy-loaded and paused when off-screen; reduced-motion and no-WebGL
  contexts get a static SVG fallback with the same links.
