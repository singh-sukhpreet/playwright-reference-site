---
title: 18. Screenshots / Videos
---

# 18. Screenshots / Videos


**Screenshots:**

```ts
await page.screenshot({ path: 'home.png', fullPage: true });
await locator.screenshot({ path: 'element.png' });

// visual regression — snapshots stored as .png next to the test
await expect(page).toHaveScreenshot();
await expect(locator).toHaveScreenshot({ maxDiffPixelRatio: 0.1 });
// update: npx playwright test --update-snapshots
```

**Videos** (config, per context):

```ts
use: { video: 'on' | 'retain-on-failure' | 'on-first-retry' | 'off' }
```

```ts
const context = await browser.newContext({ recordVideo: { dir: 'videos/', size: { width: 640, height: 480 } } });
await context.close();   // video is written on close
await context.videos() ... 
```

**Interview angle:** *Trace vs screenshot vs video?* — Screenshots are cheap single states; videos record real-time session; traces are richest (DOM snapshots, network, console, actions timeline) and best for CI debugging.

---
