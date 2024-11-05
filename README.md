# vite-plugin-auto-import-styles
---

[中文](./README.zh.md)

This plugin can auto import style file for your same name code. If you delete or rename the same name style file that can auto remove import statement.

Support css / sass / less for vue / svelte / js / jsx.

Like:
```
├── pages
│   ├── home
│   │   └── index.vue
```

New create style file in `pages/home/index.scss`

```vue
// index.vue
<template>
<h1>Test Auto Import Style</h1>
</template>

<script setup></script>



<style scoped lang="scss">
@import './index.scss'; // plugin auto import

</style>

```

## Usage

```
pnpm install vite-plugin-auto-import-styles
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImportStyles from 'vite-plugin-auto-import-styles'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), AutoImportStyles()],
})

```

Use in nuxt

```js
import { resolve } from 'path'
import VitepluginAutoImportStyles from 'vite-plugin-auto-import-styles/nuxt'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [VitepluginAutoImportStyles()],
  devtools: { enabled: true },
  pages: true
})

```