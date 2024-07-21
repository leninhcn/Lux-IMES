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
							<el-option v-for="dict in queryParams.rulesOptions" :key="dict.dictValue"
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

		<!-- 添加或修改QCConfig对话框 -->
		<el-dialog :title="title" v-model="open1" width="680px" append-to-body>
			<el-form :model="editform" :rules="rules" ref="editformRef" label-width="80px">
				<el-row :gutter="20">
					<el-col :lg="12">
						<el-form-item label="是否在线:">
							<el-radio-group v-model="editform.checkifonline">
								<el-radio label="在线" />
								<el-radio label="离线" />
							</el-radio-group>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="抽验规则:">
							<el-radio-group v-model="editform.checkrule">
								<el-radio label="工单" />
								<el-radio label="线别" />
								<el-radio label="料号" />
							</el-radio-group>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="待选细项:">
							<el-input v-model="editform.txtcheckrule" placeholder="" clearable />
						</el-form-item>

					</el-col>

					<el-col :lg="12">
						<el-form-item label="请点选:">
							<el-button @click="Querycheckrule">&#46;&#46;&#46;</el-button>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="在线途程:">
							<el-input v-model="editform.onlineroute" placeholder="" clearable />
						</el-form-item>

					</el-col>

					<el-col :lg="12">
						<el-form-item label="请点选:">
							<el-button @click="Queryonlineroute">&#46;&#46;&#46;</el-button>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="抽入站点:">
							<el-select v-model="editform.onlinestation" placeholder="请选择抽入站点" clearable>
								<el-option v-for="item in editform.onlinestationOptions" :key="item.id" :label="item.name"
									:value="item.value" :disabled="item.status == 1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="回流站点:">
							<el-select v-model="editform.returnstation" placeholder="请选择回流站点" clearable>
								<el-option v-for="item in editform.returnstationOptions" :key="item.id" :label="item.name"
									:value="item.value" :disabled="item.status == 1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="QC途程:">
							<el-input v-model="editform.qcroute" placeholder="" clearable />
						</el-form-item>

					</el-col>

					<el-col :lg="12">
						<el-form-item label="请点选:">
							<el-button @click="QueryQCroute">&#46;&#46;&#46;</el-button>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="抽验比例:">
							<el-input v-model="editform.qty" placeholder="" clearable />
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="抽验总数:">
							<el-input v-model="editform.target" placeholder="" clearable />
						</el-form-item>
					</el-col>
					<el-col :lg="12">
						<el-form-item label="抽验依据:">
							<el-select v-model="editform.qctype" placeholder="请选择抽验依据" @change="qctypechange" clearable>
								<el-option v-for="item in editform.qctypeOptions" :key="item.id" :label="item.name"
									:value="item.value" :disabled="item.status == 1">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="HOLD:">
							<el-radio-group v-model="editform.holdmethod">
								<el-radio label="自动HOLD" />

								<el-radio label="全流程PASS" />
							</el-radio-group>
						</el-form-item>
					</el-col>



					<el-col :lg="12">
						<el-form-item label="是否重抽:">
							<el-radio-group v-model="editform.reqc" :disabled="editform.qctype == 'SN' ? false : true">
								<el-radio label="是" />
								<el-radio label="否" />
							</el-radio-group>
						</el-form-item>
					</el-col>

					<el-col :lg="12">
						<el-form-item label="温馨提醒:">
							<el-text type="warning">By&nbsp;SN不允许重抽</el-text>
						</el-form-item>
					</el-col>
					<el-col :lg="24">
						<el-form-item label="备注:">
							<el-input v-model="editform.remark" placeholder="请写下备注" clearable />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<el-button text @click="cancel('open1')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open1')">{{ $t('btn.submit') }}</el-button>
			</template>
		</el-dialog>
		<!-- 添加过滤对话框 -->
		<el-dialog title="过滤" v-model="open2" width="680px" append-to-body>
			<el-form :model="filterform" :rules="rules" ref="filterRef" label-width="80px">
				<el-row :gutter="10">
					<el-col :lg="8">
						<el-form-item label="">
							<el-text>Search</el-text>
						</el-form-item>

					</el-col>

					<el-col :lg="8">
						<el-form-item label="">
							<el-select v-model="filterform.filterfield" placeholder="请选择过滤字段">
								<el-option v-for="item in filterform.filterfieldOptions" :key="item.id" :label="item.name"
									:value="item.value" :disabled="item.status == 1">
								</el-option>
							</el-select>
						</el-form-item>

					</el-col>

					<el-col :lg="8">
						<el-form-item label="">
							<el-input v-model="filterform.filtervalue" placeholder="请填入过滤值" @change="filterchange"
								clearable />
						</el-form-item>
					</el-col>

					<el-col :lg="24">
						<el-form-item label="">
							<el-table ref="filtertabRef" :data="filterform.filterlist" border style="width: 100%"
								@selection-change="handleSelectionChange('filtertabRef')">
								<el-table-column type="selection" width="50" />
								<el-table-column type="index" width="50" />
								<el-table-column :prop="filterform.filterfield" :label="filterform.filterfield"
									width="200" />
							</el-table>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<el-button text @click="cancel('open2')">{{ $t('btn.cancel') }}</el-button>
				<el-button type="primary" @click="submitForm('open2')">{{ $t('btn.submit') }}</el-button>
			</template>
		</el-dialog>
		<el-row :gutter="20">
			<el-col>
				<el-table ref="qcconfigRef" border :data="configList"
					@selection-change="handleSelectionChange('qcconfigRef')">
					<el-table-column type="selection" width="55" />
					<el-table-column prop="id" label="ID" width="80" />
					<el-table-column prop="model" label="机种" width="80" />
					<el-table-column prop="checkRule" label="抽检规则" width="120" />
					<el-table-column prop="onlineFlag" label="是否在线" width="100" />
					<el-table-column prop="onlineStationType" label="抽入站点" width="120" />
					<el-table-column prop="returnStationType" label="返回站点" width="120" />
					<el-table-column prop="qcRoute" label="抽入流程" width="120" />
					<el-table-column prop="target" label="总数" width="80" />
					<el-table-column prop="qty" label="抽验比例" width="100" />
					<el-table-column prop="reQc" label="是否重抽" width="100" />
					<el-table-column prop="qcLevel" label="优先级" width="80" />
					<el-table-column prop="qcType" label="抽验依据" width="100" />
					<el-table-column prop="autoHold" label="是否自动卡控" width="120" />
					<el-table-column prop="allPass" label="是否全通" width="100" />
					<el-table-column prop="enabled" label="使能" width="80" />
					<el-table-column prop="updateEmpno" label="修改人" width="80" />
					<el-table-column prop="updateTime" label="修改时间" width="150" />
					<el-table-column prop="createEmpno" label="创建人" width="80" />
					<el-table-column prop="createTime" label="创建时间" width="150" />
					<el-table-column prop="remarks" label="备注" width="300" />
				</el-table>
				<pagination :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
					@pagination="getList" />
			</el-col>
		</el-row>

	</div>
</template>
<style scoped>
.el-row {
	margin-top: 20px;
}
</style>
<script setup name="qcconfig">
import { DocumentAdd, Edit, Delete, CopyDocument, Close, Upload, Download } from '@element-plus/icons-vue'
import {
	listMQcConfig
	, exportMQcConfig, queryRules, queryRoute
	, queryStations, queryQCLevel, queryRuleType
	, addMQcConfig, delMQcConfig, updateMQcConfig
} from '@/api/quality/qcconfig'
import useUserStore from '@/store/modules/user'
const { proxy } = getCurrentInstance()
const queryRef = ref(null)
const total = ref(0)
const loading = ref(true)
const open1 = ref(false)
const open2 = ref(false)
const open3 = ref(false)
const title = ref('编辑')
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
	rulesOptions: [{ dictValue: 'model', dictLabel: '机种' }
		, { dictValue: 'checkrule', dictLabel: '抽检规则' }
		, { dictValue: 'onlinestationtype', dictLabel: '抽入站点' }
		, { dictValue: 'returnstationtype', dictLabel: '返回站点' }
		, { dictValue: 'qcroute', dictLabel: '抽入流程' }
		, { dictValue: 'qctype', dictLabel: '抽验依据' }
		, { dictValue: 'onlineflag', dictLabel: '是否在线' }
		, { dictValue: 'reqc', dictLabel: '是否重抽' }
		, { dictValue: 'autohold', dictLabel: '是否自动卡控' }
		, { dictValue: 'allpass', dictLabel: '是否全通' }
		, { dictValue: 'enabled', dictLabel: '使能' }
	]
})
const editform = ref({
	mode: ''
	, id: 0
	// ONLINE_FLAG
	, checkifonline: '在线'
	, checkrule: '工单'
	//CHECK_RULE
	, txtcheckrule: ''
	, onlineroute: ''
	, onlinestation: ''
	, onlinestationOptions: []
	, returnstation: ''
	, returnstationOptions: []
	, qcroute: ''
	, qty: 0
	, target: 0
	//QC_TYPE
	, qctype: ''
	, qctypeOptions: [{ id: 1, name: 'SN', value: 'SN', status: 0 }
		, { id: 2, name: 'TRAY', value: 'TRAY', status: 0 }
		, { id: 3, name: 'CARTON', value: 'CARTON', status: 0 }
		, { id: 4, name: 'PANEL', value: 'PANEL', status: 0 }]
	, holdmethod: ''
	, reqc: '否'
	// 设置这个属性,用来识别是哪个按钮被点击了
	, btnflag: ''
	, qclevel: 0
	, remark: ''
})

const filterform = ref({
	filterfield: ''
	, filtervalue: ''
	, filterfieldOptions: []
	, filterlist: []
})
const configList = ref([])

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
		rulesOptions: [{ dictValue: 'model', dictLabel: '机种' }
			, { dictValue: 'checkrule', dictLabel: '抽检规则' }
			, { dictValue: 'onlinestationtype', dictLabel: '抽入站点' }
			, { dictValue: 'returnstationtype', dictLabel: '返回站点' }
			, { dictValue: 'qcroute', dictLabel: '抽入流程' }
			, { dictValue: 'qctype', dictLabel: '抽验依据' }
			, { dictValue: 'onlineflag', dictLabel: '是否在线' }
			, { dictValue: 'reqc', dictLabel: '是否重抽' }
			, { dictValue: 'autohold', dictLabel: '是否自动卡控' }
			, { dictValue: 'allpass', dictLabel: '是否全通' }
			// , { dictValue: 'enabled', dictLabel: '使能' }			   
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
			, checkifonline: '在线'
			, checkrule: '工单'
			, txtcheckrule: ''
			, onlineroute: ''
			, onlinestation: ''
			, onlinestationOptions: []
			, returnstation: ''
			, returnstationOptions: []
			, qcroute: ''
			, qty: 0
			, target: 0
			, qctype: ''
			, qctypeOptions: [{ id: 1, name: 'SN', value: 'SN', status: 0 }
				, { id: 2, name: 'TRAY', value: 'TRAY', status: 0 }
				, { id: 3, name: 'CARTON', value: 'CARTON', status: 0 }
				, { id: 4, name: 'PANEL', value: 'PANEL', status: 0 }]
			, holdmethod: ''
			, reqc: '否'
			, btnflag: ''
			, qclevel: 0
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


/** 查询QcConfig列表 */
function getList() {
	loading.value = true
	console.log('Call getList:')
	console.log(queryParams)
	listMQcConfig(queryParams).then((res) => {
		console.log('CallBack:')
		console.log(res)
		loading.value = false
		configList.value = res.data.result
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
	open1.value = true
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

				if (editform.value.mode == 'ADD' || editform.value.mode == 'COPY') {
					//计算qclevel
					queryQCLevel({ station: editform.value.onlinestation, checkrule: editform.value.txtcheckrule }).then(res => {
						console.log('queryQCLevel:')
						editform.value.qclevel = res.data.val
						console.log(editform.value.qclevel)

						var qccfg = qcconfigmodel(editform.value)
						addMQcConfig(qccfg).then(res => {
							proxy.$modal.msgSuccess('数据添加成功!')
							reset()
							getList()

						})
					})
				}
				if (editform.value.mode == 'MODIFY') {
					var qccfg = qcconfigmodel(editform.value)
					updateMQcConfig(qccfg).then(res => {
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



</script>