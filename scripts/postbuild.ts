import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * 为了允许CommonJS/AMD/UMD中的默认导入（例如，从“fs”导入fs），typescript编译器添加__esModule标志，并在转换代码（从ES6到CommonJS）中检查它。
 * 它使用__importDefault帮助函数（检查__esModule标志）导入默认导出。
 */

function patchCjs(cjsModulePath: string, name: string) {
  const cjsModule = readFileSync(cjsModulePath, "utf-8");
  writeFileSync(
    cjsModulePath,
    cjsModule
      .replace("'use strict';", "'use strict';Object.defineProperty(exports, '__esModule', {value: true});")
      .replace(`module.exports = ${name};`, `exports.default = ${name};`),
    { encoding: "utf-8" },
  );
}

patchCjs(resolve("./dist/index.cjs"), "VitePluginAutoImportStyles");
patchCjs(resolve("./dist/nuxt.cjs"), "nuxt");
