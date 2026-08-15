---
title: 13. API Testing
---

# 13. API Testing


**What it is:**
Playwright can test REST APIs and prepare/verify server state from Node.js without a browser. Uses `APIRequestContext`; in tests, the built-in `request` fixture.

```ts
import { test, expect } from '@playwright/test';

test('create and fetch a bug', async ({ request }) => {
  const create = await request.post('/repos/user/repo/issues', {
    data: { title: '[Bug] report 1', body: 'Bug description' },
  });
  expect(create.ok()).toBeTruthy();

  const get = await request.get('/repos/user/repo/issues');
  expect(get.ok()).toBeTruthy();
  expect(await get.json()).toContainEqual(expect.objectContaining({ title: '[Bug] report 1' }));
});
```

**Methods on `request`:**
```ts
await request.get(url)      await request.post(url, { data | form | headers | multipart })
await request.put(...)      await request.patch(...)     await request.delete(url)
await request.fetch(url, { method: 'POST', data: {...} })
const res = await request.get('/users');
res.ok()  res.status()  res.headers()  await res.json()  await res.text()  await res.body()
```

**Config for API tests:**

```ts
use: {
  baseURL: 'https://api.github.com',
  extraHTTPHeaders: { Authorization: `token ${process.env.API_TOKEN}` },
}
```

**Combining API + UI (preconditions / postconditions):**

```ts
test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({ baseURL: 'https://api.github.com' });
});
// create data via API, then assert it shows in the UI:
await page.goto('/issues');
await expect(page.getByRole('link', { name: '[Feature] request 1' })).toBeVisible();
```

**Context request vs isolated request:**
- `page.request` / `context.request` share cookie storage with the browser context (good for authenticated UI tests).
- `playwright.request.newContext()` is isolated (own cookies); dispose with `await apiContext.dispose()`.
- `storageState` is interchangeable between `APIRequestContext` and `BrowserContext` — log in via API, then reuse state in the browser.

**Remember:** `request` fixture is isolated per test; use `beforeAll`+`newContext` for a shared context.

---
