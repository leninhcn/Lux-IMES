<template>
  <!-- 表单 -->
  <el-form-item v-show="showSearch" :label="$t('packaging.pkspecName')">
    <el-input v-model="textData" clearable :placeholder="$t('common.inputTip')" style="width: 220px" @input="textDataInput" />
  </el-form-item>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:packaging:gauge:add']" @click="addRoEditData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:packaging:gauge:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:packaging:gauge:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}</el-button
      >
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button
        type="success"
        size="small"
        icon="Edit"
        text
        v-hasPermi="['datacenter:packaging:gauge:edit']"
        @click="addRoEditData('edit', row)"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button type="danger" size="small" icon="Delete" text v-hasPermi="['datacenter:packaging:gauge:remove']" @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:packaging:gauge:history']" @click="showLog(row)">
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
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="400" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="100">
      <el-form-item :label="$t('packaging.pkspecName')" prop="pkspecName">
        <el-input
          v-model="dialogVisible.form.pkspecName"
          :disabled="dialogVisible.title.includes($t('btn.edit'))"
          clearable
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('packaging.boxQty')" prop="boxQty">
        <el-input-number v-model="dialogVisible.form.boxQty" :min="0" step-strictly />
      </el-form-item>
      <el-form-item :label="$t('packaging.cartonQty')" prop="cartonQty">
        <el-input-number v-model="dialogVisible.form.cartonQty" :min="0" step-strictly />
      </el-form-item>
      <el-form-item :label="$t('packaging.palletQty')" prop="palletQty">
        <el-input-number v-model="dialogVisible.form.palletQty" :min="0" step-strictly />
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
      <el-table-column property="ID" label="ID" fixed="left" width="100" />
      <el-table-column property="PKSPEC_NAME" :label="$t('packaging.pkspecName')" width="120" />
      <el-table-column property="PALLET_QTY" :label="$t('packaging.palletQty')" width="100" />
      <el-table-column property="CARTON_QTY" :label="$t('packaging.cartonQty')" width="100" />
      <el-table-column property="BOX_QTY" :label="$t('packaging.boxQty')" width="100" />
      <el-table-column property="ENABLED" :label="$t('common.isEnable')">
        <template #default="{ row }">
          <el-tag v-if="row.ENABLED === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="UPDATE_EMPNO" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="UPDATE_TIME" :label="$t('common.updateTime')" width="160" />
      <el-table-column property="CREATE_EMPNO" :label="$t('common.createEmpno')" width="100" />
      <el-table-column property="CREATE_TIME" :label="$t('common.createTime')" width="160" />
      <el-table-column property="SITE" :label="$t('factory.site')" />
    </el-table>
  </el-dialog>
</template>

<script setup name="gauge">
import ITable from '@/components/ITable'
import { getGaugeData, addGaugeData, editGaugeData, delGaugeData, getGaugeLog } from '@/api/datacenter/packaging/gauge'
import { useDebounceFn } from '@vueuse/core'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('packaging.pkspecName'), prop: 'pkspecName', visible: true, sortable: true },
  { key: 2, label: proxy.$t('packaging.boxQty'), prop: 'boxQty', visible: true, sortable: true },
  { key: 3, label: proxy.$t('packaging.cartonQty'), prop: 'cartonQty', visible: true, sortable: true },
  { key: 4, label: proxy.$t('packaging.palletQty'), prop: 'palletQty', visible: true, sortable: true },
  { key: 5, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, width: 120, sortable: true },
  { key: 6, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 180 },
  { key: 7, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 200 }
])

// 表单项
const textData = ref('')

// 显隐表单
const showSearch = ref(true)

// 加载状态
const loading = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 改变条数
watch(pageSize, () => getTableData())

// 改变页码
watch(currentPage, () => getTableData())

// 获取表格数据
const tableData = ref([])
const getTableData = async () => {
  loading.value = true
  try {
    const res = await getGaugeData({ textData: textData.value, pageNum: currentPage.value, pageSize: pageSize.value })
    tableData.value = res.result
    total.value = res.totalNum
  } finally {
    loading.value = false
  }
}

getTableData()

// 输入包规名称获取数据
const textDataInput = useDebounceFn(() => {
  getTableData()
}, 500)

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
    pkspecName: '',
    boxQty: 0,
    cartonQty: 0,
    palletQty: 0
  },
  rules: {
    pkspecName: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
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
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.pkspecName}`
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
        res = await addGaugeData(dialogVisible.form)
      } else {
        res = await editGaugeData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res === 1) {
        proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
        dialogVisible.open = false
        getTableData()
      } else {
        proxy.$modal.msgWarning(proxy.$t('common.already'))
      }
    } finally {
      dialogVisible.btnLoading = false
    }
  })
}

// 删除
const delData = async (row) => {
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delGaugeData({ id: row.id, pkspecName: row.pkspecName })
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
const showLog = async ({ id, pkspecName }) => {
  logDialogVisible.title = `${pkspecName} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getGaugeLog({ id, pkspecName })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}
</script>

<style lang="scss" scoped></style>
