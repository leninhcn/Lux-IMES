<template>
    <div class="app-container">
        <el-form :model="vc.queryParams" ref="QueryForm" :inline="true" v-show="vs.showSearch" label-width="68px" mb-3>
            <el-form-item :label="$t('general.filter')" prop="filterField" mb-0>
                <el-select v-model="vc.queryParams.filterField" placeholder="" style="width:100px">
                    <el-option v-for="dict in vc.filterFields" :key="dict.label" :label="dict.label"
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
                    v-hasPermi="['datacenter:mntnmachine:add']">{{ $t('btn.add') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="edit" @click="vc.handleUpdate" :disabled="!state.currentMType"
                    v-hasPermi="['datacenter:mntnmachine:update']">
                    {{ $t('btn.edit') }}
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="download" @click="vc.handleExport"
                    v-hasPermi="['system:post:export']">{{ $t('btn.export') }}</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="vs.showSearch" @queryTable="vc.handleQuery"></right-toolbar>
        </el-row>
        <el-table height="480px" v-loading="vs.loading" :data="state.data" highlight-current-row
            @current-change="vc.selectionChange">
            <el-table-column :label="$t('mntnmachinetype.machineTypeName')" align="center" prop="machineTypeName" />
            <el-table-column :label="$t('mntnmachinetype.machineTypeDesc')" align="center" prop="machineTypeDesc" />
            <el-table-column :label="$t('mntnmachinetype.updateEmpNo')" align="center" prop="updateEmpNo" />
            <el-table-column :label="$t('mntnmachinetype.updateTime')" align="center" prop="updateTime" />
            <el-table-column :label="$t('general.enabled')" align="center" key="enabled">
                <template #default="scope">
                    <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N" active-text="启用"
                        inactive-text="禁用" inline-prompt @change="vc.handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="state.dataTotal > 0" :total="state.dataTotal" v-model:page="vc.queryParams.pageNum"
            v-model:limit="vc.queryParams.pageSize" @pagination="vc.handleQuery" />
        <!-- 添加或修改机台组对话框 -->
        <el-dialog :title="vs.editTitle" v-model="vs.showEdit" width="500px" append-to-body>
            <el-form ref="EditForm" :model="state.editForm" :rules="vc.EditFormRules" label-width="90px">
                <el-form-item :label="$t('mntnmachinetype.machineTypeName')" prop="machineTypeName">
                    <el-input v-model="state.editForm.machineTypeName" placeholder="" />
                </el-form-item>
                <el-form-item :label="$t('mntnmachinetype.machineTypeDesc')" prop="machineTypeDesc">
                    <el-input v-model="state.editForm.machineTypeDesc" placeholder="" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button text @click="vc.cancelEditForm">{{ $t('btn.cancel') }}</el-button>
                <el-button type="primary" @click="vc.submitEditForm">{{ $t('btn.submit') }}</el-button>
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
</script>