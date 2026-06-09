/**
 * Build-time Markdown → module transform.
 *
 * Replaces what VitePress did internally: each `.md` file is compiled to a JS
 * module exporting pre-rendered HTML (Shiki-highlighted, with diff markers),
 * its frontmatter, a table of contents, and a plain-text version for search.
 *
 * Importing a markdown file yields a `MarkdownModule` (see `types/docs.ts`):
 *
 *   import doc from "../docs/standard/commit.md";
 *   doc.html; doc.frontmatter; doc.toc; doc.plain;
 *
 * Rendering happens once at build/transform time, so the client ships static
 * HTML strings — no markdown or highlighter runtime in the browser.
 */
import type { Plugin } from "vite-plus";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import removeMd from "remove-markdown";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationFocus,
} from "@shikijs/transformers";
import { fromHighlighter } from "@shikijs/markdown-it/core";
import { createHighlighter } from "shiki";

import type { TocItem } from "../types/docs";

const CODE_THEME = "one-dark-pro";

// Languages used across the docs. Keep in sync with code fences in `docs/`.
const LANGS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "vue",
  "json",
  "jsonc",
  "bash",
  "sh",
  "html",
  "xml",
  "css",
  "scss",
  "md",
  "diff",
  "yaml",
];

let mdPromise: Promise<MarkdownIt> | null = null;

/** Lazily build a single shared markdown-it instance (highlighter is heavy). */
async function getMarkdown(): Promise<MarkdownIt> {
  if (!mdPromise) {
    mdPromise = (async () => {
      const highlighter = await createHighlighter({
        themes: [CODE_THEME],
        langs: LANGS,
      });

      const md = MarkdownIt({ html: true, linkify: true, typographer: false });

      md.use(
        fromHighlighter(highlighter, {
          themes: { light: CODE_THEME, dark: CODE_THEME },
          defaultColor: false,
          transformers: [
            // `// [!code ++]` / `// [!code --]` → diff add/remove lines.
            transformerNotationDiff({ matchAlgorithm: "v3" }),
            transformerNotationHighlight({ matchAlgorithm: "v3" }),
            transformerNotationFocus({ matchAlgorithm: "v3" }),
          ],
        }),
      );

      // Slugged heading anchors so the TOC can deep-link.
      md.use(anchor, {
        slugify,
        permalink: anchor.permalink.linkInsideHeader({ symbol: "#", placement: "before" }),
      });

      return md;
    })();
  }
  return mdPromise;
}

/** GitHub-style slug: keep CJK, drop punctuation, dashes for spaces. */
function slugify(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[\s]+/g, "-")
    .replace(/[^\p{L}\p{N}\-_]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Extract a heading-based TOC (h2/h3) from raw markdown. */
function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  let inFence = false;
  for (const line of content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[#*`]/g, "").trim();
      toc.push({ level, text, slug: slugify(text) });
    }
  }
  return toc;
}

/** Derive a title: explicit frontmatter, else the first H1, else filename. */
function deriveTitle(
  frontmatter: Record<string, unknown>,
  content: string,
  fallback: string,
): string {
  if (typeof frontmatter.title === "string" && frontmatter.title) {
    return frontmatter.title;
  }
  const h1 = /^#\s+(.+?)\s*$/m.exec(content);
  if (h1) return h1[1].replace(/[#*`]/g, "").trim();
  return fallback;
}

async function compileMarkdown(code: string, filePath: string): Promise<string> {
  const { data: frontmatter, content } = matter(code);
  const md = await getMarkdown();
  const html = md.render(content);
  const toc = extractToc(content);
  const plain = removeMd(content).replace(/\s+/g, " ").trim();
  const fallback = filePath.split(/[\\/]/).pop()?.replace(/\.md$/, "") ?? "untitled";
  const title = deriveTitle(frontmatter, content, fallback);

  const payload = { html, frontmatter, toc, plain, title };
  return `export default ${JSON.stringify(payload)};`;
}

export function markdownPlugin(): Plugin {
  return {
    name: "docs-markdown",
    enforce: "pre",
    async transform(code, id) {
      if (!id.endsWith(".md")) return null;
      const js = await compileMarkdown(code, id);
      return { code: js, map: null };
    },
    // Full reload on markdown edits during dev (HTML is rendered at transform
    // time, so there's no meaningful partial HMR boundary).
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith(".md")) {
        ctx.server.ws.send({ type: "full-reload" });
      }
    },
  };
}
