---
title: 12. Authentication
---

# 12. Authentication


**What it is:**
Authenticate once, save the authenticated state, and bootstrap every test with it. Prevents logging in through the UI in every test (slow + flaky).

**Steps (basic shared account):**

```ts
// tests/auth.setup.ts — runs in the 'setup' project
import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByLabel('Username or email address').fill('user');
  await page.getByLabel('Password').fill('pass');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('https://example.com/');
  await page.context().storageState({ path: authFile });   // cookies + localStorage
});
```

```ts
// playwright.config.ts
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  { name: 'chromium', use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'] },
]
```

**Moderate: one account per parallel worker** — tests that modify server-side state need unique accounts. Use a **worker-scoped fixture** that authenticates with a unique account (via `testInfo.parallelIndex`) and reuses the file.

```ts
const test = base.extend<{}, { workerStorageState: string }>({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),
  workerStorageState: [async ({ browser }, use) => {
    const id = test.info().parallelIndex;
    const file = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);
    if (fs.existsSync(file)) { await use(file); return; }
    // ... login with a unique account for this worker ...
    await page.context().storageState({ path: file });
    await use(file);
  }, { scope: 'worker' }],
});
```

**Other patterns:**
- **API auth**: `request.post('/login', { form: {...} })` then `request.storageState({ path: authFile })`.
- **Multiple roles**: multiple `setup` tests writing `admin.json` / `user.json`, applied per-file via `test.use({ storageState: '...admin.json' })`, or multiple contexts per test.
- **Skip auth in a file**: `test.use({ storageState: { cookies: [], origins: [] } })`.

**Security:** state files contain credentials — keep `playwright/.auth` in `.gitignore`.

**Interview angle:** *Why storageState instead of UI login per test?* — Reuse = faster, more reliable, isolated; UI login for every test is slow and repetitive. [Authentication](https://playwright.dev/docs/auth)

---
