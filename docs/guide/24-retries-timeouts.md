---
title: 24. Retries & Timeouts
---

# 24. Retries & Timeouts


**Retries** — auto re-run failed tests to mask flakiness (best on CI):

```ts
retries: 2,                 // config, or
// npx playwright test --retries=3
```

- Result categories: **passed** (first run), **flaky** (failed then passed on retry), **failed** (all attempts failed).
- On retry, the whole worker restarts (fresh env).
- Runtime awareness: `testInfo.retry` (e.g. clean server state before retry).
- Serial groups retry together; failure skips subsequent serial tests.

**Timeouts — know the defaults:**

| Timeout | Default | Where |
|---|---|---|
| Test | 30s | `timeout` / `test.setTimeout()` |
| Expect (assertion) | 5s | `expect.timeout` / `{ timeout }` per call |
| Action | none | `use.actionTimeout` / `click({ timeout })` |
| Navigation | none | `use.navigationTimeout` |
| Global (whole run) | none | `globalTimeout` |
| `beforeAll`/`afterAll` | same as test | `test.setTimeout()` in hook |
| Fixture | shares test timeout | `{ timeout }` on fixture |

```ts
test('slow', async ({ page }) => {
  test.slow();                                   // triple default timeout
  test.setTimeout(120_000);                      // explicit
  await page.goto('/', { timeout: 30_000 });     // per-action
  await expect(locator).toHaveText('x', { timeout: 10_000 });
});
```

**Flaky test — common causes:**
- Bad selectors / long CSS or XPath chains.
- Arbitrary sleeps (`waitForTimeout`).
- Shared state or order-dependency between tests.
- Race conditions (not waiting for network/URL).
- External/third-party dependencies.
- Parallel tests colliding on shared data.

**Fix:** web-first assertions, user-facing locators, isolation, mocked/controlled APIs, retries+trace on CI, `--repeat-each` to reproduce.

---
