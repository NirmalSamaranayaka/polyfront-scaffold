# Contributing

Thanks for helping make **polyfront-scaffold** better! Contributions of all sizes are welcome — from fixing a typo to adding preset support.

## Code of Conduct
Be excellent to each other. Assume positive intent. Report harmful behavior via a GitHub issue.

## Development quick start
```bash
git clone https://github.com/NirmalSamaranayaka/polyfront-scaffold
cd polyfront-scaffold
npm i
```

Run the CLI locally:
```bash
node ./bin/index.js demo --framework react-vite --ts --ui mui --on-exists overwrite
```

Generated output will be under:
```
Frontends/React/Vite/demo
Frontends/React/Webpack/<name>
Frontends/Angular/<name>
```

## Adding or fixing a style adapter (React)

**Goal:** a fresh scaffold should start, render two pages (Home/About), and show at least one component from the chosen UI library.

### Checklist (≈10 minutes)
1. **Generate** a sandbox app:
   ```bash
   node ./bin/index.js demo --framework react-vite --ts --ui <mui|bootstrap|tailwind|antd|chakra> --on-exists overwrite
   cd Frontends/React/Vite/demo
   npm i && npm run dev
   ```
2. **Verify**
   - App boots at `http://localhost:5173`
   - Navbar links work (Home/About)
   - One UI component renders (e.g., AntD Button, Chakra Button)
   - For Tailwind: utility classes (e.g., `p-4`, `text-2xl`) visibly change styles
3. **Fixes** (if needed)
   - Missing CSS import (e.g., `bootstrap/dist/css/bootstrap.min.css`, `antd/dist/reset.css`)
   - Add provider wrappers (ChakraProvider, MUI ThemeProvider)
   - Ensure Tailwind files: `tailwind.config.js` and `postcss.config.js`
4. **Tests**
   - Generated app: `npm test` if unit tests selected
   - Consider adding a minimal assertion to generator E2E in CI (build runs)
5. **PR**
   - Branch name: `feat/<preset>-<short-desc>` or `fix/<preset>-<short-desc>`
   - Include before/after notes and a screenshot (put images under `docs/screenshots/` in the PR)
   - Keep changes focused and small when possible

## Commit style
Use clear, imperative messages. Conventional Commits are welcome (`feat:`, `fix:`, `chore:`), but not mandatory.

## Reporting issues
Please include:
- OS, Node version, package manager (npm/pnpm/yarn/bun)
- Exact CLI command and full output
- If relevant, package.json scripts from the generated project

Maintainer: Nirmal Samaranayaka <nirmal.fullstack@gmail.com>

