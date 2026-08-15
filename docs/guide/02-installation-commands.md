---
title: 2. Installation & Commands
---

# 2. Installation & Commands


**What it is:**
Scaffolds a project with `playwright.config.ts`, `package.json`, `tests/example.spec.ts`. Downloads browser binaries separately.

```bash
npm init playwright@latest     # scaffold new or existing project (choose TS/JS, tests dir, CI workflow, browsers)
npx playwright install          # download browser binaries
npx playwright install --with-deps  # + system dependencies (Linux CI)
npx playwright install chromium # only one browser
npm install -D @playwright/test@latest  # update Playwright
npx playwright --version        # check version
```

**Run / filter tests:**

```bash
npx playwright test                          # run all tests (headless, parallel)
npx playwright test tests/login.spec.ts      # one file
npx playwright test my-spec.ts:42            # test at line 42
npx playwright test -g "add a todo item"     # by title regex
npx playwright test --grep "@smoke"          # by tag
npx playwright test --grep-invert "@slow"    # exclude tag
npx playwright test --project=chromium       # one project/browser
npx playwright test --headed                 # headed browser
npx playwright test --ui                     # UI Mode (watch, time-travel)
npx playwright test --debug                  # Playwright Inspector
npx playwright test --workers 4              # limit parallel workers (default: 50% of cores)
npx playwright test --workers=1              # disable parallelism
npx playwright test --retries=3              # retry failed tests
npx playwright test --shard=1/4              # run shard 1 of 4 (multi-machine)
npx playwright test -x                       # stop after first failure
npx playwright test --max-failures=10        # stop after N failures
npx playwright test --repeat-each=5          # run each test N times (flakiness check)
npx playwright test --list                   # collect tests without running
npx playwright test --last-failed            # re-run only failures
npx playwright test --forbid-only            # fail CI if test.only present
npx playwright test --update-snapshots       # update visual snapshots
npx playwright test --only-changed           # run only changed files (git)
npx playwright test --fail-on-flaky-tests    # fail run if a test was flaky
npx playwright test --fully-parallel         # all tests in all files in parallel
```

**Reports / traces / codegen:**

```bash
npx playwright show-report              # open last HTML report
npx playwright show-trace trace.zip     # open a trace
npx playwright codegen playwright.dev   # record + generate tests / pick locators
npx playwright merge-reports ./reports  # merge blob reports from shards
npx playwright clear-cache
```

**Remember:**
- Default workers = 50% of logical CPU cores.
- `--debug` is a shortcut for `PWDEBUG=1 --timeout=0 --max-failures=1 --headed --workers=1`.

---
