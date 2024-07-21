<template>
  <!-- 表单 -->
  <el-form ref="form" :inline="true" :model="formData" v-show="showSearch">
    <el-form-item :label="$t('line.lineName')" prop="line">
      <el-select v-model="formData.line" filterable clearable :placeholder="$t('common.selectTip')">
        <el-option v-for="item in options.line" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('site.siteType')" prop="stationType">
      <el-select v-model="formData.stationType" filterable clearable :placeholder="$t('common.selectTip')">
        <el-option v-for="item in options.stationType" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('site.workstation')" prop="stationName">
      <el-select v-model="formData.stationName" filterable clearable :placeholder="$t('common.selectTip')">
        <el-option v-for="item in options.stationName" :key="item" :label="item" :value="item" />
      </el-select>
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
      <el-button
        type="success"
        plain
        icon="Edit"
        v-hasPermi="['datacenter:rests:number:edit']"
        :disabled="selectData.length != 1"
        @click="edit(selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
    </template>
    <!-- 启用 -->
    <template #enabled="{ row }">
      <el-tag v-if="row.enabled === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
      <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
    </template>
    <!-- 操作 -->
    <template #operation="{ row }">
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:rests:number:edit']" @click="edit(row)">{{
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
  <!-- 编辑弹窗 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="400" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="100">
      <el-form-item :label="$t('site.maxQty')" prop="maxQty">
        <el-input-number v-model="dialogVisible.form.maxQty" :min="1" :max="10" />
      </el-form-item>
      <el-form-item :label="$t('site.failQty')" prop="fallQty">
        <el-input-number v-model="dialogVisible.form.fallQty" :min="1" :max="10" />
      </el-form-item>
      <el-form-item :label="$t('site.passQty')" prop="passQty">
        <el-input-number v-model="dialogVisible.form.passQty" :min="1" :max="10" />
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

<script setup name="number">
import ITable from '@/components/ITable'
import { getLineData, getSiteData, geWorkstationData, getData, editData } from '@/api/datacenter/rests/number'
import mitt from '@/utils/mitt'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: 'ID', prop: 'id', visible: true, sortable: true },
  { key: 2, label: proxy.$t('site.stationId'), prop: 'stationId', visible: true, width: 140, sortable: true },
  { key: 3, label: proxy.$t('site.stationName'), prop: 'stationName', visible: true, width: 200, sortable: true },
  { key: 4, label: proxy.$t('site.stationType'), prop: 'stationType', visible: true, width: 160, sortable: true },
  { key: 5, label: proxy.$t('line.lineName'), prop: 'line', visible: true, width: 100, sortable: true },
  { key: 6, label: proxy.$t('site.stage'), prop: 'stage', visible: true, width: 100, sortable: true },
  { key: 7, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', width: 100, visible: true },
  { key: 8, label: proxy.$t('common.updateTime'), prop: 'updateTime', width: 180, visible: true },
  { key: 9, label: proxy.$t('common.createEmpno'), prop: 'createEmpno', width: 100, visible: true },
  { key: 10, label: proxy.$t('common.createTime'), prop: 'createTime', width: 180, visible: true },
  { key: 11, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true },
  { key: 12, label: proxy.$t('site.job'), prop: 'job', visible: true },
  { key: 13, label: proxy.$t('site.jobVersion'), prop: 'jobVersion', width: 130, visible: true },
  { key: 14, label: proxy.$t('site.maxQty'), prop: 'maxQty', width: 100, visible: true },
  { key: 15, label: proxy.$t('site.failQty'), prop: 'fallQty', width: 100, visible: true },
  { key: 16, label: proxy.$t('site.passQty'), prop: 'passQty', width: 100, visible: true },
  { key: 17, label: proxy.$t('site.site'), prop: 'site', visible: true },
  { key: 18, type: 'operation', label: proxy.$t('common.operation'), width: 100, fixed: 'right' }
])

// 显隐表单
const showSearch = ref(true)
watch(showSearch.value, (val) => {
  mitt.emit('domHeightChange', val ? 0 : 50)
})

// 加载状态
const loading = ref(false)

// 表单
const form = ref()
const formData = reactive({
  line: '',
  stationType: '',
  stationName: ''
})

// 下拉框数据
const options = reactive({
  line: [],
  stationType: [],
  stationName: []
})

// 获取线别数据
const getLineList = async () => {
  const res = await getLineData()
  options.line = res
}
getLineList()

// 监听线别变化获取站点类型数据
watch(
  () => formData.line,
  async (val) => {
    if (!val) {
      formData.stationType = ''
      formData.stationName = ''
      options.stationType = []
      options.stationName = []
    } else {
      const res = await getSiteData({ line: val })
      options.stationType = res
    }
  }
)

// 监听站点类型变化获取工作站数据
watch(
  () => formData.stationType,
  async (val) => {
    if (!val) {
      formData.stationName = ''
      options.stationName = []
    } else {
      const res = await geWorkstationData({ line: formData.line, stationType: val })
      options.stationName = res
    }
  }
)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 改变条数
watch(pageSize, () => getTableData())

// 改变页码
watch(currentPage, () => getTableData())

// 搜索
const search = () => {
  getTableData()
}

// 获取表格数据
const tableData = ref([])
const getTableData = async () => {
  loading.value = true
  try {
    const res = await getData({ ...formData, pageNum: currentPage.value, pageSize: pageSize.value })
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
    maxQty: 1,
    fallQty: 1,
    passQty: 1
  }
})

// 编辑
const edit = (data) => {
  dialogVisible.title = `${proxy.$t('btn.edit')} ${data.stationName}`
  dialogVisible.id = data.id
  for (let i in dialogVisible.form) {
    dialogVisible.form[i] = data[i]
  }
  dialogVisible.open = true
}

// 弹窗确定
const dialogConfirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (!valid) return
    try {
      dialogVisible.btnLoading = true
      const res = await editData({ id: dialogVisible.id, ...dialogVisible.form })
      if (res === 1) {
        proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
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
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 260px;
}
</style>
