---
title: 20. Trace Viewer
---

# 20. Trace Viewer


**What it is:**
Records a full execution trace (actions, DOM snapshots before/after each action, network, console, source code, errors). The viewer is a local PWA — view locally or on [trace.playwright.dev](https://trace.playwright.dev).

**Enable:**

```ts
use: { trace: 'on-first-retry' }        // CI best practice
// options: 'off' | 'on' | 'retain-on-failure' | 'on-first-retry' | 'on-all-retries'
```

```bash
npx playwright test --trace on        # force for a run
npx playwright show-trace trace.zip   # open a trace
npx playwright show-report            # traces are linked in HTML report
```

**What it contains:** Actions timeline, DOM snapshots (before/action/after), call params, action logs, errors, console messages, network requests/responses, metadata (browser, viewport), attachments.

**Interview angle:** *How do you debug a failure on CI?* — Turn on `trace: 'on-first-retry'` + retries; download the `trace.zip` artifact and open it in the Trace Viewer to see exactly which action/step and network call failed. [Trace Viewer](https://playwright.dev/docs/trace-viewer)

---
