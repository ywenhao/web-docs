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

/** Section metadata: display label + explicit item order (mirrors VitePress). */
const SECTION_ORDER: { key: string; text: string; order: string[] }[] = [
  {
    key: "standard",
    text: "开发规范",
    order: [
      "/standard/naming-specification",
      "/standard/commit",
      "/standard/vue3",
      "/standard/package",
      "/standard/idea",
      "/standard/project",
    ],
  },
  {
    key: "optimization",
    text: "代码优化",
    order: [
      "/optimization/code",
      "/optimization/typescript",
      "/optimization/performance",
      "/optimization/vue3",
    ],
  },
  {
    key: "learn",
    text: "学习指南",
    order: ["/learn/method", "/learn/accelerate-skill"],
  },
];

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

/** Top nav links — first item of each section, mirroring the old VitePress nav. */
export const navLinks: { text: string; path: string }[] = [
  { text: "开发规范", path: "/standard/naming-specification" },
  { text: "代码优化", path: "/optimization/code" },
  { text: "学习指南", path: "/learn/method" },
];

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

/** Find the section label for a given section key. */
export function sectionLabel(key: string): string {
  return SECTION_ORDER.find((s) => s.key === key)?.text ?? key;
}
