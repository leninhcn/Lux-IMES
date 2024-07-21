<!--
 * @Descripttion: (不良品统计/P_NG_DETAIL)
 * @Author: (admin)
 * @Date: (2024-04-20)
-->
<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单号" prop="defectCode">
        <el-input v-model="queryParams.workOrder" placeholder="输入工单" clearable @keyup.enter="handleQuery"
                  style="width:200px"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <!--        <el-button type="primary" v-hasPermi="['ng:pngdetail:add']" plain icon="plus" @click="handleAdd">-->
        <!--          {{ $t('btn.add') }}-->
        <!--        </el-button>-->
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
      @sort-change="sortChange"
    >
      <el-table-column type="index" label="序号" align="center" width="80"/>
      <el-table-column prop="worK_ORDER" label="工单编号" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('workOrder')"/>
      <el-table-column prop="ipn" label="生产料号" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('ipn')"/>
      <el-table-column prop="targetqty" label="工单目标产量" align="center" v-if="columns.showColumn('targetqty')"/>
      <el-table-column prop="statioN_TYPE" label="制程站点" align="center" v-if="columns.showColumn('stationType')"/>
      <el-table-column prop="ok" label="累计抽检" align="center"
                       v-if="columns.showColumn('samplingInspection')"/>
      <el-table-column prop="ng" label="累计不良" align="center"
                       v-if="columns.showColumn('samplingInspectionNg')"/>
      <el-table-column label="良率" align="center">
        <template #default="scope">
          <span style="color: red">
        {{ ((scope.row.ok / scope.row.targetqty) * 100).toFixed(2) }}%
            </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                @pagination="getList"/>
  </div>
</template>

<script setup name="pngdetail">
import {
  listPNgDetail,
  addPNgDetail, delPNgDetail,
  updatePNgDetail, getPNgDetail, ListMaChine, statistics,
}
  from '@/api/ng/pngdetail.js'
import {getall} from '@/api/womanagement/mntnworkorder'

const {proxy} = getCurrentInstance()

const ids = ref([])
const loading = ref(false)
const loadingWo = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  workOrder: '',
  stationType: ''
})

const customProps = {
  value: "label", // 自定义当前数组的键名 - value
  label: "label", // 自定义当前数组的键名 - label
  children: "children", // 自定义当前数组的键名 - children
  emitPath: false//返回最后一级的值
}

const props = defineProps({
  storageKey: {
    type: String,
    required: true
  },
  opTypes: {
    type: Array,
    default: ["Assy"]
  },
  clientTypes: {
    type: Array,
    default: ["MANU"]
  }
})

const userStore = useUserStore()//获取当前登录的用户

// 获取站点
const stations = ref([])
// async function handleGetStations() {
//   const res = await getStations({ site: userStore.site, opTypes: props.opTypes, clientTypes: props.clientTypes })
//   stations.value = res
// }
// handleGetStations()
//工单
const woselectoptions = ref([])
proxy.getDicts('workorder').then((response) => {
  woselectoptions.value = response.data
})
/** 搜索按钮操作 */
// function handleQueryWo() {
//   queryParamsWo.pageNum = 1
//   getListWo()
// }
const columns = ref([
  {visible: true, prop: 'workOrder', label: '工单编号'},
  {visible: true, prop: 'ipn', label: '生产料号'},
  {visible: true, prop: 'targetqty', label: '工单目标产量'},
  {visible: true, prop: 'stationType', label: '制程站点'},
  {visible: true, prop: 'samplingInspection', label: '累计抽检'},
  {visible: true, prop: 'samplingInspectionNg', label: '累计不良'},
  {visible: true, prop: 'defectCode', label: '良率'},
])
const total = ref(0)
const dataList = ref([])
const dataListWo = ref([])
const queryRef = ref()
// 岗位表格数据
const postList = ref([])
// 查询参数
let queryParamsCode = reactive({
  pageNum: 1,
  pageSize: 10,
  defectCode: undefined,
  defectDesc: undefined,
  enabled: undefined
})
// 总条数
const totalCode = ref(0)
// 岗位表格数据
// 弹出层标题
// 是否显示弹出层
const totalWo = ref(0)
const queryParamsWo = reactive({
  pageNum: 1,
  pageSize: 10,
  Select: '',
  sortType: 'asc',
})
// 状态数据字典
const statusOptionsCode = ref([])

//行点击事件,选择不良代码

function getList() {
  loading.value = true
  statistics(queryParams).then(res => {
    const {code, data} = res
    if (code == 200) {
      console.log("data", data)
      dataList.value = data
      // total.value = data.totalNum
      loading.value = false
    }
  })
}

function getListWo() {
  loadingWo.value = true
  queryParamsWo.site = userStore.site
  getall(queryParamsWo).then((response) => {
    dataListWo.value = response.data.result
    totalWo.value = response.data.totalNum
    loadingWo.value = false
  })
}

// 查询
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

// 重置查询操作
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

proxy.getDicts('status').then((response) => {
  statusOptionsCode.value = response.data
})

// 自定义排序
function sortChange(column) {
  var sort = undefined
  var sortType = undefined

  if (column.prop != null && column.order != null) {
    sort = column.prop
    sortType = column.order
  }
  queryParams.sort = sort
  queryParams.sortType = sortType
  handleQuery()
}

/*************** form操作 ***************/
const formRef = ref()
const title = ref('')
// 操作类型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const loadingCode = ref(false)
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    samplingInspection: [{
      required: true, message: "数量不能为空", trigger: "blur", type: "number"
    }],
    samplingInspectionNg: [{
      required: true, message: "数量不能为空", trigger: "blur", type: "number"
    }],
    // defectCode:[{
    //   required: true, message: "请选择不良代码 ", trigger: "blur", type: "string"
    // }]
  },
  options: {
    // 工站类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stationTypeOptions: [],
  }
})

const {form, rules, options, single, multiple} = toRefs(state)
// 关闭dialog
// 重置表单
function reset() {
  form.value = {
    Id: null,
    stage: null,
    ipn: null,
    targetqty: null,
    stationId: null,
    stationName: null,
    stationType: null,
    samplingInspection: null,
    samplingInspectionNg: null,
    defectCode: null,
    badDetail: null,
    insertionCode: null,
    operator: null,
    handlingMeasures: null,
    delflag: null,
    site: null,
    createEmpno: null,
    updateEmpno: null,
    createTime: null,
    updateTime: null,
    lineId: null,
    workOrder: null,
    machineCode: null,
    REMARK: null
  };
  proxy.resetForm("formRef")
}

import {ref} from 'vue'
import {ElButton, ElDrawer} from 'element-plus'
import {CircleCloseFilled} from '@element-plus/icons-vue'
import {defectlistPost} from "@/api/datacenter/mntndefect";
import useUserStore from "@/store/modules/user";
import {getStations} from "@/api/repair";

const visibleCode = ref(false)
const visibleWo = ref(false)

// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加不良品统计'
  opertype.value = 1
  form.value.operator = userStore.name
}

//选择不良代码
function selectDefectCode() {
  getListCode()
  visibleCode.value = true
}

function selectDefectWo() {
  getListWo()
  visibleWo.value = true
}

// 修改按钮操作
function handleUpdate(row) {
  reset()
  getPNgDetail(row.id).then((res) => {
    const {code, data} = res
    if (code == 200) {
      open.value = true
      title.value = '修改不良品统计'
      opertype.value = 2
      form.value = {
        ...data,
      }
    }
  })
}

handleQuery()
</script>
