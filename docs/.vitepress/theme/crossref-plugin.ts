import type MarkdownIt from "markdown-it";
import type StateCore from "markdown-it/lib/rules_core/state_core.mjs";

export interface TermRef {
  id: string;
  aliases: string[];
  file: string;
  slug: string;
}

export interface LinkifyContext {
  terms: TermRef[];
  currentFile: string;
}

interface Match {
  start: number;
  end: number;
  term: TermRef;
}

const wordChar = /[a-z0-9]/;

const basename = (p: string): string => (p.includes("/") ? p.slice(p.lastIndexOf("/") + 1) : p);

function firstValidMatch(textLower: string, from: number, aliasLower: string): { start: number; end: number } | null {
  let idx = textLower.indexOf(aliasLower, from);
  while (idx !== -1) {
    const before = textLower[idx - 1];
    const after = textLower[idx + aliasLower.length];
    if ((!before || !wordChar.test(before)) && (!after || !wordChar.test(after))) {
      return { start: idx, end: idx + aliasLower.length };
    }
    idx = textLower.indexOf(aliasLower, idx + 1);
  }
  return null;
}

export function relativeHref(currentFile: string, targetFile: string): string {
  const dir = currentFile.includes("/") ? currentFile.slice(0, currentFile.lastIndexOf("/")) : "";
  const up = dir ? dir.split("/").map(() => "../").join("") : "";
  return `${up}${targetFile}`;
}

const linkToken = (attrs: [string, string][]): { type: string; tag: string; nesting: number; attrs: [string, string][]; attrIndex: (n: string) => number; attrSet: (n: string, v: string) => void; attrGet: (n: string) => string | null } => ({
  type: "link_open",
  tag: "a",
  nesting: 1,
  attrs,
  attrIndex(name: string) {
    return this.attrs?.findIndex(([k]) => k === name) ?? -1;
  },
  attrGet(name: string) {
    const i = this.attrIndex(name);
    return i === -1 ? null : this.attrs![i][1];
  },
  attrSet(name: string, value: string) {
    const i = this.attrIndex(name);
    if (i === -1) this.attrs?.push([name, value]);
    else this.attrs![i][1] = value;
  },
});

export function targetPath(file: string): string {
  if (file === "index.md" || file.startsWith("guide/")) return file;
  return `guide/${file}`;
}

export function hrefFor(term: TermRef, currentFile: string): string {
  if (basename(term.file) === basename(currentFile)) return `#${term.slug}`;
  return `${relativeHref(currentFile, targetPath(term.file))}#${term.slug}`;
}

export function linkify(children: { type: string; content?: string }[], ctx: LinkifyContext): { type: string; content?: string }[] {
  const active = ctx.terms.filter((t) => basename(t.file) !== basename(ctx.currentFile));
  const aliases: { term: TermRef; aliasLower: string }[] = [];
  for (const t of active) {
    for (const a of t.aliases) {
      const aliasLower = a.toLowerCase();
      if (aliasLower) aliases.push({ term: t, aliasLower });
    }
  }
  aliases.sort((a, b) => b.aliasLower.length - a.aliasLower.length);

  const result: { type: string; content?: string }[] = [];
  const linked = new Set<string>();
  let linkDepth = 0;

  for (const tok of children) {
    if (tok.type === "link_open") {
      linkDepth++;
      result.push(tok);
      continue;
    }
    if (tok.type === "link_close") {
      linkDepth--;
      result.push(tok);
      continue;
    }
    if (tok.type !== "text" || linkDepth > 0 || !tok.content) {
      result.push(tok);
      continue;
    }

    const text = tok.content;
    const textLower = text.toLowerCase();
    let cursor = 0;
    const pieces: { type: string; content?: string }[] = [];
    let changed = false;

    while (cursor < text.length) {
      let best: Match | null = null;
      for (const entry of aliases) {
        if (linked.has(entry.term.id)) continue;
        const m = firstValidMatch(textLower, cursor, entry.aliasLower);
        if (m && (!best || m.start < best.start)) {
          best = { ...m, term: entry.term };
        }
      }
      if (!best) {
        if (changed || cursor > 0) pieces.push({ type: "text", content: text.slice(cursor) });
        break;
      }
      if (best.start > cursor) {
        pieces.push({ type: "text", content: text.slice(cursor, best.start) });
      }
      pieces.push(
        linkToken([["href", hrefFor(best.term, ctx.currentFile)]]),
        { type: "text", content: text.slice(best.start, best.end) },
        { type: "link_close", tag: "a", nesting: -1 },
      );
      linked.add(best.term.id);
      changed = true;
      cursor = best.end;
    }

    if (pieces.length) {
      result.push(...pieces);
    } else {
      result.push(tok);
    }
  }

  return result;
}

export function crossrefPlugin(terms: TermRef[], skipFiles: string[] = []): (md: MarkdownIt) => void {
  return (md: MarkdownIt) => {
    md.core.ruler.push("crossref", (state: StateCore) => {
      const env = state.env as { relativePath?: string; path?: string; filePath?: string };
      const currentFile = env.relativePath ?? env.path ?? env.filePath ?? "";
      if (skipFiles.includes(basename(currentFile))) return;
      const ctx: LinkifyContext = { terms, currentFile };
      for (let i = 0; i < state.tokens.length; i++) {
        const tok = state.tokens[i];
        if (tok.type !== "inline") continue;
        if (state.tokens[i - 1]?.type === "heading_open") continue;
        if (!tok.children || tok.children.length === 0) continue;
        const newChildren = linkify(tok.children, ctx);
        if (newChildren !== tok.children) {
          tok.children = newChildren;
        }
      }
    });
  };
}

const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function codeOkFailPlugin(md: MarkdownIt): void {
  const defaultCodeInline = md.renderer.rules.code_inline;
  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const content = tokens[idx].content;
    const cls = content.startsWith("❌") ? "okfail bad" : content.startsWith("✅") ? "okfail good" : "";
    const attrs = self.renderAttrs(tokens[idx]);
    const body = escapeHtml(content);
    if (defaultCodeInline && !cls) return defaultCodeInline(tokens, idx, options, env, self);
    return `<code${cls ? ` class="${cls}"` : ""}${attrs}>${body}</code>`;
  };

  const defaultFence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const html = (defaultFence ?? self.renderToken)(tokens, idx, options, env, self);
    const parts = html.split('<span class="line">');
    if (parts.length <= 1) return html;
    let out = parts[0];
    for (let i = 1; i < parts.length; i++) {
      const seg = parts[i];
      const cls = seg.includes("❌") ? "line okfail bad" : seg.includes("✅") ? "line okfail good" : "line";
      out += `<span class="${cls}">${seg}`;
    }
    return out;
  };
}
