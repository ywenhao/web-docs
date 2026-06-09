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
      <p className="mb-3 font-semibold text-gray-900 dark:text-gray-100">本页目录</p>
      <ul className="flex flex-col gap-2 border-l border-gray-200 dark:border-gray-800">
        {toc.map((item) => {
          const active = activeSlug === item.slug;
          return (
            <li key={item.slug} style={{ paddingLeft: item.level === 3 ? "1.5rem" : "0.75rem" }}>
              <a
                href={`#${item.slug}`}
                className={
                  active
                    ? "-ml-px block border-l-2 border-indigo-500 pl-3 text-indigo-600 dark:text-indigo-300"
                    : "-ml-px block border-l-2 border-transparent pl-3 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
