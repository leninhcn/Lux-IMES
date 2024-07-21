<template>
	<div class="app-container">
		<el-row :gutter="20">
			<el-col :span="3">
				<el-select v-model="queryParams.enabled" value-key="id" placeholder=""
					@change="enabledchange(queryParams.enabled)" style="width: 100px">
					<el-option v-for="item in enabledOptions" :key="item.id" :label="item.label" :value="item" />

				</el-select>
			</el-col>
			<el-col :span="3">
				<el-button type="warning" :icon="DocumentAdd" @click="handleAdd">新增</el-button>
			</el-col>
			<el-col :span="3">
				<el-button type="warning" :icon="Edit" @click="handleModify">修改</el-button>
			</el-col>
			<el-col :span="3">
				<el-button type="warning" :icon="CopyDocument" @click="handleCopy">复制</el-button>
			</el-col>
			<el-col :span="3">
				<el-button type="warning" :disabled="queryParams.enabled.val == 'A' ? true : false"
					:icon="Close">{{ queryParams.enabled.label }}</el-button>
			</el-col>
			<el-col :span="3">
				<el-button type="warning" :icon="Delete" @click="handleDelete">删除</el-button>
			</el-col>
			<el-col :span="3">
				<el-button type="warning" :icon="Download">导入</el-button>
			</el-col>
			<el-col :span="3">
				<el-button type="warning" :icon="Upload" @click="handleExport">导出</el-button>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col>
				<el-form :model="queryParams" :rules="rules" ref="queryRef"
					style="border: 1px solid #ccc;padding:10px;margin;:0px" :inline="true" v-show="true">
					<el-form-item label="筛选条件" prop="filterfield">
						<el-select v-model="queryParams.filterfield" placeholder="请选择筛选字段" style="width: 240px">
							<el-option v-for="dict in queryParams.fieldOptions" :key="dict.dictValue"
								:label="dict.dictLabel" :value="dict.dictValue" />
						</el-select>
					</el-form-item>

					<el-form-item label="筛选值" prop="filtervalue">
						<el-input v-model="queryParams.filtervalue" placeholder="请填写筛选值" clearable />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="query">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<!-- 添加或修改dppm对话框 -->
		<el-dialog :title="title" v-model="open1" width="680px" append-to-body>
			<el-form :model="editform" :rules="rules" ref="editformRef" label-width="80px">
				<el-row :gutter="20">
					<el-col :lg="12">
						<el-form-item label="机种:">
							<el-select v-model="editform.model" placeholder="请选择机种" style="width: 240px">
								<el-option v-for="dict in editform.modelOptions" :key="dict.dictValue"
									:label="dict.dictLabel" :value="dict.dictValue" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="工单:">
							<el-input v-model="editform.wo" placeholder="" clearable />
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="厂内料号:">
							<el-input v-model="editform.ipn" placeholder="" clearable />
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="序列号:">
							<el-input v-model="editform.serialNumber" placeholder="" clearable />
						</el-form-item>
					</el-col>

					<el-col :lg="24">
						<el-form-item label="不良描述:">
							<el-input v-model="editform.ngdescription" type="textarea" placeholder="" clearable />
						</el-form-item>
					</el-col>

					<el-col :lg="6">
						<el-form-item label="不良率:">
							<el-input v-model="editform.ngrate" placeholder="" clearable />
						</el-form-item>
					</el-col>
					<el-col :lg="6">
						<el-form-item label="">
							<el-text>&#37;</el-text>
						</el-form-item>
					</el-col>

					<el-col :lg="6">
						<el-form-item label="DPPM:">
							<el-input v-model="editform.dppm" placeholder="" clearable />
						</el-form-item>
					</el-col>

					<el-col :lg="6">
						<el-form-item label="RMA号:">
							<el-input v-model="editform.rmanumber" placeholder="" clearable />
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="物料状态:">
							<el-select v-model="editform.status" placeholder="" style="width: 240px">
								<el-option v-for="dict in editform.statusOptions" :key="dict.dictValue"
									:label="dict.dictLabel" :value="dict.dictValue" />
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="接收日期:">
							<el-date-picker v-model="editform.receivedate" type="datetime" placeholder=""
								value-formate="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" />
						</el-form-item>
					</el-col>

					<el-col :lg="24">
						<el-form-item label="上传报告:">
							<el-upload ref="uploadRef" class="upload-demo" action="#" :on-error="handleUploadError"
								:on-success="(res, fileupload) => { handleUploadSuccess(res, fileupload) }"
								:on-change="(file, fileList) => { changefile(file, fileList, index) }" :auto-upload="false">
								<template #trigger>
									<el-button type="primary">选择文件</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
								</template>

								<el-button class="ml-3" type="success" @click="submitUpload">
									上传
								</el-button>
								<template #tip>
									<div class="el-upload__tip"> files with a size less than 500kb
									</div>
								</template>
							</el-upload>
						</el-form-item>
					</el-col>

					<el-col :lg="24">
						<el-form-item label="备注:">
							<el-input v-model="editform.remark" type="textarea" placeholder="" clearable />
						</el-form-item>
					</el-col>


				</el-row>
			</el-form>
			<template #footer>
				<el-button text @click="cancel('open1')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open1')">{{ $t('btn.submit') }}</el-button>
			</template>
		</el-dialog>
		<el-row :gutter="20">
			<el-col>
				<el-table ref="dppmRef" border :data="dppmList" @selection-change="handleSelectionChange('dppmRef')">
					<el-table-column type="selection" width="55" />
					<el-table-column prop="id" label="ID" width="80" />
					<el-table-column prop="week" label="周别" width="80" />
					<el-table-column prop="month" label="月份" width="80" />
					<el-table-column prop="model" label="机种" width="120" />
					<el-table-column prop="serialNumber" label="小板码" width="100" />
					<el-table-column prop="ngdescription" label="不良描述" width="120" />
					<el-table-column prop="ngrate" label="不良率" width="120" />
					<el-table-column prop="dppm" label="DPPM" width="120" />
					<el-table-column prop="receivedate" label="接收日期" width="80" />
					<el-table-column prop="rmanumber" label="RMA号" width="100" />
					<el-table-column prop="status" label="状态" width="100" />
					<el-table-column prop="report" label="分析报告" width="80" />
					<el-table-column prop="uploaddate" label="上传日期" width="100" />
					<el-table-column prop="enabled" label="使能" width="80" />
					<el-table-column prop="updateEmpno" label="修改人" width="80" />
					<el-table-column prop="updateTime" label="修改时间" width="150" />
					<el-table-column prop="createEmpno" label="创建人" width="80" />
					<el-table-column prop="createTime" label="创建时间" width="150" />
					<el-table-column visible="false" prop="oPTION1" label="备用项" width="150" />
					<el-table-column visible="false" prop="oPTION2" label="备用项" width="150" />
					<el-table-column visible="false" prop="oPTION3" label="备用项" width="150" />
					<el-table-column visible="false" prop="oPTION4" label="备用项" width="150" />
					<el-table-column visible="false" prop="oPTION5" label="备用项" width="150" />
					<el-table-column prop="remark" label="备注" width="300" />
				</el-table>
				<pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
					@pagination="getList" />
			</el-col>
		</el-row>

	</div>
</template>
<style>
.el-row {
	margin-top: 20px;
}
</style>
<script setup name="dppm">
import { DocumentAdd, Edit, Delete, CopyDocument, Close, Upload, Download } from '@element-plus/icons-vue'
import {
	listMMaterialdppm, QueryModels, addMMaterialdppm, updateMMaterialdppm, uploadFiles
} from '@/api/quality/dppm'
import useUserStore from '@/store/modules/user'
const { proxy } = getCurrentInstance()
const queryRef = ref(null)
const total = ref(0)
const loading = ref(true)
const open1 = ref(false)
const open2 = ref(false)
const open3 = ref(false)
const title = ref('编辑')

const filesData = ref([])

// const enabled = ref({ id: 1, label: '全部', val: 'A' })
const enabledOptions = ref([
	{ id: 1, label: '全部', val: 'A' },
	{ id: 2, label: '启用', val: 'Y' },
	{ id: 3, label: '禁用', val: 'N' }
])
const queryParams = reactive({
	pageNum: 1,
	pageSize: 10,
	enabled: { id: 1, label: '全部', val: 'A' },
	filterfield: '',
	filtervalue: '',
	fieldOptions: [{ dictValue: 'model', dictLabel: '机种' }
		, { dictValue: 'week', dictLabel: '周别' }
		, { dictValue: 'month', dictLabel: '月份' }
		, { dictValue: 'serialNumber', dictLabel: '小板码' }
		, { dictValue: 'rmanumber', dictLabel: 'RMA号' }
		, { dictValue: 'status', dictLabel: '状态' }
		, { dictValue: 'enabled', dictLabel: '使能' }
	]
})

const editform = ref({
	mode: ''
	, id: 0
	, model: ''
	, modelOptions: []
	, wo: ''
	, ipn: ''
	, serialNumber: ''
	, ngdescription: ''
	, ngrate: ''
	, dppm: ''
	, rmanumber: ''
	, status: ''
	, statusOptions: [{ dictValue: 'Open', dictLabel: '未进行' }
		, { dictValue: 'Tracking', dictLabel: '跟进中' }
		, { dictValue: 'Closed', dictLabel: '已完成' }]
	, receivedate: new Date()
	, remark: ''
})

const filterform = ref({
	filterfield: ''
	, filtervalue: ''
	, filterfieldOptions: []
	, filterlist: []
})
const dppmList = ref([])

const init = ref(reset(), getList())

function enabledchange(enabled) {
	console.log('Call enabledchange:')
	console.log(enabled)
	getList()
}


/** 重置查询表单 */
function reset() {
	queryParams.value = {
		pageNum: 1,
		pageSize: 10,
		enabled: { id: 1, label: '全部', val: 'A' },
		filterfield: '',
		filtervalue: '',
		fieldOptions: [{ dictValue: 'model', dictLabel: '机种' }
			, { dictValue: 'week', dictLabel: '周别' }
			, { dictValue: 'month', dictLabel: '月份' }
			, { dictValue: 'serialNumber', dictLabel: '小板码' }
			, { dictValue: 'rmanumber', dictLabel: 'RMA号' }
			, { dictValue: 'status', dictLabel: '状态' }
			, { dictValue: 'enabled', dictLabel: '使能' }
		]
	}
	proxy.resetForm('queryRef')
}

const rules = {

	filtervalue: [
		{ required: true, message: '筛选值不能为空', trigger: 'blur' }
	]
}


/** 重置编辑对话框 */
function reseteditform(selected) {
	if (!selected) {
		editform.value = {
			mode: ''
			, id: 0
			, model: ''
			, modelOptions: []
			, wo: ''
			, ipn: ''
			, serialNumber: ''
			, ngdescription: ''
			, ngrate: ''
			, dppm: ''
			, rmanumber: ''
			, status: ''
			, statusOptions: [{ dictValue: 'Open', dictLabel: '未进行' }
				, { dictValue: 'Tracking', dictLabel: '跟进中' }
				, { dictValue: 'Closed', dictLabel: '已完成' }]
			, receivedate: new Date()
			, remark: ''
		}
		return
	}

	// 带参数的情况下,需要把选中的那行数据赋值到editform.value,以便在对话框中显示出来
	editform.value.id = selected[0].id
	editform.value.qclevel = selected[0].qcLevel
	editform.value.txtcheckrule = selected[0].checkRule
	editform.value.onlinestation = selected[0].onlineStationType
	editform.value.returnstation = selected[0].returnStationType
	editform.value.qcroute = selected[0].qcRoute
	editform.value.qty = selected[0].qty
	editform.value.target = selected[0].target
	editform.value.holdmethod = selected[0].autoHold == 'Y' ? '自动HOLD' : (selected[0].allPass == 'Y' ? '全流程PASS' : '')
	editform.value.reqc = selected[0].reQc == 'Y' ? '是' : '否'
	editform.value.qctype = selected[0].qcType
	editform.value.remark = selected[0].remarks
	// var ruletype
	// async () => { await ruletype=queryRuleType(selected[0].checkRule) }


}


/**组装qcconfig实体对象,以方便提交到后台数据库 */
function qcconfigmodel(obj) {
	var qcconfig = {}
	qcconfig.id = obj.id
	qcconfig.checkRule = obj.txtcheckrule
	qcconfig.onlineFlag = obj.checkifonline = '离线' ? 'N' : 'Y'
	qcconfig.returnStationType = obj.returnstation
	qcconfig.qcRoute = obj.qcRoute
	qcconfig.onlineStationType = obj.onlinestation
	qcconfig.qcRoute = obj.qcroute
	qcconfig.target = obj.target
	qcconfig.qty = obj.qty
	qcconfig.qcType = obj.qctype
	qcconfig.autoHold = obj.holdmethod = '自动HOLD' ? 'Y' : 'N'
	qcconfig.allPass = obj.holdmethod = '全流程PASS' ? 'Y' : 'N'
	if (obj.mode == 'ADD' || obj.mode == 'COPY') {
		qcconfig.createEmpno = useUserStore().userInfo.userName
	}
	if (obj.mode == 'MODIFY') {
		qcconfig.updateEmpno = useUserStore().userInfo.userName
	}
	qcconfig.remarks = obj.remark
	// 计算qc_level
	qcconfig.qcLevel = obj.qclevel
	return qcconfig
}




/** 重置过滤对话框 */
function resetfilterform() {
	filterform.value = {
		filterfield: ''
		, filtervalue: ''
		, filterfieldOptions: []
		, filterlist: []
	}

}


/** 查询Materialdppm列表 */
function getList() {
	loading.value = true
	console.log('Call getList:')
	console.log(queryParams)
	listMMaterialdppm(queryParams).then((res) => {
		console.log('CallBack:')
		console.log(res)
		loading.value = false
		dppmList.value = res.data.result
		total.value = res.data.totalNum
	})
}

function query() {
	proxy.$refs['queryRef'].validate((valid) => {
		if (valid) {
			console.log('Call onSubmit:')
			console.log(queryParams)
			getList()
			reset()
		}

	})

}

/** 导出按钮操作 */
function handleExport() {
	proxy.$modal
		.confirm('是否确认导出所有用户数据项?', '警告', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		})
		.then(async () => {
			await exportMQcConfig(queryParams.value)
		})
}


/** 新增按钮操作 */
function handleAdd() {
	reseteditform()
	editform.value.mode = 'ADD'
	title.value = '新增'
	//查询机种
	QueryModels(queryParams.value).then((res) => {
		console.log('QueryModels')
		console.log(res.data)
		editform.value.modelOptions = res.data.map(m => { return { dictValue: m.model, dictLabel: m.model } })
		open1.value = true
	})

}

/** 修改按钮操作 */
function handleModify() {
	// 修改操作需要选中一行
	var selected = proxy.$refs['qcconfigRef'].getSelectionRows()
	if (selected.length != 1) {
		proxy.$modal.msgWarning('请选择一行且只能选择一行')
		return
	}
	reseteditform(selected)
	editform.value.mode = 'MODIFY'
	title.value = '修改'
	//计算checkruletype
	queryRuleType({ ruletype: editform.value.txtcheckrule }).then(res => {
		if (res.data.val != 'INVALID') {
			editform.value.checkrule = res.data.val == 'LINE' ? '线别' : (res.data.val == 'WO' ? '工单' : '料号')
		}
		open1.value = true

	})

}

/** 复制按钮操作 */
function handleCopy() {
	//复制操作是一种特殊的新增操作,是现有的配置资料作为模版供用户修改,然后提交后台
	// 复制操作需要选中一行
	var selected = proxy.$refs['qcconfigRef'].getSelectionRows()
	if (selected.length != 1) {
		proxy.$modal.msgWarning('请选择一行且只能选择一行')
		return
	}
	reseteditform(selected)
	editform.value.mode = 'COPY'
	title.value = '复制'
	//计算checkruletype
	queryRuleType({ ruletype: editform.value.txtcheckrule }).then(res => {
		if (res.data.val != 'INVALID') {
			editform.value.checkrule = res.data.val == 'LINE' ? '线别' : (res.data.val == 'WO' ? '工单' : '料号')
		}
		open1.value = true

	})
}


function handleDelete() {
	var selected = proxy.$refs['qcconfigRef'].getSelectionRows()
	if (selected.length != 1) {
		proxy.$modal.msgWarning('请选择一行且只能选择一行')
		return
	}
	proxy.$modal.confirm('是否确认删除该数据项?', '警告', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(async () => {
			await delMQcConfig(selected[0].id)
			proxy.$modal.msgSuccess('数据删除成功!')
			reset()
			getList()
		})

}



/** 对话框取消按钮操作 */
function cancel(btn) {
	console.log('cancel')
	console.log(btn)
	if (btn == 'open1') {
		open1.value = false
		return;
	}
	if (btn == 'open2') {
		open2.value = false

	}
}

/** 对话框提交按钮操作 */
function submitForm(btn) {
	if (btn == 'open1') {
		proxy.$refs['editformRef'].validate((valid) => {
			if (valid) {
				console.log('Call submitForm:')
				console.log(editform.value)
				if (!editform.value.id) {
					proxy.$modal.msgWarning('没有上传过文件!')
					return
				}
				if (editform.value.mode == 'ADD' || editform.value.mode == 'COPY') {

					updateMMaterialdppm(editform.value).then(res => {
						proxy.$modal.msgSuccess('数据添加成功!')
						reset()
						getList()

					})

				}
				if (editform.value.mode == 'MODIFY') {
					var qccfg = qcconfigmodel(editform.value)
					updateMMaterialdppm(qccfg).then(res => {
						proxy.$modal.msgSuccess('数据修改成功!')
						reset()
						getList()

					})
				}



			}
		})

		open1.value = false

	}



	if (btn == 'open2') {
		var selected = proxy.$refs['filtertabRef'].getSelectionRows()[0]
		console.log('submitForm')
		console.log('selected')
		console.log(selected)
		if (filterform.value.filterfield == 'WO' || filterform.value.filterfield == 'LINE' || filterform.value.filterfield == 'IPN') {
			editform.value.txtcheckrule = selected[filterform.value.filterfield]
		}
		if (editform.value.btnflag == 'onlineroute') {
			editform.value.onlineroute = selected[filterform.value.filterfield]
			//绑定抽入站点及回流站点下拉列表
			queryStations({ route: editform.value.onlineroute }).then((res) => {
				console.log('queryStations')
				console.log(res.data)
				var onlinedata = []
				var offlinedata = []
				//去除重复
				onlinedata = res.data.filter((item, index, self) => {
					return index === self.findIndex(obj => obj['statioN_TYPE'] === item['statioN_TYPE']);
				});
				offlinedata = res.data.filter((item, index, self) => {
					return index === self.findIndex(obj => obj['nexT_STATION_TYPE'] === item['nexT_STATION_TYPE']);
				});
				if (editform.value.checkifonline == '在线') {

					editform.value.onlinestationOptions = onlinedata.map((r, index, arr) => {

						return { id: index, name: r['statioN_TYPE'], value: r['statioN_TYPE'], status: 0 }

					})
					editform.value.returnstationOptions = []
				}

				if (editform.value.checkifonline == '离线') {
					editform.value.onlinestationOptions = offlinedata.map((r, index, arr) => {
						return { id: index, name: r['nexT_STATION_TYPE'], value: r['nexT_STATION_TYPE'], status: 0 }
					})
					editform.value.returnstationOptions = offlinedata.map((r, index, arr) => {
						return { id: index, name: r['nexT_STATION_TYPE'], value: r['nexT_STATION_TYPE'], status: 0 }
					})
				}

			})


		}
		if (editform.value.btnflag == 'qcroute') {
			editform.value.qcroute = selected[filterform.value.filterfield]
		}
		open2.value = false
		return;
	}

}

function Querycheckrule() {
	editform.value.btnflag = 'checkrule'
	console.log('Call Querycheckrule:')
	console.log('editform.value.txtcheckrule:')
	console.log(editform.value)
	queryRules({ checkrule: editform.value.checkrule, txtcheckrule: editform.value.txtcheckrule }).then((res) => {
		console.log('queryRules')
		console.log(res.data)
		// :key="item.id" :label="item.name" :value="item.value" :disabled="item.status ==1"	   
		if (editform.value.checkrule == '工单') {
			filterform.value.filterfield = 'WO'
			filterform.value.filterfieldOptions = [{ id: 1, name: 'WO', value: 'WO', status: 0 }]
			filterform.value.filterlist = res.data.map(r => { return { WO: r[0].value } })
		}
		if (editform.value.checkrule == '线别') {
			filterform.value.filterfield = 'LINE'
			filterform.value.filterfieldOptions = [{ id: 1, name: 'LINE', value: 'LINE', status: 0 }]
			filterform.value.filterlist = res.data.map(r => { return { LINE: r[0].value } })
		}
		if (editform.value.checkrule == '料号') {
			filterform.value.filterfield = 'IPN'
			filterform.value.filterfieldOptions = [{ id: 1, name: 'IPN', value: 'IPN', status: 0 }]
			filterform.value.filterlist = res.data.map(r => { return { IPN: r[0].value } })
		}
	})

	resetfilterform()
	open2.value = true
}

function Queryonlineroute() {
	editform.value.btnflag = 'onlineroute'
	console.log('Call Queryonlineroute:')
	var querydata = { route: 'online', txtroute: editform.value.onlineroute }
	console.log('querydata:')
	console.log(querydata)
	queryRoute(querydata).then((res) => {
		console.log('res.data')
		console.log(res.data)
		filterform.value.filterfield = 'ROUTE'
		filterform.value.filterfieldOptions = [{ id: 1, name: 'ROUTE', value: 'ROUTE', status: 0 }]
		filterform.value.filterlist = res.data.map(r => { return { ROUTE: r[0].value } })
	})



	resetfilterform()
	open2.value = true
}

function QueryQCroute() {
	editform.value.btnflag = 'qcroute'
	console.log('Call QueryQCroute:')
	queryRoute({ route: 'qc', txtroute: editform.value.qcroute }).then((res) => {
		filterform.value.filterfield = 'ROUTE'
		filterform.value.filterfieldOptions = [{ id: 1, name: 'ROUTE', value: 'ROUTE', status: 0 }]
		filterform.value.filterlist = res.data.map(r => { return { ROUTE: r[0].value } })
	})
	resetfilterform()
	open2.value = true
}


function handleSelectionChange(tabRef) {
	var selected = proxy.$refs[tabRef].getSelectionRows()
	if (selected.length > 1) {
		proxy.$modal.msgWarning('请选择一行且只能选择一行')
		// 先清空选择的行,然后选择最后一次选中的那一行，保持只有一行
		proxy.$refs[tabRef].clearSelection()
		proxy.$refs[tabRef].toggleRowSelection(selected[selected.length - 1])
		return;
	}

}

function filterchange() {
	console.log('filterchange:')
	console.log(filterform.value.filtervalue)

	if (!filterform.value.filtervalue) {
		proxy.$modal.msgWarning('过滤值不可为空!')
		return
	}
	var res = filterform.value.filterlist.filter(f => { return f[filterform.value.filterfield] == filterform.value.filtervalue.trim() })
	if (!res.length) {
		proxy.$modal.msgWarning('当前界面不存在这个值!')
		return
	}
	console.log('res')
	console.log(res)
	filterform.value.filterlist = res
	var selected = proxy.$refs['filtertabRef'].getSelectionRows()
	if (!selected.length) {
		proxy.$refs['filtertabRef'].toggleAllSelection()
	}

}

function qctypechange() {
	editform.value.qctype == 'SN' ? '否' : '是'
}

function changefile(file, fileList, index) {
	console.log('selectfile')
	filesData.value = fileList
}

function submitUpload() {
	console.log('submitUpload')
	console.log(filesData.value)
	var formData = new FormData()
	formData.append('Id', editform.value.id)
	formData.append('File', filesData.value[0].raw)
	uploadFiles(formData).then(res => {
		console.log(res)
		editform.value.id = res.data.id
		proxy.$modal.msgSuccess('上传成功!')
	})
		.catch((err) => {
			proxy.$modal.msgError(err)
		})
}

// 上传成功回调
function handleUploadSuccess(response, uploadFile) {
	if (response.code != 200) {
		console.log('上传失败')
		proxy.$modal.msgError('上传失败，原因:${response.msg}!')
		return
	}
	console.log('上传成功')
	proxy.$modal.msgSuccess('上传成功!')
}

// 上传失败
function handleUploadError(err) {
	proxy.$modal.msgError('上传失败' + err)
}



</script>