<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:part:add']" @click="addRoEditData('add')">{{
        $t('btn.add')
      }}</el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:part:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:product:part:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}</el-button
      >
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:part:export']" @click="dowloadData">{{
        $t('btn.export')
      }}</el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:product:part:import']" @click="uploadData">{{
        $t('btn.import')
      }}</el-button>
    </template>
    <!-- 启用 -->
    <template #enabled="{ row }">
      <el-switch
        v-model="row.enabled"
        inline-prompt
        :active-text="$t('common.enable')"
        :inactive-text="$t('common.disenable')"
        active-value="Y"
        inactive-value="N"
        :before-change="() => changeEnaBled(row)" />
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:product:part:edit']" @click="addRoEditData('edit', row)">{{
        $t('btn.edit')
      }}</el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-hasPermi="['datacenter:product:part:remove']"
        v-show="row.enabled === 'N'"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:part:history']" @click="showLog(row)">
        {{ $t('btn.log') }}
      </el-button>
    </template>
  </ITable>
  <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="1300" top="2vh" draggable>
    <el-form :inline="true" ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="180">
      <el-form-item v-for="item in dialogFormInputConfig" :key="item.prop" :label="item.label" :prop="item.prop">
        <el-input-number v-if="item.number" :min="0" v-model="dialogVisible.form[item.prop]" :placeholder="$t('common.inputTip')" />
        <el-input
          v-else
          v-model="dialogVisible.form[item.prop]"
          :disabled="item.prop === 'ipn' && dialogVisible.ipnDisabled"
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('part.SamplingType')" prop="SamplingType" style="width: 380px">
        <el-select v-model="dialogVisible.form.SamplingType" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option
            v-for="item in dialogVisible.options.SamplingType"
            :key="item.SAMPLING_TYPE"
            :label="item.SAMPLING_TYPE"
            :value="item.SAMPLING_TYPE"
            filterable />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" @click="dialogConfirm(dialogFormRef)">{{ $t('btn.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 导入弹窗 -->
  <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
    <el-upload
      name="file"
      ref="uploadRef"
      :limit="1"
      accept=".xlsx,.xls"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag>
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text" v-html="$t('common.uploadText')"></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>{{ $t('common.uploadTip') }}</span>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="upload.open = false">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="submitFileForm">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
  <!-- log 弹窗 -->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1000" draggable>
    <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading" max-height="500">
      <el-table-column property="ID" label="ID" width="100" fixed="left" />
      <el-table-column property="IPN" :label="$t('part.IPN')" width="100" />
      <el-table-column property="APN" :label="$t('part.APN')" width="120" />
      <el-table-column property="PART_TYPE" :label="$t('part.PART_TYPE')" />
      <el-table-column property="SPEC1" :label="$t('part.SPEC1')" width="100" />
      <el-table-column property="SPEC2" :label="$t('part.SPEC2')" width="100" />
      <el-table-column property="VERSION" :label="$t('part.VERSION')" />
      <el-table-column property="MODEL" :label="$t('part.MODEL')" />
      <el-table-column property="MODEL_CUSTOMER" :label="$t('model.modelCustomer')" />
      <el-table-column property="MODEL_NO" :label="$t('part.MODEL_NO')" />
      <el-table-column property="EEEE" :label="$t('part.EEEE')" />
      <el-table-column property="CONFIG" :label="$t('part.CONFIG')" />
      <el-table-column property="VENDOR" :label="$t('part.VENDOR')" width="100" />
      <el-table-column property="MPN" :label="$t('part.MPN')" />
      <el-table-column property="PLANT" :label="$t('part.PLANT')" />
      <el-table-column property="BACKFLUSH" :label="$t('part.BACKFLUSH')" width="120" />
      <el-table-column property="CALLOFF" :label="$t('part.CALLOFF')" width="100" />
      <el-table-column property="PROCUREMENT" :label="$t('part.PROCUREMENT')" width="140" />
      <el-table-column property="PROCUREMENTDESC" :label="$t('part.PROCUREMENTDESC')" width="180" />
      <el-table-column property="TYPE" :label="$t('part.TYPE')" />
      <el-table-column property="TYPEDESC" :label="$t('part.TYPEDESC')" width="100" />
      <el-table-column property="INHOUSEPRODUCTION" :label="$t('part.INHOUSEPRODUCTION')" width="200" />
      <el-table-column property="PLANDELIVERYDAY" :label="$t('part.PLANDELIVERYDAY')" width="180" />
      <el-table-column property="MRPCONTROL" :label="$t('part.MRPCONTROL')" width="140" />
      <el-table-column property="PRICEUNIT" :label="$t('part.PRICEUNIT')" width="100" />
      <el-table-column property="PRICE" :label="$t('part.PRICE')" />
      <el-table-column property="CURRENCY" :label="$t('part.CURRENCY')" width="110" />
      <el-table-column property="PRICEFROM" :label="$t('part.PRICEFROM')" width="110" />
      <el-table-column property="PROFITCENTER" :label="$t('part.PROFITCENTER')" width="140" />
      <el-table-column property="MATERIALGROUP" :label="$t('part.MATERIALGROUP')" width="150" />
      <el-table-column property="CATEGORY" :label="$t('part.category')" width="110" />
      <el-table-column property="ROHS" :label="$t('part.ROHS')" />
      <el-table-column property="DAYNS" :label="$t('part.DAYNS')" />
      <el-table-column property="ASSESSION" :label="$t('part.ASSESSION')" width="110" />
      <el-table-column property="CUSTOMERGROUP" :label="$t('part.CUSTOMERGROUP')" width="160" />
      <el-table-column property="DIVISION" :label="$t('part.DIVISION')" width="100" />
      <el-table-column property="DELETEFLAG" :label="$t('part.DELETEFLAG')" width="120" />
      <el-table-column property="GENERALDESC" :label="$t('part.GENERALDESC')" width="140" />
      <el-table-column property="BONDEDFLAG" :label="$t('part.BONDEDFLAG')" width="130" />
      <el-table-column property="HOLDFLAG" :label="$t('part.HOLDFLAG')" width="110" />
      <el-table-column property="MODELFAMILY" :label="$t('part.MODELFAMILY')" width="130" />
      <el-table-column property="CUSTOMERMODELNAME" :label="$t('part.CUSTOMERMODELNAME')" width="200" />
      <el-table-column property="LABELCPN" :label="$t('part.LABELCPN')" width="110" />
      <el-table-column property="UPC" :label="$t('part.UPC')" />
      <el-table-column property="EAN" :label="$t('part.EAN')" />
      <el-table-column property="JAN" :label="$t('part.JAN')" />
      <el-table-column property="LASTUPDATE" :label="$t('part.LASTUPDATE')" width="120" />
      <el-table-column property="PRDINDICATE" :label="$t('part.PRDINDICATE')" width="120" />
      <el-table-column property="BASEUNITMEASURE" :label="$t('part.BASEUNITMEASURE')" width="170" />
      <el-table-column property="EQUIVALENTPN" :label="$t('part.EQUIVALENTPN')" width="140" />
      <el-table-column property="MATERIALTYPE" :label="$t('part.MATERIALTYPE')" width="140" />
      <el-table-column property="PRODUCTDESCCONFIG1" :label="$t('part.PRODUCTDESCCONFIG1')" width="200" />
      <el-table-column property="PRODUCTDESCCONFIG2" :label="$t('part.PRODUCTDESCCONFIG2')" width="200" />
      <el-table-column property="PRODUCTDESCCOLOR1" :label="$t('part.PRODUCTDESCCOLOR1')" width="200" />
      <el-table-column property="PRODUCTDESCCOLOR2" :label="$t('part.PRODUCTDESCCOLOR2')" width="200" />
      <el-table-column property="RADIO" :label="$t('part.RADIO')" />
      <el-table-column property="REGION" :label="$t('part.REGION')" />
      <el-table-column property="PACKINGTYPE" :label="$t('part.PACKINGTYPE')" width="130" />
      <el-table-column property="UPDATE_EMPNO" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="UPDATE_TIME" :label="$t('common.updateTime')" width="160" />
      <el-table-column property="CREATE_EMPNO" :label="$t('common.createEmpno')" width="100" />
      <el-table-column property="CREATE_TIME" :label="$t('common.createTiem')" width="160" />
      <el-table-column property="ENABLED" :label="$t('common.isEnable')">
        <template #default="{ row }">
          <el-tag v-if="row.ENABLED === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="OPTION1" :label="$t('part.OPTION1')" width="90" />
      <el-table-column property="OPTION2" :label="$t('part.OPTION2')" width="90" />
      <el-table-column property="OPTION3" :label="$t('part.OPTION3')" width="90" />
      <el-table-column property="OPTION4" :label="$t('part.OPTION4')" width="90" />
      <el-table-column property="OPTION5" :label="$t('part.OPTION5')" width="90" />
      <el-table-column property="OPTION6" :label="$t('part.OPTION6')" width="90" />
      <el-table-column property="ALLIEREVISION" :label="$t('part.ALLIEREVISION')" width="140" />
      <el-table-column property="OPTION21" :label="$t('part.OPTION21')" width="100" />
      <el-table-column property="SITE" :label="$t('site.site')" />
    </el-table>
  </el-dialog>
</template>

<script setup name="part">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getToken } from '@/utils/auth'
import { getPartData, addPartData, editPartData, delPartData, getPartLog, getPartPlanData } from '@/api/datacenter/product/part'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
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

// 筛选条件
const options = computed(() => columns.filter((item) => !item.type && item.label !== proxy.$t('common.isEnable')))

// 显隐表单
const showSearch = ref(true)

// 加载状态
const loading = ref(false)

// 表单项
const formData = ref({})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 改变条数
watch(pageSize, () => getTableData())

// 改变页码
watch(currentPage, () => getTableData())

// 搜索
const search = (params) => {
  formData.value = params
  getTableData()
}

// 获取表格数据
const tableData = ref([])
const getTableData = async () => {
  loading.value = true
  try {
    const res = await getPartData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
    tableData.value = res.data.result
    total.value = res.data.totalNum
  } finally {
    loading.value = false
  }
}
getTableData()

// 启用/禁用
const changeEnaBled = async (row) => {
  const flag = row.enabled === 'Y' ? 'N' : 'Y'
  const res = await editPartData({ id: row.id, ipn: row.ipn, enabled: flag })
  if (res === 1) {
  } else {
  }
  if (res.data.includes('成功')) {
    row.enabled = flag
    proxy.$modal.msgSuccess(res.data)
  } else {
    proxy.$modal.msgError(res.data)
  }
}

// 表格选中
const selectData = ref([])
const handleSelectionChange = (value) => {
  selectData.value = value
}

// 弹窗表单输入框项
const dialogFormInputConfig = [
  { label: proxy.$t('part.IPN'), prop: 'ipn' },
  { label: proxy.$t('part.PLANDELIVERYDAY'), prop: 'plandeliveryday', number: true },
  { label: proxy.$t('part.EQUIVALENTPN'), prop: 'equivalentpn' },
  { label: proxy.$t('part.APN'), prop: 'apn' },
  { label: proxy.$t('part.PROFITCENTER'), prop: 'profitcenter' },
  { label: proxy.$t('part.MATERIALTYPE'), prop: 'materialtype' },
  { label: proxy.$t('part.PART_TYPE'), prop: 'partType' },
  { label: proxy.$t('part.MATERIALGROUP'), prop: 'materialgroup' },
  { label: proxy.$t('part.PRODUCTDESCCONFIG1'), prop: 'productdescconfiG1' },
  { label: proxy.$t('part.SPEC1'), prop: 'speC1' },
  { label: proxy.$t('part.category'), prop: 'category' },
  { label: proxy.$t('part.PRODUCTDESCCONFIG2'), prop: 'productdescconfiG2' },
  { label: proxy.$t('part.SPEC2'), prop: 'speC2' },
  { label: proxy.$t('part.ROHS'), prop: 'rohs' },
  { label: proxy.$t('part.PRODUCTDESCCOLOR1'), prop: 'productdesccoloR1' },
  { label: proxy.$t('part.VERSION'), prop: 'version' },
  { label: proxy.$t('part.CUSTOMERGROUP'), prop: 'customergroup' },
  { label: proxy.$t('part.PRODUCTDESCCOLOR2'), prop: 'productdesccoloR2' },
  { label: proxy.$t('part.EEEE'), prop: 'eeee' },
  { label: proxy.$t('part.DELETEFLAG'), prop: 'deleteflag' },
  { label: proxy.$t('part.RADIO'), prop: 'radio' },
  { label: proxy.$t('part.CONFIG'), prop: 'config' },
  { label: proxy.$t('part.GENERALDESC'), prop: 'generaldesc' },
  { label: proxy.$t('part.REGION'), prop: 'region' },
  { label: proxy.$t('part.VENDOR'), prop: 'vendor' },
  { label: proxy.$t('part.MODELFAMILY'), prop: 'modelfamily' },
  { label: proxy.$t('part.PACKINGTYPE'), prop: 'packingtype' },
  { label: proxy.$t('part.MODEL'), prop: 'model' },
  { label: proxy.$t('part.CUSTOMERMODELNAME'), prop: 'customermodelname' },
  { label: proxy.$t('part.ALLIEREVISION'), prop: 'allierevision' },
  { label: proxy.$t('model.modelCustomer'), prop: 'modelCustomer' },
  { label: proxy.$t('part.LABELCPN'), prop: 'labelcpn' },
  { label: proxy.$t('part.JAN'), prop: 'jan' },
  { label: proxy.$t('part.MODEL_NO'), prop: 'modelNo' },
  { label: proxy.$t('part.UPC'), prop: 'upc' },
  { label: proxy.$t('part.LASTUPDATE'), prop: 'lastupdate' },
  { label: proxy.$t('part.EAN'), prop: 'ean' },
  { label: proxy.$t('part.PRDINDICATE'), prop: 'prdindicate' },
  { label: proxy.$t('part.PLANT'), prop: 'plant' },
  { label: proxy.$t('part.BACKFLUSH'), prop: 'backflush' },
  { label: proxy.$t('part.BASEUNITMEASURE'), prop: 'baseunitmeasure' },
  { label: proxy.$t('part.TYPE'), prop: 'type' },
  { label: proxy.$t('part.MPN'), prop: 'mpn' },
  { label: proxy.$t('part.OPTION1'), prop: 'option1' }
]

// 弹窗
const dialogFormRef = ref()
const dialogVisible = reactive({
  id: '',
  title: '',
  open: false,
  btnLoading: false,
  ipnDisabled: false,
  form: dialogFormInputConfig.reduce((acc, curr) => {
    acc[curr.prop] = curr.number ? 0 : ''
    return acc
  }, {}),
  rules: {
    ipn: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  },
  options: {
    SamplingType: []
  }
})
dialogVisible.form.SamplingType = ''

// 获取料号信息
const getPlanList = async () => {
  const res = await getPartPlanData()
  dialogVisible.options.SamplingType = res
}
getPlanList()

// 新增/编辑
const addRoEditData = (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      if (i === 'plandeliveryday') {
        dialogVisible.form[i] = 0
      } else {
        dialogVisible.form[i] = ''
      }
    }
    dialogVisible.title = proxy.$t('btn.add')
    dialogVisible.ipnDisabled = false
  } else {
    dialogVisible.id = data.id
    dialogVisible.ipnDisabled = true
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.ipn}`
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
}

// 弹窗确定
const dialogConfirm = async (formEl) => {
  if (!formEl) return
  let res
  await formEl.validate(async (valid, fields) => {
    if (!valid) return
    try {
      dialogVisible.btnLoading = true
      if (dialogVisible.title === proxy.$t('btn.add')) {
        res = await addPartData(dialogVisible.form)
      } else {
        res = await editPartData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res.data.includes('成功')) {
        proxy.$modal.msgSuccess(res.data)
        dialogVisible.open = false
        getTableData()
      } else {
        proxy.$modal.msgError(res.data)
      }
    } finally {
      dialogVisible.btnLoading = false
    }
  })
}

// 删除
const delData = async (row) => {
  if (row.enabled === 'Y') {
    return proxy.$modal.msgWarning(proxy.$t('common.enableFailMsg'))
  }
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delPartData({ id: row.id })
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    getTableData()
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}

// log 弹窗
const logDialogVisible = reactive({
  open: false,
  title: '',
  loading: false,
  tableData: []
})

// 查看历史记录
const showLog = async ({ id, ipn }) => {
  logDialogVisible.title = `${ipn} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getPartLog({ id })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = async () => {
  proxy.downFile('/prodMnt/prodModel/PordPartExport', { pageSize: total.value })
}

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/prodMnt/prodModel/PordPartImportData'
})

// 点击上传按钮
const uploadData = async () => {
  upload.title = proxy.$t('btn.import')
  upload.open = true
}

// 文件上传中处理
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true
}

// 文件上传成功处理
const handleFileSuccess = (response, file, fileList) => {
  const { code, msg, data } = response
  upload.open = false
  upload.isUploading = false
  proxy.$refs['uploadRef'].clearFiles()
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + data.item1 + '</div>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  getList()
}

// 提交上传文件
function submitFileForm() {
  proxy.$refs['uploadRef'].submit()
}
</script>

<style lang="scss" scoped></style>
