# vite-plugin-auto-import-styles
---

[English](./README.md)


该插件可以自动导入同目录下同名样式文件，删除或者改名样式文件可以自动移除导入语句.

支持 css / sass / less 等样式文件，可用于 vue / svelte / js / jsx

如:
```
├── pages
│   ├── home
│   │   └── index.vue
```

创建样式文件 `pages/home/index.scss`

```vue
// index.vue
<template>
<h1>Test Auto Import Style</h1>
</template>

<script setup></script>



<style scoped lang="scss">
@import './index.scss'; // 自动导入

</style>

```

## 用法

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