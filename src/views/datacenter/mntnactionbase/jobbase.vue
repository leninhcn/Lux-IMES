<template>
  <div class="app-container">
    <!-- Type -->
    <div class="card-box">
      <el-form :model="queryParamsType" ref="queryFormType" :inline="true" v-show="showTypeSearch">
        <el-form-item :label="$t('mntnactionbase.typeName')" prop="typeName">
          <el-input v-model="queryParamsType.typeName" placeholder="请输入类型名称" clearable style="width: 200px"
            @keyup.enter="handleQueryType" />
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-select v-model="queryParamsType.enabled" placeholder="状态" clearable style="width: 100px"
            @change="handleQueryType">
            <el-option v-for="dict in enabledOptions" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQueryType">{{ $t('btn.search') }}</el-button>
          <el-button icon="refresh" @click="resetQueryType">{{ $t('btn.reset') }}</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb2">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="plus" @click="handleAddType"
            v-hasPermi="['datacenter:mntnactionbase:add']">{{ $t('btn.add') }}</el-button>
        </el-col>

        <right-toolbar v-model:showSearch="showTypeSearch" @queryTable="getTypeList"></right-toolbar>
      </el-row>

      <el-table ref="tableType" v-loading="typeListLoading" :data="typeList" :height="tableTypeHeight" border stripe
        highlight-current-row @current-change="handleCurrentTypeChange">
        <el-table-column type="index" align="center" width="50" />
        <el-table-column :label="$t('mntnactionbase.typeName')" align="center" prop="typeName" min-width="150" />
        <el-table-column :label="$t('mntnactionbase.typeDesc')" align="center" prop="typeDesc" min-width="200" />
        <!-- <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80" /> -->
        <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80">
          <template #default="scope">
            <div @click.stop>
              <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N"
                :active-text="$t('common.enable')" :inactive-text="$t('common.disable')" inline-prompt
                @change="handleTypeEnabledChange(scope.row)"></el-switch>
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
            <el-button text size="small" icon="edit" @click="handleUpdateType(scope.row)"
              v-hasPermi="['datacenter:mntnactionbase:update']">{{ $t('btn.edit') }}</el-button>
            <el-button text type="danger" size="small" icon="Delete" v-hasPermi="['datacenter:mntnactionbase:remove']"
              @click="handleDeleteType(scope.row)">{{ $t('btn.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="padding-top: 10px;display: flex;justify-content: space-between;">
      <!-- Job -->
      <div class="card-box" style="width: calc(50% - 5px);">
        <el-form :model="queryParamsJob" ref="queryFormJob" :inline="true" v-show="showJobSearch">
          <el-form-item :label="$t('mntnactionbase.jobName')" prop="jobName">
            <el-input v-model="queryParamsJob.jobName" placeholder="请输入工作名称" clearable style="width: 200px"
              @keyup.enter="handleQueryJob" />
          </el-form-item>
          <el-form-item :label="$t('general.enabled')" prop="enabled">
            <el-select v-model="queryParamsJob.enabled" placeholder="状态" clearable style="width: 100px"
              @change="handleQueryJob">
              <el-option v-for="dict in enabledOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="search" @click="handleQueryJob">{{ $t('btn.search') }}</el-button>
            <el-button icon="refresh" @click="resetQueryJob">{{ $t('btn.reset') }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb2">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="plus" :disabled="!queryParamsJob.typeId" @click="handleAddJob"
              v-hasPermi="['datacenter:mntnactionbase:add']">{{ $t('btn.add') }}</el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showJobSearch" @queryTable="getJobList"></right-toolbar>
        </el-row>

        <el-table ref="tableJob" v-loading="jobListLoading" :data="jobList" :height="tableJobHeight" border stripe
          :empty-text="queryParamsJob.typeId ? null : $t('mntnactionbase.JobEmpty')" highlight-current-row
          @current-change="handleCurrentJobChange">
          <el-table-column type="index" align="center" width="50" />
          <el-table-column :label="$t('mntnactionbase.jobName')" align="center" prop="jobName" min-width="150" />
          <el-table-column :label="$t('mntnactionbase.jobDesc')" align="center" prop="jobDesc" min-width="200" />
          <!-- <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80" /> -->
          <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80">
            <template #default="scope">
              <div @click.stop>
                <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N"
                  :active-text="$t('common.enable')" :inactive-text="$t('common.disable')" inline-prompt
                  @change="handleJobEnabledChange(scope.row)"></el-switch>
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
              <el-button text size="small" icon="edit" @click="handleUpdateJob(scope.row)"
                v-hasPermi="['datacenter:mntnactionbase:update']">{{ $t('btn.edit') }}</el-button>
              <el-button text type="danger" size="small" icon="Delete" v-hasPermi="['datacenter:mntnactionbase:remove']"
                @click="handleDeleteJob(scope.row)">{{ $t('btn.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Link -->
      <div class="card-box" style="width: calc(50% - 5px);">
        <el-form :model="queryParamsLink" ref="queryFormLink" :inline="true" v-show="showLinkSearch">
          <el-form-item :label="$t('general.enabled')" prop="enabled">
            <el-select v-model="queryParamsLink.enabled" placeholder="状态" clearable style="width: 100px"
              @change="handleQueryLink">
              <el-option v-for="dict in enabledOptions" :key="dict.dictValue" :label="dict.dictLabel"
                :value="dict.dictValue" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="search" @click="handleQueryLink">{{ $t('btn.search') }}</el-button>
            <el-button icon="refresh" @click="resetQueryLink">{{ $t('btn.reset') }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb2">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="plus" :disabled="!queryParamsLink.jobId" @click="handleAddLink"
              v-hasPermi="['datacenter:mntnactionbase:add']">{{ $t('btn.add') }}</el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showLinkSearch" @queryTable="getLinkList"></right-toolbar>
        </el-row>

        <el-table ref="tableLink" v-loading="linkListLoading" :data="linkList" :height="tableLinkHeight" border stripe
          :empty-text="queryParamsLink.jobId ? null : $t('mntnactionbase.LinkEmpty')">
          <el-table-column :label="$t('mntnactionbase.jobSeq')" align="center" prop="jobSeq" width="60" />
          <el-table-column :label="$t('mntnactionbase.logicType')" align="center" prop="logicType" width="100" />
          <el-table-column :label="$t('mntnactionbase.logicDesc')" align="center" prop="logicDesc" min-width="200" />
          <el-table-column :label="$t('mntnactionbase.logicProsql')" align="center" prop="logicProsql" min-width="200"
            show-overflow-tooltip />
          <el-table-column :label="$t('mntnactionbase.inputParam')" align="center" prop="inputParam" min-width="200"
            show-overflow-tooltip />
          <!-- <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80" /> -->
          <el-table-column :label="$t('general.enabled')" align="center" prop="enabled" width="80">
            <template #default="scope">
              <div @click.stop>
                <el-switch v-model="scope.row.enabled" active-value="Y" inactive-value="N"
                  :active-text="$t('common.enable')" :inactive-text="$t('common.disable')" inline-prompt
                  @change="handleLinkEnabledChange(scope.row)"></el-switch>
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
              <el-button text size="small" icon="edit" @click="handleUpdateLink(scope.row)"
                v-hasPermi="['datacenter:mntnactionbase:update']">{{ $t('btn.edit') }}</el-button>
              <el-button text type="danger" size="small" icon="Delete" v-hasPermi="['datacenter:mntnactionbase:remove']"
                @click="handleDeleteLink(scope.row)">{{ $t('btn.delete') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 类型添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="openType" width="500px" append-to-body @closed="closeType">
      <LuxForm ref="formTypeRef" :model="formType" :rules="rulesType" label-width="100px" :data-report-info="JSON.stringify({
        menu: 'mntnactionbase:jobbase',
        form: 'jobtype',
        update: !!formType.typeId,
        submit: isTypeSumbit
      })">
        <el-form-item :label="$t('mntnactionbase.typeName')" prop="typeName">
          <el-input v-model.trim="formType.typeName" placeholder="请输入" :readonly="!!formType.typeId" />
        </el-form-item>
        <el-form-item :label="$t('mntnactionbase.typeDesc')" prop="typeDesc">
          <el-input type="textarea" v-model="formType.typeDesc" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-switch v-model="formType.enabled"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
          <div style="margin-left: 0.5em;">
            <span v-show="formType.enabled">{{ $t('common.enable') }}</span>
            <span v-show="!formType.enabled">{{ $t('common.disable') }}</span>
          </div>
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelType">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="typeFormLoading" @click="submitFormType">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

    <!-- Job添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="openJob" width="500px" append-to-body @closed="closeJob">
      <LuxForm ref="formJobRef" :model="formJob" :rules="rulesJob" label-width="100px" :data-report-info="JSON.stringify({
        menu: 'mntnactionbase:jobbase',
        form: 'job',
        update: !!formJob.jobId,
        submit: isJobSumbit
      })">
        <el-form-item :label="$t('mntnactionbase.jobName')" prop="jobName">
          <el-input v-model.trim="formJob.jobName" placeholder="请输入" :readonly="!!formJob.jobId" />
        </el-form-item>
        <el-form-item :label="$t('mntnactionbase.jobDesc')" prop="jobDesc">
          <el-input type="textarea" v-model="formJob.jobDesc" placeholder="请输入" />
        </el-form-item>
        <el-form-item :label="$t('general.enabled')" prop="enabled">
          <el-switch v-model="formJob.enabled"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
          <div style="margin-left: 0.5em;">
            <span v-show="formJob.enabled">{{ $t('common.enable') }}</span>
            <span v-show="!formJob.enabled">{{ $t('common.disable') }}</span>
          </div>
        </el-form-item>
      </LuxForm>
      <template #footer>
        <el-button text @click="cancelJob">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="jobFormLoading" @click="submitFormJob">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>

    <!-- Link添加或修改内容对话框 -->
    <el-dialog :title="title" v-model="openLink" width="1000px" append-to-body @opened="linkOpened" @closed="closeLink">
      <LuxForm ref="formLinkRef" :model="formLink" :rules="rulesLink" label-width="100px" :data-report-info="JSON.stringify({
        menu: 'mntnactionbase:jobbase',
        form: 'joblink',
        update: isLinkEdit,
        submit: isLinkSumbit
      })">
        <el-row :gutter="32">
          <el-col :span="10">
            <el-form-item :label="$t('mntnactionbase.jobName')" prop="jobName">
              <el-input v-model.trim="linkJobName" placeholder="" readonly />
            </el-form-item>
            <el-form-item :label="$t('mntnactionbase.jobSeq')" prop="jobSeq">
              <el-input v-model.trim="formLink.jobSeq" placeholder="自动生成" readonly />
            </el-form-item>
            <el-form-item :label="$t('mntnactionbase.logicType')" prop="logicType">
              <el-radio-group v-model="formLink.logicType" @change="changeLogicType">
                <el-radio value="Procedure" border>Procedure</el-radio>
                <el-radio value="SQL" border>SQL</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('mntnactionbase.logicDesc')" prop="logicDesc">
              <el-input type="textarea" v-model="formLink.logicDesc" placeholder="请输入" :rows="6" />
            </el-form-item>
            <el-form-item :label="$t('general.enabled')" prop="enabled">
              <el-switch v-model="formLink.enabled"
                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"></el-switch>
              <div style="margin-left: 0.5em;">
                <span v-show="formLink.enabled">{{ $t('common.enable') }}</span>
                <span v-show="!formLink.enabled">{{ $t('common.disable') }}</span>
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="14">
            <el-form :inline="true" label-suffix=":">
              <el-form-item :label="$t('mntnactionbase.procedureName')" prop="procedureName">
                <el-input v-model="procedureName" placeholder="请输入程式名称" clearable style="width: 300px" />
              </el-form-item>
            </el-form>
            <el-table ref="tableProcedure" v-loading="procedureLoading" :data="procedureListFilter" height="300px"
              border stripe size="small" :highlight-current-row="formLink.logicType === 'Procedure'"
              @current-change="selectProcedure">
              <el-table-column :label="$t('mntnactionbase.procedureName')" align="left" prop="procedurE_NAME"
                min-width="160" />
              <el-table-column :label="$t('mntnactionbase.procedureParams')" align="left" prop="inpuT_PARAM"
                min-width="200" />
            </el-table>
          </el-col>
        </el-row>

        <el-form-item v-if="formLink.logicType === 'Procedure'" :label="$t('mntnactionbase.logicValue')"
          prop="logicValue">
          <el-input type="textarea" v-model="formLink.logicValue" placeholder="" :rows="4" readonly />
        </el-form-item>
        <el-form-item v-else :label="$t('mntnactionbase.logicValue')" prop="logicProsql">
          <el-input type="textarea" v-model="formLink.logicProsql" placeholder="请输入" :rows="4" />
        </el-form-item>
      </LuxForm>

      <template #footer>
        <el-button text @click="cancelLink">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="linkFormLoading" @click="submitFormLink">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="actionjobbase">
import { listProcedure } from '@/api/mescommon/mesget'
import {
  listJobType,
  addJobType,
  updateJobType,
  deleteJobType,
  listJob,
  addJob,
  updateJob,
  deleteJob,
  listJobLink,
  addJobLink,
  updateJobLink,
  deleteJobLink
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
      nextTick(() => { resizeTable() })
    }
  }
)

const showTypeSearch = ref(true)
const typeListLoading = ref(false)
const typeList = ref([])

const showJobSearch = ref(true)
const jobListLoading = ref(false)
const jobList = ref([])

const showLinkSearch = ref(true)
const linkListLoading = ref(false)
const linkList = ref([])

const procedureName = ref('')
const procedureLoading = ref(false)
const procedureList = ref([])

const tableProcedure = ref(null)

/* 程式列表过滤 */
const procedureListFilter = computed(() => {
  let list = []
  if (!procedureName.value) {
    list = procedureList.value
  } else {
    list = procedureList.value.filter(e => e.procedurE_NAME.toLowerCase().includes(procedureName.value.toLowerCase()))
  }

  // 过滤后仍选中当前行
  if (formLink.value.logicType === 'Procedure' && formLink.value.logicProsql) {
    const cur = list.find(e => e.procedurE_NAME === formLink.value.logicProsql)
    if (cur && tableProcedure && tableProcedure.value) {
      tableProcedure.value.setCurrentRow(cur)
    }
  }

  return list
})

// 弹出层
const title = ref('')
const openType = ref(false)
const typeFormLoading = ref(false)
const openJob = ref(false)
const jobFormLoading = ref(false)
const openLink = ref(false)
const linkFormLoading = ref(false)
const linkJobName = ref('')

// 状态数据字典
const enabledOptions = ref([])
proxy.getDicts('selectstatus').then((response) => {
  enabledOptions.value = response.data
})

const state = reactive({
  queryParamsType: {
    typeName: undefined,
    enabled: 'Y'
  },
  formType: {},
  rulesType: {
    typeName: [{ required: true, message: '类型名称不能为空', trigger: 'blur' }],
    enabled: [{ type: 'boolean', required: true, message: '请选择是否启用', trigger: 'change' }]
  },
  queryParamsJob: {
    typeId: undefined,
    jobName: undefined,
    enabled: 'Y'
  },
  formJob: {},
  rulesJob: {
    jobName: [{ required: true, message: '配置名称不能为空', trigger: 'blur' }],
    enabled: [{ type: 'boolean', required: true, message: '请选择是否启用', trigger: 'change' }]
  },
  queryParamsLink: {
    jobId: undefined,
    enabled: 'Y'
  },
  formLink: {},
  rulesLink: {
    logicType: [{ required: true, message: '配置类型不能为空', trigger: 'change' }],
    logicProsql: [{ required: true, message: '配置值不能为空', trigger: 'blur' }],
    logicValue: [{ required: true, message: '配置值不能为空', trigger: 'blur' }],
    enabled: [{ type: 'boolean', required: true, message: '请选择是否启用', trigger: 'change' }]
  },
  queryParamsProcedure: {
    parm: undefined
  }
})

const { queryParamsType, formType, rulesType } = toRefs(state)
const { queryParamsJob, formJob, rulesJob } = toRefs(state)
const { queryParamsLink, formLink, rulesLink } = toRefs(state)
const { queryParamsProcedure } = toRefs(state)

const tableType = ref(null)
const tableTypeHeight = ref(null)
const tableTypeTop = ref(0)

const tableJob = ref(null)
const tableJobHeight = ref(null)
const tableJobTop = ref(0)

const tableLink = ref(null)
const tableLinkHeight = ref(null)
const tableLinkTop = ref(0)

/* 重新计算table高度 */
function resizeTable() {
  resizeTableType()
  resizeTableJob()
  resizeTableLink()
}
// Table Type
function resizeTableType() {
  if (!tableType.value) return

  tableType.value._timer && clearTimeout(tableType.value._timer)
  tableType.value._timer = setTimeout(() => {
    let height = window.innerHeight / 2 - tableType.value.$el.getBoundingClientRect().top + 10
    height = Math.floor(height)
    height = Math.max(height, 100)
    tableTypeHeight.value = height - 1 + 'px'
  }, 50)
}
// Table Job
function resizeTableJob() {
  if (!tableJob.value) return

  tableJob.value._timer && clearTimeout(tableJob.value._timer)
  tableJob.value._timer = setTimeout(() => {
    let height = window.innerHeight - tableJob.value.$el.getBoundingClientRect().top - 40
    height = Math.floor(height)
    height = Math.max(height, 100)
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

let appMain
onMounted(() => {
  // 监听页面容器尺寸变化
  let arr = document.getElementsByClassName('app-main')
  let appMain = arr[0]
  if (appMain) {
    appMain._ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        resizeTable()
      }
    });

    appMain._ro.observe(appMain);
  }
})
onBeforeUnmount(() => {
  // 取消监听页面容器尺寸变化
  if (appMain && appMain._ro) appMain._ro.disconnect();
})
onUpdated(() => {
  // 页面更新后 记录各table当前位置
  tableTypeTop.value = tableType.value.$el.getBoundingClientRect().top
  tableJobTop.value = tableJob.value.$el.getBoundingClientRect().top
  tableLinkTop.value = tableLink.value.$el.getBoundingClientRect().top
})
// 监听各table位置变化
watch(tableTypeTop, (nVal, oVal) => {
  resizeTableType()
})
watch(tableJobTop, (nVal, oVal) => {
  resizeTableJob()
})
watch(tableLinkTop, (nVal, oVal) => {
  resizeTableLink()
})

/** 状态修改  */
function handleTypeEnabledChange(row) {
  let text = row.enabled === 'Y' ? proxy.$t('common.enable') : proxy.$t('common.disable')
  proxy.$modal
    .confirm(proxy.$t('mntnactionbase.ConfirmChangeStatus', { op: text, name: row.typeName }))
    .then(() => {
      typeListLoading.value = true
      return updateJobType(row);
    })
    .then(() => {
      typeListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.ChangeOK'))
      getTypeList()
    })
    .catch(() => {
      row.enabled = row.enabled == 'Y' ? 'N' : 'Y'
      typeListLoading.value = false
    })
}
function handleJobEnabledChange(row) {
  let text = row.enabled === 'Y' ? proxy.$t('common.enable') : proxy.$t('common.disable')
  proxy.$modal
    .confirm(proxy.$t('mntnactionbase.ConfirmChangeStatus', { op: text, name: row.jobName }))
    .then(() => {
      jobListLoading.value = true
      return updateJob(row);
    })
    .then(() => {
      jobListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.ChangeOK'))
      getJobList()
    })
    .catch(() => {
      row.enabled = row.enabled == 'Y' ? 'N' : 'Y'
      jobListLoading.value = false
    })
}
function handleLinkEnabledChange(row) {
  let text = row.enabled === 'Y' ? proxy.$t('common.enable') : proxy.$t('common.disable')
  proxy.$modal
    .confirm(proxy.$t('mntnactionbase.ConfirmChangeStatus', { op: text }))
    .then(() => {
      linkListLoading.value = true
      return updateJobLink(row);
    })
    .then(() => {
      linkListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.ChangeOK'))
      getLinkList()
    })
    .catch(() => {
      row.enabled = row.enabled == 'Y' ? 'N' : 'Y'
      linkListLoading.value = false
    })
}

/** 查询类型列表 */
function getTypeList() {
  typeListLoading.value = true
  listJobType(queryParamsType.value).then((response) => {
    typeListLoading.value = false
    if (response.code == 200) {
      typeList.value = response.data
    } else {
      typeList.value = []
    }
  }).catch(() => {
    typeListLoading.value = false
  })
}
/** 搜索按钮操作 */
function handleQueryType() {
  getTypeList()
}
/** 重置按钮操作 */
function resetQueryType() {
  proxy.resetForm('queryFormType')
  handleQueryType()
}

// 类型表单重置
function resetType() {
  formType.value = {
    typeId: null,
    typeName: null,
    typeDesc: null,
    enabled: true
  }
  proxy.resetLuxForm('formTypeRef')
}

// 取消按钮
function cancelType() {
  openType.value = false
}
// 弹窗关闭
function closeType() {
  resetType()
}

/** 类型新增按钮操作 */
function handleAddType() {
  resetType()
  openType.value = true
  title.value = proxy.$t('mntnactionbase.AddTypeData')
}

/** 类型修改按钮操作 */
function handleUpdateType(row) {
  resetType()
  let form = JSON.parse(JSON.stringify(row))
  form.enabled = form.enabled !== 'N'
  formType.value = form
  openType.value = true
  title.value = proxy.$t('mntnactionbase.UpdateTypeData')
}

const formTypeRef = ref(null)
const isTypeSumbit = ref(false)

/** 类型提交按钮 */
function submitFormType() {
  isTypeSumbit.value = true
  formTypeRef.value.$form.validate((valid) => {
    isTypeSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formType.value))
      form.enabled = form.enabled ? 'Y' : 'N'

      typeFormLoading.value = true
      if (form.typeId) {
        updateJobType(form).then((response) => {
          typeFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.UpdateOK'))
          openType.value = false
          getTypeList()
        }).catch(() => {
          typeFormLoading.value = false
        })
      } else {
        addJobType(form).then((response) => {
          typeFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.AddOK'))
          openType.value = false
          getTypeList()
        }).catch(() => {
          typeFormLoading.value = false
        })
      }
    }
  })
}

/* 类型删除按钮 */
function handleDeleteType(row) {
  proxy.$modal
    .confirm(proxy.$t('mntnactionbase.ConfirmDelete'))
    .then(() => {
      typeListLoading.value = true
      return deleteJobType({ typeId: row.typeId })
    })
    .then(() => {
      typeListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.DeleteOK'))
      getTypeList()
    })
    .catch(() => {
      typeListLoading.value = false
    })
}

// 选中类型行
function handleCurrentTypeChange(row) {
  if (row) {
    queryParamsJob.value.typeId = row.typeId
    getJobList()
  } else {
    queryParamsJob.value.typeId = undefined
    jobList.value = []
  }
}

/** 查询job列表 */
function getJobList() {
  if (!queryParamsJob.value.typeId) {
    jobList.value = []
    return
  }

  jobListLoading.value = true
  listJob(queryParamsJob.value).then((response) => {
    jobListLoading.value = false
    if (response.code == 200) {
      jobList.value = response.data
    } else {
      jobList.value = []
    }
  }).catch(() => {
    jobListLoading.value = false
  })
}
/** 搜索按钮操作 */
function handleQueryJob() {
  getJobList()
}
/** 重置按钮操作 */
function resetQueryJob() {
  proxy.resetForm('queryFormJob')
  handleQueryJob()
}

// job表单重置
function resetJob() {
  formJob.value = {
    typeId: null,
    jobId: null,
    jobName: null,
    jobDesc: null,
    enabled: true
  }
  proxy.resetLuxForm('formJobRef')
}

// 取消按钮
function cancelJob() {
  openJob.value = false
}
// 弹窗关闭
function closeJob() {
  resetJob()
}

/** job新增按钮操作 */
function handleAddJob() {
  if (!queryParamsJob.value.typeId) return

  resetJob()
  formJob.value.typeId = queryParamsJob.value.typeId
  openJob.value = true
  title.value = proxy.$t('mntnactionbase.AddJobData')
}

/** job修改按钮操作 */
function handleUpdateJob(row) {
  resetJob()
  let form = JSON.parse(JSON.stringify(row))
  form.enabled = form.enabled !== 'N'
  formJob.value = form
  openJob.value = true
  title.value = proxy.$t('mntnactionbase.UpdateJobData')
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
      form.enabled = form.enabled ? 'Y' : 'N'

      jobFormLoading.value = true
      if (form.jobId) {
        updateJob(form).then((response) => {
          jobFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.UpdateOK'))
          openJob.value = false
          getJobList()
        }).catch(() => {
          jobFormLoading.value = false
        })
      } else {
        addJob(form).then((response) => {
          jobFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.AddOK'))
          openJob.value = false
          getJobList()
        }).catch(() => {
          jobFormLoading.value = false
        })
      }
    }
  })
}

/* job删除按钮 */
function handleDeleteJob(row) {
  proxy.$modal
    .confirm(proxy.$t('mntnactionbase.ConfirmDelete'))
    .then(() => {
      jobListLoading.value = true
      return deleteJob({ typeId: row.typeId, jobId: row.jobId })
    })
    .then(() => {
      jobListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.DeleteOK'))
      getJobList()
    })
    .catch(() => {
      jobListLoading.value = false
    })
}

// 选中job行
function handleCurrentJobChange(row) {
  if (row) {
    queryParamsLink.value.jobId = row.jobId
    linkJobName.value = row.jobName
    getLinkList()
  } else {
    queryParamsLink.value.jobId = undefined
    linkJobName.value = ''
    linkList.value = []
  }
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
/** 搜索按钮操作 */
function handleQueryLink() {
  getLinkList()
}
/** 重置按钮操作 */
function resetQueryLink() {
  proxy.resetForm('queryFormLink')
  handleQueryLink()
}

// 取消按钮
function cancelLink() {
  openLink.value = false
}
// 弹窗关闭
function closeLink() {
  resetLink()
}
// 弹窗打开
function linkOpened() {
  if (formLink.value.logicType === 'Procedure') {
    if (formLink.value.createTime) {
      const cur = procedureList.value.find(e => e.procedurE_NAME === formLink.value.logicProsql)
      if (cur && tableProcedure && tableProcedure.value) {
        tableProcedure.value.setCurrentRow(cur)
      }
    } else {
      tableProcedure.value.setCurrentRow()
    }
  }
}

// link表单重置
function resetLink() {
  formLink.value = {
    jobId: null,
    jobName: null,
    jobSeq: null,
    logicType: 'Procedure',
    logicDesc: null,
    logicProsql: null,
    inputParam: null,
    logicValue: null,
    enabled: true
  }
  proxy.resetLuxForm('formLinkRef')

  procedureName.value = ''
}

const isLinkEdit = ref(false)

/** link新增按钮操作 */
function handleAddLink() {
  if (!queryParamsLink.value.jobId) return

  isLinkEdit.value = false
  resetLink()
  formLink.value.jobId = queryParamsLink.value.jobId
  formLink.value.jobSeq = linkList.value.length ? +linkList.value[linkList.value.length - 1].jobSeq + 1 : 1
  openLink.value = true
  title.value = proxy.$t('mntnactionbase.AddLinkData')
}

/** link修改按钮操作 */
function handleUpdateLink(row) {
  isLinkEdit.value = true
  resetJob()
  let form = JSON.parse(JSON.stringify(row))
  form.enabled = form.enabled !== 'N'
  if (form.logicType === 'Procedure') {
    form.logicValue = `${form.logicProsql}(${form.inputParam})`
  } else {
    form.logicValue = form.logicProsql
  }
  formLink.value = form
  openLink.value = true
  title.value = proxy.$t('mntnactionbase.UpdateLinkData')
}

// 切换类型
function changeLogicType(val) {
  formLink.value.logicProsql = null
  formLink.value.inputParam = null
  formLink.value.logicValue = null

  if (val === 'SQL') {
    tableProcedure.value.setCurrentRow()
  }
}

const formLinkRef = ref(null)
const isLinkSumbit = ref(false)

// 选中程式
function selectProcedure(row) {
  if (!row) return

  if (formLink.value.logicType === 'Procedure') {
    formLink.value.logicProsql = row.procedurE_NAME
    formLink.value.inputParam = row.inpuT_PARAM
    formLink.value.logicValue = `${row.procedurE_NAME}(${row.inpuT_PARAM})`

    formLinkRef.value.$form.clearValidate(['logicValue'])
  }
}

/** link提交按钮 */
function submitFormLink() {
  isLinkSumbit.value = true
  formLinkRef.value.$form.validate((valid) => {
    isLinkSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formLink.value))
      form.enabled = form.enabled ? 'Y' : 'N'
      delete form.logicValue

      linkFormLoading.value = true
      if (form.createTime) {
        updateJobLink(form).then((response) => {
          linkFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.UpdateOK'))
          openLink.value = false
          getLinkList()
        }).catch(() => {
          linkFormLoading.value = false
        })
      } else {
        addJobLink(form).then((response) => {
          linkFormLoading.value = false
          proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.AddOK'))
          openLink.value = false
          getLinkList()
        }).catch(() => {
          linkFormLoading.value = false
        })
      }
    }
  })
}

/* link删除按钮 */
function handleDeleteLink(row) {
  proxy.$modal
    .confirm(proxy.$t('mntnactionbase.ConfirmDelete'))
    .then(() => {
      linkListLoading.value = true
      return deleteJobLink({ jobId: row.jobId, jobSeq: row.jobSeq })
    })
    .then(() => {
      linkListLoading.value = false
      proxy.$modal.msgSuccess(proxy.$t('mntnactionbase.DeleteOK'))
      getLinkList()
    })
    .catch(() => {
      linkListLoading.value = false
    })
}

/** 查询Procedure列表 */
function getProcedureList() {
  procedureLoading.value = true
  listProcedure(queryParamsProcedure.value).then((response) => {
    procedureLoading.value = false
    if (response.code == 200) {
      procedureList.value = response.data
    } else {
      procedureList.value = []
    }
  }).catch(() => {
    procedureLoading.value = false
  })
}

getTypeList()
getProcedureList()
</script>

<style scoped>
.card-box {
  margin-bottom: 0;
  padding: 10px;
  box-shadow: var(--el-box-shadow-light);
}
</style>