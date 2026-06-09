import { describe, expect, it } from "vite-plus/test";
import { docs, getDoc, sidebar } from "@/lib/docs";

describe("docs registry", () => {
  it("loads documentation pages from the docs directory", () => {
    expect(Object.keys(docs).length).toBeGreaterThan(0);
  });

  it("resolves a known doc by path", () => {
    const doc = getDoc("/standard/commit");
    expect(doc).toBeDefined();
    expect(doc?.section).toBe("standard");
    expect(doc?.module.html).toContain("<");
  });

  it("returns undefined for an unknown path", () => {
    expect(getDoc("/does/not/exist")).toBeUndefined();
  });

  it("builds an ordered sidebar with the expected sections", () => {
    const keys = sidebar.map((s) => s.key);
    expect(keys).toEqual(["standard", "optimization", "learn"]);
    for (const section of sidebar) {
      expect(section.items.length).toBeGreaterThan(0);
    }
  });
});
