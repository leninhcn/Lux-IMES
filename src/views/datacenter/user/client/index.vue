<template>
  <!-- 表单 -->
  <el-form ref="form" :inline="true" :model="formData" v-show="showSearch">
    <el-form-item :label="$t('common.filtrate')" prop="optionData">
      <el-select v-model="formData.optionData" filterable clearable :placeholder="$t('common.selectTip')" style="width: 160px">
        <el-option v-for="item in options" :key="item.prop" :label="item.label" :value="item.prop" />
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="textData">
      <el-input v-model="formData.textData" :disabled="textDataDisabled" clearable :placeholder="$t('common.inputTip')" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" :loading="loading" @click="search">{{ $t('btn.search') }}</el-button>
      <el-button icon="Refresh" @click="reset(form)">{{ $t('btn.reset') }}</el-button>
    </el-form-item>
  </el-form>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:user:client:add']" @click="addRoEditData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:user:client:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:user:client:export']" @click="dowloadData">{{
        $t('btn.export')
      }}</el-button>
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:user:client:edit']" @click="addRoEditData('edit', row)">{{
        $t('btn.edit')
      }}</el-button>
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
      <el-form-item :label="$t('customer.customerCode')" prop="customerCode">
        <el-input
          v-model="dialogVisible.form.customerCode"
          clearable
          :disabled="dialogVisible.title.includes($t('btn.edit'))"
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('customer.customerName')" prop="customerName">
        <el-input v-model="dialogVisible.form.customerName" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('customer.customerDesc')" prop="customerDesc">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="dialogVisible.form.customerDesc"
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('customer.customerAddr')" prop="customerAddr">
        <el-input v-model="dialogVisible.form.customerAddr" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('customer.customerTel')" prop="customerTel">
        <el-input v-model="dialogVisible.form.customerTel" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" @click="dialogConfirm(dialogFormRef)">{{ $t('btn.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="client">
import ITable from '@/components/ITable'
import { getClientData, addClientData, editClientData } from '@/api/datacenter/user/client'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('customer.customerCode'), prop: 'customerCode', visible: true, sortable: true },
  { key: 2, label: proxy.$t('customer.customerName'), prop: 'customerName', visible: true, sortable: true },
  { key: 3, label: proxy.$t('customer.customerAddr'), prop: 'customerAddr', visible: true, sortable: true },
  { key: 4, label: proxy.$t('customer.customerTel'), prop: 'customerTel', visible: true, sortable: true },
  { key: 5, label: proxy.$t('customer.customerDesc'), prop: 'customerDesc', visible: true, sortable: true },
  { key: 6, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, width: 100, sortable: true },
  { key: 7, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 160 },
  { key: 8, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 100 }
])

// 筛选条件
const options = [{ label: proxy.$t('customer.customerCode'), prop: 'customerCode' }]

// 显隐表单
const showSearch = ref(true)

// 加载状态
const loading = ref(false)

// 表单项
const formData = reactive({
  optionData: '',
  textData: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 改变条数
watch(pageSize, () => getTableData())

// 改变页码
watch(currentPage, () => getTableData())

// 根据筛选条件是否选择控制筛选字符串输入框的禁用与否
const textDataDisabled = ref(false)
watch(
  () => formData.optionData,
  (val) => {
    if (val) {
      textDataDisabled.value = false
    } else {
      textDataDisabled.value = true
      formData.textData = ''
    }
  },
  {
    immediate: true
  }
)

// 搜索
const search = () => {
  getTableData()
}

// 重置
const form = ref()
const reset = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

// 获取表格数据
const tableData = ref([])
const getTableData = async () => {
  loading.value = true
  try {
    const res = await getClientData({ ...formData, pageNum: currentPage.value, pageSize: pageSize.value })
    tableData.value = res.result
    total.value = res.totalNum
  } finally {
    loading.value = false
  }
}
getTableData()

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
    customerCode: '',
    customerName: '',
    customerDesc: '',
    customerAddr: '',
    customerTel: ''
  },
  rules: {
    customerCode: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    customerName: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  }
})

// 新增/编辑
const addRoEditData = (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.customerCode}`
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
        res = await addClientData(dialogVisible.form)
      } else {
        res = await editClientData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res.data.includes('成功')) {
        proxy.$modal.msgSuccess(res.data)
        dialogVisible.open = false
        getTableData()
      } else if (res.data.includes('Vendor Code Already exists!')) {
        proxy.$modal.msgWarning(res.data)
      } else {
        proxy.$modal.msgError(res.data)
      }
    } finally {
      dialogVisible.btnLoading = false
    }
  })
}

// 导出
const dowloadData = () => {
  proxy.downFile('/MntnVendorMntnCustomer/VendorMntnCustomer/CustomerExport', { pageSize: total.value })
}
</script>

<style lang="scss" scoped></style>
