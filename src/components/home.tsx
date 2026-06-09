import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Sparkles, Zap } from "lucide-react";
import { siteConfig } from "@/lib/site";

const features = [
  {
    icon: BookOpen,
    title: "开发规范",
    desc: "命名、提交、包管理与项目流程的一套统一约定，让协作更顺畅。",
    to: "standard/naming-specification",
  },
  {
    icon: Zap,
    title: "代码优化",
    desc: "性能优化、TypeScript 类型修复与 Vue3 实践，写出更快更稳的代码。",
    to: "optimization/code",
  },
  {
    icon: Sparkles,
    title: "学习指南",
    desc: "高效的学习方法与提效技巧，持续成长不掉队。",
    to: "learn/method",
  },
];

/**
 * Modern landing page: gradient hero + feature cards, replacing the old
 * VitePress `layout: home` page.
 */
export function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu blur-3xl"
      >
        <div className="mx-auto aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-indigo-400 to-violet-400 opacity-20 dark:opacity-10" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-300">
          <Sparkles className="size-4 text-indigo-500" />
          Vue3 前端开发实践
        </span>
        <h1 className="bg-gradient-to-br from-gray-900 via-indigo-700 to-violet-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl dark:from-white dark:via-indigo-300 dark:to-violet-300">
          {siteConfig.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {siteConfig.description}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/$"
            params={{ _splat: "standard/naming-specification" }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-500"
          >
            前端开发规范
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/$"
            params={{ _splat: "optimization/code" }}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            代码优化
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to="/$"
              params={{ _splat: f.to }}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
            >
              <div className="mb-4 inline-flex rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                <f.icon className="size-6" />
              </div>
              <h3 className="mb-2 flex items-center gap-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {f.title}
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
