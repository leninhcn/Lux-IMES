<!--
 * @Descripttion: (不良品统计/P_NG_DETAIL)
 * @Author: (admin)
 * @Date: (2024-04-20)
-->
<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item :label="工单号" prop="defectCode">
        <el-input v-model="queryParams.workOrder" placeholder="输入工单" clearable @keyup.enter="handleQueryList" style="width:200px" />
      </el-form-item>
<!--      <el-form-item  label="选择站点" >-->
<!--&lt;!&ndash;        <el-col :span="12">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-cascader  clearable :props="customProps"  style="width: 300px" v-model="queryParams.stationType" :options="stations" :show-all-levels="false" />&ndash;&gt;-->
<!--&lt;!&ndash;        </el-col>&ndash;&gt;-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQueryList">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['ng:pngdetail:add']" plain icon="plus" @click="handleAdd">
          {{ $t('btn.add') }}
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
      @sort-change="sortChange"
    >
      <el-table-column type="index" label="序号" align="center" width="80"/>
      <el-table-column prop="workOrder" label="工单编号" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('workOrder')"/>
      <el-table-column prop="stage" label="区段" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('stage')"/>
      <el-table-column prop="ipn" label="生产料号" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('ipn')"/>
      <el-table-column prop="targetqty" label="工单目标产量" align="center" v-if="columns.showColumn('targetqty')"/>

      <el-table-column prop="stationId" label="工站ID" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('stationId')"/>

      <el-table-column prop="stationName" label="工站名称" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('stationName')"/>
      <el-table-column prop="stationType" label="制程" align="center" v-if="columns.showColumn('stationType')">

      </el-table-column>
      <el-table-column prop="machineCode" label="设备"  />
      <el-table-column prop="samplingInspection" label="单次抽检数量" align="center"
                       v-if="columns.showColumn('samplingInspection')"/>
      <el-table-column prop="samplingInspectionNg" label="单次抽检数量不良品" align="center"
                       v-if="columns.showColumn('samplingInspectionNg')"/>
      <el-table-column prop="defectCode" label="不良代码" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('defectCode')"/>
      <el-table-column prop="badDetail" label="不良描述" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('badDetail')"/>
      <el-table-column prop="insertionCode" label="插架码" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('insertionCode')"/>
      <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('createTime')"/>
      <el-table-column prop="operator" label="操作员" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('operator')"/>
      <el-table-column prop="handlingMeasures" label="处理措施" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('handlingMeasures')"/>
      <el-table-column prop="createEmpno" label="创建人员工号" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('createEmpno')"/>
      <el-table-column prop="updateEmpno" label="更新人员工号" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('updateEmpno')"/>
      <el-table-column prop="updateTime" label="更新时间" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('updateTime')"/>
      <el-table-column prop="lineId" label="线别" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('lineId')"/>
      <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true"
                       v-if="columns.showColumn('remark')"/>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <!--          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['ng:pngdetail:edit']"-->
          <!--                     @click="handleUpdate(scope.row)"></el-button>-->
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['ng:pngdetail:delete']"
                     @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
                @pagination="getList"/>
    <!-- 添加或修改不良品统计对话框 -->
    <el-dialog width="60%" :close-on-click-modal ="false"  :title="title" :lock-scroll="false" v-model="open">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="6">
            <el-form-item label="工单编号" prop="workOrder">
              <el-input disabled v-model="form.workOrder" placeholder="请选择工单"/>
            </el-form-item>
          </el-col>

          <el-col :lg="6">
            <el-form-item label="" >
              <el-button  @click="selectDefectWo()" type="primary">请选择</el-button>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="生产料号" prop="ipn">
              <el-input  disabled v-model="form.ipn" placeholder=""/>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="工单目标产量" prop="targetqty">
              <el-input disabled v-model.number="form.targetqty" placeholder=""/>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label-width="130px" label="抽检数量" prop="samplingInspection">
              <el-input-number  min=0  :precision="2" v-model.number="form.samplingInspection" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :lg="24">
            <el-table  border :data="tableData1" style="width: 100%" max-height="350">
              <el-table-column type="index" width="50" />
              <el-table-column prop="defectCode" label="不良代码"  />
              <el-table-column prop="badDetail" label="不良描述"  />
              <el-table-column prop="stationType" label="制程" >

                <template #default="scope">
                  <el-select  v-model="scope.row.stationType"
                              @change="((val)=>{handleChange(val,scope.row)})"
                              placeholder="请选择制程" >
                    <el-option
                      v-for="item in optionsStyType"
                      :key="item.statioN_TYPE"
                      :label="item.statioN_TYPE"
                      :value="item.statioN_TYPE"
                    />
                  </el-select>
                </template>

              </el-table-column>
              <el-table-column prop="machineCode" label="设备号"  >

                <template #default="scope">
                  <el-select  v-model="scope.row.machineCode"
                              placeholder="请选择设备" >
                    <el-option
                      v-for="item in optionsmachine"
                      :key="item.machinE_NO"
                      :label="item.machinE_NO"
                      :value="item.machinE_NO"
                    />
                  </el-select>
                </template>

              </el-table-column>

              <el-table-column prop="samplingInspectionNg" label="不良品数量" width="180" >
                <template #default="scope">
                  <el-input-number  min=0  :precision="2" v-model.number="scope.row.samplingInspectionNg" placeholder=""/>
                </template>
              </el-table-column>
              <el-table-column prop="insertionCode" label="插架码" width="100" >
                <template #default="scope">
                  <el-input  v-model="scope.row.insertionCode" placeholder=""/>
                </template>
              </el-table-column>

              <el-table-column prop="handlingMeasures" label="处理措施" width="140" >
                <template #default="scope">
                  <el-input  v-model="scope.row.handlingMeasures" placeholder=""/>
                </template>
              </el-table-column>
              <el-table-column prop="REMARK" label="备注 " width="180" >
                <template #default="scope">
                  <el-input  v-model="scope.row.REMARK" placeholder=""/>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" >
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click.prevent="deleteRow(scope.$index)"
                  >
                    删除
                  </el-button>
                  <el-button @click.prevent="selectDefectCode(scope.row,scope.$index)"
                             link
                             size="small"
                             type="primary">不良代码</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button class="mt-4" style="width: 100%" @click="onAddItem">
              添加不良
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

    <el-drawer size="80%" direction="ttb" v-model="visibleCode" :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">请选择不良代码!</h4>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
      </template>
      <el-form :model="queryParamsCode" ref="queryForm" :inline="true" v-show="showSearchCode" label-width="68px">
        <el-form-item label="不良代码" prop="defectCode">
          <el-input v-model="queryParamsCode.defectCode" placeholder="请输入不良代码" clearable @keyup.enter="handleQueryCode" />
        </el-form-item>
        <el-form-item label="不良原因" prop="defectDesc">
          <el-input v-model="queryParamsCode.defectDesc" placeholder="请输入不良原因" clearable @keyup.enter="handleQueryCode" />
        </el-form-item>
        <el-form-item label="状态" prop="enabled">
          <el-select v-model="queryParamsCode.enabled" placeholder="不良编码状态" >
            <el-option v-for="dict in statusOptionsCode" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table align="center"  @rowClick="rowClick" v-loading="loading" :data="postList" >
        <el-table-column type="selection"  width="55" align="center" />
        <el-table-column label="不良代码" align="center" prop="defectCode"  />
        <el-table-column label="不良描述" align="center" prop="defectDesc" />
        <el-table-column label="不良描述2" align="center" prop="defectDesc2" />
        <el-table-column label="不良类型" align="center" prop="defectType" />
        <el-table-column label="代码级别" align="center" prop="codeLevel" />
        <el-table-column label="不良级别" align="center" prop="defectLevel" />
        <el-table-column label="父不良代码" align="center" prop="parentDefectCode" />
        <el-table-column label="站点类型" align="center" prop="stationType" />
        <el-table-column label="机种" align="center" prop="model" />
        <el-table-column label="状态" align="center" prop="enabled"/>
        <el-table-column label="更新人员" align="center" prop="updateEmpno" sortable />
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180" sortable>
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人员" align="center" prop="createEmpno" sortable />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable>
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="totalCode > 0" :total="totalCode" v-model:page="queryParamsCode.pageNum" v-model:limit="queryParamsCode.pageSize" @pagination="getListCode" />
    </el-drawer>
    <!--  选择工单-->
    <el-drawer size="80%" direction="ttb" v-model="visibleWo" :show-close="false">
      <el-form :model="queryParamsWo" ref="queryForm" :inline="true" v-show="showSearchWo" label-width="78px">
        <el-form-item :label="$t('mntnworkorder.Select')" prop="Select">
          <el-select v-model="queryParamsWo.Select" placeholder="选择筛选条件" style="width: 120px">
            <el-option v-for="dict in woselectoptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('mntnworkorder.Value')" prop="Value">
          <el-input v-model="queryParamsWo.Value" placeholder="输入条件" clearable @keyup.enter="handleQueryWo" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQueryWo">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="handleQueryWo">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <right-toolbar v-model:showSearch="showSearchWo" @queryTable="getListWo"></right-toolbar>
      </el-row>
      <el-table
        :data="dataListWo"
        v-loading="loadingWo"
        ref="table"
        border
        header-cell-class-name="el-table-header-cell"
        highlight-current-row
        @sort-change="sortChange"
        @rowClick="rowClickWo"
      >
        <el-table-column prop="workOrder" label="工单编号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('workOrder')"/>
        <el-table-column prop="woType" label="工单类型" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('model')"/>
        <el-table-column prop="model" label="机种名字" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('model')"/>
        <el-table-column prop="ipn" label="料号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('ipn')"/>
        <el-table-column prop="version" label="版本" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('version')"/>
        <el-table-column prop="targetQty" label="工单目标产量" align="center" v-if="columns.showColumn('targetQty')"/>
        <el-table-column prop="inputQty" label="目前已投入数量" align="center" v-if="columns.showColumn('inputQty')"/>
        <el-table-column prop="outputQty" label="合格数量" align="center" v-if="columns.showColumn('outputQty')"/>
        <el-table-column prop="ngQty" label="不良数量" align="center" v-if="columns.showColumn('ngQty')"/>
        <el-table-column prop="scrapQty" label="报废数量" align="center" v-if="columns.showColumn('scrapQty')"/>
        <el-table-column prop="line" label="线别" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('line')"/>
      </el-table>
      <pagination :total="totalWo" v-model:page="queryParamsWo.pageNum" v-model:limit="queryParamsWo.pageSize" @pagination="getListWo" />
    </el-drawer>
    <!--  选择制程-->
    <el-drawer size="80%" direction="ttb" v-model="visibleselectSty" :show-close="false">
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">请选择制程!</h4>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
      </template>
      <el-form :model="queryParamsCodeSty" ref="queryForm" :inline="true" v-show="showSearchCode" label-width="68px">
        <el-form-item label="" prop="defectCode">
          <el-input v-model="queryParamsCodeSty.stationType" placeholder="请输入制程" clearable @keyup.enter="handleQueryCodeSty" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuerySty">{{ $t('btn.search') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table align="center"  @rowClick="rowClickSty" v-loading="loadingSty" :data="postListSty" >
        <el-table-column prop="stationType" label="StationType" align="center" ></el-table-column>
        <el-table-column prop="materialLoadFlag" label="MaterialLoadFlag" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="stationtypeCustomer" label="StationtypeCustomer" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="operateType" label="OperateType" align="center" >
          <template #default="scope">
            <dict-tag :options=" options.operateTypeOptions" :value="scope.row.operateType"  />
          </template>
        </el-table-column>
        <el-table-column prop="clientType" label="ClientType" align="center" >
          <template #default="scope">
            <dict-tag :options=" options.clientTypeOptions" :value="scope.row.clientType"  />
          </template>
        </el-table-column>
        <el-table-column prop="stationTypeSeq" label="StationTypeSeq" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="stage" label="Stage" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="stationTypeDesc" label="StationTypeDesc" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="customerStationDesc" label="CustomerStationDesc" align="center" :show-overflow-tooltip="true"/>
        <el-table-column prop="updateEmpno" label="UpdateEmpno" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="updateTime" label="UpdateTime" :show-overflow-tooltip="true"  />
        <el-table-column prop="createEmpno" label="CreateEmpno" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="currentCt" label="CurrentCt" align="center"/>
      </el-table>
      <pagination v-show="totalCodeSty > 0" :total="totalCodeSty" v-model:page="queryParamsCodeSty.pageNum" v-model:limit="queryParamsCodeSty.pageSize" @pagination="getListCodeSty" />
    </el-drawer>
  </div>
</template>

<script setup name="pngdetail">
import {
  listPNgDetail,
  addPNgDetail, delPNgDetail, QuerySnTravel,
  updatePNgDetail, getPNgDetail, ListMaChine, SnTravelMacine,
}
  from '@/api/ng/pngdetail.js'
import {getall, getallToNg} from '@/api/womanagement/mntnworkorder'
const {proxy} = getCurrentInstance()

const ids = ref([])
const loading = ref(false)
const loadingSty = ref(false)
const loadingWo = ref(false)

const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  workOrder:'',
  stationType:''
})

const customProps={
  value: "label", // 自定义当前数组的键名 - value
  label: "label", // 自定义当前数组的键名 - label
  children: "children", // 自定义当前数组的键名 - children
  emitPath:false//返回最后一级的值
}

function handleChange(val,row){
  row.machineCode=""
  SnTravelMacine(val,form.value.workOrder).then(res => {
    const {code, data} = res
    optionsmachine.value=[]
    optionsmachine.value= data
    //
    // console.log("optionsmachine",optionsmachine.value)
  })
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
//
//   const res = await getStations({ site: userStore.site, opTypes: props.opTypes, clientTypes: props.clientTypes })
//
//   console.log("res",res)
//   stations.value = res
// }
// handleGetStations()

//工单
const woselectoptions=ref([])
proxy.getDicts('workorder').then((response)=>{
  woselectoptions.value=response.data
})
/** 搜索按钮操作 */
function handleQueryWo() {
  queryParamsWo.pageNum = 1
  getListWo()
}
const columns = ref([
  {visible: true, prop: 'workOrder', label: '工单编号'},
  {visible: true, prop: 'ipn', label: '生产料号'},
  {visible: true, prop: 'REMARK', label: '描述'},
  {visible: true, prop: 'targetqty', label: '工单目标产量'},
  {visible: true, prop: 'stationType', label: '制程'},
  {visible: true, prop: 'samplingInspection', label: '单次抽检数量'},
  {visible: true, prop: 'samplingInspectionNg', label: '单次抽检数量不良品'},
  {visible: true, prop: 'defectCode', label: '不良代码'},
  {visible: true, prop: 'badDetail', label: '不良描述'},
  {visible: true, prop: 'insertionCode', label: '插架码'},
  {visible: true, prop: 'createTime', label: '创建时间'},
  {visible: true, prop: 'operator', label: '操作员'},
  {visible: false, prop: 'stage', label: '区段'},
  {visible: false, prop: 'stationId', label: '工站ID'},
  {visible: false, prop: 'stationName', label: '工站名称'},
  {visible: false, prop: 'handlingMeasures', label: '处理措施'},
  {visible: false, prop: 'delflag', label: '删除标志（0代表存在 1代表删除）'},
  {visible: false, prop: 'site', label: '厂区-租户'},
  {visible: false, prop: 'createEmpno', label: '创建人员工号'},
  {visible: false, prop: 'updateEmpno', label: '更新人员工号'},
  {visible: false, prop: 'updateTime', label: '更新时间'},
  {visible: false, prop: 'lineId', label: '线别'},
])
const total = ref(0)
const dataList = ref([])
const dataListWo = ref([])
const queryRef = ref()
// 岗位表格数据
const postList = ref([])
const postListSty = ref([])
// 查询参数
let queryParamsCode = reactive({
  pageNum: 1,
  pageSize: 10,
  defectCode: undefined,
  defectDesc: undefined,
  enabled: undefined
})

let queryParamsCodeSty = reactive({
  pageNum: 1,
  pageSize: 10,
  stationType:null
})
const now = new Date()


const tableData1 = ref([

])
const optionsStyType = ref([])
const optionsmachine = ref([])

const deleteRow = function(index) {
  tableData1.value.splice(index, 1);
}
const onAddItem = () => {
  if (form.value.workOrder===null){
    proxy.$modal.msgError("请先选择工单!")
    return
  }
//查询工单的途程
  QuerySnTravel(form.value.workOrder).then(res => {
    const {code, data} = res
    if (data.length<=0) {
      proxy.$modal.msgError("该笔工单没有制程!")
    }else{
      optionsStyType.value= data
      now.setDate(now.getDate() + 1)
      tableData1.value.push({
        defectCode:null,
        samplingInspectionNg:null,
        stationType:null
      })
    }
  })
}





const MaChine=ref([])
// 显示搜索条件
const showSearchCode = ref(true)
// 总条数
const totalCode = ref(0)
const totalCodeSty = ref(0)
// 岗位表格数据
// 弹出层标题
const titleCode = ref('')
// 是否显示弹出层
const openCode = ref(false)
const totalWo = ref(0)
const showSearchWo = ref(true)
const queryParamsWo = reactive({
  pageNum: 1,
  pageSize: 10,
  Select: '',
  sortType: 'asc',
})
// 状态数据字典
const statusOptionsCode = ref([])
//行点击事件,选择不良代码
function rowClick(row, column, event) {
  if (indexTable.value===-1){
    return
  }
  tableData1.value[indexTable.value].defectCode=row.defectCode
  tableData1.value[indexTable.value].badDetail=row.defectDesc
  visibleCode.value=false
}
function rowClickSty(row, column, event) {
  if (indexTable.value===-1){
    return
  }
  tableData1.value[indexTable.value].stationType=row.stationType
  visibleselectSty.value=false
}


function rowClickWo(row, column, event) {
  tableData1.value=[]
  form.value.workOrder=row.workOrder
  form.value.ipn=row.ipn
  form.value.targetqty=row.targetQty
  visibleWo.value=false
}

function getList() {
  loading.value = true
  listPNgDetail(queryParams).then(res => {
    const {code, data} = res
    if (code == 200) {
      dataList.value = data.result
      total.value = data.totalNum
      loading.value = false
    }
  })
}
function getListWo(){
  loadingWo.value = true
  queryParamsWo.site=userStore.site
  getallToNg(queryParamsWo).then((response) => {
    dataListWo.value = response.data.result
    totalWo.value = response.data.totalNum
    loadingWo.value = false
  })
}


function handleQueryList() {
  queryParams.pageNum = 1
  getList()
}
// 查询
function handleQuery() {
  queryParams.pageNum = 1
  getListCode()
}
function handleQuerySty() {
  queryParamsCodeSty.pageNum = 1
  getListCodeSty()
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
function handleQueryCode() {
  queryParamsCode.pageNum = 1
  getListCode()
}

function handleQueryCodeSty() {
  queryParamsCodeSty.pageNum = 1
  getListCodeSty()
}
function getListCodeSty(){
  listMStationType(queryParamsCodeSty).then(res => {
    const { code, data } = res
    if (code == 200) {
      postListSty.value = data.result
      totalCodeSty.value = data.totalNum
    }
  })
}
import { listMStationType}

  from '@/api/business/mstationtype.js'
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
    Id: [{
      // required: true, message: "不良统计明细ID不能为空", trigger: "blur", type: "number"
    }],
    samplingInspection:[{
      required: true, message: "数量不能为空", trigger: "blur", type: "number"
    }],
    samplingInspectionNg:[{
      required: true, message: "数量不能为空", trigger: "blur", type: "number"
    }],
    // defectCode:[{
    //   required: true, message: "请选择不良代码 ", trigger: "blur", type: "string"
    // }],
    workOrder:[{
      required: true, message: "请选择工单 ", trigger: "blur", type: "string"
    }],
    // machineCode:[{
    //   required: true, message: "请选择设备 ", trigger: "blur", type: "string"
    // }],
  },
  options: {
    // 工站类型 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stationTypeOptions: [],
  }
})

const {form, rules, options, single, multiple} = toRefs(state)
// 关闭dialog
function cancel() {
  open.value = false
  reset()
}

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
    machineCode:null,
    REMARK:null,
    List:null
  };
  proxy.resetForm("formRef")
}
import { ref } from 'vue'
import { ElButton, ElDrawer } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import {defectlistPost} from "@/api/datacenter/mntndefect";
import useUserStore from "@/store/modules/user";
import {getStations} from "@/api/repair";
const visibleCode = ref(false)
const visibleselectSty = ref(false)
const visibleWo = ref(false)
const indexTable = ref(-1)
// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加不良品统计'
  opertype.value = 1
  form.value.operator=userStore.name
}

//选择不良代码
function  selectDefectCode(row,index){
  indexTable.value=index
  getListCode()
  visibleCode.value=true
}
function getListCode() {
  defectlistPost(queryParamsCode).then((response) => {
    postList.value = response.data.result
    totalCode.value = response.data.totalNum
  })
}

function  selectDefectWo(){
  getListWo()
  visibleWo.value=true
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

// 添加&修改 表单提交
function submitForm() {
  if (tableData1.value===null||tableData1.value.length <= 0){
    proxy.$modal.msgError("数据请填写完整!")
    return
  }
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined && opertype.value === 2) {
        updatePNgDetail(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        let ngNum=0;
        let ok=true
        form.value.dataList=tableData1.value
        form.value.dataList.forEach(item=>{
          ngNum+=item.samplingInspectionNg
          if (item.defectCode===null) {
            ok=false
          }
          if (item.samplingInspectionNg===null){
            ok=false
          }
          if (item.stationType===null){
            ok=false
          }
          if (item.stationType===null||item.stationType===""){
            ok=false
          }
          if (item.machineCode===null||item.machineCode===""){
            ok=false
          }
        })
        if (!ok){
          proxy.$modal.msgError("数据请填写完整!")
          return
        }

        if (form.value.samplingInspection<ngNum){
          proxy.$modal.msgError("不良总数不能超过抽检数量")
          return;
        }
        if (form.value.targetqty<ngNum){
          proxy.$modal.msgError("不良总数不能超过工单目标数量!")
          return;
        }
        addPNgDetail(form.value).then((res) => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
          tableData1.value=[]
          reset()
        })
      }
    }
  })
}
//下拉框改变事件
// function changeMaChina(e){
//   if (e){
//     form.value.line=e.line==null?'':e.line
//     form.value.machineCode=e.machinE_CODE==null?'':e.machinE_CODE
//     form.value.stationName=e.statioN_NAME==null?'':e.statioN_NAME
//     form.value.stationType=e.statioN_TYPE==null?'':e.statioN_TYPE
//   }
// }
// 删除按钮操作
function handleDelete(row) {
  const Ids = row.id
  proxy
    .$confirm('是否确认删除参数编号为"' + Ids + '"的数据项？')
    .then(function () {
      return delPNgDetail(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}
function getMachina(){
  ListMaChine(queryParams).then(res => {
    const {code, data} = res
    if (code == 200) {
      MaChine.value= data
    }
  })
}
getMachina()
handleQuery()
getList()
</script>
