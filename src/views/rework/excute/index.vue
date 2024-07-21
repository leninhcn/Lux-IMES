<template>
	<div class="app-container">
		<el-form :model="executform" :rules="rules" ref="executeRef" label-width="80px">
			<el-row>
				<el-col :span="9">
					<div style="height: 600px; border: 1px solid #ccc; padding: 10px; margin: 0px">
						<el-row>
							<el-col :lg="24">
								<el-form-item label="是否新工单:" prop="isnewwo" label-width="90px">
									<el-checkbox v-model="executform.isnewwo" @change="checkchange" label="" size="large" />
								</el-form-item>
							</el-col>
							<el-col :lg="24">
								<el-form-item label="填写新工单:" prop="newwo" label-width="90px">
									<el-input v-model="executform.newwo" :disabled="!executform.isnewwo"
										@change="newwochange" placeholder="" clearable />
								</el-form-item>
							</el-col>
							<el-col :lg="24">
								<el-form-item :label="executform.inputtype" prop="barcode" label-width="90px">
									<el-input v-model="executform.barcode" @change="barcodechange" placeholder=""
										clearable />
								</el-form-item>
							</el-col>
							<el-col :lg="24">
								<el-form-item label="重工单号:" prop="reworkno" label-width="90px">
									<el-input v-model="executform.reworkno" placeholder="" clearable />
								</el-form-item>
							</el-col>
							<el-col :lg="24">
								<el-form-item label="流程名称:" prop="routename" label-width="90px">
									<el-input v-model="executform.routename" @change="routenamechange" placeholder=""
										clearable />
								</el-form-item>
							</el-col>
							<el-col :lg="24">
								<el-form-item label="回流站点:" prop="returnstation" label-width="90px">
									<el-select v-model="executform.returnstation" @change="returnstationchange"
										placeholder="" clearable>
										<el-option v-for="item in executform.returnstationOptions" :key="item.id"
											:label="item.name" :value="item.value" :disabled="item.status == 1">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :lg="24">
								<el-form-item label="检查站点:" prop="checkstation" label-width="90px">
									<el-input v-model="executform.checkstation" placeholder="" clearable />
								</el-form-item>
							</el-col>

							<el-col :lg="24">
								<el-form-item label="备注:" prop="remark" label-width="90px">
									<el-input v-model="executform.remark" placeholder="" clearable />
								</el-form-item>
							</el-col>
							<el-col :lg="24">
								<el-form-item label="" label-width="90px">
									<el-button type="primary" @click="submitForm">{{ $t('btn.excute') }}</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-col>

				<el-col :span="15">
					<div style=" height: 600px; border: 1px solid #ccc; padding: 10px; margin: 0px">
						<el-row>
							<el-col :lg="5">
								<el-form-item label="" label-width="2px">
									<el-button text @click="Search">
										{{ $t('btn.search') }}
										<svg-icon :name="iconsearch" />
									</el-button>
								</el-form-item>
							</el-col>

							<el-col :lg="5">
								<el-form-item label="" label-width="2px">
									<el-button type="primary" text @click="Import">
										{{ $t('btn.import') }}
										<svg-icon :name="iconimport" />
									</el-button>
								</el-form-item>
							</el-col>

							<el-col :lg="14">
								<el-form-item label="" label-width="2px">
									<el-text>功能介绍</el-text>
								</el-form-item>
							</el-col>

							<el-col :lg="24">
								<el-form-item label="" prop="inputtype" label-width="2px">
									<el-radio-group v-model="executform.inputtype">
										<el-radio v-for="op in executform.inputtypeOptions" :key="op.label"
											:label="op.label">
											{{ op.display }}
										</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-col>
							<el-col :lg="24">
								<el-transfer v-model="executform.tvalue"  @change="tChange" filterable
									:filter-method="filterMethod" filter-placeholder="" :titles="['待选规格', '已选规格']"
									:data="executform.tdata" />
							</el-col>

							<el-col :lg="24">
								<el-form-item label="" prop="incidentals" label-width="2px">
									<el-checkbox-group v-model="executform.incidentals">
										<el-checkbox v-for="op in executform.incidentalOptions" :key="op.label"
											:label="op.label">
											{{ op.display }}
										</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
							</el-col>

							<el-col :lg="12">
								<el-form-item label="机种:" label-width="60px">
									<el-text>{{ executform.model }}</el-text>
								</el-form-item>
							</el-col>

							<el-col :lg="12">
								<el-form-item label="料号:" label-width="60px">
									<el-text>{{ executform.ipn }}</el-text>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24">
					<el-table :data="executform.reworkList" :cell-style="handleChangeCellStyle" border height="150px"
						style="width: 100%" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55" />
						<el-table-column type="index" label="SEQ" width="80" />
						<el-table-column prop="res" label="检查结果" width="300" />
						<el-table-column prop="sn" label="单板号" width="180" />
						<el-table-column prop="panel" label="连板号" width="180" />
						<el-table-column prop="wo" label="工单号" width="180" />
						<el-table-column prop="ipn" label="厂内料号" width="180" />
						<el-table-column prop="model" label="机种" width="100" />
						<el-table-column prop="csn" label="客户码" width="100" />
						<el-table-column prop="pallet" label="栈板号" width="100" />
						<el-table-column prop="carton" label="箱号" width="100" />
						<el-table-column prop="box" label="彩盒号" width="100" />
						<el-table-column prop="stationtype" label="站点类型" width="120" />
						<el-table-column prop="nextstationtype" label="下一站点类型" width="120" />
						<el-table-column prop="outstationtypetime" label="出站时间" width="100" />
						<el-table-column prop="routename" label="途程名" width="100" />
					</el-table>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24">
					<!-- <div style="height: 100px; background-color: green; text-align: center; border: 1px solid #ccc; padding: 10px; margin-top: 10px;">  -->
					<div :style="msgstyle[0]">
						<el-text :style="msgstyle[1]">Message</el-text>
					</div>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script setup>
import icons from '@/components/IconSelect/requireIcons'
import { querySpec, queryReworkno, queryStationOptions, queryRouteName, preCheck, excuteRework } from '@/api/rework/reworkexcute'
import useUserStore from '@/store/modules/user'
const { proxy } = getCurrentInstance()
const msgstyle = ref([
	'height: 100px; background-color: green; text-align: center; border: 1px solid #ccc; padding: 10px; margin-top: 10px; ',
	'font-family:Arial, Helvetica, sans-serif;font-size:xx-large;font-weight: 800;color: white;'
])
const executform = ref({
	imported:false,
	isnewwo: false,
	inputtype: 'SN',
	newwo: '',
	inputtypeOptions: [
		{ label: 'WO', display: '工单' },
		{ label: 'Pallet', display: '栈板' },
		{ label: 'Carton', display: '箱号' },
		{ label: 'Box', display: '彩盒' },
		{ label: 'Panel', display: '连板号' },
		{ label: 'SN', display: '单板号' },
		{ label: 'Shipping', display: '出货单号' }
	],
	barcode: '',
	reworkno: '',
	routename: '',
	returnstation: '',
	returnstationOptions: [],
	checkstation: '',
	remark: '',
	incidentals: [],
	incidentalOptions: [
		{ label: 'unbindpo', display: '解绑PO' },
		{ label: 'unbindbox', display: '移除彩盒' },
		{ label: 'unbindfixture', display: '解绑治具' },
		{ label: 'unbindcarton', display: '移除箱号' },
		{ label: 'unbindpanel', display: '解绑连板号' },
		{ label: 'unbindpallet', display: '移除栈板' }
	],
	tdata:[],
	tvalue: [],
	model: 'N/A',
	ipn: 'N/A',
	reworkList: [],
	emp:''
})

const iconsearch = ref(icons.filter((item) => item.indexOf('search') !== -1)[0])
const iconimport = ref(icons.filter((item) => item.indexOf('import') !== -1)[0])

function checkchange() {
	if (executform.value.isnewwo) {
		console.log('check box is Checked')
	} else {
		console.log('check box is Unchecked')
		executform.value.newwo = ''
		executform.value.routename = ''
		executform.value.reworkno = ''
		executform.value.returnstationOptions = []
	}
}

function newwochange() {
	// console.log('Call newwochange:')
	// console.log(executform.value.newwo)
	// var regex = /[\r\n]/
	// console.log('是否含回车换行符:')
	// console.log(regex.test(executform.value.newwo))
	//产生重工单号
	queryReworkno({ input: executform.value.newwo }).then(res => {
		console.log('res.data')
		console.log(res.data)
		executform.value.reworkno = res.data

	})


	//检查途程是否存在

}

function barcodechange() {
	//是新工单的话,根据工单号带出途程
	//旧工单的话,根据提供的SN或者栈板号或者箱号...带出途程
	var paras = executform.value.isnewwo ? { input: executform.value.newwo } : { input: executform.value.barcode }
	queryRouteName(paras).then(async res => {
		console.log('queryRouteName callback:')
		console.log(res.data)
		if ((!res.data) || res.data.length == 0) {
			proxy.$modal.msgWarning('途程不存在!')
			return
		}
		executform.value.routename = res.data[0]['routE_NAME']
		//代码改变途程executform.value.routename不会触发routename的change事件,所以要代码要调用一次routenamechange
		await routenamechange()
		//产生重工单号
		var rwkno = await queryReworkno({ input: executform.value.barcode })
		console.log('rwkno:')
		console.log(rwkno)
		executform.value.reworkno = rwkno.data
		//获取spec,重新设置穿梭框
		getSpec({ input: executform.value.barcode })
	})


}


function returnstationchange(station) {
	//做重工前项检查
	preCheck({
		input: executform.value.barcode
		,inputtype:executform.value.inputtype
		, isnewwo: executform.value.isnewwo ? 1 : 0
		,newwo:executform.value.newwo
		, tstation: station//executform.value.returnstation
	}).then(res => {
		console.log('reworkcheckres:')
		console.log(res)
		//把SN这些信息(含检查的结果)添加到表格中
		executform.value.reworkList = res.data
		// proxy.resetForm('executeRef')
	})

}



function handleChangeCellStyle({ row, column, rowIndex, columnIndex }) {
	if (columnIndex == 2 && row.res == 'OK') {
		console.log('handleChangeCellStyle--->OK')
		return { 'color': 'white', 'background-color': 'green' }
	}
	if (columnIndex == 2 && row.res != 'OK') {
		console.log('handleChangeCellStyle--->NOK')
		return { 'color': 'white', 'background-color': 'red' }
	}

}


function routenamechange() {
	//检查途程是否存在

	queryStationOptions({ input: executform.value.routename }).then(res => {
		console.log('Call routenamechange:')
		console.log(res.data)
		//executform.value.returnstationOptions = res.data
		//不存在提示警告
		if ((!res.data) || res.data.length == 0) {
			proxy.$modal.msgWarning('没有查询到站点!')
			return
		}
		//存在,带出来回流站点备选项
		executform.value.returnstationOptions
			= res.data.map((it, index) => { return { id: index, name: it['nexT_STATION_TYPE'], value: it['nexT_STATION_TYPE'], status: 0 } })
	})



}

function getSpec(obj) {

	querySpec(obj).then((res) => {
		executform.value.tdata = res.data.map((item, index) => {
			// return { label: item['meS_SPEC'], key: index }
			return { label: item['meS_SPEC'], key: item['meS_SPEC'] }
		})
	})
}

// const data = ref([])

const init = ref(getSpec({ input: executform.value.barcode }))

const filterMethod = (query, item) => {
	return item.label.toLowerCase().includes(query.toLowerCase())
}

function tChange() {
	console.log('Call tChange')
	console.log(executform.value.tvalue)
	// console.log(executform.value.tvalue.map(d => { return executform.value.tdata[d].label }))
}

function submitForm() {
	console.log('Call submitForm')
	proxy.$refs['executeRef'].validate((valid) => {
		if (valid) {
			//获取操作者工号
			// useUserStore().userInfo.nickName表示姓名
			executform.value.emp=useUserStore().userInfo.userName
			excuteRework(executform.value).then(res => {
				console.log('submitFormres:')
				console.log(res)
				// 清空表单
				proxy.resetForm('executeRef')
			})
		}
		else {
			proxy.resetForm('executeRef')
			console.log('验证未通过')

		}
	})

}



</script>

<style scoped lang="scss">
:deep(.el-transfer__buttons) {
	padding: 0 10px;
}

:deep(.el-transfer) {
	display: flex;
	align-items: center;
	margin-bottom: 20px;

	.el-transfer-panel {
		flex: 1;
	}
}

.msg {
	font-family: Arial, Helvetica, sans-serif;
	font-size: xx-large;
	font-weight: 800;
	color: white;
}
</style>
