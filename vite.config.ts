import { defineConfig } from "vite-plus";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

import { markdownPlugin } from "./plugins/markdown";

// The Cloudflare plugin wires the app into the Workers (workerd) runtime for
// dev/build/deploy. It's incompatible with the jsdom test environment, so it's
// excluded under the test runner (`vp test` sets VITEST=true).
const isTest = process.env.VITEST === "true";

const config = defineConfig({
  fmt: {
    // Skip generated route tree and the source docs (their code fences carry
    // `[!code ++]`/`[!code --]` diff markers that a formatter would mangle).
    ignorePatterns: ["**/routeTree.gen.ts", "docs/**"],
  },
  lint: {
    ignorePatterns: ["**/routeTree.gen.ts", "docs/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
  },
  // Run on staged files before each commit (see `vp staged` + `.vite-hooks/`).
  staged: {
    "*.{js,jsx,ts,tsx,mjs,cjs,json,jsonc,css,html}": "vp format --write",
    "*.{js,jsx,ts,tsx,mjs,cjs}": "vp lint --fix",
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    markdownPlugin(),
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    ...(isTest ? [] : [cloudflare({ viteEnvironment: { name: "ssr" } })]),
  ],
});

export default config;
