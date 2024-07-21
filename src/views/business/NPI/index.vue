<!--
 * @Descripttion: (NPI项目管理/p_npi_projet)
 * @Author: (admin)
 * @Date: (2024-03-29)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="NPINO" prop="npiNo">
        <el-input v-model="queryParams.npiNo" placeholder="请输入NPINO" />
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" />
      </el-form-item>
      <el-form-item label="料号" prop="ipn">
        <el-input v-model="queryParams.ipn" placeholder="请输入料号" />
      </el-form-item>
      <el-form-item label="客户料号" prop="apn">
        <el-input v-model="queryParams.apn" placeholder="请输入客户料号" />
      </el-form-item>
      <el-form-item label="项目试制阶段" prop="projectTrialStage">
        <el-input v-model="queryParams.projectTrialStage" placeholder="请输入项目试制阶段" />
      </el-form-item>
      <el-form-item label="产品类型" prop="productType">
        <el-select clearable v-model="queryParams.productType" style="width:120px" placeholder="请选择产品类型">
          <el-option v-for="item in options.sys_product_type" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary)">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品线" prop="productLine">
        <el-select clearable v-model="queryParams.productLine" style="width: 240px" placeholder="请选择产品线">
          <el-option v-for="item in options.sys_product_line" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue">
            <span class="fl">{{ item.dictLabel }}</span>
            <span class="fr" style="color: var(--el-text-color-secondary)">{{ item.dictValue }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="研发项目经理" prop="rdManager">
        <el-input v-model="queryParams.rdManager" placeholder="请输入研发项目经理" />
      </el-form-item>
      <el-form-item label="NPI工程师" prop="npiEngineer">
        <el-input v-model="queryParams.npiEngineer" placeholder="请输入NPI工程师" />
      </el-form-item> -->
      <el-form-item label="产品版本" prop="productVersion">
        <el-input v-model="queryParams.productVersion" placeholder="请输入产品版本" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRangeCreateTime"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="defaultTime"
          :shortcuts="dateOptions">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['business:npiprojet:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" :disabled="single" v-hasPermi="['business:npiprojet:edit']" plain icon="edit" @click="handleUpdate">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="multiple" v-hasPermi="['business:npiprojet:delete']" plain icon="delete" @click="handleDelete">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" v-hasPermi="['business:npiprojet:delete']" plain icon="delete" @click="handleClear">
          {{ $t('btn.clean') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-dropdown trigger="click" v-hasPermi="['business:npiprojet:import']">
          <el-button type="primary" plain icon="Upload">
            {{ $t('btn.import') }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="upload">
                <importData
                  templateUrl="business/NpiProjet/importTemplate"
                  importUrl="/business/NpiProjet/importData"
                  @success="handleFileSuccess"></importData>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['business:npiprojet:export']">
          {{ $t('btn.export') }}
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table
      :data="dataList"
      v-loading="loading"
      ref="table"
      border
      header-cell-class-name="el-table-header-cell"
      highlight-current-row
      :table-layout="tableLayout"
      @sort-change="sortChange"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="id" label="Id" align="center" width="90" sortable v-if="columns.showColumn('id')" />
      <el-table-column
        prop="npiNo"
        label="NPINO"
        align="center"
        width="220"
        :show-overflow-tooltip="true"
        sortable
        v-if="columns.showColumn('npiNo')">
        <template #default="scope">
          <el-link type="primary" @click="onNpiView(scope.row.id, scope.row.npiNo)">{{ scope.row.npiNo }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="option1" label="项目描述" align="center" sortable v-if="columns.showColumn('option1')" />
      <el-table-column
        prop="companyName"
        label="公司名称"
        align="center"
        width="90"
        :show-overflow-tooltip="true"
        v-if="columns.showColumn('companyName')" />
      <el-table-column
        prop="customerName"
        label="客户名称"
        align="center"
        :show-overflow-tooltip="true"
        v-if="columns.showColumn('customerName')" />
      <el-table-column prop="ipn" label="料号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('ipn')" />
      <el-table-column prop="apn" label="客户料号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('apn')" />
      <el-table-column
        prop="projectTrialStage"
        label="项目试制阶段"
        align="center"
        :show-overflow-tooltip="true"
        v-if="columns.showColumn('projectTrialStage')" />
      <el-table-column prop="productType" label="产品类型" align="center" v-if="columns.showColumn('productType')">
        <template #default="scope">
          <dict-tag :options="options.sys_product_type" :value="scope.row.productType" />
        </template>
      </el-table-column>
      <el-table-column prop="productLine" label="产品线" align="center" v-if="columns.showColumn('productLine')">
        <template #default="scope">
          <dict-tag :options="options.sys_product_line" :value="scope.row.productLine" />
        </template>
      </el-table-column>
      <el-table-column prop="rdManager" label="研发项目经理" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('rdManager')" />
      <el-table-column prop="npiEngineer" label="NPI工程师" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('npiEngineer')" />
      <el-table-column
        prop="productVersion"
        label="产品版本"
        align="center"
        :show-overflow-tooltip="true"
        v-if="columns.showColumn('productVersion')" />
      <el-table-column prop="projectRemark" label="备注" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('projectRemark')" />
      <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true" v-if="columns.showColumn('updateTime')" />
      <el-table-column prop="updateEmpno" label="更新人" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('updateEmpno')" />
      <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" v-if="columns.showColumn('createTime')" />
      <el-table-column prop="createEmpno" label="创建人" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('createEmpno')" />
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="primary" size="small" icon="view" title="详情" @click="handlePreview(scope.row)"></el-button>
          <el-button
            type="success"
            size="small"
            icon="edit"
            title="编辑"
            v-hasPermi="['business:npiprojet:edit']"
            @click="handleUpdate(scope.row)"></el-button>
          <el-button
            type="danger"
            size="small"
            icon="delete"
            title="删除"
            v-hasPermi="['business:npiprojet:delete']"
            @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改NPI项目管理对话框 -->
    <el-dialog :title="title" :lock-scroll="false" v-model="open">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :lg="12">
            <el-form-item label="NPINO" prop="npiNo">
              <el-input v-model="form.npiNo" placeholder="类型+日期+ID自动生成" :readonly="true" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="项目描述" prop="option1">
              <el-input v-model="form.option1" placeholder="请输入项目描述" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="form.customerName" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="料号" prop="ipn">
              <el-input v-model="form.ipn" placeholder="请输入料号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="客户料号" prop="apn">
              <el-input v-model="form.apn" placeholder="请输入客户料号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="项目试制阶段" prop="projectTrialStage">
              <el-input v-model="form.projectTrialStage" placeholder="请输入项目试制阶段" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="产品类型" prop="productType">
              <el-select v-model="form.productType" placeholder="请选择产品类型">
                <el-option
                  v-for="item in options.sys_product_type"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="产品线" prop="productLine">
              <el-select v-model="form.productLine" placeholder="请选择产品线">
                <el-option
                  v-for="item in options.sys_product_line"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="研发项目经理" prop="rdManager">
              <el-input v-model="form.rdManager" placeholder="请输入研发项目经理" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="NPI工程师" prop="npiEngineer">
              <el-input v-model="form.npiEngineer" placeholder="请输入NPI工程师" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="产品版本" prop="productVersion">
              <el-input v-model="form.productVersion" placeholder="请输入产品版本" />
            </el-form-item>
          </el-col>

          <el-col :lg="24">
            <el-form-item label="备注" prop="projectRemark">
              <el-input type="textarea" v-model="form.projectRemark" placeholder="请输入备注" />
            </el-form-item>
          </el-col>

          <!-- <el-col :lg="12">
            <el-form-item label="更新时间" prop="updateTime">
              <el-date-picker v-model="form.updateTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="更新人" prop="updateEmpno">
              <el-input v-model="form.updateEmpno" placeholder="请输入更新人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="form.createTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="创建人" prop="createEmpno">
              <el-input v-model="form.createEmpno" placeholder="请输入创建人" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="是否可用" prop="enabled">
              <el-input v-model="form.enabled" placeholder="请输入是否可用" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Option1" prop="option1">
              <el-input v-model="form.option1" placeholder="请输入Option1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Option2" prop="option2">
              <el-input v-model="form.option2" placeholder="请输入Option2" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Option3" prop="option3">
              <el-input v-model="form.option3" placeholder="请输入Option3" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Option4" prop="option4">
              <el-input v-model="form.option4" placeholder="请输入Option4" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Option5" prop="option5">
              <el-input v-model="form.option5" placeholder="请输入Option5" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Option6" prop="option6">
              <el-input v-model="form.option6" placeholder="请输入Option6" />
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="npiprojet">
import { listNpiProjet, addNpiProjet, delNpiProjet, updateNpiProjet, getNpiProjet, clearNpiProjet } from '@/api/business/npiprojet.js'
import importData from '@/components/ImportData'

const router = useRouter()

const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: 'Id',
  sortType: 'desc',
  npiNo: undefined,
  companyName: undefined,
  customerName: undefined,
  ipn: undefined,
  apn: undefined,
  projectTrialStage: undefined,
  productType: undefined,
  productLine: undefined,
  rdManager: undefined,
  npiEngineer: undefined,
  productVersion: undefined,
  createTime: undefined
})
const columns = ref([
  { visible: true, prop: 'id', label: 'Id' },
  { visible: true, prop: 'npiNo', label: 'NPINO' },
  { visible: true, prop: 'companyName', label: '公司名称' },
  { visible: true, prop: 'customerName', label: '客户名称' },
  { visible: true, prop: 'ipn', label: '料号' },
  { visible: true, prop: 'apn', label: '客户料号' },
  { visible: true, prop: 'projectTrialStage', label: '项目试制阶段' },
  { visible: true, prop: 'productType', label: '产品类型' },
  { visible: false, prop: 'productLine', label: '产品线' },
  { visible: false, prop: 'rdManager', label: '研发项目经理' },
  { visible: false, prop: 'npiEngineer', label: 'NPI工程师' },
  { visible: false, prop: 'productVersion', label: '产品版本' },
  { visible: false, prop: 'projectRemark', label: '备注' },
  { visible: false, prop: 'updateTime', label: '更新时间' },
  { visible: false, prop: 'updateEmpno', label: '更新人' },
  { visible: false, prop: 'createTime', label: '创建时间' },
  { visible: false, prop: 'createEmpno', label: '创建人' }
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

// 创建时间时间范围
const dateRangeCreateTime = ref([])

var dictParams = [{ dictType: 'sys_product_type' }, { dictType: 'sys_product_line' }]

proxy.getDicts(dictParams).then((response) => {
  response.data.forEach((element) => {
    state.options[element.dictType] = element.list
  })
})

function getList() {
  proxy.addDateRange(queryParams, dateRangeCreateTime.value, 'CreateTime')
  loading.value = true
  listNpiProjet(queryParams).then((res) => {
    const { code, data } = res
    if (code == 200) {
      dataList.value = data.result
      total.value = data.totalNum
      loading.value = false
    }
  })
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置查询操作
function resetQuery() {
  // 创建时间时间范围
  dateRangeCreateTime.value = []
  proxy.resetForm('queryRef')
  handleQuery()
}
// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}
// 自定义排序
function sortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order

    if (column.prop == 'npiNo') {
      sort = 'npi_no'
    }
  }
  queryParams.sort = sort
  queryParams.sortType = sortType
  handleQuery()
}
function onNpiView(id, npino) {
  router.push({
    path: 'NPI/NpiInfo',
    query: {
      ID: id,
      NPINO: npino
    } // 传递的参数
  })
}
/*************** form操作 ***************/
const formRef = ref()
const title = ref('')
// 操作类型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    // npiNo: [{ required: true, message: 'NPINO不能为空', trigger: 'blur' }],
    companyName: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
    customerName: [{ required: true, message: '客户名称不能为空', trigger: 'blur' }],
    ipn: [{ required: true, message: '料号不能为空', trigger: 'blur' }],
    apn: [{ required: true, message: '客户料号不能为空', trigger: 'blur' }],
    projectTrialStage: [{ required: true, message: '项目试制阶段不能为空', trigger: 'blur' }],
    productType: [{ required: true, message: '产品类型不能为空', trigger: 'change' }],
    productLine: [{ required: true, message: '产品线不能为空', trigger: 'change' }],
    rdManager: [{ required: true, message: '研发项目经理不能为空', trigger: 'blur' }],
    npiEngineer: [{ required: true, message: 'NPI工程师不能为空', trigger: 'blur' }],
    productVersion: [{ required: true, message: '产品版本不能为空', trigger: 'blur' }],
    projectRemark: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
  },
  options: {
    // 产品类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    sys_product_type: [],
    // 产品线 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    sys_product_line: []
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 关闭dialog
function cancel() {
  open.value = false
  reset()
}

// 重置表单
function reset() {
  form.value = {
    id: null,
    npiNo: null,
    companyName: null,
    customerName: null,
    ipn: null,
    apn: null,
    projectTrialStage: null,
    productType: null,
    productLine: null,
    rdManager: null,
    npiEngineer: null,
    productVersion: null,
    projectRemark: null,
    updateTime: null,
    updateEmpno: null,
    createTime: null,
    createEmpno: null,
    enabled: null,
    option1: null,
    option2: null,
    option3: null,
    option4: null,
    option5: null,
    option6: null
  }
  proxy.resetForm('formRef')
}
// 添加按钮操作
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加NPI项目管理'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getNpiProjet(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改NPI项目管理'
      opertype.value = 2

      form.value = {
        ...data
      }
    }
  })
}

// 添加&修改 表单提交
function submitForm() {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined && opertype.value === 2) {
        updateNpiProjet(form.value).then((res) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addNpiProjet(form.value).then((res) => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}

// 删除按钮操作
function handleDelete(row) {
  const Ids = row.id || ids.value

  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？')
    .then(function () {
      return delNpiProjet(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
}

// 清空
function handleClear() {
  proxy
    .$confirm('是否确认清空所有数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(function () {
      return clearNpiProjet()
    })
    .then(() => {
      handleQuery()
      proxy.$modal.msgSuccess('清空成功')
    })
}

/**
 * 查看
 * @param {*} row
 */
function handlePreview(row) {
  reset()
  open.value = true
  title.value = '查看'
  opertype.value = 3
  form.value = { ...row }
}

// 导入数据成功处理
const handleFileSuccess = (response) => {
  const { item1, item2 } = response.data
  var error = ''
  item2.forEach((item) => {
    error += item.storageMessage + ','
  })
  proxy.$alert(item1 + '<p>' + error + '</p>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  getList()
}

// 导出按钮操作
function handleExport() {
  proxy
    .$confirm('是否确认导出NPI项目管理数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      await proxy.downFile('/business/NpiProjet/export', { ...queryParams })
    })
}

handleQuery()
</script>
