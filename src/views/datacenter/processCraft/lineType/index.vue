<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:processCraft:lineType:add']" @click="addRoEditRoCopyData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:processCraft:lineType:edit']"
        @click="addRoEditRoCopyData('edit', selectData[0])"
        >{{ $t('btn.edit') }}
      </el-button>
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:processCraft:lineType:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:processCraft:lineType:export']" @click="dowloadData">
        {{ $t('btn.export') }}
      </el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:processCraft:lineType:import']" @click="uploadData">
        {{ $t('btn.import') }}
      </el-button>
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
      <el-button
        type="success"
        size="small"
        icon="Edit"
        text
        v-hasPermi="['datacenter:product:lineType:edit']"
        @click="addRoEditRoCopyData('edit', row)">
        {{ $t('btn.edit') }}
      </el-button>
      <el-button
        v-show="row.enabled === 'N'"
        type="danger"
        size="small"
        icon="Delete"
        text
        v-hasPermi="['datacenter:processCraft:lineType:remove']"
        @click="delData(row)">
        {{ $t('btn.delete') }}
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
  <!-- 新增/编辑/更新弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="400" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="120">
      <el-form-item :label="$t('line.lineType')" prop="lineType">
        <el-input v-model="dialogVisible.form.lineType" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('line.lineTypeDesc')" prop="lineTypeDesc">
        <el-input v-model="dialogVisible.form.lineTypeDesc" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('line.lineOnOrOff')" prop="lineOn">
        <el-select v-model="dialogVisible.form.lineOn" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.lineOn" :key="item" :label="item" :value="item" />
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
</template>

<script setup name="linetype">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import { getToken } from '@/utils/auth'
import { getLineData, addLineData, editLineData, delLineData } from '@/api/datacenter/processCraft/lineType'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('line.lineType'), prop: 'lineType', visible: true, sortable: true },
  { key: 2, label: proxy.$t('line.lineTypeDesc'), prop: 'lineTypeDesc', visible: true, sortable: true },
  { key: 3, label: proxy.$t('line.lineOnOrOff'), prop: 'lineOn', visible: true, sortable: true },
  { key: 4, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, sortable: true },
  { key: 5, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 160 },
  { key: 6, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 7, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 140 }
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
    const res = await getLineData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editLineData({ id: row.id, enabled: flag })
  if (res === 1) {
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
    lineType: '',
    lineTypeDesc: '',
    lineOn: ''
  },
  options: {
    lineOn: ['ONLINE', 'OFFLINE']
  },
  rules: {
    lineType: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
  }
})

// 新增/编辑
const addRoEditRoCopyData = (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.id}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      if (i === 'ct' || i === 'human' || i === 'workhours' || i === 'uph') {
        dialogVisible.form[i] = Number(data[i])
      } else {
        dialogVisible.form[i] = data[i]
      }
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
      if (dialogVisible.title.includes(proxy.$t('btn.add'))) {
        res = await addLineData(dialogVisible.form)
      } else {
        res = await editLineData({ id: dialogVisible.id, ...dialogVisible.form })
      }
      if (res === 1) {
        proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
        dialogVisible.open = false
        getTableData()
      } else if (res === 2) {
        proxy.$modal.msgWarning(proxy.$t('common.already'))
      } else {
        proxy.$modal.msgError(proxy.$t('common.operationFail'))
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
  const res = await delLineData({ id: row.id })
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    getTableData()
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/ProcessTechnology/ShowLineExport', { pageSize: total.value })
}

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/prodMnt/ProcessTechnology/LineImportData'
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

<style lang="scss" scoped>
.el-form-item {
  width: 340px;
}
</style>
