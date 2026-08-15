import assert from "node:assert/strict";
import MarkdownIt from "markdown-it";
import { test } from "node:test";
import { codeOkFailPlugin, crossrefPlugin, hrefFor, linkify, relativeHref, type TermRef } from "../docs/.vitepress/theme/crossref-plugin.ts";

const terms: TermRef[] = [
  { id: "Browser / Context / Page", aliases: ["browser context", "browsercontext"], file: "08-browser-context-page.md", slug: "_8-browser-context-page" },
  { id: "Locators", aliases: ["locators", "locator"], file: "04-locators.md", slug: "_4-locators" },
  { id: "Fixtures", aliases: ["fixtures", "fixture"], file: "09-fixtures.md", slug: "_9-fixtures" },
  { id: "Fake", aliases: ["fixture factory"], file: "99-fake.md", slug: "_99-fake" },
];

const T = (type: string, content?: string) => ({ type, content });

test("links each distinct term once, longest-first", () => {
  const ctx = { terms, currentFile: "guide/03-test-structure-hooks.md" };
  const out = linkify([T("text", "Browser Context and Browser and fixtures")], ctx);
  const links = out.filter((t) => t.type === "link_open");
  assert.equal(links.length, 2);
  assert.equal(links[0].attrs[0][1], "../guide/08-browser-context-page.md#_8-browser-context-page");
  assert.equal(links[1].attrs[0][1], "../guide/09-fixtures.md#_9-fixtures");
});

test("longest alias wins over substring alias", () => {
  const ctx = { terms, currentFile: "guide/03-test-structure-hooks.md" };
  const out = linkify([T("text", "fixture factory")], ctx);
  const links = out.filter((t) => t.type === "link_open");
  assert.equal(links.length, 1);
  assert.equal(links[0].attrs[0][1], "../guide/99-fake.md#_99-fake");
});

test("does not link a term on its own page", () => {
  const ctx = { terms, currentFile: "guide/04-locators.md" };
  const out = linkify([T("text", "Locators use fixtures")], ctx);
  const links = out.filter((t) => t.type === "link_open");
  assert.equal(links.length, 1);
  assert.equal(links[0].attrs[0][1], "../guide/09-fixtures.md#_9-fixtures");
});

test("skips content inside existing links", () => {
  const ctx = { terms, currentFile: "guide/03-test-structure-hooks.md" };
  const out = linkify([T("link_open"), T("text", "fixtures"), T("link_close"), T("text", " and fixtures")], ctx);
  const links = out.filter((t) => t.type === "link_open");
  assert.equal(links.length, 2);
  assert.equal(links[1].attrs[0][1], "../guide/09-fixtures.md#_9-fixtures");
});

test("skips inline code", () => {
  const ctx = { terms, currentFile: "guide/03-test-structure-hooks.md" };
  const out = linkify([T("code_inline", "locator"), T("text", " locator")], ctx);
  const links = out.filter((t) => t.type === "link_open");
  assert.equal(links.length, 1);
});

test("respects word boundaries (no partial words)", () => {
  const ctx = { terms, currentFile: "guide/03-test-structure-hooks.md" };
  const out = linkify([T("text", "locators not locatorsabc")], ctx);
  const links = out.filter((t) => t.type === "link_open");
  assert.equal(links.length, 1);
  assert.equal(links[0].attrs[0][1], "../guide/04-locators.md#_4-locators");
});

test("links text tokens nested inside strong/em", () => {
  const ctx = { terms, currentFile: "guide/03-test-structure-hooks.md" };
  const out = linkify([T("text", "use "), T("strong_open"), T("text", "fixtures"), T("strong_close"), T("text", " here")], ctx);
  const links = out.filter((t) => t.type === "link_open");
  assert.equal(links.length, 1);
});

test("preserves original casing in link text", () => {
  const ctx = { terms, currentFile: "guide/03-test-structure-hooks.md" };
  const out = linkify([T("text", "browser CONtext here")], ctx);
  const text = out.filter((t) => t.type === "text").map((t) => t.content).join("");
  assert.match(text, /browser CONtext/);
});

test("plugin does not link headings or code fences", () => {
  const md = new MarkdownIt();
  md.use(crossrefPlugin(terms));
  const html = md.render("# Locators\n\n```ts\nfixtures\n```\n\n`locators` and locators");
  assert.ok(!/<h1[^>]*><a/.test(html), "heading should not be linked");
  assert.ok(/<code>locators<\/code>/.test(html), "inline code untouched");
  const linked = html.match(/href="[^"]*#_4-locators"/g) ?? [];
  assert.equal(linked.length, 1);
  const fence = html.match(/<pre><code[^>]*>fixtures[\s\S]*?<\/code><\/pre>/);
  assert.ok(fence, "code fence content untouched");
});

test("plugin skips whole files in skip list", () => {
  const md = new MarkdownIt();
  md.use(crossrefPlugin(terms, ["29-important-comparisons.md"]));
  const html = md.render("fixtures everywhere", { path: "guide/29-important-comparisons.md" });
  assert.ok(!html.includes("<a"), "no links injected on skipped page");
});

test("plugin links first paragraph occurrence", () => {
  const md = new MarkdownIt();
  md.use(crossrefPlugin(terms));
  const html = md.render("fixtures everywhere. more fixtures.");
  const links = html.match(/href="[^"]*#_9-fixtures"/g) ?? [];
  assert.equal(links.length, 1);
});

test("codeOkFailPlugin adds okfail classes", () => {
  const md = new MarkdownIt();
  md.use(codeOkFailPlugin);
  const html = md.render("`❌ bad` `✅ good` `plain`");
  assert.ok(html.includes('class="okfail bad"'));
  assert.ok(html.includes('class="okfail good"'));
  assert.ok(!/<code[^>]*class="okfail[^>]*>plain/.test(html));
});

test("codeOkFailPlugin tints fence lines containing ok/fail markers", () => {
  const md = new MarkdownIt();
  md.renderer.rules.fence = (_tokens, idx) =>
    _tokens[idx].content.split("\n").filter((l) => l).map((l) => `<span class="line">${l}</span>`).join("\n");
  md.use(codeOkFailPlugin);
  const html = md.render("```ts\n// ❌ bad pattern\nconst x = 1;\n// ✅ good pattern\n```");
  assert.ok(/<span class="line okfail bad">/.test(html), "bad line tinted");
  assert.ok(/<span class="line okfail good">/.test(html), "good line tinted");
  assert.ok(/<span class="line">const x = 1;<\/span>/.test(html), "neutral line untouched");
});

test("relativeHref computes cross-directory paths", () => {
  assert.equal(relativeHref("index.md", "guide/04-locators.md"), "guide/04-locators.md");
  assert.equal(relativeHref("guide/03-test-structure-hooks.md", "guide/04-locators.md"), "../guide/04-locators.md");
  assert.equal(relativeHref("guide/03-test-structure-hooks.md", "index.md"), "../index.md");
});

test("hrefFor prefixes target directory", () => {
  const t = { id: "Assertions", aliases: [], file: "06-assertions.md", slug: "_6-assertions" };
  assert.equal(hrefFor(t, "guide/01-playwright-fundamentals.md"), "../guide/06-assertions.md#_6-assertions");
  assert.equal(hrefFor(t, "index.md"), "guide/06-assertions.md#_6-assertions");
});
