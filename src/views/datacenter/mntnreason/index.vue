<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item :label="$t('mntnreason.reasonCode')" prop="reasonCode" >
        <el-input v-model="queryParams.reasonCode" placeholder="请输入不良原因代码" clearable @keyup.enter="handleQuery" style="width: 120px"/>
      </el-form-item>
      <el-form-item :label="$t('mntnreason.reasonDesc')" prop="reasonDesc">
        <el-input v-model="queryParams.reasonDesc" placeholder="请输入不良原因描述" clearable @keyup.enter="handleQuery" style="width: 120px"/>
      </el-form-item>
      <el-form-item :label="$t('general.enabled')" prop="enabled">
        <el-select v-model="queryParams.enabled" placeholder="状态" style="width: 100px">
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
        <el-button type="primary" plain icon="plus" @click="handleAdd" v-hasPermi="['datacenter:mntnreason:add']">{{ $t('btn.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="edit" :disabled="single" @click="handleUpdate" v-hasPermi="['datacenter:mntnreason:update']">
          {{ $t('btn.edit') }}
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="delete" title="停用" :disabled="multiple" @click="handleDelete" v-hasPermi="['datacenter:mntnreason:remove']">
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
      <el-table-column :label="$t('mntnreason.reasonCode')" align="center" prop="reasonCode"  />
      <el-table-column :label="$t('mntnreason.reasonDesc')" align="center" prop="reasonDesc" />
      <el-table-column :label="$t('mntnreason.reasonDesc2')" align="center" prop="reasonDesc2" />
      <el-table-column :label="$t('mntnreason.reasonType')" align="center" prop="reasonType" />
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
      <el-table-column :label="$t('general.Operational')" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button  text size="small"  icon="edit" @click="handleUpdate(scope.row)" v-hasPermi="['datacenter:mntnreason:update']">
            {{ $t('btn.edit') }}
          </el-button>
          <el-button  text size="small" icon="delete"  @click="handleDelete(scope.row)" v-hasPermi="['datacenter:mntnreason:remove']">
            {{ $t('btn.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item :label="$t('mntnreason.reasonCode')" prop="reasonCode">
          <el-input v-model="form.reasonCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntnreason.reasonDesc')" prop="reasonDesc">
          <el-input v-model="form.reasonDesc" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntnreason.reasonDesc2')" prop="reasonDesc2">
          <el-input v-model="form.reasonDesc2" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('mntnreason.reasonType')" prop="reasonType">
          <el-input v-model="form.reasonType" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="mreason">
import { reasonlistPost, reasongetPost, reasonaddPost,reasonupdatePost,reasonupdatestatusPost, reasondefectdelPost,reasonexportPost } from '@/api/datacenter/mntnreason'
const { proxy } = getCurrentInstance()
const loading = ref(true)
const ids = ref([])
const codes = ref([])
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
// 是否显示弹出层
const open = ref(false)
// 状态数据字典
const statusOptions = ref([])
// 查询状态数据字典
const selectstatusOptions = ref([])
// 查询参数
let queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  reasonCode: undefined,
  reasonDesc: undefined,
  enabled: 'Y'
})
// 表单校验

const state = reactive({
  form: {},
  rules: {
    reasonCode: [{ required: true, message: '不良代码不能为空', trigger: 'blur' }]
  }
})
const formRef = ref(null)
const { form, rules } = toRefs(state)
/** 查询列表 */
function getList() {
  loading.value = true
  reasonlistPost(queryParams).then((response) => {
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
    id: null,
    oPTION2: null,
    reasonLevel: null,
    reasonDesc: null,
    reasonDesc2: null,
    parentReasonId: null,
    codeLevel: null,
    updateEmpno: null,
    updateTime: null,
    createEmpno: null,
    createTime: null,
    enabled: null,
    reasonType: null,
    oPTION1: null,
    reasonCode: null,
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
  codes.value=selection.map((item)=>item.reasonCode)
  ids.value = selection.map((item) => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}
/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = proxy.$t('mntnreason.AddData')
}

/** 状态修改  */
function handleStatusChange(row) {
  let text = row.enabled === 'Y' ? '启用' : '停用'
  proxy.$modal
    .confirm('确认要"' + text + '""' + row.reasonCode + '"吗?')
    .then(function () {
      const postIds = {Id:row.id,Enabled:row.enabled}
      return reasonupdatestatusPost(postIds)
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
  reasongetPost(postId).then((response) => {
    form.value = response.data
    open.value = true
    title.value = proxy.$t('mntnreason.UpdateData')
  })
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['formRef'].validate((valid) => {
    if (valid) {
      if (form.value.id != undefined) {
        reasonupdatePost(form.value).then((response) => {
          proxy.$modal.msgSuccess(proxy.$t('mntnreason.UpdateOK'))
          open.value = false
          getList()
        })
      } else {
        reasonaddPost(form.value).then((response) => {       
          proxy.$modal.msgSuccess(proxy.$t('mntnreason.AddOK'))
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
  const logview=row.reasonCode || codes.value
  proxy
    .$confirm('是否确认删除代码为"' + logview + '"的数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(function () {
      return reasondefectdelPost(dpostIds)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
}
/** 导出按钮操作 */
function handleExport() {
  proxy
    .$confirm('是否确认导出数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(async () => {
      await reasonexportPost(queryParams)
    })
}
handleQuery()
</script>