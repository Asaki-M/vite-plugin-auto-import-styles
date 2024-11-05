import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import VitepluginAutoImportStyles from '.'

export default defineNuxtModule({
  meta: {
    name: 'vite-plugin-inspect',
    configKey: 'inspect',
  },
  setup(options) {
    addVitePlugin(() => VitepluginAutoImportStyles(options))
  },
}) as any
