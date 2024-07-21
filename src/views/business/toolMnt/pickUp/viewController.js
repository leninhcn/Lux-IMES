import * as api from "@/api/business/toolMnt/toolPickup"

export const state = reactive({
    activeTabName: 'pickUp',

    empNo: "",
    tooling: "",

    pickData: [],

    windowMsg: "",

    windowStateAttr: {
        bg: 'white'
    },
})

export const viewState = reactive({
    empNo: {
        readonly: false,
        disabled: false,
        focused: false,
        visible: true,
    },

    tooling: {
        readonly: false,
        disabled: false,
        focused: false,
        visible: true,
    },
})

const lastInputs = {
    empNo: '',
    tooling: '',
    activeInput: viewState.empNo,
}

export async function onTabChange(t) {

    const lempNo = lastInputs.empNo
    const ltooling = lastInputs.tooling
    const lactive = lastInputs.activeInput

    lastInputs.empNo = state.empNo
    lastInputs.tooling = state.tooling
    lastInputs.activeInput = !viewState.empNo.disabled ? viewState.empNo
        : !viewState.tooling.disabled ? viewState.tooling
            : null

    state.empNo = lempNo
    state.tooling = ltooling
    if (!lactive) return

    lactive.disabled = false
    lactive.focused = true

    if (lactive != viewState.empNo) viewState.empNo.disabled = true
    if (lactive != viewState.tooling) viewState.tooling.disabled = true
}

let proxy = null

export function setProxy(p) {
    proxy = p
}

export async function init() {
    showMessage('Standby', OK)
    reset()
}

function checkIsNull(value, errorMsg) {
    if (value) return
    throw {
        msg: errorMsg
    }
}

async function tryRun(callable) {
    try {
        const p = callable()
        if (p instanceof Promise)
            await p
    }
    catch (r) {
        showMessage(r.msg, ERROR)
        r.message = r.msg
        throw r
    }
}

export async function onEmpNoSubmit() {
    await tryRun(async () => {
        checkIsNull(state.empNo, proxy.$t("mntntoolpickup.empNoNullMsg"))
        const r = await api.selectEmpByNo({ empno: state.empNo })
        showMessage(r.msg, OK)

        viewState.empNo.disabled = true
        viewState.tooling.disabled = false

        viewState.tooling.focused = true
    })
}

export function reset() {
    state.empNo = ''
    state.tooling = ''

    viewState.empNo.disabled = false
    viewState.tooling.disabled = true

    viewState.empNo.focused = true
}


export async function onToolingSubmit() {
    await tryRun(async () => {
        checkIsNull(state.tooling, proxy.$t("mntntoolpickup.toolingNullMsg"))
        let msg = ''
        if (state.activeTabName == 'pickUp') {
            await api.pickUpToolingSn({
                empNo: state.empNo,
                toolingSn: state.tooling
            })

            msg = 'mntntoolpickup.pickUpOkMsg'
        }
        else {
            await api.returnToolingSn({
                empNo: state.empNo,
                toolingSn: state.tooling
            })

            msg = 'mntntoolpickup.returnOkMsg'
        }

        showMessage(proxy.$t(msg), OK)

        const tData = (await api.getToolingInfo({
            tooling: state.tooling,
        })).data

        state.pickData = tData
    })
}

const ERROR = 'error'
const SUCCESS = 'success'
const WARM = 'error' //2
const OK = 'success' //3
const NORMAL = '-1'
const PENDING_OK = '4'
const PASS_OK = '5'

function windowState(bg, stateMsg) {
    state.windowStateAttr.bg = bg
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