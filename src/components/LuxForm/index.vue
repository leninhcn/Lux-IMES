<template>
  <ElForm v-bind="{ ...props, ...$attrs }" ref="luxForm" @validate="formValidate">
    <template v-for="(item, key) in $slots" :key="key" #[key]="scoped">
      <slot :name="key" v-bind="scoped"></slot>
    </template>
  </ElForm>
</template>

<script setup>
import { addCollecterror } from '@/api/tool'
import useSettingsStore from '@/store/modules/settings'
const settingsStore = useSettingsStore()
// 异常上报类型
const errorReport = computed(() => settingsStore.errorReport)

const luxForm = ref(null)

let timer = 0, propsObj = {}

function reset() {
  if (timer) clearTimeout(timer)
  timer = 0
  propsObj = {}
}

function formValidate(prop, valid, msg) {
  // console.log(prop, valid, msg)
  const reportSubmit = errorReport.value.includes('submit')
  const reportEdit = errorReport.value.includes('edit')

  // 未开启表单校验异常上报
  if (!reportSubmit && !reportEdit) return

  // 拿到dataset中的信息，用于上报异常信息
  let config = luxForm.value.$el.dataset.reportInfo
  config = config && JSON.parse(config) || {}

  // 配置中定义了当前类型（编辑/提交），且当前类型未开启异常上报（如果未定义类型，开启任意表单校验均需上报异常）
  if (typeof config.submit !== 'undefined' && (config.submit && !reportSubmit || !config.submit && !reportEdit)) return

  if (!valid) propsObj[prop] = msg

  // 节流，可能同时触发多个校验错误，只需上报一次
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    const keys = Object.keys(propsObj)

    // 无异常，不上报
    if (keys.length === 0) {
      reset()
      return
    }

    // const info = keys.map(key => `${key}:${propsObj[key]}`).join(';')
    const info = keys.join(',')
    propsObj = {}

    const form = {
      clientType: 'Frontend',
      programMent: config.menu || '',
      errcode: `${config.update ? 'update' : 'add'}:${config.form || ''}`,
      responseResults: `[${config.submit ? 'submit' : 'edit'}]${info}`
    }
    // console.log(form)

    addCollecterror(form)
  }, 100)
}

defineExpose({
  $form: luxForm
})
</script>