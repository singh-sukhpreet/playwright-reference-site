import { defineConfig } from "vitepress";
import { codeOkFailPlugin, crossrefPlugin, type TermRef } from "./theme/crossref-plugin";
import sectionsJson from "./sections.json";
import { manualAliases } from "./terms";

interface SectionMeta {
  n: number | null;
  title: string;
  clean: string;
  file: string;
  slug: string;
  children: { title: string; slug: string }[];
}

const sections = sectionsJson as SectionMeta[];

const terms: TermRef[] = sections.map((s) => ({
  id: s.clean,
  aliases: [s.clean, ...(manualAliases[s.title] ?? [])],
  file: s.file,
  slug: s.slug,
}));

const base = process.env.BASE ?? "/";

export default defineConfig({
  lang: "en",
  title: "Playwright Interview Revision Guide",
  description: "One-shot revision for a Playwright automation/SDET interview.",
  base,
  markdown: {
    config(md) {
      md.use(crossrefPlugin(terms, ["29-important-comparisons.md", "30-interview-questions.md"]));
      md.use(codeOkFailPlugin);
    },
  },
  themeConfig: {
    siteTitle: "Playwright Interview Guide",
    search: {
      provider: "local",
      options: {
        detailedView: true,
      },
    },
    sidebar: [
      { text: "Home", link: "/" },
      {
        text: "Guide",
        collapsed: false,
        items: sections.map((s) => {
          const item: { text: string; link?: string; items?: { text: string; link: string }[] } = {
            text: s.title,
            link: `/guide/${s.file.replace(/\.md$/, "")}`,
          };
          if (s.children.length) {
            item.items = s.children.map((c) => ({
              text: c.title,
              link: `/guide/${s.file.replace(/\.md$/, "")}#${c.slug}`,
            }));
          }
          return item;
        }),
      },
    ],
  },
});
