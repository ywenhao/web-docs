import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import viteConfig from './vite.config'

export default defineConfig({
  title: "前端开发指南",
  description: "Vue3 的前端开发指南",
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerTwoslash(),
    ],
  },
  sitemap: {
    hostname: 'https://web-docs.nedink.cn/',
  },
  themeConfig: {
    logo: '/favicon.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-PRESENT Ywenhao',
    },

    search: {
      provider: 'local'
    },

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },

  head: [
    [
      'meta',
      {
        name: 'baidu-site-verification',
        content: 'codeva-UBvoEAzRIH'
      }
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
  vite: viteConfig
})
