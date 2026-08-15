import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cleanHeading, slugify, type Section } from "./lib.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SOURCE = process.env.SOURCE_PATH ?? join(process.env.HOME!, "learning", "PLAYWRIGHT_INTERVIEW_REVISION.md");
const DOCS = join(ROOT, "docs");
const GUIDE = join(DOCS, "guide");
const VITEPRESS = join(DOCS, ".vitepress");

interface RawSection {
  title: string;
  lines: string[];
}

interface SplitResult {
  preamble: string[];
  sections: RawSection[];
}

function splitSections(source: string): SplitResult {
  const lines = source.split("\n");
  const sections: RawSection[] = [];
  const preamble: string[] = [];
  let current: RawSection | null = null;
  let fence = false;

  for (const line of lines) {
    if (/^```/.test(line)) {
      fence = !fence;
    }
    const isHeading = !fence && /^## /.test(line);
    if (isHeading) {
      current = { title: line.replace(/^## /, ""), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    } else if (line.trim() && !line.startsWith("**#")) {
      preamble.push(line);
    }
  }
  return { preamble, sections };
}

const pad = (n: number) => String(n).padStart(2, "0");

function buildSection(raw: RawSection, index: number): Section {
  const n = index; // 1-based
  const clean = cleanHeading(raw.title);
  const file = `${pad(n)}-${slugify(clean)}.md`;
  const slug = slugify(raw.title);
  const children: { title: string; slug: string }[] = [];
  let fence = false;
  for (const line of raw.lines) {
    if (/^```/.test(line)) {
      fence = !fence;
    }
    if (!fence && /^### /.test(line)) {
      const title = line.replace(/^### /, "");
      children.push({ title, slug: slugify(title) });
    }
  }
  return { n, title: raw.title, clean, file, slug, children, body: raw.lines };
}

async function main() {
  const source = await readFile(SOURCE, "utf8");
  const { preamble, sections: raw } = splitSections(source);

  const landing = raw.find((s) => s.title.includes("5-Minute Revision"));
  const numbered = raw.filter((s) => /^\d+\.\s/.test(s.title));
  if (!landing) throw new Error("5-Minute Revision section not found");
  if (numbered.length !== 32) throw new Error(`expected 32 numbered sections, got ${numbered.length}`);

  const sections: Section[] = numbered.map((raw, i) => buildSection(raw, i + 1));

  await mkdir(GUIDE, { recursive: true });
  await mkdir(VITEPRESS, { recursive: true });

  for (const sec of sections) {
    const body = sec.body.join("\n").trimEnd();
    const page = [
      "---",
      `title: ${sec.title}`,
      "---",
      "",
      `# ${sec.title}`,
      "",
      body,
      "",
    ].join("\n");
    await writeFile(join(GUIDE, sec.file), page);
  }

  const landingBody = landing.lines.join("\n").trimEnd().replace(/\n---\s*$/, "");
  const intro = preamble.join("\n").trim();
  const explore = [
    "## Guide Sections",
    "",
    ...sections.map((s) => `- [${s.title}](guide/${s.file})`),
  ].join("\n");
  const indexPage = [
    "---",
    "title: Playwright Interview Revision Guide",
    "---",
    "",
    "# Playwright Interview Revision Guide",
    "",
    intro,
    "",
    landingBody,
    "",
    explore,
    "",
  ].join("\n");
  await writeFile(join(DOCS, "index.md"), indexPage);

  await writeFile(join(VITEPRESS, "sections.json"), JSON.stringify(sections, null, 2));

  console.log(`Wrote ${sections.length} guide pages + index.md + sections.json`);
  console.log(sections.map((s) => `${s.file}  <--  ${s.title}`).join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
