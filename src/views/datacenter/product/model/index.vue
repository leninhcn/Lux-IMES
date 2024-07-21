<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:model:add']" @click="addRoEditData('add')">{{
        $t('btn.add')
      }}</el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        v-hasPermi="['datacenter:product:model:edit']"
        :disabled="selectData.length != 1"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        v-hasPermi="['datacenter:product:model:remove']"
        :disabled="selectData.length != 1"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}</el-button
      >
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:model:export']" @click="dowloadData">{{
        $t('btn.export')
      }}</el-button>
    </template>
    <!-- 启用 -->
    <template #enaBled="{ row }">
      <el-switch
        v-model="row.enaBled"
        inline-prompt
        :active-text="$t('common.enable')"
        :inactive-text="$t('common.disenable')"
        active-value="Y"
        inactive-value="N"
        :before-change="() => changeEnaBled(row)" />
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:product:model:edit']" @click="addRoEditData('edit', row)">{{
        $t('btn.edit')
      }}</el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-show="row.enaBled === 'N'"
        v-hasPermi="['datacenter:product:model:remove']"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:model:history']" @click="showLog(row)">
        {{ $t('btn.log') }}
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
  <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="500" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="80">
      <el-form-item :label="$t('model.modelName')" prop="model">
        <el-input v-model="dialogVisible.form.model" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('model.modelCustomer')" prop="modelCustomer">
        <el-input v-model="dialogVisible.form.modelCustomer" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('model.modelDesc')" prop="modelDesc">
        <el-input v-model="dialogVisible.form.modelDesc" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" @click="dialogConfirm(dialogFormRef)">{{ $t('btn.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- log 弹窗 -->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1000" draggable>
    <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading" max-height="500">
      <el-table-column property="id" label="ID" fixed="left" />
      <el-table-column property="model" :label="$t('model.modelName')" />
      <el-table-column property="modelCustomer" :label="$t('model.modelCustomer')" />
      <el-table-column property="modelNo" :label="$t('part.MODEL_NO')" width="120" />
      <el-table-column property="modelDesc" :label="$t('model.modelDesc')" />
      <el-table-column property="updateEmpno" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="updateTime" :label="$t('common.updateTime')" width="180" />
      <el-table-column property="createEmpno" :label="$t('common.createEmpno')" width="140" />
      <el-table-column property="createTime" :label="$t('common.createTime')" width="180" />
      <el-table-column property="enaBled" :label="$t('common.isEnable')" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.enaBled === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="site" :label="$t('site.site')" />
    </el-table>
  </el-dialog>
</template>

<script setup name="model">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getModelData, addModelData, editModelData, delModelData, getModelLog } from '@/api/datacenter/product/model'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('model.modelName'), prop: 'model', visible: true, sortable: true },
  { key: 2, label: proxy.$t('model.modelCustomer'), prop: 'modelCustomer', visible: true, sortable: true },
  { key: 3, label: proxy.$t('model.modelName'), prop: 'modelDesc', visible: true, sortable: true },
  { key: 4, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, sortable: true },
  { key: 5, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true },
  { key: 6, label: proxy.$t('common.isEnable'), prop: 'enaBled', visible: true, fixed: 'right' },
  { key: 7, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right' }
])

// 筛选条件
const options = reactive([
  {
    label: proxy.$t('model.modelName'),
    prop: 'MODEL'
  },
  {
    label: proxy.$t('model.modelCustomer'),
    prop: 'MODEL_CUSTOMER'
  },
  {
    label: proxy.$t('model.modelName'),
    prop: 'MODEL_DESC'
  },
  {
    label: proxy.$t('common.updateEmpno'),
    prop: 'UPDATE_EMPNO'
  },
  {
    label: proxy.$t('common.updateTime'),
    prop: 'UPDATE_TIME'
  }
])

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
    tableData.value = res.data.result
    total.value = res.data.totalNum
  } finally {
    loading.value = false
  }
}
getTableData()

// 启用/禁用
const changeEnaBled = async (row) => {
  const flag = row.enaBled === 'Y' ? 'N' : 'Y'
  const res = await editModelData({ id: row.id, enaBled: flag })
  if (res === 1) {
    row.enaBled = flag
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
    model: '',
    modelCustomer: '',
    modelDesc: ''
  },
  rules: {
    model: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  }
})

// 新增/编辑
const addRoEditData = (type, data) => {
  for (let i in dialogVisible.form) {
    dialogVisible.form[i] = ''
  }
  if (type === 'add') {
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.model}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
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
        res = await editModelData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res === 1) {
        proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
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
  if (row.enaBled === 'Y') {
    return proxy.$modal.msgWarning(proxy.$t('common.enableFailMsg'))
  }
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delModelData({ id: row.id })
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
const showLog = async ({ id, model }) => {
  logDialogVisible.title = `${model} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getModelLog({ id, model })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/prodModel/ModelExport', { pageSize: total.value })
}
</script>

<style lang="scss" scoped></style>
