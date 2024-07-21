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
            </el-form-item>
            <el-form-item :label="$t('mntnwostatus.status')" prop="status">
                <el-select v-model="queryParams.status" placeholder="选择工单状态" style="width:200px">
                    <el-option v-for="dict in wostatusoptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('mntnwostatus.memo')" prop="memo" style="width:500px">
              <el-input v-model="queryParams.memo" type="textarea"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">{{ $t('btn.submit') }}</el-button>
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
</template>
<script setup name="mntnwostatus">
import { getDetail,update } from '@/api/womanagement/mntnwostatus';
const{proxy} =getCurrentInstance()
// 显示搜索条件
const showSearch=ref(true)
//查询参数
//const formWo=reactive({})
//定义数据源
const queryParams = reactive({workOrder: undefined,
  status: undefined,
    memo:undefined})
// 表单校验
const state = reactive({
    formWo:{},
  rules: {
    workOrder:[{ required: true, message: '工单不能为空', trigger: 'blur' }],
    status:[{ required: true, message: '状态不能为空', trigger: 'blur' }],
    memo:[{min:0,max:100,message:'长度在100之间',trigger:'blur'}]
  }
})
const { formWo, rules } = toRefs(state)
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
function queryreset() {
    queryParams = {
        workOrder: null,
        status: null,
        memo: null
  }
  //proxy.resetForm('formWo')
}
function getwoDetail(){
    //const postId = {id:row.configId || idsvalue.value[0]}
    //{workOrder:queryParams.value.workOrder}
    getDetail({workOrder:queryParams.workOrder}).then((response)=>{
        console.log(response.data[0])
        formWo.value=response.data[0]
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
//提交按钮
function submitForm(){
    proxy.$refs['queryForm'].validate((valid) => {
        if(valid)
        {
            update(queryParams).then((response)=>{
                proxy.$modal.msgSuccess("更新OK")
                //reset()
                getwoDetail()
                queryreset()
            })
        }
    })
}
</script>