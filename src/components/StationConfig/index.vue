<template>
  <div class="zr-dialog">
    <zr-dialog title="站点配置" v-model="open" width="66%" top="5vh">
      <div>
        <div class="header">
          <label>Factory</label>
          <el-select v-model="form.factory" @change="handleGetStations" size="small" placeholder="请选择工厂" style="padding-left: 15px; width: 300px">
            <el-option v-for="fa in factories" :key="fa" :label="fa" :value="fa"></el-option>
          </el-select>
        </div>
        <el-row>
          <el-col :span="12">
            <el-tree
              v-model="currentStation"
              @current-change="stationChange"
              :highlight-current="true"
              :data="stations"
              empty-text="选择工厂来查询站点列表"
              node-key="label"
              ref="stationTreeRef" />
          </el-col>
          <el-col :span="12">
            <el-descriptions title="站点信息" :column="1" size="small" border class="stationInfo">
              <el-descriptions-item>
                <template #label>Line</template>
                <el-input v-model="stationInfo.lineName" disabled />
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>Stage</template>
                <el-input v-model="stationInfo.stageName" disabled />
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>StationType</template>
                <el-input v-model="stationInfo.stationType" disabled />
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>Station</template>
                <el-input v-model="stationInfo.stationName" disabled />
              </el-descriptions-item>
            </el-descriptions>
            <!-- <div class="stationInfo">
              <div class="row">
                <el-text class="label">Line</el-text>
                <el-text color="red">{{ stationInfo.lineName }}</el-text>
              </div>
              <div class="row">
                <el-text class="label">Stage</el-text>
                <el-text color="red">{{ stationInfo.stageName }}</el-text>
              </div>
              <div class="row">
                <el-text class="label">StationType</el-text>
                <el-text color="red">{{ stationInfo.stationType }}</el-text>
              </div>
              <div class="row">
                <el-text class="label">Station</el-text>
                <el-text color="red">{{ stationInfo.stationName }}</el-text>
              </div>
            </div> -->
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span>
          <el-button @click="toggleVisible(false)">取消</el-button>
          <el-button @click="handleConfirm" type="primary">确定</el-button>
        </span>
      </template>
    </zr-dialog>
  </div>
</template>

<script setup>
import { getSites, getStations } from '@/api/repair'
import msg from '@/plugins/modal'
const props = defineProps({
  storageKey: {
    type: String,
    required: true
  },
  opTypes: {
    type: Array,
    default: []
  },
  clientTypes: {
    type: Array,
    default: []
  }
})

const emits = defineEmits(['changeStation'])
const open = ref(false)
const form = ref({})
const factories = ref([])
async function getFactory() {
  const res = await getSites()
  factories.value = res
}
getFactory()

function toggleVisible(value) {
  open.value = value
}

// 获取站点
const stations = ref([])
async function handleGetStations(val) {
  const res = await getStations({ site: val, opTypes: props.opTypes, clientTypes: props.clientTypes })
  stations.value = res
}

const currentStation = ref()
const stationInfo = ref({})
function stationChange(data, node) {
  stationInfo.value = {}
  let curNode = node
  do {
    const data = curNode.data
    if (data.iconIndex == 0) {
      stationInfo.value.lineName = data.label
    } else if (data.iconIndex == 1) {
      stationInfo.value.stageName = data.label
    } else if (data.iconIndex == 2) {
      stationInfo.value.stationType = data.label
    } else if (data.iconIndex == 3) {
      stationInfo.value.stationName = data.label
    }
  } while (((curNode = curNode.parent), !(curNode.data instanceof Array)))
}
function handleConfirm() {
  if (stationInfo.value.stationName) {
    localStorage.setItem(props.storageKey, JSON.stringify(stationInfo.value))
    msg.msgSuccess('站点配置成功')
    emits('changeStation', stationInfo.value)
    toggleVisible(false)
  } else {
    msg.msgWarning('请选择站点')
  }
}
defineExpose({ toggleVisible })
</script>

<style lang="scss" scoped>
.zr-dialog :deep(.el-dialog__body) {
  max-height: calc(90vh - 150px) !important;
  overflow: auto;
  .stationInfo {
    min-height: 300px;
    // display: flex;
    // flex-direction: column;
    position: sticky;
    top: 10px;
    .row {
      padding: 20px 0;
    }
    .label {
      font-weight: bold;
      margin-right: 10px;
    }
  }
}
</style>
