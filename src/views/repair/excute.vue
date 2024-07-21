<template>
  <div class="app-container" v-loading="loading" element-loading-text="进维修..." element-loading-spinner="el-icon-loading">
    <p>
      <span style="font-size: 14px; font-weight: bolder">站点信息：</span>
      <span :style="{ color: stationInfo.stationName ? '' : 'red', 'font-size': '14px' }">{{ stationInfo.stationName || '当前未配置站点' }}</span>
    </p>
    <el-form :model="form" inline @submit.native.prevent class="myFormInline">
      <el-form-item>
        <el-button @click="stationConfig.toggleVisible(true)">站点配置</el-button>
      </el-form-item>
      <el-form-item prop="sn">
        <el-input ref="snInp" v-model.trim="form.sn" placeholder="SN" @keyup.enter="onSNKeyPress"></el-input>
      </el-form-item>
      <el-form-item prop="empNo">
        <el-input ref="empNo" v-model.trim="form.empNo" placeholder="维修人员" @keyup.enter="onEmpNoKeyPress" style="width: 200px">
          <template #append>{{ empName }}</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onRepair">维修</el-button>
        <el-button @click="handleRemove(true)">移除</el-button>
        <el-button @click="handleRemove(false)">替换</el-button>
        <!-- <el-button>防错料LC</el-button> -->
        <el-button @click="returnStationVisible = true" type="success">完成</el-button>
        <el-button @click="handleScrap" type="danger">报废</el-button>
      </el-form-item>
    </el-form>
    <el-descriptions title="序号信息" :column="3" size="small" border>
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
    </el-descriptions>
    <div style="margin: 5px 0;">
      <span style="font-size: 14px;font-weight: bold">不良信息</span>
      <el-button type="primary" @click="handleAddDefect" size="small" style="margin-left: 10px">新增</el-button>
      <el-button type="danger" @click="handledeleteDefect" size="small">删除</el-button>
    </div>
    <el-row>
      <el-col :span="8">
        <el-table ref="defectInfo" :data="result.lvdef" border heigth="200px" @current-change="handleDefectChange" highlight-current-row>
          <el-table-column prop="defectCode" label="不良代码"></el-table-column>
          <el-table-column prop="defecT_DESC" label="不良描述"></el-table-column>
          <el-table-column prop="defecT_DESC2" label="不良描述2"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="16">
        <el-table :data="reasonList" border heigth="200px">
          <el-table-column prop="reasoN_CODE" label="Reason Code" min-width="100px" align="center"></el-table-column>
          <el-table-column prop="reasoN_DESC" label="Description" min-width="100px" align="center"></el-table-column>
          <el-table-column prop="location" label="Location" min-width="100px" align="center"></el-table-column>
          <el-table-column prop="suggesT_SCRAPE" label="Suggest Scrape" min-width="120px" align="center"></el-table-column>
          <el-table-column prop="suggesT_SCRAPE" label="Remark" min-width="100px" align="center"></el-table-column>
          <el-table-column prop="iteM_SN_CUSTOMER" label="Customer part SN" min-width="130px" align="center"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <Station-Config
      @changeStation="changeStation"
      ref="stationConfig"
      storageKey="excuteStation"
      :op-types="['Repair']"
      :client-types="['MANU']"></Station-Config>

    <zr-dialog title="维修" v-model="repairVisible" width="66%" top="5vh">
      <el-descriptions :column="3" size="small" border style="margin-bottom: 12px">
        <el-descriptions-item>
          <template #label>序号</template>
          <el-input v-model="form.sn" disabled />
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label>制程</template>
          <el-input v-model="currentRow.statioN_TYPE" disabled />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>不良代码</template>
          <el-input v-model="currentRow.defectCode" disabled />
        </el-descriptions-item>
        <el-descriptions-item min-width="80px">
          <template #label>不良描述</template>
          <el-input v-model="currentRow.defecT_DESC" disabled />
        </el-descriptions-item>
        <el-descriptions-item min-width="80px">
          <template #label>不良描述2</template>
          <el-input v-model="currentRow.defecT_DESC2" disabled />
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>不良原因类型</template>
          <el-select v-model="currentRow.reasonType" @change="reasonTypeChange">
            <el-option v-for="item in reasonTypeOptions" :label="item.reasoN_TYPE" :value="item.reasoN_TYPE" :key="item.reasoN_TYPE"></el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item min-width="80px">
          <template #label>不良原因</template>
          <el-select v-model="currentRow.reasonCode" filterable no-data-text="没有找到该不良原因类型下的不良原因代码">
            <el-option v-for="item in reasonDefeOptions" :label="item.reasoN_DESC" :value="item.reasoN_CODE" :key="item.reasoN_CODE"> </el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>备注</template>
          <el-input v-model="currentRow.remark"></el-input>
        </el-descriptions-item>
        <el-descriptions-item min-width="120px">
          <template #label>Defects Symptom</template>
          <el-input v-model="currentRow.defectsSym"></el-input>
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="Repair Item" :column="3" size="small" border>
        <template #extra>
          <el-button type="primary" size="small" @click="addItem">Add item</el-button>
        </template>
        <el-descriptions-item>
          <template #label>ActionValidate</template>
          <el-select v-model="currentRow.action" filterable>
            <el-option v-for="(item, i) in actionValidateOptions" :label="item" :value="item" :key="i"> </el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>Location</template>
          <el-select v-model="currentRow.location" style="min-width: 120px" allow-create filterable>
            <el-option v-for="(item, i) in locationOptions" :label="item.location" :value="item.location" :key="i"></el-option>
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>维修动作</template>
          <el-input v-model="currentRow.remark1"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>Old CSN</template>
          <el-input ref="oldSn" v-model="currentRow.oldsn" @keyup.enter="handleOldCsnEnter"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>New CSN</template>
          <el-input ref="newSn" v-model="currentRow.newSn" @keyup.enter="handleNewCsnEnter"></el-input>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>Old CPN</template>
          <el-input ref="oldCpn" v-model="currentRow.oldcpn" @keyup.enter="handleOldCpnEnter"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>DateCode</template>
          <el-input ref="oldCpn" v-model="currentRow.dateCode"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>LotCode</template>
          <el-input ref="oldCpn" v-model="currentRow.lotCode"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>Vendor</template>
          <el-input ref="oldCpn" v-model="currentRow.vendor"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>Old Reel</template>
          <el-input ref="oldCpn" v-model="currentRow.oldreel"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>New CPN</template>
          <el-input ref="newCpn" v-model="currentRow.newCPN" @keyup.enter="handleNewCpnEnter"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>DateCode</template>
          <el-input ref="oldCpn" v-model="currentRow.dateCode1"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>LotCode</template>
          <el-input ref="oldCpn" v-model="currentRow.lotCode1"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>Vendor</template>
          <el-input ref="oldCpn" v-model="currentRow.vendor1"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>New Reel</template>
          <el-input ref="oldCpn" v-model="currentRow.newReel"></el-input>
        </el-descriptions-item>
      </el-descriptions>
      <el-table :data="repairTableData" border heigth="200px" @selection-change="selectionChange">
        <el-table-column label="Action" prop="action" min-width="100"></el-table-column>
        <el-table-column label="Location" prop="location" min-width="100"></el-table-column>
        <el-table-column label="Old CSN" prop="oldsn" min-width="100"></el-table-column>
        <el-table-column label="New CSN" prop="newSn" min-width="100"></el-table-column>
        <el-table-column label="Old CPN" prop="oldcpn" min-width="100"></el-table-column>
        <el-table-column label="DateCode" prop="dateCode" min-width="100"></el-table-column>
        <el-table-column label="LotCode" prop="lotCode" min-width="100"></el-table-column>
        <el-table-column label="Vendor" prop="vendor" min-width="100"></el-table-column>
        <el-table-column label="Old Reel" prop="oldreel" min-width="100"></el-table-column>
        <el-table-column label="New CPN" prop="newCPN" min-width="100"></el-table-column>
        <el-table-column label="DateCode" prop="dateCode1" min-width="100"></el-table-column>
        <el-table-column label="LotCode" prop="lotCode1" min-width="100"></el-table-column>
        <el-table-column label="Vendor" prop="vendor1" min-width="100"></el-table-column>
        <el-table-column label="New Reel" prop="newReel1" min-width="100"></el-table-column>
      </el-table>
      <template #footer>
        <span>
          <el-button @click="repairVisible = false">取消</el-button>
          <el-button @click="handleRepairConfirm" type="primary">确定</el-button>
        </span>
      </template>
    </zr-dialog>

    <zr-dialog title="Replace keyparts" v-model="replaceVisible" width="66%" top="5vh">
      <el-descriptions title="Keyparts" size="small">
        <el-descriptions-item>
          <el-table :data="kpsnList" border heigth="200px" highlight-current-row @current-change="handleKeypartChange">
            <el-table-column label="Item Part" prop="iteM_IPN" min-width="100" align="center"></el-table-column>
            <el-table-column label="Item SN" prop="iteM_SN" min-width="100" align="center"></el-table-column>
            <el-table-column label="Item Group" prop="iteM_GROUP" min-width="100" align="center"></el-table-column>
            <el-table-column label="Item SN Customer" prop="iteM_SN_CUSTOMER" min-width="130" align="center"></el-table-column>
            <el-table-column label="Work Order" prop="worK_ORDER" min-width="100" align="center"></el-table-column>
            <el-table-column label="Station Type" prop="statioN_TYPE" min-width="100" align="center"></el-table-column>
            <el-table-column label="Part Type" prop="parT_TYPE" min-width="100" align="center"></el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="Replace" size="small" :column="2">
        <el-descriptions-item>
          <template #label> New KPSN </template>
          <el-input ref="kpsnInp" v-model.trim="replaceForm.kpsn" @keyup.enter="handleKpsnEnter"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> RID </template>
          <el-input ref="ridInp" v-model.trim="replaceForm.rid" @keyup.enter="handleRidEnter"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> L/C </template>
          <el-input ref="lcInp" v-model.trim="replaceForm.lc" @keyup.enter="handleLcEnter"></el-input>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> D/C </template>
          <el-input ref="dcInp" v-model.trim="replaceForm.dc" @keyup.enter="handleDcEnter"></el-input>
        </el-descriptions-item>
        <el-descriptions-item :span="2" v-if="!isRemove">
          <el-table :data="replaceList" border heigth="200px">
            <el-table-column label="Part Type" prop="partType" min-width="100" align="center"></el-table-column>
            <el-table-column label="Input Value" prop="inputValue" min-width="100" align="center"></el-table-column>
            <el-table-column label="RID" prop="rid" min-width="100" align="center"></el-table-column>
            <el-table-column label="L/C" prop="lc" min-width="100" align="center"></el-table-column>
            <el-table-column label="D/C" prop="dc" min-width="100" align="center"></el-table-column>
          </el-table>
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template #label> Broken？ </template>
          <el-radio-group v-model="replaceForm.isBroken" :disabled="isBrokenDisabled" @change="handleBrokenChange">
            <el-radio :value="true" size="large">Yes</el-radio>
            <el-radio :value="false" size="large">No</el-radio>
          </el-radio-group>
          <el-table :data="defectList" border heigth="200px">
            <el-table-column prop="defecT_CODE" label="不良代码"></el-table-column>
            <el-table-column prop="defecT_DESC" label="不良描述"></el-table-column>
            <el-table-column prop="id" label="ID"></el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span>
          <el-button @click="replaceVisible = false">取消</el-button>
          <el-button @click="handleRemoveReplaceConfirm" type="primary">{{ isRemove ? 'Remove' : 'Replace' }}</el-button>
        </span>
      </template>
    </zr-dialog>

    <!-- 不良信息新增 -->
    <zr-dialog title="新增不良" v-model="defectAddVisible" width="40%" top="5vh">
      <el-form ref="defectRef" :model="defectForm" :rules="defectRules" label-width="90px">
        <el-form-item prop="sDefCode" label="不良代码">
          <el-input v-model="defectForm.sDefCode"></el-input>
        </el-form-item>
        <el-form-item prop="sLocation" label="不良位置">
          <el-input v-model="defectForm.sLocation"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="defectAddVisible = false">取消</el-button>
          <el-button @click="handleDefectAddConfirm(defectRef)" type="primary">确定</el-button>
        </span>
      </template>
    </zr-dialog>

    <!-- 维修完成 -->
    <zr-dialog title="回流站点" v-model="returnStationVisible" width="40%" top="5vh">
      <el-select v-model="reStation">
        <el-option
          v-for="item in returnOptions"
          :label="item.nexT_STATION_TYPE"
          :value="item.nexT_STATION_TYPE"
          :key="item.nexT_STATION_TYPE"></el-option>
      </el-select>
      <template #footer>
        <span>
          <el-button @click="returnStationVisible = false">取消</el-button>
          <el-button @click="handleFinishConfirm" type="primary">确定</el-button>
        </span>
      </template>
    </zr-dialog>

    <!-- 报废 -->
    <zr-dialog title="报废" v-model="scrapVisible" width="40%" top="5vh">
      <el-form ref="scrapRef" :model="scrapForm" :rules="scrapRules" label-width="70px">
        <el-form-item prop="sn" label="SN">
          <el-input v-model="form.sn" disabled></el-input>
        </el-form-item>
        <el-form-item prop="scrapMemo" label="Memo">
          <el-input type="textarea" v-model="scrapForm.scrapMemo"></el-input>
        </el-form-item>
        <el-form-item prop="scrapType">
          <el-radio-group v-model="scrapForm.scrapType">
            <el-radio value="Scrap">Scrap</el-radio>
            <el-radio value="Return Material">Return Material</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="scrapVisible = false">取消</el-button>
          <el-button @click="handleScrapConfirm(scrapRef)" type="primary">确定</el-button>
        </span>
      </template>
    </zr-dialog>
  </div>
</template>
<script setup>
import msg from '@/plugins/modal'
import {
  linkRemove,
  getInfoBySn,
  getEmpName,
  checkRepairOP,
  repairDefReasonType,
  getDefReason,
  getACTValidate,
  checkOldCSN,
  getLocation,
  checkNewCSN,
  checkOldCPN,
  checkNewCPN,
  getKPReplaceInfo,
  repairDataOK,
  getReason,
  getKpsn,
  editDefect,
  defRemoveKP,
  checkNewKPSN,
  defReplaceKP,
  getReturnStation,
  repairFinish,
  repairScrap,
  addDefect,
  delDefect
} from '@/api/repair'

// 站点配置
const stationConfig = ref(null)
const str = localStorage.getItem('excuteStation')
const stationInfo = ref(JSON.parse(str) || {})

const form = ref({})
const loading = ref(false)
const result = ref({})

function changeStation(value) {
  stationInfo.value = value
}

let selected = []
function selectionChange(selection) {
  selected = selection
}

const repairVisible = ref(false)
const selectRecidToRepair = ref([])
const currentRow = ref({})
async function onRepair() {
  if (!form.value.sn) {
    return msg.msgWarning('请输入SN')
  }
  if (!form.value.empNo) {
    return msg.msgWarning('请输入员工工号')
  }
  const ipnpre = result.value?.partNo.trim().substring(0, 4)
  if (
    ipnpre.includes('ST00') ||
    ipnpre.includes('SF00') ||
    ipnpre.includes('SO00') ||
    ipnpre.includes('PC00') ||
    ipnpre.includes('SS00') ||
    ipnpre.includes('8031')
  ) {
    return msg.confirm('如需要替换成品KeyPart，请先进行替换，再进行维修，请确认!!!')
  }
  const res = await checkRepairOP({ ...result.value, repairEmpNo: form.value.empNo, sn: form.value.sn })
  if (res.code === 200) {
    selectRecidToRepair.value = result.value?.lvdef.filter((item) => res.data.selectRecid.includes(item.recid))
    currentRow.value = result.value?.lvdef[0]
    getLocationOptions()
  }
  repairVisible.value = true
}

// 获取不良原因类型
const reasonTypeOptions = ref([])
async function getRepairDefReasonType() {
  const res = await repairDefReasonType()
  reasonTypeOptions.value = res.data
}
getRepairDefReasonType()

// 根据不良原因类型获取不良原因
const reasonDefeOptions = ref([])
async function reasonTypeChange(value) {
  if (!value) {
    return msg.msgWarning('不良原因类型不能为空,请选择不良原因类型!!!')
  }

  const res = await getDefReason({ reasonType: value })
  if (res.code === 200) {
    reasonDefeOptions.value = res.data
  }
}

// 获取action validate
const actionValidateOptions = ref([])
async function getActionValidate() {
  const res = await getACTValidate()
  if (res.code === 200) {
    actionValidateOptions.value = res.data
  }
}
getActionValidate()

// 获取location
const locationOptions = ref([])
async function getLocationOptions() {
  const res = await getLocation({ gSN: form.value.sn, defCode: currentRow.value.defectCode })
  locationOptions.value = res.data
}

// old csn回车事件处理
const oldSn = ref(null)
async function handleOldCsnEnter() {
  if (!currentRow.value.oldsn) {
    return msg.msgError('Old keypart SN is null')
  }
  try {
    await checkOldCSN({ gSN: form.value.sn, oldsn: currentRow.value.oldsn })
  } catch (error) {
    currentRow.value.oldsn = null
    oldSn.value.focus()
  }
}

const newSn = ref(null)
async function handleNewCsnEnter() {
  if (!currentRow.value.newSn) {
    return msg.msgError('New keypart SN is null')
  }
  if (!currentRow.value.oldsn) {
    return msg.msgError('Old keypart SN is null')
  }
  try {
    await checkNewCSN({ gSN: form.value.sn, oldsn: currentRow.value.oldsn, newSn: currentRow.value.newSn })
  } catch (error) {
    currentRow.value.newSn = null
    newSn.value.focus()
  }
}

// old cpn回车事件处理
const oldCpn = ref(null)
async function handleOldCpnEnter() {
  if (!currentRow.value.oldcpn) {
    return msg.msgError('旧料号的输入不能为空，请确认')
  }
  try {
    await checkOldCPN({ oldcpn: currentRow.value.oldcpn })
  } catch (error) {
    currentRow.value.oldcpn = null
    oldCpn.value.focus()
  }
}

const newCpn = ref(null)
async function handleNewCpnEnter() {
  if (!currentRow.value.newCPN) {
    return msg.msgError('新料号的输入不能为空，请确认')
  }
  try {
    await checkNewCPN({ newCPN: currentRow.value.newCPN })
  } catch (error) {
    currentRow.value.newCpn = null
    newCpn.value.focus()
  }
}

// addItem
const repairTableData = ref([])
async function addItem() {
  const res = await getKPReplaceInfo({ gSN: form.value.sn, gRecid: currentRow.value.recid })
  if (res.data?.length) {
    const info = res.data[res.data.length - 1]
    currentRow.value.oldsn = info.olD_IPN_SN
    currentRow.value.oldcpn = info.iteM_IPN
    currentRow.value.newCPN = info.iteM_IPN
    currentRow.value.newsn = info.neW_IPN_SN
  }
  if (!currentRow.value.reasonType) {
    return msg.msgWarning('不良原因类型不能为空,请选择不良原因类型!!!')
  }
  if (!currentRow.value.reasonCode) {
    return msg.msgWarning('不良原因不能为空,请选择不良代码!!!')
  }
  if (!currentRow.value.action) {
    return msg.msgWarning('ActionValidate不能为空,请选择验证行为!!!')
  }
  if (!currentRow.value.location) {
    return msg.msgWarning('Location不能为空,请选择或填写不良位置!!!')
  }
  if (!currentRow.value.remark1) {
    return msg.msgWarning('维修动作不能为空,请填写维修动作!!!')
  }
  if (!currentRow.value.remark) {
    return msg.msgWarning('备注不能为空!!!')
  }

  repairTableData.value.push({ ...currentRow.value })
}

// 维修确认
async function handleRepairConfirm() {
  await repairDataOK({
    repairRes: { ...stationInfo.value, sn: form.value.sn, defectRecID: currentRow.value.recid },
    gsn: form.value.sn,
    ...currentRow.value,
    repLiData: repairTableData.value
  })
  repairVisible.value = false
  getReasonList()
  repairTableData.value = []
}

// getReason
const reasonList = ref([])
async function getReasonList() {
  const res = await getReason({ sn: form.value.sn, recid: currentRow.value.recid })
  reasonList.value = res.data
}

// 获取sn信息
const snInp = ref(null)
async function onSNKeyPress() {
  if (!form.value.sn) {
    return msg.msgWarning('请输入SN')
  }
  try {
    const res = await getInfoBySn({ sn: form.value.sn, ...stationInfo.value })
    result.value = res.data
    snInp.value.focus()
    snInp.value.select()
    getReturnOptions()
  } catch (error) {
    form.value.sn = ''
  }
}


// 获取维修人员信息
const empName = ref('')
const empNo = ref(null)
async function onEmpNoKeyPress() {
  if (!form.value.empNo) {
    return msg.msgWarning('请输入维修人员工号')
  }
  try {
    const res = await getEmpName({ empNo: form.value.empNo })
    empName.value = res.data[0].emP_NAME
  } catch (error) {
    form.value.empNo = ''
    msg.msgError('此工号不存在，请重新输入')
    empNo.value.focus()
  }
}

// 移除
const defectInfo = ref(null)
const replaceVisible = ref(false)
let isRemove = ref(false)
function handleRemove(bool) {
  if (!form.value.sn) {
    return msg.msgWarning('请输入SN')
  }
  if (!form.value.empNo) {
    return msg.msgWarning('请输入维修人员工号')
  }
  if (!defectSelected) {
    return msg.msgWarning('请选择不良信息')
  }
  isRemove.value = bool
  replaceVisible.value = true
  getKpsnList()
}

// 选择不良信息
let defectSelected = null
function handleDefectChange(cRow) {
  defectSelected = cRow
}

// 获取keypart列表
const kpsnList = ref([])
async function getKpsnList() {
  const res = await getKpsn({ sSN: form.value.sn })
  kpsnList.value = res.data
}

// keypart表格选择事件
const keypartSelected = ref(null)
const isBrokenDisabled = ref(true)
const replaceList = ref([])
function handleKeypartChange(cRow) {
  keypartSelected.value = cRow
  if (keypartSelected.value.parT_TYPE) {
    replaceList.value = [
      {
        partType: keypartSelected.value.parT_TYPE,
        inputValue: '',
        rid: '',
        lc: '',
        dc: ''
      }
    ]
  }
  if (cRow.iteM_SN != 'N/A') {
    isBrokenDisabled.value = false
  }
}

const defectList = ref([])
async function handleBrokenChange() {
  if (!replaceForm.value.isBroken) {
    defectList.value = []
  } else {
    const res = await editDefect({ defectCode: defectSelected.defectCode })
    defectList.value = res.data
  }
}

// 移除替换确认
async function handleRemoveReplaceConfirm() {
  if (!kpsnList.value.length) {
    return msg.msgError('No any Keypart')
  }
  if (!keypartSelected.value) {
    return msg.msgError('Please select a Keypart to replace')
  }
  if (isRemove.value) {
    await defRemoveKP({
      sn: form.value.sn,
      ...stationInfo.value,
      defRecid: defectSelected.recid,
      kpsn: keypartSelected.value.iteM_SN,
      rdbtnYes: replaceForm.value.isBroken,
      lvkp: [
        {
          kpsn: keypartSelected.value.iteM_IPN,
          sn: keypartSelected.value.iteM_SN,
          itemGroup: keypartSelected.value.iteM_GROUP,
          customerSN: keypartSelected.value.iteM_SN_CUSTOMER,
          workOrder: keypartSelected.value.worK_ORDER,
          stationType: keypartSelected.value.statioN_TYPE,
          partType: keypartSelected.value.parT_TYPE
        }
      ],
      lvec: defectList.value.map((item) => ({
        defCode: item.defecT_CODE,
        defDes: item.defecT_DESC
      }))
    })
  } else {
    if (replaceList.value.length) {
      await defReplaceKP({
        sn: form.value.sn,
        ...stationInfo.value,
        defRecid: defectSelected.recid,
        kpsn: keypartSelected.value.iteM_SN,
        rdbtnYes: replaceForm.value.isBroken,
        lvkp: [
          {
            kpsn: keypartSelected.value.iteM_IPN,
            sn: keypartSelected.value.iteM_SN,
            itemGroup: keypartSelected.value.iteM_GROUP,
            customerSN: keypartSelected.value.iteM_SN_CUSTOMER,
            workOrder: keypartSelected.value.worK_ORDER,
            stationType: keypartSelected.value.statioN_TYPE,
            partType: keypartSelected.value.parT_TYPE
          }
        ],
        lvec: defectList.value.map((item) => ({
          defCode: item.defecT_CODE,
          defDes: item.defecT_DESC
        })),
        liKpNew: replaceList.value
      })
    }
  }
  getKpsnList()
}

const replaceForm = ref({})
const kpsnInp = ref(null)
async function handleKpsnEnter() {
  if (!replaceForm.value.kpsn) {
    kpsnInp.focus()
    return msg.msgWarning('New Keypart SN is null')
  }
  const targetRow = replaceList.value.find((item) => !item.inputValue)
  if (!targetRow.partType) {
    return msg.msgError('New Keypart SN has finished')
  }
  const res = await checkNewKPSN({ sn: form.value.sn, kpsn: replaceForm.value.kpsn, liKpNew: replaceList.value })
  targetRow.inputValue = replaceForm.value.kpsn
  if (targetRow.partType == 'KPSN' && res.msg == 'Y') {
    replaceForm.value.isBroken = true
  } else if (targetRow.partType == 'KPSN' && res.msg == 'N') {
    replaceForm.value.isBroken = false
  }
  isBrokenDisabled.value = true
}

function handleRidEnter() {
  if (replaceForm.value.rid) {
    const targetRow = replaceList.value.find((item) => !item.rid)
    if (!targetRow.partType) {
      return msg.msgError('New Keypart SN has finished')
    }
    targetRow.rid = replaceForm.value.rid
  }
}

function handleLcEnter() {
  if (replaceForm.value.lc) {
    const targetRow = replaceList.value.find((item) => !item.lc)
    if (!targetRow.partType) {
      return msg.msgError('New Keypart SN has finished')
    }
    targetRow.lc = replaceForm.value.lc
  }
}

function handleDcEnter() {
  if (replaceForm.value.dc) {
    const targetRow = replaceList.value.find((item) => !item.dc)
    if (!targetRow.partType) {
      return msg.msgError('New Keypart SN has finished')
    }
    targetRow.dc = replaceForm.value.dc
  }
}

// 维修完成
const returnStationVisible = ref(false)
const returnOptions = ref([])
const reStation = ref(null)
// 获取回流站点
async function getReturnOptions() {
  const res = await getReturnStation({ gSN: form.value.sn, gStation: stationInfo.value.stationType })
  returnOptions.value = res.data
}

async function handleFinishConfirm() {
  if (!reStation.value) {
    return msg.msgWarning('请选择回流站点')
  }

  const res = await repairFinish({ gSN: form.value.sn, gStation: stationInfo.value.stationType, reStation: reStation.value })
  returnStationVisible.value = false
  msg.msgSuccess(res.msg)
}

const scrapVisible = ref(false)
const scrapForm = ref({ scrapType: 'Return Material' })
const scrapRules = shallowReactive({
  scrapMemo: [{ required: true, message: 'Please Input Memo' }]
})
const scrapRef = ref(null)
function handleScrap() {
  if (!form.value.sn) {
    return msg.msgWarning('请输入SN')
  }
  if (!form.value.empNo) {
    return msg.msgWarning('请输入员工工号')
  }
  scrapVisible.value = true
}

async function handleScrapConfirm(formEl) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await repairScrap({ ...scrapForm.value, ...stationInfo.value, sn: form.value.sn, wo: result.value.wo, partNo: result.value.partNo, defectLine: result.value.lineName})
      msg.msgSuccess(res.msg)
      scrapVisible.value = false
    }
  })
}

// 新增不良
const defectAddVisible = ref(false)
const defectForm = ref({})
const defectRules = shallowReactive({
  sDefCode: [{ required: true, message: '请输入不良代码' }],
  sLocation: [{ required: true, message: '请输入不良位置' }],
})
const defectRef = ref(null)
function handleAddDefect() {
  if (!form.value.sn) {
    return msg.msgWarning('请输入SN')
  }
  defectAddVisible.value = true
}

async function handleDefectAddConfirm(formEl) {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const res = await addDefect({ ...defectForm.value, ...stationInfo.value, sn: form.value.sn, wo: result.value.wo, partNo: result.value.partNo, lineName: result.value.lineName})
      msg.msgSuccess(res.msg)
      defectAddVisible.value = false
      onSNKeyPress()
    }
  })
}

async function handledeleteDefect() {
  if (!defectSelected) {
    return msg.msgError("请选择要删除的不良信息")
  }
  msg.confirm("确定要删除不良").then(async res => {
    const response = await delDefect({
      sn: form.value.sn,
      stationType: stationInfo.value.stationType,
      lvdef: [defectSelected]
    })
    msg.msgSuccess(response.msg)
  })
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
