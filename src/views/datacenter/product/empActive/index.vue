<template>
    <!-- 表单 -->
    <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
    <!-- 右侧工具栏 -->
    <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
    <!-- 表格 -->
    <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
      <!-- 启用 -->
      <template #enabled="{ row }">
        <el-switch
          v-model="row.enabled"
          inline-prompt
          :active-text="$t('empActive.enable')"
          :inactive-text="$t('empActive.disenable')"
          active-value="Y"
          inactive-value="N"
          :before-change="() => changeEnaBled(row)" />
      </template>
      <!-- 操作 -->
      <template #operation="{ row }">
        <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:product:buildColor:history']" @click="showLog(row)">
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
    
    <!-- log 弹窗 -->
    <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1000" draggable>
      <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading" max-height="500">
        <el-table-column property="active_id" label="ID" fixed="left" />
        <el-table-column property="op_user" :label="$t('empActive.op_user')" />
        <el-table-column property="emp_id" :label="$t('empActive.empId')" />
        <el-table-column property="emp_no" :label="$t('empActive.empNo')" />
        <el-table-column property="emp_name" :label="$t('empActive.empName')"/>
        <el-table-column property="o_enabled" :label="$t('empActive.o_enabled')" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.o_enabled === 'Y'" type="success">{{ $t('empActive.enable') }}</el-tag>
            <el-tag v-else type="danger">{{ $t('empActive.disenable') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="n_enabled" :label="$t('empActive.n_enabled')" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.n_enabled === 'Y'" type="success">{{ $t('empActive.enable') }}</el-tag>
            <el-tag v-else type="danger">{{ $t('empActive.disenable') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="updateTime" :label="$t('empActive.updateTime')" width="180" />
      </el-table>
    </el-dialog>
  </template>
  
  <script setup name="empActive">
  import IForm from '@/components/IForm'
  import ITable from '@/components/ITable'
  import { getEmpActiveData, addEmpActiveData, getEmpActiveLog } from '@/api/datacenter/product/empActive'
  import { ElMessageBox } from 'element-plus'
  
  const { proxy } = getCurrentInstance()
  
  // 表格配置项
  const columns = reactive([
    { key: 0, label: proxy.$t('empActive.empNo'), prop: 'empNo', visible: true, sortable: true },
    { key: 1, label: proxy.$t('empActive.empName'), prop: 'empName', visible: true, sortable: true },
    { key: 3, label: proxy.$t('empActive.loginTime'), prop: 'createEmpno', visible: true, sortable: true },
    { key: 3, label: proxy.$t('empActive.updateTime'), prop: 'updateTime', visible: true, sortable: true },
    { key: 2, label: proxy.$t('empActive.enaBled'), prop: 'enabled', visible: true, fixed: 'right' },
    { key: 4, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right' }
  ])
  
  // 筛选条件
  const options = reactive([
    {
      label: proxy.$t('empActive.empNo'),
      prop: 'empNo'
    },
    {
      label: proxy.$t('empActive.empName'),
      prop: 'empName'
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
      const res = await getEmpActiveData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
    const flag = row.enabled === 'Y' ? 'N' : 'Y'
    const res = await addEmpActiveData({ emp_no: row.empNo, n_enabled: flag })
    if (res.code === 200 && res.data.includes('成功')) {
      row.enabled = flag
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
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
  const showLog = async ({ empNo }) => {
    logDialogVisible.title = `${empNo} ${proxy.$t('btn.log')}`
    logDialogVisible.open = true
    logDialogVisible.loading = true
    try {
      const res = await getEmpActiveLog({ empNo })
      logDialogVisible.tableData = res
    } finally {
      logDialogVisible.loading = false
    }
  }
  
  </script>
  
  <style lang="scss" scoped></style>
  