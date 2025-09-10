# End‑to‑End Scaffolding & Verification Guide

This document explains how to **configure, install, run, and extend** the end‑to‑end (E2E) scaffolding and verification flow for React (Vite/Webpack) and Angular applications. It covers the matrix runner scripts, environment variables, supported presets, CI usage, troubleshooting, and roadmap for E2E test integration (Cypress/Playwright).

---

## Table of Contents
- [End‑to‑End Scaffolding \& Verification Guide](#endtoend-scaffolding--verification-guide)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [What Gets Verified](#what-gets-verified)
  - [Supported Targets \& Presets](#supported-targets--presets)
    - [React (Vite/Webpack)](#react-vitewebpack)
    - [Angular](#angular)
  - [Folder Layout \& Output](#folder-layout--output)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Scripts](#scripts)
  - [Environment Variables](#environment-variables)
  - [Matrix Profiles](#matrix-profiles)
    - [Quick Matrix](#quick-matrix)
    - [Full Matrix](#full-matrix)
  - [How the Runner Works](#how-the-runner-works)
    - [1) Job Construction](#1-job-construction)
    - [2) Scaffolding](#2-scaffolding)
    - [3) Install (Intentionally Skipped)](#3-install-intentionally-skipped)
    - [4) Typecheck (If Present)](#4-typecheck-if-present)
    - [5) Build](#5-build)
    - [6) Unit Tests](#6-unit-tests)
    - [7) Summary \& Exit Code](#7-summary--exit-code)
  - [CI Examples](#ci-examples)
    - [GitHub Actions](#github-actions)
    - [Azure Pipelines (example)](#azure-pipelines-example)
  - [Troubleshooting](#troubleshooting)
  - [Roadmap: E2E with Cypress/Playwright](#roadmap-e2e-with-cypressplaywright)
  - [Contributing](#contributing)

---

## Overview
The E2E verification runner scaffolds apps using the project CLI, builds them, and runs unit tests. It is designed to run **consistently across Windows, macOS, and Linux** and does **not** rely on bash‑only shell features.

- **Frameworks:** React (Vite, Webpack) and Angular
- **Languages:** TypeScript and JavaScript (Angular is TypeScript‑only)
- **UI kits (React):** MUI, Bootstrap, Tailwind, Ant Design, Chakra UI
- **UI kits (Angular):** Angular Material, Bootstrap, Tailwind, PrimeNG
- **State (React):** none, Redux, MobX, React Query
- **HTTP:** axios for React; Angular uses HttpClient by default
- **i18n:** lightweight placeholder by default (can add i18next later)
- **Dates:** moment, dayjs, date‑fns, or none
- **Testing:** Jest or Vitest (unit). E2E is reserved for Cypress/Playwright in a later phase
- **Node:** ≥ 20.19 (CI tests Node 20 & 22 on Ubuntu/Windows/macOS)

> **Goal:** Prove that every supported combination can be **scaffolded, typechecked, built, and unit‑tested** in an automated fashion.

---

## What Gets Verified
For each generated app, the runner attempts to:
1. **Scaffold** an app into `sandbox/<app‑name>` using the CLI.
2. **Typecheck** with `tsc` if a local `typescript` is present and a `tsconfig.json` exists.
3. **Build** using the detected builder (Vite/Webpack/Angular CLI).
4. **Run unit tests** using the detected test runner (Vitest/Jest), with sensible CI flags.
5. **Summarize** PASS/FAIL for each job and exit non‑zero if any failed.

---

## Supported Targets & Presets
### React (Vite/Webpack)
- **UI:** MUI ✅, Bootstrap ✅, Tailwind ✅, Ant Design ✅, Chakra UI ✅
- **State:** none / Redux / MobX / React Query
- **Dates:** moment / dayjs / date‑fns / none
- **Unit tests:** Vitest (for Vite) or Jest (for Webpack), depending on the matrix spec

### Angular
- **Language:** TypeScript only
- **UI:** Angular Material, Bootstrap, Tailwind, PrimeNG
- **Dates:** none (by default)
- **Unit tests:** none in the current matrix (build & verify only)

> The matrix profiles below show exactly which combinations are exercised.

---

## Folder Layout & Output
- **Root:** repository root where you run the scripts
- **Sandbox output:** `sandbox/` — each generated app is placed here, e.g. `sandbox/app-react-vite-ts-mui-none-vitest-none-date-fns`
- **On existing output:** controlled by `PF_ON_EXISTS` (rename/overwrite/skip)

Recommended project structure inside each app (React):
```
src/
  api/ assets/ components/ context/ features/ hooks/ i18n/
  layout/ pages/ routes/ services/ store/ styles/ tests/ utils/
```

Environment files scaffolded:
```
.env.development
.env.test
.env.production
.env.example
```

---

## Prerequisites
- **Node.js ≥ 20.19** (runner is tested on Node 20 and 22)
- **npm** available on PATH
- **Network access** for initial dependency resolution when you install (the runner itself avoids automatic installs to stay hermetic)

> The runner is OS‑agnostic and works on Windows (PowerShell or CMD), macOS, and Linux.

---

## Installation
Install repository dependencies (once):

```sh
npm install
```

## Quick Start
Run the **quick matrix** (small but representative set):

```sh
npm run verify:matrix:quick
```

Run the **full matrix** (all verified combos):

```sh
npm run verify:matrix:full
```

Run **full matrix for a single language**:

```sh
# TypeScript only
npm run verify:matrix:full:ts

# JavaScript only
npm run verify:matrix:full:js
```

Clean the **sandbox** output folder:

```sh
npm run clean:sandbox
```

---

## Scripts
These scripts are defined in `package.json`:

```jsonc
{
  "scripts": {
    "clean:sandbox": "node -e \"require('fs').rmSync('sandbox',{recursive:true,force:true})\"",
    "verify:matrix:quick": "cross-env PF_MATRIX=quick node scripts/verify-once.js",
    "verify:matrix:full": "cross-env PF_MATRIX=full node scripts/verify-once.js",
    "verify:matrix:full:ts": "cross-env PF_MATRIX=full PF_LANGS=ts node scripts/verify-once.js",
    "verify:matrix:full:js": "cross-env PF_MATRIX=full PF_LANGS=js node scripts/verify-once.js"
  }
}
```

> **Note:** The runner script is `scripts/verify-once.js` and uses Node APIs + `execa` to execute the CLI and toolchains.

---

## Environment Variables
You can customize the runner with the following variables:

| Variable | Purpose | Default |
|---|---|---|
| `PF_MATRIX` | Which spec set to run: `quick` or `full` | `quick` |
| `PF_LANGS` | Languages to generate: comma‑separated `ts,js` | `ts,js` |
| `PF_ORDER` | Preferred framework execution order | `react-vite,react-webpack,angular` |
| `PF_UI_ORDER` | Preferred UI order within a framework | `mui,bootstrap,tailwind,antd,chakra` |
| `PF_ON_EXISTS` | Behavior if target app dir already exists: `rename` / `overwrite` / `skip` | `rename` |
| `PF_CLI` | Path to the scaffold CLI binary (overrides default) | `bin/index.js` |

Additional implicit env for builds/tests:
- `CI=1` (force CI behavior)
- `NG_CLI_ANALYTICS=false`
- `ADBLOCK=1`
- `BROWSERSLIST_DISABLE_CACHE=1`
- `NODE_ENV=development` (unless set to non‑production already)
- `npm_config_production=false`

---

## Matrix Profiles
The runner expands a **base spec** into concrete jobs, then sorts by framework and UI order.

### Quick Matrix
Representative smoke tests:
```
react‑vite    | ts | mui       | store:none | unit:vitest | e2e:none | date:date‑fns
react‑webpack | ts | bootstrap | store:none | unit:jest   | e2e:none | date:moment
angular       | ts | material  | store:none | unit:none   | e2e:none | date:none
```

### Full Matrix
Covers all supported React UI kits, state managers, date libs, and selected Angular UIs. Highlights:
- React Webpack × UI: **mui, bootstrap, tailwind, antd, chakra**
- React Webpack × State: **none, redux, mobx, react-query**
- React Webpack × Dates: **moment, dayjs, date-fns**
- React Vite × UI: **mui, chakra, tailwind**
- Angular × UI: **material, bootstrap, tailwind, primeng**

> Angular remains TypeScript‑only regardless of `PF_LANGS`.

---

## How the Runner Works
### 1) Job Construction
- Base specs are defined per matrix (`quick` / `full`).
- Each spec is expanded across languages (respecting Angular‑only TS).
- Each job becomes an app path: `app-<fw>-<lang>-<ui>-<store>-<unit>-<e2e>-<date>`.

### 2) Scaffolding
- The CLI is invoked as: `node <CLI_BIN> <appName> [args...] --root sandbox --flat`.
- Args include: `--framework`, `--ui`, `--store`, `--test-unit`, `--test-e2e`, `--date`, `--i18n`, `--axios`, and `--ts` for TypeScript.

### 3) Install (Intentionally Skipped)
- The runner **does not** auto‑install dependencies for each generated app in CI to keep runs deterministic and fast.
- If `node_modules` **already exist** in an app, the runner will respect them.
- To develop locally inside a generated app, run `npm ci` manually.

### 4) Typecheck (If Present)
- If `tsconfig.json` exists **and** local `typescript` resolves from the app, the runner runs `tsc -b --noEmit`.
- Type errors are logged but **do not** stop the job (warning only).

### 5) Build
- The runner detects the builder by checking for Angular CLI, then Vite, then Webpack (or falls back to package scripts).
- It runs the build using direct binaries when available (preferred over `npx`).

### 6) Unit Tests
- If Vitest is detected, it runs `vitest run --reporter=dot --passWithNoTests --environment=jsdom`.
- If Jest is detected, it runs `jest --ci --reporters=default`.
- If neither is detected, tests are skipped for that job.

### 7) Summary & Exit Code
- Each job prints `PASS` or `FAIL`.
- The script exits with **code 1** if any job failed; **0** otherwise.

---

## CI Examples
### GitHub Actions
A cross‑OS cross‑Node matrix that runs the **quick** profile by default:

```yaml
name: Verify Matrix (quick)

on:
  push:
  pull_request:

jobs:
  verify:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node: [20, 22]
        profile: [quick]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: 'npm'
      - run: npm ci
      - name: Run matrix
        run: |
          cross-env PF_MATRIX=${{ matrix.profile }} node scripts/verify-once.js
```

Run the **full** profile nightly:

```yaml
name: Verify Matrix (full)

on:
  schedule:
    - cron: '0 2 * * *' # nightly 02:00 UTC

jobs:
  verify-full:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'npm' }
      - run: npm ci
      - run: cross-env PF_MATRIX=full node scripts/verify-once.js
```

### Azure Pipelines (example)
```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '22.x'
- script: npm ci
- script: cross-env PF_MATRIX=quick node scripts/verify-once.js
```

---

## Troubleshooting
**“Could not detect builder (vite/webpack/angular)”**
- Ensure the scaffolded template includes the corresponding devDeps or `build` script names (vite/webpack/ng).
- If templates are minimal without devDeps, add them or adjust detection logic.

**Build prompts to install `webpack-cli`**
- The runner prefers direct binaries from local deps. If missing, it falls back to `npm run build` or `npx`.
- Add `webpack`/`webpack-cli` as devDeps in the template, or provide a `build` script.

**Typechecking “failed” but job continues**
- This is by design: type errors are logged as warnings so we can still validate build/test plumbing.

**Angular analytics warnings**
- Suppressed via `NG_CLI_ANALYTICS=false`.

**Windows quoting issues**
- Scripts are written to avoid bash‑isms. Use `cross-env` for env vars as shown.

**Existing `sandbox` apps collide**
- Control with `PF_ON_EXISTS`: `rename` (default), `overwrite`, or `skip`.

**No unit tests found**
- Vitest runs with `--passWithNoTests`. Jest simply reports zero tests. Add tests as needed.

---

## Roadmap: E2E with Cypress/Playwright
E2E is currently **disabled** (`e2e: none`) in all matrix specs. To add E2E:

1. **Choose a runner:** Cypress **or** Playwright.
2. **Template hooks:**
   - Scaffold `e2e/` folder with example spec(s).
   - Provide app scripts: `test:e2e` and `test:e2e:headless`.
3. **Runner integration:**
   - Extend matrix spec to carry `e2e: cypress|playwright`.
   - Add detection similar to unit test detection.
   - Start the app (dev server) on a random port; wait for `200 OK`.
   - Execute E2E runner in headless mode; collect JUnit/HTML artifacts.
4. **Artifacts & CI:**
   - Upload videos, screenshots, and reports on failure.

> Until this lands, the matrix verifies **scaffold → typecheck → build → unit test** only.

---

## Contributing
- Extend `QUICK_BASE` / `FULL_BASE` with new presets (UI/state/date) as needed.
- Keep presets **fast** and **deterministic**. Prefer `npm ci` and pinned versions in templates.
- When adding E2E, ensure runs remain stable on **Windows/macOS/Linux** and under **Node 20/22**.

