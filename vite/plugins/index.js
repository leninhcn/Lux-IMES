import vue from '@vitejs/plugin-vue'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createSetupExtend from './setup-extend'
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import'

import Unocss from 'unocss/vite'
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
  presetWebFonts
} from 'unocss'

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [vue()]
  vitePlugins.push(createAutoImport())
  vitePlugins.push(createSetupExtend())
  vitePlugins.push(createSvgIcon(isBuild))
  isBuild && vitePlugins.push(...createCompression(viteEnv))

  vitePlugins.push(createStyleImportPlugin({
    resolves: [VxeTableResolve()]
  }))

  vitePlugins.push(Unocss({
    presets: [
      presetUno(),
      // presetWebFonts(),
      presetAttributify(),
      presetIcons({
        scale: 1.2,
        warn: true,
      }),
    ],
    transformers: [
      transformerDirectives(),
      transformerVariantGroup(),
    ]
  }))

  return vitePlugins
}
