import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/site";
import { getSitemapEntries } from "@/lib/sitemap";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = await getSitemapEntries();

        const urls = entries
          .map((entry) => {
            const parts = [`    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>`];
            if (entry.lastModified) {
              parts.push(`    <lastmod>${escapeXml(entry.lastModified)}</lastmod>`);
            }
            if (entry.changeFrequency) {
              parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
            }
            if (entry.priority !== undefined) {
              parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
            }
            return `  <url>\n${parts.join("\n")}\n  </url>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
