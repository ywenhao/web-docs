/** Section metadata: display label + explicit item order (mirrors VitePress). */
export const SECTION_ORDER: { key: string; text: string; order: string[] }[] = [
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

/** Top nav links — first item of each section, mirroring the old VitePress nav. */
export const navLinks: { key: string; text: string; path: string }[] = [
  { key: "standard", text: "开发规范", path: "/standard/naming-specification" },
  { key: "optimization", text: "代码优化", path: "/optimization/code" },
  { key: "learn", text: "学习指南", path: "/learn/method" },
];

/** Resolve the active top-nav section from a route pathname. */
export function activeNavKeyFromPath(pathname: string): string | undefined {
  const section = pathname.split("/").filter(Boolean)[0];
  return SECTION_ORDER.some((item) => item.key === section) ? section : undefined;
}

/** Find the section label for a given section key. */
export function sectionLabel(key: string): string {
  return SECTION_ORDER.find((s) => s.key === key)?.text ?? key;
}
