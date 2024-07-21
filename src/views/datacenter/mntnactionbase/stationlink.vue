<template>
  <div class="app-container">
    <div class="type-box">
      <el-radio-group v-model="type" @change="changeType">
        <el-radio-button label="Station Type" value="type" />
        <el-radio-button label="Station Name" value="name" />
      </el-radio-group>
    </div>

    <div class="content-container">
      <div v-loading="treeLoading" class="tree-box">
        <el-scrollbar class="scrollbar">
          <div v-for="one in stationTree" :key="one.label" class="tree-level-1">
            <div class="tree-label" @click="one.expand = !one.expand">
              <el-icon v-show="one.children && one.children.length" size="0.8em" class="icon-collapse">
                <Plus v-show="!one.expand" />
                <Minus v-show="one.expand" />
              </el-icon>
              <SvgIcon v-show="type === 'type'" name="file" size="1.1em" class="label-icon"></SvgIcon>
              <SvgIcon v-show="type === 'name'" name="line" size="1.2em" class="label-icon"></SvgIcon>
              <div class="label-content" :style="{ 'margin-left': type === 'type' ? '2.7em' : '2.8em' }">
                <span class="label-text">{{ one.label }}</span>
              </div>
            </div>

            <transition @enter="onEnter" @leave="onLeave">
              <div v-show="one.expand">
                <div v-for="two in one.children" :key="two.label" class="tree-level-2">
                  <div class="tree-label" :style="{ cursor: type === 'name' && two.children ? 'pointer' : '' }"
                    @click="type === 'name' && (two.expand = !two.expand) || selectTwo(two)">
                    <el-icon v-show="type === 'name' && two.children && two.children.length" size="0.8em"
                      class="icon-collapse">
                      <Plus v-show="!two.expand" />
                      <Minus v-show="two.expand" />
                    </el-icon>
                    <SvgIcon v-show="type === 'type'" name="status" color="#33ccff" size="1.5em" class="label-icon">
                    </SvgIcon>
                    <SvgIcon v-show="type === 'name'" name="file" size="1.1em" class="label-icon" style="left: 1.6em;">
                    </SvgIcon>
                    <div class="label-content"
                      :style="{ ...(two.label === stationSelected ? { 'background-color': 'var(--current-color)', border: '1px dotted #ddd' } : {}), 'margin-left': type === 'type' ? '3em' : '2.9em' }">
                      <span class="label-text"
                        :style="{ color: two.label === stationSelected ? '#fff' : two.clientType === 'AUTO' ? 'orange' : two.clientType === 'PDCA' ? 'blue' : '' }">{{
                          two.label
                        }}</span>
                    </div>
                  </div>

                  <transition v-if="type === 'name' && two.children" @enter="onEnter" @leave="onLeave">
                    <div v-show="two.expand">
                      <div v-for="three in two.children" :key="two.label" class="tree-level-3">
                        <div class="tree-label" :style="{ cursor: type === 'name' && three.children ? 'pointer' : '' }"
                          @click="type === 'name' && (three.expand = !three.expand)">
                          <el-icon v-show="type === 'name' && three.children && three.children.length" size="0.8em"
                            class="icon-collapse">
                            <Plus v-show="!three.expand" />
                            <Minus v-show="three.expand" />
                          </el-icon>
                          <SvgIcon name="status" color="#33ccff" size="1.5em" class="label-icon"></SvgIcon>
                          <div class="label-content" style="margin-left: 3em;">
                            <span class="label-text">{{ three.label }}</span>
                          </div>
                        </div>

                        <transition v-if="three.children" @enter="onEnter" @leave="onLeave">
                          <div v-show="three.expand">
                            <div v-for="four in three.children" :key="three.label" class="tree-level-4">
                              <div class="tree-label" @click="selectFour(three, four)">
                                <SvgIcon name="status" color="#66ff99" size="1.4em" class="label-icon"></SvgIcon>
                                <div class="label-content" style="margin-left: 2.9em;margin-right: 10px;"
                                  :style="four.label === stationSelected ? { 'background-color': 'var(--current-color)', color: '#fff', border: '1px dotted #ddd' } : {}">
                                  <span class="label-text">{{ four.label }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </transition>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
            </transition>
          </div>
        </el-scrollbar>
      </div>

      <div class="right-container">
        <div class="station-info">
          <div class="station-type">
            <div class="info-label">Station Type</div>
            <div class="info-content">
              <span>{{ formAction.stationType }}</span>
            </div>
          </div>
          <div v-show="type === 'name'" class="station-name">
            <div class="info-label">Station Name</div>
            <div class="info-content">
              <span>{{ formAction.stationName }}</span>
            </div>
          </div>
        </div>

        <el-divider content-position="left">Action Base</el-divider>
        <div v-loading="actionInfoLoading" class="action-base">
          <LuxForm ref="formActionRef" :model="formAction" :rules="rulesAction" :inline="true" label-width="100px"
            :data-report-info="JSON.stringify({
              menu: 'mntnactionbase:stationlink',
              form: 'actionbase',
              update: isActionEdit,
              submit: isActionSumbit
            })">
            <div>
              <el-form-item label="Action" prop="groupId">
                <div style="display: flex;">
                  <el-select v-model="formAction.groupId" placeholder="Please Choose Action Group" clearable filterable
                    style="width: 300px;" @change="changeGroup">
                    <el-option v-for="item in groupList" :key="item.groupId" :label="item.groupName"
                      :value="item.groupId" />
                  </el-select>
                  <div style="padding-left: 1em;">{{ groupName }}</div>
                </div>
              </el-form-item>
            </div>
            <el-divider class="base-divider" />
            <div>
              <el-form-item label="Check Line" prop="checkLine" class="form-item">
                <el-switch v-model="formAction.checkLine" />
              </el-form-item>
              <el-form-item label="Auto Read" prop="autoReadsn" class="form-item">
                <el-switch v-model="formAction.autoReadsn" />
              </el-form-item>
              <el-form-item label="Read Path" prop="autoReadPath" class="form-item2">
                <el-input v-model.trim="formAction.autoReadPath" style="width: 100%;" />
              </el-form-item>
              <el-form-item label="ShowBom" prop="showBom" class="form-item">
                <el-switch v-model="formAction.showBom" />
              </el-form-item>
            </div>
            <div>
              <el-form-item label="Print" prop="printFlag" class="form-item">
                <el-switch v-model="formAction.printFlag" />
              </el-form-item>
              <el-form-item label="PrintQty" prop="printQty" class="form-item2">
                <el-input-number v-model="formAction.printQty" :min="0" :precision="0" controls-position="right" />
              </el-form-item>
              <el-form-item label="Check Font" prop="checkFont" class="form-item">
                <el-switch v-model="formAction.checkFont" />
              </el-form-item>
            </div>
          </LuxForm>

          <div class="btn-box">
            <el-button type="primary" :loading="actionFormLoading" :disabled="!formAction.stationType"
              @click="submitFormAction">
              <span>{{ $t('btn.save') }}</span>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="stationactionlink">
import SvgIcon from '@/components/SvgIcon'
import { treeStationType, treeStation } from '@/api/mescommon/mesget'
import {
  listJobGroup,
  listStationAction,
  updateStationAction
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
      getGroupList()
    }
  }
)

const type = ref('type')
const treeLoading = ref(false)
const stationTree = ref([])
const stationSelected = ref(null)

const groupList = ref([])
const groupName = ref('')

const actionInfoLoading = ref(false)
const actionFormLoading = ref(false)

const state = reactive({
  formAction: {},
  rulesAction: {},
})
const { formAction, rulesAction } = toRefs(state)

// StationType选中
function selectTwo(v) {
  if (type.value === 'type') {
    stationSelected.value = v.label
    formAction.value.stationType = v.stationType
    formAction.value.stationName = null
    getActionBase()
  }
}
// StationName选中
function selectFour(p, v) {
  stationSelected.value = v.label
  formAction.value.stationType = v.stationType
  formAction.value.stationName = v.label
  getActionBase()
}

const isActionEdit = ref(false)

// 获取ActionBase
function getActionBase() {
  const stationType = formAction.value.stationType
  const stationName = formAction.value.stationName || '0'
  actionInfoLoading.value = true
  listStationAction({ stationType, stationName }).then((response) => {
    actionInfoLoading.value = false
    isActionEdit.value = response.data.length > 0
    const cur = response.data[0] || {}
    formAction.value = {
      stationType: cur.stationType || formAction.value.stationType,
      stationName: cur.stationName || formAction.value.stationName,
      groupId: cur.groupId || '',
      showBom: cur.showBom === 'Y',
      checkLine: cur.checkLine === 'Y',
      printFlag: cur.printFlag === 'Y',
      autoReadsn: cur.autoReadsn === 'Y',
      checkFont: cur.checkFont === 'Y',
      autoReadPath: cur.autoReadPath || null,
      printQty: cur.printQty || 1
    }
    groupName.value = formAction.value.groupId ? groupList.value.find(e => e.groupId == formAction.value.groupId)?.groupDesc || '' : ''
  }).catch((err) => {
    actionInfoLoading.value = false
    resetAction()
    formAction.value.stationType = stationType
    formAction.value.stationName = stationName
  })
}

// 选择/删除group
function changeGroup(v) {
  if (v) {
    groupName.value = groupList.value.find(e => e.groupId == v)?.groupDesc || ''
  } else {
    groupName.value = ''
  }
}

// 表单重置
function resetAction() {
  stationSelected.value = null
  formAction.value = {
    stationType: null,
    stationName: null,
    groupId: null,
    showBom: false,
    checkLine: false,
    printFlag: false,
    autoReadsn: false,
    checkFont: false,
    autoReadPath: null,
    printQty: 1
  }
  groupName.value = ''
  proxy.resetLuxForm('formActionRef')
}

const formActionRef = ref(null)
const isActionSumbit = ref(false)

// 提交表单 保存/删除
function submitFormAction() {
  isActionSumbit.value = true
  formActionRef.value.$form.validate((valid) => {
    isActionSumbit.value = false
    if (valid) {
      const text = formAction.value.groupId ? proxy.$t('mntnstationaction.ConfirmSave') : proxy.$t('mntnstationaction.ConfirmDelete')
      proxy.$modal
        .confirm(text)
        .then(() => {
          const form = {
            stationType: formAction.value.stationType,
            stationName: formAction.value.stationName || '0',
            groupId: formAction.value.groupId,
            showBom: formAction.value.showBom ? 'Y' : 'N',
            checkLine: formAction.value.checkLine ? 'Y' : 'N',
            printFlag: formAction.value.printFlag ? 'Y' : 'N',
            autoReadsn: formAction.value.autoReadsn ? 'Y' : 'N',
            checkFont: formAction.value.checkFont ? 'Y' : 'N',
            autoReadPath: formAction.value.autoReadPath,
            printQty: formAction.value.printQty
          }
          actionFormLoading.value = true
          return updateStationAction(form)
        })
        .then(() => {
          actionFormLoading.value = false
          if (formAction.value.groupId) {
            proxy.$modal.msgSuccess(proxy.$t('mntnstationaction.SaveOK'))
          } else {
            proxy.$modal.msgSuccess(proxy.$t('mntnstationaction.DeleteOK'))
          }
          getActionBase()
        })
        .catch(() => {
          actionFormLoading.value = false
        })
    }
  })
}

// 折叠展开动画
function onEnter(el, done) {
  let count = el.children.length
  for (let i = 0; i < el.children.length; i++) {
    const level1 = el.children[i]
    if (level1.children.length > 1) {
      const level2 = level1.children[1]
      count += level2.children.length
      for (let k = 0; k < level2.children.length; k++) {
        const level3 = level2.children[k]
        if (level3.children.length > 1) {
          const level4 = level3.children[1]
          count += level4.children.length
        }
      }
    }
  }
  requestAnimationFrame(() => {
    el.style.maxHeight = count * 26 + 'px'
  })
}
function onLeave(el, done) {
  el.style.maxHeight = 0
}

// 选中StationType
function changeType(v) {
  resetAction()
  getStationTree()
}

// 获取树
function getStationTree() {
  stationTree.value = []

  if (type.value === 'type') {
    getStationTypeTree()
  } else if (type.value === 'name') {
    getStationNameTree()
  }
}
// 获取StationType树
function getStationTypeTree() {
  treeLoading.value = true
  treeStationType().then((response) => {
    treeLoading.value = false
    if (response.code == 200) {
      stationTree.value = response.data
    } else {
      stationTree.value = []
    }
  }).catch(() => {
    treeLoading.value = false
  })
}
// 获取StationName树
function getStationNameTree() {
  treeLoading.value = true
  treeStation().then((response) => {
    treeLoading.value = false
    if (response.code == 200) {
      stationTree.value = response.data
    } else {
      stationTree.value = []
    }
  }).catch(() => {
    treeLoading.value = false
  })
}

// 获取ActionGroup选项
function getGroupList() {
  listJobGroup().then((response) => {
    if (response.code == 200) {
      groupList.value = response.data
    } else {
      groupList.value = []
    }
  })
}

resetAction()
getStationTree()
getGroupList()
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.v-enter-to,
.v-leave-from {
  overflow: visible;
}

.el-form--inline .el-form-item {
  margin-right: 0;
}

.app-container {
  height: calc(100vh - 157px);
  min-height: 460px;
  padding: 10px;
}

.type-box {
  height: 40px;
}

.content-container {
  height: calc(100% - 40px);
  position: relative;
  display: flex;
  justify-content: space-between;
}

.tree-box {
  width: 30%;
  height: 100%;
  border: 1px solid #e4e7ed;
}

.scrollbar {
  padding: 6px 0;
}

.tree-level-1 {
  padding: 2px 10px;

  .tree-label {
    cursor: pointer;
  }
}

.tree-level-2 {
  margin-left: 1.4em;
}

.tree-level-3 {
  margin-left: 1.7em;
}

.tree-level-4 {
  margin-left: 1.6em;
}

.tree-label {
  height: 26px;
  position: relative;
  display: flex;
  align-items: center;

  .icon-collapse {
    position: absolute;
    padding: 1px;
    border: 2px solid #afafaf;
    border-radius: 2px;
  }

  .label-icon {
    position: absolute;
    left: 1.4em;
  }

  .label-content {
    display: inline-block;
    word-break: keep-all;
    white-space: nowrap;

    .label-text {
      padding: 0 0.2em;
    }
  }
}

.right-container {
  width: calc(70% - 10px);
  height: 100%;
}

.station-info {
  padding: 20px;
  border: 1px solid #e4e7ed;
  display: flex;

  .station-type {
    min-width: 30%;
  }

  .station-name {
    margin-left: 1em;
  }

  .info-label {
    padding-bottom: 10px;
  }

  .info-content {
    min-height: 22px;
    word-break: break-all;
    font-size: 14px;
    opacity: 0.88;
  }
}

.action-base {
  height: calc(100% - 117px);
  position: relative;
  top: -24px;
  padding: 30px 20px 20px;
  border: 1px solid #e4e7ed;
  border-top: 0;

  .form-item {
    width: 160px;
  }

  .form-item2 {
    width: 320px;
  }

  .btn-box {
    position: absolute;
    bottom: 10px;
  }
}

.base-divider {
  margin-top: 12px;
  margin-left: -20px;
  margin-right: -20px;
  width: calc(100% + 40px);
}
</style>