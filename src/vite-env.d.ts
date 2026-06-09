/// <reference types="vite/client" />

// Importing a `.md` file yields a compiled module (see `plugins/markdown.ts`).
declare module "*.md" {
  import type { MarkdownModule } from "#/docs";

  const mod: MarkdownModule;
  export default mod;
}
