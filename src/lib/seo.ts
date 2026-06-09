/**
 * Build a consistent set of `<meta>` tags for a route's `head()`.
 *
 * Usage in a route:
 *
 *   export const Route = createFileRoute("/about")({
 *     head: () => ({ meta: seo({ title: "About", description: "..." }) }),
 *   });
 */
import type { SeoInput } from "#/seo";

export type { SeoInput };

export function seo({ title, description, url, image, keywords, type = "website" }: SeoInput) {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },

    // OpenGraph
    { property: "og:type", content: type },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },

    // Twitter
    {
      name: "twitter:card",
      content: image ? "summary_large_image" : "summary",
    },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  // Drop tags whose value is undefined so we don't emit empty attributes.
  return tags.filter((tag) => {
    const value = "title" in tag ? tag.title : tag.content;
    return value !== undefined && value !== "";
  });
}
