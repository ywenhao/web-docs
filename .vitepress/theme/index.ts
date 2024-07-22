import DefaultTheme from 'vitepress/theme'
import TwoSlashFloatingVue from '@shikijs/vitepress-twoslash/client'
import { handleRedirects } from './redirects'
import '@shikijs/vitepress-twoslash/style.css'

import './styles/main.css'
import './styles/demo.css'
import './styles/utils.css'
import './styles/vars.css'
import './styles/overrides.css'
import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: any) {
    if (typeof window !== 'undefined')
      handleRedirects(ctx.router)
    ctx.app.use(TwoSlashFloatingVue)
  },
}
