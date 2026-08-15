---
title: 6. Assertions
---

# 6. Assertions


**What it is:**
Web-first assertions auto-**retry** until the condition is met (or timeout). Generic matchers are synchronous and non-retrying.

```ts
// Auto-retrying locator assertions (always await)
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeAttached();
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toBeEditable();
await expect(locator).toBeChecked();
await expect(locator).toBeFocused();
await expect(locator).toBeEmpty();
await expect(locator).toBeInViewport();
await expect(locator).toContainText('partial');
await expect(locator).toHaveText('Success', { timeout: 10_000 }); // also arrays/regex
await expect(locator).toHaveValue('x');
await expect(locator).toHaveValues(['a', 'b']);
await expect(locator).toHaveAttribute('href', /part/);
await expect(locator).toHaveClass('active');
await expect(locator).toHaveCount(3);
await expect(locator).toHaveScreenshot();

// Page / response assertions
await expect(page).toHaveTitle(/Playwright/);
await expect(page).toHaveURL(/dashboard/);
await expect(response).toBeOK();

// Negation
await expect(locator).not.toBeVisible();
```

**Generic (non-retrying) assertions:**

```ts
expect(value).toBe(true);
expect(value).toEqual({ a: 1 });
expect(value).toMatchObject({ a: 1 });
expect(value).toContain('sub');
expect(value).toHaveLength(3);
expect(value).toMatch(/regex/);
```

**Soft assertions** — log failures but continue the test:

```ts
await expect.soft(page.getByTestId('status')).toHaveText('Success');
await expect.soft(page.getByTestId('eta')).toHaveText('1 day');
expect(test.info().errors).toHaveLength(0);  // optionally bail
```

difference between assert and verify - assert stop the execution if condition didn't met whereas verify continue the test and log the failures for reporting 

**Polling / retry helpers:**

```ts
await expect.poll(async () => {
  const res = await page.request.get('https://api.example.com');
  return res.status();
}, { timeout: 10_000 }).toBe(200);

await expect(async () => {
  const res = await page.request.get('https://api.example.com');
  expect(res.status()).toBe(200);
}).toPass({ timeout: 10_000 });

const slowExpect = expect.configure({ timeout: 10_000, soft: true });
```

**Remember:**
- Assertion timeout default **5s**, configurable via `expect.timeout` or per-call `{ timeout }`.
- Don't mix Playwright `expect` with the Jest `expect` library.
- Prefer web-first assertions over `isVisible()` checks — they retry instead of checking once.

```ts
// ❌ expect(await page.getByText('welcome').isVisible()).toBe(true);
// ✅ await expect(page.getByText('welcome')).toBeVisible();
```

**Interview angle:** *Why web-first assertions?* — They wait/retry until the condition is true, eliminating the race conditions that make tests flaky. [Assertions](https://playwright.dev/docs/test-assertions)

---
