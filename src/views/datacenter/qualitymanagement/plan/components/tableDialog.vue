<script setup name="tableDialog">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import {
  editDescriptionData, getModelDataDialog, delModelDataDialog, editModelDataDialog, addModelDataDialog
} from '@/api/datacenter/qualitymanagement/rule'
import {ElMessageBox} from 'element-plus'
import {onMounted} from "vue";

const {proxy} = getCurrentInstance()

const prop = defineProps({
  logData: {
    type: Object,
    required: true
  },
})

// 表格配置项
const columns = reactive([
  {key: 1, label: proxy.$t('抽验等级'), prop: 'samplingLevel', visible: true, sortable: true},
  {key: 2, label: proxy.$t('连续批数'), prop: 'continueCnt', visible: true, sortable: true},
  {key: 3, label: proxy.$t('批退批数'), prop: 'rejectCnt', visible: true, sortable: true},
  {key: 4, label: proxy.$t('允收批数'), prop: 'passCnt', visible: true, sortable: true},
  {key: 5, label: proxy.$t('新抽验等级'), prop: 'nextSamplinglevel', visible: true, sortable: true},
  // {key: 8, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right'},
  {key: 0, type: 'selection', fixed: 'left'},
])
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
const formData = ref({})


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
const tableData = ref([])
const getTableData = async () => {
  loading.value = true
  try {
    const res = await getModelDataDialog({
      ...formData.value,
      // optionData: formData.optionData,
      // textData: formData.textData,
      // enaBled: formData.enaBled,
      samplingRuleid: prop.logData.samplingRuleid,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    tableData.value = res.result
    res.result.forEach(item => {
      switch (item.samplingLevel) {
        case '0':
          item.samplingLevel = 'Normal'
          break;
        case '1':
          item.samplingLevel = 'tight'
          break;
        case '2':
          item.samplingLevel = 'reduced'
          break;
        case '3':
          item.samplingLevel = 'no inspect'
          break;
        default:
          item.samplingLevel = 'Unknown'
      }
      switch (item.nextSamplinglevel) {
        case '0':
          item.nextSamplinglevel = 'Normal'
          break;
        case '1':
          item.nextSamplinglevel = 'tight'
          break;
        case '2':
          item.nextSamplinglevel = 'reduced'
          break;
        case '3':
          item.nextSamplinglevel = 'no inspect'
          break;
        default:
          item.nextSamplinglevel = 'Unknown'
      }
    })
    total.value = res.totalNum
  } finally {
    loading.value = false
  }
}

onMounted(() => getTableData())
// 启用/禁用
const changeEnabled = async (row) => {
  const flag = row.enabled === 'Y' ? 'N' : 'Y'
  const res = await editDescriptionData({detailId: row.detailId, enabled: flag})
  if (res === 1) {
    row.enabled = flag
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}

// 表格选中
const selectData = ref([])
const handleSelectionChange = (value) => {
  selectData.value = value
}
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
// 弹窗
const dialogFormRef = ref()
const dialogVisible = reactive({
  id: '',
  title: '',
  open: false,
  btnLoading: false,
  form: {
    samplingLevel: '',
    continueCnt: '',
    rejectCnt: '',
    passCnt: '',
    nextSamplinglevel: '',
  },
  rules: {
    samplingType: [{required: true, message: proxy.$t('common.inputTip'), trigger: 'blur'}],
    samplingDesc: [{required: true, message: proxy.$t('common.inputTip'), trigger: 'blur'}]
  }
})

// 新增/编辑
const addRoEditData = (type, data) => {
  if (type === 'add') {
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${prop.logData.samplingRulename}`
    dialogVisible.id = data.detailId
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
}

// 弹窗取消
const dialogCancel = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.open = false
}

// 弹窗确定
const dialogConfirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (!valid) return
    let res
    try {
      dialogVisible.btnLoading = true
      if (dialogVisible.title === proxy.$t('btn.add')) {
        res = await addModelDataDialog({
          samplingRuleid: prop.logData.samplingRuleid,
          ...dialogVisible.form
        })
      } else {
        res = await editModelDataDialog({
          samplingRuleid: prop.logData.samplingRuleid,
          detailId: dialogVisible.id,
          ...dialogVisible.form
        })
      }
      if (res === 1) {
        proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
        formEl.resetFields()
        dialogVisible.open = false
        getTableData()
      } else {
        proxy.$modal.msgError(proxy.$t('common.operationFail'))
      }
    } finally {
      dialogVisible.btnLoading = false
    }
  })
}

// 删除
const delData = async (row) => {
  if (row.enabled === 'Y') {
    return proxy.$modal.msgWarning(proxy.$t('common.enableFailMsg'))
  }
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delModelDataDialog({
    detailId: row.detailId
  })
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    getTableData()
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}

// log 弹窗
const logDialogVisible = reactive({
  open: false,
  title: '',
  loading: false,
  tableData: []
})


// 导出
const dowloadData = () => {
  proxy.downFile('/ProdMnt/ProdSamplingRule/RuleShowDetaitExport', {
    samplingRuleid: prop.logData.samplingRuleid,
    pageSize: total.value
  })
}
</script>

<template>

  <!-- 表单 -->
  <!--  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>-->
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData"
                 :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:qualitymanagement:plan:add']"
                 @click="addRoEditData('add')">{{
          $t('btn.add')
        }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        v-hasPermi="['datacenter:qualitymanagement:plan:edit']"
        :disabled="selectData.length != 1"
        @click="addRoEditData('edit', selectData[0])"
      >{{ $t('btn.edit') }}
      </el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        v-hasPermi="['datacenter:qualitymanagement:plan:remove']"
        :disabled="selectData.length != 1"
        @click="delData(selectData[0])"
      >{{ $t('btn.delete') }}
      </el-button
      >
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:qualitymanagement:plan:export']"
                 @click="dowloadData">{{
          $t('btn.export')
        }}
      </el-button>
    </template>
    <!-- 启用 -->
    <template #enabled="{ row }">
      <el-switch
        v-model="row.enabled"
        inline-prompt
        :active-text="$t('common.enable')"
        :inactive-text="$t('common.disenable')"
        active-value="Y"
        inactive-value="N"
        :before-change="() => changeEnabled(row)"/>
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:qualitymanagement:plan:edit']"
                 @click="addRoEditData('edit', row)">{{
          $t('btn.edit')
        }}
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-show="row.enaBled === 'N'"
        v-hasPermi="['datacenter:qualitymanagement:plan:remove']"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <!--      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:qualitymanagement:plan:history']" @click="showLog(row)">-->
      <!--        {{ $t('btn.log') }}-->
      <!--      </el-button>-->
    </template>
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
  <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="500" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="120">
      <el-form-item :label="$t('抽验等级')">
        <el-select v-model="dialogVisible.form.samplingLevel" placeholder="请选择活动区域">
          <el-option label="Normal" value="0"></el-option>
          <el-option label="tight" value="1"></el-option>
          <el-option label="reduced" value="2"></el-option>
          <el-option label="no inspect" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('连续批数')">
        <el-input v-model="dialogVisible.form.continueCnt" clearable :placeholder="$t('common.inputTip')"/>
      </el-form-item>
      <el-form-item :label="$t('批退批数')">
        <el-input v-model="dialogVisible.form.rejectCnt" clearable :placeholder="$t('common.inputTip')"/>
      </el-form-item>
      <el-form-item :label="$t('允收批数')" prop="model">
        <el-input v-model="dialogVisible.form.passCnt" clearable :placeholder="$t('common.inputTip')"/>
      </el-form-item>
      <el-form-item :label="$t('新抽验等级')" prop="model">
        <el-select v-model="dialogVisible.form.nextSamplinglevel" placeholder="请选择活动区域">
          <el-option label="Normal" value="0"></el-option>
          <el-option label="tight" value="1"></el-option>
          <el-option label="reduced" value="2"></el-option>
          <el-option label="no inspect" value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogCancel(dialogFormRef)">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" @click="dialogConfirm(dialogFormRef)">
          {{ $t('btn.submit') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
