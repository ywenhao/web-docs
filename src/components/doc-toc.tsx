import { useEffect, useState } from "react";
import type { TocItem } from "#/docs";

/**
 * Right-hand outline ("On this page"). Lists h2/h3 headings and highlights the
 * one currently in view using an IntersectionObserver.
 */
export function DocToc({ toc }: { toc: TocItem[] }) {
  const [activeSlug, setActiveSlug] = useState<string>("");

  useEffect(() => {
    if (toc.length === 0) return;

    const headings = toc
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        }
      },
      // Trigger when a heading enters the top quarter of the viewport.
      { rootMargin: "0px 0px -75% 0px", threshold: 0 },
    );

    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="text-sm">
      <p className="mb-3 font-semibold text-slate-950 dark:text-slate-100">本页目录</p>
      <ul className="flex flex-col gap-2 border-l border-white/60 dark:border-white/10">
        {toc.map((item) => {
          const active = activeSlug === item.slug;
          return (
            <li key={item.slug} style={{ paddingLeft: item.level === 3 ? "1.5rem" : "0.75rem" }}>
              <a
                href={`#${item.slug}`}
                className={
                  active
                    ? "-ml-px block border-l-2 border-sky-500 pl-3 text-sky-700 dark:text-sky-200"
                    : "-ml-px block border-l-2 border-transparent pl-3 text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100"
                }
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
