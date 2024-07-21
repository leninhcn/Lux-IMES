<template>
  <el-dialog :title="$t('mntnworkorder.history.HistoryLog')" :model-value="open" width="1200px" append-to-body
    :close-on-click-modal="false" @close="close">
    <el-table v-loading="historyListLoading" :data="historyList" height="500px" border stripe>
      <el-table-column prop="workOrder" :label="$t('mntnworkorder.history.workOrder')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="woType" :label="$t('mntnworkorder.history.woType')" align="center"
        :show-overflow-tooltip="true" width="130px" />
      <el-table-column prop="model" :label="$t('mntnworkorder.history.model')" align="center"
        :show-overflow-tooltip="true" width="120px" />
      <el-table-column prop="ipn" :label="$t('mntnworkorder.history.ipn')" align="center" :show-overflow-tooltip="true"
        width="150px" />
      <el-table-column prop="speC1" :label="$t('mntnworkorder.history.speC1')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="version" :label="$t('mntnworkorder.history.version')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="targetQty" :label="$t('mntnworkorder.history.targetQty')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="inputQty" :label="$t('mntnworkorder.history.inputQty')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="outputQty" :label="$t('mntnworkorder.history.outputQty')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="scrapQty" :label="$t('mntnworkorder.history.scrapQty')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="ngQty" :label="$t('mntnworkorder.history.ngQty')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="woCreateDate" :label="$t('mntnworkorder.history.woCreateDate')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="woScheduleStartDate" :label="$t('mntnworkorder.history.woScheduleStartDate')"
        align="center" :show-overflow-tooltip="true" width="120px">
        <template #default="scope">
          <span>{{ parseTime(scope.row.woScheduleStartDate, 'YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="woStartDate" :label="$t('mntnworkorder.history.woStartDate')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="woCloseDate" :label="$t('mntnworkorder.history.woCloseDate')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="remark" :label="$t('mntnworkorder.history.remark')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="woStatus" :label="$t('mntnworkorder.history.woStatus')" align="center"
        :show-overflow-tooltip="true" width="150px">
        <template #default="scope">
          <dict-tag :options="wostatusOptions" :value="scope.row.woStatus" />
        </template>
      </el-table-column>
      <el-table-column prop="line" :label="$t('mntnworkorder.history.line')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="lineType" :label="$t('mntnworkorder.history.lineType')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="routeName" :label="$t('mntnworkorder.history.routeName')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="startStationType" :label="$t('mntnworkorder.history.startStationType')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="endStationType" :label="$t('mntnworkorder.history.endStationType')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="snRule" :label="$t('mntnworkorder.history.snRule')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="cartonRule" :label="$t('mntnworkorder.history.cartonRule')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="boxRule" :label="$t('mntnworkorder.history.boxRule')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="palletRule" :label="$t('mntnworkorder.history.palletRule')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="ruleSetName" :label="$t('mntnworkorder.history.ruleSetName')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="pkspecName" :label="$t('mntnworkorder.history.pkspecName')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="workFlag" :label="$t('mntnworkorder.history.workFlag')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="updateTime" :label="$t('mntnworkorder.history.updateTime')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="updateEmpno" :label="$t('mntnworkorder.history.updateEmpno')" align="center"
        :show-overflow-tooltip="true" width="150px" />
    </el-table>
  </el-dialog>
</template>

<script setup name="wohistorylog">
import { getWoBaseHistory } from '@/api/womanagement/mntnworkorder'
const { proxy } = getCurrentInstance()

const emit = defineEmits(['close', 'update:open'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  wo: {
    type: String,
    default: ''
  }
})
watch(
  () => props.open,
  (nVal, oVal) => {
    if (nVal) {
      getList()
    }
  }
)

const wostatusOptions = ref([])
proxy.getDicts('wostatus').then((response) => {
  wostatusOptions.value = response.data
})

function close() {
  emit('update:open', false)
  emit('close')
}

const historyList = ref([])
const historyListLoading = ref(false)
function getList() {
  historyList.value = []
  historyListLoading.value = true
  getWoBaseHistory({ workOrder: props.wo }).then(res => {
    historyListLoading.value = false
    historyList.value = res?.data || []
  }).catch(() => {
    historyListLoading.value = false
  })
}
</script>