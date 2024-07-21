<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:hour:add']" @click="addRoEditRoCopyData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:hour:edit']"
        @click="addRoEditRoCopyData('edit', selectData[0])"
        >{{ $t('btn.edit') }}
      </el-button>
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:hour:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}
      </el-button>
      <el-button
        color="#626aef"
        plain
        icon="DocumentCopy"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:hour:copy']"
        @click="addRoEditRoCopyData('copy', selectData[0])"
        >{{ $t('btn.copy') }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:hour:export']" @click="dowloadData">
        {{ $t('btn.export') }}
      </el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:product:hour:import']" @click="uploadData">
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
        v-hasPermi="['datacenter:product:hour:edit']"
        @click="addRoEditRoCopyData('edit', row)">
        {{ $t('btn.edit') }}
      </el-button>
      <el-button size="small" icon="DocumentCopy" text v-hasPermi="['datacenter:product:hour:copy']" @click="addRoEditRoCopyData('copy', row)">
        {{ $t('btn.copy') }}
      </el-button>
      <el-button type="danger" size="small" icon="Delete" text v-hasPermi="['datacenter:product:hour:remove']" @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:hour:history']" @click="showLog(row)">
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
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="800" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" inline label-width="120">
      <el-form-item :label="$t('part.IPN')" prop="ipn">
        <el-select
          v-model="dialogVisible.form.ipn"
          filterable
          remote
          :remote-method="remoteMethodIpn"
          clearable
          :loading="dialogVisible.loading.ipn"
          :placeholder="$t('common.selectTip')"
          @change="ipnChange">
          <el-option v-for="item in dialogVisible.options.ipn" :key="item.IPN" :label="item.IPN" :value="item.IPN" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('hour.desc')" prop="desc1">
        <el-input
          type="textarea"
          :rows="2"
          :autosize="{ minRows: 2, maxRows: 4 }"
          readonly
          v-model="dialogVisible.form.desc1"
          :placeholder="$t('common.autoTip')" />
      </el-form-item>
      <el-form-item :label="$t('hour.client')" prop="model">
        <el-select
          v-model="dialogVisible.form.model"
          filterable
          remote
          :remote-method="remoteMethodModel"
          clearable
          :loading="dialogVisible.loading.model"
          :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.model" :key="item.MODEL" :label="item.MODEL" :value="item.MODEL" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('model.dutyofmodel')" prop="dutyofmodel">
        <el-select v-model="dialogVisible.form.dutyofmodel" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.dutyofmodel" :key="item.nickName" :label="item.nickName" :value="item.nickName" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('hour.remark')" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="dialogVisible.form.remark"
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('hour.ct')" prop="ct">
        <el-input-number :min="0" v-model="dialogVisible.form.ct" :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('hour.human')" prop="human">
        <el-input-number :min="0" v-model="dialogVisible.form.human" :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('hour.workhours')" prop="workhours">
        <el-input-number :min="0" v-model="dialogVisible.form.workhours" :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('hour.uph')" prop="uph">
        <el-input-number :min="0" v-model="dialogVisible.form.uph" :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('hour.side')" prop="side">
        <el-input v-model="dialogVisible.form.side" :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('line.lineName')" prop="line">
        <el-select v-model="dialogVisible.form.line" filterable clearable :placeholder="$t('common.selectTip')" @click="lineChange">
          <el-option v-for="item in dialogVisible.options.line" :key="item.LINE" :label="item.LINE" :value="item.LINE" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('hour.stationtype')" prop="stationtype">
        <el-select
          v-model="dialogVisible.form.stationtype"
          filterable
          remote
          :remote-method="remoteMethodStationtype"
          clearable
          :loading="dialogVisible.loading.stationtype"
          :placeholder="$t('common.selectTip')">
          <el-option
            v-for="item in dialogVisible.options.stationtype"
            :key="item.STATION_TYPE"
            :label="item.STATION_TYPE"
            :value="item.STATION_TYPE" />
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
      <el-table-column property="IPN" :label="$t('part.IPN')" width="120" />
      <el-table-column property="DESC1" :label="$t('hour.desc')" width="160" />
      <el-table-column property="MODEL" :label="$t('hour.client')" />
      <el-table-column property="DUTYOFMODEL" :label="$t('model.dutyofmodel')" width="120" />
      <el-table-column property="REMARK" :label="$t('hour.remark')" />
      <el-table-column property="CT" :label="$t('hour.ct')" />
      <el-table-column property="HUMAN" :label="$t('hour.human')" />
      <el-table-column property="WORKHOURS" :label="$t('hour.workhours')" />
      <el-table-column property="UPH" :label="$t('hour.uph')" />
      <el-table-column property="SIDE" :label="$t('hour.side')" width="100" />
      <el-table-column property="LINE" :label="$t('line.lineName')" width="120" />
      <el-table-column property="STATIONTYPE" :label="$t('hour.stationtype')" width="120" />
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
      <el-table-column property="OPTION2" :label="$t('part.OPTION2')" width="100" />
      <el-table-column property="PLANT" :label="$t('part.PLANT')" />
      <el-table-column property="SITE" :label="$t('site.site')" />
    </el-table>
  </el-dialog>
</template>

<script setup name="hour">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getToken } from '@/utils/auth'
import {
  getHourData,
  addHourData,
  editHourData,
  copyHourData,
  delHourData,
  getHourLog,
  getHourIpnData,
  getHourModelData,
  getHourDutyofmodelData,
  getHourLineData,
  getHourStationtypeData
} from '@/api/datacenter/product/hour'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: 'ID', prop: 'id', fixed: 'left', visible: true, width: 100, sortable: true },
  { key: 2, label: proxy.$t('part.IPN'), prop: 'ipn', visible: true, sortable: true, width: 140 },
  { key: 3, label: proxy.$t('hour.desc'), prop: 'desc1', visible: true, sortable: true, width: 160 },
  { key: 4, label: proxy.$t('hour.client'), prop: 'model', visible: true, sortable: true, width: 100 },
  { key: 5, label: proxy.$t('model.dutyofmodel'), prop: 'dutyofmodel', visible: true, sortable: true, width: 120 },
  { key: 6, label: proxy.$t('hour.remark'), prop: 'remark', visible: true, sortable: true },
  { key: 7, label: proxy.$t('hour.ct'), prop: 'ct', visible: true, sortable: true, width: 120 },
  { key: 8, label: proxy.$t('hour.human'), prop: 'human', visible: true, sortable: true },
  { key: 9, label: proxy.$t('hour.workhours'), prop: 'workhours', visible: true, sortable: true },
  { key: 10, label: proxy.$t('hour.uph'), prop: 'uph', visible: true, sortable: true },
  { key: 11, label: proxy.$t('hour.side'), prop: 'side', visible: true, sortable: true, width: 120 },
  { key: 12, label: proxy.$t('line.lineName'), prop: 'line', visible: true, sortable: true, width: 140 },
  { key: 13, label: proxy.$t('hour.stationtype'), prop: 'stationtype', visible: true, sortable: true, width: 120 },
  { key: 14, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, width: 100, sortable: true },
  { key: 15, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 180 },
  { key: 16, label: proxy.$t('common.createEmpno'), prop: 'createEmpno', visible: true, sortable: true, width: 100 },
  { key: 17, label: proxy.$t('common.createTime'), prop: 'createTime', visible: true, sortable: true, width: 180 },
  { key: 18, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 19, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 160 }
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
    const res = await getHourData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editHourData({ id: row.id, enabled: flag })
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
    ipn: '',
    desc1: '',
    model: '',
    dutyofmodel: '',
    remark: '',
    ct: 0,
    human: 0,
    workhours: 0,
    uph: 0,
    side: '',
    line: '',
    stationtype: ''
  },
  options: {
    ipn: [],
    model: [],
    dutyofmodel: [],
    line: [],
    stationtype: []
  },
  rules: {
    remark: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    ct: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    human: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    side: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    ipn: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    model: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    dutyofmodel: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    line: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    stationtype: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }]
  },
  loading: {
    ipn: false,
    model: false,
    line: false,
    stationtype: false
  }
})

// 获取料号
const remoteMethodIpn = async (query) => {
  if (query !== '') {
    if (query.length < 4) return proxy.$modal.msgWarning(`${proxy.$t('hour.hasCount')}：4`)
    dialogVisible.loading.ipn = true
    const res = await getHourIpnData({ ipn: query })
    dialogVisible.options.ipn = res
    dialogVisible.loading.ipn = false
  } else {
    dialogVisible.options.ipn = []
  }
}

// 选取料号带入备注
const ipnChange = (query) => {
  dialogVisible.form.desc1 = dialogVisible.options.ipn.filter((item) => item.IPN === query)[0].SPEC2
}

// 获取客户
const remoteMethodModel = async (query) => {
  if (query !== '') {
    if (query.length < 3) return proxy.$modal.msgWarning(`${proxy.$t('hour.hasCount')}：3`)
    dialogVisible.loading.model = true
    const res = await getHourModelData({ model: query })
    dialogVisible.options.model = res
    dialogVisible.loading.model = false
  } else {
    dialogVisible.options.model = []
  }
}

// 获取机种负责人
const getDutyofmodel = async () => {
  const res = await getHourDutyofmodelData()
  dialogVisible.options.dutyofmodel = res
}
getDutyofmodel()

// 获取线别
const getLine = async () => {
  const res = await getHourLineData()
  dialogVisible.options.line = res
}
getLine()

// 选取线体重置站点
const lineChange = () => {
  dialogVisible.form.stationtype = ''
  dialogVisible.options.stationtype = ''
}

// 获取站点
const remoteMethodStationtype = async (query) => {
  if (query !== '') {
    if (query.length < 2) return proxy.$modal.msgWarning(`${proxy.$t('hour.hasCount')}：2`)
    dialogVisible.loading.stationtype = true
    const res = await getHourStationtypeData({ stationtype: query, line: dialogVisible.form.line })
    dialogVisible.options.stationtype = res
    dialogVisible.loading.stationtype = false
  } else {
    dialogVisible.options.stationtype = []
  }
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
        res = await addHourData(dialogVisible.form)
      } else if (dialogVisible.title.includes(proxy.$t('btn.copy'))) {
        res = await copyHourData({ id: dialogVisible.id, ...dialogVisible.form })
      } else {
        res = await editHourData({ id: dialogVisible.id, ...dialogVisible.form })
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
  const res = await delHourData({ id: row.id })
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
    const res = await getHourLog({ id })
    console.log(res)
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/MntnlStandard/StandardTime/StandardTimeExport', { pageSize: total.value })
}

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/MntnlStandard/StandardTime/StandardTimeImport'
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
