const fs = require("fs");
const path = require("path");
const { run } = require("./proc");
const { updateJSON } = require("./fs-utils");

// Safe write: ensures directories exist
function writeFileSafe(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

// Add unit tests (Jest or Vitest)
function addUnitTests(projectDir, bundler, useTS, unit, pmCfg) {
  const extx = useTS ? "tsx" : "jsx";
  const testDir = path.join(projectDir, "src", "tests");
  fs.mkdirSync(testDir, { recursive: true });

  // Detect if project is ESM
  const pkg = require(path.join(projectDir, "package.json"));
  const useESM = pkg.type === "module";

  if (unit === "jest") {
    const devDeps = [
      "jest",
      "babel-jest",
      "@testing-library/react",
      "@testing-library/jest-dom",
      "jest-environment-jsdom",
      "@babel/preset-env",
      "@babel/preset-react",
    ];
    if (useTS) devDeps.push("@babel/preset-typescript", "@types/jest"); // ← fixed

    // Babel (create if missing)
    if (!fs.existsSync(path.join(projectDir, "babel.config.json"))) {
      writeFileSafe(
        path.join(projectDir, "babel.config.json"),
        JSON.stringify(
          {
            presets: [
              ["@babel/preset-env", { targets: { esmodules: true } }],
              ["@babel/preset-react", { runtime: "automatic" }],
              ...(useTS ? [["@babel/preset-typescript"]] : []),
            ],
          },
          null,
          2
        )
      );
    }

    // Jest config (.cjs if package.type=module)
    const jestConfigFile = useESM ? "jest.config.cjs" : "jest.config.js";
    writeFileSafe(
      path.join(projectDir, jestConfigFile),
      `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.${useTS ? "ts" : "js"}'],
  transform: { '^.+\\\\.(t|j)sx?$': 'babel-jest' },
};`
    );

     // Jest setup file
    writeFileSafe(
      path.join(testDir, `setupTests.${useTS ? "ts" : "js"}`),
      `import '@testing-library/jest-dom';\n`
    );

    // Install dependencies
    run(pmCfg.dev[0], [...pmCfg.dev[1], ...devDeps]);

    // Add scripts to package.json
    updateJSON(path.join(projectDir, "package.json"), (p) => {
      p.scripts ||= {};
      p.scripts.test = "jest";
      p.scripts["test:watch"] = "jest --watch";
      return p;
    });

    // Example test
    const helloFn = useTS
      ? `type HelloProps = { name: string };
function Hello({ name }: HelloProps) { return <span>Hello {name}</span>; }`
      : `function Hello({ name }) { return <span>Hello {name}</span>; }`;

    writeFileSafe(
      path.join(testDir, `example.test.${extx}`),
      `import { render, screen } from '@testing-library/react';
${helloFn}
test('renders', () => {
  render(<Hello name="Nirmal" />);
  expect(screen.getByText(/Nirmal/)).toBeInTheDocument();
});`
    );
  } else if (unit === "vitest") {
    const devDeps = ["vitest", "@testing-library/react", "@testing-library/jest-dom", "jsdom"];
    run(pmCfg.dev[0], [...pmCfg.dev[1], ...devDeps]);

    // Vitest config so JSX works without importing React explicitly
    const vitestCfgName = useTS ? "vitest.config.ts" : "vitest.config.js";
    writeFileSafe(
      path.join(projectDir, vitestCfgName),
      `import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setupTests.${useTS ? "ts" : "js"}',
    include: ['src/tests/**/*.test.*']
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  }
});`
    );

    // Setup
    writeFileSafe(
      path.join(testDir, `setupTests.${useTS ? "ts" : "js"}`),
      `import '@testing-library/jest-dom';\n`
    );

    // Scripts
    updateJSON(path.join(projectDir, "package.json"), (p) => {
      p.scripts ||= {};
      const cfg = vitestCfgName;
      p.scripts.test = `vitest run --config ${cfg}`;
      p.scripts["test:watch"] = `vitest --watch --config ${cfg}`;
      return p;
    });

    // Example test (no `import React` needed thanks to jsx: 'automatic')
    const content = useTS
      ? `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

export function Hello({ name }: { name: string }) {
  return <span>Hello {name}</span>;
}

describe('Hello', () => {
  it('renders', () => {
    const r = render(<Hello name='Nirmal' />);
    expect(r.getByText(/Nirmal/)).toBeTruthy();
  });
});`
      : `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

export function Hello({ name }) {
  return <span>Hello {name}</span>;
}

describe('Hello', () => {
  it('renders', () => {
    const r = render(<Hello name='Nirmal' />);
    expect(r.getByText(/Nirmal/)).toBeTruthy();
  });
});`;

    writeFileSafe(path.join(testDir, `example.test.${useTS ? "tsx" : "jsx"}`), content);
  }
}

// Add E2E tests (Cypress or Playwright)
function addE2ETests(projectDir, bundler, useTS, e2e, pmCfg) {
  const devOrStart = bundler === "vite" ? "dev" : "start";

  if (e2e === "cypress") {
    const devDeps = ["cypress", "start-server-and-test"];
    run(pmCfg.dev[0], [...pmCfg.dev[1], ...devDeps]);

    const cfgName = `cypress.config.${useTS ? "ts" : "js"}`;
    const cfg = `import { defineConfig } from 'cypress';
export default defineConfig({ e2e: { baseUrl: 'http://localhost:5173' } });`;
    writeFileSafe(path.join(projectDir, cfgName), cfg);

    fs.mkdirSync(path.join(projectDir, "cypress", "e2e"), { recursive: true });
    writeFileSafe(
      path.join(projectDir, "cypress", "e2e", `smoke.cy.${useTS ? "ts" : "js"}`),
      `describe('smoke', () => { it('loads', () => { cy.visit('/'); cy.contains('Home'); }); });`
    );

    updateJSON(path.join(projectDir, "package.json"), (p) => {
      p.scripts ||= {};
      p.scripts["cypress:open"] = "cypress open";
      p.scripts["cypress:run"] = "cypress run";
      p.scripts["test:e2e"] = `start-server-and-test ${devOrStart} http://localhost:5173 cypress run`;
      return p;
    });
  } else if (e2e === "playwright") {
    const devDeps = ["@playwright/test", "start-server-and-test"];
    run(pmCfg.dev[0], [...pmCfg.dev[1], ...devDeps]);

    const cfgName = `playwright.config.${useTS ? "ts" : "js"}`;
    const cfg = `import { defineConfig } from '@playwright/test';
export default defineConfig({ webServer: { command: 'npm run ${devOrStart}', url: 'http://localhost:5173', reuseExistingServer: true } });`;
    writeFileSafe(path.join(projectDir, cfgName), cfg);

    fs.mkdirSync(path.join(projectDir, "tests-e2e"), { recursive: true });
    writeFileSafe(
      path.join(projectDir, "tests-e2e", `smoke.spec.${useTS ? "ts" : "js"}`),
      `import { test, expect } from '@playwright/test';
test('home loads', async ({ page }) => { await page.goto('/'); await expect(page.getByText('Home')).toBeVisible(); });`
    );

    updateJSON(path.join(projectDir, "package.json"), (pkg) => {
      pkg.scripts ||= {};
      pkg.scripts.e2e = "playwright test";
      pkg.scripts["e2e:ui"] = "playwright test --ui";
      pkg.scripts["e2e:install"] = "playwright install";
      pkg.scripts["test:e2e"] = `start-server-and-test ${devOrStart} http://localhost:5173 playwright test`;
      return pkg;
    });
  }
}

module.exports = { addUnitTests, addE2ETests };
