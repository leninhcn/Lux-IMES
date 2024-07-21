<template>
    <!-- 表单 -->
    <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
    <!-- 右侧工具栏 -->
    <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
    <!-- 表格 -->
    <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
      <!-- 操纵按钮 -->
      <template #tool-btns>
        <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:product:imsjlzSet:add']" @click="addRoEditData('add')">{{
          $t('btn.add')
        }}</el-button>
        <el-button
          type="success"
          plain
          icon="Edit"
          v-hasPermi="['datacenter:product:imsjlzSet:edit']"
          :disabled="selectData.length != 1"
          @click="addRoEditData('edit', selectData[0])"
          >{{ $t('btn.edit') }}</el-button
        >
        <!-- <el-button
          type="danger"
          plain
          icon="Delete"
          v-hasPermi="['datacenter:product:imsjlzSet:remove']"
          :disabled="selectData.length != 1"
          @click="delData(selectData[0])"
          >{{ $t('btn.delete') }}</el-button
        > -->
        <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:product:imsjlzSet:export']" @click="dowloadData">{{
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
        <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:product:imsjlzSet:edit']" @click="addRoEditData('edit', row)">{{
          $t('btn.edit')
        }}</el-button>
        <!-- <el-button
          type="danger"
          size="small"
          icon="Delete"
          text
          v-show="row.enaBled === 'N'"
          v-hasPermi="['datacenter:product:imsjlzSet:remove']"
          @click="delData(row)">
          {{ $t('btn.delete') }}
        </el-button> -->
        <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:imsjlzSet:history']" @click="showLog(row)">
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
            <el-form-item :label="$t('imsjlzSet.model_name')" prop="model_name">
                <el-select v-model="dialogVisible.form.model_name" filterable clearable :placeholder="$t('common.selectTip')">
                <el-option v-for="item in dialogVisible.options.model_name" :key="item.MODEL" :label="item.MODEL" :value="item.MODEL" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('imsjlzSet.plastic_batch')" prop="plastic_batch">
                <el-input v-model="dialogVisible.form.plastic_batch" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('imsjlzSet.plastic_material')" prop="plastic_material">
                <el-input v-model="dialogVisible.form.plastic_material" clearable :placeholder="$t('common.inputTip')" />
            </el-form-item>
            <el-form-item :label="$t('imsjlzSet.plastic_vendor')" prop="plastic_vendor">
                <el-input v-model="dialogVisible.form.plastic_vendor" clearable :placeholder="$t('common.inputTip')" />
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
        <el-table-column property="id" :label="$t('imsjlzSet.id')" fixed="left" />
        <el-table-column property="model_name" :label="$t('imsjlzSet.model_name')" />
        <el-table-column property="plastic_batch" :label="$t('imsjlzSet.plastic_batch')" />
        <el-table-column property="plastic_material" :label="$t('imsjlzSet.plastic_material')"/>
        <el-table-column property="plastic_vendor" :label="$t('imsjlzSet.plastic_vendor')" />
        <el-table-column property="creat_emp" :label="$t('imsjlzSet.creat_emp')"/>
        <el-table-column property="update_empno" :label="$t('imsjlzSet.update_empno')"/>
        <el-table-column property="updateTime" :label="$t('imsjlzSet.updateTime')" width="180" />
        <el-table-column property="enaBled" :label="$t('imsjlzSet.enaBled')" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.enaBled === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
            <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </template>
  
  <script setup name="imsjlzSet">
  import IForm from '@/components/IForm'
  import ITable from '@/components/ITable'
  import { getImsjlzSetData, addImsjlzSetData, editImsjlzSetData, delImsjlzSetData, getImsjlzSetLog,getModelData } from '@/api/datacenter/product/mimsjlzSet'
  import { ElMessageBox } from 'element-plus'
  
  const { proxy } = getCurrentInstance()
  
  // 表格配置项
  const columns = reactive([
    { key: 0, type: 'selection', fixed: 'left' },
    { key: 1, label: proxy.$t('imsjlzSet.id'), prop: 'id', visible: true, sortable: true },
    { key: 1, label: proxy.$t('imsjlzSet.model_name'), prop: 'model_name', visible: true, sortable: true },
    { key: 2, label: proxy.$t('imsjlzSet.plastic_batch'), prop: 'plastic_batch', visible: true, sortable: true },
    { key: 3, label: proxy.$t('imsjlzSet.plastic_material'), prop: 'plastic_material', visible: true, sortable: true },
    { key: 4, label: proxy.$t('imsjlzSet.plastic_vendor'), prop: 'plastic_vendor', visible: true, sortable: true },
    { key: 5, label: proxy.$t('imsjlzSet.update_empno'), prop: 'update_empno', visible: true, sortable: true },
    { key: 6, label: proxy.$t('imsjlzSet.updateTime'), prop: 'updateTime', visible: true, sortable: true },
    { key: 7, label: proxy.$t('imsjlzSet.enaBled'), prop: 'enaBled', visible: true, fixed: 'right' },
    { key: 8, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right' }
  ])
  
  // 筛选条件
  const options = reactive([
    {
      label: proxy.$t('imsjlzSet.model_name'),
      prop: 'model_name'
    },
    {
      label: proxy.$t('imsjlzSet.plastic_batch'),
      prop: 'plastic_batch'
    },
    {
      label: proxy.$t('imsjlzSet.plastic_material'),
      prop: 'plastic_material'
    },
    {
      label: proxy.$t('imsjlzSet.plastic_vendor'),
      prop: 'plastic_vendor'
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
      const res = await getImsjlzSetData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
    const res = await editImsjlzSetData({ id: row.id,model_name: row.model_name, enaBled: flag })
    if (res.code === 200 && res.data.includes('成功')) {
      row.enaBled = flag
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail')+res.data)
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
        plastic_batch: '',
        plastic_material: '',
        plastic_vendor: ''
    },
    options: {
        model_name: []
    },
    rules: {
        model_name: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
        plastic_batch: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
        plastic_material: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
        plastic_vendor: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
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
          res = await addImsjlzSetData(dialogVisible.form)
        } else {
          res = await editImsjlzSetData({ id: dialogVisible.id, ...dialogVisible.form })
        }
        if (res.code === 200 && res.data.includes('成功')) {
          proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
          dialogVisible.open = false
          getTableData()
        } else {
          proxy.$modal.msgError(proxy.$t('common.operationFail')+res.data)
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
    const res = await delImsjlzSetData({ id: row.id })
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
  const showLog = async ({ id, model_name }) => {
    logDialogVisible.title = `${model_name} ${proxy.$t('btn.log')}`
    logDialogVisible.open = true
    logDialogVisible.loading = true
    try {
      const res = await getImsjlzSetLog({ id })
      logDialogVisible.tableData = res
    } finally {
      logDialogVisible.loading = false
    }
  }
  
  // 导出
  const dowloadData = () => {
    proxy.downFile('/datacenter/ImsjlzSet/ImsjlzSetExport', { pageSize: total.value })
  }
  </script>
  
  <style lang="scss" scoped></style>
  