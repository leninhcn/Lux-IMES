<template>
  <!-- 表单 -->
  <div class="form">
    <el-form :inline="true" :model="formData">
      <el-form-item :label="$t('part.routeName')">
        <el-select
          v-model="formData.routeName"
          filterable
          clearable
          :placeholder="$t('common.selectTip')"
          style="width: 200px"
          :filter-method="filterHandler"
          @change="routeNameChange">
          <el-option v-for="item in routeNameOptions" :key="item.id" :label="item.routeName" :value="item.routeName" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button type="primary" :loading="saveBtnLoading" v-hasPermi="['datacenter:processCraft:craft:save']" @click="saveSubmit">
        {{ $t('btn.save') }}
      </el-button>
      <el-button type="primary" v-hasPermi="['datacenter:processCraft:craft:copy']" @click="copyHandler">
        {{ $t('btn.copy') }}
      </el-button>
      <el-button
        type="warning"
        :disabled="!formData.routeName"
        plain
        icon="Download"
        v-hasPermi="['datacenter:processCraft:craft:export']"
        @click="dowloadData">
        {{ $t('btn.export') }}
      </el-button>
    </div>
  </div>
  <!-- 分割线 -->
  <el-divider />
  <!-- 主体 -->
  <CopyDraggable
    :routeName="formData.routeName"
    :list1="list1"
    :list2="list2"
    :list1-loading="list1Loading"
    :list2-loading="list2Loading"
    @update-open="updateOpen"
    @update-list2="updateList2" />
  <!-- 复制弹窗 -->
  <el-dialog v-model="copyDialogVisible.open" :title="$t('btn.copy')" width="800">
    <el-form :model="copyDialogVisible.formData" inline label-width="80px">
      <el-form-item label="RouteName" prop="routeName1">
        <el-select
          v-model="copyDialogVisible.formData.routeName1"
          filterable
          clearable
          :placeholder="$t('common.selectTip')"
          style="width: 200px"
          :filter-method="dialogFilterHandler">
          <el-option v-for="item in copyDialogVisible.options" :key="item.id" :label="item.routeName" :value="item.routeName" />
        </el-select>
      </el-form-item>
      <span class="copy-arrows"></span>
      <el-form-item label="RouteName" prop="routeName2">
        <el-input v-model="copyDialogVisible.formData.routeName2" clearable :placeholder="$t('common.inputTip')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="copyDialogVisible.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="copyDialogVisible.btnLoading" @click="copyDialogConfirm"> {{ $t('btn.submit') }} </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="plant">
import { getCraftRouteNameData, getCraftLeftData, getCraftRightData, checkCraftWip, saveCraftData } from '@/api/datacenter/processCraft/craft'
import CopyDraggable from './components/CopyDraggable'

const { proxy } = getCurrentInstance()

// 表单
const formData = reactive({
  routeName: ''
})
const oldFormData = ref('')

// 工艺流程列表
const routeNameOptions = ref([])
const copyRouteNameOptions = ref([])

// 获取工艺流程
const getRouteName = async () => {
  const res = await getCraftRouteNameData()
  routeNameOptions.value = res.filter((item) => item.routeName)
  copyRouteNameOptions.value = res.filter((item) => item.routeName)
}
getRouteName()

// 工艺流程筛选
const filterHandler = (val) => {
  if (!val) {
    //当清空输入值时，重置 options
    routeNameOptions.value = copyRouteNameOptions.value
  } else {
    routeNameOptions.value = copyRouteNameOptions.value.filter((item) => item.routeName.includes(val))
    // 当 routeNameOptions 没有数组项 则自动添加输出的值为数组项
    if (!routeNameOptions.value.length) {
      routeNameOptions.value = [{ routeName: val }]
    }
  }
}

// 将左侧获取到的数据整理成树形结构
const getLeftTreeData = (data) => {
  // 筛选出第一层
  const arr = [...new Set(data.map((item) => item.stage))].map((item) => ({ stage: item, children: [], open: false }))

  // 将每条数据塞到对应的上一层数据的 children 中
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j].stage === arr[i].stage) {
        arr[i].children.push(data[j])
      }
    }
  }
  return arr
}

// 被拖拽的数据列表
const list1 = ref([])
const list1Loading = ref(false)
const getLeftData = async () => {
  list1.value = []
  list1Loading.value = true
  const res = await getCraftLeftData()
  list1.value = getLeftTreeData(res)
  list1Loading.value = false
}
getLeftData()

// 右侧递归获取树状结构
function getRightTreeData(ary, seq) {
  return ary
    .filter((item) =>
      // 如果没有父id（第一次递归的时候）将所有父级查询出来
      //  item.step === item.seq 就是最顶层
      seq === undefined ? item.step === 0 : item.step === seq
    )
    .map((item) => {
      // 通过父节点ID查询所有子节点
      item.children = getRightTreeData(ary, item.seq)
      item.open = false
      return item
    })
}

// 接收拖拽数据的数据列表
const list2 = ref([])
const list2Loading = ref(false)
const getRightData = async () => {
  list2.value = []
  list2Loading.value = true
  const res = await getCraftRightData({ routeName: formData.routeName })
  res.forEach((item) => {
    if (item.step === item.seq) item.step = 0
  })
  const arr = getRightTreeData(res.filter((item) => item.nextStationType !== null))
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children.length) {
      for (let j = 0; j < arr[i].children.length; j++) {
        arr[i].children[j].open = false
        if (arr[i].children[j].result === 1) {
          arr[i].children[j].children = arr[i].children.filter((item) => item.result === 0)
        }
      }
      arr[i].children = arr[i].children.filter((item) => item.result === 1)
    }
  }
  list2.value = arr
  list2Loading.value = false
}

// 选取工艺流程获取右侧数据
const routeNameChange = async (value) => {
  if (!value) return (list2.value = [])
  getRightData()
}

// 拖拽数据更新
const dragDataUpdate = (arr, level, oneRow, twoRow) => {
  arr.routeName = formData.routeName
  arr.nextStationType = arr.stationType
  arr.nextstationTypeDesc = arr.stationTypeDesc
  arr.necessary = 'Y'
  arr.result = arr.scanType === 'REPAIR' ? 1 : 0
  arr.children = []
  arr.open = false
  if (level === '顶层') {
    if (list2.value.length) {
      arr.stationType = list2.value[list2.value.length - 1].nextStationType
      arr.stationTypeDesc = list2.value[list2.value.length - 1].nextstationTypeDesc
    } else {
      arr.stationType = '0'
      arr.stationTypeDesc = null
    }
    list2.value.push(arr)
  } else if (level === '第一层') {
    // 因为有且只能有一个维修站 所以他的 stationType 和 stationTypeDesc 都是父级的
    arr.stationType = oneRow.nextStationType
    arr.stationTypeDesc = oneRow.nextstationTypeDesc
    list2.value.forEach((item) => {
      if (item.nextStationType === oneRow.nextStationType) {
        item.children.push(arr)
      }
    })
  } else if (level === '第二层') {
    if (twoRow.children.length) {
      arr.stationType = twoRow.children[twoRow.children.length - 1].nextStationType
      arr.stationTypeDesc = twoRow.children[twoRow.children.length - 1].nextstationTypeDesc
    } else {
      arr.stationType = twoRow.nextStationType
      arr.stationTypeDesc = twoRow.nextstationTypeDesc
    }
    list2.value.forEach((item) => {
      if (item.nextStationType === oneRow.nextStationType) {
        item.children.forEach((val) => {
          if (val.nextStationType === twoRow.nextStationType) {
            val.children.push(arr)
          }
        })
      }
    })
  }
}

// 状态更新
const statusUpdate = (data) => {
  for (let i = 0; i < list2.value.length; i++) {
    if (list2.value[i].nextStationType === data.nextStationType) {
      list2.value[i].necessary = list2.value[i].necessary === 'Y' ? 'N' : 'Y'
    }
  }
}

// 删除数据更新
const delDataUpdate = (arr, level, oneRow, twoRow) => {
  oldFormData.value = formData.routeName
  if (level === '顶层') {
    list2.value = []
    formData.routeName = ''
  } else if (level === '第一层') {
    if (list2.value.length === 1) {
      list2.value = []
    } else {
      list2.value = list2.value.filter((item) => item.nextStationType !== arr.nextStationType)
    }
  } else if (level === '第二层') {
    for (let i = 0; i < list2.value.length; i++) {
      if (list2.value[i].nextStationType === oneRow.nextStationType) {
        // 因为有且只有一个维修站，所以直接清空上一层
        list2.value[i].children = []
      }
    }
  } else if (level === '第三层') {
    for (let i = 0; i < list2.value.length; i++) {
      if (list2.value[i].nextStationType === oneRow.nextStationType) {
        for (let j = 0; j < list2.value[i].children.length; j++) {
          if (list2.value[i].children[j].nextStationType === twoRow.nextStationType) {
            if (list2.value[i].children[j].children.length === 1) {
              list2.value[i].children[j].children = []
            } else {
              list2.value[i].children[j].children = list2.value[i].children[j].children.filter(
                (item) => item.nextStationType !== arr.nextStationType
              )
            }
          }
        }
      }
    }
  }
}

// 更新右侧的数据列表
const updateList2 = (type, data, level, oneRow, twoRow) => {
  const arr = { ...data }
  // 拖拽
  if (type === 'drag') {
    dragDataUpdate(arr, level, oneRow, twoRow)
  }
  // 修改状态
  if (type === 'status') {
    statusUpdate(arr)
  }
  // 删除
  if (type === 'del') {
    delDataUpdate(arr, level, oneRow, twoRow)
  }
}

// 更新展开/折叠状态
const updateOpen = (name, boo) => {
  if (name === 'left') {
    list1.value.forEach((item) => {
      item.open = boo
    })
  } else {
    list2.value.forEach((item) => {
      item.open = boo
      item.children.forEach((val) => {
        val.open = boo
      })
    })
  }
}

// 整理seq和step
const setSeqAndStep = () => {
  const arr = []
  let index = 1
  // 第一层
  for (let i = 0; i < list2.value.length; i++) {
    list2.value[i].seq = list2.value[i].step = index
    index++
  }
  // 第二层
  for (let i = 0; i < list2.value.length; i++) {
    for (let j = 0; j < list2.value[i].children.length; j++) {
      list2.value[i].children[j].seq = index
      list2.value[i].children[j].step = list2.value[i].seq
      index++
    }
  }
  // 第三层
  for (let i = 0; i < list2.value.length; i++) {
    for (let j = 0; j < list2.value[i].children.length; j++) {
      for (let n = 0; n < list2.value[i].children[j].children.length; n++) {
        list2.value[i].children[j].children[n].seq = index
        list2.value[i].children[j].children[n].step = list2.value[i].seq
        index++
      }
    }
  }
  // 数组平铺
  for (let i = 0; i < list2.value.length; i++) {
    arr.push(list2.value[i])
    for (let j = 0; j < list2.value[i].children.length; j++) {
      arr.push(list2.value[i].children[j])
      for (let n = 0; n < list2.value[i].children[j].children.length; n++) {
        arr.push(list2.value[i].children[j].children[n])
      }
    }
  }
  return arr
}

// 保存数据
const saveData = async () => {
  try {
    const res = await saveCraftData(setSeqAndStep().length ? setSeqAndStep() : [{ routeName: oldFormData.value }])
    if (res === 1) {
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
      getRightData()
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail'))
    }
  } finally {
    saveBtnLoading.value = false
  }
}

// 点击保存按钮 WIP 检测
const saveBtnLoading = ref(false)
const saveSubmit = async () => {
  saveBtnLoading.value = true
  const res = await checkCraftWip(formData)
  if (res.length) {
    ElMessageBox.confirm(proxy.$t('caft.wipTip'), 'Warning', {
      confirmButtonText: proxy.$t('btn.submit'),
      cancelButtonText: proxy.$t('btn.cancel'),
      type: 'warning'
    }).then(() => {
      saveData()
    })
  } else {
    saveData()
  }
}

// 复制
const copyDialogVisible = reactive({
  open: false,
  formData: {
    routeName1: '',
    routeName2: ''
  },
  options: [],
  copyOptions: [],
  data: [],
  btnLoading: false
})

// 打开复制弹窗
const copyHandler = async () => {
  copyDialogVisible.open = true
  const res = await getCraftRouteNameData()
  copyDialogVisible.options = copyDialogVisible.copyOptions = res.filter((item) => item.routeName)
}

// 筛选
const dialogFilterHandler = (val) => {
  if (!val) {
    //当清空输入值时，重置 options
    copyDialogVisible.options = copyDialogVisible.copyOptions
  } else {
    copyDialogVisible.options = copyDialogVisible.copyOptions.filter((item) => item.routeName.includes(val))
  }
}

// 复制弹窗确定
const copyDialogConfirm = async () => {
  copyDialogVisible.btnLoading = true
  const list = await getCraftRightData({ routeName: copyDialogVisible.formData.routeName1 })
  list.map((item) => {
    item.routeName = copyDialogVisible.formData.routeName2
    return item
  })
  try {
    const res = await saveCraftData(list)
    if (res === 1) {
      proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
      copyDialogVisible.open = false
      getRouteName()
    } else {
      proxy.$modal.msgError(proxy.$t('common.operationFail'))
    }
  } finally {
    copyDialogVisible.btnLoading = false
  }
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/ProcessTechnology/ShowRouteDetailExport', { routeName: formData.routeName })
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
}

.el-divider {
  margin: 0 0 18px 0;
}

.copy-arrows {
  position: relative;
  top: -8px;
  display: inline-block;
  width: 55px;
  height: 2px;
  background-color: #ccc;
  margin-right: 38px;

  &::after {
    position: absolute;
    top: -4px;
    right: 0;
    content: '';
    height: 10px;
    width: 10px;
    border-color: #ccc;
    border-style: solid;
    border-width: 2px 2px 0 0;
    transform: rotate(45deg);
  }

  &::before {
    position: absolute;
    top: -18px;
    left: 50%;
    transform: translate(-50%);
    content: 'copy';
    color: #f56c6c;
  }
}
</style>
