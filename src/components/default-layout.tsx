import { Suspense, lazy, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { siteConfig } from "@/lib/site";

const SearchModal = lazy(() =>
  import("@/components/search").then((module) => ({ default: module.SearchModal })),
);

/**
 * App-wide chrome: glassy header (with the global ⌘K search) and footer,
 * wrapped around every route from the root shell. Pages render their own
 * content; docs pages add their sidebar/TOC themselves.
 */
export function DefaultLayout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global ⌘K / Ctrl+K to open search.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="liquid-shell flex min-h-screen flex-col text-slate-900 dark:text-slate-100">
      <Header onOpenSearch={() => setSearchOpen(true)} />

      <div className="flex-1">{children}</div>

      <footer className="border-t border-white/50 bg-white/20 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/20">
        <div className="liquid-muted mx-auto max-w-7xl px-6 py-8 text-sm">
          <p>Released under the MIT License.</p>
          <p className="mt-1">Copyright © 2024-PRESENT Ywenhao · {siteConfig.name}</p>
        </div>
      </footer>

      {searchOpen ? (
        <Suspense fallback={null}>
          <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
        </Suspense>
      ) : null}
    </div>
  );
}
