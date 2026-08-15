import assert from "node:assert/strict";
import { test } from "node:test";
import { cleanHeading, slugify } from "../scripts/lib.ts";

test("slugify matches VitePress output for plain headings", () => {
  assert.equal(slugify("Locators"), "locators");
  assert.equal(slugify("Fixtures"), "fixtures");
  assert.equal(slugify("Playwright Fundamentals"), "playwright-fundamentals");
});

test("slugify prefixes digit-leading slugs with underscore", () => {
  assert.equal(slugify("9. Fixtures"), "_9-fixtures");
  assert.equal(slugify("1. Playwright Fundamentals"), "_1-playwright-fundamentals");
  assert.equal(slugify("10. Configuration"), "_10-configuration");
});

test("slugify handles punctuation and symbols", () => {
  assert.equal(slugify("Browser / Context / Page"), "browser-context-page");
  assert.equal(slugify("CI/CD"), "ci-cd");
  assert.equal(slugify("Installation & Commands"), "installation-commands");
  assert.equal(slugify("Uploads & Downloads"), "uploads-downloads");
  assert.equal(slugify("Screenshots / Videos"), "screenshots-videos");
});

test("slugify keeps emoji prefix (matches VitePress)", () => {
  assert.equal(slugify("🚀 5-Minute Revision"), "🚀-5-minute-revision");
});

test("cleanHeading strips numbering and emoji", () => {
  assert.equal(cleanHeading("1. Playwright Fundamentals"), "Playwright Fundamentals");
  assert.equal(cleanHeading("9. Fixtures"), "Fixtures");
  assert.equal(cleanHeading("🚀 5-Minute Revision"), "5-Minute Revision");
});
