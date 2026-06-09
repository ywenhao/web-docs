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
          <p className="mb-2 px-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
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
                        ? "block rounded-md border-l-2 border-indigo-500 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
                        : "block rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
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
