import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import AutoImportStyles from 'vite-plugin-auto-import-styles'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), AutoImportStyles()],
})
