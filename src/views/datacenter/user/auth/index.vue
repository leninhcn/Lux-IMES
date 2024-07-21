<template>
  <!-- 表单 -->
  <IForm :showSearch="showSearch" :options="options" :loading="loading" @search="search"></IForm>
  <!-- 右侧工具栏 -->
  <right-toolbar v-model:showSearch="showSearch" @queryTable="getTableData" :columns="columns.filter((item) => !item.type)"></right-toolbar>
  <!-- 表格 -->
  <ITable :columns="columns" :tableData="tableData" :loading="loading" :handleSelectionChange="handleSelectionChange">
    <!-- 操纵按钮 -->
    <template #tool-btns>
      <el-button type="primary" plain icon="Plus" v-hasPermi="['datacenter:user:auth:add']" @click="addRoEditData('add')">
        {{ $t('btn.add') }}
      </el-button>
      <el-button
        type="success"
        plain
        icon="Edit"
        :disabled="selectData.length != 1"
        v-hasPermi="['datacenter:user:auth:edit']"
        @click="addRoEditData('edit', selectData[0])"
        >{{ $t('btn.edit') }}</el-button
      >
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
      <el-button type="success" size="small" icon="Edit" text v-hasPermi="['datacenter:user:auth:edit']" @click="addRoEditData('edit', row)">
        {{ $t('btn.edit') }}
      </el-button>
      <el-button type="success" size="small" text v-hasPermi="['datacenter:user:auth:binding']" @click="bindRole(row)">
        {{ $t('role.bindPermission') }}
      </el-button>
      <el-button type="success" size="small" text v-hasPermi="['datacenter:user:auth:bindingReport']" @click="bindReportPermission(row)">
        {{ $t('role.bindReportPermission') }}
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
      <el-form-item :label="$t('role.roleName')" prop="roleName">
        <el-input
          v-model="dialogVisible.form.roleName"
          clearable
          :disabled="dialogVisible.title.includes($t('btn.edit'))"
          :placeholder="$t('common.inputTip')" />
      </el-form-item>
      <el-form-item :label="$t('role.roleDesc')" prop="roleDesc">
        <el-input v-model="dialogVisible.form.roleDesc" :autosize="{ minRows: 2, maxRows: 4 }" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="dialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="dialogVisible.btnLoading" @click="dialogConfirm(dialogFormRef)">{{ $t('btn.submit') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 绑定权限 -->
  <el-dialog v-model="bindRoleDialogVisible.open" :title="bindRoleDialogVisible.title" top="5vh" width="1000" draggable>
    <div style="display: flex">
      <div class="dialog-emp">
        <label>fun</label>
        <el-input v-model="bindRoleDialogVisible.textData" clearable :placeholder="$t('common.inputTip')" style="width: 200px" @input="textInput" />
      </div>
      <div class="dialog-emp">
        <label style="width: 70px">{{ $t('role.roleScope') }}</label>
        <el-select v-model="bindRoleDialogVisible.authoritys" :placeholder="$t('common.selectTip')" style="width: 200px">
          <el-option v-for="item in bindRoleDialogVisible.authoritysList" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
    </div>
    <el-table
      ref="roleTableRef"
      :data="bindRoleDialogVisible.tableData"
      v-loading="bindRoleDialogVisible.loading"
      max-height="500"
      @selection-change="roleSelectChange">
      <el-table-column type="selection" width="55" />
      <el-table-column property="id" label="ID" fixed="left" />
      <el-table-column property="program" label="PROGRAM" width="140" />
      <el-table-column property="function" label="FUNCTION" width="140" />
      <el-table-column property="dllFilename" label="DLL_FILENAME" width="160" />
      <el-table-column property="funIdx" label="FUN_IDX" />
      <el-table-column property="funCn" label="FUN_CN" width="140" />
      <el-table-column :label="$t('common.operation')" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="Reading" text @click="showLog(row)">{{ $t('btn.log') }}</el-button>
        </template>
      </el-table-column>
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
  <!-- log 弹窗 -->
  <el-dialog v-model="logDialogVisible.open" :title="logDialogVisible.title" width="1000" draggable>
    <el-table :data="logDialogVisible.tableData" v-loading="logDialogVisible.loading" max-height="500">
      <el-table-column property="ROLE_ID" label="ROLE_ID" fixed="left" width="100" />
      <el-table-column property="ROLE_NAME" :label="$t('role.roleName')" />
      <el-table-column property="PROGRAM" label="PROGRAM" width="140" />
      <el-table-column property="FUN" label="FUN" width="120" />
      <el-table-column property="AUTHORITYS" label="AUTHORITYS" width="120" />
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
    </el-table>
  </el-dialog>
  <!-- 绑定报表权限 -->
  <el-dialog v-model="bindReportDialogVisible.open" :title="bindReportDialogVisible.title" top="5vh" width="500" draggable>
    <div class="bind-report-main" v-loading="bindReportDialogVisible.loading">
      <el-tree
        ref="treeRef"
        :data="bindReportDialogVisible.treeData"
        highlight-current
        show-checkbox
        node-key="tkey"
        :props="bindReportDialogVisible.defaultProps"
        :default-expanded-keys="['1001']" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button text @click="bindReportDialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="bindReportDialogVisible.btnLoading" @click="bindReportSave">
          {{ $t('btn.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="auth">
import IForm from '@/components/IForm'
import ITable from '@/components/ITable'
import {
  getAuthData,
  addAuthData,
  editAuthData,
  getPermissionList,
  bindPermission,
  getPermissionLog,
  getReportData,
  addReport,
  axiosCancel
} from '@/api/datacenter/user/auth'
import { useDebounceFn } from '@vueuse/core'

const { proxy } = getCurrentInstance()

// 表格配置项
const columns = reactive([
  { key: 0, type: 'selection', fixed: 'left' },
  { key: 1, label: proxy.$t('role.roleName'), prop: 'roleName', visible: true, sortable: true },
  { key: 2, label: proxy.$t('role.roleDesc'), prop: 'roleDesc', visible: true, sortable: true },
  { key: 7, label: proxy.$t('common.updateEmpno'), prop: 'updateEmpno', visible: true, width: 120, sortable: true },
  { key: 8, label: proxy.$t('common.updateTime'), prop: 'updateTime', visible: true, sortable: true, width: 180 },
  { key: 9, label: proxy.$t('common.isEnable'), prop: 'enabled', visible: true, fixed: 'right' },
  { key: 10, type: 'operation', label: proxy.$t('common.operation'), fixed: 'right', width: 220 }
])

// 筛选条件
const options = [
  {
    label: proxy.$t('role.roleName'),
    prop: 'roleName'
  }
]

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
    const res = await getAuthData({ ...formData.value, pageNum: currentPage.value, pageSize: pageSize.value })
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
  const res = await editAuthData({ id: row.id, enabled: flag })
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
    roleName: '',
    roleDesc: ''
  },
  rules: {
    roleName: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }],
    erpSpec: [{ required: true, message: proxy.$t('common.inputTip'), trigger: 'blur' }]
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
    dialogVisible.title = `${proxy.$t('btn.edit')} ${data.roleName}`
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
        res = await addAuthData(dialogVisible.form)
      } else {
        res = await editAuthData({ id: dialogVisible.id, ...dialogVisible.form })
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

// 绑定权限
const roleTableRef = ref()
const bindRoleDialogVisible = reactive({
  id: '',
  roleName: '',
  open: false,
  title: '',
  loading: false,
  btnLoading: false,
  textData: '',
  tableData: [],
  selectData: [],
  authoritys: 'Full Control',
  authoritysList: ['Full Control', 'Allow To Update', 'Read Only', 'Batch Repaire']
})

// 获取权限列表
const getRoleData = async () => {
  axiosCancel()
  bindRoleDialogVisible.loading = true
  try {
    const res = await getPermissionList({ id: bindRoleDialogVisible.id, textData: bindRoleDialogVisible.textData })
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

// 打开权限弹窗
const bindRole = async (row) => {
  bindRoleDialogVisible.title = `${row.roleName} ${proxy.$t('user.bindRole')}`
  bindRoleDialogVisible.open = true
  bindRoleDialogVisible.id = row.id
  bindRoleDialogVisible.roleName = row.roleName
  bindRoleDialogVisible.textData = ''
  getRoleData()
}

// 选中权限
const roleSelectChange = (row) => {
  bindRoleDialogVisible.selectData = row
}

// 角色弹窗确定
const bindRoleDialogConfirm = async () => {
  bindRoleDialogVisible.btnLoading = true
  try {
    const res = await bindPermission({
      id: bindRoleDialogVisible.id,
      roleName: bindRoleDialogVisible.roleName,
      idStr: bindRoleDialogVisible.selectData.map((item) => item.id).join(','),
      authoritys: bindRoleDialogVisible.authoritys
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

// log 弹窗
const logDialogVisible = reactive({
  open: false,
  title: '',
  loading: false,
  tableData: []
})
// 查看历史记录
const showLog = async (row) => {
  logDialogVisible.title = `${row.function} ${proxy.$t('btn.log')}`
  logDialogVisible.open = true
  logDialogVisible.loading = true
  try {
    const res = await getPermissionLog({ id: bindRoleDialogVisible.id, fun: row.function })
    logDialogVisible.tableData = res
  } finally {
    logDialogVisible.loading = false
  }
}

// 数据整理成树型数据
const formatToTree = (ary, pid) => {
  return ary
    .filter((item) =>
      // 如果没有父id（第一次递归的时候）将所有父级查询出来
      // item.tparent === 1000 就是最顶层
      pid === undefined ? item.tparent === '1000' : item.tparent === pid
    )
    .map((item) => {
      // 通过父节点ID查询所有子节点
      item.children = formatToTree(ary, item.tkey)
      item.open = item.tparent === '1000'
      return item
    })
}

// 绑定报表权限
const treeRef = ref()
const bindReportDialogVisible = reactive({
  id: '',
  roleName: '',
  open: false,
  title: '',
  loading: false,
  btnLoading: false,
  treeData: [],
  defaultProps: {
    label: 'ttext',
    children: 'children'
  }
})

// 打开绑定报表权限弹窗
const bindReportPermission = async (row) => {
  bindReportDialogVisible.id = row.id
  bindReportDialogVisible.roleName = row.roleName
  bindReportDialogVisible.title = `${row.roleName} ${proxy.$t('role.bindReportPermission')}`
  bindReportDialogVisible.open = true
  bindReportDialogVisible.loading = true
  const res = await getReportData({ id: row.id })
  bindReportDialogVisible.treeData = formatToTree(res.data.item2)
  // 设置默认选中
  const checkedKeys = await res.data.item2.filter((item) => item.status === 1).map((item) => item.tkey)
  checkedKeys.forEach((v) => {
    nextTick(() => {
      treeRef.value.setChecked(v, true, false)
    })
  })
  bindReportDialogVisible.loading = false
}

// 所有菜单节点数据
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  const checkedKeys = treeRef.value.getCheckedKeys()
  // 半选中的菜单节点
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}

// 绑定报表权限弹窗保存
const bindReportSave = async () => {
  bindReportDialogVisible.btnLoading = true
  try {
    const res = await addReport({
      roleId: bindReportDialogVisible.id,
      roleName: bindReportDialogVisible.roleName,
      idStr: getMenuAllCheckedKeys().join(',')
    })
    if (res.data === 1) {
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
      bindReportDialogVisible.open = false
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail'))
    }
  } finally {
    bindReportDialogVisible.btnLoading = false
  }
}
</script>

<style lang="scss" scoped>
.dialog-emp {
  display: flex;
  align-items: center;
  margin: 20px 20px 10px 0;

  label {
    width: 30px;
    font-weight: bold;
  }
}
</style>
