import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { SearchModal } from "@/components/search";
import { siteConfig } from "@/lib/site";

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
    <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header onOpenSearch={() => setSearchOpen(true)} />

      <div className="flex-1">{children}</div>

      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500">
          <p>Released under the MIT License.</p>
          <p className="mt-1">Copyright © 2024-PRESENT Ywenhao · {siteConfig.name}</p>
        </div>
      </footer>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
