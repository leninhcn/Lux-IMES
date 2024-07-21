<script setup name="testproject">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getModelData, addModelData, editModelData, delModelData, editDescriptionData } from '@/api/datacenter/qualitymanagement/testProject'
import { ElMessageBox } from 'element-plus'
import TableDialog from '@/views/datacenter/qualitymanagement/testProject/components/tableDialog.vue'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 1, label: '测试大项代码', prop: 'itemTypecode', visible: true, sortable: true },
  { key: 2, label: '测试大项描述', prop: 'itemTypedesc', visible: true, sortable: true },
  { key: 3, label: '测试大项描述2', prop: 'itemTypedesc2', visible: true, sortable: true },
  { key: 4, label: '最少检验个数', prop: 'minInspqty', visible: true, sortable: true },
  { key: 5, label: '测试大项名称', prop: 'itemTypename', visible: true, sortable: true },
  { key: 6, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 7, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right' },
  { key: 0, type: 'selection', fixed: 'left' }
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
options.splice(options.length - 2)
// 显隐表单
const showSearch = ref(true)

// 加载状态
const loading = ref(false)

// 表单项
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

// 获取表格数据
const tableData = ref([])
const getTableData = async () => {
  loading.value = true
  try {
    const res = await getModelData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
    tableData.value = res.result
    total.value = res.totalNum
  } finally {
    loading.value = false
  }
}

onMounted(() => getTableData())
// 启用/禁用
const changeEnabled = async (row) => {
  const flag = row.enabled === 'Y' ? 'N' : 'Y'
  const res = await editDescriptionData({ itemTypeid: row.itemTypeid, enabled: flag })
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

// 弹窗
const dialogFormRef = ref()
const dialogVisible = reactive({
  id: '',
  title: '',
  open: false,
  btnLoading: false,
  form: {
    itemTypecode: '',
    itemTypedesc: '',
    itemTypedesc2: '',
    minInspqty: '',
    itemTypename: ''
  },
  rules: {
    itemTypecode: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    itemTypedesc: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  }
})

// 新增/编辑
const addRoEditData = (type, data) => {
  if (type === 'add') {
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.itemTypecode}`
    dialogVisible.id = data.itemTypeid
    console.log(data)
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
        res = await addModelData(dialogVisible.form)
      } else {
        res = await editModelData({ itemTypeid: dialogVisible.id, ...dialogVisible.form })
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
  const res = await delModelData({ itemTypeid: row.itemTypeid })
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
// 查看历史记录
const logData = ref({})
const showLog = (row) => {
  logData.value = row
  logDialogVisible.title = row.samplingType
  logDialogVisible.open = true
  logDialogVisible.loading = true
  // try {
  //   const res = await getModelLog({ id, model })
  //   logDialogVisible.tableData = res
  // } finally {
  //   logDialogVisible.loading = false
  // }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/ProdTestitem/ShowExport', { pageSize: total.value })
}
</script>
<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:qualitymanagement:testProject:add']" @click="addRoEditData('add')"
        >{{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        v-hasPermi="['datacenter:qualitymanagement:testProject:edit']"
        :disabled="selectData.length != 1"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}
      </el-button>
      <el-button
        type="danger"
        plain
        icon="Delete"
        v-hasPermi="['datacenter:qualitymanagement:testProject:remove']"
        :disabled="selectData.length != 1"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:qualitymanagement:testProject:export']" @click="dowloadData"
        >{{ $t('btn.export') }}
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
        :before-change="() => changeEnabled(row)" />
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button
        type="success"
        size="small"
        icon="Edit"
        text
        v-hasPermi="['qualitymanagement:testProject:edit']"
        @click="addRoEditData('edit', row)"
        >{{ $t('btn.edit') }}
      </el-button>
      <!--      <el-button-->
      <!--        type="danger"-->
      <!--        size="small"-->
      <!--        icon="Delete"-->
      <!--        text-->
      <!--        v-show="row.enaBled === 'N'"-->
      <!--        v-hasPermi="['datacenter:product:model:remove']"-->
      <!--        @click="delData(row)">-->
      <!--        {{ $t('btn.delete') }}-->
      <!--      </el-button>-->
      <el-button
        type="primary"
        size="small"
        icon="Reading"
        text
        v-hasPermi="['datacenter:qualitymanagement:testProject:history']"
        @click="showLog(row)">
        {{ $t('查看') }}
      </el-button>
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
    :total="total" />
  <div style="width: 100%; height: 50px"></div>
  <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="500" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="120">
      <el-form-item :label="$t('测试大项代码')" prop="itemTypecode">
        <el-input v-model="dialogVisible.form.itemTypecode" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('测试大项描述')" prop="itemTypedesc">
        <el-input v-model="dialogVisible.form.itemTypedesc" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('测试大项描述2')" prop="model">
        <el-input v-model="dialogVisible.form.itemTypedesc2" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('最少检验个数')" prop="model">
        <el-input v-model="dialogVisible.form.minInspqty" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('测试大项名称')" prop="model">
        <el-input v-model="dialogVisible.form.itemTypename" clearable :placeholder="$t('common.inputTip')" />
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
  <!-- log 弹窗 -->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="80%" draggable destroy-on-close>
    <table-dialog :logData="logData" />
  </el-dialog>
</template>

<style lang="scss" scoped></style>
