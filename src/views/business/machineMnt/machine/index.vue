<template>
  <div class="app-container">
    <el-form :model="vc.mgQueryParams" ref="mgQueryForm" :inline="true" v-show="vs.showMgSearch" label-width="68px"
      mb-3>
      <el-form-item :label="$t('general.filter')" prop="filterField" mb-0>
        <el-select v-model="vc.mgQueryParams.filterField" placeholder="" style="width:100px">
          <el-option v-for="dict in vc.mgFilterFields" :key="dict.label" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="filterValue" mb-0>
        <el-input v-model="vc.mgQueryParams.filterValue" placeholder="" clearable @keyup.enter="vc.mgHandleQuery" />
      </el-form-item>
      <el-form-item :label="$t('general.enabled')" prop="enabled" mb-0>
        <el-select v-model="vc.mgQueryParams.enabled" placeholder="状态" style="width:100px">
          <el-option v-for="dict in vc.selectstatusOptions.value" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item mb-0>
        <el-button type="primary" icon="search" @click="vc.mgHandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="vc.mgResetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" mb-1>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="vc.mgHandleAdd"
          v-hasPermi="['datacenter:mntnmachine:add']">{{ $t('btn.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="edit" @click="vc.mgHandleUpdate" :disabled="!state.currentMg"
          v-hasPermi="['datacenter:mntnmachine:update']">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="vc.mgHandleExport"
          v-hasPermi="['system:post:export']">{{ $t('btn.export') }}</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="vs.showMgSearch" @queryTable="vc.mgHandleQuery"></right-toolbar>
    </el-row>
    <el-table height="200px" v-loading="vs.mgLoading" :data="state.mgData" highlight-current-row
      @current-change="vc.mgSelectionChange">
      <el-table-column :label="$t('mntnmachine.machineGroup')" align="center" prop="name" />
      <el-table-column :label="$t('mntnmachine.description')" align="center" prop="description" />
      <el-table-column :label="$t('mntnmachine.stationType')" align="center" prop="stationType" />
      <el-table-column :label="$t('mntnmachine.stationTypeDesc')" align="center" prop="stationTypeDesc" />
      <el-table-column :label="$t('general.enabled')" align="center" key="enabled">
        <template #default="scope">
          <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N" active-text="启用" inactive-text="禁用"
            inline-prompt @change="vc.mgHandleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="state.mgDataTotal > 0" :total="state.mgDataTotal" v-model:page="vc.mgQueryParams.pageNum"
      v-model:limit="vc.mgQueryParams.pageSize" @pagination="vc.mgHandleQuery" />
    <!-- 添加或修改机台组对话框 -->
    <el-dialog :title="vs.mgEditTitle" v-model="vs.showMgEdit" width="500px" append-to-body>
      <el-form ref="mgFormRef" :model="state.mgEditForm" :rules="vc.mgEditFormRules" label-width="90px">
        <el-form-item :label="$t('mntnmachine.machineGroup')" prop="name">
          <el-input v-model="state.mgEditForm.name" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('mntnmachine.description')" prop="description">
          <el-input v-model="state.mgEditForm.description" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('mntnmachine.stationType')" prop="stationType">
          <el-select v-model="state.mgEditForm.stationType" filterable remote reserve-keyword clearable placeholder=""
            :remote-method="vc.remoteLoadStationTypes" :loading="vs.mgLoadStationType">
            <el-option v-for="item in state.stationTypes" :key="item.id" :label="item.stationType"
              :value="item.stationType" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button text @click="vc.mgCancelEditForm">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="vc.mgSubmitEditForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

    <!--设备列表-->
    <el-form :model="vc.mQueryParams" ref="mQueryForm" :inline="true" v-show="vs.showMSearch" label-width="68px" mb-3>
      <el-form-item :label="$t('general.filter')" prop="filterField" mb-0>
        <el-select v-model="vc.mQueryParams.filterField" placeholder="" style="width:100px">
          <el-option v-for="dict in vc.mFilterFields" :key="dict.label" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item prop="filterValue" mb-0>
        <el-input v-model="vc.mQueryParams.filterValue" placeholder="" clearable @keyup.enter="vc.mHandleQuery" />
      </el-form-item>
      <el-form-item :label="$t('general.enabled')" prop="enabled" mb-0>
        <el-select v-model="vc.mQueryParams.enabled" placeholder="状态" style="width:100px">
          <el-option v-for="dict in vc.selectstatusOptions.value" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item mb-0>
        <el-button type="primary" icon="search" @click="vc.mHandleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="vc.mResetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" mb-1>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="plus" @click="vc.mHandleAdd" :disabled="!state.currentMg"
          v-hasPermi="['datacenter:mntnmachine:add']">{{
      $t('btn.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="edit" @click="vc.mHandleUpdate" :disabled="!state.currentMachine"
          v-hasPermi="['datacenter:mntnmachine:update']">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="vc.mHandleExport" v-hasPermi="['system:post:export']">{{
      $t('btn.export') }}</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="vs.showMSearch" @queryTable="vc.mHandleQuery"></right-toolbar>
    </el-row>
    <el-table height="200px" v-loading="vs.mLoading" :data="state.mData" highlight-current-row
      @current-change="vc.mSelectionChange">
      <el-table-column :label="$t('mntnmachine.machineCode')" align="center" prop="machineCode" />
      <el-table-column :label="$t('mntnmachine.machineDesc')" align="center" prop="machineDesc" />
      <el-table-column :label="$t('mntnmachine.machineloc')" align="center" prop="machineloc" />
      <el-table-column :label="$t('mntnmachine.machineType')" align="center" prop="machineType" />
      <el-table-column :label="$t('mntnmachine.line')" align="center" prop="line" />
      <el-table-column :label="$t('mntnmachine.machineGroup')" align="center" prop="machineGroup" />
      <el-table-column :label="$t('mntnmachine.machineStatus')" align="center" prop="machineStatus" />
      <el-table-column :label="$t('mntnmachine.groupId')" align="center" prop="groupId" />
      <el-table-column :label="$t('general.enabled')" align="center" key="enabled">
        <template #default="scope">
          <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N" active-text="启用" inactive-text="禁用"
            inline-prompt @change="vc.mHandleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="state.mDataTotal > 0" :total="state.mDataTotal" v-model:page="vc.mQueryParams.pageNum"
      v-model:limit="vc.mQueryParams.pageSize" @pagination="vc.mHandleQuery" />

    <!-- 添加或修改机台对话框 -->
    <el-dialog :title="vs.mEditTitle" v-model="vs.showMEdit" width="500px" append-to-body>
      <el-form ref="mFormRef" :model="state.mEditForm" :rules="vc.mEditFormRules" label-width="90px">
        <el-form-item :label="$t('mntnmachine.machineCode')" prop="machineCode">
          <el-input v-model="state.mEditForm.machineCode" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('mntnmachine.machineDesc')" prop="machineDesc">
          <el-input v-model="state.mEditForm.machineDesc" placeholder="" />
        </el-form-item>
        <el-form-item :label="$t('mntnmachine.machineloc')" prop="machineloc">
          <el-select v-model="state.mEditForm.machineloc" allow-create filterable reserve-keyword clearable
            placeholder="">
            <el-option v-for="item in state.machinelocs" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('mntnmachine.machineType')" prop="machineType">
          <el-select v-model="state.mEditForm.machineType" filterable reserve-keyword clearable placeholder="">
            <el-option v-for="item in state.machineTypes" :key="item.id" :label="item.machineTypeName"
              :value="item.machineTypeName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('mntnmachine.line')" prop="line">
          <el-select v-model="state.mEditForm.line" filterable remote reserve-keyword clearable placeholder=""
            :remote-method="vc.remoteLoadLines" :loading="vs.mLoadLine">
            <el-option v-for="item in state.lines" :key="item.id" :label="item.line" :value="item.line" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('mntnmachine.machineGroup')" prop="machineGroup">
          <el-input v-model="state.mEditForm.machineGroup" readonly placeholder="" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button text @click="vc.mCancelEditForm">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="vc.mSubmitEditForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import * as vc from './viewController.js'
import { state, viewState as vs } from './viewController.js'
const { proxy } = getCurrentInstance()

proxy.getDicts('selectstatus').then((response) => {
  vc.selectstatusOptions.value = response.data
})

vc.setProxy(proxy)
vc.initData()
vc.mgHandleQuery()
vc.mHandleQuery()
</script>