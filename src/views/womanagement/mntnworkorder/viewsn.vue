<template>
  <el-dialog :title="$t('mntnworkorder.sn.ViewSN')" :model-value="open" width="1200px" append-to-body
    :close-on-click-modal="false" @close="close">
    <el-form inline label-width="100px" style="display: flex;justify-content: space-between;">
      <div>
        <el-form-item :label="$t('mntnworkorder.sn.WorkOrder')">
          <span style="color: #1811c9;">{{ wo }}</span>
        </el-form-item>
        <el-form-item :label="$t('mntnworkorder.sn.Count')">
          <span style="color: #1811c9;">{{ snList.length }}</span>
        </el-form-item>
      </div>
      <!-- <el-form-item>
        <el-button type="warning" plain icon="Download" @click="handleExport">{{ $t('btn.export') }}</el-button>
      </el-form-item> -->
    </el-form>

    <el-table v-loading="snListLoading" :data="snList" height="500px" border stripe>
      <el-table-column prop="worK_ORDER" :label="$t('mntnworkorder.sn.worK_ORDER')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="seriaL_NUMBER" :label="$t('mntnworkorder.sn.seriaL_NUMBER')" align="center"
        :show-overflow-tooltip="true" width="200px" />
      <el-table-column prop="customeR_SN" :label="$t('mntnworkorder.sn.customeR_SN')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="paneL_NO" :label="$t('mntnworkorder.sn.paneL_NO')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="ipn" :label="$t('mntnworkorder.sn.ipn')" align="center" :show-overflow-tooltip="true"
        width="150px" />
      <el-table-column prop="version" :label="$t('mntnworkorder.sn.version')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="line" :label="$t('mntnworkorder.sn.line')" align="center" :show-overflow-tooltip="true"
        width="150px" />
      <el-table-column prop="stage" :label="$t('mntnworkorder.sn.stage')" align="center" :show-overflow-tooltip="true"
        width="150px" />
      <el-table-column prop="statioN_TYPE" :label="$t('mntnworkorder.sn.statioN_TYPE')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="currenT_STATUS" :label="$t('mntnworkorder.sn.currenT_STATUS')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="scrap" :label="$t('mntnworkorder.sn.scrap')" align="center" :show-overflow-tooltip="true"
        width="150px" />
      <el-table-column prop="iN_PROCESS_TIME" :label="$t('mntnworkorder.sn.iN_PROCESS_TIME')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="ouT_PROCESS_TIME" :label="$t('mntnworkorder.sn.ouT_PROCESS_TIME')" align="center"
        :show-overflow-tooltip="true" width="180px" />
      <el-table-column prop="iN_PDLINE_TIME" :label="$t('mntnworkorder.sn.iN_PDLINE_TIME')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="ouT_PDLINE_TIME" :label="$t('mntnworkorder.sn.ouT_PDLINE_TIME')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="boX_NO" :label="$t('mntnworkorder.sn.boX_NO')" align="center" :show-overflow-tooltip="true"
        width="150px" />
      <el-table-column prop="cartoN_NO" :label="$t('mntnworkorder.sn.cartoN_NO')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="palleT_NO" :label="$t('mntnworkorder.sn.palleT_NO')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="qC_NO" :label="$t('mntnworkorder.sn.qC_NO')" align="center" :show-overflow-tooltip="true"
        width="150px" />
      <el-table-column prop="qC_RESULT" :label="$t('mntnworkorder.sn.qC_RESULT')" align="center"
        :show-overflow-tooltip="true" width="150px" />
      <el-table-column prop="reworK_NO" :label="$t('mntnworkorder.sn.reworK_NO')" align="center"
        :show-overflow-tooltip="true" width="160px" />
      <el-table-column prop="sN_VERSION" :label="$t('mntnworkorder.sn.sN_VERSION')" align="center"
        :show-overflow-tooltip="true" width="150px" />
    </el-table>
  </el-dialog>
</template>

<script setup name="woviewsn">
import { listSnByWo } from '@/api/mescommon/mesget'

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

const snList = ref([])
const snListLoading = ref(false)
function getList() {
  snList.value = []
  snListLoading.value = true
  listSnByWo({ workOrder: props.wo }).then(res => {
    snListLoading.value = false
    snList.value = res?.data || []
  }).catch(() => {
    snListLoading.value = false
  })
}

function handleExport() { }
</script>