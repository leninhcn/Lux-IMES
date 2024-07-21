<template>
  <div class="app-container">
    <div class="card-box">
      <el-form :model="queryParamsWarehouse" ref="queryFormWarehouse" :inline="true" v-show="showWarehouseSearch">
        <el-form-item :label="$t('mwarehouse.warehouseCode[1]')" prop="warehouseCode">
          <el-input v-model="queryParamsWarehouse.warehouseCode" :placeholder="$t('mwarehouse.warehouseCode[1]')"
            clearable style="width: 150px" @keyup.enter="handleQueryWarehouse" />
        </el-form-item>
        <el-form-item :label="$t('mwarehouse.warehouseName[1]')" prop="warehouseName">
          <el-input v-model="queryParamsWarehouse.warehouseName" :placeholder="$t('mwarehouse.warehouseName[1]')"
            clearable style="width: 200px" @keyup.enter="handleQueryWarehouse" />
        </el-form-item>
        <el-form-item :label="$t('mwarehouse.warehouseType[1]')" prop="warehouseType">
          <el-select v-model="queryParamsWarehouse.warehouseType" :placeholder="$t('mwarehouse.warehouseType[1]')"
            clearable style="width: 100px" @change="handleQueryWarehouse">
            <el-option v-for="dict in warehouseTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-select v-model="queryParamsWarehouse.enabled" :placeholder="$t('mwarehouse.enabled[1]')" clearable
            style="width: 100px" @change="handleQueryWarehouse">
            <el-option v-for="dict in enabledOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQueryWarehouse">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="resetQueryWarehouse">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb2">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="plus" @click="handleAddWarehouse"
            v-hasPermi="['warehousemanagement:mwarehouse:add']">{{ $t('btn.add') }}</el-button>
        </el-col>

        <right-toolbar v-model:showSearch="showWarehouseSearch" @queryTable="getWarehouseList"></right-toolbar>
      </el-row>

      <el-table ref="tableWarehouse" v-loading="warehouseListLoading" :data="warehouseList"
        :height="tableWarehouseHeight" border stripe highlight-current-row
        @current-change="handleCurrentWarehouseChange">
        <el-table-column type="index" align="center" width="50" />
        <el-table-column :label="$t('mwarehouse.warehouseCode[0]')" align="center" prop="warehouseCode"
          min-width="150" />
        <el-table-column :label="$t('mwarehouse.warehouseName[0]')" align="center" prop="warehouseName"
          min-width="200" />
        <el-table-column :label="$t('mwarehouse.warehouseType[0]')" align="center" prop="warehouseType" min-width="150">
          <template #default="scope">
            <dict-tag :options="warehouseTypeOptions" :value="scope.row.warehouseType" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80">
          <template #default="scope">
            <div @click.stop>
              <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N"
                :active-text="$t('common.enable')" :inactive-text="$t('common.disable')" inline-prompt
                @change="handleWarehouseEnabledChange(scope.row)"></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmp" width="120" />
        <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmp" width="120" />
        <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed='right' :label="$t('general.Operational')" align="center" width="80"
          class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button text size="small" icon="edit" @click="handleUpdateWarehouse(scope.row)"
              v-hasPermi="['warehousemanagement:mwarehouse:update']">{{ $t('btn.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="totalWarehouse" v-model:page="queryParamsWarehouse.pageNum"
        v-model:limit="queryParamsWarehouse.pageSize" :page-sizes="[10, 20, 50, 100]" @pagination="getWarehouseList" />
    </div>

    <div class="card-box">
      <el-form :model="queryParamsStorage" ref="queryFormStorage" :inline="true" v-show="showStorageSearch">
        <el-form-item :label="$t('mwarehouse.locationCode[1]')" prop="locationCode">
          <el-input v-model="queryParamsStorage.locationCode" :placeholder="$t('mwarehouse.locationCode[1]')" clearable
            style="width: 150px" @keyup.enter="handleQueryStorage" />
        </el-form-item>
        <el-form-item :label="$t('mwarehouse.locationName[1]')" prop="locationName">
          <el-input v-model="queryParamsStorage.locationName" :placeholder="$t('mwarehouse.locationName[1]')" clearable
            style="width: 200px" @keyup.enter="handleQueryStorage" />
        </el-form-item>
        <!-- <el-form-item :label="$t('mwarehouse.locationType[1]')" prop="locationType">
          <el-select v-model="queryParamsStorage.locationType" :placeholder="$t('mwarehouse.locationType[1]')" clearable
            style="width: 150px" @change="handleQueryStorage">
            <el-option v-for="dict in locationTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('mwarehouse.currentStatus[1]')" prop="currentStatus">
          <el-select v-model="queryParamsStorage.currentStatus" :placeholder="$t('mwarehouse.currentStatus[1]')"
            clearable style="width: 100px" @change="handleQueryStorage">
            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-select v-model="queryParamsStorage.enabled" :placeholder="$t('mwarehouse.enabled[1]')" clearable
            style="width: 100px" @change="handleQueryStorage">
            <el-option v-for="dict in enabledOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQueryStorage">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="resetQueryStorage">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb2">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="plus" @click="handleAddStorage"
            v-hasPermi="['warehousemanagement:mwarehouse:add']">{{ $t('btn.add') }}</el-button>
        </el-col>

        <right-toolbar v-model:showSearch="showStorageSearch" @queryTable="getStorageList"></right-toolbar>
      </el-row>

      <el-table ref="tableStorage" v-loading="storageListLoading" :data="storageList" :height="tableStorageHeight"
        border stripe>4
        <el-table-column type="index" align="center" width="50" />
        <el-table-column :label="$t('mwarehouse.locationCode[0]')" align="center" prop="locationCode" min-width="150" />
        <el-table-column :label="$t('mwarehouse.locationName[0]')" align="center" prop="locationName" min-width="200" />
        <el-table-column :label="$t('mwarehouse.locationType[0]')" align="center" prop="locationType" min-width="150">
          <template #default="scope">
            <dict-tag :options="locationTypeOptions" :value="scope.row.locationType" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('mwarehouse.currentStatus[0]')" align="center" prop="currentStatus" width="80" />
        <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80">
          <template #default="scope">
            <div @click.stop>
              <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N"
                :active-text="$t('common.enable')" :inactive-text="$t('common.disable')" inline-prompt
                @change="handleStorageEnabledChange(scope.row)"></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmp" width="120" />
        <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmp" width="120" />
        <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="160">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed='right' :label="$t('general.Operational')" align="center" width="80"
          class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button text size="small" icon="edit" @click="handleUpdateStorage(scope.row)"
              v-hasPermi="['warehousemanagement:mwarehouse:update']">{{ $t('btn.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination :total="totalStorage" v-model:page="queryParamsStorage.pageNum"
        v-model:limit="queryParamsStorage.pageSize" :page-sizes="[10, 20, 50, 100]" @pagination="getStorageList" />
    </div>

    <el-dialog :title="title" v-model="openWarehouse" width="500px" append-to-body @closed="closeWarehouse">
      <LuxForm ref="formWarehouseRef" :model="formWarehouse" :rules="rulesWarehouse" label-width="100px"
        :data-report-info="JSON.stringify({
          menu: 'warehousemanagement:mwarehouse',
          form: 'warehouse',
          update: isWarehouseEdit,
          submit: isWarehouseSumbit
        })">
        <el-form-item :label="$t('mwarehouse.warehouseCode[1]')" prop="warehouseCode">
          <el-input v-model.trim="formWarehouse.warehouseCode" :placeholder="$t('mwarehouse.warehouseCode[2]')"
            :readonly="isWarehouseEdit" />
        </el-form-item>
        <el-form-item :label="$t('mwarehouse.warehouseName[1]')" prop="warehouseName">
          <el-input v-model="formWarehouse.warehouseName" :placeholder="$t('mwarehouse.warehouseName[2]')" />
        </el-form-item>
        <el-form-item :label="$t('mwarehouse.warehouseType[1]')" prop="warehouseType">
          <el-select v-model="formWarehouse.warehouseType" :placeholder="$t('mwarehouse.warehouseType[2]')"
            style="width: 100%">
            <el-option v-for="dict in warehouseTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-switch v-model="formWarehouse.enabled"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
          <div style="margin-left: 0.5em;">
            <span v-show="formWarehouse.enabled">{{ $t('common.enable') }}</span>
            <span v-show="!formWarehouse.enabled">{{ $t('common.disable') }}</span>
          </div>
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelWarehouse">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="warehouseFormLoading" @click="submitFormWarehouse">
          <span>{{ $t('btn.submit') }}</span>
        </el-button>
      </template>
    </el-dialog>

    <el-dialog :title="title" v-model="openStorage" width="500px" append-to-body @closed="closeStorage">
      <LuxForm ref="formStorageRef" :model="formStorage" :rules="rulesStorage" label-width="100px" :data-report-info="JSON.stringify({
        menu: 'warehousemanagement:mwarehouse',
        form: 'location',
        update: isStorageEdit,
        submit: isStorageSumbit
      })">
        <el-form-item :label="$t('mwarehouse.locationCode[1]')" prop="locationCode">
          <el-input v-model.trim="formStorage.locationCode" :placeholder="$t('mwarehouse.locationCode[2]')"
            :readonly="isStorageEdit" />
        </el-form-item>
        <el-form-item :label="$t('mwarehouse.locationName[1]')" prop="locationName">
          <el-input v-model="formStorage.locationName" :placeholder="$t('mwarehouse.locationName[2]')" />
        </el-form-item>
        <el-form-item :label="$t('mwarehouse.locationType[1]')" prop="locationType">
          <el-select v-model="formStorage.locationType" :placeholder="$t('mwarehouse.locationType[2]')"
            style="width: 100%">
            <el-option v-for="dict in locationTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('mwarehouse.currentStatus[1]')" prop="currentStatus">
          <el-switch v-model="formStorage.currentStatus"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
          <div style="margin-left: 0.5em;">
            <span v-show="formStorage.currentStatus">Y</span>
            <span v-show="!formStorage.currentStatus">N</span>
          </div>
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-switch v-model="formStorage.enabled"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
          <div style="margin-left: 0.5em;">
            <span v-show="formStorage.enabled">{{ $t('common.enable') }}</span>
            <span v-show="!formStorage.enabled">{{ $t('common.disable') }}</span>
          </div>
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelStorage">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="storageFormLoading" @click="submitFormStorage">
          <span>{{ $t('btn.submit') }}</span>
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="mwarehouse">
import {
  listWarehouse,
  queryWarehouse,
  addWarehouse,
  updateWarehouse,
  listLocation,
  queryLocation,
  addLocation,
  updateLocation
} from '@/api/business/warehouseMnt/mwarehouse'
const { proxy } = getCurrentInstance()

const warehouseTypeOptions = ref([])
proxy.getDicts('warehouse_type').then((response) => {
  warehouseTypeOptions.value = response.data
})

const locationTypeOptions = ref([])
proxy.getDicts('storage_location_type').then((response) => {
  locationTypeOptions.value = response.data
})

const statusOptions = ref([])
proxy.getDicts('status').then((response) => {
  statusOptions.value = response.data
})

const enabledOptions = ref([])
proxy.getDicts('selectstatus').then((response) => {
  enabledOptions.value = response.data
})


const state = reactive({
  queryParamsWarehouse: {
    pageNum: 1,
    pageSize: 10,
    warehouseCode: undefined,
    warehouseName: undefined,
    warehouseType: undefined,
    enabled: 'Y'
  },
  formWarehouse: {},
  queryParamsStorage: {
    pageNum: 1,
    pageSize: 10,
    locationCode: undefined,
    locationName: undefined,
    locationType: undefined,
    currentStatus: undefined,
    enabled: 'Y'
  },
  formStorage: {}
})
const { queryParamsWarehouse, formWarehouse } = toRefs(state)
const { queryParamsStorage, formStorage } = toRefs(state)

const rulesWarehouse = computed(() => {
  return {
    warehouseCode: [{ required: true, message: proxy.$t('mwarehouse.warehouseCode[3]'), trigger: 'blur' }],
    warehouseType: [{ required: true, message: proxy.$t('mwarehouse.warehouseType[3]'), trigger: 'change' }],
    enabled: [{ type: 'boolean', required: true, message: proxy.$t('mwarehouse.enabled[3]'), trigger: 'change' }]
  }
})
const rulesStorage = computed(() => {
  return {
    locationCode: [{ required: true, message: proxy.$t('mwarehouse.locationCode[3]'), trigger: 'blur' }],
    locationType: [{ required: true, message: proxy.$t('mwarehouse.locationType[3]'), trigger: 'change' }],
    currentStatus: [{ required: true, message: proxy.$t('mwarehouse.currentStatus[3]'), trigger: 'change' }],
    enabled: [{ type: 'boolean', required: true, message: proxy.$t('mwarehouse.enabled[3]'), trigger: 'change' }]
  }
})


const tableWarehouse = ref(null)
const tableWarehouseHeight = ref(null)
const tableWarehouseTop = ref(0)

const tableStorage = ref(null)
const tableStorageHeight = ref(null)
const tableStorageTop = ref(0)

/* 重新计算table高度 */
function resizeTable() {
  resizeTableWarehouse()
  resizeTableStorage()
}
// Table Warehouse
function resizeTableWarehouse() {
  if (!tableWarehouse.value) return

  tableWarehouse.value._timer && clearTimeout(tableWarehouse.value._timer)
  tableWarehouse.value._timer = setTimeout(() => {
    let height = window.innerHeight / 2 - tableWarehouse.value.$el.getBoundingClientRect().top - 26
    height = Math.floor(height) - 1
    height = Math.max(height, 100)
    tableWarehouseHeight.value = height + 'px'
  }, 50)
}
// Table Storage
function resizeTableStorage() {
  if (!tableStorage.value) return

  tableStorage.value._timer && clearTimeout(tableStorage.value._timer)
  tableStorage.value._timer = setTimeout(() => {
    let height = window.innerHeight - tableStorage.value.$el.getBoundingClientRect().top - 94
    height = Math.floor(height) - 1
    height = Math.max(height, 100)
    tableStorageHeight.value = height + 'px'
  }, 50)
}

let appMain
onMounted(() => {
  // 监听页面容器尺寸变化
  let arr = document.getElementsByClassName('app-main')
  let appMain = arr[0]
  if (appMain) {
    appMain._ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        resizeTable()
      }
    });

    appMain._ro.observe(appMain);
  }
})
onBeforeUnmount(() => {
  // 取消监听页面容器尺寸变化
  if (appMain && appMain._ro) appMain._ro.disconnect();
})
onUpdated(() => {
  // 页面更新后 记录各table当前位置
  tableWarehouseTop.value = tableWarehouse.value.$el.getBoundingClientRect().top
  tableStorageTop.value = tableStorage.value.$el.getBoundingClientRect().top
})
// 监听各table位置变化
watch(tableWarehouseTop, (nVal, oVal) => {
  resizeTableWarehouse()
})
watch(tableStorageTop, (nVal, oVal) => {
  resizeTableStorage()
})


const showWarehouseSearch = ref(true)
const warehouseListLoading = ref(false)
const warehouseList = ref([])
const totalWarehouse = ref(0)

/** 查询仓库列表 */
function getWarehouseList() {
  warehouseListLoading.value = true
  listWarehouse(queryParamsWarehouse.value).then((response) => {
    warehouseListLoading.value = false
    if (response.code == 200) {
      warehouseList.value = response.data.result
      totalWarehouse.value = response.data.totalNum
    } else {
      warehouseList.value = []
      totalWarehouse.value = 0
    }
    // 默认选中第一行
    tableWarehouse.value.setCurrentRow(warehouseList.value[0] || null)
  }).catch(() => {
    warehouseListLoading.value = false
  })
}
/** 搜索按钮操作 */
function handleQueryWarehouse() {
  queryParamsWarehouse.value.pageNum = 1
  getWarehouseList()
}
/** 重置按钮操作 */
function resetQueryWarehouse() {
  proxy.resetForm('queryFormWarehouse')
  handleQueryWarehouse()
}


// 选中仓库行
function handleCurrentWarehouseChange(row) {
  if (row) {
    queryParamsStorage.value.warehouseCode = row.warehouseCode
    handleQueryStorage()
  } else {
    queryParamsStorage.value.warehouseCode = undefined
    storageList.value = []
  }
}


const showStorageSearch = ref(true)
const storageListLoading = ref(false)
const storageList = ref([])
const totalStorage = ref(0)

/** 查询储位列表 */
function getStorageList() {
  if (!queryParamsStorage.value.warehouseCode) {
    storageList.value = []
    totalStorage.value = 0
    return
  }

  storageListLoading.value = true
  listLocation(queryParamsStorage.value).then((response) => {
    storageListLoading.value = false
    if (response.code == 200) {
      storageList.value = response.data.result
      totalStorage.value = response.data.totalNum
    } else {
      storageList.value = []
      totalStorage.value = 0
    }
  }).catch(() => {
    storageListLoading.value = false
  })
}
/** 搜索按钮操作 */
function handleQueryStorage() {
  queryParamsStorage.value.pageNum = 1
  getStorageList()
}
/** 重置按钮操作 */
function resetQueryStorage() {
  proxy.resetForm('queryFormStorage')
  handleQueryStorage()
}


/** 状态修改  */
function handleWarehouseEnabledChange(row) {
  let text = row.enabled === 'Y' ? proxy.$t('common.enable') : proxy.$t('common.disable')
  proxy.$modal
    .confirm(proxy.$t('mwarehouse.ConfirmChangeStatus', { op: text, name: '[' + row.warehouseCode + ']' + row.warehouseName }))
    .then(() => {
      warehouseListLoading.value = true
      return updateWarehouse(row);
    })
    .then(() => {
      warehouseListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mwarehouse.ChangeOK'))
      getWarehouseList()
    })
    .catch(() => {
      row.enabled = row.enabled == 'Y' ? 'N' : 'Y'
      warehouseListLoading.value = false
    })
}
function handleStorageEnabledChange(row) {
  let text = row.enabled === 'Y' ? proxy.$t('common.enable') : proxy.$t('common.disable')
  proxy.$modal
    .confirm(proxy.$t('mwarehouse.ConfirmChangeStatus', { op: text, name: row.locationName }))
    .then(() => {
      storageListLoading.value = true
      return updateLocation(row);
    })
    .then(() => {
      storageListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mwarehouse.ChangeOK'))
      getStorageList()
    })
    .catch(() => {
      row.enabled = row.enabled == 'Y' ? 'N' : 'Y'
      storageListLoading.value = false
    })
}


// 弹出层
const title = ref('')
const openWarehouse = ref(false)
const warehouseFormLoading = ref(false)
const openStorage = ref(false)
const storageFormLoading = ref(false)


// 类型表单重置
function resetWarehouse() {
  formWarehouse.value = {
    warehouseCode: null,
    warehouseName: null,
    warehouseType: null,
    enabled: true
  }
  proxy.resetLuxForm('formWarehouseRef')
}

// 取消按钮
function cancelWarehouse() {
  openWarehouse.value = false
}
// 弹窗关闭
function closeWarehouse() {
  resetWarehouse()
}

const isWarehouseEdit = ref(false)

/** 类型新增按钮操作 */
function handleAddWarehouse() {
  isWarehouseEdit.value = false
  resetWarehouse()
  formWarehouse.value.warehouseType = warehouseTypeOptions.value[0]?.dictValue || null
  openWarehouse.value = true
  title.value = proxy.$t('mwarehouse.AddWarehouse')
}

/** 类型修改按钮操作 */
function handleUpdateWarehouse(row) {
  isWarehouseEdit.value = true
  resetWarehouse()
  let form = JSON.parse(JSON.stringify(row))
  form.enabled = form.enabled !== 'N'
  formWarehouse.value = form
  openWarehouse.value = true
  title.value = proxy.$t('mwarehouse.UpdateWarehouse')
}

const formWarehouseRef = ref(null)
const isWarehouseSumbit = ref(false)

/** 类型提交按钮 */
function submitFormWarehouse() {
  isWarehouseSumbit.value = true
  formWarehouseRef.value.$form.validate((valid) => {
    isWarehouseSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formWarehouse.value))
      form.enabled = form.enabled ? 'Y' : 'N'

      warehouseFormLoading.value = true
      if (isWarehouseEdit.value) {
        updateWarehouse(form).then((response) => {
          warehouseFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mwarehouse.UpdateOK'))
          openWarehouse.value = false
          getWarehouseList()
        }).catch(() => {
          warehouseFormLoading.value = false
        })
      } else {
        addWarehouse(form).then((response) => {
          warehouseFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mwarehouse.AddOK'))
          openWarehouse.value = false
          getWarehouseList()
        }).catch(() => {
          warehouseFormLoading.value = false
        })
      }
    }
  })
}


// 类型表单重置
function resetStorage() {
  formStorage.value = {
    warehouseCode: queryParamsStorage.value.warehouseCode,
    locationCode: null,
    locationName: null,
    locationType: null,
    currentStatus: false,
    enabled: true
  }
  proxy.resetLuxForm('formStorageRef')
}

// 取消按钮
function cancelStorage() {
  openStorage.value = false
}
// 弹窗关闭
function closeStorage() {
  resetStorage()
}

const isStorageEdit = ref(false)

/** 类型新增按钮操作 */
function handleAddStorage() {
  isStorageEdit.value = false
  resetStorage()
  formStorage.value.locationType = locationTypeOptions.value[0]?.dictValue || null
  openStorage.value = true
  title.value = proxy.$t('mwarehouse.AddStorageLocation')
}

/** 类型修改按钮操作 */
function handleUpdateStorage(row) {
  isStorageEdit.value = true
  resetStorage()
  let form = JSON.parse(JSON.stringify(row))
  form.enabled = form.enabled !== 'N'
  form.currentStatus = form.currentStatus !== 'N'
  formStorage.value = form
  openStorage.value = true
  title.value = proxy.$t('mwarehouse.UpdateStorageLocation')
}

const formStorageRef = ref(null)
const isStorageSumbit = ref(false)

/** 类型提交按钮 */
function submitFormStorage() {
  isStorageSumbit.value = true
  formStorageRef.value.$form.validate((valid) => {
    isStorageSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formStorage.value))
      form.enabled = form.enabled ? 'Y' : 'N'
      form.currentStatus = form.currentStatus ? 'Y' : 'N'

      storageFormLoading.value = true
      if (isStorageEdit.value) {
        updateLocation(form).then((response) => {
          storageFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mwarehouse.UpdateOK'))
          openStorage.value = false
          getStorageList()
        }).catch(() => {
          storageFormLoading.value = false
        })
      } else {
        addLocation(form).then((response) => {
          storageFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mwarehouse.AddOK'))
          openStorage.value = false
          getStorageList()
        }).catch(() => {
          storageFormLoading.value = false
        })
      }
    }
  })
}


getWarehouseList()
</script>

<style scoped>
.card-box {
  margin-bottom: 0;
  padding: 10px;
  box-shadow: var(--el-box-shadow-light);
}

.card-box+.card-box {
  margin-top: 10px;
}
</style>