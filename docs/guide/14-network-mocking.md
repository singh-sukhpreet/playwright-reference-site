---
title: 14. Network Mocking
---

# 14. Network Mocking


**What it is:**
Intercept, modify, mock or abort requests/responses via `page.route()` / `context.route()` using glob patterns or regex.

```ts
// Mock (fulfill) — never hits the real API
await page.route('**/api/fetch_data', route => route.fulfill({
  status: 200,
  body: JSON.stringify({ data: 'mocked' }),
}));

// Abort
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());

// Modify request (continue with changes)
await page.route('**/*', async route => {
  const headers = route.request().headers();
  delete headers['X-Secret'];
  await route.continue({ headers });
});

// Modify response — fetch the real response then tweak it
await page.route('**/api/users', async route => {
  const response = await route.fetch();          // make the real request
  const json = await response.json();
  json.name = 'Patched';
  await route.fulfill({ response, json });
});
```

**Route API:**
- `route.fulfill()` — return a synthetic response (status, body, json, headers, path).
- `route.continue()` — let it proceed, optionally modifying request.
- `route.abort()` — fail the request (e.g. block trackers/images).
- `route.fetch()` — issue the underlying request to fetch the real response.
- `route.request()` — the intercepted `Request`.

**Glob patterns** (match the whole URL): `*` (not `/`), `**` (any incl. `/`), `{a,b}`, or use a `RegExp`. Example: `'**/*.{png,jpg,jpeg}'`.

**Also useful:**
- `page.waitForRequest()` / `page.waitForResponse()` to await specific traffic.
- `page.on('request' | 'response')` to log traffic.
- `page.on('websocket')` for WebSocket inspection.

**Remember:** set routes on `context` for popup/new tabs; unroute with `page.unroute()`. `page.route` also accepts `Route.fallback` / handler arrays for layered mocking.

**Interview angle:** *route.fulfill vs route.continue?* — fulfill replaces the response (mocking); continue forwards to the network, optionally modified (interception). [Network](https://playwright.dev/docs/network)

---
