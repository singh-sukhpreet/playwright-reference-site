---
title: 26. CI/CD
---

# 26. CI/CD


**What it is:** Run tests on every commit/PR. Playwright scaffolds a GitHub Actions workflow.

```yaml
# .github/workflows/playwright.yml (key steps)
steps:
  - uses: actions/checkout@v6
  - uses: actions/setup-node@v6
    with: { node-version: lts/* }
  - run: npm ci
  - run: npx playwright install --with-deps        # install only needed browsers on CI
  - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
  - uses: actions/upload-artifact@v4
    if: ${{ !cancelled() }}
    with:
      name: playwright-report
      path: playwright-report
      retention-days: 30
```

**CI config best practices:**
- `forbidOnly: true` (fail on `test.only`), `retries: 2`, `workers` capped, `reuseExistingServer: false`.
- `npx playwright install chromium --with-deps` — only install what you run.
- **Sharding**: run `--shard=1/4` in a matrix; use **blob reporter** on CI + `npx playwright merge-reports` for one merged HTML report.
- `trace: 'on-first-retry'` and upload `test-results`/`playwright-report` artifacts to debug failures.
- Use Linux on CI (cheap), keep parallel/isolated tests.

```ts
export default defineConfig({
  reporter: process.env.CI ? 'blob' : 'html',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
});
```

**Remember:** CI ≠ local. Pin Node version, install browsers with `--with-deps`, upload reports/traces as artifacts. [CI](https://playwright.dev/docs/ci)

---
