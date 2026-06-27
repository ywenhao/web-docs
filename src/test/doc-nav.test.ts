import { describe, expect, it } from "vite-plus/test";
import { activeNavKeyFromPath } from "@/lib/doc-nav";

describe("top navigation state", () => {
  it("resolves the active section from the current pathname", () => {
    expect(activeNavKeyFromPath("/standard/commit")).toBe("standard");
    expect(activeNavKeyFromPath("/optimization/vue3")).toBe("optimization");
    expect(activeNavKeyFromPath("/learn/method")).toBe("learn");
  });

  it("does not mark a docs section active on the home page", () => {
    expect(activeNavKeyFromPath("/")).toBeUndefined();
  });
});
