---
title: 23. Test Isolation
---

# 23. Test Isolation


**What it is:**
Playwright Test is Playwright's built-in test runner. It handles test discovery, execution, parallelization, retries, fixtures, reporting, and test lifecycle management.

**Isolation = a clean browser environment per test.**
Test isolation means each test gets a clean browser environment so that cookies, localStorage, session data, etc. from one test don't affect another.

Playwright achieves this using **Browser Contexts**. A Browser Context is similar to a separate browser profile. A single browser process can contain multiple isolated contexts:

```
Browser
├── Context → Test 1
├── Context → Test 2
└── Context → Test 3
```

Each test runs in its own clean `BrowserContext` = fresh cookies, localStorage, session storage, cache. "Start from scratch" beats "clean up in between".

**Why it matters:**
- No failure carry-over between tests.
- Debug by running one test repeatedly.
- Safe parallel/sharded/random-order execution.

```ts
test('first', async ({ page, context }) => {
  // 'context' is created fresh for this test
});
test('second', async ({ page, context }) => {
  // completely isolated from the first test
});
```

**Workers & browser lifecycle:**
When running tests in parallel, Playwright Test uses **workers**. Each worker generally has its own browser lifecycle, and tests executed by that worker get isolated contexts.

For example, with 100 tests and 10 workers:

```
10 Workers
   │
   ├── Worker 1 → Browser → Test 1, Test 11, Test 21...
   ├── Worker 2 → Browser → Test 2, Test 12, Test 22...
   ├── Worker 3 → Browser → ...
   └── Worker 10 → Browser → ...
```

- Playwright does **not** normally launch a completely new browser for every test.
- Instead, the browser can be **reused within a worker** while each test gets a fresh context.
- After a test finishes, its context is cleaned up and the worker can execute another test.
- If a test **fails**, Playwright normally cleans up that test's context and continues with other tests — a normal test failure does not mean the entire browser/worker must be closed.
- If the **worker itself crashes**, Playwright can terminate that worker and start a new worker, providing additional isolation.

**Achieving isolation:**
- Don't reuse pages between tests (anti-pattern: shared `page` in `beforeAll`).
- Don't rely on another test's side effects or on execution order.
- Give each test its own backend data (e.g. `order-${testInfo.testId}`).

**Selenium comparison:**

```
Playwright                              Selenium
Playwright Test                         Selenium WebDriver
      ↓                                      ↓
Workers                                 Usually combined with JUnit/TestNG/Mocha/etc.
      ↓                                      ↓
Browser                                 Test framework manages lifecycle/isolation
      ↓                                      ↓
Isolated Browser Context per test       Often new WebDriver session per test
```

---
