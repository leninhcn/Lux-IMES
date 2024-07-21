<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="78px">
      <el-form-item :label="$t('mntnworkorder.WoStatus')" prop="WoStatus">
        <el-select v-model="queryParams.WoStatus" placeholder="选择工单状态" style="width: 150px">
          <el-option v-for="dict in wostatusoptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
          <el-option :key="ALL" :label="ALL" :value="ALL" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.Select')" prop="Select">
        <el-select v-model="queryParams.Select" placeholder="选择筛选条件" style="width: 120px">
          <el-option v-for="dict in woselectoptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.Value')" prop="Value">
        <el-input v-model="queryParams.Value" placeholder="输入条件" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="handleAdd"
          v-hasPermi="['womanagement:mntnworkorder:add']">{{ $t('btn.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['womanagement:mntnworkorder:update']">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="delete" title="停用" :disabled="multiple" v-if="false" @click="handleDelete"
          v-hasPermi="['womanagement:mntnworkorder:remove']">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport"
          v-hasPermi="['womanagement:mntnworkorder:export']">{{ $t('btn.export') }}</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" highlight-current-row @current-change="handleSelectionChange"
      style="width: 200%">
      <el-table-column fixed prop="workOrder" :label="$t('mntnworkorder.WorkOrder')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="model" :label="$t('mntnworkorder.Model')" align="center" :show-overflow-tooltip="true"
        width="100px" />
      <el-table-column prop="ipn" :label="$t('mntnworkorder.IPN')" align="center" :show-overflow-tooltip="true"
        width="150px" />
      <el-table-column prop="sPEC1" :label="$t('mntnworkorder.SPEC1')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="woType" :label="$t('mntnworkorder.WoType')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="woStatus" :label="$t('mntnworkorder.WoStatus')" align="center"
        :show-overflow-tooltip="true" width="150px">
        <template #default="scope">
          <dict-tag :options="wostatusoptions" :value="scope.row.woStatus" />
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="$t('mntnworkorder.Version')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="targetQty" :label="$t('mntnworkorder.TargetQty')" align="center" />
      <el-table-column prop="inputQty" :label="$t('mntnworkorder.InputQty')" align="center" />
      <el-table-column prop="outputQty" :label="$t('mntnworkorder.OutputQty')" align="center" />
      <el-table-column prop="ngQty" :label="$t('mntnworkorder.NgQty')" align="center" />
      <el-table-column prop="scrapQty" :label="$t('mntnworkorder.ScrapQty')" align="center" />
      <el-table-column prop="woCreateDate" :label="$t('mntnworkorder.WoCreateDate')" :show-overflow-tooltip="true"
        width="200px" />
      <el-table-column prop="woScheduleStartDate" :label="$t('mntnworkorder.WoScheduleStartDate')"
        :show-overflow-tooltip="true" width="200px" />
      <el-table-column prop="woScheduleCloseDate" :label="$t('mntnworkorder.WoScheduleCloseDate')"
        :show-overflow-tooltip="true" width="200px" />
      <el-table-column prop="woStartDate" :label="$t('mntnworkorder.WoStartDate')" :show-overflow-tooltip="true"
        width="200px" />
      <el-table-column prop="woCloseDate" :label="$t('mntnworkorder.WoCloseDate')" :show-overflow-tooltip="true"
        width="200px" />
      <el-table-column prop="snRule" label="SnRule" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="cartonRule" label="CartonRule" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="boxRule" label="BoxRule" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="palletRule" label="PalletRule" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="pkspecName" :label="$t('mntnworkorder.PkspecName')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="workFlag" :label="$t('mntnworkorder.WorkFlag')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="line" :label="$t('mntnworkorder.Line')" align="center" :show-overflow-tooltip="true"
        width="200px" />
      <el-table-column prop="lineType" :label="$t('mntnworkorder.LineType')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="routeName" :label="$t('mntnworkorder.RouteName')" align="center"
        :show-overflow-tooltip="true" width="200px" />
      <el-table-column prop="startStationType" :label="$t('mntnworkorder.StartStationType')" align="center"
        :show-overflow-tooltip="true" width="200px" />
      <el-table-column prop="endStationType" :label="$t('mntnworkorder.EndStationType')" align="center"
        :show-overflow-tooltip="true" width="200px" />
      <el-table-column prop="ruleSetName" :label="$t('mntnworkorder.RuleSetName')" align="center"
        :show-overflow-tooltip="true" width="200px" />
      <el-table-column prop="remark" :label="$t('mntnworkorder.Remark')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="warehouseNo" :label="$t('mntnworkorder.WarehouseNo')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="woBuild" :label="$t('mntnworkorder.WoBuild')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="woConfig" :label="$t('mntnworkorder.WoConfig')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="woPhsae" :label="$t('mntnworkorder.WoPhsae')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="woPurpose" :label="$t('mntnworkorder.WoPurpose')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="workCenter" :label="$t('mntnworkorder.WorkCenter')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="equipmentCode" :label="$t('mntnworkorder.EquipmentCode')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="companyName" :label="$t('mntnworkorder.CompanyName')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="rmaNo" :label="$t('mntnworkorder.RmaNo')" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="rmaCustomer" :label="$t('mntnworkorder.RmaCustomer')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column prop="rmaAccountValue" :label="$t('mntnworkorder.RmaAccountValue')" align="center"
        :show-overflow-tooltip="true" />
      <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmpno" min-width="110" sortable />
      <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="180" sortable>
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="180" sortable>
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('general.Operational')" align="center" width="130"
        class-name="small-padding fixed-width">
        <template #default="scope">
          <div style="display: flex;align-items: center;">
            <el-button text size="small" icon="edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['datacenter:mntnreason:update']">
              {{ $t('btn.edit') }}
            </el-button>
            <el-button text size="small" icon="delete" @click="handleDelete(scope.row)" v-if="false" disabled="true"
              v-hasPermi="['datacenter:mntnreason:remove']">
              {{ $t('btn.delete') }}
            </el-button>
            <el-dropdown @command="(command) => handleCommand(command, scope.row)">
              <span class="el-dropdown-link">
                {{ $t('btn.more') }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="sn">
                    <span>View SN</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="bom">
                    <span>View BOM</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="panel">
                    <span>View Panel SN</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="wo">
                    <span>View Wo Data</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="history" divided>
                    <span>History Log</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="status">
                    <span>Status Log</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="equip">
                    <span>绑定设备编码</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="1200px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" :disabled="opertype1">
        <el-row :gutter="20">
          <el-col :lg="8">
            <el-form-item label="WorkOrder" prop="workOrder">
              <el-input v-model="form.workOrder" placeholder="请输入WorkOrder" :disabled="opertype" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WoBuild" prop="woBuild">
              <el-input v-model="form.woBuild" placeholder="请输入WoBuild" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="RouteName" prop="routeName">
              <el-select v-model="form.routeName" filterable remote reserve-keyword clearable placeholder="点击输入开始字符"
                :remote-method="remoteMethodRoute" :loading="loadingRoute" @change="selectArea">
                <el-option v-for="item in optionstRoute" :key="item.routeName"
                  :label="`途程：${item.routeName}，描述：${item.routeDesc}`" :value="item.routeName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WoStatus" prop="woStatus">
              <el-select v-model="form.woStatus" placeholder="请输入woStatus" :disabled="opertype">
                <el-option v-for="item in wostatusoptions" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WoConfig" prop="woConfig">
              <el-input v-model="form.woConfig" placeholder="请输入WoConfig" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="StartStationType" prop="startStationType">
              <el-select v-model="form.startStationType" placeholder="请选择StartStationType">
                <el-option v-for="item in optionstInProcess" :key="item.nextStationType" :label="item.nextStationType"
                  :value="item.nextStationType"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="Ipn" prop="ipn">
              <el-select v-model="form.ipn" filterable remote reserve-keyword clearable placeholder="输入开始字符查询"
                :remote-method="remoteMethodpart" :loading="loadingPart" @change="selectIpn">
                <el-option v-for="item in optionstPart" :key="item.ipn" :label="`料号：${item.ipn}，描述：${item.spec2 || ''}`"
                  :value="item.ipn" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WoPhsae" prop="woPhsae">
              <el-input v-model="form.woPhsae" placeholder="请输入WoPhsae" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="EndStationType" prop="endStationType">
              <el-select v-model="form.endStationType" clearable placeholder="请选择EndStationType" ref="processlist">
                <el-option v-for="item in optionstOutProcess" :key="item.nextStationType" :label="item.nextStationType"
                  :value="item.nextStationType"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="Version" prop="woVersion">
              <el-input v-model="form.woVersion" placeholder="请输入WoVersion" :disabled="opertype"
                style="width: calc(100% - 66px);" />
              <el-button color="#800080" plain style="width: 66px;" @click="handleBomEdit">
                <span style="font-weight: bold;">BOM</span>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="W/oVersion" prop="woVersion">
              <el-input v-model="form.woVersion" placeholder="请输入WoVersion" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="PkspecName" prop="pkspecName">
              <el-select ref="pkspecNameRef" v-model="form.pkspecName" filterable remote reserve-keyword clearable
                placeholder="点击输入PkspecName" :remote-method="remoteMethodpkspec" :loading="loadingPKSpec">
                <el-option v-for="item in optionstPKSpec" :key="item.pkspecName" :label="item.pkspecName"
                  :value="item.pkspecName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WoType" prop="woType">
              <el-select v-model="form.woType" filterable allow-create default-first-option remote reserve-keyword
                clearable placeholder="点击输入WoType" :remote-method="remoteMethodwotype" :loading="loadingWoType">
                <el-option v-for="item in optionstWoType" :key="item.wO_TYPE" :label="item.wO_TYPE"
                  :value="item.wO_TYPE" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="Remark" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入Remark" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="RuleSetName" prop="ruleSetName">
              <el-select v-model="form.ruleSetName" filterable remote reserve-keyword clearable placeholder="点击输入"
                :remote-method="remoteMethodsetrule" :loading="loadingSetRule">
                <el-option v-for="item in optionstSetRule" :key="item.ruleSetName" :label="item.ruleSetName"
                  :value="item.ruleSetName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="TargetQty" prop="targetQty">
              <el-input v-model.number="form.targetQty" placeholder="请输入TargetQty" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WarehouseNo" prop="warehouseNo">
              <el-input v-model="form.warehouseNo" placeholder="请输入WarehouseNo" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="DeptName" prop="deptName">
              <el-select v-model="form.deptName" filterable allow-create default-first-option remote reserve-keyword
                clearable placeholder="点击输入" :remote-method="remoteMethodDeptName" :loading="loadingDeptName">
                <el-option v-for="item in optionstDeptName" :key="item.deptName" :label="item.deptName"
                  :value="item.deptName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="ScheduleStartDate" prop="woScheduleStartDate">
              <el-date-picker v-model="form.woScheduleStartDate" type="datetime" :teleported="false"
                placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WarehouseLocation" prop="warehouseLocation">
              <el-input v-model="form.warehouseLocation" placeholder="请输入WarehouseLocation" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="RmaCustomer" prop="rmaCustomer">
              <el-select v-model="form.rmaCustomer" filterable allow-create default-first-option remote reserve-keyword
                clearable placeholder="点击输入" :remote-method="remoteMethodRmaCustomer" :loading="loadingRmaCustomer">
                <el-option v-for="item in optionstRmaCustomer" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="ScheduleCloseDate" prop="woScheduleCloseDate">
              <el-date-picker v-model="form.woScheduleCloseDate" type="datetime" :teleported="false"
                placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="Line" prop="line">
              <el-select v-model="form.line" filterable remote reserve-keyword clearable placeholder="点击输入开始字符"
                :remote-method="remoteMethodLine" :loading="loadingline">
                <el-option v-for="item in optionstLine" :key="item.line"
                  :label="`线体名称：${item.line}，线体描述：${item.lineDesc}`" :value="item.line" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="RmaAccountValue" prop="rmaAccountValue">
              <el-select v-model="form.rmaAccountValue" filterable allow-create default-first-option remote
                reserve-keyword clearable placeholder="点击输入" :remote-method="remoteMethodRmaAccount"
                :loading="loadingRmaAccount">
                <el-option v-for="item in optionstRmaAccount" :key="item.dictValue" :label="item.dictLabel"
                  :value="item.dictValue" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WoPurpose" prop="woPurpose">
              <el-input v-model="form.woPurpose" placeholder="请输入WoPurpose" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="WorkCenter" prop="workCenter">
              <el-input v-model="form.workCenter" placeholder="请输入WorkCenter" :disabled="opertype" />
            </el-form-item>
          </el-col>
          <el-col :lg="8">
            <el-form-item label="RmaNo" prop="rmaNo">
              <el-input v-model="form.rmaNo" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

    <ViewSN v-model:open="snOpen" :wo="workOrder" />
    <ViewPanelSN v-model:open="panelOpen" :wo="workOrder" />
    <HistoryLog v-model:open="historyOpen" :wo="workOrder" />
    <StatusLog v-model:open="statusOpen" :wo="workOrder" />
    <EquipBind v-model:open="equipOpen" :form="curWo" @success="getList" />
    <WoBom v-model:open="bomOpen" :form="curWo" :editable="bomEdit" />
  </div>
</template>

<script setup name="mworkorder">
import ViewSN from './viewsn'
import ViewPanelSN from './viewpanelsn'
import HistoryLog from './historylog'
import StatusLog from './statuslog'
import EquipBind from './equipbind'
import WoBom from './bom'

import { linelistget, routelistget, stationtypelistget, stationlistget, wotypelistget, partlistget, pkspeclistget, setrulelistget, deptlistget, inprocesslistget, outprocesslistget } from '@/api/mescommon/mesget'
import { getall, mntwobaseadd, mntwobaseupdate, wobaseexportPost } from '@/api/womanagement/mntnworkorder'
import { getPartCraftData } from '@/api/datacenter/product/partCraft'
const { proxy } = getCurrentInstance()
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
// 显示搜索条件
const showSearch = ref(true)
// 总条数
const total = ref(0)
// 岗位表格数据
const postList = ref([])
// 弹出层标题
const title = ref('')
//
const ALL = ref('ALL')
//表示新增还是修改（A/U）
const Action = ref('A')
// 是否显示弹出层
const open = ref(false)
// 状态数据字典
//工单状态
const wostatusoptions = ref([])
//工单状态
const selectstatusOptions = ref([])
//工单捞取条件
const woselectoptions = ref([])
//工单类型获取
const wotypeoptions = ref([])
//获取字典的值
proxy.getDicts('wostatus').then((response) => {
  wostatusoptions.value = response.data
})
proxy.getDicts('workorder').then((response) => {
  woselectoptions.value = response.data
})
proxy.getDicts('selectstatus').then((response) => {
  selectstatusOptions.value = response.data
})
// 查询参数
let queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  WoStatus: 'ALL',
  Select: 'WORK_ORDER',
  Value: undefined
})
//修改窗体
const loadingRoute = ref(false)
const opertype = ref(true)
const opertype1 = ref(false)
const loadingline = ref(false)
const loadingPKSpec = ref(false)
const loadingWoType = ref(false)
const loadingPart = ref(false)
const loadingSetRule = ref(false)
const loadingDeptName = ref(false)
const loadingRmaCustomer = ref(false)
const optionstRmaCustomer = ref([])
const loadingRmaAccount = ref(false)
const optionstRmaAccount = ref([])
const optionstDeptName = ref([])
const optionstSetRule = ref([])
const optionstPart = ref([])
const optionstWoType = ref([])
const optionstPKSpec = ref([])
const optionstRoute = ref([])
const optionstLine = ref([])
const optionstInProcess = ref([])
const optionstOutProcess = ref([])
//途程
const remoteMethodRoute = (query) => {
  loadingRoute.value = true
  routelistget({ parm: query }).then((res) => {
    optionstRoute.value = res.data
    loadingRoute.value = false
  })
}
//线体
const remoteMethodLine = (query) => {
  loadingline.value = true
  linelistget({ parm: query }).then((res) => {
    optionstLine.value = res.data
    loadingline.value = false
  })
}
//包装规格
const remoteMethodpkspec = (query) => {
  loadingPKSpec.value = true
  pkspeclistget({ parm: query }).then((res) => {
    optionstPKSpec.value = res.data
    loadingPKSpec.value = false
  })
}
//组合规则
const remoteMethodsetrule = (query) => {
  loadingSetRule.value = true
  setrulelistget({ parm: query }).then((res) => {
    optionstSetRule.value = res.data
    loadingSetRule.value = false
  })
}
//工单类型
const remoteMethodwotype = (query) => {
  loadingWoType.value = true
  wotypelistget({ parm: query }).then((res) => {
    optionstWoType.value = res.data
    loadingWoType.value = false
  })
}
//料号
const remoteMethodpart = (query) => {
  if (query) {
    loadingPart.value = true
    partlistget({ parm: query }).then((res) => {
      optionstPart.value = res.data
      loadingPart.value = false
    })
  }
}
//部门
const remoteMethodDeptName = (query) => {
  loadingDeptName.value = true
  deptlistget({ parm: query }).then((res) => {
    optionstDeptName.value = res.data
    loadingDeptName.value = false
  })
}
//客户
const remoteMethodRmaCustomer = (query) => {
  loadingRmaCustomer.value = true
  proxy.getDicts('rma_custom').then((res) => {
    optionstRmaCustomer.value = res.data
    loadingRmaCustomer.value = false
  })
}
//单价
const remoteMethodRmaAccount = (query) => {
  loadingRmaAccount.value = true
  proxy.getDicts('rma_account').then((res) => {
    optionstRmaAccount.value = res.data
    loadingRmaAccount.value = false
  })
}
//初始化开始和结束制程
const selectArea = (val) => {
  if (val) {
    inprocesslistget({ parm: val }).then((res) => {
      optionstInProcess.value = res.data
      if (res.data && res.data.length > 0) {
        form.value.startStationType = res.data[0].nextStationType
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].DefaultInstationtype === 'Y') { // 检查条件
            form.value.startStationType = res.data[i].nextStationType; // 满足条件，赋值
            break; // 找到后退出循环
          }
        }
      }
    })
    outprocesslistget({ parm: val }).then((res) => {
      optionstOutProcess.value = res.data
      if (res.data && res.data.length > 0) {
        form.value.endStationType = res.data[res.data.length - 1].nextStationType
      }
    })
  } else {
    optionstInProcess.value = []
    optionstOutProcess.value = []
    form.value.startStationType = ''
    form.value.endStationType = ''
  }
}
const pkspecNameRef = ref(null)
const selectIpn = (val) => {
  getPartCraftData({ optionData: 'ipn', textData: val, enaBled: 'Y', pageNum: 1, pageSize: 100 }).then(async (res) => {
    const cur = res.result.find(e => e.ipn === val)
    if (cur) {
      const { routeName, packSpec, ruleSetName } = cur
      form.value.routeName = routeName || null
      form.value.pkspecName = packSpec || null
      form.value.ruleSetName = ruleSetName || null
    } else {
      form.value.routeName = null
      form.value.pkspecName = null
      form.value.ruleSetName = null
    }
    selectArea(form.value.routeName)
  })
}
// 表单校验
const state = reactive({
  form: {},
  rules: {
    workOrder: [{ required: true, message: '不能为空', trigger: 'blur' }],
    ipn: [{ required: true, message: '不能为空', trigger: 'blur' }],
    line: [{ required: true, message: '不能为空', trigger: 'blur' }],
    routeName: [{ required: true, message: '不能为空', trigger: 'blur' }],
    targetQty: [{ required: true, message: '不能为空', trigger: 'blur' }]
  },
  options: {
    // Mfgpacktype 选项列表 格式 eg:{ dictLabel: '标签', dictValue: '0'}
    wostatusoptions: []
  }
})
const formRef = ref(null)
const { form, rules, options } = toRefs(state)
/** 查询列表 */
function getList() {
  loading.value = true
  getall(queryParams).then((response) => {
    postList.value = response.data.result
    total.value = response.data.totalNum
    loading.value = false
  })
}

function cancel() {
  open.value = false
  reset()
}
// 表单重置
function reset() {
  form.value = {
    workOrder: null,
    woBuild: null,
    routeName: null,
    line: null,
    woStatus: null,
    woConfig: null,
    startStationType: null,
    ipn: null,
    woPhsae: null,
    endStationType: null,
    Version: null,
    WoVersion: null,
    PkspecName: null,
    woType: null,
    remark: null,
    targetQty: null,
    warehouseNo: null,
    deptName: null,
    woScheduleStartDate: null,
    warehouseLocation: null,
    rmaCustomer: null,
    woScheduleCloseDate: null,
    rmaAccountValue: null,
    woPurpose: null,
    workCenter: null,
    rmaNo: null
  }
  proxy.resetForm('formRef')
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryForm')
  handleQuery()
}
// 多选框选中数据
function handleSelectionChange(selection) {
  if (selection) {
    single.value = false
    ids.value = selection.workOrder
  }
  else {
    single.value = true
    ids.value = []
  }
}
/** 新增按钮操作 */
function handleAdd() {
  reset()
  opertype.value = false
  open.value = true
  title.value = '新增'
  Action.value = 'A'
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  opertype.value = true
  const postId = {
    Select: 'WORK_ORDER',
    Value: row.workOrder || ids.value
  }
  getall(postId).then((response) => {
    form.value = response.data.result[0]
    open.value = true
    title.value = '修改'
    Action.value = 'U'
    if (response.data.result[0].woStatus >= 3) {
      opertype1.value = true
    }
    else {
      opertype1.value = false
    }
  })
}
/** 提交按钮 */
function submitForm() {
  if (opertype1.value) {
    cancel()
    return
  }

  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (Action.value == 'U') {
        mntwobaseupdate(form.value).then((response) => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      }
      else {
        mntwobaseadd(form.value).then((response) => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
  ids.value = []
}
/** 删除按钮操作 */
function handleDelete(row) {
  const dpostIds = row.id || ids.value
}
/** 导出按钮操作 */
function handleExport() {
  proxy
    .$confirm('是否确认导出数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      await wobaseexportPost(queryParams)
    })
}

const workOrder = ref('')
const snOpen = ref(false)
const panelOpen = ref(false)
const historyOpen = ref(false)
const statusOpen = ref(false)
const equipOpen = ref(false)
const stateBom = reactive({ curWo: {} })
const { curWo } = toRefs(stateBom)
const bomOpen = ref(false)
const bomEdit = ref(false)

function handleBomEdit() {
  curWo.value = form.value
  bomEdit.value = form.value.woStatus < 3
  bomOpen.value = true
}

// 更多操作触发
function handleCommand(command, row) {
  curWo.value = row
  workOrder.value = row.workOrder
  switch (command) {
    case 'sn':
      snOpen.value = true
      break
    case 'bom':
      bomEdit.value = false
      bomOpen.value = true
      break
    case 'panel':
      panelOpen.value = true
      break
    case 'wo':
      reset()
      opertype.value = true
      getall({
        Select: 'WORK_ORDER',
        Value: row.workOrder
      }).then((response) => {
        form.value = response.data.result[0]
        open.value = true
        title.value = '查看'
        Action.value = 'U'
        opertype1.value = true
      })
      break
    case 'history':
      historyOpen.value = true
      break
    case 'status':
      statusOpen.value = true
      break
    case 'equip':
      equipOpen.value = true
      break
  }
}

handleQuery()
</script>
