---
title: 31. Core API Cheat Sheet
---

# 31. Core API Cheat Sheet


**Browser / Context / Page**
```ts
chromium.launch()            browser.newContext()       context.newPage()
browser.close()              context.close()            page.close()
context.storageState({path}) page.goto()                page.evaluate()
context.request / page.request
```

**Locators**
```ts
page.getByRole()      page.getByLabel()     page.getByPlaceholder()
page.getByText()      page.getByAltText()   page.getByTitle()
page.getByTestId()    page.locator()        page.frameLocator()
locator.filter({hasText|hasNotText|has|hasNot})
locator.and() / or()  locator.first() / last() / nth() / count() / all()
```

**Actions**
```ts
click()  dblclick()  hover()  fill()  clear()  press()  pressSequentially()
check()  uncheck()   setChecked()  selectOption()  focus()  blur()
setInputFiles()  dragTo()  scrollIntoViewIfNeeded()  dispatchEvent()  tap()
```

**Waits & Events**
```ts
page.waitForURL()      page.waitForResponse()   page.waitForRequest()
page.waitForEvent('download' | 'popup' | 'filechooser')
page.on('request' | 'response' | 'dialog' | 'console' | 'download' | 'websocket')
```

**Assertions (auto-retrying)**
```ts
expect(locator).toBeVisible()        toBeHidden()  toBeAttached()
toBeEnabled()  toBeDisabled()  toBeEditable()  toBeChecked()  toBeFocused()
toHaveText()   toContainText()  toHaveValue()  toHaveValues()
toHaveAttribute()  toHaveClass()  toHaveCount()  toHaveScreenshot()
expect(page).toHaveURL()  toHaveTitle()  toHaveScreenshot()
expect(response).toBeOK()
expect.poll(fn).toBe(x)   expect(fn).toPass()   expect.soft(...)
```

**Network**
```ts
page.route(pattern, handler)      context.route(pattern, handler)
route.fulfill({status, json, body, headers})     route.continue({headers, method})
route.abort()   route.fetch()   route.request()
```

**Config knobs**
```ts
testDir  timeout  expect.timeout  retries  workers  fullyParallel  reporter
projects  webServer  globalSetup/Teardown  forbidOnly  maxFailures
use: { baseURL  trace  video  screenshot  storageState  actionTimeout
       navigationTimeout  viewport  locale  extraHTTPHeaders  httpCredentials  proxy }
```

---
