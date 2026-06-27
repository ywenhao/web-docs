import { readFileSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";

describe("liquid glass theme", () => {
  it("defines the shared liquid glass surface utilities", () => {
    const source = readFileSync("src/styles.css", "utf8");

    expect(source).toContain(".liquid-shell");
    expect(source).toContain(".glass-surface");
    expect(source).toContain(".glass-control");
  });

  it("applies the liquid shell to the app layout", () => {
    const source = readFileSync("src/components/default-layout.tsx", "utf8");

    expect(source).toContain("liquid-shell");
  });
});
