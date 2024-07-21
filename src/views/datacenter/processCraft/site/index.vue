<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:processCraft:site:add']" @click="addRoEditRoCopyData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:processCraft:site:edit']"
        @click="addRoEditRoCopyData('edit', selectData[0])"
        >{{ $t('btn.edit') }}
      </el-button>
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:processCraft:site:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}
      </el-button>
      <el-button
        color="#626aef"
        plain
        icon="DocumentCopy"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:processCraft:site:copy']"
        @click="addRoEditRoCopyData('copy', selectData[0])"
        >{{ $t('btn.copy') }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:processCraft:site:export']" @click="dowloadData">
        {{ $t('btn.export') }}
      </el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:processCraft:site:import']" @click="uploadData">
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
        v-hasPermi="['datacenter:product:site:edit']"
        @click="addRoEditRoCopyData('edit', row)">
        {{ $t('btn.edit') }}
      </el-button>
      <el-button size="small" icon="DocumentCopy" text v-hasPermi="['datacenter:processCraft:site:copy']" @click="addRoEditRoCopyData('copy', row)">
        {{ $t('btn.copy') }}
      </el-button>
      <el-button type="danger" size="small" icon="Delete" text v-hasPermi="['datacenter:processCraft:site:remove']" @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:processCraft:site:history']" @click="showLog(row)">
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
  <!-- 新增/编辑/更新弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="400" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="80">
      <el-form-item :label="$t('site.siteType')" prop="stationType">
        <el-select
          v-model="dialogVisible.form.stationType"
          filterable
          remote
          :remote-method="remoteMethodStationType"
          clearable
          :loading="dialogVisible.loading.stationType"
          :placeholder="$t('common.selectTip')">
          <el-option
            v-for="item in dialogVisible.options.stationType"
            :key="item.stationType"
            :label="item.stationType"
            :value="item.stationType" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('craft.type')" prop="processType">
        <el-select v-model="dialogVisible.form.processType" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.processType" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('craft.value')" prop="value">
        <el-input v-model="dialogVisible.form.value" :placeholder="$t('common.inputTip')" />
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
      <el-table-column property="id" label="ID" fixed="left" width="100" />
      <el-table-column property="stationType" :label="$t('site.siteType')" width="100" />
      <el-table-column property="processType" :label="$t('craft.type')" />
      <el-table-column property="value" :label="$t('craft.value')" width="120" />
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
      <el-table-column property="OPTION1" :label="$t('part.OPTION1')" width="100" />
    </el-table>
  </el-dialog>
</template>

<script setup name="site">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getToken } from '@/utils/auth'
import {
  getSiteData,
  addSiteData,
  editSiteData,
  copySiteData,
  delSiteData,
  getSiteLog,
  getSiteStationtype,
  axiosCancel
} from '@/api/datacenter/processCraft/site'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: 'ID', prop: 'id', fixed: 'left', visible: true, width: 100, sortable: true },
  { key: 2, label: proxy.$t('site.siteType'), prop: 'stationType', visible: true, sortable: true },
  { key: 3, label: proxy.$t('craft.type'), prop: 'processType', visible: true, sortable: true },
  { key: 4, label: proxy.$t('craft.value'), prop: 'value', visible: true, sortable: true },
  { key: 5, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, sortable: true },
  { key: 6, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 160 },
  { key: 7, label: proxy.$t('common.createEmpno'), prop: 'createEmpno', visible: true, sortable: true },
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
    const res = await getSiteData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editSiteData({ id: row.id, enabled: flag })
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
    stationType: '',
    processType: '',
    value: ''
  },
  options: {
    stationType: [],
    processType: ['工艺方式', '料号前缀']
  },
  rules: {
    stationType: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    processType: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    value: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  },
  loading: {
    stationType: false
  }
})

// 获取站点类型
const remoteMethodStationType = async (value) => {
  if (!value) return
  if (value.length < 2) return proxy.$modal.msgWarning(`${proxy.$t('hour.hasCount')}：2`)
  axiosCancel()
  const res = await getSiteStationtype({ textData: value })
  dialogVisible.options.stationType = res
}

// 新增/编辑/复制
const addRoEditRoCopyData = (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = type === 'edit' ? `${proxy.$t('btn.edit')} ${data.id}` : `${proxy.$t('btn.copy')} ${data.id}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      if (i === 'ct' || i === 'human' || i === 'workhours' || i === 'uph') {
        dialogVisible.form[i] = Number(data[i])
      } else {
        dialogVisible.form[i] = data[i]
      }
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
      if (dialogVisible.title.includes(proxy.$t('btn.add'))) {
        res = await addSiteData(dialogVisible.form)
      } else if (dialogVisible.title.includes(proxy.$t('btn.copy'))) {
        res = await copySiteData({ id: dialogVisible.id, ...dialogVisible.form })
      } else {
        res = await editSiteData({ id: dialogVisible.id, ...dialogVisible.form })
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
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delSiteData({ id: row.id })
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
    const res = await getSiteLog({ id })
    console.log(res)
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/ProcessTechnology/ShowStationExport', { pageSize: total.value })
}

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/prodMnt/ProcessTechnology/StationImportData'
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
