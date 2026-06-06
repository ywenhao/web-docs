// / <reference types="vite/client" />

declare module 'virtual:pwa-register/vue' {
  import type { Ref } from 'vue'

  export function useRegisterSW(): {
    offlineReady: Ref<boolean>
    needRefresh: Ref<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
