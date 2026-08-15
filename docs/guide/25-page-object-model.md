---
title: 25. Page Object Model
---

# 25. Page Object Model


**What it is:**
Encapsulate a page's locators and actions in a class. Simplifies authoring and maintenance; selectors live in one place.

```text
pages/
  LoginPage.ts
  DashboardPage.ts
tests/
  login.spec.ts
```

```ts
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }
  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }
}
```

```ts
// tests/login.spec.ts
test('user can sign in', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'pass');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

**Best practice: expose POMs as fixtures** so the instance is created/cleaned per test and typed:

```ts
const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
});
```

**What belongs in a POM:** selectors, page-specific actions, navigation, high-level workflows.
**What stays in the test:** assertions, orchestration, test data.

**Pros:** less duplication, single place for selectors, readable tests. **Cons (overuse):** too many layers/indirection for trivial pages; don't POM-ify everything — keep it proportional.

**Interview angle:** *POM vs direct locators?* — POM centralizes selectors and page behavior so UI changes require one edit; direct locators are simpler but duplicated. Prefer POM for large suites. [POM](https://playwright.dev/docs/pom)

---
