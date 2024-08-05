import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import viteConfig from './vite.config'

export default defineConfig({
  title: '前端开发指南',
  description: 'Vue3 的前端开发指南',
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  markdown: {
    theme: {
      light: 'github-dark',
      dark: 'github-dark',
    },
    codeTransformers: [
      transformerTwoslash(),
    ],
  },
  sitemap: {
    hostname: 'https://web-docs.nedink.cn/',
  },
  srcDir: './docs',
  themeConfig: {
    logo: '/static/favicon.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '开发规范', link: '/standard/naming-specification' },
      { text: '代码优化', link: '/optimization/code' },
      { text: '学习指南', link: '/learn/method' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-PRESENT Ywenhao',
    },

    search: {
      provider: 'local',
    },

    sidebar: {
      '/standard': [
        {
          text: '命名规范',
          link: '/standard/naming-specification',
        },
        {
          text: '提交规范',
          link: '/standard/commit',
        },
        {
          text: 'vue3',
          link: '/standard/vue3',
        },
        {
          text: '包管理器',
          link: '/standard/package',
        },
        {
          text: '编辑器',
          link: '/standard/idea',
        },
        {
          text: '项目流程规范',
          link: '/standard/project',
        },
      ],
      '/optimization': [
        {
          text: '代码优化',
          link: '/optimization/code',
        },
        {
          text: 'ts类型修复',
          link: '/optimization/typescript',
        },
        {
          text: '性能优化',
          link: '/optimization/performance',
        },
        {
          text: 'vue3',
          link: '/optimization/vue3',
        },
      ],
      '/learn': [
        {
          text: '学习方法',
          link: '/learn/method',
        },
        {
          text: '提效技巧',
          link: '/learn/accelerate-skill',
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },

  head: [
    [
      'meta',
      {
        name: 'baidu-site-verification',
        content: 'codeva-UBvoEAzRIH',
      },
    ],
    ['link', { rel: 'icon', href: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
    ['meta', { name: 'keywords', content: '前端开发指南，前端开发规范，vue3开发规范' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { property: 'og:title', content: '前端开发指南' }],
    ['meta', { property: 'og:description', content: 'Vue3 的前端开发指南' }],
    ['meta', { name: 'author', content: 'Ywenhao' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Code&display=swap' }],
  ],
  vite: viteConfig,
})
