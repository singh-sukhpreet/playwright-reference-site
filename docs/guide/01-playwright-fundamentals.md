---
title: 1. Playwright Fundamentals
---

# 1. Playwright Fundamentals


**What it is:**
Playwright is a browser automation + end-to-end test framework for modern web apps. It bundles a test runner (`@playwright/test`), web-first assertions, fixtures, isolation, parallelism, and rich tooling (Codegen, UI Mode, Trace Viewer).

- Cross-browser: **Chromium, Firefox, WebKit** (plus branded Chrome/Edge, Android/iOS emulation).
- Two modes: **Test Runner** (recommended, batteries included) and **Library** (raw `chromium.launch()` automation).
- Node.js, Python, Java, .NET bindings. TS works out of the box.

```ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});
```

**Remember:**
- Tests = perform actions + assert state. That's it.
- You don't add manual waits — auto-waiting handles race conditions.

**Interview angle:** *Why Playwright over Selenium?* — Built-in runner, auto-waiting, faster/more reliable protocol (CDP for Chromium, driver-less WebKit/Firefox), parallel by default, isolation, first-class API/network mocking, trace viewer.

---
