import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import AutoImportStyles from '.'

export default defineNuxtModule({
  meta: {
    name: 'vite-plugin-auto-import-styles',
    configKey: 'auto-import-styles',
  },
  setup() {
    addVitePlugin(() => AutoImportStyles())
  },
}) as any
