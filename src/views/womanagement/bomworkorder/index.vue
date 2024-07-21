<!--
 * @Descripttion: (/M_BILL_MATERIAL)
 * @Author: (admin)
 * @Date: (2024-05-16)
-->
<template>
  <div>
    <el-form :model="queryParams" label-position="right" inline ref="queryRef" v-show="showSearch" @submit.prevent>
      <el-form-item>
        <el-button icon="search" type="primary" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具区域 -->
    <el-row :gutter="15" class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" v-hasPermi="['womanagement:bomworkorder:add']" plain icon="plus" @click="handleAdd">
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
      <el-table-column prop="ipn" label="Ipn" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('ipn')"/>
      <el-table-column prop="sPEC1" label="SPEC1" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('sPEC1')"/>
      <el-table-column prop="version" label="Version" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('version')"/>
      <el-table-column prop="itemIpn" label="ItemIpn" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('itemIpn')"/>
      <el-table-column prop="itemSpec1" label="ItemSpec1" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('itemSpec1')"/>
      <el-table-column prop="itemGroup" label="ItemGroup" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('itemGroup')"/>
      <el-table-column prop="itemCount" label="ItemCount" align="center" v-if="columns.showColumn('itemCount')"/>
      <el-table-column prop="updateEmpno" label="UpdateEmpno" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('updateEmpno')"/>
      <el-table-column prop="updateTime" label="UpdateTime" :show-overflow-tooltip="true"  v-if="columns.showColumn('updateTime')"/>
      <el-table-column prop="itemVersion" label="ItemVersion" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('itemVersion')"/>
      <el-table-column prop="stationType" label="StationType" align="center" >
      </el-table-column>
      <el-table-column prop="site" label="Site" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('site')"/>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['womanagement:bomworkorder:edit']" @click="handleUpdate(scope.row)"></el-button>
          <el-button type="danger" size="small" icon="delete" title="删除" v-hasPermi="['womanagement:bomworkorder:delete']" @click="handleDelete(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <el-drawer
      v-model="drawer"
      title="选择IPN"
      direction="ttb"
      size="100%"
    >
      <el-form :model="ipnqueryParams" label-position="right" inline ref="queryRef"  @submit.prevent>
        <el-form-item label="IPN" prop="textData">
          <el-input v-model="ipnqueryParams.textData"  clearable  />
        </el-form-item>

        <el-form-item label="" >
          <el-button icon="search" type="primary"  @click="getListIpn">{{ $t('btn.search') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="IpndataList"
        v-loading="ipnloading"
        ref="table"
        border
        header-cell-class-name="el-table-header-cell"
        highlight-current-row
        @rowClick="rowClick"
        @sort-change="sortChange"
      >
        <el-table-column prop="ipn" label="料号" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="apn" label="Apn" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="sPEC1" label="分组" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="sPEC2" label="品名2/描述" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="version" label="Version" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="model" label="Model" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="modelCustomer" label="ModelCustomer" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="modelNo" label="ModelNo" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="typedesc" label="Typedesc" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="inhouseproduction" label="Inhouseproduction" align="center" />
        <el-table-column prop="plandeliveryday" label="Plandeliveryday" align="center" />
        <el-table-column prop="mrpcontrol" label="Mrpcontrol" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="priceunit" label="Priceunit" align="center" />
        <el-table-column prop="price" label="Price" align="center"/>
        <el-table-column prop="currency" label="Currency" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="pricefrom" label="Pricefrom" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="profitcenter" label="Profitcenter" align="center" :show-overflow-tooltip="true" v-if="columns.showColumn('profitcenter')"/>
        <el-table-column prop="materialgroup" label="Materialgroup" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="category" label="Category" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="rohs" label="Rohs" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="dayns" label="Dayns" align="center" :show-overflow-tooltip="true" />
      </el-table>
      <pagination :total="Ipntotal" v-model:page="ipnqueryParams.pageNum"
                  v-model:limit="ipnqueryParams.pageSize" @pagination="getListIpn" />
    </el-drawer>
    <!--添加制程-->
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
        <!--      <el-table-column prop="id" label="Id" align="center" />-->
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

    <!-- 添加或修改对话框 -->
    <el-dialog  :title="title" :lock-scroll="false" v-model="open" >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="130px">
        <el-row :gutter="20">

          <el-col :lg="9">
            <el-form-item label="主料IPN" prop="ipn">
              <el-input disabled v-model="form.ipn" placeholder="请选择Ipn" />
            </el-form-item>
          </el-col>

          <el-col :lg="3">
            <el-button type="primary" @click="OpenIpnList(),drawer = true,Ipntype='Master'">选择</el-button>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="主料Version" prop="version">
              <el-input v-model="form.version" disabled />
            </el-form-item>
          </el-col>


          <el-col :lg="12">
            <el-form-item label="主料Spec1" prop="sPEC1">
              <el-input v-model="form.sPEC1" disabled />
            </el-form-item>
          </el-col>

          <el-col :lg="9">
            <el-form-item label="部件料Ipn" prop="itemIpn">
              <el-input disabled v-model="form.itemIpn" placeholder="请选择ItemIpn" />
            </el-form-item>
          </el-col>

          <el-col :lg="3">
            <el-button type="primary" @click="OpenIpnList(),drawer = true" >选择</el-button>
          </el-col>


          <el-col :lg="12">
            <el-form-item label="部件料Version" prop="itemVersion">
              <el-input v-model="form.itemVersion" disabled/>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="部件料Spec1" prop="itemSpec1">
              <el-input v-model="form.itemSpec1" disabled />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="部件料Groups" prop="itemGroup">
              <el-input v-model="form.itemGroup" placeholder="请输入ItemGroup" />
              <span style="color: red">0:non-substitution</span>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="部件料Count" prop="itemCount">
              <el-input v-model.number="form.itemCount" placeholder="请输入ItemCount" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="选择制程" prop="stationType">
              <el-input disabled v-model.number="form.stationType" placeholder="" />
            </el-form-item>

          </el-col>

          <el-col :lg="12">
            <el-button @click.prevent="selectSty()"
                       type="primary">选择制程</el-button>
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

<script setup name="mbillmaterial">
import { listMBillMaterial,
 addMBillMaterial, delMBillMaterial,
 updateMBillMaterial,getMBillMaterial,
 }
from '@/api/business/mbillmaterial.js'
import ITable from "@/components/ITable/index.vue";
const { proxy } = getCurrentInstance()
const ids = ref([])
const loading = ref(false)
const ipnloading = ref(false)
const postListSty = ref([])
const showSearch = ref(true)
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
})
const drawer = ref(false)
const ipnqueryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  sort: '',
  sortType: 'asc',
  textData:null,
  optionData:"ipn",
})
let queryParamsCodeSty = reactive({
  pageNum: 1,
  pageSize: 10,
  stationType:null
})
function handleQueryCodeSty() {
  queryParamsCodeSty.pageNum = 1
  getListCodeSty()
}
function  selectSty(){
  getListCodeSty()
  visibleselectSty.value=true
}
function rowClickSty(row, column, event) {
  form.value.stationType=row.stationType
  visibleselectSty.value=false
}

import { listMStationType}

  from '@/api/business/mstationtype.js'
function getListCodeSty(){
  listMStationType(queryParamsCodeSty).then(res => {
    const { code, data } = res
    if (code == 200) {
      postListSty.value = data.result
      totalCodeSty.value = data.totalNum
    }
  })
}

const totalCodeSty = ref(0)
const loadingSty = ref(false)
const visibleselectSty = ref(false)
const columns = ref([
  { visible: true, prop: 'ipn', label: 'Ipn' },
  { visible: true, prop: 'sPEC1', label: 'SPEC1' },
  { visible: true, prop: 'version', label: 'Version' },
  { visible: true, prop: 'itemIpn', label: 'ItemIpn' },
  { visible: true, prop: 'itemSpec1', label: 'ItemSpec1' },
  { visible: true, prop: 'itemGroup', label: 'ItemGroup' },
  { visible: true, prop: 'itemCount', label: 'ItemCount' },
  { visible: true, prop: 'itemVersion', label: 'ItemVersion' },
  { visible: true, prop: 'stationType', label: 'StationType' },
  { visible: true, prop: 'updateTime', label: 'UpdateTime' },
  { visible: true, prop: 'updateEmpno', label: 'UpdateEmpno' },
  { visible: false, prop: 'createTime', label: 'CreateTime' },
  { visible: false, prop: 'id', label: 'Id' },
  { visible: false, prop: 'site', label: 'Site' },
])
const total = ref(0)
const Ipntotal = ref(0)
function handleQuerySty() {
  queryParamsCodeSty.pageNum = 1
  getListCodeSty()
}
const dataList = ref([])
const IpndataList = ref([])

const queryRef = ref()
const defaultTime = ref([new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)])

import { getPartData } from '@/api/datacenter/product/part'
import {ElButton, ElDrawer} from "element-plus";
import {CircleCloseFilled} from "@element-plus/icons-vue";
import {ref} from "vue";
const showSearchCode = ref(true)
function getList(){
  loading.value = true
  listMBillMaterial(queryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      dataList.value = data.result
      total.value = data.totalNum
      loading.value = false
    }
  })
}

function OpenIpnList(){
getListIpn();
}
function getListIpn(){
  ipnloading.value = true
  getPartData(ipnqueryParams).then(res => {
    const { code, data } = res
    if (code == 200) {
      IpndataList.value = data.result
      Ipntotal.value = data.totalNum
    }
    ipnloading.value = false
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
// 表格配置项
const columns1 = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('part.IPN'), prop: 'ipn', visible: true, sortable: true, width: 160 },
  { key: 2, label: proxy.$t('part.APN'), prop: 'apn', visible: true, sortable: true, width: 140 },
  { key: 3, label: proxy.$t('part.PART_TYPE'), prop: 'partType', visible: true, sortable: true, width: 120 },
  { key: 4, label: proxy.$t('part.SPEC1'), prop: 'spec1', visible: true, sortable: true, width: 180 },
  { key: 5, label: proxy.$t('part.SPEC2'), prop: 'spec2', visible: true, sortable: true, width: 180 },
  { key: 6, label: proxy.$t('part.VERSION'), prop: 'version', visible: true, sortable: true, width: 120 },
  { key: 7, label: proxy.$t('part.MODEL'), prop: 'model', visible: true, sortable: true, width: 120 },
  { key: 8, label: proxy.$t('model.modelCustomer'), prop: 'modelCustomer', visible: true, sortable: true, width: 120 },
  { key: 9, label: proxy.$t('part.MODEL_NO'), prop: 'modelNo', visible: true, sortable: true, width: 80 },
  { key: 10, label: proxy.$t('part.EEEE'), prop: 'eeee', visible: true, sortable: true, width: 100 },
  { key: 11, label: proxy.$t('part.CONFIG'), prop: 'config', visible: true, sortable: true, width: 120 },
  { key: 12, label: proxy.$t('part.VENDOR'), prop: 'vendor', visible: true, sortable: true, width: 120 },
  { key: 13, label: proxy.$t('part.MPN'), prop: 'mpn', visible: true, sortable: true, width: 80 },
  { key: 14, label: proxy.$t('part.PLANT'), prop: 'plant', visible: true, sortable: true, width: 100 },
  { key: 15, label: proxy.$t('part.BACKFLUSH'), prop: 'backflush', visible: true, sortable: true, width: 140 },
  { key: 16, label: proxy.$t('part.CALLOFF'), prop: 'calloff', visible: true, sortable: true, width: 120 },
  { key: 17, label: proxy.$t('part.PROCUREMENT'), prop: 'procurement', visible: true, sortable: true, width: 160 },
  { key: 18, label: proxy.$t('part.PROCUREMENTDESC'), prop: 'procurementdesc', visible: true, sortable: true, width: 200 },
  { key: 19, label: proxy.$t('part.TYPE'), prop: 'type', visible: true, sortable: true, width: 100 },
  { key: 20, label: proxy.$t('part.TYPEDESC'), prop: 'typedesc', visible: true, sortable: true, width: 140 },
  { key: 21, label: proxy.$t('part.INHOUSEPRODUCTION'), prop: 'inhouseproduction', visible: true, sortable: true, width: 220 },
  { key: 22, label: proxy.$t('part.PLANDELIVERYDAY'), prop: 'plandeliveryday', visible: true, sortable: true, width: 200 },
  { key: 23, label: proxy.$t('part.MRPCONTROL'), prop: 'mrpcontrol', visible: true, sortable: true, width: 160 },
  { key: 24, label: proxy.$t('part.PRICEUNIT'), prop: 'priceunit', visible: true, sortable: true, width: 140 },
  { key: 25, label: proxy.$t('part.PRICE'), prop: 'price', visible: true, sortable: true, width: 100 },
  { key: 26, label: proxy.$t('part.CURRENCY'), prop: 'currency', visible: true, sortable: true, width: 140 },
  { key: 27, label: proxy.$t('part.PRICEFROM'), prop: 'pricefrom', visible: true, sortable: true, width: 140 },
  { key: 28, label: proxy.$t('part.PROFITCENTER'), prop: 'profitcenter', visible: true, sortable: true, width: 160 },
  { key: 29, label: proxy.$t('part.MATERIALGROUP'), prop: 'materialgroup', visible: true, sortable: true, width: 180 },
  { key: 30, label: proxy.$t('part.category'), prop: 'category', visible: true, sortable: true, width: 140 },
  { key: 31, label: proxy.$t('part.ROHS'), prop: 'rohs', visible: true, sortable: true, width: 100 },
  { key: 32, label: proxy.$t('part.DAYNS'), prop: 'dayns', visible: true, sortable: true, width: 100 },
  { key: 33, label: proxy.$t('part.ASSESSION'), prop: 'assession', visible: true, sortable: true, width: 140 },
  { key: 34, label: proxy.$t('part.CUSTOMERGROUP'), prop: 'customergroup', visible: true, sortable: true, width: 180 },
  { key: 35, label: proxy.$t('part.DIVISION'), prop: 'division', visible: true, sortable: true, width: 120 },
  { key: 36, label: proxy.$t('part.DELETEFLAG'), prop: 'deleteflag', visible: true, sortable: true, width: 160 },
  { key: 37, label: proxy.$t('part.GENERALDESC'), prop: 'generaldesc', visible: true, sortable: true, width: 160 },
  { key: 38, label: proxy.$t('part.BONDEDFLAG'), prop: 'bondedflag', visible: true, sortable: true, width: 160 },
  { key: 39, label: proxy.$t('part.HOLDFLAG'), prop: 'holdflag', visible: true, sortable: true, width: 140 },
  { key: 40, label: proxy.$t('part.MODELFAMILY'), prop: 'modelfamily', visible: true, sortable: true, width: 160 },
  { key: 41, label: proxy.$t('part.CUSTOMERMODELNAME'), prop: 'customermodelname', visible: true, sortable: true, width: 220 },
  { key: 42, label: proxy.$t('part.LABELCPN'), prop: 'labelcpn', visible: true, sortable: true, width: 140 },
  { key: 43, label: proxy.$t('part.UPC'), prop: 'upc', visible: true, sortable: true, width: 80 },
  { key: 44, label: proxy.$t('part.EAN'), prop: 'ean', visible: true, sortable: true, width: 80 },
  { key: 45, label: proxy.$t('part.JAN'), prop: 'jan', visible: true, sortable: true, width: 80 },
  { key: 46, label: proxy.$t('part.LASTUPDATE'), prop: 'lastupdate', visible: true, sortable: true, width: 160 },
  { key: 47, label: proxy.$t('part.PRDINDICATE'), prop: 'prdindicate', visible: true, sortable: true, width: 160 },
  { key: 48, label: proxy.$t('part.BASEUNITMEASURE'), prop: 'baseunitmeasure', visible: true, sortable: true, width: 200 },
  { key: 49, label: proxy.$t('part.PPID'), prop: 'ppid', visible: true, sortable: true, width: 100 },
  { key: 50, label: proxy.$t('part.EQUIVALENTPN'), prop: 'equivalentpn', visible: true, sortable: true, width: 160 },
  { key: 51, label: proxy.$t('part.MATERIALTYPE'), prop: 'materialtype', visible: true, sortable: true, width: 160 },
  { key: 52, label: proxy.$t('part.PRODUCTDESCCONFIG1'), prop: 'productdescconfig1', visible: true, sortable: true, width: 220 },
  { key: 53, label: proxy.$t('part.PRODUCTDESCCONFIG2'), prop: 'productdescconfig2', visible: true, sortable: true, width: 220 },
  { key: 54, label: proxy.$t('part.PRODUCTDESCCOLOR1'), prop: 'productdesccolor1', visible: true, sortable: true, width: 220 },
  { key: 55, label: proxy.$t('part.PRODUCTDESCCOLOR2'), prop: 'productdesccolor2', visible: true, sortable: true, width: 220 },
  { key: 56, label: proxy.$t('part.RADIO'), prop: 'radio', visible: true, sortable: true, width: 120 },
  { key: 57, label: proxy.$t('part.REGION'), prop: 'region', visible: true, sortable: true, width: 120 },
  { key: 58, label: proxy.$t('part.PACKINGTYPE'), prop: 'packingtype', visible: true, sortable: true, width: 160 },
  { key: 59, label: proxy.$t('part.ALLIEREVISION'), prop: 'allierevision', visible: true, sortable: true, width: 160 },
  { key: 60, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, sortable: true, width: 120 },
  { key: 61, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 180 },
  { key: 62, label: proxy.$t('part.OPTION1'), prop: 'option1', visible: true, sortable: true, width: 120 },
  { key: 63, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 64, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right' }
])

/*************** form操作 ***************/
const formRef = ref()
const title = ref('')
// 操作类型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
const openIpn = ref(false)
const Ipntype = ref("")
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    id: [{ required: true, message: "Id不能为空", trigger: "blur" }],
  },
  options: {
    // StationType 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    stationTypeOptions: [],
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

// 关闭dialog
function cancel(){
  open.value = false
  reset()
}

function rowClick(row, column, event) {
  if (Ipntype.value==='Master'){
    form.value.ipn=row.ipn
    form.value.version=row.version
    form.value.sPEC1=row.sPEC1
  }else {
    form.value.itemIpn=row.ipn
    form.value.itemVersion=row.version
    form.value.itemSpec1=row.sPEC1
  }
  drawer.value=false
  Ipntype.value=""
}

// 重置表单
function reset() {
  form.value = {
    itemVersion: null,
    stationType: null,
    updateEmpno: null,
    updateTime: null,
    createTime: null,
    id: null,
    itemCount: null,
    ipn: null,
    sPEC1: null,
    version: null,
    itemIpn: null,
    itemSpec1: null,
    itemGroup: null,
    site: null,
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
  const id = row.id || ids.value
  getMBillMaterial(id).then((res) => {
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
        updateMBillMaterial(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMBillMaterial(form.value).then((res) => {
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
      return delMBillMaterial(Ids)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess("删除成功")
    })
}






handleQuery()
</script>
