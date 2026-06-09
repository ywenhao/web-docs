/**
 * Central place for site-wide constants used by SEO, sitemap, and robots.
 *
 * `VITE_SITE_URL` should be set per environment (see `.env.example`). It must
 * be the absolute origin with no trailing slash, e.g. https://example.com.
 */

function normalizeOrigin(value: string | undefined): string {
  const fallback = "http://localhost:3000";
  const raw = value?.trim() || fallback;
  return raw.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "前端开发指南",
  description: "Vue3 的前端开发指南，涵盖开发规范、代码优化与学习方法。",
  /** Absolute origin, no trailing slash. */
  url: normalizeOrigin(import.meta.env.VITE_SITE_URL),
  locale: "zh-CN",
} as const;

/** Join a path onto the site origin, yielding an absolute URL. */
export function absoluteUrl(path = "/"): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${suffix}`;
}
