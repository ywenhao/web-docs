import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    Components({
      dirs: resolve(__dirname, 'theme/components'),
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
      dts: resolve(__dirname, 'components.d.ts'),
      transformer: 'vue3',
    }),
    Icons({
      compiler: 'vue3',
      defaultStyle: 'display: inline-block',
    }),
    UnoCSS(),
    Inspect(),
  ],
  server: {
    port: 3333,
  },
})
