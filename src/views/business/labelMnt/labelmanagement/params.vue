<template>
  <div style="padding: 10px;">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('labelmanagement.model[1]')" prop="model">
        <el-select v-model="queryParams.model" :placeholder="$t('labelmanagement.model[1]')" clearable filterable
          style="width: 160px" @change="handleQuery">
          <el-option v-for="item in modelOptions" :key="item.model" :label="item.model" :value="item.model" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labelmanagement.labelType[1]')" prop="labelType">
        <el-select v-model="queryParams.labelType" :placeholder="$t('labelmanagement.labelType[1]')" clearable
          filterable style="width: 160px" @change="changeLabelType">
          <el-option v-for="item in labelTypeOptions" :key="item.typeName" :label="item.typeName"
            :value="item.typeName" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labelmanagement.fieldName[1]')" prop="fieldName">
        <el-select v-model="queryParams.fieldName" :placeholder="$t('labelmanagement.fieldName[1]')" clearable
          filterable style="width: 160px" @change="handleQuery">
          <el-option v-for="item in fieldNameOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labelmanagement.varType[1]')" prop="varType">
        <el-select v-model="queryParams.varType" :placeholder="$t('labelmanagement.varType[1]')" clearable filterable
          style="width: 160px" @change="handleQuery">
          <el-option v-for="dict in varTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb2">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="handleAdd" v-hasPermi="['business:labelparams:add']">
          <span>{{ $t('btn.add') }}</span>
        </el-button>
      </el-col>

      <right-toolbar v-model:showSearch="showSearch" v-model:columns="columns" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="tableRef" v-loading="listLoading" :data="tableList" :height="tableHeight" border stripe>
      <el-table-column type="index" align="center" width="50" />
      <el-table-column :label="$t('labelmanagement.model[0]')" align="center" prop="model" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('model')" v-if="columns.showColumn('model')" />
      <el-table-column :label="$t('labelmanagement.labelType[0]')" align="center" prop="labelType" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('labelType')" v-if="columns.showColumn('labelType')" />
      <el-table-column :label="$t('labelmanagement.varName[0]')" align="center" prop="varName" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('varName')" v-if="columns.showColumn('varName')" />
      <el-table-column :label="$t('labelmanagement.fieldName[0]')" align="center" prop="fieldName" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('fieldName')" v-if="columns.showColumn('fieldName')" />
      <el-table-column :label="$t('labelmanagement.varDesc[0]')" align="center" prop="description" min-width="160"
        :show-overflow-tooltip="columns.showTooltip('description')" v-if="columns.showColumn('description')" />
      <el-table-column :label="$t('labelmanagement.varType[0]')" align="center" prop="varType" min-width="120"
        :show-overflow-tooltip="columns.showTooltip('varType')" v-if="columns.showColumn('varType')" />
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
          <el-button text size="small" icon="Edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['business:labelparams:update']">{{ $t('btn.edit') }}</el-button>
          <el-button text size="small" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['business:labelparams:remove']">{{ $t('btn.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="openParams" width="500px" append-to-body :close-on-click-modal="false"
      @closed="closeParams">
      <LuxForm ref="formParamsRef" :model="formParams" :rules="rulesParams" label-width="140px" :data-report-info="JSON.stringify({
        menu: 'labelmanagement:labelparams',
        form: 'labelparams',
        update: !!formParams.id,
        submit: isParamsSumbit
      })">
        <el-form-item :label="$t('labelmanagement.model[1]')" prop="model">
          <el-input v-if="formParams.id" :model-value="formParams.model" placeholder="" disabled />
          <el-select v-else v-model="formParams.model" placeholder="" filterable style="width: 100%"
            :disabled="!!formParams.id">
            <el-option v-for="item in modelOptions" :key="item.model" :label="item.model" :value="item.model" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.labelType[1]')" prop="labelType">
          <el-input v-if="formParams.id" :model-value="formParams.labelType" placeholder="" disabled />
          <el-select v-else v-model="formParams.labelType" placeholder="" filterable style="width: 100%"
            @change="changeLabelTypeForm">
            <el-option v-for="item in labelTypeOptions" :key="item.typeName" :label="item.typeName"
              :value="item.typeName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.fieldName[1]')" prop="fieldName">
          <el-input v-if="formParams.id" :model-value="formParams.fieldName" placeholder="" disabled />
          <el-select v-else v-model="formParams.fieldName" placeholder="" clearable filterable style="width: 100%">
            <el-option v-for=" item in fieldNameOptionsForm" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.varType[1]')" prop="varType">
          <el-input v-if="formParams.id" :model-value="formParams.varType" placeholder="" disabled />
          <el-select v-else v-model="formParams.varType" placeholder="" clearable filterable style="width: 100%"
            :disabled="!!formParams.id">
            <el-option v-for="dict in varTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.varName[1]')" prop="varName">
          <el-input v-model.trim="formParams.varName" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.varDesc[1]')" prop="description">
          <el-input type="textarea" v-model="formParams.description" placeholder="" />
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelParams">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="paramsFormLoading" @click="submitFormParams">
          <span>{{ $t('btn.submit') }}</span>
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="labelparams">
import { listModel, listLabelTypeBase, listPrintField } from '@/api/mescommon/mesget'
import { listLabelParams, addLabelParams, updateLabelParams, deleteLabelParams } from '@/api/business/labelMnt/labelmanagement'
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
    labelType: undefined,
    fieldName: undefined,
    varType: undefined
  },
  formParams: {}
})
const { queryParams, formParams } = toRefs(state)

const rulesParams = computed(() => {
  return {
    model: [{ required: true, message: proxy.$t('labelmanagement.model[3]'), trigger: 'change' }],
    labelType: [{ required: true, message: proxy.$t('labelmanagement.labelType[3]'), trigger: 'change' }],
    varName: [{ required: true, message: proxy.$t('labelmanagement.varName[3]'), trigger: 'change' }],
  }
})

const modelOptions = ref([])
function getModelOptions() {
  listModel().then((response) => {
    modelOptions.value = response.data
  })
}

const labelTypeOptions = ref([])
function getLabelTypeOptions() {
  listLabelTypeBase().then((response) => {
    labelTypeOptions.value = response.data
  })
}

const fieldNameOptions = ref([])
function getFieldName() {
  listPrintField({ dataType: queryParams.value.labelType }).then((response) => {
    fieldNameOptions.value = response.data
  })
}

const varTypeOptions = ref([])
proxy.getDicts('label_var_type').then((response) => {
  varTypeOptions.value = response.data
})

function changeLabelType(v) {
  queryParams.value.fieldName = undefined
  handleQuery()
  getFieldName()
}

// 表格列配置项
const columns = reactive([
  { key: 'model', label: proxy.$t('labelmanagement.model[0]'), prop: 'model', visible: true, showTooltip: true },
  { key: 'labelType', label: proxy.$t('labelmanagement.labelType[0]'), prop: 'labelType', visible: true, showTooltip: true },
  { key: 'varName', label: proxy.$t('labelmanagement.varName[0]'), prop: 'varName', visible: true, showTooltip: true },
  { key: 'fieldName', label: proxy.$t('labelmanagement.fieldName[0]'), prop: 'fieldName', visible: true, showTooltip: true },
  { key: 'description', label: proxy.$t('labelmanagement.varDesc[0]'), prop: 'description', visible: true, showTooltip: true },
  { key: 'LabelVarType', label: proxy.$t('labelmanagement.varType[0]'), prop: 'varType', visible: true, showTooltip: true },
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
  listLabelParams(queryParams.value).then((response) => {
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
const openParams = ref(false)
const paramsFormLoading = ref(false)
const formParamsRef = ref(null)
const isParamsSumbit = ref(false)

// 取消按钮
function cancelParams() {
  openParams.value = false
}
// 弹窗关闭
function closeParams() {
  resetParams()
}

const fieldNameOptionsForm = ref([])
function getFieldNameForm() {
  listPrintField({ dataType: formParams.value.labelType }).then((response) => {
    fieldNameOptionsForm.value = response.data
  })
}

function changeLabelTypeForm(v) {
  formParams.value.fieldName = undefined
  getFieldNameForm()
}

// 类型表单重置
function resetParams() {
  formParams.value = {
    id: null,
    model: null,
    labelType: null,
    fieldName: null,
    varType: null,
    varName: null,
    description: null
  }
  proxy.resetLuxForm('formParamsRef')
}

function handleAdd() {
  resetParams()

  formParams.value.model = queryParams.value.model || null
  formParams.value.labelType = queryParams.value.labelType || null
  formParams.value.fieldName = queryParams.value.fieldName || null
  formParams.value.varType = queryParams.value.varType || null

  openParams.value = true
  title.value = proxy.$t('labelmanagement.AddLabelParams')

  getFieldNameForm()
}
function handleUpdate(row) {
  resetParams()
  formParams.value = JSON.parse(JSON.stringify(row))
  openParams.value = true
  title.value = proxy.$t('labelmanagement.UpdateLabelParams')

  getFieldNameForm()
}

function submitFormParams() {
  isParamsSumbit.value = true
  formParamsRef.value.$form.validate((valid) => {
    isParamsSumbit.value = false
    if (valid) {
      paramsFormLoading.value = true
      if (formParams.value.id) {
        updateLabelParams(formParams.value).then((response) => {
          paramsFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('labelmanagement.UpdateOK'))
          openParams.value = false
          getList()
        }).catch(() => {
          paramsFormLoading.value = false
        })
      } else {
        addLabelParams(formParams.value).then((response) => {
          paramsFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('labelmanagement.AddOK'))
          openParams.value = false
          getList()
        }).catch(() => {
          paramsFormLoading.value = false
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
      return deleteLabelParams(row)
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