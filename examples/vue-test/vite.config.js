import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImportStyles from 'vite-plugin-auto-import-styles'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImportStyles({
    showWarnLogs: true
  })],
})
