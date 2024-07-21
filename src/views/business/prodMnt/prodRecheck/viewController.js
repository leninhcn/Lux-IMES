import { ElMessage, ElMessageBox } from 'element-plus'
import * as api from '@/api/business/prodMnt/prodRecheck.js'

//consts
const stationInfoKey = 'ProdRecheck.stationInfo'
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
	qcInStation: '',
	qcOutStation: '',

	qcInStationList: [],
	qcOutStationList: [],

	inputType: '',
	curWo: '',
	curIpn: '',

	input: '',

	windowMsg: 'Standby',
	windowStateAttr: {
		bg: 'red'
	},
	windowStateText: '',
})

const viewState = reactive({
	showStationConfig: false,

	input: {
		label: 'Input',
		readonly: false,
		disabled: false,
		focused: false,
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

async function getQcInStations() {
	const data = (await api.getHtValues()).data
	state.qcInStationList = data
}

async function getQcOutStations() {
	const data = (await api.getHtValues()).data
	state.qcOutStationList = data
}

async function getSnDetail() {
	const data = (await api.getSnDetail()).data
	if(data.length == 0) return

	state.curIpn = data[0]["Ipn"]
	state.curWo = data[0]["WorkOrder"]
}


//events
async function onLoad() {
	await getQcInStations()
	await getQcOutStations()

	showMessage('Standby', NORMAL)
}

async function onInputSubmit() {
	const input = state.input
	if (!input) {
		showMessage('SN 不能为空', ERROR)
		return
	}

	const res = await getSnDetail()
	if(res.OK) {
		showMessage('产品刷入OK', OK)
	}
	else {
		showMessage(res.msg, ERROR)
	}

	refs.snInput.value.select()
	viewState.input.focused = true
}


export {
	inputTypes,
	state,
	viewState,
	initRefs,
	initWatches,
	onLoad,
	onInputSubmit
}