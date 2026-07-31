import { describe, expect, it } from "vite-plus/test";
import { absoluteUrl } from "@/lib/site";

describe("site URLs", () => {
  it("uses the request origin when the site URL is not configured", () => {
    expect(absoluteUrl("/sitemap.xml", "https://web-docs.nedink.cn/robots.txt")).toBe(
      "https://web-docs.nedink.cn/sitemap.xml",
    );
  });
});
