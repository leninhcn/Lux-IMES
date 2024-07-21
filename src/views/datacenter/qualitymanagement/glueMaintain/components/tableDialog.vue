<script setup name="tableDialog">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import {
  getHistory,
  getIpnList, getWorkOrder
} from '@/api/datacenter/qualitymanagement/glueMaintain'
import {ElMessageBox} from 'element-plus'
import {onMounted} from "vue";

const {proxy} = getCurrentInstance()

const prop = defineProps({
  logData: {
    type: Object,
    required: true
  },
})
console.log(prop.logData)
// 表格配置项
let columns
if (prop.logData.id === 1) {
  columns = reactive([
    {key: 1, label: proxy.$t('料号'), prop: 'materialPn', visible: true, sortable: true},
    {key: 2, label: proxy.$t('物料类型'), prop: 'materialCname', visible: true, sortable: true},
    {key: 3, label: proxy.$t('厂商'), prop: 'vendor', visible: true, sortable: true},
    {key: 4, label: proxy.$t('料号描述'), prop: 'modelDesc', visible: true, sortable: true},
    {key: 0, type: 'selection', fixed: 'left'},
  ])
} else if (prop.logData.id === 2) {
  columns = reactive([
    {key: 1, label: proxy.$t('WORK_ORDER'), prop: 'workOrder', visible: true, sortable: true},
    {key: 2, label: proxy.$t('WO_TYPE'), prop: 'woType', visible: true, sortable: true},
    {key: 3, label: proxy.$t('MODEL'), prop: 'model', visible: true, sortable: true},
    {key: 4, label: proxy.$t('IPN'), prop: 'ipn', visible: true, sortable: true},
    {key: 5, label: proxy.$t('TARGET_QTY'), prop: 'targetQty', visible: true, sortable: true},
    {key: 6, label: proxy.$t('WO_CREATE_DATE'), prop: 'woCreateDate', visible: true, fixed: 'right'},
    {key: 0, type: 'selection', fixed: 'left'},
  ])
} else if (prop.logData.id === 3) {
  columns = reactive([
    {key: 1, label: proxy.$t('ID'), prop: 'ID', visible: true, sortable: true},
    {key: 2, label: proxy.$t('类型'), prop: 'PART_TYPE', visible: true, sortable: true},
    {key: 3, label: proxy.$t('料号'), prop: 'IPN', visible: true, sortable: true},
    {key: 4, label: proxy.$t('数量'), prop: 'QTY', visible: true, sortable: true},
    {key: 5, label: proxy.$t('线别'), prop: 'LINE', visible: true, sortable: true},
    {key: 6, label: proxy.$t('班别'), prop: 'SHIFT_TYPE', visible: true, fixed: 'right'},
    {key: 7, label: proxy.$t('领用时间'), prop: 'OPTION1', visible: true, fixed: 'right'},
    {key: 8, label: proxy.$t('OPTION2'), prop: 'OPTION2', visible: true, fixed: 'right'},
    {key: 9, label: proxy.$t('工单'), prop: 'OPTION3', visible: true, fixed: 'right'},
    {key: 10, label: proxy.$t('OPTION4'), prop: 'OPTION4', visible: true, fixed: 'right'},
    {key: 11, label: proxy.$t('OPTION5'), prop: 'OPTION5', visible: true, fixed: 'right'},
    {key: 12, label: proxy.$t('ENABLED'), prop: 'ENABLED', visible: true, fixed: 'right'},
    {key: 13, label: proxy.$t('维护人员'), prop: 'CREATE_EMP', visible: true, fixed: 'right'},
    {key: 14, label: proxy.$t('维护时间'), prop: 'CREATE_TIME', visible: true, fixed: 'right'},
    {key: 15, label: proxy.$t('UPDATE_EMP'), prop: 'UPDATE_EMP', visible: true, fixed: 'right'},
    {key: 16, label: proxy.$t('UPDATE_TIME'), prop: 'UPDATE_TIME', visible: true, fixed: 'right'},
    {key: 17, label: proxy.$t('SITE'), prop: 'SITE', visible: true, fixed: 'right'},
    {key: 0, type: 'selection', fixed: 'left'},
  ])
}
// 筛选条件
const options = reactive([])
columns.forEach((item, index) => {
  if (item.label) {
    options.push({
      label: item.label,
      prop: item.prop
    })
  }
})
// options.splice(options.length - 2)

// 显隐表单
const showSearch = ref(true)

// 加载状态
const loading = ref(false)

// // 表单项
// const formData = ref({})
// 表单项
const formData = reactive({
  optionData: '',
  textData: '',
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 改变条数
watch(pageSize, () => getTableData())

// 改变页码
watch(currentPage, () => getTableData())

// 搜索
const search = (params) => {
  formData.value = params
  getTableData()
}
// 重置
const form = ref()
const reset = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

// 获取表格数据
const tableData = ref()
const getTableData = async () => {
  loading.value = true
  try {
    let res
    if (prop.logData.id === 1) {
      res = await getIpnList(
        {
          partType: prop.logData.partType,
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          optionData: formData.optionData,
          textData: formData.textData,
        }
      )
      tableData.value = res.result
      total.value = res.totalNum
    } else if (prop.logData.id === 2) {
      res = await getWorkOrder(
        {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          optionData: formData.optionData,
          textData: formData.textData,
        }
      )
      tableData.value = res.result
      total.value = res.totalNum
    } else if (prop.logData.id === 3) {
      res = await getHistory(
        {id: prop.logData.row.id,}
      )
      tableData.value = res
      total.value = res.length
    }

  } finally {
    loading.value = false
  }
}
onMounted(() => getTableData())
// 表格选中
const selectData = ref([])
const handleSelectionChange = (value) => {
  selectData.value = value
}
// 弹窗
const dialogFormRef = ref()
const dialogVisible = reactive({
  id: '',
  title: '',
  open: false,
  btnLoading: false,
  form: {
    samplingRulename: '',
    samplingRuledesc: ''
  },
})
const emit = defineEmits(['update-value']);
const preservation = (type, data) => {
  if (prop.logData.id === 1) {
    emit('update-value', false, data.materialPn);
  } else if (prop.logData.id === 2) {
    emit('update-value', false, data.workOrder);
  }
}
const cancel = () => {
  emit('update-value', false);
}

</script>

<template>

  <!-- 表单 -->
  <!--  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>-->
  <el-form ref="iForm" :inline="true" :model="formData" v-show="showSearch">
    <el-form-item :label="$t('common.filtrate')" prop="optionData" style="width: 250px">
      <el-select v-model="formData.optionData" filterable clearable :placeholder="$t('common.selectTip')">
        <el-option v-for="item in options" :key="item.prop" :label="item.label" :value="item.prop"/>
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="textData">
      <el-input v-model="formData.textData" clearable
                :placeholder="$t('common.inputTip')"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" :loading="loading" @click="search">{{ $t('btn.search') }}</el-button>
      <el-button icon="Refresh" @click="reset(iForm)">{{ $t('btn.reset') }}</el-button>
    </el-form-item>
  </el-form>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData"
                 :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
  </ITable>
  <!-- 分页 -->
  <el-pagination
    style="float: right; margin-top: 10px"
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :page-sizes="[10, 25, 50, 100]"
    :background="true"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"/>
  <div style="width: 100%;height: 50px;"></div>
  <div style="width: 200px;margin: 0 auto;">
    <el-button
      type="primary"
      plain
      :disabled="selectData.length != 1"
      @click="preservation('edit', selectData[0])"
    >{{ $t('保存') }}
    </el-button>
    <el-button @click="cancel">{{ $t('取消') }}</el-button>
  </div>
</template>

<style scoped lang="scss">

</style>
