<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:factory:line:add']" @click="addRoEditRoCopyData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:factory:line:edit']"
        @click="addRoEditRoCopyData('edit', selectData[0])"
        >{{ $t('btn.edit') }}
      </el-button>
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:factory:line:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:factory:line:export']" @click="dowloadData">
        {{ $t('btn.export') }}
      </el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:factory:line:import']" @click="uploadData">
        {{ $t('btn.import') }}
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
        v-hasPermi="['datacenter:factory:line:edit']"
        @click="addRoEditRoCopyData('edit', row)">
        {{ $t('btn.edit') }}
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-hasPermi="['datacenter:factory:line:remove']"
        v-show="row.enabled === 'N'"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:factory:line:history']" @click="showLog(row)">
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
  <!-- 新增/编辑 弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="400" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="80">
      <el-form-item :label="$t('line.lineName')" prop="line">
        <el-input
          v-model="dialogVisible.form.line"
          clearable
          :disabled="dialogVisible.title.includes($t('btn.edit'))"
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('line.lineCustomer')" prop="lineCustomer">
        <el-input v-model="dialogVisible.form.lineCustomer" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('line.SAPLine')" prop="lineSap">
        <el-input v-model="dialogVisible.form.lineSap" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('factory.site')" prop="site">
        <el-select v-model="dialogVisible.form.site" disabled :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.site" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('line.lineDesc')" prop="lineDesc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="dialogVisible.form.lineDesc"
          clearable
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('line.lineType')" prop="lineType">
        <el-select v-model="dialogVisible.form.lineType" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.lineType" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('line.lineLevel')" prop="lineLevel">
        <el-select v-model="dialogVisible.form.lineLevel" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.lineLevel" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('line.workCenter')" prop="workCenter">
        <el-select v-model="dialogVisible.form.workCenter" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.workCenter" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" @click="dialogConfirm(dialogFormRef)">{{ $t('btn.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 导入弹窗 -->
  <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
    <el-upload
      name="file"
      ref="uploadRef"
      :limit="1"
      accept=".xlsx,.xls"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag>
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text" v-html="$t('common.uploadText')"></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>{{ $t('common.uploadTip') }}</span>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="upload.open = false">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="submitFileForm">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
  <!-- log 弹窗 -->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1000" draggable>
    <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading" max-height="500">
      <el-table-column property="id" label="id" fixed="left" width="100" />
      <el-table-column property="line" :label="$t('line.lineName')" width="120" />
      <el-table-column property="lineCustomer" :label="$t('line.lineCustomer')" width="120" />
      <el-table-column property="site" :label="$t('factory.site')" width="100" />
      <el-table-column property="lineDesc" :label="$t('line.lineDesc')" width="120" />
      <el-table-column property="lineType" :label="$t('line.lineType')" />
      <el-table-column property="lineLevel" :label="$t('line.lineLevel')" />
      <el-table-column property="enabled" :label="$t('common.isEnable')">
        <template #default="{ row }">
          <el-tag v-if="row.enabled === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="updateEmpno" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="updateTime" :label="$t('common.updateTime')" width="160" />
      <el-table-column property="createEmpno" :label="$t('common.createEmpno')" width="100" />
      <el-table-column property="createTime" :label="$t('common.createTime')" width="160" />
      <el-table-column property="workCenter" :label="$t('line.workCenter')" />
    </el-table>
  </el-dialog>
</template>

<script setup name="line">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import {
  getLineData,
  addLineData,
  editLineData,
  delLineData,
  getLineLog,
  getLineFactoryData,
  getLineTypeData,
  getLineLevelData,
  getLineWrokCenterData
} from '@/api/datacenter/factory/line'
import { ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'

const { proxy } = getCurrentInstance()
const userStore = useUserStore()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('line.lineName'), prop: 'line', fixed: 'left', visible: true, sortable: true, width: 120 },
  { key: 2, label: proxy.$t('line.lineCustomer'), prop: 'lineCustomer', visible: true, sortable: true, width: 120 },
  { key: 3, label: proxy.$t('line.SAPLine'), prop: 'lineSap', visible: true, sortable: true, width: 120 },
  { key: 4, label: proxy.$t('factory.site'), prop: 'site', visible: true, sortable: true },
  { key: 5, label: proxy.$t('line.lineDesc'), prop: 'lineDesc', visible: true, sortable: true, width: 120 },
  { key: 6, label: proxy.$t('line.lineType'), prop: 'lineType', visible: true, sortable: true, width: 120 },
  { key: 7, label: proxy.$t('line.lineLevel'), prop: 'lineLevel', visible: true, sortable: true, width: 120 },
  { key: 8, label: proxy.$t('line.workCenter'), prop: 'workCenter', visible: true, sortable: true, width: 120 },
  { key: 9, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, sortable: true, width: 100 },
  { key: 10, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 180 },
  { key: 11, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 12, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 220 }
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
    const res = await getLineData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editLineData({ id: row.id, enabled: flag })
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
    line: '',
    lineCustomer: '',
    lineSap: '',
    site: userStore.site,
    lineDesc: '',
    lineType: '',
    lineLevel: '',
    workCenter: ''
  },
  rules: {
    line: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  },
  options: {
    site: [],
    lineType: [],
    lineLevel: [],
    workCenter: []
  }
})

// 获取厂区
const getFactory = async () => {
  const res = await getLineFactoryData()
  dialogVisible.options.site = res
}

// 获取线别类型
const getLineType = async () => {
  const res = await getLineTypeData()
  dialogVisible.options.lineType = res
}

// 获取线别等级
const getLineLevel = async () => {
  const res = await getLineLevelData()
  dialogVisible.options.lineLevel = res
}

// 获取工作中心
const getWorkCenter = async () => {
  const res = await getLineWrokCenterData()
  dialogVisible.options.workCenter = res
}

// 新增/编辑
const addRoEditRoCopyData = (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.form.site = userStore.site
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.id = data.id
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.line}`
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
  getFactory()
  getLineType()
  getLineLevel()
  getWorkCenter()
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
        res = await addLineData(dialogVisible.form)
      } else {
        res = await editLineData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res === 1) {
        proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
        dialogVisible.open = false
        getTableData()
      } else if (res === 2) {
        proxy.$modal.msgWarning(proxy.$t('common.already'))
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
  const res = await delLineData({ id: row.id })
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
const showLog = async ({ id, line }) => {
  logDialogVisible.title = `${line} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getLineLog({ id })
    console.log(res)
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/FactoryInformation/ShowLineExport', { pageSize: total.value })
}

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/prodMnt/FactoryInformation/LineImportData'
})

// 点击上传按钮
const uploadData = async () => {
  upload.title = proxy.$t('btn.import')
  upload.open = true
}

// 文件上传中处理
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true
}

// 文件上传成功处理
const handleFileSuccess = (response, file, fileList) => {
  const { code, msg, data } = response
  upload.open = false
  upload.isUploading = false
  proxy.$refs['uploadRef'].clearFiles()
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + data.item1 + '</div>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  getList()
}

// 提交上传文件
function submitFileForm() {
  proxy.$refs['uploadRef'].submit()
}
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 340px;
}
</style>
