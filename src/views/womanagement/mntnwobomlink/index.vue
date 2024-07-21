<template>
  <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :rules="rules" :inline="false" v-show="showSearch" label-width="68px" size="large"  style="background-color: #ADD8E6;" >
          <el-form-item :label="$t('mntnwostatus.workOrder')" prop="workOrder">
              <el-col :span="4">
                  <el-input v-model="queryParams.workOrder" placeholder="输入工单" clearable @keyup.enter="handleQuery" style="width:200px" />
              </el-col>
              <el-co :span="2">
                  <el-button type="primary" @click="handleQuery">查询</el-button>
              </el-co>
              <el-col :span="1.5">
            <el-button type="info" plain icon="Upload" @click="handleImport" v-hasPermi="['womanagement:mntnwobomlink:import']">
              {{ $t('btn.import') }}
            </el-button>
          </el-col>
          </el-form-item>
      </el-form>
      <!--内容显示-->
      <el-form ref="formRefWo" :model="formWo" :inline="true">
          <el-row>
          <el-col :span="6">    
      <el-form-item :label="$t('mntnwostatus.worK_ORDER')" prop="worK_ORDER">
      <el-input v-model="formWo.worK_ORDER" disabled />
      </el-form-item>
       </el-col>
      <el-col :span="6">  
          <el-form-item :label="$t('mntnwostatus.wostatus')" prop="wostatus">
              <el-input v-model="formWo.wostatus" disabled/>
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.wO_SCHEDULE_START_DATE')" prop="wO_SCHEDULE_START_DATE">
              <el-input v-model="formWo.wO_SCHEDULE_START_DATE" disabled/>
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.wO_SCHEDULE_CLOSE_DATE')" prop="wO_SCHEDULE_CLOSE_DATE">
              <el-input v-model="formWo.wO_SCHEDULE_CLOSE_DATE" disabled/>
           </el-form-item>
          </el-col>
      </el-row>
  <el-row>
      <el-col :span="6"> 
           <el-form-item :label="$t('mntnwostatus.ipn')" prop="ipn">
              <el-input v-model="formWo.ipn" disabled/>
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.version')" prop="version">
              <el-input v-model="formWo.version" disabled/>
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.line')" prop="line">
            <el-input v-model="formWo.line" disabled />
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.customerdn')" prop="customerdn">
              <el-input v-model="formWo.customerdn" disabled />
          </el-form-item>
      </el-col>
  </el-row>
  <el-row>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.targeT_QTY')" prop="targeT_QTY">
              <el-input v-model="formWo.targeT_QTY" disabled />
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.scraP_QTY')" prop="scraP_QTY">
              <el-input v-model.number="formWo.scraP_QTY" disabled />
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.routE_NAME')" prop="routE_NAME">
              <el-input v-model="formWo.routE_NAME" disabled />
          </el-form-item>
      </el-col>
      <el-col :span="6">
          <el-form-item :label="$t('mntnwostatus.remark')" prop="remark">
              <el-input v-model.number="formWo.remark" disabled />
          </el-form-item>
      </el-col>
     </el-row> 
     <el-row>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.inpuT_QTY')" prop="inpuT_QTY">
              <el-input v-model.number="formWo.inpuT_QTY" disabled />
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.outpuT_QTY')" prop="outpuT_QTY">
              <el-input v-model.number="formWo.outpuT_QTY" disabled />
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.starT_STATION_TYPE')" prop="starT_STATION_TYPE">
              <el-input v-model="formWo.starT_STATION_TYPE" disabled/>
          </el-form-item>
      </el-col>
      <el-col :span="6"> 
          <el-form-item :label="$t('mntnwostatus.enD_STATION_TYPE')" prop="enD_STATION_TYPE">
              <el-input v-model="formWo.enD_STATION_TYPE" disabled/>
          </el-form-item>
          </el-col>
      </el-row> 
      </el-form>
  </div>
  <el-table
      :data="dataList"
      v-loading="loading"
      ref="table"
      border
      header-cell-class-name="el-table-header-cell"
      highlight-current-row
      @sort-change="sortChange"
      >
      <el-table-column prop="workOrder" label="工单" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="ipn" label="料号" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="sPEC1" label="品名" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="version" label="Version" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="itemIpn" label="子料" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="itemSpec1" label="子料品名" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="itemVersion" label="ItemVersion" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="itemGroup" label="子料分组" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="itemCount" label="数量" align="center" />
      <el-table-column prop="stationType" label="站点类型" align="center" />
      <el-table-column prop="slot" label="槽体" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="updateEmpno" label="UpdateEmpno" align="center" :show-overflow-tooltip="true" />
      <el-table-column prop="updateTime" label="UpdateTime" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" width="160">
        <template #default="scope">
          <el-button type="success" size="small" icon="edit" title="编辑" v-hasPermi="['business:pwobom:edit']" @click="handleUpdate(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :lock-scroll="false" v-model="open" >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">

          <el-col :lg="12">
            <el-form-item label="工单" prop="workOrder">
              <el-input v-model="form.workOrder"  :disabled="formupdate" />
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="Version" prop="version">
              <el-input v-model="form.version"  :disabled="formupdate"/>
            </el-form-item>
          </el-col>

          <el-col :lg="12">
            <el-form-item label="料号" prop="ipn">
              <el-input v-model="form.ipn"  :disabled="formupdate"/>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="品名" prop="sPEC1">
              <el-input v-model="form.sPEC1" :disabled="formupdate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :lg="12">
            <el-form-item label="子料" prop="itemIpn">
              <el-input v-model="form.itemIpn" placeholder="请输入子料" :disabled="formupdate" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="ItemVersion" prop="itemVersion">
              <el-input v-model="form.itemVersion" placeholder="请输入ItemVersion" :disabled="formupdate" />
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="子料品名" prop="itemSpec1">
              <el-input v-model="form.itemSpec1" placeholder="请输入子料品名" :disabled="formupdate" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :lg="12">
            <el-form-item label="子料分组" prop="itemGroup">
              <el-input v-model="form.itemGroup" placeholder="请输入子料分组" />
            </el-form-item>
          </el-col>
            
          <el-col :lg="12">
            <el-form-item label="数量" prop="itemCount">
              <el-input v-model.number="form.itemCount" placeholder="请输入数量" />
            </el-form-item>
          </el-col>  
        </el-row>
        <el-form-item label="站点类型" prop="stationType">
              <el-select
                v-model="form.stationType"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请输入开始字符"
                :remote-method="remoteMethodStationType"
                :loading="loadingstationtype"
                >
                  <el-option
                    v-for="item in optionststationtype"
                    :key="item.stationType"
                    :label="`站点类型名称：${item.stationType}，站点类型描述：${item.stationTypeDesc}`"
                    :value="item.stationType"
                  />
              </el-select>
            </el-form-item>
      </el-form>
      <template #footer v-if="opertype != 3">
        <el-button text @click="cancel">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
       <!-- 用户导入对话框 -->
       <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload name="file" ref="uploadRef" :limit="1" accept=".xlsx,.xls" :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <el-icon class="el-icon--upload">
          <upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <!-- <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
            </div> -->
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
              @click="importTemplate">下载模板</el-link>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="upload.open = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submitFileForm">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
</template>
<script setup name="mntnwostatus">
import { getwobase,getwobom,updatewobom,addwobom } from '@/api/womanagement/mntnwobomlink'
import { linelistget,routelistget,stationtypelistget,stationlistget } from '@/api/mescommon/mesget'
import { getToken } from '@/utils/auth'
const{proxy} =getCurrentInstance()
// 显示搜索条件
const showSearch=ref(true)
const dataList=ref([])
//查询参数
const formWo=ref({})
//定义数据源
const queryParams = reactive({workOrder: undefined})
const queryForm = ref(null)
//工单状态数据字典
const wostatusoptions=ref([])
//获取字典的值
proxy.getDicts('wostatus').then((response)=>{
wostatusoptions.value=response.data
})
// 表单重置
function reset() {
  queryParams.value = {
      workOrder: null,
      WoStatus: null,
      wO_SCHEDULE_START_DATE: null,
      wO_SCHEDULE_CLOSE_DATE: null,
      ipn: null,
      version: null,
      line: null,
      customerdn: null,
      targeT_QTY: null,
      scraP_QTY: null,
      routE_NAME: null,
      remark: null,
      inpuT_QTY: null,
      outpuT_QTY: null,
      starT_STATION_TYPE: null,
      enD_STATION_TYPE: null
}
//proxy.resetForm('formWo')
}
function getwoDetail(){
  if(queryParams.workOrder)
  {
    getwobase({workOrder:queryParams.workOrder}).then((response)=>{
      console.log(response.data.result[0])
      formWo.value=response.data.result[0]
      GetWoBom()
  }
  )
  }
}
function GetWoBom(){
  getwobom({workOrder:queryParams.workOrder}).then((response)=>{
      console.log(response.data[0])
      dataList.value=response.data  
  }
  )
}
//搜索查询
function handleQuery(){
  console.log(queryParams)
  if(queryParams.workOrder!=null)
  {console.log(queryParams.workOrder)
      //reset()
      getwoDetail()
  }
}

/*************** form操作 ***************/
const formRef = ref()
const title = ref('')
// 操作类型 1、add 2、edit 3、view
const opertype = ref(0)
const open = ref(false)
//是否可以填写
const formupdate=ref(false)
const state = reactive({
  single: true,
  multiple: true,
  form: {},
  rules: {
    workOrder: [{ required: true, message: "工单不能为空", trigger: "blur" }],
    site: [{ required: true, message: "Site不能为空", trigger: "blur" }],
    plant: [{ required: true, message: "Plant不能为空", trigger: "blur" }],
  },
  options: {
    stationTypeOptions: [],
  }
})

const { form, rules, options, single, multiple } = toRefs(state)

const loadingstationtype = ref(false)
const optionststationtype = ref([])
const remoteMethodStationType = (query) => {
  loadingstationtype.value = true
  stationtypelistget({parm:query}).then((res)=>{
console.log(res.data)
optionststationtype.value=res.data
loadingstationtype.value=false
  })
}
// 关闭dialog
function cancel(){
  open.value = false
  reset1()
}

// 重置表单
function reset1() {
  form.value = {
    id:null,
    workOrder: null,
    site: null,
    sPEC1: null,
    itemIpn: null,
    itemSpec1: null,
    itemGroup: null,
    itemCount: null,
    stationType: null,
    version: null,
    slot: null,
    itemVersion: null,
    plant: null,
    ipn: null,
  };
  proxy.resetForm("formRef")
}
// 修改按钮操作
function handleUpdate(row) {
    console.log(row.value)
  reset()
  formupdate.value=true
      open.value = true
      title.value = '修改'
      opertype.value = 2
      form.value = row
}

// 修改 表单提交
function submitForm() {
  proxy.$refs["formRef"].validate((valid) => {
    if (valid) {
      if (opertype.value === 2) {
        updatewobom(form.value).then((res) => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          reset1()
          GetWoBom()
        })
      }
    }
  })
}


/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { Authorization: 'Bearer ' + getToken() },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + '/womanagement/mntnwobomlink/importData'
})
/** 导入按钮操作 */
function handleImport() {
  upload.title = '用户导入'
  upload.open = true
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download('/womanagement/mntnwobomlink/importTemplate', '用户数据导入模板')
}
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true
}
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  const { code, msg, data } = response
  upload.open = false
  upload.isUploading = false
  proxy.$refs['uploadRef'].clearFiles()
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + data.item1 + '</div>', '导入结果', {
    dangerouslyUseHTMLString: true
  })
  getwoDetail()
}
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs['uploadRef'].submit()
}
</script>