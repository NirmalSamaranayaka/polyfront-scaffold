# Roadmap

This document tracks near-term improvements and where contributions help most.

##(Completed)
✅ UI Presets (React + Angular)
✅ React: MUI, Bootstrap, Tailwind, AntD, Chakra → fully validated
✅ Angular: Material, Bootstrap, Tailwind, PrimeNG → fully validated

📦 Generator E2E (CI): workflow present
✅ Matrix: Node 20/22 × ubuntu-latest/windows-latest/macos-latest
✅ For each preset: scaffold → `npm ci` → `npm run build` → `npm test` (if selected)
✅ CI workflow file: `.github/workflows/ci.yml`
✅ Fast/full verification runner: `scripts/verify-once.js`

## 0.2.0 (nice-to-have)
- Add “style adapters” abstraction to reduce duplication
- Optional `--rsc` or Next.js template starter
- Minimal Redux/MobX examples in `features/` with tests

## Contribution hotspots
- Verify **Bootstrap**, **Tailwind**, **AntD**, **Chakra**, **PrimeNG** paths
- Add missing imports/config for any preset
- Improve example pages/screenshots for each preset
