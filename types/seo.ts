/**
 * SEO-related shared types.
 *
 * Imported via the `#/*` alias, which maps to `types/*` (see tsconfig `paths`
 * and package.json `imports`). Runtime helpers live in `@/lib/seo`.
 */

export interface SeoInput {
  title: string;
  description?: string;
  /** Canonical, absolute URL for this page. Used by OpenGraph/Twitter. */
  url?: string;
  /** Absolute URL to the social share image. */
  image?: string;
  keywords?: string;
  /** OpenGraph type, e.g. "website" or "article". Defaults to "website". */
  type?: "website" | "article";
}
