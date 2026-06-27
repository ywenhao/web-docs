import { Link, useLocation } from "@tanstack/react-router";
import { sidebar } from "@/lib/docs";

/**
 * Left navigation: doc sections and their pages, mirroring the original
 * VitePress sidebar. Highlights the active page based on the current path.
 */
export function DocSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col gap-7">
      {sidebar.map((section) => (
        <div key={section.key}>
          <p className="mb-2 px-3 text-sm font-semibold text-slate-950 dark:text-slate-100">
            {section.text}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to="/$"
                    params={{ _splat: item.path.replace(/^\//, "") }}
                    onClick={onNavigate}
                    className={
                      active
                        ? "block rounded-lg border-l-2 border-sky-500 bg-white/55 px-3 py-1.5 text-sm font-medium text-sky-700 shadow-sm dark:bg-white/10 dark:text-sky-200"
                        : "block rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-white/45 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100"
                    }
                  >
                    {item.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
