import { ElMessage, ElMessageBox } from 'element-plus'
import * as api from '@/api/business/prodMnt/prodOBA.js'

//consts
const stationInfoKey = 'ProdOBA.stationInfo'
const ERROR = 'error'
const SUCCESS = 'success'
const WARM = 'error' //2
const OK = 'success' //3
const NORMAL = '-1'
const PENDING_OK = '4'
const PASS_OK = '5'

const inputTypes = ['KPSN', 'CSN']

//fields
const state = reactive({
	stationTitle: 'OBA',

	passSn: null,

	passSnValue: computed({
		get: () => state.passSn ? 'Pass' : state.passSn == false ? 'Fail' : '',
		set: (value) => state.passSn = value === 'Pass'
	}),

	sn: '',
	errorMsg: '',

	windowMsg: 'Standby',
	windowStateAttr: {
		bg: 'red'
	},
	windowStateText: '',
})

const viewState = reactive({
	showStationConfig: false,

	snInput: {
		readonly: false,
		disabled: false,
		focused: false,
	},

	eMsgInput: {
		readonly: false,
		disabled: false,
		focused: false,
		visible: true,
	},

	showWoList: true,
})

//refs
const refs = {}

function initRefs(refsVal) {
	for (const refName in refsVal) {
		refs[refName] = refsVal[refName]
	}
}

//watch
function initWatches() {
}

//methods
const switchStationConfig = (visible) => {
	viewState.showStationConfig = visible
}

function windowState(bg, stateMsg) {
	state.windowStateAttr.bg = bg
	state.windowStateText = stateMsg
}

function showMessage(msg, level) {
	state.windowMsg = msg
	if (level === ERROR)
		windowState('red', '')
	else if (level === SUCCESS)
		windowState('green', '')
	else if (level == NORMAL)
		windowState('white', '')
}

async function getusn(sn) {
	let fdiList = null
	if (sn.length > 40)
	{
		fdiList = sn.split(':')
		if (fdiList.Count > 4)
		{
			fdiList = sn.split(':')
			sn = fdiList[2]
		}
	}

	state.sn = sn
	const kpSn = (await api.getSnFromKpItem({kpItem: sn})).data
	if(kpSn) {
		state.sn = kpSn
	}

	return state.sn
}


//events
async function onLoad() {
	showMessage('Standby', NORMAL)
	state.passSn = true
	onPassOrFailSelected()
}

async function onSnSubmit() {
	let sn = state.sn
	sn = await getusn(sn)

	const snInfo = (await api.getSnInfo({ sn })).data

	if (!snInfo) {
		showMessage('SN 条码不存在', ERROR)
		refs.snInput.value.select()
		viewState.snInput.focused = true
		return
	}

	const line = snInfo.line
	const stationType = snInfo.stationType

	if(state.passSn) {
		await api.insertOBA({ sn, errorMsg: '', line, stationType, status: '1' })

		showMessage(`SN: ${sn} 登记OK`, SUCCESS)
		state.sn = ''
		viewState.snInput.focused = true
	}
	else {
		showMessage(`SN: ${sn} OK, 请填写Error Message`, SUCCESS)
		refs.eMsgInput.value.select()
		viewState.eMsgInput.focused = true
	}
}

async function onErrorMsgSubmit() {
	if (state.passSn) return
	const errorMsg = state.errorMsg
	let sn = state.sn
	sn = await getusn(sn)

	const snInfo = (await api.getSnInfo({ sn })).data
	const line = snInfo.line
	const stationType = snInfo.stationType

	await api.insertOBA({ sn, errorMsg, line, stationType, status: '0' })
	await api.insertHold({ sn, holdMsg: errorMsg })
	showMessage(`SN: ${sn} 登记OK`, SUCCESS)

	state.errorMsg = ''
	state.sn = ''
	viewState.snInput.focused = true
}

async function onPassOrFailSelected() {
	showMessage('Message', NORMAL)
	state.errorMsg = ''
	state.sn = ''
	viewState.snInput.focused = true

	viewState.eMsgInput.visible = !state.passSn
}

const onMenuCommand = (command) => {
	if (command === 'configTerminal') {
		switchStationConfig(true)
	}
}

const onStationConfigOk = async (stationInfo) => {
	localStorage.setItem(stationInfoKey, JSON.stringify(stationInfo))

	state.stationInfo = stationInfo

	switchStationConfig(false)
}


export {
	inputTypes,
	state,
	viewState,
	initRefs,
	initWatches,
	onLoad,
	onMenuCommand,
	onStationConfigOk, 
	onSnSubmit,
	onErrorMsgSubmit,
	onPassOrFailSelected,
}