<template>
  <el-dialog :title="$t('mntnworkorder.panel.ViewPanelSN')" :model-value="open" width="1000px" append-to-body
    :close-on-click-modal="false" @close="close">
    <el-form inline label-width="100px" style="display: flex;justify-content: space-between;">
      <div>
        <el-form-item :label="$t('mntnworkorder.panel.WorkOrder')">
          <span style="color: #1811c9;">{{ wo }}</span>
        </el-form-item>
        <el-form-item :label="$t('mntnworkorder.panel.Count')">
          <span style="color: #1811c9;">{{ panelList.length }}</span>
        </el-form-item>
      </div>
      <!-- <el-form-item>
        <el-button type="warning" plain icon="Download" @click="handleExport">{{ $t('btn.export') }}</el-button>
      </el-form-item> -->
    </el-form>

    <el-table v-loading="panelListLoading" :data="panelList" height="500px" border stripe>
      <el-table-column prop="worK_ORDER" :label="$t('mntnworkorder.panel.worK_ORDER')" align="center"
        :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="paneL_NO" :label="$t('mntnworkorder.panel.paneL_NO')" align="center"
        :show-overflow-tooltip="true" min-width="150px" />
      <el-table-column prop="ipn" :label="$t('mntnworkorder.panel.ipn')" align="center" :show-overflow-tooltip="true"
        min-width="150px" />
      <el-table-column prop="status" :label="$t('mntnworkorder.panel.status')" align="center"
        :show-overflow-tooltip="true" min-width="100px" />
      <el-table-column prop="closE_FLAG" :label="$t('mntnworkorder.panel.closE_FLAG')" align="center"
        :show-overflow-tooltip="true" min-width="120px" />
      <el-table-column prop="creatE_TIME" :label="$t('mntnworkorder.panel.creatE_TIME')" align="center"
        :show-overflow-tooltip="true" min-width="160px" />
    </el-table>
  </el-dialog>
</template>

<script setup name="woviewpanelsn">
import { listPanelByWo } from '@/api/mescommon/mesget'

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

function close() {
  emit('update:open', false)
  emit('close')
}

const panelList = ref([])
const panelListLoading = ref(false)
function getList() {
  panelList.value = []
  panelListLoading.value = true
  listPanelByWo({ workOrder: props.wo }).then(res => {
    panelListLoading.value = false
    panelList.value = res?.data || []
  }).catch(() => {
    panelListLoading.value = false
  })
}

function handleExport() { }
</script>