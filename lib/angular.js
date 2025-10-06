const path = require("path");
const { run } = require("./proc");
const { writeFileSafe, updateJSON } = require("./fs-utils");
const fs = require("fs");

function setupAngular(projectName, ui, pmCfg, args, log) {
  log = typeof log === "function" ? log : (...a) => console.log(...a);
  log(`→ Creating Angular app: ${projectName}`);
  const ngArgs = ["@angular/cli@latest", "new", projectName, "--routing", "--style=scss", "--standalone"];
  const exec = pmCfg.exec(ngArgs[0], ngArgs.slice(1));
  run(exec[0], exec[1]);

  const projectDir = path.resolve(process.cwd(), projectName);
  process.chdir(projectDir);

  // Angular prefers HttpClient; make axios optional
  const core = ["zone.js"];
  if (args?.axios === true) core.push("axios");
  if (args?.zod === true) core.push("zod");

  // UI packages
  let uiPkgs = [];
  if (ui === "material") {
    log("→ Adding Angular Material");
    const addM = pmCfg.exec("ng", ["add", "@angular/material", "--skip-confirmation"]);
    run(addM[0], addM[1]);
  } else if (ui === "bootstrap") {
    uiPkgs = ["bootstrap", "bootstrap-icons"];
  } else if (ui === "tailwind") {
    uiPkgs = [
      "tailwindcss@^3.4.0",
      "postcss",
      "autoprefixer",
      "@tailwindcss/forms",
      "@tailwindcss/typography"
    ];
  } else if (ui === "primeng") {
    // Latest stack
    uiPkgs = [
      "primeng@latest",
      "primeicons@latest",
      "@primeuix/themes@latest",
      "primeflex@latest"
    ];
  }

  // Animations are required by some UI kits
  if (ui === "material" || ui === "primeng") core.push("@angular/animations");

  if (core.length + uiPkgs.length) {
    log("→ Installing core/ui packages");
    run(pmCfg.i[0], [...pmCfg.i[1], ...core, ...uiPkgs]);
  }

  // Ensure zone.js is active for both browser and server (SSR dev builder)
  tryEnsureZoneImport(projectDir);
  tryEnsureZonePolyfill(projectDir);
  tryEnsureZoneServerImport(projectDir);
  tryEnsureZoneServerPolyfill(projectDir);

  // Tailwind setup
  if (ui === "tailwind") {
    log("→ Initializing Tailwind (Angular)");
    const ex = pmCfg.exec("tailwindcss", ["init", "-p"]);
    run(ex[0], ex[1]);
    writeFileSafe(
      path.join(projectDir, "tailwind.config.js"),
      `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};`
    );
    writeFileSafe(
      path.join(projectDir, "src", "styles.scss"),
      `@tailwind base;
@tailwind components;
@tailwind utilities;`
    );
  }

  // Bootstrap setup
  if (ui === "bootstrap") {
    const stylesPath = path.join(projectDir, "src", "styles.scss");
    writeFileSafe(
      stylesPath,
      `@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';\n`
    );
    tryAddBootstrapBundleToAngularJson(projectDir, projectName);
  }

  // PrimeNG setup (brand + utilities written later too)
  if (ui === "primeng") {
    const stylesPath = path.join(projectDir, "src", "styles.scss");
    writeFileSafe(
      stylesPath,
      `@import 'primeicons/primeicons.css';
@import 'primeflex/primeflex.css';

/* ---- Brand palette (Black & White) + surface + helpers ---- */
:root {
  /* Primary palette — grayscale instead of blue */
  --p-primary-50:#fafafa;
  --p-primary-100:#f5f5f5;
  --p-primary-200:#e5e5e5;
  --p-primary-300:#d4d4d4;
  --p-primary-400:#a3a3a3;
  --p-primary-500:#737373;
  --p-primary-600:#525252;
  --p-primary-700:#404040;
  --p-primary-800:#262626;
  --p-primary-900:#171717;

  /* State colors — neutral monochrome approximations */
  --p-success-500:#999;      /* success (soft gray instead of green) */
  --p-warning-500:#666;      /* warning (mid-gray) */
  --p-danger-500:#333;       /* danger (dark gray) */

  /* Surfaces */
  --p-surface-0:#ffffff;
  --p-surface-100:#f2f2f2;
  --p-surface-200:#e5e5e5;

  /* Highlights and text */
  --p-highlight-background: color-mix(in oklab, var(--p-primary-500) 10%, white);
  --p-highlight-text-color:#111111;
  --p-text-color:#111111;
  --p-text-color-secondary:#6f6f6f;

  /* Aliases for your utilities */
  --primary-color: var(--p-primary-700);
  --text-color-secondary: var(--p-text-color-secondary);
  --surface-200: var(--p-surface-200);
}

/* Layout helpers */
.container { max-width:1120px; margin-inline:auto; padding-inline:1rem; }
.section { margin-block:1rem; }
.h1 { font-size: clamp(1.5rem, calc(2vw + 1rem), 2.25rem); font-weight: 800; }
.h2 { font-size: clamp(1.25rem, 1.2vw + .8rem, 1.5rem); font-weight:700; }
.muted { color: var(--text-color-secondary); }
.cards { display:grid; gap:1rem; grid-template-columns:1fr; }
@media (min-width:700px) { .cards { grid-template-columns:repeat(3,1fr); } }
.row { display:flex; gap:.75rem; align-items:center; }
.between { justify-content:space-between; }
.wrap { flex-wrap:wrap; }
.right { text-align:right; }

/* Optional: adjust PrimeNG buttons to match monochrome theme */
.p-button {
  background: var(--p-primary-700);
  color: #fff;
  border: 1px solid var(--p-primary-800);
}
.p-button:hover {
  background: var(--p-primary-800);
  border-color: var(--p-primary-900);
}
`
    );
  }

  // Material tweaks
  if (ui === "material") {
    tryInjectMaterialIcons(projectDir);
    tryEnsureMaterialTheme(projectDir);
  }

  // Scaffold layout + pages
  try {
    scaffoldAngularProjectStructure({ projectDir, ui, args });
  } catch (e) {
    log("⚠️  Skipped Angular page/layout scaffolding:", e.message || e);
  }

  // Replace default welcome page with router-only shell (force overwrite)
  try {
    replaceDefaultAppShell(projectDir);
    fixMainBootstrap(projectDir);
    fixServerBootstrap(projectDir);
  } catch (_) {}

  // Ensure routing is configured to basic pages
  try {
    configureAngularRouting({ projectDir, ui });
  } catch (e) {
    log("⚠️  Skipped Angular routing updates:", e.message || e);
  }

  log("\n✅ Angular app ready.");
}

module.exports = { setupAngular };

/**
 * Create Angular UI-specific layout and pages using adapter/factory pattern
 */
function scaffoldAngularProjectStructure({ projectDir, ui }) {
  const srcDir = path.join(projectDir, "src");
  const appDir = path.join(srcDir, "app");

  // Create base folders
  ["layout", "pages"].forEach((d) => fs.mkdirSync(path.join(appDir, d), { recursive: true }));

  // Create layout component
  const { writeAngularLayout } = require("./ng/layouts/factory/layout-factory");
  writeAngularLayout({ appDir, ui });

  // Create pages
  const { writeAngularPages } = require("./ng/pages/factory/page-factory");
  writeAngularPages({ appDir, ui });
}

/**
 * Configure Angular routing to include Layout and child pages
 */
function configureAngularRouting({ projectDir, ui }) {
  const appConfig = path.join(projectDir, "src", "app", "app.config.ts");
  const appRoutes = path.join(projectDir, "src", "app", "app.routes.ts");

  // app.routes.ts (use concrete components with per-folder paths)
  const routesSource = `import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];
`;
  writeFileSafe(appRoutes, routesSource);

  // app.config.ts
  const needsAnimations = ui === "material" || ui === "primeng";
  const primeImports =
    ui === "primeng"
      ? "import { providePrimeNG } from 'primeng/config';\nimport Aura from '@primeuix/themes/aura';\n"
      : "";
  const animImport = needsAnimations
    ? "import { provideAnimations } from '@angular/platform-browser/animations';\n"
    : "";
  const header = `import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
${animImport}${primeImports}`;

  const providers = [
    "provideRouter(routes, withComponentInputBinding())",
    needsAnimations ? "provideAnimations()" : null,
    ui === "primeng" ? "providePrimeNG({ ripple: true, theme: { preset: Aura, options: { cssLayer: { name: 'primeng', order: 'primeng, theme, tailwind' } } } })" : null
  ]
    .filter(Boolean)
    .join(",\n    ");

  const body = `export const appConfig: ApplicationConfig = {
  providers: [
    ${providers}
  ]
};
`;
  writeFileSafe(appConfig, header + "\n" + body);
}

function tryAddBootstrapBundleToAngularJson(projectDir, projectName) {
  const angularJson = path.join(projectDir, "angular.json");
  if (!fs.existsSync(angularJson)) return;
  try {
    updateJSON(angularJson, (json) => {
      const projName = json.defaultProject || projectName || Object.keys(json.projects || {})[0];
      const proj = json.projects && json.projects[projName];
      if (!proj) return json;
      const build = (proj.architect && proj.architect.build) || (proj.targets && proj.targets.build);
      if (!build || !build.options) return json;
      const scripts = build.options.scripts || [];
      const entry = "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
      if (!scripts.includes(entry)) scripts.push(entry);
      build.options.scripts = scripts;
      return json;
    });
  } catch (_) {}
}

function tryInjectMaterialIcons(projectDir) {
  const indexHtml = path.join(projectDir, "src", "index.html");
  if (!fs.existsSync(indexHtml)) return;
  try {
    const link = '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">';
    const html = fs.readFileSync(indexHtml, "utf8");
    if (html.includes(link)) return;
    const updated = html.replace("</head>", `  ${link}\n</head>`);
    fs.writeFileSync(indexHtml, updated);
  } catch (_) {}
}

function tryEnsureMaterialTheme(projectDir) {
  const styles = path.join(projectDir, "src", "styles.scss");
  if (!fs.existsSync(styles)) return;
  try {
    const src = fs.readFileSync(styles, "utf8");
    // If the Angular Material schematic added a theming setup via @use, leave it as-is.
    if (src.includes("@use '@angular/material'")) return;
    const importLine = "@import '@angular/material/prebuilt-themes/indigo-pink.css';";
    if (!src.includes(importLine)) {
      fs.writeFileSync(styles, `${importLine}\n` + src);
    }
  } catch (_) {}
}

function tryEnsureZoneImport(projectDir) {
  const mainTs = path.join(projectDir, "src", "main.ts");
  if (!fs.existsSync(mainTs)) return;
  try {
    const src = fs.readFileSync(mainTs, "utf8");
    if (src.includes("zone.js")) return;
    fs.writeFileSync(mainTs, `import 'zone.js';\n` + src);
  } catch (_) {}
}

function tryEnsureZonePolyfill(projectDir) {
  const poly = path.join(projectDir, "src", "polyfills.ts");
  try {
    if (!fs.existsSync(poly)) writeFileSafe(poly, `import 'zone.js';\n`);
    const tsconfigApp = path.join(projectDir, "tsconfig.app.json");
    if (fs.existsSync(tsconfigApp)) {
      updateJSON(tsconfigApp, (json) => {
        const files = json.files || [];
        if (!files.includes("src/polyfills.ts")) files.unshift("src/polyfills.ts");
        if (!files.includes("src/main.ts")) files.push("src/main.ts");
        json.files = files;
        return json;
      });
    }
  } catch (_) {}
}

function tryEnsureZoneServerImport(projectDir) {
  const mainServerTs = path.join(projectDir, "src", "main.server.ts");
  if (!fs.existsSync(mainServerTs)) return;
  try {
    const src = fs.readFileSync(mainServerTs, "utf8");
    if (src.includes("zone.js/node")) return;
    fs.writeFileSync(mainServerTs, `import 'zone.js/node';\n` + src);
  } catch (_) {}
}

function tryEnsureZoneServerPolyfill(projectDir) {
  const polyServer = path.join(projectDir, "src", "polyfills.server.ts");
  try {
    if (!fs.existsSync(polyServer)) writeFileSafe(polyServer, `import 'zone.js/node';\n`);
    const tsconfigServer = path.join(projectDir, "tsconfig.server.json");
    if (fs.existsSync(tsconfigServer)) {
      updateJSON(tsconfigServer, (json) => {
        const files = json.files || [];
        if (!files.includes("src/polyfills.server.ts")) files.unshift("src/polyfills.server.ts");
        if (!files.includes("src/main.server.ts")) files.push("src/main.server.ts");
        json.files = files;
        return json;
      });
    }
  } catch (_) {}
}

function replaceDefaultAppShell(projectDir) {
  const appCmpTs = path.join(projectDir, "src", "app", "app.ts");
  const appCmpHtml = path.join(projectDir, "src", "app", "app.html");
  if (!fs.existsSync(appCmpTs) || !fs.existsSync(appCmpHtml)) return;
  try {
    const ts = `import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}
`;
    const html = `<router-outlet></router-outlet>\n`;
    writeFileSafe(appCmpTs, ts);
    writeFileSafe(appCmpHtml, html);
  } catch (_) {}
}

function fixMainBootstrap(projectDir) {
  const mainTs = path.join(projectDir, "src", "main.ts");
  if (!fs.existsSync(mainTs)) return;
  try {
    let src = fs.readFileSync(mainTs, "utf8");
    src = src.replace(/import { App } from '\.\/app\/app';/, "import { AppComponent } from './app/app';");
    src = src.replace(/bootstrapApplication\(App,/, "bootstrapApplication(AppComponent,");
    fs.writeFileSync(mainTs, src);
  } catch (_) {}
}

function fixServerBootstrap(projectDir) {
  const mainServerTs = path.join(projectDir, 'src', 'main.server.ts');
  if (!fs.existsSync(mainServerTs)) return;
  let src = fs.readFileSync(mainServerTs, 'utf8');
  src = src.replace(/import { App } from '\.\/app\/app';/, "import { AppComponent } from './app/app';");
  src = src.replace(/bootstrapApplication\(App,/, "bootstrapApplication(AppComponent,");
  fs.writeFileSync(mainServerTs, src);
}
