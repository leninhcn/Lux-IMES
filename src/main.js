import { createApp } from 'vue'
// import Cookies from 'js-cookie'

import ElementPlus from 'element-plus'
import 'dayjs/locale/zh-cn'
import '@/assets/styles/index.scss' // global css

import App from './App'
import router from './router'
import directive from './directive' // directive
import vxetb from './vxe-tb'
// 注册指令
import plugins from './plugins' // plugins
import { downFile } from '@/utils/request'
import signalR from '@/signalr/signalr'
import { i18n as vueI18n, loadLocale } from './i18n/index'
import pinia from '@/store/index'

// svg图标
import '@/assets/iconfont/iconfont.js' //iconfont
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon/index.vue'
import elementIcons from '@/components/SvgIcon/svgicon'

import 'uno.css'

import './permission' // permission control

import { getConfigKey } from '@/api/system/config'
import { getDicts } from '@/api/system/dict/data'
import { parseTime, resetForm, resetLuxForm, addDateRange, handleTree, selectDictLabel, download, fileToBase64, fileToBase64Pure } from '@/utils/ruoyi'

// 分页组件
import Pagination from '@/components/Pagination'
// 自定义表格工具组件
import RightToolbar from '@/components/RightToolbar'
// 文件上传组件
import FileUpload from '@/components/FileUpload'
// 图片上传组件
import ImageUpload from '@/components/ImageUpload'
// 图片预览组件
import ImagePreview from '@/components/ImagePreview'
// 字典标签组件
import DictTag from '@/components/DictTag'
// el-date-picker 快捷选项
import dateOptions from '@/utils/dateOptions'
// Dialog组件
import Dialog from '@/components/Dialog'
// 表单组件
import LuxForm from '@/components/LuxForm'

import StationConfig from '@/components/StationConfig'

const app = createApp(App)
signalR.init(import.meta.env.VITE_APP_SOCKET_API)
app.config.globalProperties.signalr = signalR
// 全局方法挂载
app.config.globalProperties.getConfigKey = getConfigKey
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.download = download
app.config.globalProperties.downFile = downFile
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.resetLuxForm = resetLuxForm
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.fileToBase64 = fileToBase64
app.config.globalProperties.fileToBase64Pure = fileToBase64Pure
app.config.globalProperties.dateOptions = dateOptions

// 全局组件挂载
app.component('DictTag', DictTag)
app.component('Pagination', Pagination)
app.component('UploadFile', FileUpload)
app.component('UploadImage', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('RightToolbar', RightToolbar)
app.component('svg-icon', SvgIcon)
app.component('ZrDialog', Dialog)
app.component('StationConfig', StationConfig)
app.component('LuxForm', LuxForm)

directive(app)
vxetb(app)
app.use(pinia).use(router).use(plugins).use(ElementPlus, {}).use(elementIcons).use(vueI18n).mount('#app')

loadLocale()

import { addCollecterror } from '@/api/tool'
import useSettingsStore from '@/store/modules/settings'
const settingsStore = useSettingsStore()

// 获取异常上报配置 开发环境关闭所有上报
if (process.env.NODE_ENV === 'development') {
  settingsStore.setErrorReport([])
} else {
  getConfigKey('sys.error.feReport').then((response) => {
    const errTypes = ['edit', 'submit', 'code']
    let types = []
    if (response.data === 'all') {
      types = errTypes
    } else {
      const arr = response.data.split(',')
      arr.forEach(e => {
        if (errTypes.includes(e) && !types.includes(e)) types.push(e)
      })
    }
    settingsStore.setErrorReport(types)

    // 前端代码异常上报
    if (types.includes('code')) {
      // 监听全局vue组件错误，errorCaptured 方法 return false 时，不会传播到 errorHandler，和 window.onerror 互斥
      app.config.errorHandler = (error, vm, info) => {
        const { name } = router.currentRoute.value
        const form = {
          clientType: 'Frontend',
          programMent: name || '',
          errcode: `errorHandler:${vm.$options.name || ''}`,
          responseResults: error.message || ''
        }
        addCollecterror(form)
      }
      // 监听js错误，识别不了vue组件信息，异步错误只能用onerror
      window.onerror = (msg, source, line, column, error) => {
        const { name } = router.currentRoute.value
        const form = {
          clientType: 'Frontend',
          programMent: name || '',
          errcode: 'window.onerror',
          responseResults: msg || ''
        }
        addCollecterror(form)
      }
    }
  })
}
