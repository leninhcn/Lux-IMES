<template>
  <div class="app-container" v-loading="loading" element-loading-text="检查SN..." element-loading-spinner="el-icon-loading">
    <p>
      <span style="font-size: 14px; font-weight: bolder">站点信息：</span>
      <span :style="{ color: stationInfo.stationName ? '' : 'red', 'font-size': '14px' }">{{ stationInfo.stationName || '当前未配置站点' }}</span>
    </p>
    <el-form :model="form" inline @submit.native.prevent>
      <el-form-item>
        <el-button @click="stationConfig.toggleVisible(true)">站点配置</el-button>
      </el-form-item>
      <el-form-item prop="sn">
        <el-input ref="snInp" v-model="form.sn" placeholder="SN" @keyup.enter="handleSnPress"></el-input>
      </el-form-item>
    </el-form>
    <!-- <el-descriptions title="序号信息" :column="3" size="small" border>
      <el-descriptions-item>
        <template #label>工单</template>
        <el-input v-model="result.wo" disabled />
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>料号</template>
        <el-input v-model="result.partNo" disabled />
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
    </el-descriptions> -->

    <!-- <el-table :data="result.lvkps" border heigth="200px" @selection-change="selectionChange">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="iteM_IPN" label="Keypart No"></el-table-column>
      <el-table-column prop="iteM_SN" label="Keypart SN"></el-table-column>
      <el-table-column prop="speC1" label="Spec"></el-table-column>
      <el-table-column prop="iteM_SN_CUSTOMER" label="Customer part SN"></el-table-column>
    </el-table> -->

    <!-- <div class="msgBox">
      <span class="msgContent" :style="{color: result.code == 200 ? 'green' : 'red'}">{{ result.code == 200 ? 'OK' : result.msg }}</span>
    </div> -->
    <Station-Config @changeStation="changeStation" ref="stationConfig" storageKey="printStation" :op-types="['Repair']" :client-types="['MANU']"></Station-Config>

    <zr-dialog title="密码验证" v-model="pwdVisible" width="40%" top="5vh">
      <el-form ref="pwdRef" :model="pwdForm" :rules="pwdRules" label-width="90px">
        <el-form-item prop="empno" label="不良代码">
          <el-input v-model="pwdForm.empno"></el-input>
        </el-form-item>
        <el-form-item prop="pwd" label="不良位置">
          <el-input v-model="pwdForm.pwd"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="pwdVisible = false">取消</el-button>
          <el-button @click="handlePwdConfirm(pwdRef)" type="primary">确定</el-button>
        </span>
      </template>
    </zr-dialog>
  </div>
</template>
<script setup>
import msg from '@/plugins/modal'
import { checkPrintSN,chekPrintRole, getLabelInfo } from '@/api/repair'

// 站点配置
const stationConfig = ref(null)
const str = localStorage.getItem('printStation')
const stationInfo = ref(JSON.parse(str) || {})

const form = ref({})
const loading = ref(false)
const result = ref({})
const pwdVisible = ref(false)
const snInp = ref(null)
async function handleSnPress() {
  if (!form.value.sn) {
    return msg.msgWarning('请输入SN')
  }
  if (!stationInfo.value?.stationName) {
    return msg.msgWarning('请配置站点')
  }
  try {
    loading.value = true
    await checkPrintSN({ sn: form.value.sn })
    pwdVisible.value = true
  } catch (error) {
    result.value = error
    snInp.value.focus()
    snInp.value.select()
  } finally {
    loading.value = false
  }
}


const pwdForm = ref({})
const pwdRules = ref({
  empno: [{required: true, message: "请输入工号"}],
  pwd: [{required: true, message: "请输入密码"}],
})
const printContent = ref(null)
async function handlePwdConfirm(formEl) {
  if (!formEl) {
    return 
  }
  await formEl.validate(async valid => {
    if (valid) {
      await chekPrintRole(pwdForm.value)
      await getLabelInfo({SN: form.sn, pStationType: stationInfo.sstationType})
    }
  })

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
