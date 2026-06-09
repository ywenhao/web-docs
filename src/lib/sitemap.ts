/**
 * Routes to include in `sitemap.xml`.
 *
 * The home page plus every documentation page from the registry. Add more
 * static routes to `staticEntries` as needed.
 */
import type { SitemapEntry } from "#/sitemap";
import { docs } from "@/lib/docs";

export type { SitemapEntry };

const staticEntries: SitemapEntry[] = [{ path: "/", changeFrequency: "weekly", priority: 1.0 }];

/**
 * Return all sitemap entries: the static list plus every registered doc page.
 * Async so dynamic sources can be added later.
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const docEntries: SitemapEntry[] = Object.keys(docs).map((path) => ({
    path,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticEntries, ...docEntries];
}
