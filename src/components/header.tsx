import { Link, useLocation } from "@tanstack/react-router";
import { Github, Menu, Moon, Search, Sun } from "lucide-react";
import { activeNavKeyFromPath, navLinks } from "@/lib/doc-nav";
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
  const { pathname } = useLocation();
  const activeNavKey = activeNavKeyFromPath(pathname);

  return (
    <header className="sticky top-3 z-40 px-3 sm:px-4">
      <div className="glass-surface mx-auto flex h-16 max-w-7xl items-center gap-4 rounded-lg px-4 sm:px-6">
        {onOpenSidebar ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="glass-control rounded-lg p-2 text-slate-600 transition-colors hover:text-slate-950 lg:hidden dark:text-slate-300 dark:hover:text-white"
            aria-label="打开侧边栏"
          >
            <Menu className="size-5" />
          </button>
        ) : null}

        <Link to="/" className="flex items-center gap-2 font-bold">
          <img src="/static/favicon.svg" alt="" className="size-7" />
          <span className="liquid-gradient-text hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to="/$"
              params={{ _splat: link.path.replace(/^\//, "") }}
              aria-current={activeNavKey === link.key ? "page" : undefined}
              className={
                activeNavKey === link.key
                  ? "rounded-lg border border-white/65 bg-white/60 px-3 py-2 text-sm font-semibold text-sky-700 shadow-sm shadow-sky-500/10 transition-colors dark:border-white/10 dark:bg-white/10 dark:text-sky-200"
                  : "rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white/55 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
              }
            >
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="glass-control flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="搜索"
          >
            <Search className="size-4" />
            <span className="hidden sm:inline">搜索文档</span>
            <kbd className="hidden rounded border border-white/60 bg-white/35 px-1.5 font-sans text-xs text-slate-400 sm:inline dark:border-white/10 dark:bg-white/5 dark:text-slate-500">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            onClick={toggle}
            className="glass-control rounded-lg p-2 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="切换主题"
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="glass-control rounded-lg p-2 text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="GitHub"
          >
            <Github className="size-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
