<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:partCode:add']" @click="addRoEditData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:partCode:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:partCode:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:partCode:export']" @click="dowloadData">
        {{ $t('btn.export') }}
      </el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:product:partCode:import']" @click="uploadData">
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
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:product:partCode:edit']" @click="addRoEditData('edit', row)">
        {{ $t('btn.edit') }}
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-hasPermi="['datacenter:product:partCode:remove']"
        v-show="row.enabled === 'N'"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:partCode:history']" @click="showLog(row)">
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
    <div class="dialog-type">
      <el-radio-group v-model="dialogVisible.type" @change="typeChange">
        <el-radio value="Ipn" label="IPN"></el-radio>
        <el-radio value="Derive_IPN" label="Derive_IPN"></el-radio>
      </el-radio-group>
    </div>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="100">
      <el-form-item :label="$t('part.IPN')" prop="ipn">
        <el-select
          v-model="dialogVisible.form.ipn"
          filterable
          remote
          clearable
          :placeholder="$t('common.inputTip')"
          :loading="dialogVisible.ipnLoading"
          :remote-method="remoteMethod"
          @change="getMesData">
          <el-option v-for="item in dialogVisible.options.ipn" :key="item.IPN" :label="item.IPN" :value="item.IPN" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('part.snFeature')" prop="snFeature">
        <el-input v-model="dialogVisible.form.snFeature" clearable :placeholder="$t('common.inputTip')" style="width: 300px" />
        <el-text style="margin-left: 10px" type="info">{{ dialogVisible.form.snFeature.length }}</el-text>
      </el-form-item>
      <el-form-item :label="$t('description.mesSpec')" prop="mesSpec">
        <el-input v-model="dialogVisible.form.mesSpec" :readonly="dialogVisible.readonly" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('part.PART_TYPE')" prop="partType">
        <el-select v-model="dialogVisible.form.partType" filterable :placeholder="$t('common.selectTip')" style="width: 250px">
          <el-option v-for="item in dialogVisible.options.partType" :key="item.label" :label="item.label" :value="item.label" />
        </el-select>
        <el-text style="margin-left: 10px" type="info">
          {{ dialogVisible.options.partType.filter((item) => item.label === dialogVisible.form.partType)[0]?.value }}
        </el-text>
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
      <el-table-column property="ID" label="ID" fixed="left" width="100" />
      <el-table-column property="IPN" :label="$t('part.IPN')" width="120" />
      <el-table-column property="SN_FEATURE" :label="$t('part.snFeature')" width="120" />
      <el-table-column property="PART_TYPE" :label="$t('part.PART_TYPE')" />
      <el-table-column property="SN_VENDOR" :label="$t('part.SN_VENDOR')" width="120" />
      <el-table-column property="SN_CODE" :label="$t('part.SN_CODE')" width="100" />
      <el-table-column property="SN_CODE_PATITION" :label="$t('part.SN_CODE_PATITION')" width="170" />
      <el-table-column property="SN_LENGTH" :label="$t('part.SN_LENGTH')" width="120" />
      <el-table-column property="MES_SPEC" :label="$t('description.mesSpec')" width="120" />
      <el-table-column property="UPDATE_EMPNO" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="UPDATE_TIME" :label="$t('common.updateTime')" width="160" />
      <el-table-column property="SN_CODE_PATITION" :label="$t('part.SN_CODE_PATITION')" width="170" />
      <el-table-column property="SN_CODE_PATITION" :label="$t('part.SN_CODE_PATITION')" width="170" />
      <el-table-column property="CREATE_EMPNO" :label="$t('common.createEmpno')" width="100" />
      <el-table-column property="CREATE_TIME" :label="$t('common.createTime')" width="160" />
      <el-table-column property="ENABLED" :label="$t('common.isEnable')">
        <template #default="{ row }">
          <el-tag v-if="row.ENABLED === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="PLANT" :label="$t('part.PLANT')" />
      <el-table-column property="SITE" :label="$t('site.site')" />
    </el-table>
  </el-dialog>
</template>

<script setup name="partcode">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getToken } from '@/utils/auth'
import {
  getPartCodeData,
  addPartCodeData,
  editPartCodeData,
  delPartCodeData,
  getPartCodeLog,
  getPartCodeIpnData,
  axiosCancel,
  getPartCodeMesData
} from '@/api/datacenter/product/partCode'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('part.IPN'), prop: 'ipn', visible: true, sortable: true },
  { key: 2, label: proxy.$t('part.PART_TYPE'), prop: 'partType', visible: true, sortable: true },
  { key: 3, label: proxy.$t('part.snFeature'), prop: 'snFeature', visible: true, sortable: true },
  { key: 4, label: proxy.$t('description.mesSpec'), prop: 'mesSpec', visible: true, sortable: true },
  { key: 5, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, width: 120, sortable: true },
  { key: 6, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 180 },
  { key: 7, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 8, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 160 }
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
    const res = await getPartCodeData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editPartCodeData({ id: row.id, enabled: flag, ipn: row.ipn, snFeature: row.snFeature })
  if (res === 1) {
    row.enabled = flag
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
  getTableData()
}

// 表格选中
const selectData = ref([])
const handleSelectionChange = (value) => {
  selectData.value = value
}

// 验证料号特征码不允许出现“#”
const checkSnFeature = (_, value, callback) => {
  const reg = /^[^#]*$/
  if (!reg.test(value)) {
    callback(new Error(proxy.$t('part.has#Error')))
  } else {
    callback()
  }
}

// 弹窗
const dialogFormRef = ref()
const dialogVisible = reactive({
  id: '',
  title: '',
  open: false,
  ipnLoading: false,
  btnLoading: false,
  readonly: true,
  type: 'Ipn',
  form: {
    ipn: '',
    snFeature: '',
    mesSpec: '',
    partType: 'MK'
  },
  options: {
    ipn: [],
    partType: [
      {
        label: 'MK',
        value: 'Main Part KPSN'
      },
      {
        label: 'SK',
        value: 'Sub Part KPSN'
      },
      {
        label: 'SL',
        value: 'Sub Part Lot'
      }
    ]
  },
  rules: {
    ipn: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'change' }],
    snFeature: [
      { required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' },
      { validator: checkSnFeature, trigger: 'blur' }
    ],
    mesSpec: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'blur' }],
    partType: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }]
  }
})

// 获取 IPN
const getIpnData = async (dateIpnText = '') => {
  dialogVisible.ipnLoading = true
  const res = await getPartCodeIpnData({ dateIpn: dialogVisible.type, dateIpnText })
  dialogVisible.options.ipn = res
  dialogVisible.ipnLoading = false
}

// 切换 IPN / Dervice_IPN
const typeChange = () => {
  dialogVisible.form.ipn = ''
  dialogVisible.form.mesSpec = ''
  getIpnData()
}

// 远程搜索 IPN
const remoteMethod = (query) => {
  axiosCancel()
  getIpnData(query)
}

// 获取品名
const getMesData = async (val) => {
  const res = await getPartCodeMesData({ dateIpn: dialogVisible.type, dateIpnText: val })
  if (res === 0) {
    proxy.$modal.msgError('未查询到IPN对应的SPEC1不存在或者未维护料号对应关系,请确认！')
  } else {
    dialogVisible.form.mesSpec = res.MES_SPEC
  }
}

// 新增/编辑
const addRoEditData = async (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.mesSpec}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
  await getIpnData()
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
        res = await addPartCodeData(dialogVisible.form)
      } else {
        res = await editPartCodeData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res === 1) {
        proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
        dialogVisible.open = false
        getTableData()
      } else if (res === 2) {
        proxy.$modal.msgError(proxy.$t('common.operationFail'))
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
  if (row.enabled === 'Y') {
    return proxy.$modal.msgWarning(proxy.$t('common.enableFailMsg'))
  }
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delPartCodeData({ id: row.id })
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
const showLog = async ({ id, mesSpec }) => {
  logDialogVisible.title = `${mesSpec} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getPartCodeLog({ id })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/MntnMaterials/MaterialsExport', { pageSize: total.value })
}

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/prodMnt/MntnMaterials/MaterialsImportData'
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
.dialog-type {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}

.loading-path .dot1 {
  transform: translate(3.75px, 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
}
.loading-path .dot2 {
  transform: translate(calc(100% - 3.75px), 3.75px);
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.4s;
}
.loading-path .dot3 {
  transform: translate(3.75px, calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 1.2s;
}
.loading-path .dot4 {
  transform: translate(calc(100% - 3.75px), calc(100% - 3.75px));
  fill: var(--el-color-primary);
  animation: custom-spin-move 1s infinite linear alternate;
  opacity: 0.3;
  animation-delay: 0.8s;
}
@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
@keyframes custom-spin-move {
  to {
    opacity: 1;
  }
}
</style>
