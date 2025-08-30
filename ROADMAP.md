# Roadmap

This document tracks near-term improvements and where contributions help most.

## 0.1.0 (planned)
- ✅ MUI path verified (Vite/Webpack)
- 🧪 Solidify experimental React presets:
  - Bootstrap: verify CSS import + sample components render
  - Tailwind: ensure `tailwind.config.{js|cjs}` + `postcss.config.js` present; utilities visible in sample pages
  - Ant Design: `reset.css` import, Button/Card demo, icon tree-shaking sanity check
  - Chakra: provider + basic theming, motion peer deps installed
- 🧪 Angular presets:
  - Material: confirm standalone setup & theming
  - Bootstrap/Tailwind/PrimeNG: sample components and CSS import paths
- 📦 Generator E2E (CI):
  - Matrix: Node 20/22 × ubuntu-latest/windows-latest/macos-latest
  - For each preset: scaffold → `npm i` → `npm run build` → `npm test` (if selected)
- 🧰 Hooks & utils samples:
  - `useToggle`, `useFetchExample` (React Query variant)
  - `date` utils parity across moment/dayjs/date-fns + tests

## 0.2.0 (nice-to-have)
- Add “style adapters” abstraction to reduce duplication
- Optional `--rsc` or Next.js template starter
- Minimal Redux/MobX examples in `features/` with tests

## Contribution hotspots
- Verify **Bootstrap**, **Tailwind**, **AntD**, **Chakra**, **PrimeNG** paths
- Add missing imports/config for any preset
- Improve example pages/screenshots for each preset
