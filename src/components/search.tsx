import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Fuse from "fuse.js";
import { FileText, Search } from "lucide-react";
import { sectionLabel } from "@/lib/doc-nav";
import { searchIndex } from "@/lib/docs";
import type { SearchDoc } from "#/docs";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface Hit {
  doc: SearchDoc;
  /** A short snippet around the first match, for context. */
  snippet: string;
}

const MAX_RESULTS = 12;

/** Build a context snippet around the query within the body text. */
function makeSnippet(content: string, query: string): string {
  const idx = content.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return content.slice(0, 100);
  const start = Math.max(0, idx - 30);
  const end = Math.min(content.length, idx + 70);
  return `${start > 0 ? "…" : ""}${content.slice(start, end)}${end < content.length ? "…" : ""}`;
}

/**
 * ⌘K full-text search over all docs. Builds a Fuse index over titles and
 * plain-text bodies (provided by the markdown transform) and navigates to the
 * selected page.
 */
export function SearchModal({ open, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(searchIndex, {
        keys: [
          { name: "title", weight: 2 },
          { name: "content", weight: 1 },
        ],
        includeScore: true,
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [],
  );

  const hits: Hit[] = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return fuse
      .search(q)
      .slice(0, MAX_RESULTS)
      .map((r) => ({ doc: r.item, snippet: makeSnippet(r.item.content, q) }));
  }, [query, fuse]);

  // Focus the input and reset state when opened.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      // Defer to ensure the input is mounted.
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Keep the active index in range as results change.
  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  function go(path: string) {
    onClose();
    void navigate({ to: "/$", params: { _splat: path.replace(/^\//, "") } });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && hits[active]) {
      e.preventDefault();
      go(hits[active].doc.path);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-xl"
        onClick={onClose}
        aria-label="关闭搜索"
      />
      <div
        className="glass-surface relative w-full max-w-xl overflow-hidden rounded-lg"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-white/55 px-4 dark:border-white/10">
          <Search className="size-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文档…"
            className="w-full bg-transparent py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
          <kbd className="rounded border border-white/60 bg-white/35 px-1.5 text-xs text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() && hits.length === 0 ? (
            <p className="liquid-muted px-3 py-8 text-center text-sm">没有找到相关结果</p>
          ) : null}

          {hits.map((hit, i) => (
            <button
              key={hit.doc.path}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => go(hit.doc.path)}
              className={
                i === active
                  ? "flex w-full items-start gap-3 rounded-lg bg-white/58 px-3 py-2.5 text-left shadow-sm dark:bg-white/10"
                  : "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-white/38 dark:hover:bg-white/8"
              }
            >
              <FileText className="mt-0.5 size-4 shrink-0 text-slate-400" />
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="truncate font-medium text-slate-950 dark:text-slate-100">
                    {hit.doc.title}
                  </span>
                  <span className="glass-control shrink-0 rounded px-1.5 py-0.5 text-xs text-slate-500 dark:text-slate-300">
                    {sectionLabel(hit.doc.section)}
                  </span>
                </span>
                <span className="liquid-muted mt-0.5 block truncate text-sm">{hit.snippet}</span>
              </span>
            </button>
          ))}

          {!query.trim() ? (
            <p className="px-3 py-8 text-center text-sm text-slate-400">输入关键字搜索全部文档</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
