<template>
  <!-- 表单 -->
  <div class="form">
    <el-form :inline="true" :model="formData">
      <el-form-item :label="$t('line.lineName')">
        <el-select v-model="formData.line" filterable clearable :placeholder="$t('common.selectTip')" style="width: 200px" @change="lineChange">
          <el-option v-for="item in lineOptions" :key="item.line" :label="item.line" :value="item.line" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="btn">
      <el-button type="info" plain icon="Upload" v-hasPermi="['datacenter:factory:plant:import']" @click="uploadData">
        {{ $t('btn.import') }}
      </el-button>
      <el-button type="warning" plain icon="Download" v-hasPermi="['datacenter:factory:plant:export']" @click="dowloadData">
        {{ $t('btn.export') }}
      </el-button>
    </div>
  </div>

  <!-- 分割线 -->
  <el-divider />
  <!-- 主体 -->
  <CopyDraggable
    :line="formData.line"
    :list1="list1"
    :list2="list2"
    :list1-loading="list1Loading"
    :list2-loading="list2Loading"
    @update-open="updateOpen"
    @update-list2="updateList2"
    @add-right-data="addRightData"
    @del-right-data="delRightData" />
  <!-- 导入弹窗 -->
  <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
    <el-upload
      name="file"
      ref="uploadRef"
      :limit="1"
      accept=".xlsx,.xls"
      :headers="upload.headers"
      :action="upload.url"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag>
      <el-icon class="el-icon--upload">
        <upload-filled />
      </el-icon>
      <div class="el-upload__text" v-html="$t('common.uploadText')"></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>{{ $t('common.uploadTip') }}</span>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="upload.open = false">{{ $t('btn.cancel') }}</el-button>
      <el-button type="primary" @click="submitFileForm">{{ $t('btn.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup name="plant">
import { getToken } from '@/utils/auth'
import CopyDraggable from './components/CopyDraggable'
import { getPlantLineData, getPlantLeftData, getPlantRightData, addPlantRightData, delPlantRightData } from '@/api/datacenter/factory/plant'

const { proxy } = getCurrentInstance()

// 表单
const formData = reactive({
  line: ''
})

// 线别列表
const lineOptions = ref([])

// 获取线别
const getLine = async () => {
  const res = await getPlantLineData()
  lineOptions.value = res
}
getLine()

// 导入
const upload = reactive({
  open: false,
  title: '',
  isUploading: false,
  headers: { Authorization: 'Bearer ' + getToken() },
  url: import.meta.env.VITE_APP_BASE_API + '/prodMnt/FactoryInformation/StationImportData'
})

// 点击上传按钮
const uploadData = async () => {
  upload.title = proxy.$t('btn.import')
  upload.open = true
}

// 文件上传中处理
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true
}

// 文件上传成功处理
const handleFileSuccess = (response, file, fileList) => {
  const { code, msg, data } = response
  upload.open = false
  upload.isUploading = false
  proxy.$refs['uploadRef'].clearFiles()
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + data.item1 + '</div>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  getList()
}

// 提交上传文件
function submitFileForm() {
  proxy.$refs['uploadRef'].submit()
}

// 导出
const dowloadData = () => {
  proxy.downFile('/prodMnt/FactoryInformation/ShowLineExport', { pageSize: total.value })
}

// 将获取到的数据整理成树形结构
const getTreeData = (key, data) => {
  // 筛选出第一层
  const arr = [...new Set(data.map((item) => item[key]))].map((item) => ({ [key]: item, children: [], open: false }))

  // 将每条数据塞到对应的上一层数据的 children 中
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < data.length; j++) {
      // data[j].children = []
      // data[j].open = false
      if (data[j][key] === arr[i][key]) {
        if (key === 'stationType') arr[i].stationTypesDesc = data[j].stationTypesDesc
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
  const res = await getPlantLeftData()
  list1.value = getTreeData('stage', res)
  list1Loading.value = false
}
getLeftData()

// 接收拖拽数据的数据列表
const list2 = ref([])
const list2Loading = ref(false)
const getRightData = async () => {
  list2.value = []
  list2Loading.value = true
  const res = await getPlantRightData({ line: formData.line })
  list2.value = getTreeData('stage', res)
  for (let i = 0; i < list2.value.length; i++) {
    list2.value[i].children = getTreeData('stationType', list2.value[i].children)
  }
  list2Loading.value = false
}

// 选取线别获取右侧数据
const lineChange = async (value) => {
  if (!value) return (list2.value = [])
  getRightData()
}

// 更新接收拖拽数据的数据列表
const updateList2 = (type, data, row) => {
  const arr = { ...data }
  console.log(arr)
  // 拖拽
  if (type === 'drag') {
    for (let i = 0; i < arr.children.length; i++) {
      arr.children[i] = { stationType: arr.children[i].stationType, stationTypesDesc: arr.children[i].stationTypesDesc, children: [], open: false }
    }
    arr.open = true
    list2.value.push(arr)
  }
  // 新增
  if (type === 'add') {
    for (let i = 0; i < list2.value.length; i++) {
      if (list2.value[i].stage === row.stage) {
        for (let j = 0; j < list2.value[i].children.length; j++) {
          if (list2.value[i].children[j].stationType === arr.stationType) {
            list2.value[i].children[j] = arr
            list2.value[i].children[j].open = true
          }
        }
      }
    }
  }
  // 删除
  // if (type === 'del') {}
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

// 新增右侧数据
const addRightData = async (type, data, row, number) => {
  list2Loading.value = true
  const res = await addPlantRightData({ ...row, number })
  list2Loading.value = false
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    await updateList2(type, data, row)
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
}

// 删除右侧数据
const delRightData = async (row) => {
  const res = await delPlantRightData(row)
  if (res === 1) {
    proxy.$modal.msgSuccess(proxy.$t('common.operationSuccess'))
    getRightData()
  } else {
    proxy.$modal.msgError(proxy.$t('common.operationFail'))
  }
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
</style>
