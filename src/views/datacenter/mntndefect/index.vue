<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item :label="$t('mntndefect.defectCode')" prop="defectCode">
        <el-input v-model="queryParams.defectCode" placeholder="请输入不良代码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('mntndefect.defectDesc')" prop="defectDesc">
        <el-input v-model="queryParams.defectDesc" placeholder="请输入不良原因" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('general.enabled')" prop="enabled">
        <el-select v-model="queryParams.enabled" placeholder="状态"  style="width:100px">
          <el-option v-for="dict in selectstatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">{{ $t('btn.search') }}</el-button>
        <el-button icon="refresh" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">

        <el-button type="primary" plain icon="plus" @click="handleAdd" v-hasPermi="['datacenter:mntndefect:add']">{{ $t('btn.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">

        <el-button type="success" plain icon="edit" :disabled="single" @click="handleUpdate" v-hasPermi="['datacenter:mntndefect:update']">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">

        <el-button type="danger" plain icon="delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['datacenter:mntndefect:remove']">
          {{ $t('btn.delete') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="download" @click="handleExport" v-hasPermi="['system:post:export']">{{ $t('btn.export') }}</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" sortable />
      <el-table-column :label="$t('mntndefect.defectCode')" align="center" prop="defectCode"  />
      <el-table-column :label="$t('mntndefect.defectDesc')" align="center" prop="defectDesc" />
      <el-table-column :label="$t('mntndefect.defectDesc2')" align="center" prop="defectDesc2" />
      <el-table-column :label="$t('mntndefect.defectType')" align="center" prop="defectType" />
      <el-table-column :label="$t('mntndefect.codeLevel')" align="center" prop="codeLevel" />
      <el-table-column :label="$t('mntndefect.defectLevel')" align="center" prop="defectLevel" />
      <el-table-column :label="$t('mntndefect.parentDefectCode')" align="center" prop="parentDefectCode" />
      <el-table-column :label="$t('mntndefect.stationType')" align="center" prop="stationType" />
      <el-table-column :label="$t('mntndefect.model')" align="center" prop="model" />
      <el-table-column :label="$t('general.enabled')" align="center" key="enabled"  >
            <template #default="scope">
              <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N" active-text="是"
                inactive-text="否" inline-prompt @change="handleStatusChange(scope.row)"></el-switch>
            </template>
      </el-table-column>
      <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmpno" sortable />
      <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="180" sortable>
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmpno" sortable />
      <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="180" sortable>
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('general.Operational')" fixed="right" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button text size="small" icon="edit" @click="handleUpdate(scope.row)" v-hasPermi="['datacenter:mntndefect:update']">
            {{ $t('btn.edit') }}
          </el-button>
          <el-button text size="small" icon="delete" @click="handleDelete(scope.row)" v-hasPermi="['datacenter:mntndefect:remove']">
            {{ $t('btn.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item :label="$t('mntndefect.defectCode')" prop="defectCode">
          <el-input v-model="form.defectCode" placeholder="请输入不良代码" />
        </el-form-item>
        <el-form-item :label="$t('mntndefect.defectDesc')" prop="defectDesc">
          <el-input v-model="form.defectDesc" placeholder="请输入不良描述" />
        </el-form-item>
        <el-form-item :label="$t('mntndefect.defectDesc2')" prop="defectDesc2">
          <el-input v-model="form.defectDesc2" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntndefect.defectType')" prop="defectType">
          <el-input v-model="form.defectType" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntndefect.codeLevel')" prop="codeLevel">
          <el-input v-model="form.codeLevel" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntndefect.defectLevel')" prop="defectLevel">
          <el-input v-model="form.defectLevel" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntndefect.parentDefectCode')" prop="parentDefectCode">
          <el-input v-model="form.parentDefectCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntndefect.stationType')" prop="stationType">
          <el-input v-model="form.stationType" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntndefect.model')" prop="model">
          <el-input v-model="form.model" placeholder="请输入机种" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="mntndefect">
import { defectlistPost, defectgetPost, defectdelPost,defectaddPost, defectupdatePost,defectupdatestatusPost,defectexportPost } from '@/api/datacenter/mntndefect'
const { proxy } = getCurrentInstance()
const loading = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
// 显示搜索条件
const showSearch = ref(true)
// 总条数
const total = ref(0)
// 岗位表格数据
const postList = ref([])
// 弹出层标题
const title = ref('')
const ALL=ref('ALL')
// 是否显示弹出层
const codes = ref([])
const open = ref(false)
// 状态数据字典
const statusOptions = ref([])
// 状态数据字典
const selectstatusOptions = ref([])
// 查询参数
let queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  defectCode: undefined,
  defectDesc: undefined,
  enabled: 'Y'
})
// 表单校验

const state = reactive({
  form: {},
  rules: {
    defectCode: [{ required: true, message: '不良代码不能为空', trigger: 'blur' }],
    defectDesc: [{ required: true, message: '不良描述不能为空', trigger: 'blur' }],
  }
})
const formRef = ref(null)
const { form, rules } = toRefs(state)
/** 查询岗位列表 */
function getList() {
  loading.value = true
  defectlistPost(queryParams).then((response) => {
    postList.value = response.data.result
    total.value = response.data.totalNum
    loading.value = false
  })
}

function cancel() {
  open.value = false
  reset()
}
// 表单重置
function reset() {
  form.value = {
    postId: undefined,
    postCode: undefined,
    postName: undefined,
    postSort: 0,
    status: '0',
    remark: undefined
  }
  proxy.resetForm('formRef')
}
proxy.getDicts('status').then((response) => {
  statusOptions.value = response.data
})
proxy.getDicts('selectstatus').then((response) => {
  selectstatusOptions.value = response.data
})
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryForm')
  handleQuery()
}
// 多选框选中数据
function handleSelectionChange(selection) {
  console.log(selection)
  codes.value=selection.map((item)=>item.defectCode)
  ids.value = selection.map((item) => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}
/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = proxy.$t('mntndefect.AddData')
}
/** 状态修改  */
function handleStatusChange(row) {
  let text = row.enabled === 'Y' ? '启用' : '停用'
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.defectCode + '"吗?')
    .then(function () {
      const postIds = {Id:row.id,Enabled:row.enabled}
      return defectupdatestatusPost(postIds)
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功')
    })
    .catch(function () {
      row.enabled = row.enabled == 'Y' ? 'N' : 'Y'
    })
}
/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const postId = {id:row.id || ids.value[0]}
  defectgetPost(postId).then((response) => {
    form.value = response.data
    open.value = true
    title.value = proxy.$t('mntndefect.UpdateData')
  })
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        defectupdatePost(form.value).then((response) => {
          proxy.$modal.msgSuccess(proxy.$t('mntndefect.UpdateOK'))
          open.value = false
          getList()
        })
      } else {
        defectaddPost(form.value).then((response) => {
          proxy.$modal.msgSuccess(proxy.$t('mntndefect.AddOK'))
          open.value = false
          getList()
        })
      }
    }
  })
}
/** 删除按钮操作 */
function handleDelete(row) {
  const dpostIds = row.id || ids.value
  const logview=row.defectCode || codes.value
  console.log(codes)
  console.log(row.defectCode)
  proxy
    .$confirm('是否确认删除代码为"' + logview + '"的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(function () {
      return defectdelPost(dpostIds)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
}
/** 导出按钮操作 */
function handleExport() {
  proxy
    .$confirm('是否确认导出所有岗位数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      await defectexportPost(queryParams)
    })
}
handleQuery()
</script>
