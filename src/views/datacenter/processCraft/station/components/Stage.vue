<template>
  <el-card style="padding-bottom: 20px; margin-bottom: 10px">
    <!-- 区段 -->
    <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search" />
    <!-- 右侧工具栏 -->
    <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
    <!-- 表格 -->
    <ITable
      :columns="columns"
      :tableData="tableData"
      :loading="loading"
      :height="200"
      :highlightCurrentRow="true"
      :handleSelectionChange="handleSelectionChange"
      :handle-current-change="handleCurrentChange">
      <!-- 操纵按钮 -->
      <template #tool-btns>
        <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:processCraft:station:add']" @click="addRoEditData('add')">
          {{ $t('btn.add') }}
        </el-button>
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="selectData.length != 1"
          v-hasPermi="['datacenter:processCraft:station:edit']"
          @click="addRoEditData('edit', selectData[0])"
          >{{ $t('btn.edit') }}</el-button
        >
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="selectData.length != 1"
          v-hasPermi="['datacenter:processCraft:station:remove']"
          @click="delData(selectData[0])"
          >{{ $t('btn.delete') }}</el-button
        >
        <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:processCraft:station:export']" @click="dowloadData">{{
          $t('btn.export')
        }}</el-button>
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
          v-hasPermi="['datacenter:processCraft:station:edit']"
          @click="addRoEditData('edit', row)"
          >{{ $t('btn.edit') }}</el-button
        >
        <el-button
          type="danger"
          size="small"
          icon="Delete"
          text
          v-show="row.enabled === 'N'"
          v-hasPermi="['datacenter:processCraft:station:remove']"
          @click="delData(row)">
          {{ $t('btn.delete') }}
        </el-button>
        <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:processCraft:station:history']" @click="showLog(row)">
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
  </el-card>
  <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="500" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="80">
      <el-form-item label="区段" prop="stage">
        <el-input v-model="dialogVisible.form.stage" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item label="区段描述" prop="stageDesc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="dialogVisible.form.stageDesc"
          clearable
          :placeholder="$t('common.inputTip')" />
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
      <el-table-column property="stage" :label="$t('stage.stage')" />
      <el-table-column property="stageDesc" :label="$t('stage.stageDesc')" />
      <el-table-column property="enabled" :label="$t('common.isEnable')">
        <template #default="{ row }">
          <el-tag v-if="row.enabled === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="updateEmpno" :label="$t('stage.empName')" />
      <el-table-column property="updateTime" :label="$t('common.updateTime')" width="160" />
    </el-table>
  </el-dialog>
</template>

<script setup name="Stage">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getStageData, addStageData, editStageData, delStageData, getStageLog } from '@/api/datacenter/processCraft/station'
import { ElMessageBox } from 'element-plus'

const emit = defineEmits(['handleCurrentChange'])

const { proxy } = getCurrentInstance()

// 表单配置项
const columns = reactive([
  { key: 0, type: 'select', fixed: 'left' },
  { key: 1, label: proxy.$t('stage.stage'), prop: 'stage', visible: true },
  { key: 2, label: proxy.$t('stage.stageDesc'), prop: 'stageDesc', visible: true },
  { key: 3, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true },
  { key: 4, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true },
  { key: 5, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 6, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 220 }
])

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

// 显隐表单
const showSearch = ref(true)

// 表单筛选条件项
const options = computed(() => columns.filter((item) => !item.type && item.label !== proxy.$t('common.isEnable')))

// 加载状态
const loading = ref(false)

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
    const res = await getStageData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
    tableData.value = res.result
    total.value = res.totalNum
  } finally {
    loading.value = false
  }
}
getTableData()

// 启用/禁用
const changeEnabled = async (row) => {
  const flag = row.enabled === 'Y' ? 'N' : 'Y'
  const res = await editStageData({ id: row.id, enabled: flag })
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
    stage: '',
    stageDesc: ''
  },
  rules: {
    stage: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  }
})

// 新增/编辑
const addRoEditData = (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.stage}`
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
        res = await addStageData(dialogVisible.form)
      } else {
        res = await editStageData({ id: dialogVisible.id, ...dialogVisible.form })
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
  if (row.enabled === 'Y') {
    return proxy.$modal.msgWarning(proxy.$t('common.enableFailMsg'))
  }
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delStageData({ id: row.id })
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    getTableData()
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}

// 表格当前行变化
const handleCurrentChange = (currentRow) => {
  emit('handleCurrentChange', currentRow ? currentRow.stage : '')
}

// log 弹窗
const logDialogVisible = reactive({
  open: false,
  title: '',
  loading: false,
  tableData: []
})
// 查看历史记录
const showLog = async ({ id, stage }) => {
  logDialogVisible.title = `${stage} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getStageLog({ id })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/ProcessTechnology/ShowStageExport', { pageSize: total.value })
}
</script>

<style lang="scss" scoped></style>
