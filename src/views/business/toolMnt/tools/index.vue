<template>
    <div class="app-container">
        <el-form :model="vc.queryParams" ref="QueryForm" :inline="true" v-show="vs.showSearch" label-width="68px" mb-3>
            <el-form-item :label="$t('general.filter')" prop="filterField" mb-0>
                <el-select v-model="vc.queryParams.filterField" placeholder="" style="width:100px">
                    <el-option v-for="dict in vc.filterFields" :key="dict.label" :label="$t(`mntntools.${dict.label}`)"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item prop="filterValue" mb-0>
                <el-input v-model="vc.queryParams.filterValue" placeholder="" clearable @keyup.enter="vc.handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('general.enabled')" prop="enabled" mb-0>
                <el-select v-model="vc.queryParams.enabled" placeholder="状态" style="width:100px">
                    <el-option v-for="dict in vc.selectstatusOptions.value" :key="dict.dictValue"
                        :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item mb-0>
                <el-button type="primary" icon="search" @click="vc.handleQuery">{{ $t('btn.search') }}</el-button>
                <el-button icon="refresh" @click="vc.resetQuery">{{ $t('btn.reset') }}</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" mb-1>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" @click="vc.handleAdd"
                    v-hasPermi="['datacenter:mntntools:add']">{{ $t('btn.add') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="edit" @click="vc.handleUpdate" :disabled="!state.currentTooling"
                    v-hasPermi="['datacenter:mntntools:update']">
                    {{ $t('btn.edit') }}
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="download" @click="vc.handleExport"
                    v-hasPermi="['system:post:export']">{{ $t('btn.export') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="vs.showSearch" @queryTable="vc.handleQuery"></right-toolbar>
        </el-row>
        <el-table height="200px" v-loading="vs.loading" :data="state.data" highlight-current-row
            @current-change="vc.selectionChange">
            <el-table-column :label="$t('mntntools.toolingNo')" align="center" prop="toolingNo" />
            <el-table-column :label="$t('mntntools.toolingType')" align="center" prop="toolingType" />
            <el-table-column :label="$t('mntntools.toolingDesc')" align="center" prop="toolingDesc" />
            <el-table-column :label="$t('mntntools.location')" align="center" prop="location" />
            <el-table-column :label="$t('mntntools.job')" align="center" prop="job" />
            <el-table-column :label="$t('mntntools.maxUseTimes')" align="center" prop="maxUseTimes" />
            <el-table-column :label="$t('mntntools.warnUsedTimes')" align="center" prop="warnUsedTimes" />
            <el-table-column :label="$t('mntntools.maxUseDay')" align="center" prop="maxUseDay" />
            <el-table-column :label="$t('mntntools.warnUsedDay')" align="center" prop="warnUsedDay" />
            <el-table-column :label="$t('mntntools.maxMaintainTimes')" align="center" prop="maxMaintainTimes" />
            <el-table-column :label="$t('mntntools.maintainTime')" align="center" prop="maintainTime" />
            <el-table-column :label="$t('mntntools.cavityQty')" align="center" prop="cavityQty" />
            <el-table-column :label="$t('mntntools.line')" align="center" prop="line" />
            <el-table-column :label="$t('mntntools.stationType')" align="center" prop="stationType" />
            <el-table-column :label="$t('general.enabled')" align="center" key="enabled">
                <template #default="scope">
                    <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N" active-text="启用"
                        inactive-text="禁用" inline-prompt @change="vc.handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="state.dataTotal > 0" :total="state.dataTotal" v-model:page="vc.queryParams.pageNum"
            v-model:limit="vc.queryParams.pageSize" @pagination="vc.handleQuery" />
        <!-- 添加或修改治具对话框 -->
        <el-dialog :title="vs.editTitle" v-model="vs.showEdit" width="700px" append-to-body>
            <el-form ref="EditForm" :model="state.editForm" :rules="vc.EditFormRules" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('mntntools.toolingType')" prop="toolingType">
                            <el-select v-model="state.editForm.toolingType" filterable reserve-keyword clearable>
                                <el-option v-for="item in state.toolingTypes" :key="item" :label="item" :value="item" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('mntntools.toolingNo')" prop="toolingNo">
                            <el-input v-model="state.editForm.toolingNo" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.job')" prop="job">
                            <el-input v-model="state.editForm.job" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.maxUseTimes')" prop="maxUseTimes">
                            <el-input-number v-model="state.editForm.maxUseTimes" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.maxUseDay')" prop="maxUseDay">
                            <el-input-number v-model="state.editForm.maxUseDay" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.maxMaintainTimes')" prop="maxMaintainTimes">
                            <el-input-number v-model="state.editForm.maxMaintainTimes" placeholder="" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('mntntools.location')" prop="location">
                            <el-input v-model="state.editForm.location" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.toolingDesc')" prop="toolingDesc">
                            <el-input v-model="state.editForm.toolingDesc" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.warnUsedTimes')" prop="warnUsedTimes">
                            <el-input-number v-model="state.editForm.warnUsedTimes" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.warnUsedDay')" prop="warnUsedDay">
                            <el-input-number v-model="state.editForm.warnUsedDay" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.maintainTime')" prop="maintainTime">
                            <el-input-number v-model="state.editForm.maintainTime" placeholder="" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('mntntools.cavityQty')" prop="cavityQty">
                            <el-input-number v-model="state.editForm.cavityQty" placeholder="" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :offset="12" :span="12">
                        <el-form-item :label="$t('mntntools.stationType')" prop="stationType">
                            <el-select v-model="state.editForm.stationType" filterable remote reserve-keyword clearable
                                placeholder="" :remote-method="vc.remoteLoadStationTypes" :loading="vs.loadStationType">
                                <el-option v-for="item in state.stationTypes" :key="item.id" :label="item.stationType"
                                    :value="item.stationType" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <el-button text @click="vc.cancelEditForm">{{ $t('btn.cancel') }}</el-button>
                <el-button type="primary" @click="vc.submitEditForm">{{ $t('btn.submit') }}</el-button>
            </template>
        </el-dialog>

        <!--治具sn列表-->
        <el-form :model="vc.mQueryParams" ref="mQueryForm" :inline="true" v-show="vs.showMSearch"
            :rules="vc.mEditFormRules" label-width="68px" mb-3>
            <el-form-item :label="$t('general.filter')" prop="filterField" mb-0>
                <el-select v-model="vc.mQueryParams.filterField" placeholder="" style="width:100px">
                    <el-option v-for="dict in vc.mFilterFields" :key="dict.label" :label="$t(`mntntools.${dict.label}`)"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item prop="filterValue" mb-0>
                <el-input v-model="vc.mQueryParams.filterValue" placeholder="" clearable
                    @keyup.enter="vc.mHandleQuery" />
            </el-form-item>
            <el-form-item :label="$t('general.enabled')" prop="enabled" mb-0>
                <el-select v-model="vc.mQueryParams.enabled" placeholder="状态" style="width:100px">
                    <el-option v-for="dict in vc.selectstatusOptions.value" :key="dict.dictValue"
                        :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item mb-0>
                <el-button type="primary" icon="search" @click="vc.mHandleQuery">{{ $t('btn.search') }}</el-button>
                <el-button icon="refresh" @click="vc.mResetQuery">{{ $t('btn.reset') }}</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" mb-1>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="plus" @click="vc.mHandleAdd" :disabled="!state.currentTooling"
                    v-hasPermi="['datacenter:mntntools:add']">{{
                        $t('btn.add') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="edit" @click="vc.mHandleUpdate"
                    :disabled="!state.currentToolingSn" v-hasPermi="['datacenter:mntntools:update']">
                    {{ $t('btn.edit') }}
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="download" @click="vc.mHandleExport"
                    v-hasPermi="['system:post:export']">{{
                        $t('btn.export') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" plain icon="download" @click="vc.mHandleExport"
                    v-hasPermi="['system:post:bindIpn']">{{
                        $t('mntntools.bindIpn') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="vs.showMSearch" @queryTable="vc.mHandleQuery"></right-toolbar>
        </el-row>
        <el-table height="200px" v-loading="vs.mLoading" :data="state.mData" highlight-current-row
            @current-change="vc.mSelectionChange">
            <el-table-column :label="$t('mntntools.toolingSn')" align="center" prop="toolingSn" />
            <el-table-column :label="$t('mntntools.toolingSnDesc')" align="center" prop="toolingSnDesc" />
            <el-table-column :label="$t('mntntools.totalUsedCount')" align="center" prop="totalUsedCount" />
            <el-table-column :label="$t('mntntools.length')" align="center" prop="length" />
            <el-table-column :label="$t('mntntools.width')" align="center" prop="width" />
            <el-table-column :label="$t('mntntools.height')" align="center" prop="height" />
            <el-table-column :label="$t('mntntools.face')" align="center" prop="face" />
            <el-table-column :label="$t('mntntools.viewcheck')" align="center" prop="viewcheck" />
            <el-table-column :label="$t('mntntools.damageDegree')" align="center" prop="damageDegree" />
            <el-table-column :label="$t('mntntools.cleanDegree')" align="center" prop="cleanDegree" />
            <el-table-column :label="$t('mntntools.rough')" align="center" prop="rough" />
            <el-table-column :label="$t('mntntools.scrape')" align="center" prop="scrape" />
            <el-table-column :label="$t('mntntools.toolingStatus')" align="center" prop="toolingStatus" />
            <el-table-column :label="$t('general.enabled')" align="center" key="enabled">
                <template #default="scope">
                    <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N" active-text="启用"
                        inactive-text="禁用" inline-prompt @change="vc.mHandleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="state.mDataTotal > 0" :total="state.mDataTotal" v-model:page="vc.mQueryParams.pageNum"
            v-model:limit="vc.mQueryParams.pageSize" @pagination="vc.mHandleQuery" />

        <!-- 添加或修改治具sn对话框 -->
        <el-dialog :title="vs.mEditTitle" v-model="vs.showMEdit" width="800px" append-to-body>
            <el-form ref="mFormRef" :model="state.mEditForm" :rules="vc.mEditFormRules" label-width="90px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('mntntools.toolingType')">
                            <el-input readonly v-model="state.mEditForm.toolingType" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.toolingNo')">
                            <el-input readonly v-model="state.mEditForm.toolingNo" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.toolingSn')" prop="toolingSn">
                            <el-input v-model="state.mEditForm.toolingSn" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.toolingSnDesc')" prop="toolingSnDesc">
                            <el-input v-model="state.mEditForm.toolingSnDesc" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.location')" prop="location">
                            <el-input v-model="state.mEditForm.location" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.face')" prop="face">
                            <el-input v-model="state.mEditForm.face" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.totalUsedCount')">
                            <el-input readonly v-model="state.mEditForm.totalUsedCount" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.toolingStatus')">
                            <el-input readonly v-model="state.mEditForm.toolingStatus" placeholder="" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('mntntools.length')" prop="length">
                            <el-row :gutter="10">
                                <el-col :span="16"><el-input v-model="state.mEditForm.length" placeholder="" /></el-col>
                                <el-col :span="4">mm</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.width')" prop="width">
                            <el-row :gutter="10">
                                <el-col :span="16"><el-input v-model="state.mEditForm.width" placeholder="" /></el-col>
                                <el-col :span="4">mm</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.height')" prop="height">
                            <el-row :gutter="10">
                                <el-col :span="16"><el-input v-model="state.mEditForm.height" placeholder="" /></el-col>
                                <el-col :span="4">mm</el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.damageDegree')" prop="damageDegree">
                            <el-input v-model="state.mEditForm.damageDegree" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.cleanDegree')" prop="cleanDegree">
                            <el-input v-model="state.mEditForm.cleanDegree" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.rough')" prop="rough">
                            <el-input v-model="state.mEditForm.rough" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.scrape')" prop="scrape">
                            <el-input v-model="state.mEditForm.scrape" placeholder="" />
                        </el-form-item>
                        <el-form-item :label="$t('mntntools.viewcheck')" prop="viewcheck">
                            <el-input v-model="state.mEditForm.viewcheck" placeholder="" />
                        </el-form-item>
                    </el-col>
                </el-row>
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
vc.handleQuery()
vc.mHandleQuery()
</script>