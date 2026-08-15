---
title: Playwright Interview Revision Guide
---

# Playwright Interview Revision Guide

> One-shot revision for a Playwright automation/SDET interview. All content verified against the [official Playwright documentation](https://playwright.dev/docs/intro) (2026). Typescript examples.
---


1. Playwright is a cross-browser (Chromium, Firefox, WebKit) end-to-end testing framework with its own runner, auto-waiting, isolation, parallelization and tooling.
2. Locators are the primary way to find elements — they auto-wait and are retryable.
3. Locator priority: `getByRole()` → other user-facing locators → test ids → CSS/XPath last.
4. Locators are **strict**: an action throws if more than one element matches.
5. Playwright **auto-waits** for actionability (visible, stable, receives events, enabled, editable) before every action. Don't add sleeps.
6. `waitForTimeout()` is an anti-pattern. Use web-first assertions / waits instead.
7. Use **web-first auto-retrying assertions**: `await expect(locator).toBeVisible()` etc.
8. Default timeouts: test **30s**, expect **5s**, action & navigation **no default timeout**.
9. Hierarchy: **Browser → BrowserContext → Page**. Browsers launch once, contexts are cheap isolated profiles, pages are tabs.
10. **Test isolation**: every test gets a fresh `BrowserContext` (own cookies/storage), so tests don't affect each other.
11. **Fixtures** (`page`, `context`, `browser`, `request`) encapsulate setup/teardown, are isolated, reusable and on-demand.
12. `test.extend()` creates custom fixtures; `{ scope: 'worker' }` runs once per worker; `{ auto: true }` runs automatically.
13. Tests run **in parallel across files** via workers. Tests in one file run in order unless `test.describe.configure({ mode: 'parallel' })` or `fullyParallel`.
14. **Workers** are OS processes; each starts its own browser. Workers restart after a failure.
15. On failure, the worker is discarded so a failed test can't poison later tests.
16. **Retries** (`retries` config / `--retries`) categorize: passed, **flaky** (failed then passed), failed.
17. Configure timeouts in `playwright.config.ts` via `timeout`, `expect.timeout`, `use.actionTimeout`, `use.navigationTimeout`.
18. Auth is reused via `storageState` (cookies + localStorage), produced by a **setup project** (`auth.setup.ts`) — don't log in per test.
19. API testing via the `request` fixture (`APIRequestContext`): `request.get/post/put/patch/delete`.
20. Network mocking via `page.route()` + `route.fulfill()` / `route.continue()` / `route.abort()`.
21. Use `page.frameLocator()` for iframes. `page.locator()` auto-pierces shadow DOM (XPath does not).
22. Debug: `--headed`, `--debug` (Inspector), `--ui` (UI Mode), Trace Viewer, `DEBUG=pw:api`.
23. Trace Viewer shows actions, DOM snapshots, network, console, source — best for CI failures. `trace: 'on-first-retry'`.
24. Screenshots: `page.screenshot()` / `locator.screenshot()`; videos via `use.video`; visual tests via `toHaveScreenshot()`.
25. `npx playwright codegen <url>` records tests and generates resilient locators.
26. HTML report: `npx playwright show-report`. Traces: `npx playwright show-trace trace.zip`.
27. `npx playwright install` downloads browsers; `npm install -D @playwright/test@latest` updates.
28. CI: use Linux, `npx playwright install --with-deps`, `forbidOnly: true`, retries, sharding (`--shard=1/4`) + `blob` reporter + `merge-reports`.
29. Page Object Models centralize locators/actions; best combined with **fixtures**.
30. Keep tests independent: no shared state, no order dependency, unique test data per test.


## Guide Sections

- [1. Playwright Fundamentals](guide/01-playwright-fundamentals.md)
- [2. Installation & Commands](guide/02-installation-commands.md)
- [3. Test Structure & Hooks](guide/03-test-structure-hooks.md)
- [4. Locators](guide/04-locators.md)
- [5. Actions](guide/05-actions.md)
- [6. Assertions](guide/06-assertions.md)
- [7. Auto-Waiting](guide/07-auto-waiting.md)
- [8. Browser / Context / Page](guide/08-browser-context-page.md)
- [9. Fixtures](guide/09-fixtures.md)
- [10. Configuration](guide/10-configuration.md)
- [11. Projects](guide/11-projects.md)
- [12. Authentication](guide/12-authentication.md)
- [13. API Testing](guide/13-api-testing.md)
- [14. Network Mocking](guide/14-network-mocking.md)
- [15. Frames](guide/15-frames.md)
- [16. Dialogs](guide/16-dialogs.md)
- [17. Uploads & Downloads](guide/17-uploads-downloads.md)
- [18. Screenshots / Videos](guide/18-screenshots-videos.md)
- [19. Debugging](guide/19-debugging.md)
- [20. Trace Viewer](guide/20-trace-viewer.md)
- [21. UI Mode & Codegen](guide/21-ui-mode-codegen.md)
- [22. Parallelism & Workers](guide/22-parallelism-workers.md)
- [23. Test Isolation](guide/23-test-isolation.md)
- [24. Retries & Timeouts](guide/24-retries-timeouts.md)
- [25. Page Object Model](guide/25-page-object-model.md)
- [26. CI/CD](guide/26-ci-cd.md)
- [27. Best Practices Checklist](guide/27-best-practices-checklist.md)
- [28. Common Playwright Mistakes](guide/28-common-playwright-mistakes.md)
- [29. Important Comparisons](guide/29-important-comparisons.md)
- [30. Interview Questions](guide/30-interview-questions.md)
- [31. Core API Cheat Sheet](guide/31-core-api-cheat-sheet.md)
- [32. Official Docs Index](guide/32-official-docs-index.md)
