---
title: 28. Common Playwright Mistakes
---

# 28. Common Playwright Mistakes


**1. Arbitrary waits**

```ts
// ❌
await page.waitForTimeout(2000);
// ✅
await expect(page.getByText('Success')).toBeVisible();
await page.waitForResponse('**/api/save');
```

**2. Long CSS/XPath chains**

```ts
// ❌
await page.locator('#tsf > div:nth-child(2) > div > input').click();
// ✅
await page.getByRole('searchbox').fill('playwright');
await page.getByRole('button', { name: 'Search' }).click();
```

**3. Manual assertions instead of web-first**

```ts
// ❌
expect(await page.getByText('welcome').isVisible()).toBe(true);
// ✅
await expect(page.getByText('welcome')).toBeVisible();
```

**4. UI login in every test**

```ts
// ❌ beforeEach: goto login → fill → submit (in every file)
// ✅ setup project + storageState; tests start authenticated
```

**5. Shared state between tests**

```ts
// ❌ module-level variable mutated by test A, read by test B
// ✅ fixture that provisions fresh state per test / per worker
```

**6. Depending on test order / `test.only` left in source**

```ts
// ❌ test only passes if another test ran first
// ✅ isolated tests; forbidOnly on CI
```

**7. Overusing Page Objects** — wrapping every one-liner in a class adds indirection for no benefit. Keep it proportional.

**8. Ignoring strictness** — a locator matching 2 elements throws; fix with a more specific locator instead of `.first()`.

**9. Tests that can't run in parallel** — shared accounts/records cause race failures; give each worker/test unique data.

**10. No isolation of third parties** — external APIs/services make tests slow and flaky; mock them.

---
