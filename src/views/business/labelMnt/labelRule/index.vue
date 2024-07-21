<template>
	<el-container h="full" b-rd="2" bg="red" truncate>
		<el-aside bg="lightblue" width="40%">
			<el-container h="full">
				<el-header p="1.5" h="auto" bg="bluegray-200" flex ref="leftHeader">
					<el-space>
						<el-select v-model="statusValue" w="30">
							<el-option v-for="item in statusFilters" :key="item.value" :label="item.label"
								:value="item.value" />
						</el-select>
						<ToolButton ref="tb1" type="primary" icon="DocumentAdd">添加</ToolButton>
						<ToolButton ref="tb2" type="primary" icon="EditPen">编辑</ToolButton>
						<ToolButton ref="tb3" type="primary" icon="TurnOff">禁用</ToolButton>
					</el-space>
				</el-header>
				<el-main p="1.5" class="flex" flex="col">
					<el-space ml="-1.5" mt="-1.5" mr="-1.5" p="1.5" bg="amber-200">
						<el-select v-model="ruleFieldValue" w="28">
							<el-option v-for="item in ruleFilters" :key="item.value" :label="item.label"
								:value="item.value" />
						</el-select>
						<el-input v-model.trim="ruleFilterText" clearable @keyup.enter="search" />
					</el-space>
					<div flex="1 col" bg="white" class="flex" truncate>
						<el-table border highlight-current-row @current-change="ruleDtSelChanged" :data="state.ruleDt"
							height="100%" table-layout="fixed">
							<el-table-column v-for="i in ruleDtCols" :key="i.prop" :prop="i.prop" :label="i.label"
								:width="i.width" :fixed="i.fixed" />
						</el-table>
					</div>
				</el-main>
			</el-container>
		</el-aside>
		<el-main bg="zinc" class="flex" flex="col" p="0" px="1.5">
			<el-space p="1.5" mx="-1.5" bg="bluegray-200" :style="{ minHeight: viewState.headerHeight + 'px' }">
				<el-text>规则名称</el-text>
				<el-input readonly :model-value="state.curRule?.ruleName"></el-input>
				<el-button type="primary" round><span mx="4">保存</span></el-button>
				<el-button>Reset</el-button>
			</el-space>
			<Stack size="default" bg="light" p="4" mx="-1.5" :style="{ flexWrap: false, flex: '0 0 60%' }" truncate>
				<el-row align="middle">
					<el-col :span="3"><el-text>Code</el-text></el-col>
					<el-col :span="8"><el-input v-model="curRuleParam.code"></el-input></el-col>
				</el-row>
				<el-row align="middle">
					<el-col :span="3"><el-text>Default</el-text></el-col>
					<el-col :span="8"><el-input :span="3" v-model="curRuleParam.default"></el-input></el-col>
				</el-row>
				<el-row align="top">
					<el-col :span="14">
						<Stack truncate>
							<el-row justify="space-between" :gutter="20">
								<el-col :span="8"><el-text>L : 英文字母</el-text></el-col>
								<el-col :span="8"><el-text>9 : 数字</el-text></el-col>
								<el-col :span="8"><el-text>C : 英文字母或数字</el-text></el-col>
							</el-row>
							<el-row justify="space-between" :gutter="20">
								<el-col :span="8"><el-text>Y : 年</el-text></el-col>
								<el-col :span="8"><el-text>M : 月</el-text></el-col>
								<el-col :span="8"><el-text>D : 日</el-text></el-col>
							</el-row>
							<el-row justify="space-between" :gutter="20">
								<el-col :span="8"><el-text>W : 周别</el-text></el-col>
								<el-col :span="8"><el-text>K : 周几</el-text></el-col>
								<el-col :span="8"><el-text>F : 一年的某一天</el-text></el-col>
							</el-row>
						</Stack>
					</el-col>
					<el-col :span="10">
						<el-card :body-style="{ padding: '1rem' }" mt="-16">
							<el-text size="large" tag="b">Apple SN Rule</el-text>
							<el-divider my="1.5"></el-divider>
							<Stack size="small">
								<el-row justify="space-between" :gutter="20">
									<el-col :span="12"><el-text>PPP : Plant Code</el-text></el-col>
									<el-col :span="12"><el-text>EEEE : 4C/4E</el-text></el-col>
								</el-row>
								<el-row justify="space-between" :gutter="20">
									<el-col :span="12"><el-text>U : Apple 12D Year</el-text></el-col>
									<el-col :span="12"><el-text>R: Revision</el-text></el-col>
								</el-row>
								<el-row justify="space-between" :gutter="20">
									<el-col :span="12"><el-text>V : Apple 12D Week</el-text></el-col>
								</el-row>
							</Stack>
						</el-card>
					</el-col>
				</el-row>
				<el-row align="middle" :gutter="10">
					<el-col :span="5"><el-text>X: Checksum/Function</el-text></el-col>
					<el-col :span="8">
						<el-select v-model="state.curRuleParam.checkSumFun" size="small" w="65">
							<el-option v-for="item in state.checkSumFuncs" :key="item" :label="item" :value="item" />
						</el-select>
					</el-col>
					<el-col :offset="1" :span="3"><el-text>Release Qty</el-text></el-col>
					<el-col :span="4">
						<el-select v-model="state.curRuleParam.releaseType" size="small">
							<el-option v-for="(i, index) in releaseOptions" :key="i" :label="i" :value="index" />
						</el-select>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<Stack size="small">
							<Stack size="small" horizontal flex-items="center">
								<div class="split-left"></div>
								<el-text>日期码(使用者自定)</el-text>
								<div class="split-right" item-flex="1 1"></div>
							</Stack>
							<Stack horizontal>
								<el-text>m : 月份代码</el-text>
								<div item-flex="1 1"></div>
								<el-input v-model="state.curRuleParam.monthText" item-flex="0 0 55%"
									size="small"></el-input>
							</Stack>
							<Stack horizontal>
								<el-text>d : 日期代码</el-text>
								<div item-flex="1 1"></div>
								<el-input v-model="state.curRuleParam.dayText" item-flex="0 0 55%" size="small"></el-input>
							</Stack>
							<Stack horizontal>
								<el-text>w: 周别代码</el-text>
								<div item-flex="1 1"></div>
								<el-input v-model="state.curRuleParam.weekText" item-flex="0 0 55%" size="small"></el-input>
							</Stack>
							<Stack horizontal>
								<el-text>k : 一周某一天</el-text>
								<div item-flex="1 1"></div>
								<el-input v-model="state.curRuleParam.weekYearText" item-flex="0 0 55%"
									size="small"></el-input>
							</Stack>
						</Stack>
					</el-col>
					<el-col :span="12">
						<Stack size="small">
							<Stack>
								<el-row :gutter="20">
									<el-col :span="12">
										<Stack size="small">
											<Stack size="small" horizontal flex-items="center">
												<div class="split-left"></div>
												<el-text>S : 流水码</el-text>
												<div class="split-right" item-flex="1 1"></div>
											</Stack>
											<el-radio-group v-model="state.curRuleParam.flowCodeMode" size="small">
												<el-radio-button label="10">十进制</el-radio-button>
												<el-radio-button label="16">16进制</el-radio-button>
											</el-radio-group>
										</Stack>
									</el-col>
								</el-row>
							</Stack>
							<Stack>
								<el-row :gutter="20">
									<el-col :span="12">
										<Stack size="small">
											<Stack size="small" horizontal flex-items="center">
												<div class="split-left"></div>
												<el-text>流水码产生方式</el-text>
												<div class="split-right" item-flex="1 1"></div>
											</Stack>
											<el-radio-group v-model="state.curRuleParam.flowGenMode" size="small">
												<el-radio-button label="Manual">手动</el-radio-button>
												<el-radio-button label="Auto">自动</el-radio-button>
											</el-radio-group>
											<Stack horizontal flex-items="center">
												<el-switch v-model="state.curRuleParam.needReset" inline-prompt
													active-text="重设" inactive-text="重设" />
												<el-select v-model="state.curRuleParam.resetType" size="small">
													<el-option v-for="(i, index) in resetTypes" :key="i" :label="i"
														:value="index" />
												</el-select>
											</Stack>
										</Stack>
									</el-col>
									<el-col :span="12">
										<Stack size="small">
											<Stack size="small" horizontal flex-items="center">
												<div class="split-left"></div>
												<el-text>流水码起始位</el-text>
												<div class="split-right" item-flex="1 1"></div>
											</Stack>
											<Stack horizontal>
												<el-text>起始流水码</el-text>
												<div item-flex="1 1"></div>
												<el-input v-model="state.curRuleParam.minVal" size="small"></el-input>
											</Stack>
											<Stack horizontal>
												<el-text>结束流水码</el-text>
												<div item-flex="1 1"></div>
												<el-input v-model="state.curRuleParam.maxVal" size="small"></el-input>
											</Stack>
										</Stack>
									</el-col>
								</el-row>
							</Stack>
						</Stack>
					</el-col>
				</el-row>
			</Stack>
			<div flex="1" px="4" mx="-1.5" truncate bg="light">
				<el-row :gutter="20" h="full">
					<el-col :span="12" h="full">
						<Stack size="small" h="full">
							<Stack size="small" horizontal flex-items="center">
								<div class="split-left"></div>
								<el-text>其他函数</el-text>
								<div class="split-right" item-flex="1 1"></div>
							</Stack>
							<el-table :data="state.curRuleParam.otherFuncs" item-flex="1 1" item-class="truncate" border
								size="small">
								<el-table-column v-for="i in otherFuncCols" :key="i.prop" :prop="i.prop" :label="i.label"
									:width="i.width" :fixed="i.fixed" />
							</el-table>
						</Stack>
					</el-col>
					<el-col :span="12" h="full">
						<Stack size="small" h="full">
							<Stack size="small" horizontal flex-items="center">
								<div class="split-left"></div>
								<el-text>流水码(使用者自定)</el-text>
								<div class="split-right" item-flex="1 1"></div>
							</Stack>
							<el-table :data="state.curRuleParam.userDefinedFlowCodes" item-flex="1 1" item-class="truncate"
								border size="small">
								<el-table-column v-for="i in flowCodeCols" :key="i.prop" :prop="i.prop" :label="i.label"
									:width="i.width" :fixed="i.fixed" />
							</el-table>
						</Stack>
					</el-col>
				</el-row>
			</div>
		</el-main>
	</el-container>
</template>

<style>
.split-left {
	--el-border-style: solid;
	border-top: 1px var(--el-border-color) var(--el-border-style);
	width: 16px;
}

.split-right {
	--el-border-style: solid;
	border-top: 1px var(--el-border-color) var(--el-border-style);
}
</style>

<script setup>
import ToolButton from '@/views/components/ToolButton.vue'
import Stack from '@/views/components/Stack.vue'
// import { ref, onMounted } from "vue"
import { ElMessage } from "element-plus";

// import { DocumentAdd } from "@element-plus/icons-vue"

import { listRuleNames, getRuleParamByName, getFunName, getSeqName, getSeq } from '@/api/business/labelMnt/labelRule.js'
import { stepsTask } from '@/api/business/labelMnt/Task.js'

const statusFilters = [
	{ label: '启用', value: 'E' },
	{ label: '禁用', value: 'D' },
	{ label: '全部', value: 'A' },
]

const ruleFilters = [
	{ label: '规则名称', value: 'rule_name' },
	{ label: '规则类型', value: 'rule_type' },
	{ label: '描述', value: 'rule_desc' },
	{ label: '分组数量', value: 'group_qty' },
	{ label: '安全库存', value: 'safety_stock' },
	{ label: '状态', value: 'enabled' },
	{ label: '修改人', value: 'update_empno' },
	{ label: '修改时间', value: 'update_time' },
]

const ruleDtCols = [
	{ prop: 'ruleName', label: '规则名称', width: 180, fixed: true },
	{ prop: 'ruleType', label: '规则类型', width: 180 },
	{ prop: 'ruleDesc', label: '描述', width: 180 },
	{ prop: 'groupQty', label: '分组数量', width: 100 },
	{ prop: 'safetyStock', label: '安全库存', width: 100 },
	{ prop: 'enabled', label: '状态', width: 60 },
	{ prop: 'updateEmpno', label: '修改人', width: 100 },
	{ prop: 'updateTime', label: '修改时间', width: 160 },
]

const otherFuncCols = [
	{ prop: 'keyCode', label: 'Code', width: 120 },
	{ prop: 'field', label: '栏位', width: 120 },
	{ prop: 'function', label: '函数', width: 180 },
]

const flowCodeCols = [
	{ prop: 'code', label: 'Code', width: 120 },
	{ prop: 'data', label: '流水号', width: 200 },
]

const releaseOptions = [
	'Release', '0'
]

const resetTypes = [
	'Day', 'Week', 'Month', 'Year'
]

//view refs
const leftHeader = ref(null)
//viewState
const viewState = reactive({
	headerHeight: null,
})
//modelState
const state = reactive({
	statusValue: statusFilters[0].value,
	ruleFieldValue: ruleFilters[0].value,
	ruleFilterText: '',

	ruleDt: null,
	curRule: null,

	checkSumFuncs: [],


	curRuleParam: {
		code: null,
		default: null,
		checkSumFun: null,
		releaseType: null,

		resetType: null,

		monthText: null,
		dayText: null,
		weekText: null,
		weekYearText: null,

		flowCodeMode: null,
		flowGenMode: null,
		needReset: false,

		otherFuncs: [],
		userDefinedFlowCodes: [],

		minVal: null,
		maxVal: null,
	},

})

state.queryParam = computed(() => {
	let upVal = ''
	switch (state.statusValue) {
		case "E": upVal = "Y"
			break
		case "D": upVal = "N"
			break
	}
	return { status: upVal, ruleField: state.ruleFieldValue, filterText: state.ruleFilterText }
})

const { statusValue, ruleFieldValue, ruleFilterText, curRuleParam } = toRefs(state)

//watches
watch(() => state.curRule, (val, old, onCleanup) => {
	const taskRef = { value: null }

	const steps = [
		() => getRuleParamByName({ ruleName: val.ruleName }),
		(ruleParams) => showData(val, ruleParams, taskRef)
	]
	const task = stepsTask(...steps)
	taskRef.value = task

	onCleanup(task.cancel)
	task.start()
})

//methods
const onLoad = async () => {
	state.checkSumFuncs = await getFunName({ sFix: 'X_' })
}
const search = async () => {
	// ElMessage.success(`input is: ${ruleFilterText.value}`)
	if (!ruleFilterText || ruleFilterText === '') return
	const res = await listRuleNames(state.queryParam)
	state.ruleDt = res
}

const clearData = () => {
	for (const i in state.curRuleParam) {
		const op = state.curRuleParam[i]

		const type = typeof (op)
		if (type === 'boolean')
			state.curRuleParam[i] = false
		else if (op instanceof Array)
			state.curRuleParam[i] = []
		else
			state.curRuleParam[i] = null
	}
}

const showData = async (curRule, ruleParams, taskRef) => {
	const ruleName = curRule.ruleName
	const ruleType = curRule.ruleType
	clearData()

	ruleParams.forEach(item => {
		const paramName = item.parameName
		const paramItem = item.parameItem
		const paramValue = item.parameValue

		if (paramName == ruleType + " Code") {
			if (paramItem == "Code")
				state.curRuleParam.code = paramValue;
			else if (paramItem == "Default")
				state.curRuleParam.default = paramValue;
			else if (paramItem == "Code Type") {
				state.curRuleParam.flowCodeMode = paramValue
			}
			return
		}

		switch (paramName) {
			case "Month User Define":
				state.curRuleParam.monthText = paramValue;
				return;
			case "Day User Define":
				state.curRuleParam.dayText = paramValue;
				return;
			case "Week User Define":
				state.curRuleParam.weekText = paramValue;
				return;
			case "Day of Week User Define":
				state.curRuleParam.weekYearText = paramValue;
				return;
			case "Check Sum":
				state.curRuleParam.checkSumFun = paramValue
				return;
			case "Reset Sequence": {
				const intVal = parseInt(paramValue)
				state.curRuleParam.resetType = intVal < 0 ? null : intVal
				state.curRuleParam.needReset = (paramItem == "1");
				return;
			}
			case "Sequence Mode":
				state.curRuleParam.flowGenMode = paramValue
				return;
			case "QTY": {
				const intVal = parseInt(paramValue)
				state.curRuleParam.releaseType = intVal < 0 ? null : intVal
				return;
			}
		}

		if (paramName.indexOf("Digit Type & Field") != -1) {
			state.curRuleParam.otherFuncs.push({
				keyCode: paramName.substring(0, 1),
				field: paramItem,
				function: paramValue
			})

			return
		}
		if (paramName == ruleType + " User Define") {
			state.curRuleParam.userDefinedFlowCodes.push({
				code: paramItem,
				data: paramValue
			})
			return
		}
	})

	if (ruleType == "MAC") {
		const sAppears = state.curRuleParam.code?.match(/S/g)?.length

		const task = taskRef.value
		const seqName = (await getSeqName({ ruleName })).seqName
		if (!seqName) return

		if (task.canceled) { return }
		const seqInfos = await getSeq({ seqName, ruleName })
		if (task.canceled) { return }

		if (seqInfos.length != 0) {
			const seqInfo = seqInfos[0]
			state.curRuleParam.minVal = seqInfo.MIN_VALUE
			state.curRuleParam.maxVal = seqInfo.MAX_VALUE
		}
	}
}


//event handlers
const ruleDtSelChanged = (val, old) => {
	state.curRule = val
}

// const tb1 = ref(null)
//life cycles
onMounted(() => {
	viewState.headerHeight = leftHeader.value.$el.clientHeight
	onLoad()

	// console.log(this)
	// const tb1v = tb1.value

	// for (const [key, val] of Object.entries(tb1v)) {
	// 	console.log(`${key}: ${val}`)
	// }

	// for (const key in tb1v) {
	// 	if (Object.hasOwnProperty(tb1v, key)) {
	// 		const element = tb1v[key];
	// 		console.log(`${key}: ${element}`)
	// 	}
	// }

	// // console.log(tb1.value)
	// console.log(tb1v.$options)
	// // console.log(tb1.value.$options.setup.toString())
	// console.log(tb1v.$props)
	// console.log(tb1v.$setup)
	// console.log(tb1v.$event)
})

</script>