<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:rests:weight:add']" @click="addRoEditData('add')">{{
        $t('btn.add')
      }}</el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        v-hasPermi="['datacenter:rests:weight:edit']"
        :disabled="selectData.length != 1"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        v-hasPermi="['datacenter:rests:weight:remove']"
        :disabled="selectData.length != 1"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}</el-button
      >
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:rests:weight:export']" @click="dowloadData">{{
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
        :before-change="() => changeEnaBled(row)" />
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:rests:weight:edit']" @click="addRoEditData('edit', row)">{{
        $t('btn.edit')
      }}</el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-show="row.enabled === 'N'"
        v-hasPermi="['datacenter:rests:weight:remove']"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:rests:weight:history']" @click="showLog(row)">
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
      <el-form-item :label="$t('weight.type')" prop="type">
        <el-select v-model="dialogVisible.form.type" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.type" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('weight.mpn')" prop="mpn">
        <el-input v-model="dialogVisible.form.mpn" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('weight.ipn')" prop="ipn">
        <el-input v-model="dialogVisible.form.ipn" clearable :placeholder="$t('common.inputTip')" @input="ipnInput" />
      </el-form-item>
      <el-form-item :label="$t('weight.faiValue')" prop="faiValue">
        <el-input v-model="dialogVisible.form.faiValue" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('weight.unit')" prop="unit">
        <el-input v-model="dialogVisible.form.unit" readonly :placeholder="$t('common.inputTip')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" :disabled="dialogVisible.btnDisabled" @click="dialogConfirm(dialogFormRef)">{{
          $t('btn.submit')
        }}</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- log 弹窗 -->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1000" draggable>
    <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading">
      <el-table-column property="id" label="ID" fixed="left" width="100" />
      <el-table-column property="type" :label="$t('weight.type')" width="120" />
      <el-table-column property="mpn" :label="$t('weight.mpn')" />
      <el-table-column property="ipn" :label="$t('weight.ipn')" width="120" />
      <el-table-column property="faiValue" :label="$t('weight.faiValue')" />
      <el-table-column property="enaBled" :label="$t('common.isEnable')" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.enaBled === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="updateEmpno" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="updateTime" :label="$t('common.updateTime')" width="160" />
      <el-table-column property="createEmpno" :label="$t('common.createEmpno')" width="100" />
      <el-table-column property="createTime" :label="$t('common.createTime')" width="160" />
      <el-table-column property="plant" :label="$t('part.PLANT')" />
      <el-table-column property="site" :label="$t('site.site')" />
    </el-table>
  </el-dialog>
</template>

<script setup name="weight">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import {
  getLWeightData,
  addWeightData,
  editWeightData,
  editWeightState,
  delWeightData,
  getWeightHistory,
  checkWeightIpn
} from '@/api/datacenter/rests/weight'
import { ElMessageBox } from 'element-plus'
import { useDebounceFn } from '@vueuse/core'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: 'ID', prop: 'id', visible: true, sortable: true },
  { key: 2, label: proxy.$t('weight.type'), prop: 'type', visible: true, sortable: true },
  { key: 3, label: proxy.$t('weight.mpn'), prop: 'mpn', visible: true, sortable: true },
  { key: 4, label: proxy.$t('weight.ipn'), prop: 'ipn', visible: true, sortable: true },
  { key: 5, label: proxy.$t('weight.faiValue'), prop: 'faiValue', visible: true, sortable: true },
  { key: 6, label: proxy.$t('weight.unit'), prop: 'unit', visible: true, sortable: true },
  { key: 7, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, sortable: true },
  { key: 8, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 160 },
  { key: 9, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 10, type: 'operation', label: proxy.$t('common.operation'), width: 160, fixed: 'right' }
])

// 筛选条件
const options = computed(() => columns.filter((item) => !item.type && item.label !== proxy.$t('common.isEnable')))

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
    const res = await getLWeightData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
    tableData.value = res.result
    total.value = res.totalNum
  } finally {
    loading.value = false
  }
}
getTableData()

// 启用/禁用
const changeEnaBled = async (row) => {
  const flag = row.enabled === 'Y' ? 'N' : 'Y'
  const res = await editWeightState({ id: row.id, enabled: flag })
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
  btnDisabled: false,
  form: {
    type: '',
    mpn: '',
    ipn: '',
    faiValue: '',
    unit: ''
  },
  rules: {
    type: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    ipn: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  },
  options: {
    type: ['SingleWeight', 'CartonWeight']
  }
})

// 监听弹窗 type 的变化动态改变 unit
watch(
  () => dialogVisible.form.type,
  (val) => {
    switch (val) {
      case 'SingleWeight':
        dialogVisible.form.unit = 'g'
        break
      case 'CartonWeight':
        dialogVisible.form.unit = 'kg'
        break
    }
  }
)

// 新增/编辑
const addRoEditData = (type, data) => {
  dialogVisible.btnDisabled = false
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.id}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
}

// 检查料号
const ipnInput = useDebounceFn(async () => {
  const res = await checkWeightIpn({ ipn: dialogVisible.form.ipn })
  if (res === 0) {
    proxy.$modal.msgSuccess(proxy.$t('part.tipSuccess'))
    dialogVisible.btnDisabled = false
  } else {
    proxy.$modal.msgWarning(proxy.$t('part.tipWarning'))
    dialogVisible.btnDisabled = true
  }
}, 500)

// 弹窗确定
const dialogConfirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (!valid) return
    let res
    try {
      dialogVisible.btnLoading = true
      if (dialogVisible.title === proxy.$t('btn.add')) {
        res = await addWeightData(dialogVisible.form)
      } else {
        res = await editWeightData({ id: dialogVisible.id, ...dialogVisible.form })
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
  const res = await delWeightData({ id: row.id })
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
const showLog = async ({ id }) => {
  logDialogVisible.title = `${id} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getWeightHistory({ id })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = async () => {
  proxy.downFile('/prodMnt/StationPassQty/ShowExport', { pageSize: total.value })
}
</script>

<style lang="scss" scoped></style>
