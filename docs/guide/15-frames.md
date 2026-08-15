---
title: 15. Frames
---

# 15. Frames


**What it is:**
Pages contain a main frame; `<iframe>` elements add child frames. Interact inside frames with `frameLocator()`, or grab the `Frame` object via `page.frame()`.

```ts
// Preferred — frameLocator keeps locator semantics (auto-waiting)
await page.frameLocator('.frame-class').getByLabel('User Name').fill('John');
await page.frameLocator('iframe[title="chat"]').getByRole('button', { name: 'Send' }).click();

// Frame object API (page.frame by name or URL)
const frame = page.frame('frame-login');          // by name attribute
const frame2 = page.frame({ url: /.*domain.*/ }); // by URL regex
await frame.fill('#username-input', 'John');
```

**Remember:**
- `frameLocator()` is the recommended approach — chain all locator methods on it.
- Page-level interactions (e.g. `page.click`) operate in the **main frame** only.
- Nested frames: chain `frameLocator()` calls.

---
