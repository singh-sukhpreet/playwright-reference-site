---
title: 22. Parallelism & Workers
---

# 22. Parallelism & Workers


**What it is:**
Tests run in parallel using **worker processes** (OS processes, each with its own browser). By default **test files run in parallel**; tests within a file run **in order** in one worker.

```
Playwright Test
   ├── Worker 1 ── BrowserContext ── file A tests (in order)
   ├── Worker 2 ── BrowserContext ── file B tests
   └── Worker 3 ── BrowserContext ── file C tests
```

**Control:**
```ts
workers: 4,                     // config (default: 50% of cores)
fullyParallel: true,            // run ALL tests (even in one file) in parallel
```
```ts
test.describe.configure({ mode: 'parallel' });  // per file/group
test.describe.configure({ mode: 'serial' });    // dependent tests; skip rest on failure
```

- `npx playwright test --workers=1` disables parallelism.
- `npx playwright test --shard=1/4` splits across machines (CI jobs). Merge blob reports: `npx playwright merge-reports`.
- Workers are **restarted after a failure** to guarantee a pristine environment.
- Workers can't communicate; state sharing across workers is impossible by design.

**Parallel pitfalls:** shared backend data (use unique data per test via `testInfo.testId`/`workerIndex`), shared files (use `testInfo.outputPath()`), module-level mutable state, order-dependent tests.

**Remember:** isolation via contexts means cookies/storage are already isolated; flakiness comes from state *outside* the test (DB, files).

---
