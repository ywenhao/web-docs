import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

describe("layout performance", () => {
  it("does not statically import the full-text search modal into the app shell", () => {
    const source = readFileSync("src/components/default-layout.tsx", "utf8");

    expect(source).not.toContain('from "@/components/search"');
  });

  it("does not load the full documentation registry from the header", () => {
    const source = readFileSync("src/components/header.tsx", "utf8");

    expect(source).not.toContain('from "@/lib/docs"');
  });

  it("does not statically import the full documentation registry from the splat route", () => {
    const source = readFileSync("src/routes/$.tsx", "utf8");

    expect(source).not.toContain('from "@/lib/docs"');
  });
});
