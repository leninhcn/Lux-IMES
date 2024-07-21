<template>
  <el-form ref="iForm" :inline="true" :model="formData" v-show="showSearch">
    <el-form-item :label="$t('common.filtrate')" prop="optionData">
      <el-select v-model="formData.optionData" filterable clearable :placeholder="$t('common.selectTip')">
        <el-option v-for="item in options" :key="item.prop" :label="item.label" :value="item.prop" />
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="textData">
      <el-input v-model="formData.textData" :disabled="textDataDisabled" clearable :placeholder="$t('common.inputTip')" />
    </el-form-item>
    <el-form-item :label="$t('common.isEnable')" prop="enaBled">
      <el-select v-model="formData.enaBled" :placeholder="$t('common.selectTip')">
        <el-option :label="$t('common.all')" value="" />
        <el-option :label="$t('common.enable')" value="Y" />
        <el-option :label="$t('common.disenable')" value="N" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" :loading="loading" @click="search">{{ $t('btn.search') }}</el-button>
      <el-button icon="Refresh" @click="reset(iForm)">{{ $t('btn.reset') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup name="IForm">
import mitt from '@/utils/mitt'

const props = defineProps({
  showSearch: {
    type: Boolean,
    default: true
  },
  options: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['search'])

// 表单
const formData = reactive({
  optionData: '',
  textData: '',
  enaBled: ''
})

// 根据筛选条件是否选择控制筛选字符串输入框的禁用与否
const textDataDisabled = ref(false)
watch(
  () => formData.optionData,
  (val) => {
    if (val) {
      textDataDisabled.value = false
    } else {
      textDataDisabled.value = true
      formData.textData = ''
    }
  },
  {
    immediate: true
  }
)

// 搜索
const search = () => {
  emit('search', formData)
}

// 重置
const iForm = ref()
const reset = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

// 监听表单显隐
watch(
  () => props.showSearch,
  (val) => {
    mitt.emit('domHeightChange', val ? 0 : 50)
  }
)
</script>

<style lang="scss" scoped>
.el-select {
  width: 160px;
}
</style>
