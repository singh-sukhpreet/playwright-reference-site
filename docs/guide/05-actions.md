---
title: 5. Actions
---

# 5. Actions


**What it is:**
Playwright actions wait for actionability before executing. All run against locators.

```ts
await locator.click();                 // also { button, modifiers, position, force }
await locator.dblclick();
await locator.hover();
await locator.fill('text');            // inputs, textarea, contenteditable (fires input event)
await locator.clear();
await locator.press('Enter');          // key/shortcut, e.g. 'Control+ArrowRight'
await locator.pressSequentially('Hello', { delay: 100 });  // type char by char
await locator.check();                 // checkbox / radio
await locator.uncheck();
await locator.setChecked(true);        // check/uncheck by boolean
await locator.selectOption('blue');    // or { label }, or array for multi
await locator.focus();
await locator.blur();
await locator.setInputFiles('file.pdf');       // also arrays, dirs, or in-memory buffer
await locator.dragTo(target);
await locator.scrollIntoViewIfNeeded();
await locator.dispatchEvent('click');  // programmatic, skips actionability
await locator.tap();                   // touch
```

```ts
// navigation
await page.goto('https://playwright.dev/');            // waits for 'load'
await page.goto('/', { waitUntil: 'networkidle' });
await page.goBack(); await page.goForward();
```

**Remember:**
- `force: true` bypasses non-essential actionability checks (use sparingly).
- `fill()` vs `pressSequentially()`: fill is instant + fires input; pressSequentially simulates real typing (use for keydown/up handling).
- Playwright scrolls elements into view automatically before actions.
- Uploads: `setInputFiles()` on an `<input type="file">`, or handle `page.waitForEvent('filechooser')` for dynamic inputs.

---
