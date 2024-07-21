<!--
 * @Descripttion: (/P_SN_TRAVEL)
 * @Author: (admin)
 * @Date: (2024-05-21)
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
    </el-form>
    <!-- 工具区域 -->
<!--    <el-row :gutter="15" class="mb10">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button type="primary" v-hasPermi="['business:psntravel:add']" plain icon="plus" @click="handleAdd">-->
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
      <el-table-column prop="workOrder" label="工单编号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('workOrder')"/>
<!--     // <el-table-column prop="locationNo" label="LocationNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('locationNo')"/>-->
      <el-table-column prop="serialNumber" label="流水号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('serialNumber')"/>
      <el-table-column prop="ipn" label="料号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('ipn')"/>
      <el-table-column prop="version" label="版本" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('version')"/>
      <el-table-column prop="routeName" label="工艺路线" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('routeName')"/>
<!--      //<el-table-column prop="line" label="Line" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('line')"/>-->
<!--     // <el-table-column prop="stage" label="Stage" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('stage')"/>-->
      <el-table-column prop="stationType" label="制程" align="center" v-if="columns.showColumn('stationType')">
<!--        <template #default="scope">-->
<!--          <dict-tag :options=" options.stationTypeOptions" :value="scope.row.stationType"  />-->
<!--        </template>-->
      </el-table-column>
      <el-table-column prop="clientType" label="ClientType" align="center" v-if="columns.showColumn('clientType')">
        <template #default="scope">
          <dict-tag :options=" options.clientTypeOptions" :value="scope.row.clientType"  />
        </template>
      </el-table-column>
      <el-table-column prop="stationName" label="StationName" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('stationName')"/>
      <el-table-column prop="nextStationType" label="NextStationType" align="center" v-if="columns.showColumn('nextStationType')">
        <template #default="scope">
          <dict-tag :options=" options.nextStationTypeOptions" :value="scope.row.nextStationType"  />
        </template>
      </el-table-column>
      <el-table-column prop="currentStatus" label="CurrentStatus" align="center" v-if="columns.showColumn('currentStatus')">
        <template #default="scope">
          <dict-tag :options=" options.currentStatusOptions" :value="scope.row.currentStatus"  />
        </template>
      </el-table-column>
      <el-table-column prop="workFlag" label="WorkFlag" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('workFlag')"/>
      <el-table-column prop="inStationtypeTime"  align="center" label="进入制程的时间" :show-overflow-tooltip="true"  v-if="columns.showColumn('inStationtypeTime')"/>
      <el-table-column prop="outStationtypeTime" align="center" label="离开制程的时间" :show-overflow-tooltip="true"  v-if="columns.showColumn('outStationtypeTime')"/>
      <el-table-column prop="inLineTime" label="InLineTime" :show-overflow-tooltip="true"  v-if="columns.showColumn('inLineTime')"/>
      <el-table-column prop="outLineTime" label="OutLineTime" :show-overflow-tooltip="true"  v-if="columns.showColumn('outLineTime')"/>
      <el-table-column prop="palletNo" label="PalletNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('palletNo')"/>
      <el-table-column prop="cartonNo" label="CartonNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('cartonNo')"/>
      <el-table-column prop="qcNo" label="QcNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('qcNo')"/>
      <el-table-column prop="qcResult" label="QcResult" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('qcResult')"/>
      <el-table-column prop="customer" label="Customer" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customer')"/>
      <el-table-column prop="reworkNo" label="ReworkNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('reworkNo')"/>
      <el-table-column prop="empNo" label="EmpNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('empNo')"/>
      <el-table-column prop="customerSn" label="CustomerSn" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('customerSn')"/>
      <el-table-column prop="wipStationType" label="WipStationType" align="center" v-if="columns.showColumn('wipStationType')">
        <template #default="scope">
          <dict-tag :options=" options.wipStationTypeOptions" :value="scope.row.wipStationType"  />
        </template>
      </el-table-column>
      <el-table-column prop="wipQty" label="WipQty" align="center" v-if="columns.showColumn('wipQty')"/>
      <el-table-column prop="boxNo" label="BoxNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('boxNo')"/>
      <el-table-column prop="panelNo" label="PanelNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('panelNo')"/>
      <el-table-column prop="rcNo" label="RcNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('rcNo')"/>
      <el-table-column prop="holdFlag" label="HoldFlag" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('holdFlag')"/>
      <el-table-column prop="passCnt" label="PassCnt" align="center" v-if="columns.showColumn('passCnt')"/>
      <el-table-column prop="stateFlag" label="StateFlag" align="center" v-if="columns.showColumn('stateFlag')">
        <template #default="scope">
          <dict-tag :options=" options.stateFlagOptions" :value="scope.row.stateFlag"  />
        </template>
      </el-table-column>
      <el-table-column prop="stateDesc" label="StateDesc" align="center" v-if="columns.showColumn('stateDesc')">
        <template #default="scope">
          <dict-tag :options=" options.stateDescOptions" :value="scope.row.stateDesc"  />
        </template>
      </el-table-column>
      <el-table-column prop="snVersion" label="SnVersion" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('snVersion')"/>
      <el-table-column prop="rpRoute" label="RpRoute" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('rpRoute')"/>
      <el-table-column prop="createTime" label="CreateTime" :show-overflow-tooltip="true"  v-if="columns.showColumn('createTime')"/>
      <el-table-column prop="oPTION1" label="OPTION1" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('oPTION1')"/>
      <el-table-column prop="oPTION2" label="OPTION2" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('oPTION2')"/>
      <el-table-column prop="oPTION3" label="OPTION3" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('oPTION3')"/>
      <el-table-column prop="oPTION4" label="OPTION4" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('oPTION4')"/>
      <el-table-column prop="oPTION5" label="OPTION5" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('oPTION5')"/>
      <el-table-column prop="snCounter" label="SnCounter" align="center" v-if="columns.showColumn('snCounter')"/>
      <el-table-column prop="machineNo" label="设备编号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('machineNo')"/>
      <el-table-column prop="toolingNo" label="载具编号" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('toolingNo')"/>
      <el-table-column prop="fixedQty" label="固定数量" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('toolingNo')"/>
      <el-table-column prop="cavityNo" label="CavityNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('cavityNo')"/>
      <el-table-column prop="shippingNo" label="ShippingNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('shippingNo')"/>
      <el-table-column prop="warehouseNo" label="WarehouseNo" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('warehouseNo')"/>
      <el-table-column prop="model" label="Model" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('model')"/>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['business:psntravel:edit']" @click="handleUpdate(scope.row)"></el-button>
<!--          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['business:psntravel:delete']" @click="handleDelete(scope.row)"></el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />


    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :lock-scroll="false" v-model="open" >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="WorkOrder" prop="workOrder">
              <el-input v-model="form.workOrder" placeholder="请输入WorkOrder" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="LocationNo" prop="locationNo">
              <el-input v-model="form.locationNo" placeholder="请输入LocationNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="SerialNumber" prop="serialNumber">
              <el-input v-model="form.serialNumber" placeholder="请输入SerialNumber" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Ipn" prop="ipn">
              <el-input v-model="form.ipn" placeholder="请输入Ipn" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Version" prop="version">
              <el-input v-model="form.version" placeholder="请输入Version" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="RouteName" prop="routeName">
              <el-input v-model="form.routeName" placeholder="请输入RouteName" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Line" prop="line">
              <el-input v-model="form.line" placeholder="请输入Line" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="fixedQty" prop="fixedQty">
              <el-input v-model="form.fixedQty" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Stage" prop="stage">
              <el-input v-model="form.stage" placeholder="请输入Stage" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="StationType" prop="stationType">
              <el-select v-model="form.stationType"  placeholder="请选择StationType">
                <el-option
                  v-for="item in options.stationTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="ClientType" prop="clientType">
              <el-select v-model="form.clientType"  placeholder="请选择ClientType">
                <el-option
                  v-for="item in options.clientTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="StationName" prop="stationName">
              <el-input v-model="form.stationName" placeholder="请输入StationName" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="NextStationType" prop="nextStationType">
              <el-select v-model="form.nextStationType"  placeholder="请选择NextStationType">
                <el-option
                  v-for="item in options.nextStationTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="CurrentStatus" prop="currentStatus">
              <el-radio-group v-model="form.currentStatus">
                <el-radio v-for="item in options.currentStatusOptions" :key="item.dictValue" :label="item.dictValue">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="WorkFlag" prop="workFlag">
              <el-input v-model="form.workFlag" placeholder="请输入WorkFlag" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="InStationtypeTime" prop="inStationtypeTime">
              <el-date-picker v-model="form.inStationtypeTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="OutStationtypeTime" prop="outStationtypeTime">
              <el-date-picker v-model="form.outStationtypeTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="InLineTime" prop="inLineTime">
              <el-date-picker v-model="form.inLineTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="OutLineTime" prop="outLineTime">
              <el-date-picker v-model="form.outLineTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="PalletNo" prop="palletNo">
              <el-input v-model="form.palletNo" placeholder="请输入PalletNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="CartonNo" prop="cartonNo">
              <el-input v-model="form.cartonNo" placeholder="请输入CartonNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="QcNo" prop="qcNo">
              <el-input v-model="form.qcNo" placeholder="请输入QcNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="QcResult" prop="qcResult">
              <el-input v-model="form.qcResult" placeholder="请输入QcResult" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Customer" prop="customer">
              <el-input v-model="form.customer" placeholder="请输入Customer" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="ReworkNo" prop="reworkNo">
              <el-input v-model="form.reworkNo" placeholder="请输入ReworkNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="EmpNo" prop="empNo">
              <el-input v-model="form.empNo" placeholder="请输入EmpNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="CustomerSn" prop="customerSn">
              <el-input v-model="form.customerSn" placeholder="请输入CustomerSn" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="WipStationType" prop="wipStationType">
              <el-select v-model="form.wipStationType"  placeholder="请选择WipStationType">
                <el-option
                  v-for="item in options.wipStationTypeOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="WipQty" prop="wipQty">
              <el-input v-model.number="form.wipQty" placeholder="请输入WipQty" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="BoxNo" prop="boxNo">
              <el-input v-model="form.boxNo" placeholder="请输入BoxNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="PanelNo" prop="panelNo">
              <el-input v-model="form.panelNo" placeholder="请输入PanelNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="RcNo" prop="rcNo">
              <el-input v-model="form.rcNo" placeholder="请输入RcNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="HoldFlag" prop="holdFlag">
              <el-input v-model="form.holdFlag" placeholder="请输入HoldFlag" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="PassCnt" prop="passCnt">
              <el-input v-model.number="form.passCnt" placeholder="请输入PassCnt" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="StateFlag" prop="stateFlag">
              <el-radio-group v-model="form.stateFlag">
                <el-radio v-for="item in options.stateFlagOptions" :key="item.dictValue" :label="parseInt(item.dictValue)">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="StateDesc" prop="stateDesc">
              <el-radio-group v-model="form.stateDesc">
                <el-radio v-for="item in options.stateDescOptions" :key="item.dictValue" :label="item.dictValue">
                  {{item.dictLabel}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="SnVersion" prop="snVersion">
              <el-input v-model="form.snVersion" placeholder="请输入SnVersion" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="RpRoute" prop="rpRoute">
              <el-input v-model="form.rpRoute" placeholder="请输入RpRoute" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="CreateTime" prop="createTime">
              <el-date-picker v-model="form.createTime" type="datetime" :teleported="false" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="OPTION1" prop="oPTION1">
              <el-input v-model="form.oPTION1" placeholder="请输入OPTION1" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="OPTION2" prop="oPTION2">
              <el-input v-model="form.oPTION2" placeholder="请输入OPTION2" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="OPTION3" prop="oPTION3">
              <el-input v-model="form.oPTION3" placeholder="请输入OPTION3" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="OPTION4" prop="oPTION4">
              <el-input v-model="form.oPTION4" placeholder="请输入OPTION4" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="OPTION5" prop="oPTION5">
              <el-input v-model="form.oPTION5" placeholder="请输入OPTION5" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="SnCounter" prop="snCounter">
              <el-input v-model.number="form.snCounter" placeholder="请输入SnCounter" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="MachineNo" prop="machineNo">
              <el-input v-model="form.machineNo" placeholder="请输入MachineNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="ToolingNo" prop="toolingNo">
              <el-input v-model="form.toolingNo" placeholder="请输入ToolingNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="CavityNo" prop="cavityNo">
              <el-input v-model="form.cavityNo" placeholder="请输入CavityNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="ShippingNo" prop="shippingNo">
              <el-input v-model="form.shippingNo" placeholder="请输入ShippingNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="WarehouseNo" prop="warehouseNo">
              <el-input v-model="form.warehouseNo" placeholder="请输入WarehouseNo" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Model" prop="model">
              <el-input v-model="form.model" placeholder="请输入Model" />
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

<script setup name="psntravel">
import { listPSnTravel,
 addPSnTravel, delPSnTravel,
 updatePSnTravel,getPSnTravel,
 }
from '@/api/business/psntravel.js'
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
  { visible: true, prop: 'workOrder', label: 'WorkOrder' },
  { visible: true, prop: 'locationNo', label: 'LocationNo' },
  { visible: true, prop: 'serialNumber', label: 'SerialNumber' },
  { visible: true, prop: 'fixedQty', label: 'fixedQty' },
  { visible: true, prop: 'ipn', label: 'Ipn' },
  { visible: false, prop: 'version', label: 'Version' },
  { visible: true, prop: 'routeName', label: 'RouteName' },
  { visible: true, prop: 'line', label: 'Line' },
  { visible: true, prop: 'stage', label: 'Stage' },
  { visible: true, prop: 'stationType', label: 'StationType' },
  { visible: false, prop: 'clientType', label: 'ClientType' },
  { visible: false, prop: 'stationName', label: 'StationName' },
  { visible: false, prop: 'nextStationType', label: 'NextStationType' },
  { visible: false, prop: 'currentStatus', label: 'CurrentStatus' },
  { visible: false, prop: 'workFlag', label: 'WorkFlag' },
  { visible: true, prop: 'inStationtypeTime', label: '进入制程的时间' },
  { visible: true, prop: 'outStationtypeTime', label: '离开制程的时间' },
  { visible: false, prop: 'inLineTime', label: 'InLineTime' },
  { visible: false, prop: 'outLineTime', label: 'OutLineTime' },
  { visible: false, prop: 'palletNo', label: 'PalletNo' },
  { visible: false, prop: 'cartonNo', label: 'CartonNo' },
  { visible: false, prop: 'qcNo', label: 'QcNo' },
  { visible: false, prop: 'qcResult', label: 'QcResult' },
  { visible: false, prop: 'customer', label: 'Customer' },
  { visible: false, prop: 'reworkNo', label: 'ReworkNo' },
  { visible: false, prop: 'empNo', label: 'EmpNo' },
  { visible: false, prop: 'customerSn', label: 'CustomerSn' },
  { visible: false, prop: 'wipStationType', label: 'WipStationType' },
  { visible: false, prop: 'wipQty', label: 'WipQty' },
  { visible: false, prop: 'boxNo', label: 'BoxNo' },
  { visible: false, prop: 'panelNo', label: 'PanelNo' },
  { visible: false, prop: 'rcNo', label: 'RcNo' },
  { visible: false, prop: 'holdFlag', label: 'HoldFlag' },
  { visible: false, prop: 'passCnt', label: 'PassCnt' },
  { visible: false, prop: 'stateFlag', label: 'StateFlag' },
  { visible: false, prop: 'stateDesc', label: 'StateDesc' },
  { visible: false, prop: 'snVersion', label: 'SnVersion' },
  { visible: false, prop: 'rpRoute', label: 'RpRoute' },
  { visible: false, prop: 'createTime', label: 'CreateTime' },
  { visible: false, prop: 'oPTION1', label: 'OPTION1' },
  { visible: false, prop: 'oPTION2', label: 'OPTION2' },
  { visible: false, prop: 'oPTION3', label: 'OPTION3' },
  { visible: false, prop: 'oPTION4', label: 'OPTION4' },
  { visible: false, prop: 'oPTION5', label: 'OPTION5' },
  { visible: false, prop: 'snCounter', label: 'SnCounter' },
  { visible: true, prop: 'machineNo', label: 'MachineNo' },
  { visible: true, prop: 'toolingNo', label: 'ToolingNo' },
  { visible: false, prop: 'cavityNo', label: 'CavityNo' },
  { visible: false, prop: 'shippingNo', label: 'ShippingNo' },
  { visible: false, prop: 'warehouseNo', label: 'WarehouseNo' },
  { visible: false, prop: 'model', label: 'Model' },
])
const total = ref(0)
const dataList = ref([])
const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])


var dictParams = [
]


function getList(){
  loading.value = true
  listPSnTravel(queryParams).then(res => {
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
  },
  options: {
    // StationType 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stationTypeOptions: [],
    // ClientType 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    clientTypeOptions: [],
    // NextStationType 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    nextStationTypeOptions: [],
    // CurrentStatus 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    currentStatusOptions: [],
    // WipStationType 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    wipStationTypeOptions: [],
    // StateFlag 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stateFlagOptions: [],
    // StateDesc 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stateDescOptions: [],
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
    workOrder: null,
    locationNo: null,
    serialNumber: null,
    ipn: null,
    version: null,
    routeName: null,
    line: null,
    stage: null,
    stationType: null,
    clientType: null,
    stationName: null,
    nextStationType: null,
    currentStatus: null,
    workFlag: null,
    inStationtypeTime: null,
    outStationtypeTime: null,
    inLineTime: null,
    outLineTime: null,
    palletNo: null,
    cartonNo: null,
    qcNo: null,
    qcResult: null,
    customer: null,
    reworkNo: null,
    empNo: null,
    customerSn: null,
    wipStationType: null,
    wipQty: null,
    boxNo: null,
    panelNo: null,
    rcNo: null,
    holdFlag: null,
    passCnt: null,
    stateFlag: null,
    stateDesc: null,
    snVersion: null,
    rpRoute: null,
    createTime: null,
    oPTION1: null,
    oPTION2: null,
    oPTION3: null,
    oPTION4: null,
    oPTION5: null,
    snCounter: null,
    machineNo: null,
    toolingNo: null,
    cavityNo: null,
    shippingNo: null,
    warehouseNo: null,
    model: null,
  };
  proxy.resetForm("formRef")
}
// 添加按钮操作
function handleAdd() {
  reset();
  open.value = true
  title.value = '添加'
  opertype.value = 1
}
// 修改按钮操作
function handleUpdate(row) {
  reset()
  const id = row.serialNumber
  getPSnTravel(id).then((res) => {
    const { code, data } = res
    if (code == 200) {
      open.value = true
      title.value = '修改'
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
        updatePSnTravel(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPSnTravel(form.value).then((res) => {
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
      return delPSnTravel(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}






handleQuery()
</script>
