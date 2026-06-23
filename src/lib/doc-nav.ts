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
export const navLinks: { text: string; path: string }[] = [
  { text: "开发规范", path: "/standard/naming-specification" },
  { text: "代码优化", path: "/optimization/code" },
  { text: "学习指南", path: "/learn/method" },
];

/** Find the section label for a given section key. */
export function sectionLabel(key: string): string {
  return SECTION_ORDER.find((s) => s.key === key)?.text ?? key;
}
