<template>
  <div style="padding: 10px;">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item :label="$t('labelmanagement.labelType[1]')" prop="dataType">
        <el-select v-model="queryParams.dataType" :placeholder="$t('labelmanagement.labelType[1]')" clearable filterable
          style="width: 160px" @change="changeLabelType">
          <el-option v-for="item in labelTypeOptions" :key="item.typeName" :label="item.typeName"
            :value="item.typeName" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('labelmanagement.fieldName[1]')" prop="dataSql">
        <el-select v-model="queryParams.dataSql" :placeholder="$t('labelmanagement.fieldName[1]')" clearable filterable
          style="width: 160px" @change="handleQuery">
          <el-option v-for="item in fieldNameOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb2">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="handleAdd" v-hasPermi="['business:labelsql:add']">
          <span>{{ $t('btn.add') }}</span>
        </el-button>
      </el-col>

      <right-toolbar v-model:showSearch="showSearch" v-model:columns="columns" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="tableRef" v-loading="listLoading" :data="tableList" :height="tableHeight" border stripe>
      <el-table-column type="index" align="center" width="50" />
      <el-table-column :label="$t('labelmanagement.labelType[0]')" align="center" prop="dataType" min-width="150"
        :show-overflow-tooltip="columns.showTooltip('dataType')" v-if="columns.showColumn('dataType')" />
      <el-table-column :label="$t('labelmanagement.labelSql[0]')" align="center" prop="dataSql" min-width="400"
        :show-overflow-tooltip="columns.showTooltip('dataSql')" v-if="columns.showColumn('dataSql')" />
      <el-table-column :label="$t('labelmanagement.labelOrder[0]')" align="center" prop="dataOrder" min-width="130"
        :show-overflow-tooltip="columns.showTooltip('dataOrder')" v-if="columns.showColumn('dataOrder')" />
      <el-table-column :label="$t('labelmanagement.inputParam[0]')" align="center" prop="inputParam" min-width="140"
        :show-overflow-tooltip="columns.showTooltip('inputParam')" v-if="columns.showColumn('inputParam')" />
      <el-table-column :label="$t('labelmanagement.inputField[0]')" align="center" prop="inputField" min-width="160"
        :show-overflow-tooltip="columns.showTooltip('inputField')" v-if="columns.showColumn('inputField')" />
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
            v-hasPermi="['business:labelsql:update']">{{ $t('btn.edit') }}</el-button>
          <el-button text size="small" icon="Delete" @click="handleDelete(scope.row)"
            v-hasPermi="['business:labelsql:remove']">{{ $t('btn.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="openSql" width="500px" append-to-body :close-on-click-modal="false"
      @closed="closeSql">
      <LuxForm ref="formSqlRef" :model="formSql" :rules="rulesSql" label-width="100px" :data-report-info="JSON.stringify({
        menu: 'labelmanagement:labelsql',
        form: 'labelsql',
        update: !!formSql.id,
        submit: isSqlSumbit
      })">
        <el-form-item :label="$t('labelmanagement.labelType[1]')" prop="dataType">
          <el-input v-if="formSql.id" :model-value="formSql.dataType" placeholder="" disabled />
          <el-select v-else v-model="formSql.dataType" placeholder="" filterable style="width: 100%">
            <el-option v-for="item in labelTypeOptions" :key="item.typeName" :label="item.typeName"
              :value="item.typeName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.labelOrder[1]')" prop="dataOrder">
          <el-input v-model.trim="formSql.dataOrder" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.inputParam[1]')" prop="inputParam">
          <el-input v-model.trim="formSql.inputParam" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.inputField[1]')" prop="inputField">
          <el-input v-model.trim="formSql.inputField" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.printType[1]')" prop="enabled">
          <el-radio-group v-model="formSql.enabled">
            <el-radio value="Y" border>Y</el-radio>
            <el-radio value="T" border>T</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('labelmanagement.labelSql[1]')" prop="dataSql">
          <el-input type="textarea" v-model="formSql.dataSql" placeholder="" />
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelSql">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="sqlFormLoading" @click="submitFormSql">
          <span>{{ $t('btn.submit') }}</span>
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="labelsql">
import { listLabelTypeBase, listPrintField } from '@/api/mescommon/mesget'
import { listPrintData, addPrintData, updatePrintData, deletePrintData } from '@/api/business/labelMnt/labelmanagement'
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
    dataType: undefined,
    dataSql: undefined
  },
  formSql: {}
})
const { queryParams, formSql } = toRefs(state)

const rulesSql = computed(() => {
  return {
    dataType: [{ required: true, message: proxy.$t('labelmanagement.labelType[3]'), trigger: 'change' }],
    dataOrder: [{ required: true, message: proxy.$t('labelmanagement.labelOrder[3]'), trigger: 'blur' }],
    inputParam: [{ required: true, message: proxy.$t('labelmanagement.inputParam[3]'), trigger: 'blur' }],
    inputField: [{ required: true, message: proxy.$t('labelmanagement.inputField[3]'), trigger: 'blur' }],
    enabled: [{ required: true, message: proxy.$t('labelmanagement.printType[3]'), trigger: 'change' }],
    dataSql: [{ required: true, message: proxy.$t('labelmanagement.labelSql[3]'), trigger: 'blur' }],
  }
})

const labelTypeOptions = ref([])
function getLabelTypeOptions() {
  listLabelTypeBase().then((response) => {
    labelTypeOptions.value = response.data
  })
}

const fieldNameOptions = ref([])
function getFieldName() {
  listPrintField({ dataType: queryParams.value.dataType }).then((response) => {
    fieldNameOptions.value = response.data
  })
}

function changeLabelType(v) {
  queryParams.value.dataSql = undefined
  handleQuery()
  getFieldName()
}

// 表格列配置项
const columns = reactive([
  { key: 'dataType', label: proxy.$t('labelmanagement.labelType[0]'), prop: 'dataType', visible: true, showTooltip: true },
  { key: 'dataSql', label: proxy.$t('labelmanagement.labelSql[0]'), prop: 'dataSql', visible: true, showTooltip: true },
  { key: 'dataOrder', label: proxy.$t('labelmanagement.labelOrder[0]'), prop: 'dataOrder', visible: true, showTooltip: true },
  { key: 'inputParam', label: proxy.$t('labelmanagement.inputParam[0]'), prop: 'inputParam', visible: true, showTooltip: true },
  { key: 'inputField', label: proxy.$t('labelmanagement.inputField[0]'), prop: 'inputField', visible: true, showTooltip: true },
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
  listPrintData(queryParams.value).then((response) => {
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
const openSql = ref(false)
const sqlFormLoading = ref(false)
const formSqlRef = ref(null)
const isSqlSumbit = ref(false)

// 取消按钮
function cancelSql() {
  openSql.value = false
}
// 弹窗关闭
function closeSql() {
  resetSql()
}

// 类型表单重置
function resetSql() {
  formSql.value = {
    id: null,
    dataType: null,
    dataOrder: null,
    inputParam: null,
    inputField: null,
    enabled: 'Y',
    dataSql: null
  }
  proxy.resetLuxForm('formSqlRef')
}

function handleAdd() {
  resetSql()
  formSql.value.dataType = queryParams.value.dataType || null
  openSql.value = true
  title.value = proxy.$t('labelmanagement.AddLabelSql')
}
function handleUpdate(row) {
  resetSql()
  formSql.value = JSON.parse(JSON.stringify(row))
  openSql.value = true
  title.value = proxy.$t('labelmanagement.UpdateLabelSql')
}

function submitFormSql() {
  isSqlSumbit.value = true
  formSqlRef.value.$form.validate((valid) => {
    isSqlSumbit.value = false
    if (valid) {
      sqlFormLoading.value = true
      if (formSql.value.id) {
        updatePrintData(formSql.value).then((response) => {
          sqlFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('labelmanagement.UpdateOK'))
          openSql.value = false
          getList()
        }).catch(() => {
          sqlFormLoading.value = false
        })
      } else {
        addPrintData(formSql.value).then((response) => {
          sqlFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('labelmanagement.AddOK'))
          openSql.value = false
          getList()
        }).catch(() => {
          sqlFormLoading.value = false
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
      return deletePrintData(row)
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
getLabelTypeOptions()
</script>