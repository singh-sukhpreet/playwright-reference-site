# Playwright Interview Revision Guide

Self-hosted, cross-linked revision reference for a Playwright automation/SDET interview.
Built with [VitePress](https://vitepress.dev) and deployed to GitHub Pages.

**Live site:** <https://singh-sukhpreet.github.io/playwright-reference-site/>

## Prerequisites

- Node.js 20+
- npm

## Getting started

```bash
npm install
npm run docs:dev      # local dev server at http://localhost:5173
```

## Important steps

### 1. Install dependencies

```bash
npm ci                # clean install from lockfile
```

### 2. Run the source splitter (only for regenerating the docs)

The guide content is split from the source notes file into per-topic pages under
`docs/guide/`. The generated output (including `docs/.vitepress/sections.json`) is
committed, so the splitter is only needed when the source notes change.

```bash
SOURCE_PATH=/path/to/PLAYWRIGHT_INTERVIEW_REVISION.md npm run split
```

`SOURCE_PATH` defaults to `~/learning/PLAYWRIGHT_INTERVIEW_REVISION.md`.

### 3. Run tests

```bash
npm test
```

### 4. Build the static site

```bash
npm run docs:build    # outputs to docs/.vitepress/dist
```

For GitHub Pages project hosting, build with the repo's base path so assets resolve
under the project URL:

```bash
BASE=/playwright-reference-site/ npm run docs:build
```

### 5. Check links

```bash
npm run link-check    # crawls docs/.vitepress/dist for broken links/fragments
```

### 6. Preview the production build locally

```bash
npm run preview
```

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` deploys on push to `main` (or manual dispatch):

1. `npm ci`
2. `npm test`
3. `npm run docs:build` + `npm run link-check` (no `BASE`, for link resolution)
4. `npm run docs:build` with `BASE=/{repo}/` for the Pages artifact
5. `actions/configure-pages` + `actions/upload-pages-artifact` + `actions/deploy-pages`

Enable Pages in repo Settings → Pages → **Source: GitHub Actions**. The `BASE`
environment variable is what keeps VitePress asset paths correct for a project page.

## Project structure

```
docs/.vitepress/          VitePress config, theme, cross-ref plugin, generated sections.json
docs/guide/*.md           Per-topic revision pages (generated + committed)
docs/index.md             Home page
scripts/split-source.ts   Splits the source notes into docs/guide pages
tests/                    Unit tests for slugify/linkify helpers
.github/workflows/deploy.yml  Pages deployment pipeline
```
