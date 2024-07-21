<script setup name="CopyDraggable">
import SvgIcon from '@/components/SvgIcon'
import useUserStore from '@/store/modules/user'
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

const props = defineProps({
  line: {
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

const emit = defineEmits(['updateList2', 'addRightData', 'delRightData', 'updateOpen'])

// 数据样式
const childrenStyle = computed(() => (row) => {
  return { color: row.clientType === 'PDCA' ? '#2437ff' : row.clientType === 'AUTO' ? '#ffc75e' : '' }
})

// 左侧控制展开/折叠
const switchLeftVal = ref(false)
watch(switchLeftVal, (newValue) => {
  emit('updateOpen', 'left', newValue)
})

// 线别控制展开/折叠
const open = ref(false)

// 左侧控制展开/折叠
const switchRightVal = ref(false)
watch(switchRightVal, (newValue) => {
  open.value = newValue
  emit('updateOpen', 'right', newValue)
})

// body 元素
let bodyEl = document.body

// 被拖拽的元素
const dragItem = ref()

// 被拖拽的数据
const draggableData = ref({})

// 被拖拽的索引
const dragIndex = ref(0)

// 被拖拽元素 鼠标按下
const downItem = (data, i) => {
  dragIndex.value = i
  draggableData.value = data
  dragItem.value[i].style.backgroundColor = '#a0cfff'
  bodyEl.style.cursor = 'copy'
}

// 被拖拽的元素到达目的地 鼠标抬起
const listMouseup = () => {
  if (!props.line) return
  if (JSON.stringify(draggableData.value) === '{}') return
  const rightFlag = props.list2.flat().map((item) => item.stage)
  if (rightFlag.includes(draggableData.value.stage)) {
    return proxy.$modal.msgWarning(proxy.$t('common.already'))
  }
  emit('updateList2', 'drag', draggableData.value)
  open.value = true
  draggableData.value = {}
}

// 页面鼠标抬起
const upItem = () => {
  dragItem.value[dragIndex.value].style.backgroundColor = 'transparent'
  bodyEl.style.cursor = 'auto'
  draggableData.value = {}
}
bodyEl.addEventListener('mouseup', upItem)

// 右击右侧数据
const menuRef = ref()
const rightClickData = ref({})
const tapRightItem = (e, data) => {
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
  menuRef.value.style.left = `${e.pageX - document.querySelector('.el-aside').offsetWidth - 50}px`
  // 保存右击的数据
  rightClickData.value = data
}

// 页面点击 右侧选中数据清空
const tapBody = () => {
  rightClickData.value = {}
}
bodyEl.addEventListener('click', tapBody)

// 生成新增的站点列表
const createStationNameList = (num) => {
  let obj = {}
  let index = 0
  props.list2.forEach((item) => {
    item.children.forEach((val) => {
      if (val.stationType === rightClickData.value.stationType) {
        obj = { ...val }
        index = val.children.length
      }
    })
  })

  for (let i = index + 1; i <= num + index; i++) {
    const newStationName = `${useUserStore().userInfo.site}_${props.line}_${i}_${rightClickData.value.stationType}`
    obj.children.push({ stationName: newStationName })
  }

  return obj
}

// 菜单
const handlemenuItemClick = async (type) => {
  if (type === 'add') {
    // 新增
    ElMessageBox.prompt(proxy.$t('site.addSiteNumber'), proxy.$t('common.tips'), {
      confirmButtonText: proxy.$t('common.ok'),
      cancelButtonText: proxy.$t('common.cancel'),
      inputPattern: /^\d+$/,
      inputErrorMessage: 'Error'
    }).then(async ({ value }) => {
      emit('addRightData', 'add', createStationNameList(Number(value)), rightClickData.value, value)
      rightClickData.value = {}
    })
  } else {
    // 删除
    emit('delRightData', rightClickData.value)
    rightClickData.value = {}
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
        <!-- 第一层数据  -->
        <div ref="dragItem" class="item drag-item" v-for="(item, i) in list1" :key="item.stage" @mousedown="downItem(item, i)">
          <p class="item-name">
            <span class="open-or-close" @click="item.open = !item.open" v-show="item.children.length">{{ item.open ? '-' : '+' }} </span>
            <span class="text">
              <SvgIcon name="file" size="1.1em"></SvgIcon>
              <span>{{ item.stage }}</span>
            </span>
          </p>
          <!-- 第二层数据 -->
          <div class="children one" v-show="item.open">
            <span v-for="val in item.children" :key="val.stationType" :style="childrenStyle(val)">
              <SvgIcon name="status" color="#33ccff" size="1.5em"></SvgIcon>
              <span>{{ val.stationType }} {{ val.stationTypesDesc }}</span>
            </span>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
    <!-- 右侧 -->
    <el-card shadow="never" v-loading="list2Loading" @mouseup="listMouseup">
      <!-- 展开/折叠 -->
      <el-switch v-model="switchRightVal" inline-prompt :active-text="$t('btn.expand')" :inactive-text="$t('btn.collapse')" />
      <!-- 数据 -->
      <el-scrollbar>
        <div ref="acItem" class="item ac-item">
          <!-- 线别 -->
          <p class="item-name" v-show="line">
            <span class="open-or-close" @click="open = !open" v-show="list2.length">{{ open ? '-' : '+' }} </span>
            <span class="text">
              <SvgIcon name="line" size="1.1em"></SvgIcon>
              <span @contextmenu.prevent="tapRightItem($event, { line })">{{ line }}</span>
            </span>
          </p>
          <!-- 第一层数据 -->
          <div class="children one" v-show="open">
            <template v-for="item in list2" :key="item.stage">
              <p class="item-name position">
                <span class="open-or-close" @click="item.open = !item.open" v-show="item.children.length">{{ item.open ? '-' : '+' }} </span>
                <span class="text">
                  <SvgIcon name="file" size="1.1em"></SvgIcon>
                  <span class="right" @contextmenu.prevent="tapRightItem($event, { line, stage: item.stage })">{{ item.stage }}</span>
                </span>
              </p>
              <!-- 第二层数据 -->
              <div class="children two" v-show="item.open">
                <template v-for="val in item.children" :key="val.stage">
                  <p class="item-name position">
                    <span class="open-or-close" @click="val.open = !val.open" v-show="val.children.length">{{ val.open ? '-' : '+' }} </span>
                    <span class="text">
                      <SvgIcon name="status" color="#33ccff" size="1.5em"></SvgIcon>
                      <span class="right" @contextmenu.prevent="tapRightItem($event, { line, stage: item.stage, stationType: val.stationType })">
                        {{ val.stationType }} {{ val.stationTypesDesc }}
                      </span>
                    </span>
                  </p>
                  <!-- 第三层数据 -->
                  <div class="children three" v-show="val.open">
                    <template v-for="row in val.children" :key="row.stage">
                      <p class="item-name position">
                        <span class="text">
                          <SvgIcon name="status" color="#66ff99" size="1.5em"></SvgIcon>
                          <span
                            class="right"
                            @contextmenu.prevent="tapRightItem($event, { line, stage: item.stage, stationType: val.stationType, number: 1 })">
                            {{ row.stationName }}
                          </span>
                        </span>
                      </p>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
  <!-- 菜单 -->
  <div ref="menuRef" class="menu" v-show="JSON.stringify(rightClickData) != '{}'">
    <div
      class="item"
      v-show="rightClickData.stationType && !rightClickData.number"
      @click.stop="handlemenuItemClick('add')"
      v-hasPermi="['datacenter:factory:plant:add']">
      {{ $t('btn.add') }}
    </div>
    <div class="item" @click.stop="handlemenuItemClick('del')" v-hasPermi="['datacenter:factory:plant:remove']">{{ $t('btn.delete') }}</div>
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
        display: flex;
        align-items: center;

        & > span {
          padding: 5px;
        }

        .right {
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
        margin-left: 21px;
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
    padding: 3px 0;
    width: 100px;
    text-align: center;
    cursor: pointer;

    &:hover {
      color: #409eff;
      background-color: #ecf5ff;
    }
  }
}
</style>
