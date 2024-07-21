<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <el-row :gutter="20">
          <el-col :span="1"></el-col>
          <el-col :span="2">
            <el-button type="info" :icon="View" @click="handleQuery">查询</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="warning" :icon="Lock" @click="handleExcute">执行</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="warning" :icon="Delete" @click="handDelete">删除</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="warning" :icon="Unlock" @click="handUnhold">解除</el-button>
          </el-col>
          <el-col :span="15"></el-col>
        </el-row>

      </el-header>
      <el-main>
        <el-form :model="queryParams" ref="queryForm" style="border: 1px solid #ccc;padding:10px;margin:0px"
          :inline="true" v-show="true">
          <el-form-item label="按料号">
            <el-select v-model="queryParams.pn" placeholder="请选择料号" clearable />
          </el-form-item>
          <el-form-item label="按工单">
            <el-select v-model="queryParams.wo" placeholder="请选择工单" clearable />
          </el-form-item>
          <el-form-item label="按小板码" prop="SN">
            <el-input v-model="queryParams.sn" placeholder="请填写小板码" clearable />
          </el-form-item>
          <el-form-item label="按大板码" prop="PANEL">
            <el-input v-model="queryParams.panel" placeholder="请填写大板码" clearable />
          </el-form-item>
          <!-- <el-form-item>
                   <el-button type="primary" @click="onSubmit">提交</el-button>
               </el-form-item> -->
        </el-form>

        <!-- 添加或修改hold对话框 -->
        <el-dialog :title="title" v-model="open" width="680px" append-to-body>
          <el-form :model="savform" :rules="rules" ref="holdRef" label-width="80px">
            <el-row :gutter="20">
              <el-col :lg="12">
                <el-form-item label="Hold方式">
                  <el-select v-model="savform.method" placeholder="请选择Hold方式" clearable>
                    <el-option v-for="item in methodOptions" :key="item.id" :label="item.name" :value="item.value"
                      :disabled="item.status == 1">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="工号">
                  <el-input v-model="savform.empno" :disabled="true" placeholder="请填写工号" clearable />
                </el-form-item>
              </el-col>


              <el-col :lg="12">
                <el-form-item label="卡控站点">
                  <el-checkbox v-model="savform.allstations" label="是否全部" />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="站点">
                  <el-select v-model="savform.station" multiple :disabled="savform.allstations" placeholder="请选择站点"
                    clearable>
                    <el-option v-for="item in stationOptions" :key="item.id" :label="item.name" :value="item.value"
                      :disabled="item.status == 1">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :lg="12">
                <el-form-item label="卡控码" prop="holdcode">
                  <el-input v-model="savform.holdcode" placeholder="请填写卡控码" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="12">
                <el-form-item label="工段">
                  <el-select v-model="savform.stage" placeholder="请选择工段" clearable>
                    <el-option v-for="item in stageOptions" :key="item.id" :label="item.name" :value="item.value"
                      :disabled="item.status == 1">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="Hold原因">
                  <el-input v-model="savform.hreason" placeholder="请填写Hold原因" clearable />
                </el-form-item>
              </el-col>

              <el-col :lg="12">
                <el-form-item label="需求人">
                  <el-input v-model="savform.holddemond" placeholder="请填写Hold需求人" clearable />
                </el-form-item>
              </el-col>

              <el-col :lg="24">
                <el-form-item label="卡控条码">
                  <el-input v-model="savform.barcode" @change="fillinTab" placeholder="请填写条码,并回车" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="24">
                <el-form-item label="已刷条码">
                  <el-table :data="savform.barcodelist" border style="width: 100%">
                    <el-table-column type="index" width="50" />
                    <el-table-column prop="barcode" label="条码" width="200" />
                    <el-table-column label="Operations">
                      <template #default="scope">
                        <el-button size="small" type="danger" @click="handleRemove(scope.$index, scope.row)">
                          Remove
                        </el-button>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="method" label="卡控方式" width="100" />
                 <el-table-column prop="holdcode" label="卡控码" width="80" />
                 <el-table-column prop="holddemond" label="需求者" width="80" />
                 <el-table-column prop="hreason" label="卡控原因" width="100" /> -->
                  </el-table>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <template #footer>
            <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
            <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
          </template>
        </el-dialog>
        <el-row :gutter="20">
          <el-col>
            <el-table :data="holdList" border style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="pn" label="料号" width="180" />
              <el-table-column prop="wo" label="工单" width="180" />
              <el-table-column prop="sn" label="小板码" width="180" />
              <el-table-column prop="panel" label="大板码" width="220" />
              <el-table-column prop="stationType" label="站位" width="100" />
              <el-table-column prop="holdReason" label="卡控原因" width="300" />
              <el-table-column prop="holdEmpno" label="卡控需求者" width="100" />
              <el-table-column prop="holdTime" label="卡控时间" width="100" />
              <el-table-column prop="unholdReason" label="解除原因" width="300" />
              <el-table-column prop="unholdEmpno" label="解除需求者" width="100" />
              <el-table-column prop="unholdTime" label="解除时间" width="100" />
              <el-table-column prop="holdMethod" label="卡控方式" width="100" />
              <el-table-column prop="createTime" label="创建时间" width="100" />
              <el-table-column prop="createEmpno" label="创建者" width="100" />
              <el-table-column prop="enabled" label="使能" width="100" />
            </el-table>
            <pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
              @pagination="getList" />
          </el-col>
        </el-row>

      </el-main>
    </el-container>
  </div>
</template>
<script setup name="hold">

import { Delete, Lock, View, Unlock } from '@element-plus/icons-vue'
import { listHold, listOptions, excuteHold, deleteHold, releaseHold } from '@/api/quality/hold'
import useUserStore from '@/store/modules/user'
import { getCurrentInstance } from 'vue'
import console from 'console'
import { ElMessage, ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance()

const holdRef = ref(null)

const data = reactive({
  savform: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    pn: '',
    wo: '',
    sn: '',
    panel: ''
  },
  rules: {
    holdcode: [
      { required: true, message: '卡控码不能为空', trigger: 'blur' },
      {
        min: 5,
        max: 20,
        message: '卡控码长度必须介于 5 和 20 之间',
        trigger: 'blur'
      }
    ]
  }
})

const { queryParams, savform, rules } = toRefs(data)





const open = ref(false)
const loading = ref(true)
const total = ref(0)
const holdList = ref([])
const methodOptions = ref([])
const operateOptions = ref([])
const stationOptions = ref([])
const stageOptions = ref([])
const init = ref(getList(), getOptions())

const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
  console.log('Call handleSelectionChange:')
  console.log(val)
}


/** 查询Hold列表 */
function getList() {
  loading.value = true
  console.log('Call getList:')
  console.log(queryParams.value)
  listHold(queryParams.value).then((res) => {
    console.log('CallBack:')
    console.log(res)
    loading.value = false
    holdList.value = res.data.result
    total.value = res.data.totalNum
  })
}
/** 获取后台的用来作为下拉列表选项的绑定的数据 */
function getOptions() {
  listOptions(savform.value).then((res) => {
    console.log("getOptions:")
    console.log(res.data)
    console.log(res.data.methodoptions)
    methodOptions.value = res.data.methodoptions
    operateOptions.value = res.data.operateoptions
    stationOptions.value = res.data.stationoptions
    stageOptions.value = res.data.stageoptions
  })

}
/** 查询按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}


/** 执行按钮操作 */
function handleExcute() {
  reset()
  open.value = true
  // getUser().then((response) => {
  //   postOptions.value = response.data.posts
  //   roleOptions.value = response.data.roles
  //   open.value = true
  //   title.value = '添加用户'
  //   form.value.password = initPassword.value
  // })
}

/* 删除按钮操作 */
function handDelete() {
  if (multipleSelection.value.length != 1) {
    console.log(multipleSelection.value)
    proxy.$modal.msgWarning('请选择一行且只能选择一行')
    return;
  }
  multipleSelection.value.map(r => r.id).join(',')
  ElMessageBox.confirm(
    '你确定要删除id=' + multipleSelection.value.map(r => r.id).join(',') + '这项吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {

      deleteHold(multipleSelection.value).then((response) => {
        getList()
      })
      ElMessage({
        type: 'success',
        message: '删除卡控成功!',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消',
      })
    })


}


/*解除按钮操作 */

function handUnhold() {
  if (multipleSelection.value.length != 1) {
    console.log(multipleSelection.value)
    proxy.$modal.msgWarning('请选择一行且只能选择一行')
    return;
  }
  releaseHold(multipleSelection.value).then((response) => {
    getList()
    proxy.$modal.msgSuccess('解锁成功!')
  })

}

function handleRemove(index, row) {
  console.log('Call handleRemove')
  console.log('index:' + index)
  console.log('row:')
  console.log(row)
  // const arr = Array.from(savform.value.barcodelist)
  savform.value.barcodelist.splice(index, 1)

}


/** 重置操作表单 */
function reset() {
  savform.value = {
    method: undefined,
    operate: undefined,
    empno: useUserStore().userInfo.userName,
    station: undefined,
    holdcode: undefined,
    stage: undefined,
    allstations: true,
    barcode: undefined,
    barcodelist: [],
    // holddate: [new Date(), new Date()+1],
    hreason: undefined,
    rreason: undefined,
    holddemond: undefined
  }
  proxy.resetForm('holdRef')
}

/** 取消按钮操作 */
function cancel() {
  open.value = false
  reset()
}

/** 提交按钮操作 */
function submitForm() {
  proxy.$refs['holdRef'].validate((valid) => {
    if (valid) {
      console.log('Call submitForm:')
      console.log(savform.value)
      excuteHold(savform.value).then((response) => {
        proxy.$modal.msgSuccess('执行卡控成功!')
        open.value = false
        getList()
      })
      // if (form.value.userId != undefined) {
      //   updateUser(form.value).then((response) => {
      //     proxy.$modal.msgSuccess('修改成功')
      //     open.value = false
      //     getList()
      //   })
      // } else {
      //   addUser(form.value).then((response) => {
      //     proxy.$modal.msgSuccess('新增成功')
      //     open.value = false
      //     getList()
      //   })
      // }
    }
  })
}

function fillinTab() {
  console.log('Call fillinTab:')
  console.log('savform:')
  console.log(holdRef.value)
  // const arr = Array.from(savform.value.barcodelist)
  savform.value.barcodelist.push({
    barcode: savform.value.barcode
    // , method: savform.value.method
    // , holdcode: savform.value.holdcode
    // , holddemond: savform.value.holddemond
    // ,hreason:savform.value.hreason
  })
  // savform.value.barcodelist = arr
  savform.value.barcode = ref('')
}

const onSubmit = () => {
  console.log('submit!')
}
</script>