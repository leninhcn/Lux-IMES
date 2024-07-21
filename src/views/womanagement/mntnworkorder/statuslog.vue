<template>
  <el-dialog :title="$t('mntnworkorder.status.StatusLog')" :model-value="open" width="900px" append-to-body
    :close-on-click-modal="false" @close="close">
    <el-form inline label-width="100px" style="display: flex;justify-content: space-between;">
      <div>
        <el-form-item :label="$t('mntnworkorder.status.WorkOrder')">
          <span style="color: #1811c9;">{{ wo }}</span>
        </el-form-item>
        <el-form-item :label="$t('mntnworkorder.status.Count')">
          <span style="color: #1811c9;">{{ statusList.length }}</span>
        </el-form-item>
      </div>
      <!-- <el-form-item>
        <el-button type="warning" plain icon="Download" @click="handleExport">{{ $t('btn.export') }}</el-button>
      </el-form-item> -->
    </el-form>

    <el-table v-loading="statusListLoading" :data="statusList" height="500px" border stripe>
      <el-table-column prop="wO_STATUS" :label="$t('mntnworkorder.status.wO_STATUS')" align="center"
        :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="updatE_TIME" :label="$t('mntnworkorder.status.updatE_TIME')" align="center"
        :show-overflow-tooltip="true" min-width="200px" />
      <el-table-column prop="wO_STATUS" :label="$t('mntnworkorder.status.wO_STATUS_TXT')" align="center"
        :show-overflow-tooltip="true" min-width="150px">
        <template #default="scope">
          <dict-tag :options="wostatusOptions" :value="scope.row.wO_STATUS" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('mntnworkorder.status.remark')" align="center"
        :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="updatE_EMPNO" :label="$t('mntnworkorder.status.updatE_EMPNO')" align="center"
        :show-overflow-tooltip="true" min-width="150px" />
    </el-table>
  </el-dialog>
</template>

<script setup name="wostatuslog">
import { getWoStatusLog } from '@/api/womanagement/mntnworkorder'
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

const statusList = ref([])
const statusListLoading = ref(false)
function getList() {
  statusList.value = []
  statusListLoading.value = true
  getWoStatusLog({ workOrder: props.wo }).then(res => {
    statusListLoading.value = false
    statusList.value = res?.data || []
  }).catch(() => {
    statusListLoading.value = false
  })
}

function handleExport() { }
</script>