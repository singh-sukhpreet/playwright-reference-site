---
title: 27. Best Practices Checklist
---

# 27. Best Practices Checklist


- Prefer **user-facing locators**: role → text → test-id → CSS/XPath last.
- Use **web-first auto-retrying assertions**, never manual `isVisible()` checks.
- **Never** `waitForTimeout()`; rely on auto-waiting and explicit event/URL waits.
- Keep tests **isolated** — fresh context per test; no shared mutable state or order dependence.
- Set up data **via API** (preconditions) and assert postconditions via API too.
- **Mock third-party/external** services (`page.route`) — only test what you control.
- Reuse **authentication** via `storageState` + setup project, not per-test UI login.
- Use **fixtures** for setup/teardown (encapsulate + reuse), POMs for structure.
- Keep test **data deterministic** and unique per test/worker (`testInfo.testId`, `workerIndex`).
- Design for **parallel** execution; use unique file paths via `testInfo.outputPath()`.
- Run **across browsers** via projects; keep Playwright **up to date**.
- Enable **traces/retries on CI**; use `--repeat-each` to hunt flakiness.
- Use **soft assertions** sparingly to check multiple things in one flow.
- Lint with ESLint + `@typescript-eslint/no-floating-promises` (catch missing awaits).

---
