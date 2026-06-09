import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Dark-mode state synced with `localStorage` and the `.dark` class on <html>.
 * The initial class is set by an inline script in `__root.tsx` to avoid a
 * flash; this hook keeps React in sync and handles toggling.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  // Read the actual applied theme after mount (SSR renders "light").
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      const root = document.documentElement;
      root.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {
        // Ignore storage failures (private mode, etc.).
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
