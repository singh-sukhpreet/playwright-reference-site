---
title: 8. Browser / Context / Page
---

# 8. Browser / Context / Page


**What it is:**
- **Browser** — a launched browser instance (e.g. `chromium.launch()`). Heavy; reused across tests.
- **BrowserContext** — an isolated incognito-like session (own cookies, storage, cache). Equivalent to a fresh browser profile. Cheap to create.
- **Page** — a tab within a context. Most interactions happen here.

```
Browser
 └── BrowserContext  (isolated)
      └── Page       (tab)
```

```ts
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://example.com');
await context.close();
await browser.close();
```

**Emulation** (per context): viewport, device (`devices['iPhone 13']`), locale, timezone, permissions, geolocation, color scheme, `storageState`, HTTP credentials, proxy.

```ts
const context = await browser.newContext({
  viewport: { width: 375, height: 812 },
  locale: 'fr-FR',
  storageState: 'state.json',
});
```

**Key page APIs:**
```ts
page.goto()  page.goBack()  page.goForward()
page.reload()  page.close()
page.url()  page.title()
page.screenshot()  page.emulateMedia()
page.waitForURL()  page.waitForResponse()  page.waitForEvent()
page.on('request'|'response'|'console'|'dialog'|'download'|'popup')
page.route()  page.unroute()
page.evaluate()  page.addInitScript()
page.frame()  page.frameLocator()
page.keyboard  page.mouse  page.touchscreen
page.request  context.request   // APIRequestContext sharing cookies
```

**Remember:**
- The test runner gives you `browser`, `context`, `page` fixtures — you rarely manage them manually.
- Multi-context tests enable admin/user scenarios in one test.

---
