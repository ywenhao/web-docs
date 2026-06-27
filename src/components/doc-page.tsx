import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DocSidebar } from "@/components/doc-sidebar";
import { DocToc } from "@/components/doc-toc";
import type { TocItem } from "#/docs";

interface DocPageProps {
  title: string;
  html: string;
  toc: TocItem[];
}

/**
 * Three-column documentation layout: left sidebar (sections), center prose
 * content (pre-rendered HTML), right outline (TOC). The sidebar collapses into
 * a drawer on small screens.
 */
export function DocPage({ title, html, toc }: DocPageProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the mobile drawer whenever the route (title) changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [title]);

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 pt-3 sm:px-6">
      {/* Left sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="glass-surface sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg p-4">
          <DocSidebar />
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="关闭侧边栏"
          />
          <div className="glass-surface absolute left-3 top-3 h-[calc(100%-1.5rem)] w-72 overflow-y-auto rounded-lg p-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="glass-control mb-4 ml-auto flex rounded-lg p-1.5 text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              aria-label="关闭"
            >
              <X className="size-5" />
            </button>
            <DocSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Center content */}
      <main className="min-w-0 flex-1 py-8">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="glass-control mb-4 rounded-lg px-3 py-2 text-sm font-medium text-sky-700 lg:hidden dark:text-sky-200"
        >
          目录 ☰
        </button>
        <article
          className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:text-slate-950 prose-a:text-sky-700 prose-pre:bg-transparent prose-pre:p-0 dark:prose-headings:text-white dark:prose-a:text-sky-300"
          // Pre-rendered, sanitized at author time (our own docs). Shiki output.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      {/* Right outline (desktop, xl+) */}
      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="glass-surface sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg p-4">
          <DocToc toc={toc} />
        </div>
      </aside>
    </div>
  );
}
