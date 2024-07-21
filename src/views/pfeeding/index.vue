<!--
 * @Descripttion: (上下料
/P_FEEDING)
 * @Author: (admin)
 * @Date: (2024-05-20)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item label="工单编号" prop="workOrder">
        <el-input v-model="queryParams.workOrder" placeholder="工单编号" clearable  />
      </el-form-item>
      <el-form-item label="制程" prop="stationType">
        <el-input v-model="queryParams.stationType" placeholder="请输入制程" clearable />
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
<!--    <el-row :gutter="15" class="mb10">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button type="primary" v-hasPermi="['business:pfeeding:add']" plain icon="plus" @click="handleAdd">-->
<!--          {{ $t('btn.add') }}-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>-->
<!--    </el-row>-->

    <el-table
      :data="dataList"
      v-loading="loading"
      ref="table"
      border
      header-cell-class-name="el-table-header-cell"
      highlight-current-row
      @sort-change="sortChange"
    >
<!--      <el-table-column prop="id" label="主键" align="center" v-if="columns.showColumn('id')"/>-->

      <el-table-column prop="workOrder" label="工单编号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('workOrder')"/>

      <el-table-column prop="batchno" label="批号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('batchno')"/>
      <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true"  v-if="columns.showColumn('updateTime')"/>
      <el-table-column prop="targetqty" label="工单目标产量" align="center" v-if="columns.showColumn('targetqty')"/>
      <el-table-column prop="inputQty" label="已投数量" align="center" />
      <el-table-column prop="machineCode" label="设备编号
" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('machineCode')"/>
      <el-table-column prop="machineType" label="设备名称" align="center" v-if="columns.showColumn('machineType')">
        <template #default="scope">
          <dict-tag :options=" options.machineTypeOptions" :value="scope.row.machineType"  />
        </template>
      </el-table-column>
      <el-table-column prop="itemIpn" label="部件料号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('itemIpn')"/>
      <el-table-column prop="partCount" label="记录上下料的数量" align="center" v-if="columns.showColumn('partCount')"/>
      <el-table-column prop="scanType" label="操作类型(记录上料还是下料)"   align="center" >

      </el-table-column>
<!--      <el-table-column prop="line" label="线别" align="center" :show-overflow-tooltip="true" />-->
<!--      <el-table-column prop="stage" label="区段" align="center" :show-overflow-tooltip="true" />-->
      <el-table-column prop="stationType" label="制程" align="center" >
<!--        <template #default="scope">-->
<!--          <dict-tag :options=" options.stationTypeOptions" :value="scope.row.stationType"  />-->
<!--        </template>-->
      </el-table-column>
      <el-table-column prop="enabled" label="资料是否有效" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('enabled')"/>
      <el-table-column prop="site" label="厂区-租户" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('site')"/>
      <el-table-column prop="createEmpno" label="创建人员工号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('createEmpno')"/>
      <el-table-column prop="updateEmpno" label="更新人员工号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('updateEmpno')"/>
      <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true"  v-if="columns.showColumn('createTime')"/>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['business:pfeeding:edit']" @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['business:pfeeding:delete']" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />


    <!-- 添加或修改上下料
对话框 -->
    <el-dialog :title="title" :lock-scroll="false" v-model="open" >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

<!--          <el-col :lg="12">-->
<!--            <el-form-item label="主键" prop="id">-->
<!--              <el-input v-model.number="form.id" placeholder="请输入主键" :disabled="opertype != 1"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :lg="12">
            <el-form-item label="工单编号" prop="workOrder">
              <el-input v-model="form.workOrder" placeholder="请输入工单编号" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="更新时间" prop="updateTime">
              <el-date-picker v-model="form.updateTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="工单目标产量" prop="targetqty">
              <el-input v-model.number="form.targetqty" placeholder="请输入工单目标产量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="已投数量" prop="quantityAlreadyInvested">
              <el-input v-model.number="form.quantityAlreadyInvested" placeholder="请输入已投数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="设备编号
" prop="machineCode">
              <el-input v-model="form.machineNo" placeholder="请输入设备编号
" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="设备名称" prop="machineType">
              <el-select v-model="form.machineType"  placeholder="请选择设备名称">
                <el-option
                  v-for="item in options.machineTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="批号" prop="batchno">
              <el-input v-model="form.batchno" placeholder="请输入批号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="部件料号" prop="itemIpn">
              <el-input v-model="form.itemIpn" placeholder="请输入部件料号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="记录上下料的数量" prop="partCount">
              <el-input v-model.number="form.partCount" placeholder="请输入记录上下料的数量" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="操作类型(记录上料还是下料)" prop="scanType">
              <el-select v-model="form.scanType"  placeholder="请选择操作类型(记录上料还是下料)">
                <el-option
                  v-for="item in options.scanTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="线别" prop="line">
              <el-input v-model="form.line" placeholder="请输入线别" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="区段" prop="stage">
              <el-input v-model="form.stage" placeholder="请输入区段" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="制程" prop="stationType">
              <el-select v-model="form.stationType"  placeholder="请选择制程">
                <el-option
                  v-for="item in options.stationTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="资料是否有效" prop="enabled">
              <el-input v-model="form.enabled" placeholder="请输入资料是否有效" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="厂区-租户" prop="site">
              <el-input v-model="form.site" placeholder="请输入厂区-租户" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="创建人员工号" prop="createEmpno">
              <el-input v-model="form.createEmpno" placeholder="请输入创建人员工号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="更新人员工号" prop="updateEmpno">
              <el-input v-model="form.updateEmpno" placeholder="请输入更新人员工号" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="form.createTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>


        </el-row>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="pfeeding">
import { listPFeeding,
  addPFeeding, delPFeeding,
  updatePFeeding,getPFeeding,
}
  from '@/api/business/pfeeding.js'
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  workOrder:'',
  stationType:''
})
const columns = ref([

  { visible: true, prop: 'workOrder', label: '工单编号' },
  { visible: true, prop: 'id', label: '主键' },
  { visible: false, prop: 'updateTime', label: '更新时间' },
  { visible: true, prop: 'targetqty', label: '工单目标产量' },
  { visible: true, prop: 'quantityAlreadyInvested', label: '已投数量' },
  { visible: true, prop: 'machineCode', label: '设备编号    ' },
  { visible: false, prop: 'machineType', label: '设备名称' },
  { visible: true, prop: 'batchno', label: '批号' },
  { visible: true, prop: 'itemIpn', label: '部件料号' },
  { visible: false, prop: 'partCount', label: '记录上下料的数量' },
  { visible: true, prop: 'scanType', label: '操作类型(记录上料还是下料)' },
  { visible: false, prop: 'line', label: '线别' },
  { visible: false, prop: 'stage', label: '区段' },
  { visible: true, prop: 'stationType', label: '制程' },
  { visible: false, prop: 'enabled', label: '资料是否有效' },
  { visible: false, prop: 'site', label: '厂区-租户' },
  { visible: false, prop: 'createEmpno', label: '创建人员工号' },
  { visible: false, prop: 'updateEmpno', label: '更新人员工号' },
  { visible: false, prop: 'createTime', label: '创建时间' },
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

function getList(){
  loading.value = true
  listPFeeding(queryParams).then(res => {
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
function resetQuery(){
  proxy.resetForm("queryRef")
  handleQuery()
}
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
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    id: [{ required: true, message: "主键不能为空", trigger: "blur", type: "number" }],
  },
  options: {
    // 设备名称 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    machineTypeOptions: [],
    // 操作类型(记录上料还是下料) 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    scanTypeOptions: [],
    // 制程 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stationTypeOptions: [],
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 关闭dialog
function cancel(){
  open.value = false
  reset()
}

// 重置表单
function reset() {
  form.value = {
    id: null,
    updateTime: null,
    targetqty: null,
    quantityAlreadyInvested: null,
    machineCode: null,
    machineType: null,
    batchno: null,
    itemIpn: null,
    partCount: null,
    scanType: null,
    line: null,
    stage: null,
    stationType: null,
    enabled: null,
    site: null,
    createEmpno: null,
    updateEmpno: null,
    createTime: null,
    workOrder: null,
  };
  proxy.resetForm("formRef")
}
// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加上下料  '

  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.id || ids.value
  getPFeeding(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改上下料  '

      opertype.value = 2

      form.value = {
        ...data,
      }
    }
  })
}

// 添加&修改 表单提交
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {

      if (form.value.id != undefined && opertype.value === 2) {
        updatePFeeding(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPFeeding(form.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
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
      return delPFeeding(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}






handleQuery()
</script>
