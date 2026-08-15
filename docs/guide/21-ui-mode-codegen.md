---
title: 21. UI Mode & Codegen
---

# 21. UI Mode & Codegen


**UI Mode** (`npx playwright test --ui`): interactive watch mode — run single tests, filter, step through with a time-travel timeline, inspect locators and DOM snapshots, edit config. Traces each test automatically.

**Codegen / Test Generator** (`npx playwright codegen <url>`): records your interactions and generates test code + resilient locators (prioritizing role/text/testid). Also lets you **pick a locator** for an element and copy it.

```bash
npx playwright codegen playwright.dev
npx playwright codegen --target=python https://example.com   # other languages
```

**Remember:** Codegen-generated locators are a starting point — review and simplify. UI Mode does not run the `setup` project by default (auth) — run `auth.setup.ts` manually when sessions expire.

---
