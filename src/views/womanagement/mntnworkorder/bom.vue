<template>
  <el-dialog :title="$t('mntnworkorder.bom.title')" :model-value="open" width="1100px" append-to-body
    :close-on-click-modal="false" @close="close" style="margin-top: 10vh;">
    <el-form inline label-width="100px">
      <el-form-item :label="$t('mntnworkorder.bom.workOrder')">
        <span style="color: #1811c9;">{{ form.workOrder }}</span>
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.bom.ipn')">
        <span style="color: #1811c9;">{{ form.ipn }}</span>
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.bom.version')">
        <span style="color: #1811c9;">{{ form.version }}</span>
      </el-form-item>
    </el-form>

    <div style="display: flex;">
      <div style="width: 30%;">
        <el-form ref="queryPartRef" :model="queryParamsPart" :inline="false" label-suffix=":" @submit.native.prevent>
          <el-form-item :label="$t('mntnworkorder.bom.ipn')" prop="parm">
            <el-input v-model.trim="queryParamsPart.parm" placeholder="" clearable @keyup.enter="getPartList" />
          </el-form-item>
        </el-form>

        <el-table v-loading="partListLoading" :data="partList" height="500px" border stripe
          row-class-name="table-row-draggable">
          <el-table-column prop="ipn" :label="$t('mntnworkorder.bom.ipn')" align="center" :show-overflow-tooltip="true"
            min-width="150px" />
          <el-table-column prop="speC1" :label="$t('mntnworkorder.bom.speC1')" align="center"
            :show-overflow-tooltip="true" min-width="150px" />
        </el-table>
      </div>

      <div style="width: calc(70% - 20px);margin-left: 20px;">
        <div ref="bomTreeRef" v-loading="bomLoading" class="tree-box">
          <el-scrollbar class="scrollbar">
            <template v-for="(one, indexOne) in bomTree" :key="one.id">
              <div v-if="one.label" class="tree-level-1">
                <div class="tree-label">
                  <el-icon v-show="one.children && one.children.length" size="0.8em" class="icon-collapse"
                    @click="one.expand = !one.expand">
                    <Plus v-show="!one.expand" />
                    <Minus v-show="one.expand" />
                  </el-icon>
                  <SvgIcon name="file" size="1.1em" class="label-icon"></SvgIcon>
                  <div class="label-content" style="position: relative;margin-left: 2.7em;"
                    :style="{ ...(one.id === bomSelected ? { 'background-color': 'var(--el-color-primary)', border: '1px dotted #ddd', color: '#fff' } : {}) }">
                    <span class="label-text label-text-draggable" :data-order="indexOne" @click="selectBom(one)"
                      @contextmenu.prevent="handleRight($event, one)">{{ one.label }}</span>

                    <div v-show="menuBomId === one.id" class="contextmenu">
                      <div style="padding: 0 15px;color: var(--el-text-color-regular);cursor: pointer;"
                        @click="handleDeleteBom(one)">
                        <span>{{ $t('btn.delete') }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <transition @enter="onEnter" @leave="onLeave">
                  <div v-show="one.expand">
                    <template v-for="(two, indexTwo) in one.children" :key="two.id">
                      <div class="tree-level-2">
                        <div v-if="two.label" class="tree-label">
                          <SvgIcon name="status" color="#33ccff" size="1.5em" class="label-icon"></SvgIcon>
                          <div class="label-content" style="position: relative;margin-left: 3em;"
                            :style="{ ...(two.id === bomSelected ? { 'background-color': 'var(--el-color-primary)', border: '1px dotted #ddd', color: '#fff' } : {}) }">
                            <span class="label-text label-text-draggable" :data-order="`${indexOne}_${indexTwo}`"
                              @click="selectBom(two)" @contextmenu.prevent="handleRight($event, two)">{{ two.label
                              }}</span>

                            <div v-show="menuBomId === two.id" class="contextmenu">
                              <div style="padding: 0 15px;color: var(--el-text-color-regular);cursor: pointer;"
                                @click="handleDeleteBom(two)">
                                <span>{{ $t('btn.delete') }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </transition>
              </div>
            </template>
          </el-scrollbar>
        </div>

        <el-table :data="curBomTable" height="80px" border show-overflow-tooltip empty-text=" "
          style="margin-top: 10px;">
          <el-table-column prop="label" :label="$t('mntnworkorder.bom.ipn')" align="center" min-width="140px" />
          <el-table-column prop="stationType" :label="$t('mntnworkorder.bom.stationType')" align="center"
            min-width="120px" />
          <el-table-column prop="itemCount" :label="$t('mntnworkorder.bom.itemCount')" align="center"
            min-width="70px" />
          <el-table-column prop="itemGroup" :label="$t('mntnworkorder.bom.itemGroup')" align="center"
            min-width="90px" />
          <el-table-column prop="version" :label="$t('mntnworkorder.bom.version')" align="center" min-width="100px" />
          <el-table-column prop="speC1" :label="$t('mntnworkorder.bom.spec')" align="center" min-width="100px" />
        </el-table>
      </div>
    </div>
  </el-dialog>

  <el-dialog :title="$t('mntnworkorder.bom.BomData')" v-model="openBom" width="600px" append-to-body
    :close-on-click-modal="false" @close="closeBom">
    <LuxForm ref="formBomRef" :model="formBom" :rules="rulesBom" label-position="left" label-width="100px"
      style="padding: 0 10px;" :data-report-info="JSON.stringify({
        menu: 'mntnworkorder:bom',
        form: 'bomdata',
        update: !!formBom.id,
        submit: isBomSumbit
      })">
      <el-form-item :label="$t('mntnworkorder.bom.workOrder')" prop="workOrder">
        <span style="color: #891210;">{{ formBom.workOrder }}</span>
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.bom.ipn')" prop="ipn">
        <span style="color: #891210;">{{ formBom.ipn }}</span>
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.bom.version')" prop="ipnVersion">
        <span style="color: #891210;">{{ formBom.ipnVersion }}</span>
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.bom.itemIpn')" prop="itemIpn">
        <el-input v-model.trim="formBom.itemIpn" placeholder="" disabled style="width: 250px;" />
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.bom.itemVersion')" prop="version">
        <el-input v-model.trim="formBom.version" placeholder="" style="width: 250px;" />
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.bom.itemCount')" prop="itemCount">
        <el-input v-model.number.trim="formBom.itemCount" placeholder="" style="width: 250px;" />
      </el-form-item>
      <el-form-item :label="$t('mntnworkorder.bom.itemGroup')" prop="itemGroup">
        <el-input v-model.trim="formBom.itemGroup" placeholder="" :disabled="!isRoot" style="width: 250px;" />
        <span style="padding-left: 1em;">0: Non-Substitution</span>
      </el-form-item>
    </LuxForm>
    <template #footer>
      <el-button text @click="cancelBom">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" :loading="bomFormLoading" @click="submitFormBom">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup name="wobom">
import SvgIcon from '@/components/SvgIcon'
import { partlistget } from '@/api/mescommon/mesget'
import { getWoBomTree, updateWoBom, deleteWoBom } from '@/api/womanagement/mntnworkorder'
const { proxy } = getCurrentInstance()

const emit = defineEmits(['close', 'update:open'])
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    default: {}
  }
})
watch(
  () => props.open,
  (nVal, oVal) => {
    if (nVal) {
      menuBomId.value = null
      partList.value = []
      bomSelected.value = null
      proxy.resetForm('queryPartRef')
      getBomData()

      resetBomTreeDrag()
      nextTick(() => {
        handleBomTreeDrag()
      })
    }
  }
)

const state = reactive({
  queryParamsPart: {
    parm: undefined
  },
  formBom: {},
  rulesBom: {
    itemIpn: [{ required: true, message: 'Sub Part No is required', trigger: 'blur' }],
    itemCount: [{ type: 'number', required: true, message: 'Qty is required', trigger: 'change' }],
    itemGroup: [{ required: true, message: 'Relation is required', trigger: 'change' }]
  },
})
const { queryParamsPart, formBom, rulesBom } = toRefs(state)

function close() {
  emit('update:open', false)
  emit('close')
}


const menuBomId = ref(null)
function handleRight(event, v) {
  event.preventDefault()
  if (!props.editable) return
  const nextEle = event.target.nextElementSibling
  if (nextEle && nextEle.classList.contains('contextmenu')) {
    selectBom(v)
    menuBomId.value = v.id
    event.target.nextElementSibling.style.left = event.offsetX + 4 + 'px'
    event.target.nextElementSibling.style.top = event.offsetY + 4 + 'px'
  }
}
document.addEventListener('click', (e) => {
  menuBomId.value = null
})
document.addEventListener('contextmenu', (e) => {
  if (!e.target.classList.contains('label-text-draggable')) {
    menuBomId.value = null
  }
})


const isRoot = ref(false)
const openBom = ref(false)
const formBomRef = ref(null)
const bomFormLoading = ref(false)
const isBomSumbit = ref(false)

function closeBom() {
  resetBom()
}
function cancelBom() {
  openBom.value = false
}
function resetBom() {
  formBom.value = {
    id: null,
    workOrder: props.form.workOrder || null,
    ipn: props.form.ipn || null,
    ipnVersion: props.form.version || null,
    speC1: props.form.speC1 || null,
    itemIpn: null,
    itemSpec1: null,
    version: null,
    itemCount: 1,
    itemGroup: '0',
  }
  proxy.resetLuxForm('formBomRef')
}
function submitFormBom() {
  isBomSumbit.value = true
  formBomRef.value.$form.validate((valid) => {
    isBomSumbit.value = false
    if (valid) {
      let form = JSON.parse(JSON.stringify(formBom.value))
      delete form.ipnVersion

      // 合并同组所有数据
      const arr = bomGroupData.value.map(e => {
        return {
          id: e.id,
          workOrder: props.form.workOrder,
          ipn: props.form.ipn,
          speC1: props.form.speC1,
          itemIpn: e.label,
          itemSpec1: e.speC1,
          version: e.version,
          itemCount: e.itemCount,
          itemGroup: e.itemGroup,
        }
      })
      const data = [...arr, form]

      bomFormLoading.value = true
      updateWoBom(data).then(res => {
        bomFormLoading.value = false
        proxy.$modal.msgSuccess(proxy.$t('mntnworkorder.bom.UpdateOK'))
        openBom.value = false
        getBomData()
      }).catch(() => {
        bomFormLoading.value = false
      })
    }
  })
}


const partListLoading = ref(false)
const partList = ref([])

function getPartList() {
  partListLoading.value = true
  partlistget(queryParamsPart.value).then(res => {
    partListLoading.value = false
    partList.value = res?.data || []

    resetPartDrag()
    nextTick(() => {
      handlePartDrag()
    })
  }).catch(() => {
    partListLoading.value = false
  })
}
function handlePartDrag() {
  if (!props.editable) return
  const rows = document.getElementsByClassName('table-row-draggable')
  for (let i = 0; i < rows.length; i++) {
    rows[i].dataset.idx = i
    rows[i].setAttribute('draggable', true) // 开启拖拽
    rows[i].addEventListener('mousedown', handlePartMouseDown)
    rows[i].addEventListener('mouseup', handlePartMouseUp)
    rows[i].addEventListener('dragstart', handlePartDragStart)
    rows[i].addEventListener('dragend', handlePartDragEnd)
  }
}
function resetPartDrag() {
  const rows = document.getElementsByClassName('table-row-draggable')
  for (let i = 0; i < rows.length; i++) {
    rows[i].removeEventListener('mousedown', handlePartMouseDown)
    rows[i].removeEventListener('mouseup', handlePartMouseUp)
    rows[i].removeEventListener('dragstart', handlePartDragStart)
    rows[i].removeEventListener('dragend', handlePartDragEnd)
  }
}
// 按下左键 修改光标样式
function handlePartMouseDown(event) {
  if (event.button === 0) {
    this.style.cursor = 'grabbing'
  }
}
// 抬起鼠标按键 光标恢复
function handlePartMouseUp(event) {
  this.style.cursor = 'default'
}
// 开始拖拽 将当前数据写入dataTransfer
function handlePartDragStart(event) {
  const idx = event.target.dataset.idx
  event.dataTransfer.setData('text/plain', JSON.stringify(partList.value[idx]))
}
// 结束拖拽 光标恢复
function handlePartDragEnd(event) {
  this.style.cursor = 'default'
}

const bomLoading = ref(false)
const bomTree = ref([])

function getBomData() {
  bomLoading.value = true
  getWoBomTree({ workOrder: props.form.workOrder }).then(res => {
    bomLoading.value = false
    bomTree.value = res?.data || []
    expandNode(bomTree.value)

    resetBomDrag()
    nextTick(() => {
      handleBomDrag()
    })
  }).catch(() => {
    bomLoading.value = false
  })
}
// 展开所有bom节点
function expandNode(arr) {
  arr.forEach(e => {
    e.expand = true
    if (e.children) expandNode(e.children)
  })
}
// 为所有bom节点添加事件
function handleBomDrag() {
  if (!props.editable) return
  const items = document.getElementsByClassName('label-text-draggable')
  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('dragover', handleBomDragOver)
    items[i].addEventListener('dragenter', handleBomDragEnter)
    items[i].addEventListener('dragleave', handleBomDragLeave)
    items[i].addEventListener('drop', handleBomDrop)
  }
}
// 取消事件监听
function resetBomDrag() {
  const items = document.getElementsByClassName('label-text-draggable')
  for (let i = 0; i < items.length; i++) {
    items[i].removeEventListener('dragover', handleBomDragOver)
    items[i].removeEventListener('dragenter', handleBomDragEnter)
    items[i].removeEventListener('dragleave', handleBomDragLeave)
    items[i].removeEventListener('drop', handleBomDrop)
  }
}
// 拖拽至当前节点上方 阻止默认事件
function handleBomDragOver(event) {
  event.preventDefault()
}
// 拖拽进入当前节点 修改节点样式
function handleBomDragEnter(event) {
  this.style.backgroundColor = 'var(--el-color-primary)'
  this.style.color = '#fff'
}
// 拖拽离开当前节点 恢复节点样式
function handleBomDragLeave(event) {
  this.style.backgroundColor = ''
  this.style.color = ''
}
// 拖拽元素释放到当前节点
function handleBomDrop(event) {
  event.preventDefault()
  this.style.backgroundColor = ''
  this.style.color = ''

  const order = event.target.dataset.order
  if (!order) return

  // 获取当前节点数据
  const toData = getBomItem(order)
  if (!toData) return

  // 选中当前节点
  selectBom(toData)

  // 从 dataTransfer 中取出数据
  const str = event.dataTransfer.getData('text/plain')
  const srcData = str && JSON.parse(str)
  if (!srcData) return

  if (checkPart(srcData.ipn)) return

  getBomGroup(order)

  resetBom()
  formBom.value = {
    workOrder: props.form.workOrder,
    ipn: props.form.ipn,
    ipnVersion: props.form.version,
    speC1: props.form.speC1,
    itemIpn: srcData.ipn,
    itemSpec1: srcData.speC1,
    version: null,
    itemCount: toData.itemCount || 1,
    itemGroup: toData.itemGroup || '0',
  }
  isRoot.value = false
  openBom.value = true

}

const bomTreeRef = ref(null)
// 拖拽至根节点新增处理
function handleBomTreeDrag() {
  if (!props.editable) return
  bomTreeRef.value.addEventListener('dragover', handleBomTreeDragOver)
  bomTreeRef.value.addEventListener('drop', handleBomTreeDrap)
}
// 取消根节点事件监听
function resetBomTreeDrag() {
  if (!bomTreeRef.value) return
  bomTreeRef.value.removeEventListener('dragover', handleBomTreeDragOver)
  bomTreeRef.value.removeEventListener('drop', handleBomTreeDrap)

}
// 拖拽至当前节点上方 阻止默认事件
function handleBomTreeDragOver(event) {
  event.preventDefault()
}
// 拖拽元素释放到当前节点
function handleBomTreeDrap(event) {
  event.preventDefault()

  if (event.target.classList.contains('label-text')) return

  // 从 dataTransfer 中取出数据
  const str = event.dataTransfer.getData('text/plain')
  const srcData = str && JSON.parse(str)
  if (!srcData) return

  if (checkPart(srcData.ipn)) return

  bomGroupData.value = []

  resetBom()
  formBom.value = {
    workOrder: props.form.workOrder,
    ipn: props.form.ipn,
    ipnVersion: props.form.version,
    speC1: props.form.speC1,
    itemIpn: srcData.ipn,
    itemSpec1: srcData.speC1,
    version: null,
    itemCount: 1,
    itemGroup: '0',
  }
  isRoot.value = true
  openBom.value = true
}

// 获取某条bom数据
function getBomItem(order) {
  const arr = order.split('_')
  let i = 0, cur = bomTree.value[arr[i]]
  while (i < arr.length - 1) {
    ++i
    cur = cur.children[arr[i]]
  }
  return cur
}

// 检查料号是否已存在
function checkPart(ipn) {
  const res = bomTree.value.some(e => {
    return e.label === ipn || (e.children && e.children.some(f => f.label === ipn))
  })
  if (res) proxy.$alert(proxy.$t('warehousing.PartNoExisted'), 'Warning', { type: 'warning' })
  return res
}

// 记录同组数据
const bomGroupData = ref([])
function getBomGroup(order) {
  const arr = order.split('_')
  let res = []
  let cur1 = JSON.parse(JSON.stringify(bomTree.value[arr[0]]))
  if (cur1.children) {
    const children = bomTree.value[arr[0]].children.filter(e => e.label)
    res.push(...JSON.parse(JSON.stringify(children)))
  }
  delete cur1.children
  res.unshift(cur1)
  bomGroupData.value = res
}


const bomSelected = ref(null)
const curBomTable = ref([])
function selectBom(item) {
  if (item) {
    curBomTable.value = [item]
    bomSelected.value = item.id
  } else {
    curBomTable.value = []
    bomSelected.value = null
  }
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

// 刪除bom
function handleDeleteBom(v) {
  bomLoading.value = true
  deleteWoBom({
    id: v.id,
    workOrder: props.form.workOrder,
    itemIpn: v.label,
    itemGroup: v.itemGroup,
  }).then(res => {
    bomLoading.value = false
    selectBom()
    getBomData()
  }).catch(() => {
    bomLoading.value = false
  })
}
</script>

<style lang="scss" scoped>
:deep(.table-row-draggable),
.label-text-draggable {
  cursor: default;
}

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

.tree-box {
  height: 460px;
  border: 1px solid #e4e7ed;
}

.scrollbar {
  padding: 6px 0;
}

.tree-level-1 {
  padding: 2px 10px;
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
    cursor: pointer;
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

.contextmenu {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 5px 0;
  background-color: #fff;
  border: none;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
</style>