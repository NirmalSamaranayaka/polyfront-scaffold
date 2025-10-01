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
  if (args.axios === true) core.push("axios");
  if (args.zod === true) core.push("zod");

  let uiPkgs = [];
  if (ui === "material") {
    log("→ Adding Angular Material");
    const addM = pmCfg.exec("ng", ["add", "@angular/material", "--skip-confirmation"]);
    run(addM[0], addM[1]);
  } else if (ui === "bootstrap") {
    uiPkgs = ["bootstrap"];
  } else if (ui === "tailwind") {
    uiPkgs = ["tailwindcss@^3.4.0", "postcss", "autoprefixer", "@tailwindcss/forms", "@tailwindcss/typography"];
  } else if (ui === "primeng") {
    uiPkgs = ["primeng", "primeicons", "primeflex"];
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

  if (ui === "tailwind") {
    log("→ Initializing Tailwind (Angular)");
    const ex = pmCfg.exec("tailwindcss", ["init", "-p"]);
    run(ex[0], ex[1]);
    writeFileSafe(path.join(projectDir, "tailwind.config.js"), `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
};`);
    writeFileSafe(path.join(projectDir, "src", "styles.scss"), `@tailwind base;
@tailwind components;
@tailwind utilities;`);
  }

  if (ui === "bootstrap") {
    const stylesPath = path.join(projectDir, "src", "styles.scss");
    writeFileSafe(stylesPath, `@import 'bootstrap/dist/css/bootstrap.min.css';\n`);
    tryAddBootstrapBundleToAngularJson(projectDir, projectName);
  }
  if (ui === "primeng") {
    const stylesPath = path.join(projectDir, "src", "styles.scss");
    writeFileSafe(stylesPath, `@import 'primeng/resources/themes/lara-light-blue/theme.css';
@import 'primeng/resources/primeng.min.css';
@import 'primeicons/primeicons.css';
@import 'primeflex/primeflex.css';\n`);
  }

  if (ui === "material") {
    tryInjectMaterialIcons(projectDir);
    tryEnsureMaterialTheme(projectDir);
  }

  // Scaffold common folders and multi-UI layout/pages (Angular)
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
  const animImport = needsAnimations ? "import { provideAnimations } from '@angular/platform-browser/animations';\n" : "";
  const cfgHeader = `import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
${animImport}`;
  const providers = ["provideRouter(routes, withComponentInputBinding())"].concat(needsAnimations ? ["provideAnimations()"] : []);
  const cfgBody = `export const appConfig: ApplicationConfig = {
  providers: [
    ${providers.join(",\n    ")}
  ]
};
`;
  writeFileSafe(appConfig, cfgHeader + "\n" + cfgBody);
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
