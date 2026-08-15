---
title: 16. Dialogs
---

# 16. Dialogs


**What it is:**
`alert()`, `confirm()`, `prompt()`, `beforeunload`. **By default Playwright auto-dismisses dialogs** — you don't have to handle them.

```ts
// To accept/act on them, register a handler BEFORE the action that triggers it:
page.on('dialog', dialog => dialog.accept());       // or dialog.dismiss() / dialog.message()
await page.getByRole('button', { name: 'Delete' }).click();
```

**Remember:**
- A `dialog` listener **must handle** the dialog — otherwise the action stalls forever (dialogs block page JS).
- If no listener exists, dialogs are auto-dismissed.

```ts
// prompt example: provide a value
page.on('dialog', async dialog => {
  await dialog.accept('my value');
});
```

---
