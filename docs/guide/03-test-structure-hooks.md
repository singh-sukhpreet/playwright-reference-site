---
title: 3. Test Structure & Hooks
---

# 3. Test Structure & Hooks


**What it is:**
Tests are declared with `test()`, grouped with `test.describe()`, with `beforeEach/afterEach/beforeAll/afterAll` hooks scoped to the file or describe block.

```ts
import { test, expect } from '@playwright/test';

test.describe('shopping cart', () => {
  test.beforeEach(async ({ page }) => {        // runs before each test in group
    await page.goto('https://demo.playwright.dev/todomvc/');
  });

  test('add item', async ({ page }) => {
    await page.getByPlaceholder('What needs to be done?').fill('milk');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
    await expect(page.getByTestId('todo-title')).toHaveText(['milk']);
  });

  test.afterEach(async () => { /* teardown */ });
});
```

**Hooks:**
- `test.beforeEach` / `test.afterEach` — per test (have access to fixtures).
- `test.beforeAll` / `test.afterAll` — once per worker process.
- `test.describe.configure({ mode: 'parallel' | 'serial' })` — execution mode for a group/file.
- `test.only()`, `test.skip()`, `test.fail()`, `test.fixme()`, `test.slow()`, `test.setTimeout()`, `test.use()`.

**Annotations (tags/skip/fail):**

```ts
test('full report @slow', { tag: '@slow' }, async ({ page }) => { });
test.skip(browserName === 'firefox', 'Firefox unsupported yet');
test.fail();                 // expects the test to fail
test.fixme();                // won't run; marked as broken
test.slow();                 // triple the test timeout
```

**Remember:**
- `beforeAll` runs per worker — if tests run across many workers it runs many times.
- Prefer fixtures over hooks for setup+teardown pairs (they're isolated and reusable).

**Interview angle:** *beforeEach vs beforeAll?* beforeEach runs before each test (fresh state), beforeAll runs once per worker — shared state there must be read-only, or use worker-scoped fixtures.

---
