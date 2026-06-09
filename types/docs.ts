/**
 * Doc-related shared types.
 *
 * Imported via the `#/*` alias (→ `types/*`). The doc registry and helpers
 * live in `@/lib/docs`; markdown is compiled to `MarkdownModule` by the
 * `plugins/markdown.ts` Vite transform.
 */

/** A single table-of-contents entry derived from an h2/h3 heading. */
export interface TocItem {
  level: number;
  text: string;
  slug: string;
}

/** The default export of a compiled `.md` module. */
export interface MarkdownModule {
  /** Pre-rendered, Shiki-highlighted HTML. */
  html: string;
  /** Parsed frontmatter. */
  frontmatter: Record<string, unknown>;
  /** Heading-based table of contents (h2/h3). */
  toc: TocItem[];
  /** Plain-text body, used for the search index. */
  plain: string;
  /** Resolved page title (frontmatter → first h1 → filename). */
  title: string;
}

/** A registered documentation page. */
export interface DocEntry {
  /** Route path, e.g. "/standard/commit". */
  path: string;
  /** Section key: "standard" | "optimization" | "learn". */
  section: string;
  /** Display title. */
  title: string;
  /** Compiled markdown module. */
  module: MarkdownModule;
}

/** One nav section in the sidebar. */
export interface SidebarSection {
  /** Display label, e.g. "开发规范". */
  text: string;
  /** Section key matching `DocEntry.section`. */
  key: string;
  items: { text: string; path: string }[];
}

/** A flattened entry for the search index. */
export interface SearchDoc {
  path: string;
  title: string;
  section: string;
  content: string;
}
