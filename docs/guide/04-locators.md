---
title: 4. Locators
---

# 4. Locators


**What it is:**
Locators represent a way to find element(s) at any moment. They are the central piece of auto-waiting and retry-ability. A locator is **lazy** — it re-queries the DOM on each use, so it always acts on the current element.

**Recommended built-in locators (priority order):**
1. `getByRole()` — by ARIA role + accessible name (user-facing) — **preferred**
2. `getByLabel()` — form control by associated label
3. `getByPlaceholder()` — input by placeholder
4. `getByText()` — by text content (use for non-interactive elements)
5. `getByAltText()` — images by alt text
6. `getByTitle()` — by title attribute
7. `getByTestId()` — explicit testing contract (`data-testid`, configurable)
8. `locator('css=...')` / `locator('xpath=...')` — only when necessary

```ts
await page.getByRole('button', { name: 'Sign in' }).click();
await page.getByLabel('Password').fill('secret');
await page.getByPlaceholder('name@example.com').fill('a@b.com');
await expect(page.getByText('Welcome, John', { exact: true })).toBeVisible();
await page.getByAltText('playwright logo').click();
await page.getByTitle('Issues count').toHaveText('25 issues');
await page.getByTestId('directions').click();
```

**Chaining & filtering (lists):**

```ts
const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });
await product.getByRole('button', { name: 'Add to cart' }).click();

await page.getByRole('listitem')
  .filter({ has: page.getByRole('heading', { name: 'Product 2' }) })
  .getByRole('button', { name: 'Add' }).click();

await page.getByRole('listitem').filter({ hasNotText: 'Out of stock' }); // count
await page.getByRole('button').and(page.getByTitle('Subscribe'));        // both
await page.getByRole('button').or(page.getByText('Confirm settings'));   // either
await page.getByRole('listitem').first() / .last() / .nth(1);            // positional
await page.getByRole('listitem').count();
await page.getByRole('listitem').all();                                  // array
```

**getByRole — explicit vs implicit role:**
- **Implicit**: role auto-derived from the element, e.g. `<button>Submit</button>` has role `button`.
- **Explicit**: ARIA-annotated, e.g. `<div role="button">Submit</div>` also matches `getByRole('button', ...)`.
- Role locators follow W3C ARIA/accessible-name specs and reflect how users & assistive tech perceive the page.

```html
<button>Submit</button>
<div role="button">Submit</div>
```

```ts
await page.getByRole('button', { name: 'Submit' }).click();
```

**Strictness:**
- Locators are **strict**: any action on a locator resolving to >1 element throws "strict mode violation".
- `first()/last()/nth()` opt out but are discouraged — prefer unique locators.
- `count()` and `all()` intentionally work with multiple elements.

**Remember:**
- Matching by text normalizes whitespace (even with `exact: true`).
- All locator-creation methods also exist on `Locator` and `FrameLocator`, so they chain.
- Shadow DOM is pierced by default (except XPath; closed roots unsupported).
- Text locators are for non-interactive elements (`div`, `span`, `p`); use role locators for interactive ones.
- Set custom test-id attribute: `use: { testIdAttribute: 'data-pw' }`.

**Interview angle:** *Why prefer getByRole over CSS/XPath?* — Closer to how users perceive the UI, resilient to class/DOM changes, and gives early ARIA feedback. [Locators](https://playwright.dev/docs/locators)

---
