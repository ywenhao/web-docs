/**
 * Sitemap-related shared types.
 *
 * Imported via the `#/*` alias, which maps to `types/*`. The entry registry and
 * `getSitemapEntries()` helper live in `@/lib/sitemap`.
 */

export interface SitemapEntry {
  /** Path relative to the site root, starting with "/". */
  path: string;
  /** ISO date string for <lastmod>. Optional. */
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** 0.0 - 1.0 */
  priority?: number;
}
