<template>
	<div class="app-container">
		<el-row :gutter="20">
			<el-col :span="3">
				<el-button type="warning" :icon="DocumentAdd" @click="handleAdd">添加</el-button>
			</el-col>
			<el-col :span="3">
				<el-button type="warning" :icon="Remove" @click="handleExclude">剔除</el-button>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col>
				<el-form :model="queryParams" :rules="rules" ref="queryRef"
					style="border: 1px solid #ccc;padding:10px;margin;:0px" :inline="true" v-show="true">
					<el-form-item label="类型" prop="blackType">
						<el-select v-model="queryParams.blackType" placeholder="" style="width: 150px">
							<el-option v-for="dict in queryParams.blackTypeOptions" :key="dict.dictValue"
								:label="dict.dictLabel" :value="dict.dictValue" />
						</el-select>
					</el-form-item>

					<el-form-item label="不良编码" prop="defectCode">
						<el-input v-model="queryParams.defectCode" placeholder="请填写不良编码" clearable />
					</el-form-item>

					<el-form-item label="供应商编码" prop="vendorCode">
						<el-input v-model="queryParams.vendorCode" placeholder="请填写供应商编码" clearable />
					</el-form-item>

					<el-form-item label="黑名单信息" prop="message">
						<el-input v-model="queryParams.message" placeholder="请填写条码" clearable />
					</el-form-item>


					<el-form-item label="条码" prop="kpsn">
						<el-input v-model="queryParams.kpsn" placeholder="请填写条码" clearable />
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="query">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>

		<el-row :gutter="20">
			<el-col>
				<el-table ref="blacklistRef" border :data="blackList">
					<el-table-column type="selection" width="55" />
					<el-table-column prop="id" label="ID" width="80" />
					<el-table-column prop="kpsn" label="条码" width="80" />
					<el-table-column prop="vendorCode" label="供应商编码" width="120" />
					<el-table-column prop="defectCode" label="不良编码" width="100" />
					<el-table-column prop="stationId" label="机台号" width="120" />
					<el-table-column prop="line" label="线别" width="120" />
					<el-table-column prop="testStationName" label="测试机台" width="120" />
					<el-table-column prop="stationType" label="站点" width="80" />
					<el-table-column prop="blackType" label="类型" width="180" />
					<el-table-column prop="enabled" label="使能" width="100" />
					<el-table-column prop="message" label="信息" width="300" />
					<el-table-column prop="createUser" label="创建人" width="100" />
					<el-table-column prop="createTime" label="创建时间" width="180" />
					<el-table-column prop="updateUser" label="修改人" width="100" />
					<el-table-column prop="updateTime" label="修改时间" width="180" />
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
<script setup name="blacklist">
import { DocumentAdd, Remove } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import { listPSnBlackList, addPSnBlackList, delPSnBlackList } from '@/api/quality/blacklist'
const { proxy } = getCurrentInstance()
const queryRef = ref(null)
const total = ref(0)
const loading = ref(true)
const open = ref(false)
const title = ref('编辑')
const queryParams = reactive({
	pageNum: 1,
	pageSize: 10,
	blackType: '',
	blackTypeOptions: [{ dictValue: 'BLACKLIST', dictLabel: '加进黑名单' }
		, { dictValue: 'UNBLACKLIST', dictLabel: '剔除黑名单' }],
	defectCode: '',
	vendorCode: '',
	message: '',
	kpsn: ''
})

const init = ref(reset(), getList())



/** 重置查询表单 */
function reset() {
	queryParams.value = {
		pageNum: 1,
		pageSize: 10,
		blackType: '',
		blackTypeOptions: [{ dictValue: 'BLACKLIST', dictLabel: '加进黑名单' }
			, { dictValue: 'UNBLACKLIST', dictLabel: '剔除黑名单' }],
		defectCode: '',
		vendorCode: '',
		message: '',
		kpsn: ''
	}
	proxy.resetForm('queryRef')
}

const rules = {

	blackType: [
		{ required: true, message: '操作类型不能为空', trigger: 'blur' }
	]
	, defectCode: [
		{ required: true, message: '不良编码不能为空', trigger: 'blur' }
	]
	, vendorCode: [
		{ required: true, message: '供应商编码不能为空', trigger: 'blur' }
	]
	, message: [
		{ required: true, message: '信息不能为空', trigger: 'blur' }
	]
	, kpsn: [
		{ required: true, message: '条码不能为空', trigger: 'blur' }
	]
}

const blackList = ref([
	// {
	// 	id: 1
	// 	, kpsn: '34234'
	// 	, vendorCode: ''
	// 	, defectCode: '32324432432'
	// 	, stationId: ''
	// 	, line: ''
	// 	, testStationName: ''
	// 	, stationType: ''
	// 	, blackType: 'UNBLACKLIST'
	// 	, enabled: 'N'
	// 	, message: ''
	// 	, createUser: '12837144'
	// 	, createTime: '2021/12/1 9:39:05'
	// 	, updateUser: ''
	// 	, updateTime: ''

	// }
])

/**组装blacklist实体对象,以方便提交到后台数据库 */
function blacklistmodel(obj, mode) {
	var res = { ...obj }
	if (mode == 'ADD') {
		res.createUser = useUserStore().userInfo.userName
	}
	if (mode == 'MODIFY') {
		res.updateEmpno = useUserStore().userInfo.userName
	}
	return res
}

/** 查询blacklist列表 */
function getList() {
	loading.value = true
	console.log('Call getList:')
	console.log(queryParams)
	listPSnBlackList(queryParams).then((res) => {
		console.log('CallBack:')
		console.log(res)
		loading.value = false
		blackList.value = res.data.result
		total.value = res.data.totalNum
	})
}

function query() {

	console.log('Call query:')
	console.log(queryParams)
	getList()
	reset()
}
function handleAdd() {
	console.log('Call handleAdd:')

	proxy.$refs['queryRef'].validate((valid) => {
		if (!valid) {
			return
		}
		var obj = blacklistmodel(queryParams, 'ADD')
		console.log('obj')
		console.log(obj)
		addPSnBlackList(obj).then(res => {
			proxy.$modal.msgSuccess('数据添加成功!')
			getList()
			reset()
		})
	})

}


function handleExclude() {
	// 修改操作需要选中一行
	var selected = proxy.$refs['blacklistRef'].getSelectionRows()
	if (selected.length != 1) {
		proxy.$modal.msgWarning('请选择一行且只能选择一行')
		return
	}
	delPSnBlackList(selected[0].id).then(res => {
		proxy.$modal.msgSuccess('数据删除成功!')
		getList()
	})
}

</script>