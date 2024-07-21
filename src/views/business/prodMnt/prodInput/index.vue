<template>
	<div h="full" b-rd="2" p="2" style="background-color: lavender;">
		<Stack h="full">
			<Stack class="menu-bar" horizontal b-rd="2" p="1" mt="-5">
				<el-dropdown trigger="click" size="small" @command="onMenuCommand">
					<span p="1" class="el-dropdown-link">菜单<el-icon><arrow-down /></el-icon></span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="configTerminal">站点配置</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</Stack>
			<el-row class="status-block" item-class="mt-1 h-30" h="full" :gutter="10">
				<el-col :span="6" h="full">
					<Stack size="small" h="full" class="block-bar" b-rd="2">
						<el-text p="3">工站信息</el-text>
						<el-divider m="0" />
						<el-text item-flex="1" item-class="justify-center" style="flex: none">{{
							state.stationTitle }}</el-text>
					</Stack>
				</el-col>
				<el-col :span="7" h="full">
					<Stack size="small" h="full" class="block-bar" b-rd="2" py="2" px="10">
						<Stack horizontal size="small" flex-items="center" item-flex="0 0 60%">
							<el-text>工单</el-text>
							<div item-flex="1"></div>
							<el-select ref="woInput" item-flex="0 0 80%" v-model="state.curWo" filterable>
								<el-option v-for="(wo, index) in state.workOrders" :key="index" :label="wo" :value="wo" />
							</el-select>
						</Stack>
						<el-divider my="0" item-class="mx--10" />
						<Stack horizontal size="small" item-flex="1">
							<el-text>料号</el-text>
							<div item-flex="1"></div>
							<el-text item-flex="0 0 80%">{{ state.curIpn }}</el-text>
						</Stack>
					</Stack>
				</el-col>
				<el-col :span="11" h="full">
					<el-row h="full" class="block-bar" b-rd="2" py="6" pl="8" truncate>
						<el-col :span="18" h="full">
							<Stack size="small" justify="between" h="full">
								<Stack horizontal>
									<el-row justify="space-between" item-flex="0 0 48%">
										<el-col :span="8"><el-text>工单总量：</el-text></el-col>
										<el-col :span="8"><el-text>{{ state.counts.target }}</el-text></el-col>
									</el-row>
									<div item-flex="1"></div>
									<el-row justify="space-between" item-flex="0 0 48%">
										<el-col :span="8"><el-text>工单产出量：</el-text></el-col>
										<el-col :span="8"><el-text>{{ state.counts.output }}</el-text></el-col>
									</el-row>
								</Stack>
								<Stack horizontal>
									<el-row justify="space-between" item-flex="0 0 48%">
										<el-col :span="8"><el-text>工单投入量：</el-text></el-col>
										<el-col :span="8"><el-text>{{ state.counts.input }}</el-text></el-col>
									</el-row>
									<div item-flex="1"></div>
									<el-row justify="space-between" item-flex="0 0 48%">
										<el-col :span="8"><el-text>工单未投量：</el-text></el-col>
										<el-col :span="8"><el-text>{{ state.counts.need }}</el-text></el-col>
									</el-row>
								</Stack>
								<Stack horizontal>
									<el-row justify="space-between" item-flex="0 0 48%">
										<el-col :span="8"><el-text>工号投入计数：</el-text></el-col>
										<el-col :span="8"><el-text>{{ state.counts.pass }}</el-text></el-col>
									</el-row>
									<div item-flex="1"></div>
								</Stack>
							</Stack>
						</el-col>
						<el-col :span="6" my="-8">
							<div class="flex windowState" :bg="state.windowStateAttr.bg" flex="col" flex-items="center"
								justify="center" h="full" font="mono" text="5xl">
								<div>{{ state.windowStateText }}</div>
							</div>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
			<el-row item-flex="1" h="full" :gutter="10" item-class="truncate p-5 m--5" pb="2" item-nogap>
				<el-col :span="7" h="full">
					<div h="full" truncate class="block-bar" b-rd="2" p="4">
						<Stack size="small" h="full" overflow="auto">
							<InputBox v-for="op in state.opSteps" ref="inputBoxes" :key="op.stepSeq" :label="op.stepInput"
								:model-value="opStepsVM.getProp(op.stepInput, 'modelValue', null)"
								@update:full-value="onInput" :modelModifiers="{ trim: true }"
								:disabled="opStepsVM.getProp(op.stepInput, 'disabled', true)"
								@update:disabled="opStores[op.stepInput].disabled = $event"
								:focused="opStepsVM.getProp(op.stepInput, 'focused', false)"
								@update:focused="opStores[op.stepInput].focused = $event"
								@submit="opStepsVM.trigger(op.stepInput, 'submit')" />
						</Stack>
					</div>
				</el-col>
				<el-col :span="17" h="full">
					<div h="full" class="block-bar" b-rd="2" p="4">
						<Stack h="full" size="small">
							<el-table size="small" item-flex="0 0 60%" item-class="truncate" class="block-bar" border
								:data="state.woSnStatusData">
								<template #empty>
									WoSnStatus:Empty
								</template>
								<el-table-column v-for="i in woSnStatusCols" :key="i.prop" :prop="i.prop" :label="i.label"
									:min-width="i.width" :fixed="i.fixed" show-overflow-tooltip />
							</el-table>
							<el-divider my="0" item-class="mx--2" />
							<el-table ref="kpListTableRef" size="small" item-flex="1" item-class="truncate"
								class="block-bar kplist-table" border :data="state.kpsnInfoData"
								:row-class-name="getKpListRowClass">
								<template #empty>
									KpsnInfo:Empty
								</template>
								<el-table-column v-for="i in kpsnInfoCols" :key="i.prop" :prop="i.prop" :label="i.label"
									:min-width="i.width" :fixed="i.fixed" :show-overflow-tooltip="true" />
							</el-table>
						</Stack>
					</div>
				</el-col>
			</el-row>
			<div h="full" truncate class="windowMsg block-bar" b-rd="2" mb="-6">
				<div :bg="state.windowStateAttr.bg"></div>
				<div class="flex block-bar" p="2" py="4.5" flex="col" flex-items="center" whitespace="normal" h="full"
					text="2xl center wrap">
					<div class="msg-content">{{ state.windowMsg }}</div>
				</div>
			</div>
		</Stack>
		<DownDialog v-model:visible="viewState.showStationConfig" width="80%">
			<StationConfig ref="stationConfigRef" class="p-0" h="120" :sites="['LKKS', 'LXKS']" :op-types="['Assy']"
				:client-types="['MANU']" @onOk="onStationConfigOk" @onCancel="switchStationConfig(false)" />
		</DownDialog>
	</div>
</template>
<style scoped>
.menu-bar {
	background-color: #ffffff57;
	backdrop-filter: blur(22px);
	box-shadow: 0px 20px 20px -10px rgb(0 0 0 / 37%);
}

.block-bar {
	background-color: #ffffff57;
	backdrop-filter: blur(15px);
	box-shadow: 0px 5px 20px 0px rgb(0 0 0 / 12%);
}

.el-dropdown-link {
	cursor: pointer;
	/* color: var(--el-color-primary); */
	display: flex;
	align-items: center;
	font-size: 0.75rem;
}

.windowState {
	color: var(--el-color-primary-light-9);
	transition: all 0.2s ease-out;
}

.windowState[bg~=red] {
	--un-bg-opacity: 1;
	background-color: rgb(248 113 113 / var(--un-bg-opacity));
}

.windowState[bg~=green] {
	--un-bg-opacity: 1;
	background-color: rgb(74 222 128 / var(--un-bg-opacity));
}

.windowMsg {
	color: var(--el-text-color-primary);
	position: relative;
	backdrop-filter: blur(3px);
	transition: all 0.5s ease-out;
}

.windowMsg .msg-content {
	--green-: 0 183 40;
	--red-: 255 0 50;

	padding: 0px 4px;
	-webkit-background-clip: text;
	-moz-background-clip: text;
	background-clip: text;
	background-color: #ffffff82;
	-webkit-text-stroke: 5px transparent;
}

.windowMsg>[bg] {
	position: absolute;
	inset: 0.3rem;
	border-radius: 0.3rem;
	transition: all 0.5s ease-out;
	--green-bg: 0 183 40;
	--red-bg: 255 0 50;

	background-color: rgb(230 230 250 / 0.01);
}

.windowMsg>[bg~=red] {
	box-shadow: inset 0px 0px 30px 18px rgb(var(--red-bg)/ 100%);
}

.windowMsg>[bg~=green] {
	box-shadow: inset 0px 0px 30px 18px rgb(var(--green-bg)/ 100%);
}

.windowMsg>.block-bar {
	backdrop-filter: blur(8px);
}

.windowMsg>[bg~=red]+.block-bar>.msg-content {
	color: rgb(var(--red-))
}

.windowMsg>[bg~=green]+.block-bar>.msg-content {
	color: rgb(var(--green-))
}
</style>
<style>
.kplist-table .pending-row {
	background-color: var(--el-color-warning-light-5);
}

.kplist-table .success-row {
	background-color: var(--el-color-success-light-5);
}
</style>

<script setup>
import Stack from '@/views/components/Stack.vue'
import StationConfig from '@/views/components/business/StationConfig.vue'
import DownDialog from '@/views/components/DownDialog.vue'

import InputBox from '@/views/components/business/InputBox.vue'

import { ElMessage } from 'element-plus'

import { getStationInfo, getLineWo, getOprateStep, getWoSnStatus, getWoBomKeyparts, getStationLinkCount, getEmpWoPassCount } from '@/api/business/prodMnt/prodInput.js'

import { SUCCESS, ERROR } from './models.js'

import * as models from './models.js'
import * as controller from './controller.js'

const woSnStatusCols = [
	{ prop: 'workOrder', label: '工单', width: 110, fixed: true },
	{ prop: 'serialNumber', label: '序列号', width: 180 },
	{ prop: 'stationType', label: '站点类型', width: 200 },
	{ prop: 'nextStationType', label: '下一个站点类型', width: 200 },
]

const kpsnInfoCols = [
	{ prop: 'workOrder', label: '工单', width: 110 },
	{ prop: 'ipn', label: '料号', width: 150 },
	{ prop: 'kpSpec', label: '物料规格', width: 150 },
	{ prop: 'itemIpn', label: '物料料号', width: 130 },
	{ prop: 'itemGroup', label: '物料组', width: 130 },
	{ prop: 'itemCount', label: '物料数', width: 70 },
]

const state = reactive({
	stationInfo: {
		line: null,
		stage: null,
		stationType: null,
		station: null,
	},

	stationTitle: null,
	curWo: '',
	curIpn: '',
	counts: {
		target: 0,
		output: 0,
		input: 0,
		need: 0,
		pass: 0
	},

	workOrders: [],

	opSteps: [],

	woSnStatusData: [],
	kpsnInfoData: [],

	windowMsg: 'Standby',
	windowStateAttr: {
		bg: 'red'
	},
	windowStateText: '',
})

const opStepsVM = {

	getProp(label, propName, value) {
		const store = this.getStore(label)

		if (!Object.prototype.hasOwnProperty.call(store, propName))
			store[propName] = ref(value)
		return store[propName]
	},

	trigger(label, eventName, ev) {
		const store = this.getStore(label)
		if (!store.forwardEvent) {
			store.forwardEvent = (eventName, ev) => {
				store.link?.getEvent(eventName)?.(ev)
			}
		}
		store.forwardEvent(eventName, ev)
	},

	getStore(label) {
		let store = this.stores[label]
		if (!store) {
			this.stores[label] = store = reactive({})
		}

		return store
	},

	initLinks(opSteps) {
		opSteps?.forEach((op, index) => {
			const store = this.getStore(op.stepInput)
			store.link = {
				seq: parseInt(op.stepSeq),
				label: op.stepInput,
				el: null,
				store: store,
				nextIndex: index + 1,

				events: {},
				getEvent(eventName) {
					const event = this.events[eventName]
					if (!event) return null

					return event
				},

				setEvent(eventName, f) {
					this.events[eventName] = (ev) => f(this, ev)
				}
			}
			this.links.list.push(store.link)
		})

		const length = this.links.list.length
		if (length == 0) return

		this.links.list[length - 1].nextIndex = -1
	},

	reset() {
		this.stores = {}
		this.links.current = null
		this.links.list = []
	},

	_stores: ref({}),

	get stores() { return this._stores.value },
	set stores(value) {
		this._stores.value = value
	},

	links: {
		current: null, list: [],
		pointTo(index) {
			if (this.list.length == 0 || index < 0 || index >= this.list.length) return null
			const current = this.list[index]
			this.current = current
			return current
		},
		get next() {
			if (this.list.length == 0) return null

			let current = this.current
			if (!current) {
				this.current = current = this.list[0]
			}
			else {
				if (current.nextIndex == -1) return null
				this.current = current = this.list[current.nextIndex]
			}

			return current
		}
	}
}

const woInput = ref(null)
const inputBoxes = ref([])
const kpListTableRef = ref(null)

const { links: opLinks } = opStepsVM
let opStores = null

const viewState = reactive({
	showStationConfig: false,
})

const stationConfigRef = ref(null)
let manualSwitchStationConfig = false

const stationInfoKey = 'ProdInput.stationInfo'

//watches

watch(() => opStepsVM.stores, (stores) => {
	opStores = stores
}, { immediate: true })

watch(() => state.stationInfo, stationChanged)

watch(() => viewState.showStationConfig, (visible) => {
	if (!visible && !manualSwitchStationConfig)
		stationConfigRef.value.beforeClose()
})

watch(() => state.curWo, (wo) => onWoChanged(wo))

//methods
function getKpListRowClass({ row }) {
	return row.vs.class
}

function resetKpListRowsClass() {
	state.kpsnInfoData.forEach(row => {
		row.vs.class = ''
	})
}

const switchStationConfig = async (open) => {
	manualSwitchStationConfig = true
	viewState.showStationConfig = open

	await nextTick()
	manualSwitchStationConfig = false
}

const loadStation = () => {
	state.stationInfo = JSON.parse(localStorage.getItem(stationInfoKey))
}

function windowState(bg, stateMsg) {
	state.windowStateAttr.bg = bg
	state.windowStateText = stateMsg
}

async function stationChanged(stationInfo) {
	state.workOrders = []
	state.opSteps = []

	opStepsVM.reset()

	windowState('red')

	if (!stationInfo) return

	const stationType = stationInfo.stationType
	let res = await getStationInfo({ stationType })
	state.stationTitle = `${stationInfo.station}(${res.stationDesc})`

	res = await getLineWo({ line: stationInfo.line, wo: '' })

	const workOrders = res.workOrders
	if (workOrders.length == 0) {
		ElMessage({
			message: `未查询到线别：${stationInfo.line} 该投入的工单！`,
			type: 'info',
			duration: 2000
		})

		return
	}

	state.workOrders = workOrders

	res = await getOprateStep({ stationType })
	const opSteps = res.steps

	if (opSteps.length == 0) {
		ElMessage({
			message: `${stationType} 未设置站点操作步骤！请确认！`,
			type: 'info',
			duration: 2000
		})

		return
	}

	state.opSteps = opSteps

	windowState('green')
	await nextTick()

	opStepsVM.initLinks(opSteps)
	focusWo()
}

function focusWo() {
	woInput.value?.focus()
}

function focusNext(toFirst = false) {
	const curOp = opLinks.current
	const nextOp = toFirst ? opLinks.pointTo(0) : opLinks.next
	if (curOp) {
		curOp.store.disabled = true
	}

	if (nextOp) {
		if (!nextOp.el) {
			function getInputBox(label) {
				let rBox = null
				inputBoxes.value.forEach(box => {
					if (box.label == label) {
						rBox = box
						return
					}
				})

				return rBox
			}
			nextOp.el = getInputBox(nextOp.label)
			nextOp.select = function () { this.el.select() }
			nextOp.setEvent('submit', onInputSubmit)
		}
		nextOp.store.disabled = false
		nextOp.store.focused = true
		nextOp.select()

		return true
	}

	return false
}

function showMessage(msg, level) {
	state.windowMsg = msg
	if (level === ERROR)
		windowState('red', '')
	else if (level === SUCCESS)
		windowState('green', '')
}

async function setWoSnStatus() {
	const res = await getWoSnStatus({ wo: models.woInfo.wo })
	state.woSnStatusData = res.data
}

async function setWoBomKeyparts() {
	let res = await getWoBomKeyparts({ wo: models.woInfo.wo, stationType: state.stationInfo.stationType })

	for (const row of res.data) {
		row.vs = {}
		row.vs.class = ''
	}

	state.kpsnInfoData = res.data
	//getPartBomList
	res = await getStationLinkCount({ model: models.woInfo.model, stationType: state.stationInfo.stationType })
	models.current.stationKpCount = res.count
}

async function setEmpWoPassCount() {
	const res = await getEmpWoPassCount({ station: state.stationInfo.station })
	state.counts.pass = res.count
}

async function showMain(label) {
	switch (label) {
		case 'SN':
			state.curIpn = models.snInfo.ipn
			await setWoSnStatus()
			await setWoBomKeyparts()
			break
		case 'WO':
			const { woInfo, snInfo } = models
			state.counts.target = woInfo.target
			state.counts.output = woInfo.output
			state.counts.input = woInfo.input
			state.counts.need = woInfo.needInput

			state.curIpn = snInfo.ipn

			await setWoSnStatus()
			await setWoBomKeyparts()
			await setEmpWoPassCount()

			showMessage('工单选择成功', SUCCESS)
			break
	}
}

async function refreshWoInfo(wo) {
	const ret = await controller.getValues('WO', wo)
	if (!ret.ok) {
		showMessage(ret.msg, ERROR)
		return
	}

	await showMain('WO')
}

function disableInputs(excludeCurrent) {
	function reset(op) {
		op.store.modelValue = ''
		op.store.disabled = true
	}

	if (excludeCurrent) {
		const current = opLinks.current
		opLinks.list.forEach(op => {
			if (op === current) return
			reset(op)
		})
	}
	else
		opLinks.list.forEach(reset)
}

function clearInputs() {
	const { snInfo, current } = models

	snInfo.clear()
	current.clear()
}

function resetInputs() {
	const { woInfo } = models

	if (woInfo.target > woInfo.input) {
		focusNext(true)
		disableInputs(true)
	}
	else
		disableInputs()
}

function clearAndResetInputs() {
	clearInputs()
	resetInputs()
}

//events
const onLoad = () => {
	loadStation()
}

const onInput = ({ label, value }) => {
	// console.log(`${label}: ${value}`)
	opStores[label].modelValue = value
}

async function onWoChanged(wo) {
	clearInputs()
	await refreshWoInfo(wo)
	resetInputs()
}

async function onInputSubmit(op) {
	const inputValue = op.store.modelValue
	// console.log(`${op.label}: ${inputValue}`)

	if (!inputValue || inputValue === '') {
		return
	}

	const label = op.label
	const { line, stationType, station } = state.stationInfo
	const { snInfo, woInfo, kpsnInfo, current } = models

	async function clear(msg, clearSn = false) {
		await controller.clearGetSN(stationType)
		if (clearSn && op.seq == 1)
			snInfo.clear()
		showMessage(msg, ERROR)
		op.select()
	}

	let ret = await controller.getValues(label, inputValue)
	if (!ret.ok) {
		await clear(ret.msg, true)
		return
	}

	ret = await controller.checkValue(label, inputValue)
	if (!ret.ok) {
		await clear(ret.msg, true)
		return
	}

	if (op.seq == 1) {
		resetKpListRowsClass()
	}

	if (op.label === 'KPSN' && current.stationKpCount > 0 || op.seq != 1) {
		const ret = await controller.checkKpsn(station)
		if (!ret.ok) {
			await clear(ret.msg)
			return
		}
		const kpIpn = ret.kpIpn
		const curPartBom = state.kpsnInfoData.find(q => q.itemIpn == kpIpn)

		const kpsnCount = current.bindList.reduce((p, val) => {
			return p + (val.itemSn == kpsnInfo.kpsn ? 1 : 0)
		}, 0)

		if (kpsnCount > 0) {
			await clear(`${kpsnInfo.kpsn}已刷入，不可重复刷！`)
			return
		}

		const ipnCount = current.bindList.reduce((p, val) => {
			return p + (val.itemIpn == kpIpn ? 1 : 0)
		}, 0)

		if (curPartBom.itemCount == 1 && ipnCount > 0) {
			await clear(`${kpIpn}已刷入或已刷入替代料，不可重复刷！`)
			return
		}

		const itemBindInfo = {
			wo: woInfo.wo,
			sn: snInfo.sn,
			itemIpn: kpIpn,
			itemSn: kpsnInfo.kpsn,
			itemGroup: curPartBom.itemGroup
		}
		current.bindList.push(itemBindInfo)

		if (curPartBom.itemCount == ipnCount + 1) {
			for (const itemPartBom of state.kpsnInfoData.filter(q => q.itemGroup == curPartBom.itemGroup && q.itemGroup !== '0')) {
				itemPartBom.vs.class = 'success-row'
			}

			if (curPartBom.itemGroup === '0') {
				itemPartBom.vs.class = 'success-row'
			}
		} else {
			for (const itemPartBom of state.kpsnInfoData.filter(q => q.itemGroup == curPartBom.itemGroup && q.itemGroup !== '0')) {
				itemPartBom.vs.class = 'pending-row'
			}

			if (curPartBom.itemGroup === '0') {
				itemPartBom.vs.class = 'pending-row'
			}
		}

		if (!current.kpList) current.kpList = kpsnInfo.kpsn
		else current.kpList += `#${kpsnInfo.kpsn}`

		current.kpCurrentCount
		if (current.stationKpCount > ++current.kpCurrentCount) {
			op.select()
			showMessage(`刷入成功...请继续...!`, SUCCESS)
			return
		}

		current.bindList = []
		current.kpCurrentCount = 0
	}

	ret = await controller.checkHalbStockOut(stationType)
	if (!ret.ok) {
		showMessage(ret.msg, ERROR)
		op.select()
		return
	}

	ret = await controller.checkLogic(station, op.seq)
	current.kpList = ''

	if (!ret.ok) {
		await clear(ret.msg, true)
		return
	}

	const hasNext = focusNext()

	if (!hasNext) {
		clearAndResetInputs()
		showMessage(`SN: ${snInfo.sn} 过站成功！`, SUCCESS)
	}
	else {
		showMessage(`${label}: ${inputValue} 检查成功，请继续！`, SUCCESS)
	}
}

const onMenuCommand = async (command) => {
	if (command === 'configTerminal') {
		switchStationConfig(true)
	}
}

const onStationConfigOk = async (stationInfo) => {
	localStorage.setItem(stationInfoKey, JSON.stringify(stationInfo))

	state.stationInfo = stationInfo

	switchStationConfig(false)
}

onMounted(() => {
	onLoad()
})
</script>