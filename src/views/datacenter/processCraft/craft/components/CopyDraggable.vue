<script setup name="CopyDraggable">
import SvgIcon from '@/components/SvgIcon'
import draggable from 'vuedraggable'

const { proxy } = getCurrentInstance()

const props = defineProps({
  routeName: {
    type: String,
    default: ''
  },
  list1: {
    type: Array,
    default: () => []
  },
  list2: {
    type: Array,
    default: () => []
  },
  list1Loading: {
    type: Boolean,
    default: false
  },
  list2Loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['updateList2', 'updateOpen'])

// 数据样式
const childrenStyle = computed(() => (row) => {
  return { color: row.scanType === 'VL' ? '#2437ff' : row.clientType === 'INPUT' ? '#2d51ff' : '' }
})

// 左侧控制展开/折叠
const switchLeftVal = ref(false)
watch(switchLeftVal, (newValue) => {
  emit('updateOpen', 'left', newValue)
})

// 工艺流程控制展开/折叠
const open = ref(true)

// 左侧控制展开/折叠
const switchRightVal = ref(false)
watch(switchRightVal, (newValue) => {
  open.value = newValue
  emit('updateOpen', 'right', newValue)
})

// body 元素
let bodyEl = document.body

// 被拖拽的元素
const dragItem = ref([])

// 被拖拽的数据
const draggableData = ref({})

// 接收拖拽的元素
const dropItem = ref([])

// 被拖拽元素 鼠标按下
const downItem = (e, data) => {
  draggableData.value = data
  // 左侧样式
  e.target.style.backgroundColor = '#a0cfff'
  // 右侧样式
  for (let i = 0; i < dropItem.value.length; i++) {
    dropItem.value[i].addEventListener('mouseover', (e) => {
      e.target.style.backgroundColor = '#a0cfff'
    })
    dropItem.value[i].addEventListener('mouseleave', (e) => {
      e.target.style.backgroundColor = 'transparent'
    })
  }
  // 鼠标样式
  bodyEl.style.cursor = 'copy'
}

// 被拖拽的元素到达目的地 鼠标抬起
const listMouseup = (type, oneRow, twoRow) => {
  for (let i = 0; i < dragItem.value.length; i++) {
    dragItem.value[i].style.backgroundColor = 'transparent'
  }
  bodyEl.style.cursor = 'auto'
  if (!props.routeName) return
  if (JSON.stringify(draggableData.value) === '{}') return
  if (type === '顶层') {
    if (draggableData.value.scanType === 'REPAIR') {
      draggableData.value = {}
      proxy.$modal.msgWarning(proxy.$t('caft.stationTip2'))
      return
    }
    const rightFlag = props.list2.map((item) => item.nextStationType)
    if (rightFlag.includes(draggableData.value.stationType)) {
      draggableData.value = {}
      proxy.$modal.msgWarning(proxy.$t('common.already'))
      return
    }
  } else if (type === '第一层') {
    if (oneRow.children.length === 1) {
      draggableData.value = {}
      proxy.$modal.msgWarning(proxy.$t('caft.stationTip1'))
      return
    }
    if (draggableData.value.scanType != 'REPAIR') {
      draggableData.value = {}
      proxy.$modal.msgWarning(proxy.$t('caft.stationTip3'))
      return
    }
  } else if (type === '第二层') {
    if (draggableData.value.scanType === 'REPAIR') {
      draggableData.value = {}
      proxy.$modal.msgWarning(proxy.$t('caft.stationTip2'))
      return
    }
  }
  emit('updateList2', 'drag', draggableData.value, type, oneRow, twoRow)
  open.value = true
  draggableData.value = {}
}

// 页面鼠标抬起
const upItem = () => {
  for (let i = 0; i < dragItem.value.length; i++) {
    dragItem.value[i].style.backgroundColor = 'transparent'
  }
  bodyEl.style.cursor = 'auto'
  draggableData.value = {}
}
bodyEl.addEventListener('mouseup', upItem)

// 右击右侧数据
const menuRef = ref()
const rightClickData = reactive({
  level: '顶层',
  data: {},
  oneData: {},
  twoData: {}
})
const tapRightItem = (e, level, row, oneRow, twoRow) => {
  // 处理样式
  const textElArr = document.querySelectorAll('.item-name .text span')
  for (let i = 0; i < textElArr.length; i++) {
    textElArr[i].style.backgroundColor = 'transparent'
    textElArr[i].style.color = '#000'
  }
  e.target.style.backgroundColor = '#0078d7'
  e.target.style.color = '#fff'
  // 显示菜单位置
  menuRef.value.style.top = `${e.pageY - document.querySelector('.el-header').offsetHeight + 20}px`
  menuRef.value.style.left = `${e.pageX - document.querySelector('.el-aside').offsetWidth - 70}px`
  // 保存右击的数据
  rightClickData.level = level
  rightClickData.data = row
  rightClickData.oneData = oneRow
  rightClickData.twoData = twoRow
}

// 页面点击 右侧选中数据重置
const tapBody = () => {
  rightClickData.level = '顶层'
  rightClickData.data = {}
  rightClickData.oneData = {}
  rightClickData.twoData = {}
  const textElArr = document.querySelectorAll('.item-name .text span')
  for (let i = 0; i < textElArr.length; i++) {
    textElArr[i].style.backgroundColor = 'transparent'
    textElArr[i].style.color = '#000'
  }
}
bodyEl.addEventListener('click', tapBody)

// 菜单
const handlemenuItemClick = async (type) => {
  if (type === 'status') {
    // 修改状态
    emit('updateList2', 'status', rightClickData.data)
    tapBody()
  }
  if (type === 'del') {
    // 删除
    emit('updateList2', 'del', rightClickData.data, rightClickData.level, rightClickData.oneData, rightClickData.twoData)
    tapBody()
  }
}
</script>

<template>
  <div class="main">
    <!-- 左侧 -->
    <el-card shadow="never" v-loading="list1Loading">
      <!-- 展开/折叠 -->
      <el-switch v-model="switchLeftVal" inline-prompt :active-text="$t('btn.expand')" :inactive-text="$t('btn.collapse')" />
      <!-- 数据 -->
      <el-scrollbar>
        <div class="item drag-item" v-for="item in list1" :key="item.stage">
          <!-- 站点 -->
          <p class="item-name">
            <span class="open-or-close" @click="item.open = !item.open" v-show="item.children.length">{{ item.open ? '-' : '+' }} </span>
            <span class="text">
              <SvgIcon name="file" size="1.1em"></SvgIcon>
              <span>{{ item.stage }}</span>
            </span>
          </p>
          <!-- 第一层数据 -->
          <div class="children one" v-show="item.open">
            <span v-for="val in item.children" :key="val.stationType" :style="childrenStyle(val)" :data="val.stationType">
              <SvgIcon :name="val.scanType === 'REPAIR' ? 'status_tool' : 'status'" color="#33ccff" size="1.5em"></SvgIcon>
              <span ref="dragItem" @mousedown="downItem($event, val)">{{ val.stationType }} {{ val.stationTypeDesc }}</span>
            </span>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
    <!-- 右侧 -->
    <el-card shadow="never" v-loading="list2Loading" @mouseup.stop="listMouseup('顶层')">
      <!-- 展开/折叠 -->
      <el-switch v-model="switchRightVal" inline-prompt :active-text="$t('btn.expand')" :inactive-text="$t('btn.collapse')" />
      <!-- 数据 -->
      <el-scrollbar>
        <div ref="acItem" class="item ac-item">
          <!-- 工艺流程 -->
          <p class="item-name" v-show="routeName">
            <span class="open-or-close" @click="open = !open" v-show="list2.length">{{ open ? '-' : '+' }} </span>
            <span class="text">
              <SvgIcon name="file" size="1.1em"></SvgIcon>
              <span @contextmenu.prevent="tapRightItem($event, '顶层', { label: '1' })">{{ routeName }}</span>
            </span>
          </p>
          <!-- 第一层数据 -->
          <div class="children one" v-show="open">
            <draggable :list="list2" item-key="itemKey" animation="300">
              <template #item="{ element }">
                <div>
                  <p class="item-name position" @mouseup.stop="listMouseup('第一层', element)">
                    <span class="open-or-close" @click="element.open = !element.open" v-show="element.children.length"
                      >{{ element.open ? '-' : '+' }}
                    </span>
                    <span class="text">
                      <SvgIcon v-if="element.necessary === 'Y'" name="status" color="#33ccff" size="1.5em"></SvgIcon>
                      <SvgIcon v-else name="status" color="#ffcc66" size="1.5em"></SvgIcon>
                      <span ref="dropItem" class="right" @contextmenu.prevent="tapRightItem($event, '第一层', element)">
                        {{ element.nextStationType }} {{ element.nextstationTypeDesc }}
                      </span>
                    </span>
                  </p>
                  <!-- 第二层数据 -->
                  <div class="children two" v-show="element.open">
                    <template v-for="val in element.children" :key="val?.seq">
                      <p class="item-name position" v-if="val" @mouseup.stop="listMouseup('第二层', element, val)">
                        <span class="open-or-close" @click="val.open = !val.open" v-show="val.children.length">{{ val.open ? '-' : '+' }} </span>
                        <span class="text">
                          <SvgIcon name="status_tool" color="#33ccff" size="1.5em"></SvgIcon>
                          <span ref="dropItem" class="right" @contextmenu.prevent="tapRightItem($event, '第二层', val, element)">
                            {{ val.nextStationType }} {{ val.nextstationTypeDesc }}
                          </span>
                        </span>
                      </p>
                      <!-- 第三层 -->
                      <div class="children three" v-show="val?.open">
                        <template v-for="row in val?.children" :key="row?.seq">
                          <p class="item-name position" v-if="row">
                            <span class="open-or-close" @click="row.open = !row.open" v-show="row.children.length"
                              >{{ row.open ? '-' : '+' }}
                            </span>
                            <span class="text">
                              <SvgIcon name="status" color="#33ccff" size="1.5em"></SvgIcon>
                              <span class="right" @contextmenu.prevent="tapRightItem($event, '第三层', row, element, val)">
                                {{ row.nextStationType }} {{ row.nextstationTypeDesc }}
                              </span>
                            </span>
                          </p>
                        </template>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
              <template v-for="item in list2" :key="item.seq">
                <p class="item-name position" @mouseup.stop="listMouseup('第一层', item)">
                  <span class="open-or-close" @click="item.open = !item.open" v-show="item.children.length">{{ item.open ? '-' : '+' }} </span>
                  <span class="text">
                    <SvgIcon v-if="item.necessary === 'Y'" name="status" color="#33ccff" size="1.5em"></SvgIcon>
                    <SvgIcon v-else name="status" color="#ffcc66" size="1.5em"></SvgIcon>
                    <span ref="dropItem" class="right" @contextmenu.prevent="tapRightItem($event, '第一层', item)">
                      {{ item.nextStationType }} {{ item.nextstationTypeDesc }}
                    </span>
                  </span>
                </p>
                <!-- 第二层数据 -->
                <div class="children two" v-show="item.open">
                  <template v-for="val in item.children" :key="val?.seq">
                    <p class="item-name position" v-if="val" @mouseup.stop="listMouseup('第二层', item, val)">
                      <span class="open-or-close" @click="val.open = !val.open" v-show="val.children.length">{{ val.open ? '-' : '+' }} </span>
                      <span class="text">
                        <SvgIcon name="status_tool" color="#33ccff" size="1.5em"></SvgIcon>
                        <span ref="dropItem" class="right" @contextmenu.prevent="tapRightItem($event, '第二层', val, item)">
                          {{ val.nextStationType }} {{ val.nextstationTypeDesc }}
                        </span>
                      </span>
                    </p>
                    <!-- 第三层 -->
                    <div class="children three" v-show="val?.open">
                      <template v-for="row in val?.children" :key="row?.seq">
                        <p class="item-name position" v-if="row">
                          <span class="open-or-close" @click="row.open = !row.open" v-show="row.children.length">{{ row.open ? '-' : '+' }} </span>
                          <span class="text">
                            <SvgIcon name="status" color="#33ccff" size="1.5em"></SvgIcon>
                            <span class="right" @contextmenu.prevent="tapRightItem($event, '第三层', row, item, val)">
                              {{ row.nextStationType }} {{ row.nextstationTypeDesc }}
                            </span>
                          </span>
                        </p>
                      </template>
                    </div>
                  </template>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
  <!-- 菜单 -->
  <div ref="menuRef" class="menu" v-show="JSON.stringify(rightClickData.data) != '{}'">
    <div class="item" v-show="rightClickData.level === '第一层'" @click.stop="handlemenuItemClick('status')">
      {{ rightClickData.data.necessary === 'Y' ? $t('caft.stationStatus1') : $t('caft.stationStatus2') }}
    </div>
    <div class="item" @click.stop="handlemenuItemClick('del')">{{ $t('btn.delete') }}</div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  display: grid;
  grid-template-columns: repeat(2, 49.5%);
  justify-content: center;
  grid-column-gap: 10px;
  height: calc(100vh - 50px - 30px - 40px - 30px - 50px - 18px - 5px);

  .el-scrollbar {
    height: calc(100vh - 50px - 30px - 40px - 30px - 50px - 18px - 30px);
  }
}

.el-card {
  position: relative;

  .el-switch {
    position: absolute;
    right: 30px;
    top: 10px;
    z-index: 2;
  }

  .item {
    user-select: none;

    .item-name {
      display: flex;
      align-items: center;
      margin: 5px 0;

      .open-or-close {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 5px;
        width: 12px;
        height: 12px;
        font-size: 10px;
        font-weight: bold;
        border: 2px solid #b1b1b1;
        color: #7c8dbc;
        border-radius: 3px;
        cursor: pointer;
      }

      .text {
        flex: 1;
        display: flex;
        align-items: center;

        & > span {
          padding: 5px;
        }

        .right {
          flex: 1;
          padding: 3px;
          border-radius: 3px;
          cursor: pointer;
        }
      }
    }

    .position {
      position: relative;

      .open-or-close {
        position: absolute;
        left: -16px;
      }
    }

    .children {
      display: flex;
      flex-direction: column;

      & > span {
        display: flex;
        align-items: center;
        margin: 1px 0;

        .svg-icon {
          margin-right: 3px;
        }
      }

      &.one {
        margin-left: 36px;
      }

      &.two {
        margin-left: 30px;
      }

      &.three {
        margin-left: 26px;
      }
    }
  }
}

.menu {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 5px 0;
  background-color: #fff;
  border: none;
  border-radius: 4px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;

  & .item {
    padding: 7px 0;
    width: 140px;
    text-align: center;
    cursor: pointer;

    &:hover {
      color: #409eff;
      background-color: #ecf5ff;
    }
  }
}
</style>
