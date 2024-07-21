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
          style="width: 160px" @change="handleQuery">
          <el-option v-for="item in ipnOptions" :key="item.ipn" :label="item.ipn" :value="item.ipn" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labelmanagement.labelType[1]')" prop="labelType">
        <el-select v-model="queryParams.labelType" :placeholder="$t('labelmanagement.labelType[1]')" clearable
          filterable style="width: 160px" @change="handleQuery">
          <el-option v-for="item in labelTypeOptions" :key="item.typeName" :label="item.typeName"
            :value="item.typeName" />
        </el-select>
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
      </el-col>

      <right-toolbar v-model:showSearch="showSearch" v-model:columns="columns" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="tableRef" v-loading="listLoading" :data="tableList" :height="tableHeight" border stripe>
      <el-table-column type="index" align="center" width="50" />
      <el-table-column :label="$t('labelmanagement.model[0]')" align="center" prop="model" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('model')" v-if="columns.showColumn('model')" />
      <el-table-column :label="$t('labelmanagement.ipn[0]')" align="center" prop="ipn" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('ipn')" key="ipn" v-if="columns.showColumn('ipn')" />
      <el-table-column :label="$t('labelmanagement.labelType[0]')" align="center" prop="labelType" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('labelType')" v-if="columns.showColumn('labelType')" />
      <el-table-column :label="$t('labelmanagement.labelTypeDesc[0]')" align="center" prop="labelTypeDesc"
        min-width="180" :show-overflow-tooltip="columns.showTooltip('labelTypeDesc')"
        v-if="columns.showColumn('labelTypeDesc')" />
      <el-table-column :label="$t('labelmanagement.labelName[0]')" align="center" prop="labelName" min-width="180"
        :show-overflow-tooltip="columns.showTooltip('labelName')" v-if="columns.showColumn('labelName')">
        <template #default="scope">
          <el-button text size="small" :disabled="!scope.row.labelName" @click="downloadFile(scope.row)">
            <span>{{ scope.row.labelName }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :label="$t('labelmanagement.printerName[0]')" align="center" prop="printerName" min-width="140"
        :show-overflow-tooltip="columns.showTooltip('printerName')" v-if="columns.showColumn('printerName')" />
      <el-table-column :label="$t('labelmanagement.typeFlag[0]')" align="center" prop="typeFlag" min-width="100"
        :show-overflow-tooltip="columns.showTooltip('typeFlag')" v-if="columns.showColumn('typeFlag')" />
      <el-table-column :label="$t('labelmanagement.enabled[0]')" align="center" prop="enabled" width="100"
        :show-overflow-tooltip="columns.showTooltip('enabled')" v-if="columns.showColumn('enabled')" />
      <el-table-column :label="$t('labelmanagement.updateEmpno')" align="center" prop="updateEmpno" width="125"
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
          <div style="display: flex;">
            <!-- <el-button text size="small" icon="Download" :disabled="!scope.row.labelName"
              @click="downloadFile(scope.row)">{{ $t('btn.download') }}</el-button> -->
            <el-button text size="small" icon="Edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['business:labelstation:update']">{{ $t('btn.edit') }}</el-button>
            <el-button text size="small" icon="Delete" @click="handleDelete(scope.row)"
              v-hasPermi="['business:labelstation:remove']">{{ $t('btn.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="openType" width="500px" append-to-body :close-on-click-modal="false"
      @closed="closeType">
      <LuxForm ref="formTypeRef" :model="formType" :rules="rulesType" label-width="130px" :data-report-info="JSON.stringify({
        menu: 'labelmanagement:labeltype',
        form: 'labeltype',
        update: !!formType.id,
        submit: isTypeSumbit
      })">
        <el-form-item :label="$t('labelmanagement.model[1]')" prop="model">
          <el-input v-if="formType.id" :model-value="formType.model" placeholder="" disabled />
          <el-select v-else v-model="formType.model" placeholder="" filterable style="width: 100%"
            @change="changeModelForm" :disabled="!!formType.id">
            <el-option v-for="item in modelOptions" :key="item.model" :label="item.model" :value="item.model" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.ipn[1]')" prop="ipn">
          <el-select v-model="formType.ipn" placeholder="" clearable filterable style="width: 100%">
            <el-option v-for="item in ipnOptionsForm" :key="item.ipn" :label="item.ipn" :value="item.ipn" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.labelType[1]')" prop="labelType">
          <el-input v-if="formType.id" :model-value="formType.labelType" placeholder="" disabled />
          <el-select v-else v-model="formType.labelType" placeholder="" filterable style="width: 100%">
            <el-option v-for="item in labelTypeOptions" :key="item.typeName" :label="item.typeName"
              :value="item.typeName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.labelFile[1]')" prop="labelFile">
          <el-upload ref="upload" action="" :show-file-list="false" accept=".frx, .lab, .btw, .txt, .xls, .xlsx"
            :disabled="!formType.model || !formType.labelType" :before-upload="beforeUpload">
            <el-button type="primary" icon="Upload" :disabled="!formType.model || !formType.labelType"
              :loading="fileUploading">{{ $t('labelmanagement.labelFile[4]') }}</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.labelName[1]')" prop="labelName">
          <el-input v-model="formType.labelName" placeholder="" readonly />
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.printerName[1]')" prop="printerName">
          <el-input v-model.trim="formType.printerName" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.typeFlag[1]')" prop="typeFlag">
          <el-input v-model.trim="formType.typeFlag" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.labelTypeDesc[1]')" prop="labelTypeDesc">
          <el-input type="textarea" v-model="formType.labelTypeDesc" placeholder="" />
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelType">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="typeFormLoading" @click="submitFormType">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="labeltype">
import { listModel, listPartLabelType, listLabelTypeBase } from '@/api/mescommon/mesget'
import { listLabelType, addLabelType, updateLabelType, removeLabelType, addLabelFile } from '@/api/business/labelMnt/labelmanagement'
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
    labelType: undefined
  },
  formType: {}
})
const { queryParams, formType } = toRefs(state)

const rulesType = computed(() => {
  return {
    model: [{ required: true, message: proxy.$t('labelmanagement.model[3]'), trigger: 'change' }],
    ipn: [{ required: true, message: proxy.$t('labelmanagement.ipn[3]'), trigger: 'change' }],
    labelType: [{ required: true, message: proxy.$t('labelmanagement.labelType[3]'), trigger: 'change' }],
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
  listLabelTypeBase().then((response) => {
    labelTypeOptions.value = response.data
  })
}

function changeModel(v) {
  queryParams.value.ipn = undefined
  handleQuery()
  getIPNOptions()
}

// 表格列配置项
const columns = reactive([
  { key: 'model', label: proxy.$t('labelmanagement.model[0]'), prop: 'model', visible: true, showTooltip: true },
  { key: 'ipn', label: proxy.$t('labelmanagement.ipn[0]'), prop: 'ipn', visible: true, showTooltip: true },
  { key: 'labelType', label: proxy.$t('labelmanagement.labelType[0]'), prop: 'labelType', visible: true, showTooltip: true },
  { key: 'labelTypeDesc', label: proxy.$t('labelmanagement.labelTypeDesc[0]'), prop: 'labelTypeDesc', visible: true, showTooltip: true },
  { key: 'labelName', label: proxy.$t('labelmanagement.labelName[0]'), prop: 'labelName', visible: true, showTooltip: true },
  { key: 'printerName', label: proxy.$t('labelmanagement.printerName[0]'), prop: 'printerName', visible: true, showTooltip: true },
  { key: 'typeFlag', label: proxy.$t('labelmanagement.typeFlag[0]'), prop: 'typeFlag', visible: true, showTooltip: true },
  { key: 'enabled', label: proxy.$t('labelmanagement.enabled[0]'), prop: 'enabled', visible: true, showTooltip: true },
  { key: 'updateEmpno', label: proxy.$t('labelmanagement.updateEmpno'), prop: 'updateEmpno', visible: true, showTooltip: true },
  { key: 'updateTime', label: proxy.$t('labelmanagement.updateTime'), prop: 'updateTime', visible: true, showTooltip: true },
])

/* 计算表格高度 */
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
  listLabelType(queryParams.value).then((response) => {
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

// 下载模板
function downloadFile(row) {
  if (!row.labelName) {
    return
  }
  proxy.downFile('/labelmnt/labelmanagement/querylabelfile', { param: row.labelName })
}

// 弹出层
const title = ref('')
const openType = ref(false)
const typeFormLoading = ref(false)
const formTypeRef = ref(null)
const isTypeSumbit = ref(false)
const fileUploading = ref(false)

// 取消按钮
function cancelType() {
  openType.value = false
}
// 弹窗关闭
function closeType() {
  resetType()
}

const ipnOptionsForm = ref([])
async function getIPNOptionsForm() {
  listPartLabelType({ model: formType.value.model }).then((response) => {
    ipnOptionsForm.value = [{ ipn: '*' }, ...response.data]
  })
}

function changeModelForm(v) {
  formType.value.ipn = '*'
  getIPNOptionsForm()
}

// 上传的模板文件-base64
let fileBase64 = null

// 上传模板
function beforeUpload(file) {
  fileUploading.value = true
  proxy.fileToBase64Pure(file).then(base64 => {
    fileBase64 = base64.replace(/^data:.*?base64,/, '')
    const suffix = file.name.substr(file.name.lastIndexOf('.') + 1)
    const time = proxy.parseTime(new Date(), 'YYYYMMDDHHmmssSSS')
    const labelName = `${formType.value.model || ''}_${formType.value.labelType || ''}_${time}.${suffix}`
    formType.value.labelName = labelName
    fileUploading.value = false
  }).catch(err => {
    fileUploading.value = false
    fileBase64 = null
    formType.value.labelName = null
  })

  return false
}

// 类型表单重置
function resetType() {
  fileBase64 = null
  formType.value = {
    id: null,
    model: null,
    ipn: null,
    labelType: null,
    labelName: null,
    printerName: null,
    typeFlag: null,
    labelTypeDesc: null
  }
  proxy.resetLuxForm('formTypeRef')
}

// 新增
async function handleAdd() {
  resetType()

  formType.value.model = queryParams.value.model || null
  formType.value.ipn = queryParams.value.ipn || '*'
  formType.value.labelType = queryParams.value.labelType || null

  openType.value = true
  title.value = proxy.$t('labelmanagement.AddLabelType')

  getIPNOptionsForm()
}
// 修改
async function handleUpdate(row) {
  resetType()
  formType.value = JSON.parse(JSON.stringify(row))
  openType.value = true
  title.value = proxy.$t('labelmanagement.UpdateLabelType')

  getIPNOptionsForm()
}

// 提交表单 - 先上传模板文件再提交其他信息
function submitFormType() {
  isTypeSumbit.value = true
  formTypeRef.value.$form.validate((valid) => {
    isTypeSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formType.value))
      if (form.labelName && fileBase64) {
        typeFormLoading.value = true
        addLabelFile({ labelName: form.labelName, templateFile: fileBase64 }).then((response) => {
          typeFormLoading.value = false
          doSubmit(form)
        }).catch(() => {
          typeFormLoading.value = false
        })
      } else {
        doSubmit(form)
      }
    }
  })
}
function doSubmit(form) {
  if (form.id) {
    typeFormLoading.value = true
    updateLabelType(form).then((response) => {
      typeFormLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('labelmanagement.UpdateOK'))
      openType.value = false
      getList()
    }).catch(() => {
      typeFormLoading.value = false
    })
  } else {
    addLabelType(form).then((response) => {
      typeFormLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('labelmanagement.AddOK'))
      openType.value = false
      getList()
    }).catch(() => {
      typeFormLoading.value = false
    })
  }
}

// 删除
function handleDelete(row) {
  proxy.$modal
    .confirm(proxy.$t('labelmanagement.ConfirmDelete'))
    .then(() => {
      listLoading.value = true
      return removeLabelType(row)
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

getList()
getModelOptions()
getLabelTypeOptions()
</script>