<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:user:userInfo:add']" @click="addRoEditData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:user:userInfo:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
      <el-button
        type="danger"
        plain
        icon="Delete"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:user:userInfo:remove']"
        @click="delData(selectData[0])"
        >{{ $t('btn.delete') }}</el-button
      >
    </template>
    <!-- 班别 -->
    <template #shiftName="{ row }">
      <el-tag v-if="row.shiftName === 'D'"> {{ $t('user.dayClass') }} </el-tag>
      <el-tag v-if="row.shiftName === 'N'" type="info"> {{ $t('user.nightClass') }} </el-tag>
      <el-tag v-if="row.shiftName === 'S'" type="warning"> {{ $t('user.specialClass') }} </el-tag>
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
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:user:userInfo:edit']" @click="addRoEditData('edit', row)">{{
        $t('btn.edit')
      }}</el-button>
      <el-button
        type="danger"
        size="small"
        icon="Delete"
        text
        v-show="row.enabled === 'N'"
        v-hasPermi="['datacenter:user:userInfo:remove']"
        @click="delData(row)">
        {{ $t('btn.delete') }}
      </el-button>
      <el-dropdown
        @command="(command) => handleCommand(command, row)"
        v-hasPermi="[
          'datacenter:user:userInfo:bindingRole',
          'datacenter:user:userInfo:resetPwd',
          'datacenter:user:userInfo:history',
          'datacenter:user:userInfo:perCopy'
        ]">
        <el-button type="primary" size="small" icon="MoreFilled" text> </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="绑定角色" icon="UserFilled">{{ $t('user.bindRole') }}</el-dropdown-item>
            <el-dropdown-item command="重置密码" icon="Refresh">{{ $t('user.resetPass') }}</el-dropdown-item>
            <el-dropdown-item command="日志" icon="Reading">{{ $t('btn.log') }}</el-dropdown-item>
            <el-dropdown-item command="权限拷贝" icon="CopyDocument">{{ $t('user.authCopy') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
  <!-- 新增/编辑 -->
  <el-dialog v-model="dialogVisible.open" :title="dialogVisible.title" width="400" draggable>
    <el-form ref="dialogFormRef" :model="dialogVisible.form" :rules="dialogVisible.rules" label-width="80">
      <el-form-item :label="$t('user.site')" prop="site">
        <el-select v-model="dialogVisible.form.site" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.site" :key="item.SITE" :label="item.SITE" :value="item.SITE" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.empNo')" prop="empNo">
        <el-input
          v-model="dialogVisible.form.empNo"
          :disabled="dialogVisible.title.includes($t('btn.edit'))"
          clearable
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('user.empName')" prop="empName">
        <el-input v-model="dialogVisible.form.empName" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('user.email')" prop="option1">
        <el-input v-model="dialogVisible.form.option1" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('user.deptName')" prop="deptName">
        <el-select v-model="dialogVisible.form.deptName" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.deptName" :key="item.DEPT_NAME" :label="item.DEPT_NAME" :value="item.DEPT_NAME" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.shiftName')" prop="shiftName">
        <el-select v-model="dialogVisible.form.shiftName" filterable clearable :placeholder="$t('common.selectTip')">
          <el-option v-for="item in dialogVisible.options.shiftName" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.auth')" prop="option2">
        <el-input v-model="dialogVisible.form.option2" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('user.remark')" prop="remark">
        <el-input v-model="dialogVisible.form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" :placeholder="$t('common.inputTip')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" @click="dialogConfirm(dialogFormRef)">{{ $t('btn.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 绑定角色 -->
  <el-dialog v-model="bindRoleDialogVisible.open" :title="bindRoleDialogVisible.title" top="5vh" width="1000" draggable>
    <div class="dialog-emp">
      <label>{{ $t('role.roleName') }}</label>
      <el-input v-model="bindRoleDialogVisible.textData" clearable :placeholder="$t('common.inputTip')" style="width: 200px" @input="textInput" />
    </div>
    <el-table
      ref="roleTableRef"
      :data="bindRoleDialogVisible.tableData"
      v-loading="bindRoleDialogVisible.loading"
      max-height="500"
      @selection-change="roleSelectChange">
      <el-table-column type="selection" width="55" />
      <el-table-column property="id" label="ID" fixed="left" width="100" />
      <el-table-column property="roleName" :label="$t('role.roleName')" width="120" />
      <el-table-column property="roleDesc" :label="$t('role.roleDesc')" />
      <el-table-column property="updateEmpno" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="updateTime" :label="$t('common.updateTime')" width="160" />
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="bindRoleDialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="bindRoleDialogVisible.btnLoading" @click="bindRoleDialogConfirm">
          {{ $t('btn.submit') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 日志 -->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1000" draggable>
    <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading" max-height="500">
      <el-table-column property="ID" label="ID" fixed="left" width="100" />
      <el-table-column property="EMP_NO" :label="$t('user.empNo')" width="100" />
      <el-table-column property="EMP_NAME" :label="$t('user.empName')" />
      <el-table-column property="PASSWD" label="PASSWD" width="100" />
      <el-table-column property="SHIFT_NAME" :label="$t('user.shiftName')" />
      <el-table-column property="SITE" :label="$t('user.site')" />
      <el-table-column property="DEPT_NAME" :label="$t('user.deptName')" />
      <el-table-column property="CHANGE_PW_TIME" label="CHANGE_PW_TIME" width="200" />
      <el-table-column property="REMARK" :label="$t('user.remark')" />
      <el-table-column property="ENABLED" :label="$t('common.isEnable')">
        <template #default="{ row }">
          <el-tag v-if="row.ENABLED === 'Y'" type="success">{{ $t('common.enable') }}</el-tag>
          <el-tag v-else type="danger">{{ $t('common.disenable') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column property="UPDATE_EMPNO" :label="$t('common.updateEmpno')" width="100" />
      <el-table-column property="UPDATE_TIME" :label="$t('common.updateTime')" width="160" />
      <el-table-column property="CREATE_EMPNO" :label="$t('common.createEmpno')" width="100" />
      <el-table-column property="CREATE_TIME" :label="$t('common.createTime')" width="160" />
      <el-table-column property="OPTION1" :label="$t('user.email')" />
      <el-table-column property="OPTION2" :label="$t('user.auth')" />
      <el-table-column property="OPTION3" label="OPTION3" width="100" />
      <el-table-column property="OPTION4" label="OPTION4" width="100" />
      <el-table-column property="OPTION5" label="OPTION5" width="100" />
    </el-table>
  </el-dialog>
  <!-- 权限拷贝 -->
  <el-dialog v-model="copyDialogVisible.open" :title="copyDialogVisible.title" width="500" draggable>
    <el-descriptions title="用户信息" direction="vertical" :column="3" border>
      <el-descriptions-item label="ID">{{ copyDialogVisible.info.id }}</el-descriptions-item>
      <el-descriptions-item :label="$t('user.empNo')">{{ copyDialogVisible.info.empNo }}</el-descriptions-item>
      <el-descriptions-item :label="$t('user.empName')" :span="2">{{ copyDialogVisible.info.empName }}</el-descriptions-item>
    </el-descriptions>
    <div class="dialog-emp">
      <label>{{ $t('user.opEmpNo') }}</label>
      <el-input v-model="copyDialogVisible.empNo" clearable :placeholder="$t('common.inputTip')" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="copyDialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="copyDialogVisible.btnLoading" @click="copyDialogConfirm">
          {{ $t('btn.submit') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="userInfo">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import {
  getUserInfoData,
  addUserInfoData,
  editUserInfoData,
  delUserInfoData,
  getUserInfoRoleData,
  bindUserInfoRole,
  getUserInfoLog,
  copyUserInfoAuthData,
  getUserInfoFactoryData,
  getUserInfoDeptData,
  axiosCancel
} from '@/api/datacenter/user/userInfo'
import { useDebounceFn } from '@vueuse/core'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('user.empName'), prop: 'empName', visible: true, sortable: true, width: 120 },
  { key: 2, label: proxy.$t('user.empNo'), prop: 'empNo', visible: true, sortable: true, width: 100 },
  { key: 3, label: proxy.$t('user.shiftName'), prop: 'shiftName', visible: true, sortable: true },
  { key: 4, label: proxy.$t('user.deptName'), prop: 'deptName', visible: true, sortable: true, width: 140 },
  { key: 5, label: proxy.$t('user.site'), prop: 'site', visible: true, sortable: true },
  { key: 6, label: proxy.$t('user.email'), prop: 'option1', visible: true, sortable: true },
  { key: 7, label: proxy.$t('user.remark'), prop: 'remark', visible: true, sortable: true },
  { key: 8, label: proxy.$t('user.auth'), prop: 'option2', visible: true, sortable: true, width: 120 },
  { key: 9, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, sortable: true, width: 100 },
  { key: 10, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 160 },
  { key: 11, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 12, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 140 }
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
    const res = await getUserInfoData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editUserInfoData({ id: row.id, enabled: flag, status: 0 })
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

// 自定义校验
const validateEmpNo = (_, value, callback) => {
  const pattern = /^[A-Za-z0-9]+$/
  if (value === '') {
    callback(new Error(proxy.$t('common.inputTip')))
  } else if (!pattern.test(value)) {
    callback(new Error(proxy.$t('common.noRules')))
  } else {
    callback()
  }
}

// 弹窗
const dialogFormRef = ref()
const dialogVisible = reactive({
  id: '',
  title: '',
  open: false,
  btnLoading: false,
  form: {
    site: '',
    empNo: '',
    empName: '',
    option1: '',
    deptName: '',
    shiftName: '',
    option2: '',
    remark: ''
  },
  options: {
    site: [],
    deptName: [],
    shiftName: [
      {
        label: proxy.$t('user.dayClass'),
        value: 'D'
      },
      {
        label: proxy.$t('user.nightClass'),
        value: 'N'
      },
      {
        label: proxy.$t('user.specialClass'),
        value: 'S'
      }
    ]
  },
  rules: {
    site: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }],
    empNo: [{ validator: validateEmpNo, trigger: 'blur' }],
    deptName: [{ required: true, message: proxy.$t('common.selectTip'), trigger: 'change' }]
  }
})

// 获取厂区
const getFactory = async () => {
  const res = await getUserInfoFactoryData()
  dialogVisible.options.site = res
  if (res.length && dialogVisible.title === proxy.$t('btn.add')) dialogVisible.form.site = res[0].SITE
}

// 获取部门
const getDept = async () => {
  const res = await getUserInfoDeptData({ site: dialogVisible.form.site })
  dialogVisible.options.deptName = res
}
watch(
  () => dialogVisible.form.site,
  (newValue) => {
    if (!newValue) return
    getDept()
  }
)

// 新增/编辑
const addRoEditData = (type, data) => {
  if (type === 'add') {
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = ''
    }
    dialogVisible.title = proxy.$t('btn.add')
  } else {
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.empNo}`
    dialogVisible.id = data.id
    for (let i in dialogVisible.form) {
      dialogVisible.form[i] = data[i]
    }
  }
  dialogVisible.open = true
  getFactory()
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
        res = await addUserInfoData(dialogVisible.form)
      } else {
        res = await editUserInfoData({ id: dialogVisible.id, ...dialogVisible.form, status: 0 })
      }
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
  const res = await delUserInfoData({ id: row.id })
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    getTableData()
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}

// 绑定角色
const roleTableRef = ref()
const bindRoleDialogVisible = reactive({
  id: '',
  empNo: '',
  open: false,
  title: '',
  loading: false,
  btnLoading: false,
  textData: '',
  tableData: [],
  selectData: []
})

// 获取角色列表
const getRoleData = async () => {
  axiosCancel()
  bindRoleDialogVisible.loading = true
  try {
    const res = await getUserInfoRoleData({ id: bindRoleDialogVisible.id, textData: bindRoleDialogVisible.textData })
    bindRoleDialogVisible.tableData = res
    nextTick(() => {
      // 设置默认选中
      res.forEach((item) => {
        if (item.status === 1) {
          roleTableRef.value.toggleRowSelection(item, undefined)
        }
      })
    })
  } finally {
    bindRoleDialogVisible.loading = false
  }
}

// 打开角色弹窗
const bindRole = async (row) => {
  bindRoleDialogVisible.title = `${row.empNo} ${proxy.$t('user.bindRole')}`
  bindRoleDialogVisible.open = true
  bindRoleDialogVisible.id = row.id
  bindRoleDialogVisible.empNo = row.empNo
  bindRoleDialogVisible.textData = ''
  getRoleData()
}

// 选中角色
const roleSelectChange = (row) => {
  bindRoleDialogVisible.selectData = row
}

// 角色弹窗确定
const bindRoleDialogConfirm = async () => {
  bindRoleDialogVisible.btnLoading = true
  try {
    const res = await bindUserInfoRole({
      id: bindRoleDialogVisible.id,
      empNo: bindRoleDialogVisible.empNo,
      authoritys: bindRoleDialogVisible.selectData.map((item) => item.id).join(',')
    })
    if (res === 0) {
      proxy.$modal.msgError(proxy.$t('common.operationFail'))
    } else {
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
      bindRoleDialogVisible.open = false
    }
  } finally {
    bindRoleDialogVisible.btnLoading = false
  }
}

// 条件筛选角色
const textInput = useDebounceFn(() => {
  getRoleData()
}, 500)

// 重置密码
const resetPassword = async (row) => {
  const res = await editUserInfoData({ ...row, status: 1 })
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('user.successResetPass'))
  } else {
    proxy.$modal.msgSuccess(proxy.$t('user.failResetPass'))
  }
}

// 日志
const logDialogVisible = reactive({
  open: false,
  title: '',
  loading: false,
  tableData: []
})

// 打开日志弹窗
const showLog = async ({ empNo }) => {
  logDialogVisible.title = `${empNo} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getUserInfoLog({ empNo })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 权限拷贝
const copyDialogVisible = reactive({
  open: false,
  title: '',
  btnLoading: false,
  info: {
    id: '',
    empNo: '',
    empName: ''
  },
  empNo: ''
})

// 打开权限拷贝弹窗
const permissionCopy = (row) => {
  copyDialogVisible.title = `${row.empNo} ${proxy.$t('user.authCopy')}`
  copyDialogVisible.empNo = ''
  copyDialogVisible.open = true
  for (let i in copyDialogVisible.info) {
    copyDialogVisible.info[i] = row[i]
  }
}

// 权限拷贝弹窗确定
const copyDialogConfirm = async () => {
  copyDialogVisible.btnLoading = true
  try {
    const res = await copyUserInfoAuthData({ id: copyDialogVisible.info.id, empNo: copyDialogVisible.empNo })
    if (res === 1) {
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
      copyDialogVisible.empNo = ''
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail'))
    }
  } finally {
    copyDialogVisible.btnLoading = false
  }
}

// 点击表格列的...按钮
const handleCommand = (type, row) => {
  if (type === '绑定角色') {
    bindRole(row)
  }
  if (type === '重置密码') {
    resetPassword(row)
  }
  if (type === '日志') {
    showLog(row)
  }
  if (type === '权限拷贝') {
    permissionCopy(row)
  }
}
</script>

<style lang="scss" scoped>
.dialog-emp {
  display: flex;
  align-items: center;
  margin: 20px 0 10px 0;

  label {
    width: 120px;
    font-weight: bold;
  }
}
</style>
