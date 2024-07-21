<template>
  <div style="padding: 10px;">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('labelmanagement.model[1]')" prop="model">
        <el-select v-model="queryParams.model" :placeholder="$t('labelmanagement.model[1]')" clearable filterable
          style="width: 160px" @change="changeModel">
          <el-option v-for="item in modelOptions" :key="item.model" :label="item.model" :value="item.model" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labelmanagement.ipn[1]')" prop="ipn">
        <el-select v-model="queryParams.ipn" :placeholder="$t('labelmanagement.ipn[1]')" clearable filterable
          style="width: 160px" @change="changeIPN">
          <el-option v-for="item in ipnOptions" :key="item.ipn" :label="item.ipn" :value="item.ipn" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labelmanagement.labelType[1]')" prop="labelTypeId">
        <el-select v-model="queryParams.labelTypeId" :placeholder="$t('labelmanagement.labelType[1]')" clearable
          filterable style="width: 160px" @change="changeLabelType">
          <el-option v-for="item in labelTypeOptions" :key="item.id"
            :label="`${item.labelType || ''}.${item.ipn || ''}.${item.labelTypeDesc || ''}`" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labelmanagement.stationType[1]')" prop="stationType">
        <div>
          <el-select v-model="queryParams.stationTypeIndex" :placeholder="$t('labelmanagement.stationType[1]')"
            clearable filterable style="width: 160px" @change="changeStationType">
            <el-option v-for="(item, index) in stationTypeOptions" :key="index" :label="item.stationType"
              :value="index" />
          </el-select>
          <span style="padding-left: 0.5em;">{{ stationTypeDesc }}</span>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb2">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="handleAdd" v-hasPermi="['business:labelstation:add']">
          <span>{{ $t('btn.add') }}</span>
        </el-button>
        <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['business:labelstation:import']">
          <span>{{ $t('btn.import') }}</span>
        </el-button>
      </el-col>

      <right-toolbar v-model:showSearch="showSearch" v-model:columns="columns" ellipsis
        @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="tableRef" v-loading="listLoading" :data="tableList" :height="tableHeight" border stripe>
      <el-table-column type="index" align="center" width="50" />
      <el-table-column :label="$t('labelmanagement.model[0]')" align="center" prop="model" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('model')" v-if="columns.showColumn('model')" />
      <el-table-column :label="$t('labelmanagement.ipn[0]')" align="center" prop="ipn" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('ipn')" key="ipn" v-if="columns.showColumn('ipn')" />
      <el-table-column :label="$t('labelmanagement.stationType[0]')" align="center" prop="stationType" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('stationType')" v-if="columns.showColumn('stationType')" />
      <el-table-column :label="$t('labelmanagement.labelType[0]')" align="center" prop="labelType" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('labelType')" v-if="columns.showColumn('labelType')" />
      <el-table-column :label="$t('labelmanagement.labelName[0]')" align="center" prop="labelName" min-width="200"
        :show-overflow-tooltip="columns.showTooltip('labelName')" v-if="columns.showColumn('labelName')" />
      <el-table-column :label="$t('labelmanagement.labelParams[0]')" align="center" prop="labelParams" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('labelParams')" v-if="columns.showColumn('labelParams')" />
      <el-table-column :label="$t('labelmanagement.labelDesc[0]')" align="center" prop="labelDesc" min-width="180"
        :show-overflow-tooltip="columns.showTooltip('labelDesc')" v-if="columns.showColumn('labelDesc')" />
      <el-table-column :label="$t('labelmanagement.printerName[0]')" align="center" prop="printerName" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('printerName')" v-if="columns.showColumn('printerName')" />
      <el-table-column :label="$t('labelmanagement.labelSrvIp[0]')" align="center" prop="labelSrvIp" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('labelSrvIp')" v-if="columns.showColumn('labelSrvIp')" />
      <el-table-column :label="$t('labelmanagement.labelDlUrl[0]')" align="center" prop="labelDlUrl" min-width="200"
        :show-overflow-tooltip="columns.showTooltip('labelDlUrl')" v-if="columns.showColumn('labelDlUrl')" />
      <el-table-column :label="$t('labelmanagement.enabled[0]')" align="center" prop="enabled" width="100"
        :show-overflow-tooltip="columns.showTooltip('enabled')" v-if="columns.showColumn('enabled')" />
      <el-table-column :label="$t('labelmanagement.updateEmpno')" align="center" prop="updateEmpno" width="120"
        :show-overflow-tooltip="columns.showTooltip('updateEmpno')" v-if="columns.showColumn('updateEmpno')">
        <template #default="scope">
          <span>{{ scope.row.updateEmpno || scope.row.createEmpno }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('labelmanagement.updateTime')" align="center" prop="updateTime" width="160"
        :show-overflow-tooltip="columns.showTooltip('updateTime')" v-if="columns.showColumn('updateTime')">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed='right' :label="$t('general.Operational')" align="center" width="150"
        class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button text size="small" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['business:labelstation:update']">{{ $t('btn.edit') }}</el-button>
          <el-button text size="small" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['business:labelstation:remove']">{{ $t('btn.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="openBase" width="900px" append-to-body :close-on-click-modal="false"
      @closed="closeBase">
      <LuxForm ref="formBaseRef" :model="formBase" :rules="rulesBase" label-width="130px" @validate="formValidate"
        :data-report-info="JSON.stringify({
          menu: 'labelmanagement:labelbase',
          form: 'labelbase',
          update: !!formBase.id,
          submit: isBaseSumbit
        })">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('labelmanagement.model[1]')" prop="model">
              <el-input v-if="formBase.id" :model-value="formBase.model" placeholder="" disabled />
              <el-select v-else v-model="formBase.model" placeholder="" filterable style="width: 100%"
                @change="changeModelForm" :disabled="!!formBase.id">
                <el-option v-for="item in modelOptions" :key="item.model" :label="item.model" :value="item.model" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('labelmanagement.ipn[1]')" prop="ipn">
              <el-input v-if="formBase.id" :model-value="formBase.ipn" placeholder="" disabled />
              <el-select v-else v-model="formBase.ipn" placeholder="" clearable filterable style="width: 100%"
                @change="changeIPNForm" :disabled="!!formBase.id">
                <el-option v-for="item in ipnOptionsForm" :key="item.ipn" :label="item.ipn" :value="item.ipn" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('labelmanagement.labelType[1]')" prop="labelType">
              <el-select v-model="formBase.labelTypeId" placeholder="" filterable style="width: 100%"
                @change="changeLabelTypeForm">
                <el-option v-for="item in labelTypeOptionsForm" :key="item.id"
                  :label="`${item.labelType || ''}.${item.ipn || ''}.${item.labelTypeDesc || ''}`" :value="item.id" />
                <!-- 不存在的选项处理 -->
                <el-option
                  v-if="!labelTypeOptionsForm.some(e => e.labelType === formBase.labelType && e.labelName === formBase.labelName)"
                  :label="formBase.labelType" :value="-1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('labelmanagement.stationType[1]')" prop="stationType">
              <el-input v-if="formBase.id" :model-value="formBase.stationType" placeholder="" disabled />
              <el-select v-else v-model="formBase.stationTypeIndex" placeholder="" clearable filterable
                style="width: 100%" @change="changeStationTypeForm" :disabled="!!formBase.id">
                <el-option v-for="(item, index) in stationTypeOptions" :key="index" :label="item.stationType"
                  :value="index" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('labelmanagement.labelName[1]')" prop="labelName">
              <el-input v-model.trim="formBase.labelName" placeholder="" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('labelmanagement.typeFlag[1]')" prop="labelParams">
              <el-input v-model.trim="formBase.labelParams" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="$t('labelmanagement.printerName[1]')" prop="printerName">
              <el-input v-model.trim="formBase.printerName" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('labelmanagement.labelDesc[1]')" prop="labelDesc">
          <el-input type="textarea" v-model="formBase.labelDesc" placeholder="" />
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelBase">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="baseFormLoading" @click="submitFormBase">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload name="file" ref="uploadRef" :limit="1" accept=".xlsx,.xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">
          <i18n-t keypath="upload.fileupload">
            <template #op>
              <em>{{ $t('upload.clicktoupload') }}</em>
            </template>
          </i18n-t>
        </div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <span>{{ $t('upload.importformat', ['xls、xlsx']) }}</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate">{{ $t('upload.downloadTemplate') }}</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="upload.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitFileForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="labelbase">
import { getToken } from '@/utils/auth'
import { listModel, listPartLabelType, listLabelTypeByStation, listLabelStationType } from '@/api/mescommon/mesget'
import { listLabelStation, addLabelStation, updateLabelStation, deleteLabelStation } from '@/api/business/labelMnt/labelmanagement'
const { proxy } = getCurrentInstance()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const showSearch = ref(true)

const state = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    model: undefined,
    ipn: undefined,
    labelType: undefined,
    labelTypeId: undefined,
    stationType: undefined,
    stationTypeIndex: undefined
  },
  formBase: {}
})
const { queryParams, formBase } = toRefs(state)

const rulesBase = computed(() => {
  return {
    model: [{ required: true, message: proxy.$t('labelmanagement.model[3]'), trigger: 'change' }],
    ipn: [{ required: true, message: proxy.$t('labelmanagement.ipn[3]'), trigger: 'change' }],
    labelType: [{ required: true, message: proxy.$t('labelmanagement.labelType[3]'), trigger: 'change' }],
    labelName: [{ required: true, message: proxy.$t('labelmanagement.labelName[3]'), trigger: 'change' }],
  }
})

const modelOptions = ref([])
function getModelOptions() {
  listModel().then((response) => {
    modelOptions.value = response.data
  })
}

const ipnOptions = ref([])
function getIPNOptions() {
  listPartLabelType({ model: queryParams.value.model }).then((response) => {
    ipnOptions.value = response.data
  })
}

const labelTypeOptions = ref([])
function getLabelTypeOptions() {
  listLabelTypeByStation({ model: queryParams.value.model, ipn: queryParams.value.ipn }).then((response) => {
    labelTypeOptions.value = response.data
  })
}

const stationTypeDesc = ref('')
const stationTypeOptions = ref([])
function getStationType() {
  listLabelStationType().then((response) => {
    stationTypeOptions.value = response.data
  })
}

function changeModel(v) {
  queryParams.value.ipn = undefined
  queryParams.value.labelType = undefined
  queryParams.value.labelTypeId = undefined
  handleQuery()
  getIPNOptions()
  getLabelTypeOptions()
}
function changeIPN(v) {
  const ipn = labelTypeOptions.value.find(e => e.id == queryParams.value.labelTypeId)?.ipn
  if (v && (!ipn || ipn != v)) {
    queryParams.value.labelType = undefined
    queryParams.value.labelTypeId = undefined
  }
  handleQuery()
  getLabelTypeOptions()
}
function changeLabelType(v) {
  const cur = labelTypeOptions.value.find(e => e.id == v)
  queryParams.value.labelType = cur?.labelType || undefined
  handleQuery()
}
function changeStationType(v) {
  const cur = stationTypeOptions.value[v]
  queryParams.value.stationType = cur?.stationType || undefined
  handleQuery()
  stationTypeDesc.value = cur?.stationTypeDesc || ''
}

// 表格列配置项
const columns = reactive([
  { key: 'model', label: proxy.$t('labelmanagement.model[0]'), prop: 'model', visible: true, showTooltip: true },
  { key: 'ipn', label: proxy.$t('labelmanagement.ipn[0]'), prop: 'ipn', visible: true, showTooltip: true },
  { key: 'stationType', label: proxy.$t('labelmanagement.stationType[0]'), prop: 'stationType', visible: true, showTooltip: true },
  { key: 'labelType', label: proxy.$t('labelmanagement.labelType[0]'), prop: 'labelType', visible: true, showTooltip: true },
  { key: 'labelName', label: proxy.$t('labelmanagement.labelName[0]'), prop: 'labelName', visible: true, showTooltip: true },
  { key: 'labelParams', label: proxy.$t('labelmanagement.labelParams[0]'), prop: 'labelParams', visible: true, showTooltip: true },
  { key: 'labelDesc', label: proxy.$t('labelmanagement.labelDesc[0]'), prop: 'labelDesc', visible: true, showTooltip: true },
  { key: 'printerName', label: proxy.$t('labelmanagement.printerName[0]'), prop: 'printerName', visible: true, showTooltip: true },
  { key: 'labelSrvIp', label: proxy.$t('labelmanagement.labelSrvIp[0]'), prop: 'labelSrvIp', visible: false, showTooltip: true },
  { key: 'labelDlUrl', label: proxy.$t('labelmanagement.labelDlUrl[0]'), prop: 'labelDlUrl', visible: false, showTooltip: true },
  { key: 'enabled', label: proxy.$t('labelmanagement.enabled[0]'), prop: 'enabled', visible: true, showTooltip: true },
  { key: 'updateEmpno', label: proxy.$t('labelmanagement.updateEmpno'), prop: 'updateEmpno', visible: true, showTooltip: true },
  { key: 'updateTime', label: proxy.$t('labelmanagement.updateTime'), prop: 'updateTime', visible: true, showTooltip: true },
])

const tableTop = ref(0)
const tableRef = ref(null)
const tableHeight = ref(null)
function resizeTableHeight() {
  if (!tableRef.value) return

  tableRef.value._timer && clearTimeout(tableRef.value._timer)
  if (props.show) {
    tableRef.value._timer = setTimeout(() => {
      let height = window.innerHeight - tableRef.value.$el.getBoundingClientRect().top - 44 - 30 - 10 - 0.4
      height = Math.floor(height)
      height = Math.max(height, 100)
      tableHeight.value = height + 'px'
    }, 50)
  } else {
    tableRef.value._timer = 0
  }
}
let appMain
onMounted(() => {
  resizeTableHeight()

  // 监听页面容器尺寸变化
  let arr = document.getElementsByClassName('app-main')
  let appMain = arr[0]
  if (appMain) {
    appMain._ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        resizeTableHeight()
      }
    })

    appMain._ro.observe(appMain)
  }
})
onBeforeUnmount(() => {
  // 取消监听页面容器尺寸变化
  if (appMain && appMain._ro) appMain._ro.disconnect()
})
onUpdated(() => {
  // 页面更新后 记录table当前位置
  tableTop.value = tableRef.value.$el.getBoundingClientRect().top
})
// 监听table位置变化
watch(tableTop, (nVal, oVal) => {
  resizeTableHeight()
})

const listLoading = ref(false)
const tableList = ref([])
const total = ref(0)

/** 查询列表 */
function getList() {
  listLoading.value = true
  listLabelStation(queryParams.value).then((response) => {
    listLoading.value = false
    if (response.code == 200) {
      tableList.value = response.data.result
      total.value = response.data.totalNum
    } else {
      tableList.value = []
      total.value = 0
    }
  }).catch(() => {
    listLoading.value = false
  })
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryForm')
  handleQuery()
}

// 弹出层
const title = ref('')
const openBase = ref(false)
const baseFormLoading = ref(false)
const formBaseRef = ref(null)
const isBaseSumbit = ref(false)

// 取消按钮
function cancelBase() {
  openBase.value = false
}
// 弹窗关闭
function closeBase() {
  resetBase()
}

const ipnOptionsForm = ref([])
async function getIPNOptionsForm() {
  const response = await listPartLabelType({ model: formBase.value.model })
  ipnOptionsForm.value = [{ ipn: '*' }, ...response.data]
}
const labelTypeOptionsForm = ref([])
async function getLabelTypeOptionsForm() {
  const response = await listLabelTypeByStation({ model: formBase.value.model, ipn: formBase.value.ipn })
  labelTypeOptionsForm.value = response.data
}

let propIngnore = []

function formValidate(prop, valid, msg) {
  if (propIngnore.includes(prop) && !valid) {
    formBaseRef.value.$form.clearValidate([prop])
    const index = propIngnore.indexOf(prop)
    propIngnore.splice(index, 1)
  }
}

function changeModelForm(v) {
  formBase.value.ipn = '*'
  formBase.value.labelType = null
  formBase.value.labelTypeId = null
  formBase.value.labelName = null
  formBase.value.labelDesc = null
  getIPNOptionsForm()
  getLabelTypeOptionsForm()
}
function changeIPNForm(v) {
  const ipn = labelTypeOptionsForm.value.find(e => e.id == formBase.value.labelTypeId)?.ipn
  if (v && (!ipn || ipn != v)) {
    propIngnore = ['labelType', 'labelName']
    formBase.value.labelType = null
    formBase.value.labelTypeId = null
    formBase.value.labelName = null
    formBase.value.labelDesc = null
  }
  getLabelTypeOptionsForm()
}
function changeLabelTypeForm(v) {
  const cur = labelTypeOptionsForm.value.find(e => e.id == v)
  if (cur?.labelName) formBase.value.labelName = cur?.labelName
  if (cur?.labelTypeDesc) formBase.value.labelDesc = cur?.labelTypeDesc
  formBase.value.labelType = cur?.labelType || null
}
function changeStationTypeForm(v) {
  const cur = stationTypeOptions.value[v]
  formBase.value.stationType = cur?.stationType || null
}

// 类型表单重置
function resetBase() {
  formBase.value = {
    id: null,
    model: null,
    ipn: null,
    labelType: null,
    labelTypeId: null,
    stationType: null,
    stationTypeIndex: null,
    labelName: null,
    labelParams: null,
    printerName: null,
    labelDesc: null
  }
  proxy.resetLuxForm('formBaseRef')
}

async function handleAdd() {
  resetBase()

  formBase.value.model = queryParams.value.model || null
  formBase.value.ipn = queryParams.value.ipn || '*'
  formBase.value.labelType = queryParams.value.labelType || null
  formBase.value.labelTypeId = queryParams.value.labelTypeId || null
  formBase.value.stationType = queryParams.value.stationType || null
  const stationTypeIndex = stationTypeOptions.value.findIndex(e => e.stationType === formBase.value.stationType)
  formBase.value.stationTypeIndex = stationTypeIndex > -1 ? stationTypeIndex : null

  openBase.value = true
  title.value = proxy.$t('labelmanagement.AddLabelBase')

  getIPNOptionsForm()

  await getLabelTypeOptionsForm()
  const curLabelType = labelTypeOptionsForm.value.find(e => e.id === formBase.value.labelTypeId)
  formBase.value.labelName = curLabelType?.labelName || null
  formBase.value.labelDesc = curLabelType?.labelTypeDesc || null
}
async function handleUpdate(row) {
  resetBase()
  formBase.value = JSON.parse(JSON.stringify(row))
  const stationTypeIndex = stationTypeOptions.value.findIndex(e => e.stationType === row.stationType)
  formBase.value.stationTypeIndex = stationTypeIndex > -1 ? stationTypeIndex : null
  openBase.value = true
  title.value = proxy.$t('labelmanagement.UpdateLabelBase')

  await getLabelTypeOptionsForm()
  if (row.labelType) {
    formBase.value.labelTypeId = labelTypeOptionsForm.value.find(e => e.labelType === row.labelType && e.labelName === row.labelName)?.id || -1
  }
}

function submitFormBase() {
  isBaseSumbit.value = true
  formBaseRef.value.$form.validate((valid) => {
    isBaseSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formBase.value))
      delete form.labelTypeId
      delete form.stationTypeIndex
      if (!form.ipn) form.ipn = '*'
      baseFormLoading.value = true
      if (form.id) {
        updateLabelStation(form).then((response) => {
          baseFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('labelmanagement.UpdateOK'))
          openBase.value = false
          getList()
        }).catch(() => {
          baseFormLoading.value = false
        })
      } else {
        addLabelStation(form).then((response) => {
          baseFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('labelmanagement.AddOK'))
          openBase.value = false
          getList()
        }).catch(() => {
          baseFormLoading.value = false
        })
      }
    }
  })
}

function handleDelete(row) {
  proxy.$modal
    .confirm(proxy.$t('labelmanagement.ConfirmDelete'))
    .then(() => {
      listLoading.value = true
      return deleteLabelStation(row)
    })
    .then(() => {
      listLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('labelmanagement.DeleteOK'))
      getList()
    })
    .catch(() => {
      listLoading.value = false
    })
}

/*** 导入参数 */
const upload = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: 'Bearer ' + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + '/labelmnt/labelmanagement/importData'
})
/** 导入按钮操作 */
function handleImport() {
  upload.title = 'Import'
  upload.open = true
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download('/mescommon/mesget/importTemplate?param=stationtypelabel')
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true
}
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  const { code, msg, data } = response
  upload.open = false
  upload.isUploading = false
  proxy.$refs['uploadRef'].clearFiles()
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + data.item1 + '</div>', proxy.$t('upload.importresult'), {
    dangerouslyUseHTMLString: true
  })
  getList()
}
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs['uploadRef'].submit()
}

getList()
getModelOptions()
getLabelTypeOptions()
getStationType()
</script>