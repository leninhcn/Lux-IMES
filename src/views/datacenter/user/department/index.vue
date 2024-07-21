<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:user:department:add']" @click="addRoEditData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:user:department:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:user:department:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:user:department:export']" @click="dowloadData">{{
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
        v-hasPermi="['datacenter:user:department:edit']"
        @click="addRoEditData('edit', row)"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-hasPermi="['datacenter:user:department:remove']"
        v-show="row.enabled === 'N'"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:user:department:history']" @click="showLog(row)">
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
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="100">
      <el-form-item :label="$t('factory.site')" prop="site">
        <el-select v-model="dialogVisible.form.site" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.site" :key="item.id" :label="item.site" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('dep.deptCode')" prop="deptCode">
        <el-input
          v-model="dialogVisible.form.deptCode"
          clearable
          :disabled="dialogVisible.title.includes($t('btn.edit'))"
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('dep.deptName')" prop="deptName">
        <el-input v-model="dialogVisible.form.deptName" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('dep.deptDesc')" prop="deptDesc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="dialogVisible.form.deptDesc"
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
      <el-table-column property="ID" label="ID" fixed="left" />
      <el-table-column property="SITE" :label="$t('factory.site')" width="100" />
      <el-table-column property="DEPT_CODE" :label="$t('dep.deptCode')" />
      <el-table-column property="DEPT_NAME" :label="$t('dep.deptName')" />
      <el-table-column property="DEPT_DESC" :label="$t('dep.deptDesc')" />
      <el-table-column property="UPDATE_EMPNO" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="UPDATE_TIME" :label="$t('common.updateTime')" width="160" />
      <el-table-column property="CREATE_EMPNO" :label="$t('common.createEmpno')" width="100" />
      <el-table-column property="CREATE_TIME" :label="$t('common.createTime')" width="160" />
      <el-table-column property="ENABLED" :label="$t('common.isEnable')">
        <template #default="{ row }">
          <el-tag v-if="row.ENABLED === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup name="department">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getDepData, addDepData, editDepData, delDepData, getDepLog, getDepFactoryData } from '@/api/datacenter/user/department'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('factory.site'), prop: 'site', visible: true, sortable: true },
  { key: 2, label: proxy.$t('dep.deptCode'), prop: 'deptCode', visible: true, sortable: true },
  { key: 3, label: proxy.$t('dep.deptName'), prop: 'deptName', visible: true, sortable: true },
  { key: 4, label: proxy.$t('dep.deptDesc'), prop: 'deptDesc', visible: true, sortable: true },
  { key: 5, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, width: 100, sortable: true },
  { key: 6, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 160 },
  { key: 7, label: proxy.$t('common.createEmpno'), prop: 'createEmpno', visible: true, width: 100, sortable: true },
  { key: 8, label: proxy.$t('common.createTime'), prop: 'createTime', visible: true, sortable: true, width: 160 },
  { key: 9, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 10, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 160 }
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
    const res = await getDepData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editDepData({ id: row.id, enabled: flag })
  if (res.data.includes('成功')) {
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
    site: '',
    deptCode: '',
    deptName: '',
    deptDesc: ''
  },
  rules: {
    deptCode: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    deptName: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  },
  options: {
    site: []
  }
})

// 获取厂区
const getFactory = async () => {
  const res = await getDepFactoryData()
  dialogVisible.options.site = res.data
  dialogVisible.form.site = dialogVisible.options.site.length && dialogVisible.options.site[0].id
}

// 新增/编辑
const addRoEditData = (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.deptCode}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
  getFactory()
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
        res = await addDepData(dialogVisible.form)
      } else {
        res = await editDepData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res.data.includes('成功')) {
        proxy.$modal.msgSuccess(res.data)
        dialogVisible.open = false
        getTableData()
      } else if (res.data.includes('已存在')) {
        proxy.$modal.msgWarning(res.data)
      } else {
        proxy.$modal.msgError(res.data)
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
  const res = await delDepData({ id: row.id })
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
const showLog = async ({ id, deptCode }) => {
  logDialogVisible.title = `${deptCode} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getDepLog({ id })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/MntnVendorMntnCustomer/VendorMntnCustomer/MdeptExport', { pageSize: total.value })
}
</script>

<style lang="scss" scoped></style>
