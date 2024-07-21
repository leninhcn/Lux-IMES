<template>
    <el-card style="padding-bottom: 20px; margin-bottom: 10px">
        <!-- 区段 -->
        <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search" />
        <!-- 右侧工具栏 -->
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
        <!-- 表格 -->
        <ITable
        :columns="columns"
        :tableData="tableData"
        :loading="loading"
        :height="200"
        :highlightCurrentRow="true"
        :handleSelectionChange="handleSelectionChange"
        :handle-current-change="handleCurrentChange">
        <!-- 操纵按钮 -->
        <template #tool-btns>
            <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:imSet:add']" @click="addRoEditData('add')">{{
            $t('btn.add')
            }}</el-button>
            <el-button
            type="success"
            plain
            icon="Edit"
            v-hasPermi="['datacenter:product:imSet:edit']"
            :disabled="selectData.length != 1"
            @click="addRoEditData('edit', selectData[0])"
            >{{ $t('btn.edit') }}</el-button
            >
            <!-- <el-button
            type="danger"
            plain
            icon="Delete"
            v-hasPermi="['datacenter:product:imSet:remove']"
            :disabled="selectData.length != 1"
            @click="delData(selectData[0])"
            >{{ $t('btn.delete') }}</el-button> -->
            
            <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:imSet:export']" @click="dowloadData">{{
            $t('btn.export')
            }}</el-button>
        </template>
        <!-- 启用 -->
        <template #enaBled="{ row }">
            <el-switch
            v-model="row.enaBled"
            inline-prompt
            :active-text="$t('common.enable')"
            :inactive-text="$t('common.disenable')"
            active-value="Y"
            inactive-value="N"
            :before-change="() => changeEnaBled(row)" />
        </template>
        <!-- 操作 -->
        <template #operation="{ row }">
            <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:product:imSet:edit']" @click="addRoEditData('edit', row)">{{
            $t('btn.edit')
            }}</el-button>
            <!-- <el-button
            type="danger"
            size="small"
            icon="Delete"
            text
            v-show="row.enaBled === 'N'"
            v-hasPermi="['datacenter:product:imSet:remove']"
            @click="delData(row)">
            {{ $t('btn.delete') }}
            </el-button> -->
            <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:imSet:history']" @click="showLog(row)">
            {{ $t('btn.log') }}
            </el-button>
        </template>
        </ITable>
        <!-- 分页 -->
        <el-pagination
        style="float: right; margin-top: 10px"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 25, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" />
    </el-card>
    <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="500" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="100">
        <el-form-item :label="$t('imSet.modelName')" prop="model_name">
            <el-select v-model="dialogVisible.form.model_name" @change="modelChange" filterable clearable :placeholder="$t('common.selectTip')" :disabled="dialogVisible.title.includes($t('btn.edit'))">
            <el-option v-for="item in dialogVisible.options.model_name" :key="item.MODEL" :label="item.MODEL" :value="item.MODEL" />
            </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('imSet.lineName')" prop="line_name">
            <el-select v-model="dialogVisible.form.line_name" @change="lineChange" filterable clearable :placeholder="$t('common.selectTip')">
            <el-option v-for="item in dialogVisible.options.line_name" :key="item.LINE" :label="item.LINE" :value="item.LINE" />
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('imSet.stageName')" prop="stage_name">
            <el-select v-model="dialogVisible.form.stage_name" @change="stageChange" filterable clearable :placeholder="$t('common.selectTip')" >
            <el-option v-for="item in dialogVisible.options.stage_name" :key="item.STAGE" :label="item.STAGE" :value="item.STAGE" />
            </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('imSet.stationName')" prop="station_name">
            <el-select v-model="dialogVisible.form.station_name" filterable clearable :placeholder="$t('common.selectTip')" >
            <el-option v-for="item in dialogVisible.options.station_name" :key="item.STATION_NAME" :label="item.STATION_NAME" :value="item.STATION_NAME" />
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('imSet.productVersion')" prop="product_version">
            <el-select v-model="dialogVisible.form.product_version" filterable clearable :placeholder="$t('common.selectTip')" >
            <el-option v-for="item in dialogVisible.options.product_version" :key="item.BUILD_NO" :label="item.BUILD_NO" :value="item.BUILD_NO" />
            </el-select>
        </el-form-item>
        <el-form-item :label="$t('imSet.sjBuild')" prop="sjlzrowid">
            <el-select v-model="dialogVisible.form.sjlzrowid" filterable clearable :placeholder="$t('common.selectTip')" >
            <el-option v-for="item in dialogVisible.options.sjlzrowid" :key="item.PLASTIC_VENDOR" :label="item.PLASTIC_VENDOR" :value="item.PLASTIC_VENDOR" />
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
  <!-- log 弹窗 -->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1200" draggable>
    <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading" max-height="500">
        <el-table-column property="id" :label="$t('imSet.id')" />
      <el-table-column property="model_name" :label="$t('imSet.modelName')" />
      <el-table-column property="station_name" :label="$t('imSet.stationName')" />
      <el-table-column property="product_version" :label="$t('imSet.productVersion')" />
      <el-table-column property="sjlzrowid" :label="$t('imSet.sjBuild')" />
      <el-table-column property="enaBled" :label="$t('common.isEnable')" />
      <el-table-column property="creat_emp" :label="$t('common.createEmpno')" />
      <el-table-column property="update_empno" :label="$t('common.updateEmpno')" />
      <el-table-column property="updateTime" :label="$t('common.updateTime')" width="160" />
    </el-table>
  </el-dialog>
  </template>
  
  <script setup name="imSet">
  import IForm from '@/components/IForm'
  import ITable from '@/components/ITable'
  import { getImsetDataSJ, addImsetData, editImsetData, delImsetData, getImsetLog,getModelData,getLineData,getStageData,getStationData,getSJVendorData,getBuildData } from '@/api/datacenter/product/mimSet'
  import { ElMessageBox } from 'element-plus'
  
  const { proxy } = getCurrentInstance()
  
  // 表格配置项
  const columns = reactive([
    { key: 0, type: 'selection', fixed: 'left' },
    { key: 1, label: proxy.$t('imSet.id'), prop: 'id', visible: true, sortable: true },
    { key: 2, label: proxy.$t('imSet.modelName'), prop: 'model_name', visible: true, sortable: true },
    { key: 3, label: proxy.$t('imSet.stationName'), prop: 'station_name', visible: true, sortable: true },
    { key: 4, label: proxy.$t('imSet.productVersion'), prop: 'product_version', visible: true, sortable: true },
    { key: 5, label: proxy.$t('imSet.sjBuild'), prop: 'sjlzrowid', visible: true, sortable: true },
    { key: 8, label: proxy.$t('common.createEmpno'), prop: 'creat_emp', visible: true, sortable: true },
    { key: 8, label: proxy.$t('common.updateEmpno'), prop: 'update_empno', visible: true, sortable: true },
    { key: 9, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true },
    { key: 10, label: proxy.$t('common.isEnable'), prop: 'enaBled', visible: true, fixed: 'right' },
    { key: 11, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right' }
  ])
  
  // 筛选条件
  const options = reactive([
    {
      label: proxy.$t('imSet.modelName'),
      prop: 'model_name'
    },
    {
      label: proxy.$t('imSet.stationName'),
      prop: 'station_name'
    },
    {
      label: proxy.$t('imSet.productVersion'),
      prop: 'product_version'
    },
    {
      label: proxy.$t('imSet.sjBuild'),
      prop: 'sjlzrowid'
    }
  ])
  
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
  
    // 获取弹窗机种
    const getModelDatas = async () => {
        const res = await getModelData()
        dialogVisible.options.model_name = res
    }
    getModelDatas()

    const getStationDatas = async (val) => {
        const res = await getStationData({ model_name: val })
        dialogVisible.options.station_name = res
    }

    const getSJVendorDatas = async (val) => {
        const res = await getSJVendorData({ model_name: val })
        dialogVisible.options.sjlzrowid = res
    }

    const getBuildDatas = async (val) => {
        const res = await getBuildData({ model_name: val })
        dialogVisible.options.product_version = res
    }

    const modelChange = (val) => {
        getStationDatas(val)
        getSJVendorDatas(val)
        getBuildDatas(val)

        dialogVisible.form.product_version = ""
        dialogVisible.form.sjlzrowid = ""
        dialogVisible.form.station_name = ""
    }

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
      const res = await getImsetDataSJ({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
      //tableData.value = res.data.result
      //total.value = res.data.totalNum
      total.value = res.totalNum
      tableData.value = res.result
    } finally {
      loading.value = false
    }
  }
  getTableData()
  
  // 启用/禁用
  const changeEnaBled = async (row) => {
    const flag = row.enaBled === 'Y' ? 'N' : 'Y'
    const res = await editImsetData({ id: row.id,enaBled: flag })
    if (res.code === 200) {
      row.enaBled = flag
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail'))
    }
  }
  
  // 表格选中
  const selectData = ref([])
  const handleSelectionChange = (value) => {
    selectData.value = value
  }
  
  // 弹窗
  const dialogFormRef = ref()
  const dialogVisible = reactive({
    id: '',
    title: '',
    open: false,
    btnLoading: false,
    form: {
        sxl_type: '',
        model_name: '',
        station_name: '',
        product_version: '',
        sjlzrowid: ''
    },
    options: {
        model_name: [],
        station_name: [],
        product_version: [],
        sjlzrowid: []
    },
    rules: {
        model_name: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        station_name: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        product_version: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        sjlzrowid: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }]
    }
  })
  
  // 新增/编辑
  const addRoEditData = (type, data) => {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    if (type === 'add') {
      dialogVisible.title = proxy.$t('btn.add')
    } else {
      dialogVisible.title = `${proxy.$t('btn.edit')} ${data.model_name}`
      dialogVisible.id = data.id
      for (let i in dialogVisible.form) {
        dialogVisible.form[i] = data[i]
      }
      getStationDatas(dialogVisible.form.model_name)
      getSJVendorDatas(dialogVisible.form.model_name)
      getBuildDatas(dialogVisible.form.model_name)
    }
    dialogVisible.open = true
  }
  
  // 弹窗确定
  const dialogConfirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
      if (!valid) return
      let res
      try {
        dialogVisible.form.sxl_type = "SL"
        dialogVisible.btnLoading = true
        if (dialogVisible.title === proxy.$t('btn.add')) {
          res = await addImsetData(dialogVisible.form)
        } else {
          res = await editImsetData({ id: dialogVisible.id, ...dialogVisible.form })
        }
        if (res.code === 200 && res.data.includes('成功')) {
          proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
          dialogVisible.open = false
          getTableData()
        } else {
          proxy.$modal.msgError(proxy.$t('common.operationFail') +res.data)
        }
      } finally {
        dialogVisible.btnLoading = false
      }
    })
  }
  
  // 删除
  const delData = async (row) => {
    if (row.enaBled === 'Y') {
      return proxy.$modal.msgWarning(proxy.$t('common.enableFailMsg'))
    }
    await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
      confirmButtonText: proxy.$t('btn.submit'),
      cancelButtonText: proxy.$t('btn.cancel'),
      type: 'warning'
    })
    const res = await delImsetData({ model_name: row.model_name })
    if (res.code === 200 && res.data.includes('成功')) {
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
      getTableData()
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail') +res.data)
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
  const showLog = async ({ id,model_name }) => {
    logDialogVisible.title = `上料 ${model_name} ${proxy.$t('btn.log')}`
    logDialogVisible.open = true
    logDialogVisible.loading = true
    var v_id = id
    try {
      const res = await getImsetLog({ id })
      logDialogVisible.tableData = res
    } finally {
      logDialogVisible.loading = false
    }
  }
  
  // 导出
  const dowloadData = () => {
    proxy.downFile('/datacenter/imset/ImSetExportSJ', { pageSize: total.value })
  }
  </script>
  
  <style lang="scss" scoped></style>
  