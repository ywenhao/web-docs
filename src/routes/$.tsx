import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocPage } from "@/components/doc-page";
import { seo } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * Catch-all documentation route. Resolves paths like `/standard/commit` against
 * the doc registry (`@/lib/docs`). Unknown paths 404.
 */
export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const { getDoc } = await import("@/lib/docs");
    const doc = getDoc(`/${params._splat ?? ""}`);
    if (!doc) throw notFound();
    return {
      path: doc.path,
      title: doc.title,
      html: doc.module.html,
      toc: doc.module.toc,
      section: doc.section,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: seo({
        title: `${loaderData.title} | ${siteConfig.name}`,
        description: siteConfig.description,
        url: absoluteUrl(loaderData.path),
        type: "article",
      }),
      links: [{ rel: "canonical", href: absoluteUrl(loaderData.path) }],
    };
  },
  component: DocRoute,
});

function DocRoute() {
  const { title, html, toc } = Route.useLoaderData();
  return <DocPage title={title} html={html} toc={toc} />;
}
