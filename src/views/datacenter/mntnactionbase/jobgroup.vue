<template>
  <div class="app-container" v-loading="pageLoading" style="display: flex;justify-content: space-between;">
    <div style="width: calc(55% - 5px);">
      <!-- Group -->
      <div class="card-box">
        <el-form :model="queryParamsGroup" ref="queryFormGroup" :inline="true" v-show="showGroupSearch">
          <el-form-item :label="$t('mntnactiongroup.groupName')" prop="groupName">
            <el-input v-model="queryParamsGroup.groupName" placeholder="请输入行为名称" clearable style="width: 200px"
              @keyup.enter="handleQueryGroup" />
          </el-form-item>
          <el-form-item :label="$t('general.enabled')" prop="enabled">
            <el-select v-model="queryParamsGroup.enabled" placeholder="状态" clearable style="width: 100px"
              @change="handleQueryGroup">
              <el-option v-for="dict in enabledOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="search" @click="handleQueryGroup">{{ $t('btn.search') }}</el-button>
            <el-button icon="refresh" @click="resetQueryGroup">{{ $t('btn.reset') }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb2">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="plus" @click="handleAddGroup"
              v-hasPermi="['datacenter:mntnactiongroup:add']">{{ $t('btn.add') }}</el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showGroupSearch" @queryTable="getGroupList"></right-toolbar>
        </el-row>

        <el-table ref="tableGroup" v-loading="groupListLoading" :data="groupList" :height="tableGroupHeight" border
          stripe highlight-current-row @current-change="handleCurrentGroupChange">
          <el-table-column type="index" align="center" width="50" />
          <el-table-column :label="$t('mntnactiongroup.groupName')" align="center" prop="groupName" min-width="180" />
          <el-table-column :label="$t('mntnactiongroup.groupDesc')" align="center" prop="groupDesc" min-width="200" />
          <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80">
            <template #default="scope">
              <div @click.stop>
                <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N"
                  :active-text="$t('common.enable')" :inactive-text="$t('common.disable')" inline-prompt
                  @change="handleGroupEnabledChange(scope.row)"></el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmpno" width="120" sortable />
          <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="160" sortable>
            <template #default="scope">
              <span>{{ parseTime(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmpno" width="120" sortable />
          <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="160" sortable>
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed='right' :label="$t('general.Operational')" align="center" width="150"
            class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button text size="small" icon="edit" @click="handleUpdateGroup(scope.row)"
                v-hasPermi="['datacenter:mntnactiongroup:update']">{{ $t('btn.edit') }}</el-button>
              <el-button text type="danger" size="small" icon="Delete"
                v-hasPermi="['datacenter:mntnactiongroup:remove']" @click="handleDeleteGroup(scope.row)">
                <span>{{ $t('btn.delete') }}</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Group Job -->
      <div class="card-box" style="margin-top: 10px;">
        <el-table ref="tableJob" v-loading="jobListLoading" :data="jobList" row-key="joB_ID" :height="tableJobHeight"
          border :empty-text="queryParamsJob.groupId ? null : $t('mntnactiongroup.JobEmpty')" highlight-current-row
          @current-change="handleCurrentJobChange">
          <el-table-column :label="$t('mntnactiongroup.groupSeq')" align="center" prop="grouP_SEQ" width="60" />
          <el-table-column :label="$t('mntnactiongroup.typeName')" align="center" prop="typE_NAME" min-width="150" />
          <el-table-column :label="$t('mntnactiongroup.jobName')" align="center" prop="joB_NAME" min-width="150" />
          <el-table-column :label="$t('mntnactiongroup.valueKind[1]')" align="center" prop="valuE_KIND" min-width="90">
            <template #default="scope">
              <dict-tag :options="valueKindOptions" :value="scope.row.valuE_KIND" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('mntnactiongroup.transformation[1]')" align="center" prop="valuE_TRANSFORMATION"
            min-width="100">
            <template #default="scope">
              <dict-tag :options="transformationOptions" :value="scope.row.valuE_TRANSFORMATION" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('mntnactiongroup.loopCount[1]')" align="center" prop="looP_COUNT"
            min-width="90" />
        </el-table>
      </div>
    </div>

    <!-- Type List / Job Content -->
    <el-tabs class="card-box" type="border-card" v-model="tabName"
      style="width: calc(45% - 5px);margin-left: 10px;padding: 0;border: none;">
      <el-tab-pane name="job" label="JobContent" style="padding: 10px;">
        <LuxForm ref="formJobRef" :model="formJob" :rules="rulesJob" label-width="120px" :data-report-info="JSON.stringify({
          menu: 'mntnactionbase:jobgroup',
          form: 'jobcontent',
          update: true,
          submit: isJobSumbit
        })">
          <el-form-item :label="$t('mntnactiongroup.valueKind[0]')" prop="valueKind">
            <el-select v-model="formJob.valueKind" placeholder="Value Kind" clearable style="width: 200px">
              <el-option v-for="dict in valueKindOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="parseInt(dict.dictValue)" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('mntnactiongroup.transformation[0]')" prop="valueTransformation">
            <el-select v-model="formJob.valueTransformation" placeholder="Transformation" clearable
              style="width: 200px">
              <el-option v-for="dict in transformationOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="parseInt(dict.dictValue)" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('mntnactiongroup.loopCount[0]')" prop="loopCount">
            <el-input-number v-model="formJob.loopCount" :min="1" :max="10" controls-position="right"
              @change="handleChange" style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="jobFormLoading" :disabled="!queryParamsLink.jobId"
              @click="submitFormJob">
              <span>{{ $t('btn.save') }}</span>
            </el-button>
          </el-form-item>
        </LuxForm>

        <el-table ref="tableLink" v-loading="linkListLoading" :data="linkList" :height="tableLinkHeight" border stripe
          :empty-text="queryParamsLink.jobId ? null : $t('mntnactiongroup.JobLinkEmpty')">
          <el-table-column :label="$t('mntnactiongroup.jobSeq')" align="center" prop="jobSeq" width="60" />
          <el-table-column :label="$t('mntnactiongroup.logicType')" align="center" prop="logicType" width="100" />
          <el-table-column :label="$t('mntnactiongroup.logicDesc')" align="center" prop="logicDesc" min-width="200" />
          <el-table-column :label="$t('mntnactiongroup.logicProsql')" align="center" prop="logicProsql" min-width="200"
            show-overflow-tooltip />
          <el-table-column :label="$t('mntnactiongroup.inputParam')" align="center" prop="inputParam" min-width="200"
            show-overflow-tooltip />
          <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80" />
          <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmpno" width="120" sortable />
          <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="160" sortable>
            <template #default="scope">
              <span>{{ parseTime(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmpno" width="120" sortable />
          <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="160" sortable>
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane name="type" label="TypeList" style="padding: 10px;">
        <el-form :model="queryParamsTypeJob" :inline="false" label-suffix=":">
          <el-form-item :label="$t('mntnactiongroup.typeName')" prop="typeId">
            <el-select v-model="queryParamsTypeJob.typeId" placeholder="请选择类型" :clearable="false" filterable
              style="width: 100%" @change="getTypeJobList">
              <el-option v-for="item in typeList" :key="item.typeId" :label="item.typeName" :value="item.typeId" />
            </el-select>
          </el-form-item>
        </el-form>

        <el-table ref="tableTypeJob" v-loading="typeJobListLoading" :data="typeJobList" row-key="jobId"
          :height="tableTypeJobHeight" border
          :empty-text="queryParamsTypeJob.typeId ? null : $t('mntnactiongroup.TypeJobEmpty')" highlight-current-row
          @current-change="handleCurrentTypeJobChange" :row-class-name="tableRowClassName">
          <el-table-column :label="$t('mntnactiongroup.jobName')" align="center" prop="jobName" min-width="150" />
          <el-table-column :label="$t('mntnactiongroup.jobDesc')" align="center" prop="jobDesc" min-width="200" />
        </el-table>

        <el-table ref="tableTypeJobLink" v-loading="typeJobLinkLoading" :data="typeJobLinkList"
          :height="tableTypeJobHeight" border stripe style="margin-top: 10px;"
          :empty-text="queryParamsTypeJobLink.jobId ? null : $t('mntnactiongroup.JobLinkEmpty')">
          <el-table-column :label="$t('mntnactiongroup.jobSeq')" align="center" prop="jobSeq" width="60" />
          <el-table-column :label="$t('mntnactiongroup.logicType')" align="center" prop="logicType" width="100" />
          <el-table-column :label="$t('mntnactiongroup.logicDesc')" align="center" prop="logicDesc" min-width="200" />
          <el-table-column :label="$t('mntnactiongroup.logicProsql')" align="center" prop="logicProsql" min-width="200"
            show-overflow-tooltip />
          <el-table-column :label="$t('mntnactiongroup.inputParam')" align="center" prop="inputParam" min-width="200"
            show-overflow-tooltip />
          <!-- <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80" />
          <el-table-column :label="$t('general.updateEmpno')" align="center" prop="updateEmpno" width="120" sortable />
          <el-table-column :label="$t('general.updateTime')" align="center" prop="updateTime" width="160" sortable>
            <template #default="scope">
              <span>{{ parseTime(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('general.createEmpno')" align="center" prop="createEmpno" width="120" sortable />
          <el-table-column :label="$t('general.createTime')" align="center" prop="createTime" width="160" sortable>
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column> -->
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- Group添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="openGroup" width="500px" append-to-body @closed="closeGroup">
      <LuxForm ref="formGroupRef" :model="formGroup" :rules="rulesGroup" label-width="100px" :data-report-info="JSON.stringify({
        menu: 'mntnactionbase:jobgroup',
        form: 'jobgroup',
        update: !!formGroup.groupId,
        submit: isGroupSumbit
      })">
        <el-form-item :label="$t('mntnactiongroup.groupName')" prop="groupName">
          <el-input v-model.trim="formGroup.groupName" placeholder="请输入" :readonly="!!formGroup.groupId" />
        </el-form-item>
        <el-form-item :label="$t('mntnactiongroup.groupDesc')" prop="groupDesc">
          <el-input type="textarea" v-model="formGroup.groupDesc" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-switch v-model="formGroup.enabled"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
          <div style="margin-left: 0.5em;">
            <span v-show="formGroup.enabled">{{ $t('common.enable') }}</span>
            <span v-show="!formGroup.enabled">{{ $t('common.disable') }}</span>
          </div>
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelGroup">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="groupFormLoading" @click="submitFormGroup">
          <span>{{ $t('btn.submit') }}</span>
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="actionjobgruop">
import Sortable from 'sortablejs'
import {
  listJobType,
  listJob,
  listJobLink,
  listJobGroup,
  addJobGroup,
  updateJobGroup,
  deleteJobGroup,
  listGroupJob,
  addGroupJob,
  updateGroupJob,
  removeGroupJob
} from '@/api/datacenter/stationaction/actionbase'
const { proxy } = getCurrentInstance()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
watch(
  () => props.show,
  (nVal, oVal) => {
    if (nVal) {
      getTypeList()
      proxy.$nextTick(() => { resizeTable() })
    }
  }
)

const tabName = ref('job')
watch(tabName, (nVal, oVal) => {
  if (nVal === 'job') {
    proxy.$nextTick(() => {
      resizeTableTypeJob()
    })
  } else if (nVal === 'type') {
    proxy.$nextTick(() => {
      resizeTableTypeJob()
    })
  }
})

const pageLoading = ref(false)

const showGroupSearch = ref(true)
const groupListLoading = ref(false)
const groupList = ref([])

const jobListLoading = ref(false)
const jobList = ref([])

const linkListLoading = ref(false)
const linkList = ref([])

const typeList = ref([])

const typeJobListLoading = ref(false)
const typeJobList = ref([])
const typeJobListAll = ref([])

const typeJobLinkLoading = ref(false)
const typeJobLinkList = ref([])

// 弹出层
const title = ref('')
const openGroup = ref(false)
const groupFormLoading = ref(false)
const jobFormLoading = ref(false)

const tableRowClassName = ({ row, rowIndex }) => {
  if (!queryParamsJob.value.groupId) return 'drag-disable' // 未选中group，不允许拖拽
  const arr = typeJobListAll.value.filter(e => {
    return jobList.value.findIndex(f => f.joB_ID == e.jobId) > -1
  })
  if (arr.length) return 'drag-disable' // jobList中已存在当前type的job，不允许拖拽
  return 'drag-enable'
}

// 状态数据字典
const enabledOptions = ref([])
proxy.getDicts('selectstatus').then((response) => {
  enabledOptions.value = response.data
})

// Value Kind数据字典
const valueKindOptions = ref([])
proxy.getDicts('valuekind').then((response) => {
  valueKindOptions.value = response.data
})

// Transformation数据字典
const transformationOptions = ref([])
proxy.getDicts('transformation').then((response) => {
  transformationOptions.value = response.data
})

const state = reactive({
  queryParamsType: {
    typeName: undefined,
    enabled: 'Y'
  },
  queryParamsGroup: {
    groupName: undefined,
    enabled: 'Y'
  },
  formGroup: {},
  rulesGroup: {
    groupName: [{ required: true, message: '行为名称不能为空', trigger: 'blur' }],
    enabled: [{ type: 'boolean', required: true, message: '请选择是否启用', trigger: 'change' }]
  },
  queryParamsJob: {
    groupId: undefined
  },
  formJob: {},
  rulesJob: {
    jobName: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
    enabled: [{ type: 'boolean', required: true, message: '请选择是否启用', trigger: 'change' }]
  },
  queryParamsLink: {
    jobId: undefined,
    // enabled: 'Y'
  },
  formLink: {},
  rulesLink: {
    logicType: [{ required: true, message: '配置类型不能为空', trigger: 'change' }],
    logicProsql: [{ required: true, message: '配置值不能为空', trigger: 'blur' }],
    logicValue: [{ required: true, message: '配置值不能为空', trigger: 'blur' }],
    enabled: [{ type: 'boolean', required: true, message: '请选择是否启用', trigger: 'change' }]
  },
  queryParamsTypeJob: {
    typeId: null
  },
  queryParamsTypeJobLink: {
    jobId: null
  }
})

const { queryParamsGroup, formGroup, rulesGroup } = toRefs(state)
const { queryParamsJob, formJob, rulesJob } = toRefs(state)
const { queryParamsLink, formLink, rulesLink } = toRefs(state)
const { queryParamsType, queryParamsTypeJob, queryParamsTypeJobLink } = toRefs(state)

const tableGroup = ref(null)
const tableGroupHeight = ref(null)
const tableGroupTop = ref(0)

const tableJob = ref(null)
const tableJobHeight = ref(null)
const tableJobTop = ref(0)

const tableLink = ref(null)
const tableLinkHeight = ref(null)
const tableLinkTop = ref(0)

const tableTypeJob = ref(null)
const tableTypeJobHeight = ref(null)
const tableTypeJobTop = ref(0)

/* 重新计算table高度 */
function resizeTable() {
  resizeTableGroup()
  resizeTableJob()
  resizeTableLink()
  resizeTableTypeJob()
}
// Table Group
function resizeTableGroup() {
  if (!tableGroup.value) return

  tableGroup.value._timer && clearTimeout(tableGroup.value._timer)
  tableGroup.value._timer = setTimeout(() => {
    let height = window.innerHeight / 2 - tableGroup.value.$el.getBoundingClientRect().top + 10
    height = Math.floor(height)
    height = Math.max(height, 110)
    tableGroupHeight.value = height - 1 + 'px'
  }, 50)
}
// Table Job
function resizeTableJob() {
  if (!tableJob.value) return

  tableJob.value._timer && clearTimeout(tableJob.value._timer)
  tableJob.value._timer = setTimeout(() => {
    let height = window.innerHeight - tableJob.value.$el.getBoundingClientRect().top - 40
    height = Math.floor(height)
    height = Math.max(height, 110)
    tableJobHeight.value = height - 1 + 'px'
  }, 50)
}
// Table Link
function resizeTableLink() {
  if (!tableLink.value) return

  tableLink.value._timer && clearTimeout(tableLink.value._timer)
  tableLink.value._timer = setTimeout(() => {
    let height = window.innerHeight - tableLink.value.$el.getBoundingClientRect().top - 40
    height = Math.floor(height)
    height = Math.max(height, 100)
    tableLinkHeight.value = height - 1 + 'px'
  }, 50)
}
// Table Type Job
function resizeTableTypeJob() {
  if (!tableTypeJob.value) return

  tableTypeJob.value._timer && clearTimeout(tableTypeJob.value._timer)
  tableTypeJob.value._timer = setTimeout(() => {
    let height = window.innerHeight - tableTypeJob.value.$el.getBoundingClientRect().top - 50
    height = Math.floor(height)
    height = Math.max(height, 240)
    tableTypeJobHeight.value = height / 2 - 1 + 'px'
  }, 50)
}

let appMain

// 监听页面容器尺寸变化
function observeResize() {
  let arr = document.getElementsByClassName('app-main')
  let appMain = arr[0]
  if (appMain) {
    appMain._ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        resizeTable()
      }
    });

    appMain._ro.observe(appMain)
  }
}

function initGroupJobDrag() {
  const tbodyJob = tableJob.value.$el.querySelector('.el-table__body tbody')
  Sortable.create(tbodyJob, {
    group: {
      name: 'shared',
      pull: true,
      put: true
    },
    handle: '.el-table__row',
    animation: 150,
    sort: false,
    onAdd: (evt) => {
      // 处理右侧列表
      const item = typeJobList.value.splice(evt.oldIndex, 1)[0]
      // 调接口新增
      const form = {
        groupId: queryParamsJob.value.groupId,
        groupSeq: evt.newIndex + 1,
        jobId: item.jobId
      }
      pageLoading.value = true
      addGroupJob(form).then((response) => {
        pageLoading.value = false
        getJobList(() => {
          getTypeJobList()
        })
      }).catch(() => {
        pageLoading.value = false
        getJobList(() => {
          getTypeJobList()
        })
      })
    }
  })
}
function initTypeJobDrag() {
  const tbodyTypeJob = tableTypeJob.value.$el.querySelector('.el-table__body tbody')
  Sortable.create(tbodyTypeJob, {
    group: {
      name: 'shared',
      pull: true,
      put: true
    },
    handle: '.el-table__row',
    animation: 150,
    sort: false,
    filter: '.drag-disable',
    onAdd: (evt) => {
      // 处理左侧列表
      const item = jobList.value.splice(evt.oldIndex, 1)[0]
      // 调接口删除
      const form = {
        groupId: item.grouP_ID,
        groupSeq: item.grouP_SEQ
      }
      pageLoading.value = true
      removeGroupJob(form).then((response) => {
        pageLoading.value = false
        getJobList(() => {
          getTypeJobList()
        })
      }).catch(() => {
        pageLoading.value = false
        getJobList(() => {
          getTypeJobList()
        })
      })
    }
  })
}

onMounted(() => {
  observeResize()
  initGroupJobDrag()
  initTypeJobDrag()
})
onBeforeUnmount(() => {
  // 取消监听页面容器尺寸变化
  if (appMain && appMain._ro) appMain._ro.disconnect()
})
onUpdated(() => {
  // 页面更新后 记录各table当前位置
  tableGroupTop.value = tableGroup.value.$el.getBoundingClientRect().top
  tableJobTop.value = tableJob.value.$el.getBoundingClientRect().top
  tableLinkTop.value = tableLink.value.$el.getBoundingClientRect().top
  tableTypeJobTop.value = tableTypeJob.value.$el.getBoundingClientRect().top
})
// 监听各table位置变化
watch(tableGroupTop, (nVal, oVal) => {
  resizeTableGroup()
})
watch(tableJobTop, (nVal, oVal) => {
  resizeTableJob()
})
watch(tableLinkTop, (nVal, oVal) => {
  resizeTableLink()
})
watch(tableTypeJobTop, (nVal, oVal) => {
  resizeTableTypeJob()
})

/** 状态修改  */
function handleGroupEnabledChange(row) {
  let text = row.enabled === 'Y' ? proxy.$t('common.enable') : proxy.$t('common.disable')
  proxy.$modal
    .confirm(proxy.$t('mntnactiongroup.ConfirmChangeStatus', { op: text, name: row.groupName }))
    .then(() => {
      groupListLoading.value = true
      return updateJobGroup(row)
    })
    .then(() => {
      groupListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mntnactiongroup.ChangeOK'))
      getGroupList()
    })
    .catch(() => {
      row.enabled = row.enabled == 'Y' ? 'N' : 'Y'
      groupListLoading.value = false
    })
}

/** 查询group列表 */
function getGroupList() {
  groupListLoading.value = true
  listJobGroup(queryParamsGroup.value).then((response) => {
    groupListLoading.value = false
    if (response.code == 200) {
      groupList.value = response.data
    } else {
      groupList.value = []
    }
  }).catch(() => {
    groupListLoading.value = false
  })
}
/** 搜索按钮操作 */
function handleQueryGroup() {
  getGroupList()
}
/** 重置按钮操作 */
function resetQueryGroup() {
  proxy.resetForm('queryFormGroup')
  handleQueryGroup()
}

// group表单重置
function resetGroup() {
  formGroup.value = {
    groupId: null,
    groupName: null,
    groupDesc: null,
    enabled: true
  }
  proxy.resetLuxForm('formGroupRef')
}

// 取消按钮
function cancelGroup() {
  openGroup.value = false
}
// 弹窗关闭
function closeGroup() {
  resetGroup()
}

/** group新增按钮操作 */
function handleAddGroup() {
  resetGroup()
  openGroup.value = true
  title.value = proxy.$t('mntnactiongroup.AddGroupData')
}

/** group修改按钮操作 */
function handleUpdateGroup(row) {
  resetGroup()
  let form = JSON.parse(JSON.stringify(row))
  form.enabled = form.enabled !== 'N'
  formGroup.value = form
  openGroup.value = true
  title.value = proxy.$t('mntnactiongroup.UpdateGroupData')
}

const formGroupRef = ref(null)
const isGroupSumbit = ref(false)

/** group提交按钮 */
function submitFormGroup() {
  isGroupSumbit.value = true
  formGroupRef.value.$form.validate((valid) => {
    isGroupSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formGroup.value))
      form.enabled = form.enabled ? 'Y' : 'N'

      groupFormLoading.value = true
      if (form.groupId) {
        updateJobGroup(form).then((response) => {
          groupFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mntnactiongroup.UpdateOK'))
          openGroup.value = false
          getGroupList()
        }).catch(() => {
          groupFormLoading.value = false
        })
      } else {
        addJobGroup(form).then((response) => {
          groupFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mntnactiongroup.AddOK'))
          openGroup.value = false
          getGroupList()
        }).catch(() => {
          groupFormLoading.value = false
        })
      }
    }
  })
}

/* group删除按钮 */
function handleDeleteGroup(row) {
  proxy.$modal
    .confirm(proxy.$t('mntnactionbase.ConfirmDelete'))
    .then(() => {
      groupListLoading.value = true
      return deleteJobGroup({ groupId: row.groupId })
    })
    .then(() => {
      groupListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.DeleteOK'))
      getGroupList()
    })
    .catch(() => {
      groupListLoading.value = false
    })
}

// 选中group行
function handleCurrentGroupChange(row) {
  if (row) {
    queryParamsJob.value.groupId = row.groupId
    getJobList(() => {
      getTypeJobList()
    })
  } else {
    queryParamsJob.value.groupId = undefined
    jobList.value = []
    getTypeJobList()
  }
}

/** 查询job列表 */
function getJobList(callback) {
  if (!queryParamsJob.value.groupId) {
    jobList.value = []
    return
  }

  jobListLoading.value = true
  listGroupJob(queryParamsJob.value).then((response) => {
    jobListLoading.value = false
    if (response.code == 200) {
      jobList.value = response.data
    } else {
      jobList.value = []
    }
    callback && callback()
  }).catch(() => {
    jobListLoading.value = false
  })
}

// 选中job行
function handleCurrentJobChange(row) {
  if (row) {
    handleUpdateJob(row)
    queryParamsLink.value.jobId = row.joB_ID
    getLinkList()
  } else {
    resetJob()
    queryParamsLink.value.jobId = undefined
    linkList.value = []
  }
}

// job表单重置
function resetJob() {
  formJob.value = {
    groupId: null,
    groupSeq: null,
    jobId: null,
    valueKind: null,
    valueTransformation: null,
    loopCount: 1
  }
  proxy.resetLuxForm('formJobRef')
}

/** job修改按钮操作 */
function handleUpdateJob(row) {
  resetJob()
  let form = JSON.parse(JSON.stringify(row))
  formJob.value = {
    groupId: form.grouP_ID,
    groupSeq: form.grouP_SEQ,
    jobId: form.joB_ID,
    valueKind: form.valuE_KIND,
    valueTransformation: form.valuE_TRANSFORMATION,
    loopCount: form.looP_COUNT
  }
}

const formJobRef = ref(null)
const isJobSumbit = ref(false)

/** job提交按钮 */
function submitFormJob() {
  isJobSumbit.value = true
  formJobRef.value.$form.validate((valid) => {
    isJobSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formJob.value))
      jobFormLoading.value = true
      updateGroupJob(form).then((response) => {
        jobFormLoading.value = false
        proxy.$modal.msgSuccess(proxy.$t('mntnactiongroup.UpdateOK'))
        getJobList()
      }).catch(() => {
        jobFormLoading.value = false
      })
    }
  })
}

/** 查询link列表 */
function getLinkList() {
  if (!queryParamsLink.value.jobId) {
    linkList.value = []
    return
  }

  linkListLoading.value = true
  listJobLink(queryParamsLink.value).then((response) => {
    linkListLoading.value = false
    if (response.code == 200) {
      let list = response.data
      list.sort((a, b) => a.jobSeq - b.jobSeq)
      linkList.value = list
    } else {
      linkList.value = []
    }
  }).catch(() => {
    linkListLoading.value = false
  })
}

/** 查询类型列表 */
function getTypeList() {
  listJobType(queryParamsType.value).then((response) => {
    if (response.code == 200) {
      typeList.value = response.data
      if (typeList.value.length) {
        let flag = false
        if (queryParamsTypeJob.value.typeId) {
          flag = typeList.value.findIndex(e => e.typeId == queryParamsTypeJob.value.typeId) > -1
        }
        if (!flag) {
          queryParamsTypeJob.value.typeId = typeList.value[0].typeId
        }
        getTypeJobList()
      }
    } else {
      typeList.value = []
    }
  })
}

function getTypeJobList() {
  if (!queryParamsTypeJob.value.typeId) {
    typeJobListAll.value = []
    typeJobList.value = []
    return
  }

  typeJobListLoading.value = true
  listJob(queryParamsTypeJob.value).then((response) => {
    typeJobListLoading.value = false
    if (response.code == 200) {
      // 过滤掉左侧列表中已有的jobId
      typeJobListAll.value = response.data
      typeJobList.value = response.data.filter(e => {
        return jobList.value.findIndex(f => f.joB_ID == e.jobId) === -1
      })
    } else {
      typeJobListAll.value = []
      typeJobList.value = []
    }
  }).catch(() => {
    typeJobListLoading.value = false
  })
}

// 选中TypeJob行
function handleCurrentTypeJobChange(row) {
  if (row) {
    queryParamsTypeJobLink.value.jobId = row.jobId
    getTypeJobLinkList()
  } else {
    queryParamsTypeJobLink.value.jobId = undefined
    typeJobLinkList.value = []
  }
}

function getTypeJobLinkList() {
  if (!queryParamsTypeJobLink.value.jobId) {
    typeJobLinkList.value = []
    return
  }

  typeJobLinkLoading.value = true
  listJobLink(queryParamsTypeJobLink.value).then((response) => {
    typeJobLinkLoading.value = false
    if (response.code == 200) {
      let list = response.data
      list.sort((a, b) => a.jobSeq - b.jobSeq)
      typeJobLinkList.value = list
    } else {
      typeJobLinkList.value = []
    }
  }).catch(() => {
    typeJobLinkLoading.value = false
  })
}

resetJob()
getGroupList()
getTypeList()
</script>

<style scoped>
.card-box {
  margin-bottom: 0;
  padding: 10px;
  box-shadow: var(--el-box-shadow-light);
}

:deep(.el-table__row) {
  cursor: grab;
}
</style>