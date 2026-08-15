---
title: 7. Auto-Waiting
---

# 7. Auto-Waiting


**What it is:**
Playwright runs **actionability checks** before every action and waits (up to the action timeout) for them to pass. Assertions auto-retry similarly.

**Actionability checks for `click()` and friends:**
- **Visible** — non-empty bounding box, not `visibility:hidden`, not `display:none`. Note: `opacity:0` is still "visible".
- **Stable** — same bounding box for two consecutive animation frames.
- **Receives events** — not obscured by another element at the action point.
- **Enabled** — not `[disabled]`, not in a disabled `<fieldset>`, not `aria-disabled=true`.
- **Editable** (fill/clear only) — enabled and not `readonly`.

```ts
// auto-waiting happens automatically:
await page.getByRole('button', { name: 'Sign in' }).click();
```

**Why auto-waiting matters:**
- No explicit `sleep`/`waitForTimeout()` needed; locators are retried when elements appear/re-render.
- `waitForTimeout()` is a **bad practice**: fixed sleeps are either too short (flaky) or too long (slow). It is the #1 cause of flaky tests.

**When explicit waiting IS appropriate:**
- Waiting for a network response: `page.waitForResponse('**/api/...')`.
- Waiting for a specific event: `page.waitForEvent('download')` / `page.waitForEvent('popup')`.
- Waiting for a URL: `page.waitForURL('**/dashboard')`.
- Polling a custom condition: `expect.poll(...)` / `expect(...).toPass()`.
- After a navigation that triggers redirects: `page.waitForURL()`.

```ts
const responsePromise = page.waitForResponse('**/api/fetch_data');
await page.getByText('Update').click();
const response = await responsePromise;

const downloadPromise = page.waitForEvent('download');
await page.getByText('Download file').click();
const download = await downloadPromise;
```

**Interview angle:** *Auto-waiting vs hard waits?* — Auto-waiting is conditional and retries until state changes; hard waits (`waitForTimeout`) burn a fixed amount of time regardless of state. [Auto-waiting](https://playwright.dev/docs/actionability)

---
