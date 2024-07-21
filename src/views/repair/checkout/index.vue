<template>
  <div class="app-container" v-loading="loading" element-loading-text="进维修..." element-loading-spinner="el-icon-loading">
    <p>
        <span style="font-size: 14px;font-weight: bolder;">站点信息：</span>
        <span :style="{color: stationInfo.stationName ? '' : 'red','font-size': '14px'}">{{ stationInfo.stationName || '当前未配置站点' }}</span>
      </p>
    <el-form :model="form" inline @submit.native.prevent>
      <el-form-item prop="sn">
        <el-input v-model="form.sn" placeholder="SN" @keyup.enter="repairIn"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="stationConfig.toggleVisible(true)">站点配置</el-button>
      </el-form-item>
    </el-form>
    
    <el-descriptions title="序号信息" :column="3" size="small" border>
      <el-descriptions-item>
        <template #label>工单</template>
        <el-input v-model="result.wo" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>料号</template>
        <el-input v-model="result.ipn" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>线别</template>
        <el-input v-model="result.lineName" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>制程</template>
        <el-input v-model="result.stationType" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>站点</template>
        <el-input v-model="result.stationName" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>描述</template>
        <el-input v-model="result.defectDesc2" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>工单类型</template>
        <el-input v-model="result.woType" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>状态</template>
        <el-input v-model="result.rpStatus" disabled />
      </el-descriptions-item>
    </el-descriptions>
    <div class="msgBox">
      <span class="msgContent" :style="{color: result.code == 200 ? 'green' : 'red'}">{{ result.code == 200 ? 'OK' : result.msg }}</span>
    </div>
    <Station-Config @changeStation="changeStation" ref="stationConfig" storageKey="checkOutStation" :op-types="['Repair']" :client-types="['MANU']"></Station-Config>
  </div>
</template>
<script setup>
import msg from '@/plugins/modal'
import { requestRepairOut } from '@/api/repair'

// 站点配置
const stationConfig = ref(null)
const str = localStorage.getItem('checkOutStation')
const stationInfo = ref(JSON.parse(str) || {})

const form = ref({})
const loading = ref(false)
const result = ref({})
async function repairIn() {
  if (!form.value.sn) {
    return msg.msgWarning('请输入SN')
  }
  if (!stationInfo.value?.stationName) {
    return msg.msgWarning('请配置站点SN')
  }
  try {
    loading.value = true
    const res = await requestRepairOut({ lblType: 'SN', sn: form.value.sn, ...stationInfo })
    if (res.code === 200) {
        result.value = res
        msg.msgSuccess('操作成功')
    }
  } catch (error) {
    result.value = error
  } finally {
    loading.value = false
  }
}

function changeStation(value) {
  stationInfo.value = value
}
</script>
<style scoped lang="scss">
.msgBox {
  height: 100px;
  background-color: RGB(210, 215, 217);
  text-align: center;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
  .msgContent {
    font-family: Arial, Helvetica, sans-serif;
    font-size: xx-large;
    font-weight: 800;
    color: blue;
  }
}
</style>
