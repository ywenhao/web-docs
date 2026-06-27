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
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
        <span className="glass-control liquid-muted mb-6 inline-flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm">
          <Sparkles className="size-4 text-sky-500" />
          Vue3 前端开发实践
        </span>
        <h1 className="liquid-gradient-text text-5xl font-extrabold sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="liquid-muted mx-auto mt-6 max-w-2xl text-lg">{siteConfig.description}</p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to="/$"
            params={{ _splat: "standard/naming-specification" }}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-6 py-3 font-medium text-white shadow-lg shadow-sky-500/20 transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            前端开发规范
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/$"
            params={{ _splat: "optimization/code" }}
            className="glass-control inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium text-slate-700 transition-colors hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
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
              className="glass-surface group rounded-lg p-6 transition-transform hover:-translate-y-1"
            >
              <div className="glass-control mb-4 inline-flex rounded-lg p-3 text-sky-600 dark:text-sky-300">
                <f.icon className="size-6" />
              </div>
              <h3 className="liquid-text mb-2 flex items-center gap-1 text-lg font-semibold dark:text-slate-100">
                {f.title}
                <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              <p className="liquid-muted text-sm">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
