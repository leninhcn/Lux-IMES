<template>
    <!-- 表单 -->
    <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
    <!-- 右侧工具栏 -->
    <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
    <!-- 表格 -->
    <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
      <!-- 操纵按钮 -->
      <template #tool-btns>
        <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:buildConfig:add']" @click="addRoEditData('add')">{{
          $t('btn.add')
        }}</el-button>
        <el-button
          type="success"
          plain
          icon="Edit"
          v-hasPermi="['datacenter:product:buildConfig:edit']"
          :disabled="selectData.length != 1"
          @click="addRoEditData('edit', selectData[0])"
          >{{ $t('btn.edit') }}</el-button
        >
        <el-button
          type="danger"
          plain
          icon="Delete"
          v-hasPermi="['datacenter:product:buildConfig:remove']"
          :disabled="selectData.length != 1"
          @click="delData(selectData[0])"
          >{{ $t('btn.delete') }}</el-button
        >
        <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:buildConfig:export']" @click="dowloadData">{{
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
        <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:product:buildConfig:edit']" @click="addRoEditData('edit', row)">{{
          $t('btn.edit')
        }}</el-button>
        <el-button
          type="danger"
          size="small"
          icon="Delete"
          text
          v-show="row.enaBled === 'N'"
          v-hasPermi="['datacenter:product:buildConfig:remove']"
          @click="delData(row)">
          {{ $t('btn.delete') }}
        </el-button>
        <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:buildConfig:history']" @click="showLog(row)">
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
    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="500" draggable>
        <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="100">
            <el-form-item :label="$t('model.modelName')" prop="model_name">
                <el-select v-model="dialogVisible.form.model_name" @change="modelChange" filterable clearable :placeholder="$t('common.selectTip')" :disabled="dialogVisible.title.includes($t('btn.edit'))">
                <el-option v-for="item in dialogVisible.options.model_name" :key="item.MODEL" :label="item.MODEL" :value="item.MODEL" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('model.product_version')" prop="product_version">
                <el-input v-model="dialogVisible.form.product_version" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('model.sup_vendor')" prop="sup_vendor">
                <el-input v-model="dialogVisible.form.sup_vendor" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('CONFIG_EN')" prop="color_en">
                <el-input v-model="dialogVisible.form.config_en" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('CONFIG_CN')" prop="color_sc">
                <el-input v-model="dialogVisible.form.config_sc" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('CONFIG_VI')" prop="color_vi">
                <el-input v-model="dialogVisible.form.config_vi" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('model.coloren')" prop="pdtcolor_name_en">
                <el-select v-model="dialogVisible.form.pdtcolor_name_en" @change="ENChange" filterable clearable :placeholder="$t('common.selectTip')">
                <el-option v-for="item in dialogVisible.options.pdtcolor_name_en" :key="item.COLOR_EN" :label="item.COLOR_EN" :value="item.COLOR_EN" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('model.colorcn')" prop="pdtcolor_name_sc">
                <el-select v-model="dialogVisible.form.pdtcolor_name_sc" @change="CNChange" filterable clearable :placeholder="$t('common.selectTip')">
                <el-option v-for="item in dialogVisible.options.pdtcolor_name_sc" :key="item.COLOR_SC" :label="item.COLOR_SC" :value="item.COLOR_SC" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('model.colorvi')" prop="pdtcolor_name_vi">
                <el-select v-model="dialogVisible.form.pdtcolor_name_vi" @change="VIChange" filterable clearable :placeholder="$t('common.selectTip')">
                <el-option v-for="item in dialogVisible.options.pdtcolor_name_vi" :key="item.COLOR_VI" :label="item.COLOR_VI" :value="item.COLOR_VI" />
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
        <el-table-column property="id" label="ID" fixed="left" />
        <el-table-column property="model_name" :label="$t('model.modelName')" />
        <el-table-column property="build_no" :label="$t('Build No')" />
        <el-table-column property="config_en" :label="$t('CONFIG_EN')" />
        <el-table-column property="config_sc" :label="$t('CONFIG_CN')"/>
        <el-table-column property="config_vi" :label="$t('CONFIG_VI')" />
        <el-table-column property="pdtcolor_name_en" :label="$t('model.coloren')" />
        <el-table-column property="pdtcolor_name_sc" :label="$t('model.colorcn')"/>
        <el-table-column property="pdtcolor_name_vi" :label="$t('model.colorvi')" />
        <el-table-column property="product_version" :label="$t('model.product_version')" />
        <el-table-column property="sup_vendor" :label="$t('model.sup_vendor')" />
        <el-table-column property="update_empno" :label="$t('common.updateEmpno')"/>
        <el-table-column property="updateTime" :label="$t('common.updateTime')" />
        <el-table-column property="enaBled" :label="$t('common.isEnable')" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.enaBled === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
            <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </template>

  <script setup name="mbuildConfig">
  import IForm from '@/components/IForm'
  import ITable from '@/components/ITable'
  import { getBuildConfigData, addBuildConfigData, editBuildConfigData, delBuildConfigData, getBuildConfigLog,getModelData,getColorData,getColorDataInfo } from '@/api/datacenter/product/buildConfig'
  import { ElMessageBox } from 'element-plus'

  const { proxy } = getCurrentInstance()

  // 表格配置项
  const columns = reactive([
    { key: 0, type: 'selection', fixed: 'left' },
    { key: 1, label: proxy.$t('ID'), prop: 'id', visible: true, sortable: true , width: 100},
    { key: 2, label: proxy.$t('model.modelName'), prop: 'model_name', visible: true, sortable: true , width: 160},
    { key: 2, label: proxy.$t('Build No'), prop: 'build_no', visible: true, sortable: true , width: 180},
    { key: 3, label: proxy.$t('CONFIG_EN'), prop: 'config_en', visible: true, sortable: true , width: 160},
    { key: 4, label: proxy.$t('CONFIG_CN'), prop: 'config_sc', visible: true, sortable: true , width: 160},
    { key: 5, label: proxy.$t('CONFIG_VI'), prop: 'config_vi', visible: true, sortable: true , width: 160},
    { key: 6, label: proxy.$t('pdtcolor_code'), prop: 'pdtcolor_code', visible: false, sortable: false , width: 120},
    { key: 6, label: proxy.$t('model.coloren'), prop: 'pdtcolor_name_en', visible: true, sortable: true , width: 120},
    { key: 7, label: proxy.$t('model.colorcn'), prop: 'pdtcolor_name_sc', visible: true, sortable: true , width: 120},
    { key: 8, label: proxy.$t('model.colorvi'), prop: 'pdtcolor_name_vi', visible: true, sortable: true , width: 120},
    { key: 9, label: proxy.$t('model.product_version'), prop: 'product_version', visible: true, sortable: true , width: 120},
    { key: 10, label: proxy.$t('model.sup_vendor'), prop: 'sup_vendor', visible: true, sortable: true , width: 120},
    { key: 12, label: proxy.$t('common.updateEmpno'), prop: 'update_empno', visible: true, sortable: true , width: 120},
    { key: 13, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true , width: 160},
    { key: 11, label: proxy.$t('common.isEnable'), prop: 'enaBled', visible: true, fixed: 'right' },
    { key: 14, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right' }
  ])

  // 筛选条件
  const options = reactive([
    {
      label: proxy.$t('model.modelName'),
      prop: 'model_name'
    },
    {
      label: proxy.$t('CONFIG_EN'),
      prop: 'config_en'
    },
    {
      label: proxy.$t('CONFIG_CN'),
      prop: 'config_sc'
    },
    {
      label: proxy.$t('CONFIG_VI'),
      prop: 'config_vi'
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

    var v_model_name = ""
    // 获取弹窗机种
    const getModelDatas = async () => {
    const res = await getModelData()
    dialogVisible.options.model_name = res
    }
    getModelDatas()

    // 获取弹窗颜色
    const getColorDatas = async (val) => {
    const res = await getColorData({ model_name: val })
    v_model_name = val
    dialogVisible.options.pdtcolor_name_en = res
    dialogVisible.options.pdtcolor_name_sc = res
    dialogVisible.options.pdtcolor_name_vi = res
    }

    const modelChange = (val) => {
        dialogVisible.form.pdtcolor_name_en = ""
        dialogVisible.form.pdtcolor_name_sc = ""
        dialogVisible.form.pdtcolor_name_vi = ""
        getColorDatas(val)
    }

    const ENChange = (val) => {
        getColorDataInfos(val,"EN")
    }

    const CNChange = (val) => {
        getColorDataInfos(val,"CN")
    }

    const VIChange = (val) => {
        getColorDataInfos(val,"VI")
    }

    const getColorDataInfos = async (val,type) => {

        const res = await getColorDataInfo({ model_name: v_model_name,type:type,color_name: val})

        dialogVisible.form.pdtcolor_name_en = res[0].COLOR_EN
        dialogVisible.form.pdtcolor_name_sc = res[0].COLOR_SC
        dialogVisible.form.pdtcolor_name_vi = res[0].COLOR_VI
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
      const res = await getBuildConfigData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
    const res = await editBuildConfigData({ id: row.id, enaBled: flag })
    if (res.code === 200 && res.data.includes('成功')) {
      row.enaBled = flag
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail')+";"+res.data)
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
        model_name: '',
        pdtcolor_name_en: '',
        pdtcolor_name_sc: '',
        pdtcolor_name_vi: '',
      config_en: '',
      config_sc: '',
      config_vi: '',
      product_version: '',
      sup_vendor: ''
    },
    options: {
        model_name: [],
        pdtcolor_name_en:[],
        pdtcolor_name_sc:[],
        pdtcolor_name_vi:[]
    },
    rules: {
        model_name: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        pdtcolor_name_en: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        pdtcolor_name_sc: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        pdtcolor_name_vi: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        config_en: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
        config_sc: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
        config_vi: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
        product_version: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
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
      getColorDatas(dialogVisible.form.model_name)
      //dialogVisible.form.pdtcolor_name_en = data.pdtcolor_code
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
        dialogVisible.btnLoading = true
        if (dialogVisible.title === proxy.$t('btn.add')) {
          res = await addBuildConfigData(dialogVisible.form)
        } else {
          res = await editBuildConfigData({ id: dialogVisible.id, ...dialogVisible.form })
        }
        if (res.code === 200 && res.data.includes('成功')) {
          proxy.$modal.msgSuccess(res.data)
          dialogVisible.open = false
          getTableData()
        } else {
          proxy.$modal.msgError(proxy.$t('common.operationFail')+","+res.data)
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
    const res = await delBuildConfigData({ id: row.id })
    if (res.code === 200 && res.data.includes('成功')) {
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
      getTableData()
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail')+","+res.data)
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
  const showLog = async ({ id, model_name }) => {
    logDialogVisible.title = `${model_name} ${proxy.$t('btn.log')}`
    logDialogVisible.open = true
    logDialogVisible.loading = true
    try {
      const res = await getBuildConfigLog({ id, model_name })
      logDialogVisible.tableData = res
    } finally {
      logDialogVisible.loading = false
    }
  }

  // 导出
  const dowloadData = () => {
    proxy.downFile('/datacenter/BuildConfig/BuildConfigExport', { pageSize: total.value })
  }
  </script>

  <style lang="scss" scoped></style>
