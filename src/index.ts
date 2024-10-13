import type { Plugin } from 'vite'
import fg from 'fast-glob'
import fs from 'fs'
import path from 'path'

import {
  AutoImportStylesOptions,
  SameNameComponentOptions,
  ImportStyleOptions,
} from './types'
import { slash } from './util'

const stylesExtList = ['.css', '.scss', '.less']
const specialExtList = ['.vue', '.svelte'], jsxExtList = ['.jsx', '.tsx', '.js', '.ts']

async function scanDirSameNameComponent(dir: string, search: string): Promise<SameNameComponentOptions | null> {
  const result = await fg(`${slash(dir)}/*.*`)

  let componentData = null
  result.forEach(item => {
    const extname = path.extname(item)
    const basename = path.basename(item, extname)
    if (search === basename) {
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
  if (specialExtList.includes(componentData.ext)) {
    const isVue = componentData.ext === '.vue'
    const importStatement = `@import './${styleInfo.base}${styleInfo.ext}';`

    if (!cmpContent.includes('<style')) {
      const styleMeta = isVue ? `<style scoped lang="${styleInfo.ext.slice(1)}">` : `<style lang="${styleInfo.ext.slice(1)}">`
      const styleBlock = `\n\n${styleMeta}\n${importStatement}\n</style>\n`
      const updatedCMPContent = cmpContent + styleBlock;
      fs.writeFileSync(cmpPath, updatedCMPContent)

    } else if (!cmpContent.includes(importStatement)) {
      const updatedCMPContent = cmpContent.replace(/<style.*?>/, `$&\n${importStatement}`)
      fs.writeFileSync(cmpPath, updatedCMPContent)

    }
  } else if (jsxExtList.includes(componentData.ext)) {

  }
}

function unlinkImportStyle(styleInfo: ImportStyleOptions, componentData: SameNameComponentOptions) {
  const cmpPath = path.join(styleInfo.dir, `${componentData.base}${componentData.ext}`)
  const cmpContent = fs.readFileSync(cmpPath, 'utf-8')

  if (specialExtList.includes(componentData.ext)) {
    const importStatement = `@import './${styleInfo.base}${styleInfo.ext}';`
    const updatedCMPContent = cmpContent.replace(importStatement, '')
    fs.writeFileSync(cmpPath, updatedCMPContent)

  } else if (jsxExtList.includes(componentData.ext)) {

  }
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
          const hasComponent = await scanDirSameNameComponent(dirname, basename)

          if (hasComponent) {
            injectImportStyle({ dir: dirname, ext: extname, base: basename }, hasComponent)
          }
        }
      })

      server.watcher.on('unlink', async (filepath) => {
        const extname = path.extname(filepath)
        if (stylesExtList.includes(extname)) {
          const dirname = path.dirname(filepath)
          const basename = path.basename(filepath, extname)
          const hasComponent = await scanDirSameNameComponent(dirname, basename)

          if (hasComponent) {
            unlinkImportStyle({ dir: dirname, ext: extname, base: basename }, hasComponent)
          }
        }
      })
    }
  }
}

export default VitepluginAutoImportStyles