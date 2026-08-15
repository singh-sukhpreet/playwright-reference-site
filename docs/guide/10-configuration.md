---
title: 10. Configuration
---

# 10. Configuration


**What it is:** `playwright.config.ts` centralizes runner behavior. **Top-level** options (not in `use`): timeout, retries, workers, projects, reporter, testDir.

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // fail CI on test.only
  retries: process.env.CI ? 2 : 0,       // retry failed tests on CI
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30_000,                        // per-test timeout (default 30s)
  expect: { timeout: 5_000 },             // assertion timeout (default 5s)
  use: {
    baseURL: 'http://localhost:3000',     // enables relative page.goto('/')
    trace: 'on-first-retry',              // trace when retrying
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  globalSetup: './global-setup',
  globalTeardown: './global-teardown',
});
```

**Key properties:**
- `testDir` — where spec files live. Default test match: `.*(test|spec)\.(js|ts|mjs)`.
- `testMatch` / `testIgnore` — filter which files are tests.
- `outputDir` — artifacts (screenshots, traces, videos). Default `test-results`.
- `globalTimeout` — max for whole run (e.g. 1h).
- `fullyParallel` — run all tests in all files in parallel.
- `retries`, `workers`, `maxFailures`.
- `webServer` — launches dev server; `reuseExistingServer: !process.env.CI` (also supports arrays).
- `use.baseURL` — relative navigation; also used by `page.route`, `waitForURL`, etc.
- `use.extraHTTPHeaders` — e.g. API auth token for the `request` fixture.

**Remember:**
- Runner options go **top-level**; browser/context options go in `use`.
- Per-test overrides: `test.setTimeout()`, `test.slow()`, `test.use({ baseURL })`, `test.describe.configure({ retries: 2 })`.

---
