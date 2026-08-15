---
title: 11. Projects
---

# 11. Projects


**What it is:**
A project is a logical group of tests running with the same configuration. Use them to run tests on multiple browsers/devices, environments, or with different retries.

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  { name: 'Google Chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
  { name: 'staging', use: { baseURL: 'https://staging.example.com' }, retries: 2 },
  { name: 'production', use: { baseURL: 'https://example.com' }, retries: 0 },
]
```

**Project dependencies** (setup runs first):

```ts
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  { name: 'chromium', use: { storageState: 'playwright/.auth/user.json' }, dependencies: ['setup'] },
]
```

- Dependencies always run first; if a dependency fails, dependent projects don't run.
- Multiple dependencies run in parallel; a project's `teardown` project runs afterwards.

**Remember:**
- `npx playwright test --project=firefox` to run a single project.
- Projects can carry different `use`, `retries`, `timeout`, `testMatch`/`testIgnore`.

**Interview angle:** *Test vs project?* — A test is a single `test('...')` case; a project is a full configuration (browser/device/env) that a suite of tests runs under.

---
