import * as api from "@/api/business/toolMnt/toolPickLoad"

export const state = reactive({
    activeTabName: 'upline',

    empNo: "",
    tooling: "",
    line: '',
    partNo: '',

    lines: [],
    partNos: [],

    upDownData: [],

    windowMsg: "",

    windowStateAttr: {
        bg: 'white'
    },
})

export const viewState = reactive({
    partNo: {
        readonly: false,
        disabled: false,
        focused: false,
        visible: false,
    },

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
    partNo: '',
    empNo: '',
    tooling: '',
    activeInput: viewState.empNo,
}

export async function onTabChange(t) {
    const lpartNo = lastInputs.partNo
    const lempNo = lastInputs.empNo
    const ltooling = lastInputs.tooling
    const lactive = lastInputs.activeInput

    lastInputs.partNo = state.partNo
    lastInputs.empNo = state.empNo
    lastInputs.tooling = state.tooling
    lastInputs.activeInput = !viewState.empNo.disabled ? viewState.empNo
        : !viewState.tooling.disabled ? viewState.tooling
            : null

    state.empNo = lpartNo
    state.empNo = lempNo
    state.tooling = ltooling
    if (!lactive) return

    if (!state.line) {
        proxy.$refs['lineSelect'].focus()
    }
    else {
        lactive.focused = true
    }

    lactive.disabled = false

    if (lactive != viewState.partNo) viewState.partNo.disabled = true
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

    state.lines = (await api.selectLine()).data
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

export async function onLineSelect() {
    if (!state.line) return
    if (viewState.partNo.visible) {
        viewState.partNo.focused = true
    }
    else if (!viewState.empNo.disabled) {
        viewState.empNo.focused = true
    }
    else {
        viewState.tooling.focused = true
    }
}

export async function onPartNoSubmit() {
    await tryRun(async () => {
        checkIsNull(state.empNo, proxy.$t("mntntoolpickload.partNoNullMsg"))
        const r = await api.selectPart({ partno: state.partNo })
        showMessage(r.msg, OK)

        viewState.partNo.disabled = true
        viewState.empNo.disabled = false

        viewState.empNo.focused = true
    })
}

export async function onEmpNoSubmit() {
    await tryRun(async () => {
        checkIsNull(state.empNo, proxy.$t("mntntoolpickload.empNoNullMsg"))
        const r = await api.selectEmpNo({ empno: state.empNo })
        showMessage(r.msg, OK)

        viewState.empNo.disabled = true
        viewState.tooling.disabled = false

        viewState.tooling.focused = true
    })
}

export function reset() {
    state.empNo = ''
    state.tooling = ''

    state.partNo = ''

    viewState.empNo.disabled = false
    viewState.tooling.disabled = true

    if (state.line)
        viewState.empNo.focused = true
    else {
        proxy.$refs['lineSelect'].focus()
    }
}


export async function onToolingSubmit() {
    await tryRun(async () => {
        checkIsNull(state.tooling, proxy.$t("mntntoolpickload.toolingNullMsg"))
        let msg = ''
        let data = null
        if (state.activeTabName == 'upline') {
            data = (await api.toolingSnPickLoad({
                upOrDown: 'up',
                line: state.line,
                partNo: state.partNo,
                empno: state.empNo,
                toolingsn: state.tooling
            })).data

            msg = 'mntntoolpickload.uplineOkMsg'
        }
        else {
            data = (await api.toolingSnPickLoad({
                upOrDown: 'down',
                line: state.line,
                partNo: state.partNo,
                empno: state.empNo,
                toolingsn: state.tooling
            })).data

            msg = 'mntntoolpickload.downlineOkMsg'
        }

        showMessage(proxy.$t(msg), OK)
        state.upDownData.push(data)
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