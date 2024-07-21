import { ElMessage, ElMessageBox } from 'element-plus'
import * as api from '@/api/business/prodMnt/prodTransferInOut.js'

//consts
// const stationInfoKey = 'prodTransferInOut.stationInfo'
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
    activeTabName: 'out',

    confirmText: computed(() => state.activeTabName === 'out' ? '确认借出' : '确认归还'),

    sn: '',
    model: '',
    ipn: '',
    wo: '',
    fromUser: '',
    toUser: '',
    phone: '',

    lab: '',

    windowMsg: 'Standby',
    windowStateAttr: {
        bg: 'red'
    },
    windowStateText: '',
})

const viewState = reactive({
    showStationConfig: false,

    sn: {
        readonly: false,
        disabled: false,
        focused: false,
        visible: true,
    },

    model: {
        readonly: true,
        disabled: false,
        focused: false,
        visible: true,
    },

    ipn: {
        readonly: true,
        disabled: false,
        focused: false,
        visible: true,
    },

    wo: {
        readonly: true,
        disabled: false,
        focused: false,
        visible: true,
    },

    fromUser: {
        readonly: true,
        disabled: false,
        focused: false,
        visible: true,
    },

    toUser: {
        readonly: false,
        disabled: false,
        focused: false,
        visible: true,
    },

    phone: {
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

//events
async function onLoad() {
    showMessage('Standby', NORMAL)
}

async function onTabChange() {

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

    if (state.passSn) {
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

    onTabChange,
    onSnSubmit,
    onErrorMsgSubmit,
    onPassOrFailSelected,
}