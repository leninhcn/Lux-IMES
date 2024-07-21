<template>
  <el-config-provider :locale="locale" :size="size" :button="button">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { addCollecterror } from '@/api/tool'
import { useRoute } from 'vue-router'
import useSettingsStore from '@/store/modules/settings'
const settingsStore = useSettingsStore()
// 异常上报类型
const errorReport = computed(() => settingsStore.errorReport)

import useUserStore from './store/modules/user'
import useAppStore from './store/modules/app'
import { ElConfigProvider } from 'element-plus'
import zh from 'element-plus/dist/locale/zh-cn.mjs' // 中文语言
import en from 'element-plus/dist/locale/en.mjs' // 英文语言
import tw from 'element-plus/dist/locale/zh-tw.mjs' //繁体
import defaultSettings from '@/settings'
const { proxy } = getCurrentInstance()

const token = computed(() => {
  return useUserStore().userId
})

const lang = computed(() => {
  return useAppStore().lang
})
const locale = ref(zh)
const size = ref(defaultSettings.defaultSize)

const button = reactive({
  autoInsertSpace: true
})

size.value = useAppStore().size
watch(
  token,
  (val) => {
    if (val) {
      proxy.signalr.start().then(async (res) => {
        if (res) {
          await proxy.signalr.SR.invoke('logOut')
        }
      })
    }
  },
  {
    immediate: true,
    deep: true
  }
)
watch(
  lang,
  (val) => {
    if (val == 'zh-cn') {
      locale.value = zh
    } else if (val == 'en') {
      locale.value = en
    } else if (val == 'zh-tw') {
      locale.value = tw
    } else {
      locale.value = zh
    }
  },
  {
    immediate: true
  }
)

// 监听所有下级组件的错误
onErrorCaptured((error, vm, info) => {
  if (!errorReport.value.includes('code')) return false

  const { name } = useRoute()
  const form = {
    clientType: 'Frontend',
    programMent: name || '',
    errcode: `errorCaptured:${vm.$options.name || ''}`,
    responseResults: error.message || ''
  }
  addCollecterror(form)

  return false
})

console.log('🎉imes web client started.')
</script>
