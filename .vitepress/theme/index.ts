import type { Theme } from 'vitepress'
import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import { handleRedirects } from './redirects'
import '@shikijs/vitepress-twoslash/style.css'

import './styles/main.css'
import './styles/demo.css'
import './styles/utils.css'
import './styles/vars.css'
import './styles/overrides.css'
import 'uno.css'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    if (typeof window !== 'undefined')
      handleRedirects(ctx.router)
    ctx.app.use(TwoSlashFloatingVue)
  },
}

export default theme
