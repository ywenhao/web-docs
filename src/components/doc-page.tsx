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
    <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6">
      {/* Left sidebar (desktop) */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-2">
          <DocSidebar />
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-label="关闭侧边栏"
          />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white p-6 shadow-xl dark:bg-gray-950">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="mb-4 ml-auto flex rounded-md p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
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
          className="mb-4 text-sm text-indigo-600 lg:hidden dark:text-indigo-300"
        >
          目录 ☰
        </button>
        <article
          className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-pre:bg-transparent prose-pre:p-0"
          // Pre-rendered, sanitized at author time (our own docs). Shiki output.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>

      {/* Right outline (desktop, xl+) */}
      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-8">
          <DocToc toc={toc} />
        </div>
      </aside>
    </div>
  );
}
