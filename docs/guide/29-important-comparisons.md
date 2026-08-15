---
title: 29. Important Comparisons
---

# 29. Important Comparisons


**Locator vs Selector:** A locator is a lazy, auto-waiting, retryable query object (re-resolved on each action). A selector is just the query string (`css=...`, `xpath=...`) that a locator wraps. Locators are the API; selectors are a lower-level detail.

**`getByRole` vs CSS/XPath:** role = user/ARIA semantics, resilient; CSS/XPath = DOM-structure-bound, brittle. Use role first; CSS/XPath only when unavoidable.

**`getByText` vs `getByRole`:** text matches content (use for non-interactive `div/span/p`); role matches semantics + accessible name (use for interactive elements like buttons/links).

**`page.locator()` vs `page.getByRole()`:** `locator` takes raw selectors (CSS/XPath) and is last resort; `getByRole` is the recommended user-facing locator.

**Browser vs BrowserContext:** Browser = launched engine instance (heavy, one per worker). Context = isolated incognito-like session (cheap, one per test). Contexts give isolation; browsers just launch.

**Hard wait vs auto-waiting:** hard wait sleeps a fixed time; auto-waiting polls until actionability passes. Auto-waiting is condition-based and removes flakiness.

**`waitForTimeout()` vs proper waiting:** `waitForTimeout` = fixed sleep (bad). Proper = web-first assertions, `waitForResponse`, `waitForURL`, `expect.poll`. Use proper waits.

**`expect()` vs manual assertions:** `expect(locator).toBeVisible()` retries; `isVisible()` checks once instantly. Web-first assertions remove race conditions.

**`beforeEach` vs `beforeAll`:** beforeEach runs per test (fresh, isolated); beforeAll runs once per worker (shared — only for read-only state or worker-scoped setup).

**Test isolation vs shared state:** isolation = fresh context per test (no carry-over). Shared state = tests depend on each other (breaks under parallel/retries).

**Serial vs parallel execution:** serial runs dependent tests in order (skip rest on failure); parallel runs independently for speed. Prefer isolated+parallel.

**Retries vs repeated tests:** retries auto-rerun failed tests (CI resilience). `--repeat-each` runs a test N times to reproduce/detect flakiness.

**Test timeout vs expect timeout:** test = whole test+fixtures (30s default); expect = per-assertion retry window (5s default). Independent.

**Auth via UI vs storageState:** UI login per test = slow/repetitive. storageState = authenticate once (setup project), reuse cookies in all tests.

**APIRequestContext vs browser-based requests:** APIRequestContext runs from Node (fast, no browser) and can share cookies with a context via `page.request`; browser requests go through the page. Use API for setup/postconditions.

**Mocking vs stubbing/intercepting network:** `route.fulfill` = replace response (mock). `route.continue` = let it hit network, optionally modified (intercept). `route.abort` = block. Same `page.route` API.

**POM vs direct locators:** POM centralizes selectors/actions (maintainable at scale); direct locators are simpler but duplicated across tests.

**Trace vs screenshot vs video:** trace = full recorded session (actions, DOM snapshots, network, console); screenshot = static state; video = playback. Trace is richest for debugging.

**Headless vs headed:** headless = no UI (CI, speed, default); headed = visible browser (debugging, `--headed`).

**Test vs project:** test = single `test()` case. Project = a config (browser/device/env) that a suite runs under; tests execute once per project.

**Worker vs BrowserContext:** worker = OS process running a batch of tests (each worker = own browser). BrowserContext = per-test session inside a worker. Isolation happens at context level; restart happens at worker level.

---
