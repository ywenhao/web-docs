# CLAUDE.md

This file guides Claude Code when working in this repository.

**Read [AGENTS.md](AGENTS.md) first** — it holds the canonical conventions, the
golden rules, and the do/don't list for this project. Everything there applies.

## Quick reference

- Toolchain is **Vite+ (`vp`)** — lint/format config is in `vite.config.ts`, not
  in `.eslintrc`/`.prettierrc` (there are none).
- **Never edit `src/routeTree.gen.ts`** (generated).
- Run **`pnpm check`** (format + lint + typecheck) and **`pnpm test`** before
  finishing any task.
- Tests import from `vite-plus/test`, not `vitest`.
- Use the import aliases: `@/*` → `src/*` (code), `#/*` → `types/*` (shared types).

## Skills

Project-specific skills live in `.claude/skills/`. They cover the TanStack
ecosystem and this project's conventions — consult them when working on routing,
data fetching, SEO, or the Vite+ toolchain.

## Verification expectations

After code changes, the project must pass:

```bash
pnpm check   # format + lint + typecheck
pnpm test    # tests
pnpm typecheck      # same, with type check
pnpm build   # production build (for non-trivial changes)
```

If any of these fail, fix the cause before reporting the task complete.
