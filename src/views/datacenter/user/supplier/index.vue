<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:user:supplier:add']" @click="addRoEditData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:user:supplier:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:user:supplier:export']" @click="dowloadData">{{
        $t('btn.export')
      }}</el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:user:supplier:import']" @click="uploadData">{{
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
        :before-change="() => changeEnabled(row)" />
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:user:supplier:edit']" @click="addRoEditData('edit', row)">{{
        $t('btn.edit')
      }}</el-button>
      <el-button type="primary" size="small" icon="Reading" text v-hasPermi="['datacenter:user:supplier:history']" @click="showLog(row)">
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
      <el-form-item :label="$t('supplier.vendorCode')" prop="vendorCode">
        <el-input
          v-model="dialogVisible.form.vendorCode"
          clearable
          :disabled="dialogVisible.title === $t('btn.edit')"
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('supplier.vendorCode')" prop="vendorName">
        <el-input v-model="dialogVisible.form.vendorName" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('hour.desc')" prop="vendorDesc">
        <el-input v-model="dialogVisible.form.vendorDesc" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('supplier.phone')" prop="vendorTel">
        <el-input v-model="dialogVisible.form.vendorTel" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('supplier.email')" prop="vendorEmail">
        <el-input v-model="dialogVisible.form.vendorEmail" clearable :placeholder="$t('common.inputTip')" />
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
      <el-table-column property="ID" label="ID" fixed="left" />
      <el-table-column property="VENDOR_CODE" :label="$t('supplier.vendorCode')" width="100" />
      <el-table-column property="VENDOR_NAME" :label="$t('supplier.vendorName')" />
      <el-table-column property="VENDOR_DESC" :label="$t('hour.desc')" />
      <el-table-column property="ERP_ID" :label="$t('supplier.ERP_ID')" />
      <el-table-column property="VENDOR_TEL" :label="$t('supplier.phone')" />
      <el-table-column property="VENDOR_CONTACT" :label="$t('supplier.VENDOR_CONTACT')" width="180" />
      <el-table-column property="VENDOR_EMAIL" :label="$t('supplier.email')" />
      <el-table-column property="VENDOR_NAME_ABBR" :label="$t('supplier.VENDOR_NAME_ABBR')" width="190" />
      <el-table-column property="VLEVEL" :label="$t('supplier.VLEVEL')" />
      <el-table-column property="VENDOR_ABB" :label="$t('supplier.VENDOR_ABB')" width="140" />
      <el-table-column property="VENDOR_GROUP" :label="$t('supplier.VENDOR_GROUP')" width="150" />
      <el-table-column property="VENDOR_DESC2" :label="$t('supplier.VENDOR_DESC2')" width="150" />
      <el-table-column property="VENDOR_TEL2" :label="$t('supplier.VENDOR_TEL2')" width="130" />
      <el-table-column property="FACTORY_ID" :label="$t('supplier.FACTORY_ID')" width="120" />
      <el-table-column property="SHIP_LIST" :label="$t('supplier.SHIP_LIST')" width="100" />
      <el-table-column property="UPDATE_EMPNO" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="UPDATE_TIME" :label="$t('common.updateTime')" width="160" />
      <el-table-column property="CREATE_EMPNO" :label="$t('common.createEmpno')" width="100" />
      <el-table-column property="CREATE_TIME" :label="$t('common.createTime')" width="160" />
      <el-table-column property="ENABLED" :label="$t('common.isEnable')">
        <template #default="{ row }">
          <el-tag v-if="row.ENABLED === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="SITE" :label="$t('site.site')" />
    </el-table>
  </el-dialog>
</template>

<script setup name="supplier">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getToken } from '@/utils/auth'
import { getSupplierData, addSupplierData, editSupplierData, getSupplierLog } from '@/api/datacenter/user/supplier'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('supplier.vendorCode'), prop: 'vendorCode', visible: true, width: 120, sortable: true },
  { key: 2, label: proxy.$t('supplier.vendorName'), prop: 'vendorName', visible: true, width: 120, sortable: true },
  { key: 3, label: proxy.$t('hour.desc'), prop: 'vendorDesc', visible: true, sortable: true },
  { key: 4, label: proxy.$t('supplier.phone'), prop: 'vendorTel', visible: true, sortable: true },
  { key: 5, label: proxy.$t('supplier.email'), prop: 'vendorEmail', visible: true, sortable: true, width: 140 },
  { key: 7, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, width: 120, sortable: true },
  { key: 8, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 180 },
  { key: 9, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 10, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 160 }
])

// 筛选条件
const options = [{ label: proxy.$t('supplier.vendorName'), prop: 'vendorName' }]

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
    const res = await getSupplierData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
    tableData.value = res.result
    total.value = res.totalNum
  } finally {
    loading.value = false
  }
}
getTableData()

// 启用/禁用
const changeEnabled = async (row) => {
  const flag = row.enabled === 'Y' ? 'N' : 'Y'
  const res = await editSupplierData({ id: row.id, enabled: flag })
  if (res.data.includes('成功')) {
    row.enabled = flag
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
    vendorCode: '',
    vendorName: '',
    vendorDesc: '',
    vendorTel: '',
    vendorEmail: ''
  },
  rules: {
    vendorCode: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    vendorName: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
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
    dialogVisible.title = `${proxy.$t('btn.edit')}`
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
        res = await addSupplierData(dialogVisible.form)
      } else {
        res = await editSupplierData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res.data.includes('成功')) {
        proxy.$modal.msgSuccess(res.data)
        dialogVisible.open = false
        getTableData()
      } else if (res.data.includes('已存在')) {
        proxy.$modal.msgWarning(res.data)
      } else {
        proxy.$modal.msgError(res.data)
      }
    } finally {
      dialogVisible.btnLoading = false
    }
  })
}

// log 弹窗
const logDialogVisible = reactive({
  open: false,
  title: '',
  loading: false,
  tableData: []
})
// 查看历史记录
const showLog = async ({ id, vendorCode }) => {
  logDialogVisible.title = `${vendorCode} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getSupplierLog({ id })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/MntnVendorMntnCustomer/VendorMntnCustomer/VendorExport', { pageSize: total.value })
}

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/MntnVendorMntnCustomer/VendorMntnCustomer/VendorImportData'
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
