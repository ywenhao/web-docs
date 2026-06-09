import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/components/home";
import { seo } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: seo({
      title: siteConfig.name,
      description: siteConfig.description,
      url: absoluteUrl("/"),
    }),
  }),
  component: Home,
});
