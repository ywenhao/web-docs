import { Link } from "@tanstack/react-router";
import { Github, Menu, Moon, Search, Sun } from "lucide-react";
import { navLinks } from "@/lib/doc-nav";
import { siteConfig } from "@/lib/site";
import { useTheme } from "@/lib/use-theme";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSidebar?: () => void;
}

/**
 * Sticky, glassy top header: brand, primary nav, search trigger, theme toggle,
 * and (on docs pages) a button to open the mobile sidebar.
 */
export function Header({ onOpenSearch, onOpenSidebar }: HeaderProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-md dark:border-gray-800/70 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {onOpenSidebar ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden dark:hover:bg-gray-800"
            aria-label="打开侧边栏"
          >
            <Menu className="size-5" />
          </button>
        ) : null}

        <Link to="/" className="flex items-center gap-2 font-bold">
          <img src="/static/favicon.svg" alt="" className="size-7" />
          <span className="hidden bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent sm:inline">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to="/$"
              params={{ _splat: link.path.replace(/^\//, "") }}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-700"
            aria-label="搜索"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">搜索文档</span>
            <kbd className="hidden rounded border border-gray-300 px-1.5 font-sans text-xs text-gray-400 sm:inline dark:border-gray-700">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={toggle}
            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="切换主题"
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="GitHub"
          >
            <Github className="size-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
