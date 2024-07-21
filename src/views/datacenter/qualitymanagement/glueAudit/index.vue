<script setup name="glueaudit">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import {
  getModelData,
  addModelData,
  editModelData,
  delModelData,
  editDescriptionData, lineList, auditingCallPartExamine,
} from '@/api/datacenter/qualitymanagement/glueAudit'
import {ElMessageBox} from 'element-plus'
import {getToken} from '@/utils/auth'
import TableDialog from "@/views/datacenter/qualitymanagement/glueAudit/components/tableDialog.vue";

const {proxy} = getCurrentInstance()

// 表格配置项
const columns = reactive([
  {key: 1, label: proxy.$t('类型'), prop: 'partType', visible: true, sortable: true},
  {key: 2, label: proxy.$t('料号'), prop: 'ipn', visible: true, sortable: true},
  {key: 3, label: proxy.$t('数量'), prop: 'qty', visible: true, sortable: true},
  {key: 4, label: proxy.$t('线别'), prop: 'line', visible: true, sortable: true},
  {key: 5, label: proxy.$t('班别'), prop: 'shiftType', visible: true, sortable: true},
  {key: 6, label: proxy.$t('维护人员'), prop: 'createEmp', visible: true, fixed: 'right'},
  {key: 7, label: proxy.$t('维护时间'), prop: 'createTime', visible: true, fixed: 'right'},
  {key: 8, label: proxy.$t('领用时间'), prop: 'option1', visible: true, fixed: 'right'},
  {key: 9, label: proxy.$t('工单'), prop: 'option3', visible: true, fixed: 'right'},
  {key: 9, label: proxy.$t('是否审核'), prop: 'option2', visible: true, fixed: 'right'},
  {key: 9, label: proxy.$t('审核时间'), prop: 'option4', visible: true, fixed: 'right'},
  {key: 10, type: 'operation', label: proxy.$t('common.operation'), width: 260, fixed: 'right'},
  {key: 0, type: 'selection', fixed: 'left'},
])
const typeOption = ref([
  {
    id: 'Solder',
    name: '锡膏'
  },
  {
    id: 'Glue',
    name: '胶水'
  },
])
// 筛选条件
const options = reactive([])
columns.forEach((item, index) => {
  if (item.label) {
    options.push({
      label: item.label,
      prop: item.prop
    })
  }
})
options.splice(options.length - 2)

// 显隐表单
const showSearch = ref(true)

// 加载状态
const loading = ref(false)

// 表单项
const formData = reactive({
  optionData: '',
  textData: '',
  enaBled: 'Y',
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 改变条数
watch(pageSize, () => getTableData())

// 改变页码
watch(currentPage, () => getTableData())

onMounted(() => search())
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
    const res = await getModelData({...formData, pageNum: currentPage.value, pageSize: pageSize.value})
    tableData.value = res.result
    total.value = res.totalNum
  } finally {
    loading.value = false
  }
}

// 预设
const changeEnabled = async (row) => {
  const res = await editDescriptionData(row.samplingRuleid)
  if (res === 1) {
    getTableData()
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
    partType: '',//类型
    ipn: '',//料号
    qty: '',//数量
    line: '',//线别
    shiftType: '',//班别
    option1: '',//领用时间
    option3: '',//工单
  },

  // rules: {
  //   samplingType: [{required: true, message: proxy.$t('common.inputTip'), trigger: 'blur'}],
  //   samplingDesc: [{required: true, message: proxy.$t('common.inputTip'), trigger: 'blur'}]
  // }
})
const changePartType = () => {
  dialogVisible.form.ipn = ''
}
// 最多选择60天区间以内
const disabledDateFun = (time) => {
  // console.log(time) // time 为new Date()类型
  const secondNum = 60 * 60 * 24 * 60 * 1000 //上下波动60天
  const dayNum = 12 * 60 * 1000 //上下波动60天
  if (time.getTime() < new Date().getTime()) {
    return time.getTime() - dayNum < new Date().getTime() //时间范围必须大于今天
  } else {
    return time.getTime() - dayNum < Date.now() - secondNum
  }
}
// 新增修改线别数据
const lineOption = ref()
// 新增/编辑
const addRoEditData = async (type, data) => {

  const res = await lineList()
  lineOption.value = res
  if (type === 'add') {
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    if (data.option2 === 'Y') {
      return proxy.$modal.msgWarning(proxy.$t('审核状态下，不主持此操作'))
    }
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.id}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
}

// 弹窗取消
const dialogCancel = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
  dialogVisible.open = false
}

// 弹窗确定
const dialogConfirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (!valid) return
    let res
    try {
      dialogVisible.btnLoading = true
      if (dialogVisible.form.partType === 'Solder') {
        dialogVisible.form.partType = '锡膏'
      } else {
        dialogVisible.form.partType = '胶水'
      }
      if (dialogVisible.title === proxy.$t('btn.add')) {
        res = await addModelData(dialogVisible.form)
      } else {
        res = await editModelData({id: dialogVisible.id, ...dialogVisible.form})
      }
      if (res === 1) {
        proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
        formEl.resetFields()
        dialogVisible.open = false
        getTableData()
      } else {
        proxy.$modal.msgError(proxy.$t('common.operationFail'))
      }
    } finally {
      dialogVisible.btnLoading = false
    }
  })
}
const buttonToggleName = ref('禁用')
const buttonToggleIcon = ref('delete')
const changeButton = () => {
  if (formData.enaBled === 'Y') {
    buttonToggleName.value = '禁用'
    buttonToggleIcon.value = 'delete'
  } else if (formData.enaBled === 'N') {
    buttonToggleName.value = '启用'
    buttonToggleIcon.value = 'Check'
  } else {

  }
}
//审核
const auditData = async (data) => {
  await ElMessageBox.confirm(proxy.$t('审核'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await auditingCallPartExamine({id: data.id})
  if (res === 1) {
    getTableData()
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}
// 启用禁用
const isEnable = async (row) => {
  if (row.option2 === 'Y') {
    return proxy.$modal.msgWarning(proxy.$t('审核状态下，不主持此操作'))
  }
  await ElMessageBox.confirm('确定要' + buttonToggleName.value + '吗？', proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await editDescriptionData({id: String(row.id), enabled: row.enabled === 'N' ? 'Y' : 'N'})
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    getTableData()
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}
// 删除
const delData = async (row) => {
  if (row.enabled === 'Y' && row.option2 === 'Y') {
    return proxy.$modal.msgWarning(proxy.$t('启用或审核状态下，不主持此操作'))
  }
  await ElMessageBox.confirm(proxy.$t('common.isDel'), proxy.$t('common.warning'), {
    confirmButtonText: proxy.$t('btn.submit'),
    cancelButtonText: proxy.$t('btn.cancel'),
    type: 'warning'
  })
  const res = await delModelData({id: String(row.id)})
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
// 新增修改查询弹窗
const logData = ref({})
const showLog = (id, row) => {
  logData.value.row = row
  logData.value.id = id
  logData.value.partType = dialogVisible.form.partType
  logDialogVisible.open = true
  logDialogVisible.loading = true
}

function updateParentValue(newValue, id) {
  logDialogVisible.open = newValue
  logDialogVisible.loading = newValue
  if (logData.value.id === 1) {
    dialogVisible.form.ipn = id
  } else {
    dialogVisible.form.option3 = id
  }
}

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
// 导入
const upload = reactive({
  open: false,
  title: '',
  headers: {Authorization: 'Bearer ' + getToken()},
  url: import.meta.env.VITE_APP_BASE_API + '/ProdMnt/CallPartExamine/InsertCallPartExamine'
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
  const {code, msg, data} = response
  upload.open = false
  upload.isUploading = false
  proxy.$refs['uploadRef'].clearFiles()
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + data.item1 + '</div>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  search()
}

// 提交上传文件
function submitFileForm() {
  proxy.$refs['uploadRef'].submit()
}

// 下载模板
const importTemplate = () => {
  proxy.downFile('/ProdMnt/CallPartExamine/ShowExport', {pageSize: total.value})
}
// 导出
const dowloadData = () => {
  proxy.downFile('/ProdMnt/CallPartExamine/ShowExport', {pageSize: total.value})
}
</script>
<template>
  <!-- 表单 -->
  <!--  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>-->
  <el-form ref="iForm" :inline="true" :model="formData" v-show="showSearch">
    <el-form-item :label="$t('common.filtrate')" prop="optionData" style="width: 250px">
      <el-select v-model="formData.optionData" filterable clearable :placeholder="$t('common.selectTip')">
        <el-option v-for="item in options" :key="item.prop" :label="item.label" :value="item.prop"/>
      </el-select>
    </el-form-item>
    <el-form-item label="" prop="textData">
      <el-input v-model="formData.textData" clearable
                :disabled="textDataDisabled"
                :placeholder="$t('common.inputTip')"/>
    </el-form-item>
    <el-form-item :label="$t('common.isEnable')" prop="enaBled" style="width: 250px;">
      <el-select v-model="formData.enaBled" :placeholder="$t('common.selectTip')" @change="changeButton()">
        <el-option :label="$t('common.all')" value=""/>
        <el-option :label="$t('common.enable')" value="Y"/>
        <el-option :label="$t('common.disenable')" value="N"/>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" :loading="loading" @click="search">{{ $t('btn.search') }}</el-button>
      <el-button icon="Refresh" @click="reset(iForm)">{{ $t('btn.reset') }}</el-button>
    </el-form-item>
  </el-form>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData"
                 :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="success" plain icon="Lock" v-hasPermi="['datacenter:qualitymanagement:glueAudit:audit']"
                 :disabled="selectData.length != 1"
                 @click="auditData(selectData[0])">{{
          $t('审核')
        }}
      </el-button>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:qualitymanagement:glueAudit:add']"
                 @click="addRoEditData('add')">{{
          $t('btn.add')
        }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        v-hasPermi="['datacenter:qualitymanagement:glueAudit:edit']"
        :disabled="selectData.length != 1"
        @click="addRoEditData('edit', selectData[0])"
      >{{ $t('btn.edit') }}
      </el-button>
      <el-button
        type="danger"
        plain
        :icon="buttonToggleIcon"
        v-hasPermi="['datacenter:qualitymanagement:glueAudit:enable']"
        :disabled="selectData.length != 1"
        v-if="formData.enaBled !== ''"
        @click="isEnable(selectData[0])"
      >{{ buttonToggleName }}
      </el-button>
      <el-button
        type="danger"
        plain
        icon="Delete"
        v-hasPermi="['datacenter:qualitymanagement:glueAudit:remove']"
        v-if="formData.enaBled === 'N'"
        :disabled="selectData.length != 1"
        @click="delData(selectData[0])"
      >{{ $t('btn.delete') }}
      </el-button>
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:qualitymanagement:glueAudit:import']"
                 @click="uploadData">{{
          $t('btn.import')
        }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:qualitymanagement:glueAudit:export']"
                 @click="dowloadData">{{
          $t('btn.export')
        }}
      </el-button>
    </template>
    <!-- 启用 -->
    <template #enabled="{ row }">
      <el-switch
        v-model="row.defaultFlag"
        inline-prompt
        :active-text="$t('是')"
        :inactive-text="$t('否')"
        active-value="Y"
        inactive-value="N"
        :before-change="() => changeEnabled(row)"/>
    </template>
    操作
    <template #operation="{ row }">
      <el-button type="success" size="small" icon="Edit" text
                 v-hasPermi="['datacenter:qualitymanagement:glueAudit:edit']"
                 @click="addRoEditData('edit', row)">{{
          $t('btn.edit')
        }}
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-show="row.enaBled === 'N'"
        v-hasPermi="['datacenter:qualitymanagement:glueAudit:remove']"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-button type="primary" size="small" icon="Reading" text
                 v-hasPermi="['datacenter:qualitymanagement:glueAudit:history']"
                 @click="showLog(3,row)">
        {{ $t('查看历史') }}
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
    :total="total"/>
  <div style="width: 100%;height: 50px;"></div>
  <!-- 新增/编辑弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="500" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="120">
      <el-form-item :label="$t('类型')" prop="model">
        <el-select v-model="dialogVisible.form.partType" :placeholder="$t('common.selectTip')"
                   @change="changePartType()">
          <el-option :label="$t(item.name)" :value="item.id" v-for="item in typeOption" :key="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('料号')" prop="model">
        <el-input style="width: 70%;margin-right: 10px;" v-model="dialogVisible.form.ipn" clearable
                  :placeholder="$t('common.inputTip')"/>
        <el-button type="primary" @click="showLog(1)">查询</el-button>
      </el-form-item>
      <el-form-item :label="$t('数量')" prop="model">
        <el-input v-model="dialogVisible.form.qty" clearable :placeholder="$t('common.inputTip')"/>
      </el-form-item>
      <el-form-item :label="$t('线别')" prop="model">
        <el-select v-model="dialogVisible.form.line" :placeholder="$t('common.selectTip')">
          <el-option :label="$t(item.LINE)" :value="item.LINE" v-for="(item,index) in lineOption" :key="index"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('班别')" prop="model">
        <el-select v-model="dialogVisible.form.shiftType" :placeholder="$t('common.selectTip')">
          <el-option :label="$t('白班')" value="白班"/>
          <el-option :label="$t('夜班')" value="夜班"/>
        </el-select>
      </el-form-item>
      <!--      <el-form-item :label="$t('工单')" prop="model">-->
      <!--        <el-input style="width: 70%;margin-right: 10px;" v-model="dialogVisible.form.option3" clearable-->
      <!--                  :placeholder="$t('common.inputTip')"/>-->
      <!--        <el-button type="primary" @click="showLog(2)">查询</el-button>-->
      <!--      </el-form-item>-->
      <el-form-item :label="$t('领用时间')" prop="model">
        <!--        <el-input v-model="dialogVisible.form.option1" clearable :placeholder="$t('common.inputTip')"/>-->
        <el-date-picker
          v-model="dialogVisible.form.option1"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          type="datetime"
          :default-value="new Date()"
          :disabled-date="disabledDateFun"
          placeholder="Select date and time"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogCancel(dialogFormRef)">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" @click="dialogConfirm(dialogFormRef)">
          {{ $t('btn.submit') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!--  &lt;!&ndash; log 弹窗 &ndash;&gt;-->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="80%" draggable destroy-on-close>
    <table-dialog :logData="logData" @update-value="updateParentValue"/>
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
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text" v-html="$t('common.uploadText')"></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span
          >{{ $t('common.uploadTip') }}。<el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            v-hasPermi="['datacenter:qualitymanagement:tableMaintain:download']"
            @click="importTemplate"
          >下载模板</el-link
          ></span
          >
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="upload.open = false">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="submitFileForm">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped></style>


