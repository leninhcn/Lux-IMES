<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:siteMaterials:add']" @click="addRoEditData('add')">{{
        $t('btn.add')
      }}</el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:siteMaterials:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:siteMaterials:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}</el-button
      >
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:siteMaterials:export']" @click="dowloadData">{{
        $t('btn.export')
      }}</el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:product:siteMaterials:import']" @click="uploadData">{{
        $t('btn.import')
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
        v-hasPermi="['datacenter:product:siteMaterials:edit']"
        @click="addRoEditData('edit', row)"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button type="danger" size="small" icon="Delete" text v-hasPermi="['datacenter:product:siteMaterials:remove']" @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:siteMaterials:history']" @click="showLog(row)">
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
      <el-form-item :label="$t('site.stage')" prop="stage">
        <el-select v-model="dialogVisible.form.stage" @change="stageChange" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.stage" :key="item.STAGE" :label="item.STAGE" :value="item.STAGE" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('site.siteType')" prop="stationType">
        <el-select v-model="dialogVisible.form.stationType" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option
            v-for="item in dialogVisible.options.stationType"
            :key="item.STATION_TYPE"
            :label="item.STATION_TYPE"
            :value="item.STATION_TYPE" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('description.mesSpec')" prop="kpSpec">
        <el-select v-model="dialogVisible.form.kpSpec" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.kpSpec" :key="item.MES_SPEC" :label="item.MES_SPEC" :value="item.MES_SPEC" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('model.modelName')" prop="model">
        <el-select v-model="dialogVisible.form.model" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.model" :key="item.MODEL" :label="item.MODEL" :value="item.MODEL" />
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
      <el-table-column property="ID" label="ID" fixed="left" width="100" />
      <el-table-column property="MODEL" :label="$t('model.modelName')" />
      <el-table-column property="STATION_TYPE" :label="$t('site.siteType')" width="100" />
      <el-table-column property="STATION_DESC" :label="$t('site.siteDesc')" />
      <el-table-column property="KP_SPEC" :label="$t('description.mesSpec')" width="130" />
      <el-table-column property="KP_SPEC_DESC" :label="$t('description.erpSpec')" width="130" />
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
    </el-table>
  </el-dialog>
</template>

<script setup name="datacenterProductSiteMaterials">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getToken } from '@/utils/auth'
import {
  getSiteMaterialsData,
  addSiteMaterialsData,
  editSiteMaterialsData,
  delSiteMaterialsData,
  getSiteMaterialsLog,
  getSiteMaterialsEditStageData,
  getSiteMaterialsStageData,
  getSiteMaterialsTypeData,
  getSiteMaterialsModelData,
  getSiteMaterialsMesData
} from '@/api/datacenter/product/siteMaterials'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()
const a = () => {
  console.log(1)
}

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('model.modelName'), prop: 'model', visible: true, sortable: true },
  { key: 2, label: proxy.$t('site.siteType'), prop: 'stationType', visible: true, sortable: true },
  { key: 3, label: proxy.$t('site.siteDesc'), prop: 'stationDesc', visible: true, sortable: true },
  { key: 4, label: proxy.$t('description.mesSpec'), prop: 'kpSpec', visible: true, sortable: true },
  { key: 5, label: proxy.$t('description.erpSpec'), prop: 'kpSpecDesc', visible: true, sortable: true },
  { key: 6, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, width: 120, sortable: true },
  { key: 7, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 180 },
  { key: 8, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 9, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 210 }
])

// 筛选条件
const options = computed(() =>
  columns.filter(
    (item) =>
      !item.type &&
      item.label !== proxy.$t('common.isEnable') &&
      item.label !== proxy.$t('common.updateEmpno') &&
      item.label !== proxy.$t('common.updateTime')
  )
)

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
    const res = await getSiteMaterialsData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editSiteMaterialsData({ id: row.id, enabled: flag })
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
    stationType: '',
    model: '',
    kpSpec: ''
  },
  options: {
    stage: [],
    stationType: [],
    model: [],
    kpSpec: []
  },
  rules: {
    stage: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    stationType: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    model: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    kpSpec: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }]
  }
})

// 获取弹窗工段
const getStageData = async () => {
  const res = await getSiteMaterialsStageData()
  dialogVisible.options.stage = res
}
getStageData()

// 获取弹窗站点类型
const getStation = async (val) => {
  const res = await getSiteMaterialsTypeData({ stage: val })
  dialogVisible.options.stationType = res
}

// 获取弹窗品名
const getMes = async (val) => {
  const res = await getSiteMaterialsMesData({ stageName: val })
  dialogVisible.options.kpSpec = res
}

// 根据工段获取弹窗站点类型
const stageChange = (val) => {
  dialogVisible.form.stationType = ''
  dialogVisible.form.kpSpec = ''
  getStation(val)
  getMes(val)
}

// 获取弹窗机种
const getModelData = async () => {
  const res = await getSiteMaterialsModelData()
  dialogVisible.options.model = res
}
getModelData()

// 点击修改获取工段
const editGetStage = async (stationType) => {
  const res = await getSiteMaterialsEditStageData({ stationType })
  dialogVisible.form.stage = res[0].STAGE
}

// 新增/编辑
const addRoEditData = async (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
    await editGetStage(data.stationType)
    getStation(dialogVisible.form.stage)
    getMes(dialogVisible.form.stage)
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
        res = await addSiteMaterialsData(dialogVisible.form)
      } else {
        res = await editSiteMaterialsData({ id: dialogVisible.id, ...dialogVisible.form })
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
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delSiteMaterialsData({ id: row.id })
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
  logDialogVisible.title = `${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getSiteMaterialsLog({ id })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/prodModel/StationExport', { pageSize: total.value })
}

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/prodMnt/prodModel/StationImportData'
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

<style lang="scss" scoped></style>
