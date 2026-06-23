/**
 * Documentation registry.
 *
 * Eagerly imports every `docs/**\/*.md` (compiled by `plugins/markdown.ts`) and
 * builds the lookup table, sidebar structure, and search index the UI needs.
 *
 * The sidebar order and labels mirror the original VitePress config so the site
 * structure and URLs are preserved across the migration.
 */
import type { DocEntry, MarkdownModule, SearchDoc, SidebarSection } from "#/docs";
import { SECTION_ORDER } from "@/lib/doc-nav";

// Vite inlines all matching markdown modules at build time.
const modules = import.meta.glob<MarkdownModule>("../../docs/**/*.md", {
  eager: true,
  import: "default",
});

/** Map a glob key like "../../docs/standard/commit.md" → "/standard/commit". */
function keyToPath(key: string): string {
  return key.replace(/^.*\/docs/, "").replace(/\.md$/, "");
}

function pathToSection(path: string): string {
  return path.split("/").filter(Boolean)[0] ?? "";
}

/** path → DocEntry, the canonical lookup used by the splat route. */
export const docs: Record<string, DocEntry> = {};

for (const [key, mod] of Object.entries(modules)) {
  const path = keyToPath(key);
  const section = pathToSection(path);
  docs[path] = { path, section, title: mod.title, module: mod };
}

/** Build the ordered sidebar from the registry, honoring SECTION_ORDER. */
export const sidebar: SidebarSection[] = SECTION_ORDER.map((section) => {
  const known = section.order.filter((p) => docs[p]);
  // Append any docs in this section not explicitly ordered (alphabetical).
  const extras = Object.keys(docs)
    .filter((p) => pathToSection(p) === section.key && !section.order.includes(p))
    .sort();
  const paths = [...known, ...extras];

  return {
    key: section.key,
    text: section.text,
    items: paths.map((p) => ({ text: docs[p].title, path: p })),
  };
});

/** Flattened search index (plain-text bodies, built once at module load). */
export const searchIndex: SearchDoc[] = Object.values(docs).map((d) => ({
  path: d.path,
  title: d.title,
  section: d.section,
  content: d.module.plain,
}));

/** Resolve a doc by route path (with or without leading slash). */
export function getDoc(path: string): DocEntry | undefined {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return docs[normalized];
}
