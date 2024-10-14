import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImportStyles from 'vite-plugin-auto-import-styles'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), AutoImportStyles()],
})
