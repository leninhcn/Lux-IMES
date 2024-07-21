<template>
    <!-- 表单 -->
    <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
    <!-- 右侧工具栏 -->
    <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
    <!-- 表格 -->
    <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
      <!-- 操纵按钮 -->
      <template #tool-btns>
        <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:categoryInfo:add']" @click="addRoEditData('add')">{{
          $t('btn.add')
        }}</el-button>
        <el-button
          type="success"
          plain
          icon="Edit"
          v-hasPermi="['datacenter:product:categoryInfo:edit']"
          :disabled="selectData.length != 1"
          @click="addRoEditData('edit', selectData[0])"
          >{{ $t('btn.edit') }}</el-button
        >
        <el-button
          type="danger"
          plain
          icon="Delete"
          v-hasPermi="['datacenter:product:categoryInfo:remove']"
          :disabled="selectData.length != 1"
          @click="delData(selectData[0])"
          >{{ $t('btn.delete') }}</el-button
        >
        <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:categoryInfo:export']" @click="dowloadData">{{
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
        <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:product:categoryInfo:edit']" @click="addRoEditData('edit', row)">{{
          $t('btn.edit')
        }}</el-button>
        <el-button
          type="danger"
          size="small"
          icon="Delete"
          text
          v-show="row.enaBled === 'N'"
          v-hasPermi="['datacenter:product:categoryInfo:remove']"
          @click="delData(row)">
          {{ $t('btn.delete') }}
        </el-button>
        <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:categoryInfo:history']" @click="showLog(row)">
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
        <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="120">
            <el-form-item :label="$t('categoryname.unitType')" prop="unit_type">
                <el-select v-model="dialogVisible.form.unit_type" filterable clearable :placeholder="$t('common.selectTip')">
                <el-option v-for="item in dialogVisible.options.unit_type" :key="item.DEPT_NAME" :label="item.DEPT_NAME" :value="item.DEPT_NAME" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('categoryname.modelName')" prop="model_name">
                <el-select v-model="dialogVisible.form.model_name" filterable clearable :placeholder="$t('common.selectTip')" :disabled="dialogVisible.title.includes($t('btn.edit'))">
                <el-option v-for="item in dialogVisible.options.model_name" :key="item.MODEL" :label="item.MODEL" :value="item.MODEL" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('categoryname.categoryId')" prop="category_id">
                <el-input v-model="dialogVisible.form.category_id" clearable :placeholder="$t('common.inputTip')" disabled="disabled"/>
            </el-form-item>
            <el-form-item :label="$t('categoryname.category_en')" prop="category_name_en">
                <el-input v-model="dialogVisible.form.category_name_en" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('categoryname.category_cn')" prop="category_name_sc">
                <el-input v-model="dialogVisible.form.category_name_sc" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('categoryname.category_vi')" prop="category_name_vi">
                <el-input v-model="dialogVisible.form.category_name_vi" clearable :placeholder="$t('common.inputTip')" />
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
    <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1000" draggable>
      <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading" max-height="500">
        <el-table-column property="model_name" :label="$t('categoryname.modelName')" />
        <el-table-column property="category_id" :label="$t('categoryname.categoryId')" />
        <el-table-column property="category_name_en" :label="$t('categoryname.category_en')" />
        <el-table-column property="category_name_sc" :label="$t('categoryname.category_cn')"/>
        <el-table-column property="category_name_vi" :label="$t('categoryname.category_vi')" />
        <el-table-column property="unit_type" :label="$t('categoryname.unitType')" />
        <el-table-column property="update_empno" :label="$t('common.updateEmpno')" width="100" />
        <el-table-column property="updateTime" :label="$t('common.updateTime')" width="180" />
        <el-table-column property="enaBled" :label="$t('common.isEnable')" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.enaBled === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
            <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </template>
  
  <script setup name="categoryInfo">
  import IForm from '@/components/IForm'
  import ITable from '@/components/ITable'
  import { getCategoryInfoData, addCategoryInfoData, editCategoryInfoData, delCategoryInfoData, getCategoryInfoLog,getModelData,getDeptData } from '@/api/datacenter/product/categoryInfo'
  import { ElMessageBox } from 'element-plus'
  
  const { proxy } = getCurrentInstance()
  
  // 表格配置项
  const columns = reactive([
    { key: 0, type: 'selection', fixed: 'left' },
    { key: 1, label: proxy.$t('categoryname.modelName'), prop: 'model_name', visible: true, sortable: true },
    { key: 2, label: proxy.$t('categoryname.categoryId'), prop: 'category_id', visible: true, sortable: true },
    { key: 3, label: proxy.$t('categoryname.category_en'), prop: 'category_name_en', visible: true, sortable: true },
    { key: 4, label: proxy.$t('categoryname.category_cn'), prop: 'category_name_sc', visible: true, sortable: true },
    { key: 5, label: proxy.$t('categoryname.category_vi'), prop: 'category_name_vi', visible: true, sortable: true },
    { key: 6, label: proxy.$t('categoryname.unitType'), prop: 'unit_type', visible: true, sortable: true },
    { key: 7, label: proxy.$t('common.updateEmpno'), prop: 'update_empno', visible: true, sortable: true },
    { key: 8, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true },
    { key: 9, label: proxy.$t('common.isEnable'), prop: 'enaBled', visible: true, fixed: 'right' },
    { key: 10, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right' }
  ])
  
  // 筛选条件
  const options = reactive([
    {
      label: proxy.$t('categoryname.modelName'),
      prop: 'model_name'
    },
    {
      label: proxy.$t('categoryname.categoryId'),
      prop: 'category_id'
    },
    {
      label: proxy.$t('categoryname.category_en'),
      prop: 'category_en'
    },
    {
      label: proxy.$t('categoryname.category_cn'),
      prop: 'category_cn'
    },
    {
      label: proxy.$t('categoryname.category_vi'),
      prop: 'category_vi'
    },
    {
      label: proxy.$t('categoryname.unitType'),
      prop: 'unit_type'
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

      // 获取弹窗部门
    const getDeptDatas = async () => {
    const res = await getDeptData()
    dialogVisible.options.unit_type = res
    dialogVisible.options.stage = res
    }
    getDeptDatas()

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
      const res = await getCategoryInfoData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
    const res = await editCategoryInfoData({ model_name: row.model_name,category_id: row.category_id, enaBled: flag })
    if (res.code === 200 && res.data.includes('成功')) {
      row.enaBled = flag
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail') + res.data)
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
        unit_type: '',
        category_name_en: '',
        category_name_sc: '',
        category_name_vi: '',
        category_id: ''
    },
    options: {
        model_name: [],
        unit_type: []
    },
    rules: {
        category_name_en: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
        category_name_sc: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
        category_name_vi: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
        model_name: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        unit_type: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }]
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
          res = await addCategoryInfoData(dialogVisible.form)
        } else {
          res = await editCategoryInfoData({ id: dialogVisible.id, ...dialogVisible.form })
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
    const res = await delCategoryInfoData({ model_name: row.model_name })
    if (res.code === 200 && res.data.includes('成功')) {
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
      getTableData()
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail') + res.data)
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
  const showLog = async ({ model_name }) => {
    logDialogVisible.title = `${model_name} ${proxy.$t('btn.log')}`
    logDialogVisible.open = true
    logDialogVisible.loading = true
    try {
      const res = await getCategoryInfoLog({ model_name })
      logDialogVisible.tableData = res
    } finally {
      logDialogVisible.loading = false
    }
  }
  
  // 导出
  const dowloadData = () => {
    proxy.downFile('/datacenter/CategoryInfo/CategoryInfoExport', { pageSize: total.value })
  }
  </script>
  
  <style lang="scss" scoped></style>
  