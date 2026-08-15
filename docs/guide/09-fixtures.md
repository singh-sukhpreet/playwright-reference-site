---
title: 9. Fixtures
---

# 9. Fixtures


**What it is:**
Fixtures establish the environment for each test: encapsulated setup **and** teardown, isolated between tests, on-demand, reusable, composable.

**Built-in fixtures:**

| Fixture | Scope | Purpose |
|---|---|---|
| `page` | test | Isolated `Page` for the test |
| `context` | test | Isolated `BrowserContext` |
| `browser` | worker | Shared browser instance |
| `browserName` | test | `'chromium'` / `'firefox'` / `'webkit'` |
| `request` | test | Isolated `APIRequestContext` |

```ts
test('basic test', async ({ page, request }) => { ... });
```

**Custom fixture:**

```ts
import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);   // setup
    await todoPage.goto();
    await use(todoPage);                    // ← test runs here
    await todoPage.removeAll();             // teardown
  },
});
```

**Fixture options:**
- `{ scope: 'worker' }` — set up once per worker (e.g. unique account per worker, database seed).
- `{ auto: true }` — runs for every test even if not listed in the test signature.
- Override built-ins (e.g. override `page` to always `goto(baseURL)`, or override `storageState`).
- Fixture setup/teardown counts toward the **test timeout**; give slow fixtures their own `{ timeout }`.

**Advantages over hooks:** encapsulates setup+teardown in one place, reusable across files, only set up when needed, can depend on other fixtures.

**Interview angle:** *Fixtures vs beforeEach?* — Fixtures encapsulate both setup and teardown together, are reusable across files and isolated; hooks only run code at a point in time and can leak shared state. [Fixtures](https://playwright.dev/docs/test-fixtures)

---
