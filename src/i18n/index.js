import { createI18n } from 'vue-i18n'
// import useAppStore from '@/store/modules/app'
import { listLangByLocale } from '@/api/system/commonlang.js'
import defaultSettings from '@/settings'
import cache from '@/plugins/cache'
const language = computed(() => {
  // return useAppStore().lang
  return cache.local.get('lang') || defaultSettings.defaultLang
})

import zhCn from './lang/zh-cn.json'
import en from './lang/en.json'
import zhTw from './lang/zh-tw.json'

import pageLoginCn from './pages/login/zh-cn.json'
import pageLoginEn from './pages/login/en.json'
import pageLoginTw from './pages/login/zh-tw.json'
import pageLoginVn from './pages/login/vn.json'

// import mntnCn from './pages/mntn/zh-cn.json'
// import mntnEn from './pages/mntn/en.json'
// import mntnTw from './pages/mntn/zh-tw.json'

// 菜单页面
import pagemenuCn from './pages/menu/zh-cn'
import pagemenuEn from './pages/menu/en'
import pagemenuTw from './pages/menu/zh-tw'

// 基础数据模块
import datacenterCn from './pages/datacenter/zh-cn.json'
import datacenterEn from './pages/datacenter/en.json'
import datacenterTw from './pages/datacenter/zh-tw.json'

//通用
import mntnCn from './pages/mntn/zh-cn.json'
import mntnEn from './pages/mntn/en.json'
import mntnTw from './pages/mntn/zn-tw.json'

// 标签
import labelCn from './pages/label/zh-cn.json'
import labelEn from './pages/label/en.json'
import labelTw from './pages/label/zh-tw.json'

// 出入库
import warehouseCn from './pages/warehouse/zh-cn.json'
import warehouseEn from './pages/warehouse/en.json'
import warehouseTw from './pages/warehouse/zh-tw.json'

export const i18n = createI18n({
  // 全局注入 $t 函数
  globalInjection: true,
  fallbackLocale: 'zh-cn',
  locale: language.value, //默认选择的语言
  legacy: false, // 使用 Composition API 模式，则需要将其设置为false
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true,
  fallbackWarn: false,
  messages: {
    'zh-cn': {
      ...zhCn,
      ...pageLoginCn,
      ...pagemenuCn,
      ...datacenterCn,
      ...mntnCn,
      ...labelCn,
      ...warehouseCn
    },
    'zh-tw': {
      ...zhTw,
      ...pageLoginTw,
      ...pagemenuTw,
      ...datacenterTw,
      ...mntnTw,
      ...labelTw,
      ...warehouseTw
    },
    en: {
      ...en,
      ...pageLoginEn,
      ...pagemenuEn,
      ...datacenterEn,
      ...mntnEn,
      ...labelEn,
      ...warehouseEn
    },
    vn:{
      ...pageLoginVn
    }
    //... 在这里添加其他语言支持
  }
})

export const loadLocale = () => {
  listLangByLocale(language.value).then((res) => {
    const { code, data } = res
    if (code == 200) {
      i18n.global.mergeLocaleMessage(language.value, data)
    }
  })
}
