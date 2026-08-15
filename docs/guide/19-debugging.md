---
title: 19. Debugging
---

# 19. Debugging


**What it is:**
Multiple debugging tools, chosen by scenario:

| Tool | Command | When to use |
|---|---|---|
| Headed browser | `npx playwright test --headed` | watch what happens |
| Playwright Inspector | `npx playwright test --debug` | step through actions, live-edit/pick locators, see actionability logs |
| Breakpoint | `await page.pause();` | pause at a specific point during debug run |
| UI Mode | `npx playwright test --ui` | watch-mode, time-travel, per-step inspection |
| Trace Viewer | `--trace on` then `show-trace` | post-mortem / CI failures |
| HTML report | `npx playwright show-report` | failures, errors, attachments |
| Console devtools | `PWDEBUG=console npx playwright test` | use `playwright.$('.selector')` etc. in devtools |
| Verbose logs | `DEBUG=pw:api npx playwright test` | see every protocol call |

```ts
await page.pause();   // works with --debug / PWDEBUG=1
```

**Remember:**
- `--debug` implies headed, timeout 0, one worker, stop on first failure.
- For CI, use Trace Viewer (not just screenshots/videos).

---
