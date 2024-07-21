import { ElMessage, ElMessageBox } from 'element-plus'
import * as api from '@/api/business/prodMnt/prodVI.js'
import {
    getStationInfo,
    getLineWo,
    getOprateStep,
    getWoSnStatus,
    getWoBomKeyparts,
    getStationLinkCount,
    getEmpWoPassCount
} from '@/api/business/prodMnt/prodInput.js'

import * as service from './qService.js'
import { snInfo } from './models.js'

//consts
const stationInfoKey = 'ProdVI.stationInfo'
const ERROR = 'error'
const SUCCESS = 'success'
const WARM = 'error' //2
const OK = 'success' //3
const NORMAL = '-1'
const PENDING_OK = '4'
const PASS_OK = '5'

//fields
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
    errorCode: '',

    workOrders: [],

    opSteps: [],

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

const { links: opLinks } = opStepsVM
let opStores = null

let errorCode = ''

//refs
const refs = {}

function initRefs(refsVal) {
    for (const refName in refsVal) {
        refs[refName] = refsVal[refName]
    }
}

//watch
function initWatches() {
    watch(() => opStepsVM.stores, (stores) => {
        opStores = stores
    }, { immediate: true })

    watch(() => state.stationInfo, stationChanged)
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

const loadStation = () => {
    state.stationInfo = JSON.parse(localStorage.getItem(stationInfoKey))
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
                refs.inputBoxes.value.forEach(box => {
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

async function stationChanged(stationInfo) {
    state.workOrders = []
    state.opSteps = []

    opStepsVM.reset()

    windowState('red')

    if (!stationInfo) return

    const stationType = stationInfo.stationType
    let res = await getStationInfo({ stationType })
    state.stationTitle = `${stationInfo.station}(${res.stationDesc})`

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
    focusNext(true)
}

function showMain() {
    if (snInfo.sn && snInfo.sn != "N/A") {
        state.curWo = snInfo.wo
        state.curIpn = snInfo.ipn
        //getEsopPlaySound()
    }
}

function keyDownEnd(label, value, hasNext) {
    switch (label) {
        case 'SN': {
            if (!hasNext)
                showMessage(`${label}: ${snInfo.sn} 过站成功！`, SUCCESS)
            else
                showMessage(`${label}: ${value} 检查成功，请继续！`, SUCCESS)
            break
        }
        case 'ErrorCode': {
            if (!hasNext) {
                if (errorCode != 'N/A')
                    showMessage(`${label}: ${snInfo.sn} 打不良成功!`, SUCCESS)
                else
                    showMessage(`SN: ${snInfo.sn} 过站成功！`, SUCCESS)
            }
            else
                showMessage(`${label}: ${value} 检查成功，请继续！`, SUCCESS)
            break
        }
        default: {
            if (!hasNext)
                showMessage(`SN: ${snInfo.sn} 过站成功！`, SUCCESS)
            else
                showMessage(`${label}: ${value} 检查成功，请继续！`, SUCCESS)
            break
        }
    }
}

//events
function onLoad() {
    loadStation()
}

const onInput = ({ label, value }) => {
    // console.log(`${label}: ${value}`)
    opStores[label].modelValue = value
}

async function onInputSubmit(op) {
    const inputValue = op.store.modelValue

    if (!inputValue || inputValue === '') {
        return
    }

    if (inputValue === 'RESET') {
        onLoad()
        return
    }

    if (op.label === 'FDISN') {
        const fdiList = inputValue.split(':')

        if (fdiList.length < 6) {
            showMessage('FDI格式错误', ERROR)
            op.select()
            return
        }

        if (state.stationInfo.stationType === 'AT56') {
            snInfo.fdiSn = fdiList[2]
        } else {
            snInfo.fdiMpn = fdiList[0]
            snInfo.fdiRegionCode = fdiList[1]
            snInfo.fdiSn = fdiList[2]
            snInfo.fdiImei = fdiList[3]
            snInfo.fdiMoped = fdiList[4]
            snInfo.fdiPower = fdiList[5]
        }
        op.store.modelValue = snInfo.fdiSn
    }

    let res = await service.getValues(op.label, inputValue)
    if (!res.ok) {
        if (op.seq == 1) {
            snInfo.clear()
        }
        showMessage(res.msg, ERROR)
        op.select()
        return
    }

    showMain()

    if (snInfo.sn && snInfo.sn != "N/A") {
        let res = await api.getMarinaStation()
        if (res.yes) {
            const data = (await api.marinaCheck({ sn: snInfo.sn, station: state.stationInfo.station })).data
            if (data.includes("OKtoShipwithInstalledOS =N") && data.includes("SFC_OK")) {
                if (op.seq == 1) {
                    snInfo.clear()
                }
                showMessage('Marina Check Not OK,Go to S/S!', ERROR)
                op.select()
                return
            }
            else if (data.includes('OKtoShipwithInstalledOS =Y') && data.includes('SFC_OK')) { }
            else {
                showMessage(`Error:${data}`, ERROR)
                op.select()
                return
            }
        }
    }

    if (op.label == 'FDISN' && state.stationType != 'AT56') {
        if (`${snInfo.fdiMpn}${snInfo.fdiRegionCode}` != snInfo.mpn) {
            if (op.seq == 1) {
                snInfo.clear()
            }
            showMessage(`FDI MPN:${snInfo.fdiMpn}${snInfo.fdiRegionCode},SN MPN:${snInfo.mpn} 不一致！`, ERROR)
            op.select()
            return
        }

        if (snInfo.mpn == "CH/A") {
            if (snInfo.fdiImei != snInfo.imei) {
                if (op.seq == 1) {
                    snInfo.clear()
                }
                showMessage(`FDI IMEI:${snInfo.fdiImei},SN IMEI:${snInfo.imei} 不一致！`, ERROR)
                op.select()
                return
            }
        }
        else {
            if (snInfo.fdiImei != `${snInfo.imei}+${snInfo.imei2}`) {
                if (op.seq == 1) {
                    snInfo.clear()
                }
                showMessage(`FDI IMEI:${snInfo.fdiImei},SN IMEI:${snInfo.imei}+${snInfo.imei2} 不一致！`, ERROR)
                op.select()
                return
            }
        }

        if (snInfo.fdiMoped != snInfo.moped.substring(2)) {
            if (op.seq == 1) {
                snInfo.clear()
            }
            showMessage(`FDI MOPED:${snInfo.fdiMoped},SN MOPED:${snInfo.moped.substring(2)} 不一致！`, ERROR)
            op.select()
            return
        }

        if (snInfo.fdiSn && op.label === 'SN') {
            if (snInfo.fdiSn != snInfo.sn) {
                showMessage(`FDI SN:${snInfo.fdiSn} 与扫入SN:${snInfo.sn} 不一致，请确认！`, ERROR)
                op.select()
                return
            }
        }

        if (op.label === 'ErrorCode') {
            errorCode = inputValue
            if (inputValue !== 'PASS' && inputValue !== 'END') {
                const res = api.checkErrorCode({ errorCode })
                if (!res.yes) {
                    showMessage('ERROR CODE不存在，请确认！', ERROR)
                    op.select()
                    return
                }
            }

            if (errorCode === 'PASS') {
                if (state.errorCode !== 'PASS') {
                    showMessage('已经输入ERROR CODE，不可输入PASS！', ERROR)
                    op.select()
                    return
                }

                errorCode = 'N/A'
            }
            else {
                if (errorCode === 'END') {
                    if (state.errorCode === 'PASS') {
                        showMessage('未输入ERROR CODE，不可输入END！', ERROR)
                        op.select()
                        return
                    }
                    errorCode = state.errorCode
                }
                else {
                    if (state.errorCode === 'PASS') {
                        state.errorCode = errorCode
                        showMessage('请继续输入ERROR CODE...', ERROR)
                        op.select()
                        return
                    }
                    else {
                        state.errorCode = `${state.errorCode},${errorCode}`
                        showMessage('请继续输入ERROR CODE...', ERROR)
                        op.select()
                        return
                    }
                }
            }
        }

        res = await service.checkLogic(state.stationInfo.station, op.seq, errorCode)
        if (!res.ok) {
            if (op.seq == 1)
                snInfo.clear()
            showMessage(res.msg, ERROR)
            op.select()
            return
        }

        //播放声音
        if (res.msg !== 'OK' && res.msg.startsWith('OK')) {
            //pcbMessage.Image = imageList1.Images[0];
            // pcbMessage.BackColor = Color.Yellow;
            // lblMessage.Text = exeRes.Message;
            // lblMessage.BackColor = Color.Yellow;
            // lblMessage.ForeColor = Color.Black;
            // Imes.Utility.Tools.AudioPlayer.PlaySound("C:\\Voice\\AUDIO_OK.wav");
        }

        const hasNext = focusNext()
        keyDownEnd(op.label, inputValue, hasNext)
    }
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
    state,
    viewState,
    opStepsVM,
    opStores,
    opLinks,
    initRefs,
    initWatches,
    switchStationConfig,
    onLoad,
    onInput,
    onMenuCommand,
    onStationConfigOk,
}
