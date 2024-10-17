import type { Plugin } from 'vite'
import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'

import {
  AutoImportStylesOptions,
  SameNameComponentOptions,
  ImportStyleOptions,
} from './types'
import { slash, escapeRegExp } from './util'

const stylesExtList = ['.css', '.scss', '.less']
const specialExtList = ['.vue', '.svelte'], jsxExtList = ['.jsx', '.tsx', '.js', '.ts']

async function scanDirSameNameComponent(dir: string, search: SameNameComponentOptions): Promise<SameNameComponentOptions | null> {
  const result = await fg(`${slash(dir)}/*.*`)

  let componentData = null
  result.forEach(item => {
    const extname = path.extname(item)
    const basename = path.basename(item, extname)
    if (search.base === basename && search.ext !== extname) {
      componentData = {
        ext: extname,
        base: basename
      }
    }
  })

  return componentData
}

function injectImportStyle(styleInfo: ImportStyleOptions, componentData: SameNameComponentOptions) {
  const cmpPath = path.join(styleInfo.dir, `${componentData.base}${componentData.ext}`)
  const cmpContent = fs.readFileSync(cmpPath, 'utf-8')

  let updatedCMPContent = cmpContent

  if (specialExtList.includes(componentData.ext)) {
    const isVue = componentData.ext === '.vue'
    const importStatement = `@import './${styleInfo.base}${styleInfo.ext}';`

    if (!cmpContent.includes('<style')) {
      const styleMeta = isVue ? `<style scoped lang="${styleInfo.ext.slice(1)}">` : `<style lang="${styleInfo.ext.slice(1)}">`
      const styleBlock = `\n\n${styleMeta}\n${importStatement}\n</style>\n`
      updatedCMPContent = cmpContent + styleBlock;

    } else if (!cmpContent.includes(importStatement)) {
      updatedCMPContent = cmpContent.replace(/<style.*?>/, `$&\n${importStatement}`)

    }
  } else if (jsxExtList.includes(componentData.ext)) {
    const importRegex = /import\s+.*?from\s+['"].*?['"];?/g;
    const styleBlock = `import styles from './${styleInfo.base}${styleInfo.ext}'`

    if (!cmpContent.includes(styleBlock)) {
      const matches = cmpContent.match(importRegex)
      if (!matches) {
        updatedCMPContent = styleBlock + '\n' + cmpContent

      } else {
        const lastImportStatement = matches[matches.length - 1]
        updatedCMPContent = cmpContent.replace(lastImportStatement, lastImportStatement + '\n' + styleBlock);

      }
    }
  }

  fs.writeFileSync(cmpPath, updatedCMPContent)
}

function unlinkImportStyle(styleInfo: ImportStyleOptions, componentData: SameNameComponentOptions) {
  const cmpPath = path.join(styleInfo.dir, `${componentData.base}${componentData.ext}`)
  const cmpContent = fs.readFileSync(cmpPath, 'utf-8')

  let updatedCMPContent = cmpContent
  if (specialExtList.includes(componentData.ext)) {
    const importStatement = `@import './${styleInfo.base}${styleInfo.ext}'`
    const importRegex = new RegExp(`(\r\n|\n)${escapeRegExp(importStatement)};`, 'g');
    updatedCMPContent = cmpContent.replace(importRegex, '')

  } else if (jsxExtList.includes(componentData.ext)) {
    const importStatement = `import styles from './${styleInfo.base}${styleInfo.ext}'`
    const importRegex = new RegExp(`(\r\n|\n)${escapeRegExp(importStatement)};?`, 'g');
    updatedCMPContent = cmpContent.replace(importRegex, '')
  }

  fs.writeFileSync(cmpPath, updatedCMPContent)
}

function VitepluginAutoImportStyles(options: AutoImportStylesOptions = {}): Plugin {

  return {
    name: 'vite-plugin-auto-import-styles',
    configureServer(server) {
      server.watcher.on('add', async (filepath) => {
        const extname = path.extname(filepath)
        if (stylesExtList.includes(extname)) {
          const dirname = path.dirname(filepath)
          const basename = path.basename(filepath, extname)
          const hasComponent = await scanDirSameNameComponent(dirname, { base: basename, ext: extname })

          if (hasComponent) {
            injectImportStyle({ dir: dirname, ext: extname, base: basename }, hasComponent)
          } else {
            !!options?.showWarnLogs && console.warn('[vite-plugin-auto-import-styles]: Can not find the same name component.')
          }
        } else {
          !!options?.showWarnLogs && console.warn('[vite-plugin-auto-import-styles]: Not match styles file. Only support css / sass / less.')
        }
      })

      server.watcher.on('unlink', async (filepath) => {
        const extname = path.extname(filepath)
        if (stylesExtList.includes(extname)) {
          const dirname = path.dirname(filepath)
          const basename = path.basename(filepath, extname)
          const hasComponent = await scanDirSameNameComponent(dirname, { base: basename, ext: extname })

          if (hasComponent) {
            unlinkImportStyle({ dir: dirname, ext: extname, base: basename }, hasComponent)
          }
        }
      })
    }
  }
}

export default VitepluginAutoImportStyles