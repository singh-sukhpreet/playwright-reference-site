---
title: 30. Interview Questions
---

# 30. Interview Questions


### Beginner (10)

**Q1. What is Playwright?**
An open-source end-to-end testing framework for web apps that automates Chromium, Firefox and WebKit, with a built-in test runner, web-first assertions, auto-waiting, isolation and parallel execution.

**Q2. How does Playwright locate elements?**
With **locators** — lazy, auto-waiting query objects. Recommended: `getByRole`, `getByLabel`, `getByText`, `getByPlaceholder`, `getByAltText`, `getByTitle`, `getByTestId`, and CSS/XPath only when needed.

**Q3. Why is `getByRole()` recommended?**
It locates by ARIA role + accessible name — how users and assistive tech perceive the UI. It's resilient to class/DOM changes and promotes accessibility.

**Q4. What is auto-waiting?**
Before each action Playwright waits for actionability checks (visible, stable, enabled, receives events, editable) to pass; assertions retry until conditions are met.

**Q5. What is a BrowserContext?**
An isolated, incognito-like browser session (own cookies, storage, cache). It's how Playwright achieves test isolation — each test gets a fresh context.

**Q6. What is test isolation?**
Each test runs in a brand-new context/page with clean state, so tests don't inherit cookies, storage, or side effects from each other.

**Q7. What are fixtures?**
Reusable, composable pieces of environment setup/teardown (e.g. `page`, `context`, `browser`, `request`, or custom ones). They're isolated per test and set up only when used.

**Q8. How does Playwright run tests in parallel?**
By default it runs **test files in parallel** across worker processes; tests in a file run in order. `fullyParallel` runs every test in parallel; `workers` caps concurrency.

**Q9. What is `storageState`?**
A serialized file of cookies + localStorage representing an authenticated session. Tests load it via `storageState` to start already logged in.

**Q10. How do you handle a download in Playwright?**
Listen for the `download` event before the action: `const dl = page.waitForEvent('download'); await click(); const download = await dl; await download.saveAs(path)`.

### Intermediate (15)

**Q11. How do you handle authentication efficiently?**
A `setup` project runs `auth.setup.ts` once, logs in, saves `context.storageState({ path })`, and other projects use that file as `storageState`. Per-worker fixtures provide unique accounts for parallel tests.

**Q12. How do you mock an API response?**
`await page.route('**/api/...', route => route.fulfill({ status: 200, json: {...} }))`. Mocking is deterministic, fast, and removes external dependencies.

**Q13. How do you test inside an iframe?**
Use `page.frameLocator('iframe').getByRole(...)`, or `page.frame({ url })` + `frame.fill(...)`. `frameLocator` keeps auto-waiting semantics.

**Q14. What is Trace Viewer and how is it used?**
A GUI showing recorded traces: actions, DOM snapshots, network, console, source, errors. Enable with `trace: 'on-first-retry'`, view with `npx playwright show-trace trace.zip`. Best for debugging CI failures.

**Q15. How do retries work?**
A failed test reruns (config `retries` / `--retries`). A test that passes on retry is reported **flaky**. The worker restarts before a retry for a clean environment.

**Q16. What causes flaky tests and how do you fix them?**
Causes: bad selectors, fixed sleeps, shared/order-dependent state, races, external deps, parallel data collisions. Fixes: web-first assertions, role locators, isolation, API setup, mocked deps, retries + traces.

**Q17. What's the difference between `page`, `context`, `browser`?**
`browser` is the launched engine (once per worker); `context` is an isolated session (once per test, gives isolation); `page` is a tab in that context (per test).

**Q18. How do you do API testing in Playwright?**
Use the built-in `request` fixture (`APIRequestContext`) with `get/post/put/patch/delete`, set `baseURL` + `extraHTTPHeaders` in config, assert with `expect(response).toBeOK()` / `res.json()`.

**Q19. How do you wait for a network call after an action?**
```ts
const responsePromise = page.waitForResponse('**/api/fetch_data');
await page.getByText('Update').click();
await responsePromise;
```

**Q20. What are soft assertions?**
`expect.soft(...)` marks failures but lets the test continue, collecting multiple failures before reporting. Useful for checking many things in one flow.

**Q21. How do you reuse auth between API and browser tests?**
`storageState` is interchangeable: log in via `APIRequestContext`, save `request.storageState({ path })`, and pass it to `browser.newContext({ storageState })`.

**Q22. How do you run the same test in multiple browsers?**
Configure **projects** per browser (`chromium`, `firefox`, `webkit`) with `devices['Desktop Chrome']` etc. Each project runs the suite in that browser.

**Q23. What is a web-first assertion?**
An assertion that auto-retries until the condition is met (or times out), e.g. `await expect(locator).toBeVisible()`. Removes race conditions vs one-shot checks.

**Q24. How do you capture screenshots/videos?**
`page.screenshot()` / `locator.screenshot()`; `use.video: 'retain-on-failure'`; visual tests via `await expect(page).toHaveScreenshot()`.

**Q25. How do you debug a failing test locally?**
`npx playwright test --debug` (Inspector: step, pick/edit locators, actionability logs), `--ui` (time-travel), `page.pause()`, `DEBUG=pw:api`, or headed mode.

### Advanced (15)

**Q26. How would you design a scalable Playwright framework?**
Fixtures for auth/env/data (typed via `test.extend`), POMs exposed as fixtures, `playwright.config.ts` with projects (browsers + environments), setup project for auth, API utilities for preconditions/postconditions, deterministic per-test data, tags for smoke/regression, retries + `trace: 'on-first-retry'` on CI, sharded CI pipeline with blob reports.

**Q27. How do retries + workers interact?**
After a failure the worker is discarded and restarted; with retries, the retried test runs in the fresh worker. Serial groups retry together; parallel tests retry independently.

**Q28. How do you avoid parallel-test data collisions?**
Unique per-test/per-worker data: derive from `testInfo.testId` or `testInfo.workerIndex`/`parallelIndex`, use `testInfo.outputPath()` for unique files, worker-scoped fixtures to create one account per worker.

**Q29. How do you handle multiple roles in one test?**
Create multiple contexts with different `storageState` files: `browser.newContext({ storageState: 'admin.json' })` and `'user.json'` in the same test.

**Q30. What is `expect.poll` / `expect.toPass`?**
`expect.poll(fn).toBe(x)` polls a function until it matches (good for async conditions not covered by built-ins). `expect(...).toPass()` retries a block of code/assertions until it succeeds.

**Q31. Explain test timeout vs expect timeout vs action timeout.**
Test = whole test + fixtures (30s). Expect = per assertion retry (5s). Action = per action wait (no default). All configurable; independent of each other.

**Q32. How does `page.route` glob matching work?**
Patterns match the **entire URL**: `*` matches any chars except `/`, `**` includes `/`, `{a,b}` alternatives; or use a RegExp. E.g. `'**/*.{png,jpg,jpeg}'`.

**Q33. Why is `fullyParallel` + sharding better for CI load balance?**
With `fullyParallel`, shards split at the **test level** for even distribution; without it, shards split at the **file level** (unbalanced if files differ in size).

**Q34. How do you test uploads without a real file chooser?**
`locator.setInputFiles()` points directly at the `<input type="file">` (path, array, or in-memory `{ name, mimeType, buffer }`), or handle the `filechooser` event for dynamic inputs.

**Q35. How do you prevent external service calls in tests?**
Mock them with `page.route` (fulfill a stub) so tests are fast, deterministic and only exercise your own app.

**Q36. How would you set up CI to run Playwright?**
GitHub Actions workflow: checkout → setup-node → `npm ci` → `npx playwright install chromium --with-deps` → `npx playwright test` → upload report artifacts. Use matrix sharding, blob reporter, and `merge-reports` for one combined report.

**Q37. What's the difference between the `request` fixture and `playwright.request.newContext()`?**
The `request` fixture is isolated per test and respects config (`baseURL`, headers, proxy). `page.request`/`context.request` share cookies with the browser context. `newContext()` creates a standalone isolated context you must `dispose()`.

**Q38. What is `test.describe.configure({ mode: 'serial' })`?**
Runs grouped tests in order in the same worker; if one fails, the rest are skipped (all retried together). Use for genuinely dependent tests, but prefer isolation.

**Q39. How do you reduce the flakiness of an existing suite?**
Replace sleeps with auto-waiting/web-first assertions, use role locators, isolate tests (fresh context/data), mock third parties, add retries + traces on CI, use `--repeat-each` to reproduce and `--grep` to bisect, and shard for speed.

**Q40. How would you structure a large automation project?**
```
tests/            # specs grouped by feature
pages/            # Page Objects
playwright/       # fixtures.ts (custom fixtures), auth, data builders
utils/            # API clients, helpers
playwright.config.ts
```
Use typed fixtures via `test.extend`, tags for suites, projects for browsers/env, CI sharding, and trace/artifact retention for failures.

---
