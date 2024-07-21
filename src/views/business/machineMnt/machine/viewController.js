import * as api from "@/api/business/machineMnt/machine"
import * as mgApi from "@/api/business/machineMnt/machineGroup"
import { listMachineTypes } from "@/api/business/machineMnt/machineType"
import { stationtypelistget, linelistget } from "@/api/mescommon/mesget"

const state = reactive({
    mgData: [],
    mgDataTotal: 0,
    currentMg: null,
    mgEditForm: null,

    stationTypes: [],
    lines: [],
    machineTypes: [],
    machinelocs: [],

    mData: [],
    mDataTotal: 0,
    currentMachine: null,
    mEditForm: null,
})

const viewState = reactive({
    mgLoading: false,
    showMgSearch: true,
    showMgEdit: false,
    mgEditTitle: "",
    mgLoadStationType: false,

    mLoading: false,
    showMSearch: true,
    showMEdit: false,
    mEditTitle: "",
    mLoadLine: false,
})

let proxy = null

const mgQueryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    filterField: null,
    filterValue: null,
    enabled: 'Y'
})

const mQueryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    filterField: null,
    filterValue: null,
    groupId: null,
    enabled: 'Y'
})

const selectstatusOptions = ref([])
const mgFilterFields = [
    { label: '设备组', value: 'NAME' },
    { label: '描述', value: 'DESCRIPTION' },
    { label: '工序名称', value: 'STATION_TYPE' },
    { label: '工序代号', value: 'STATION_TYPE_DESC' },
]
const mFilterFields = [
    { label: '设备编号', value: 'MACHINE_CODE' },
    { label: '设备描述', value: 'MACHINE_DESC' },
    { label: '设备地址', value: 'machine_loc' },
    { label: '设备类型', value: 'MACHINE_TYPE' },
    { label: '线别', value: 'LINE' },
    { label: '设备组', value: 'MACHINE_GROUP' },
    { label: '机器状态', value: 'MACHINE_STATUS' },
    // { label: '设备组ID', value: 'GROUP_ID' },
]

export const mgEditFormRules = {
    name: [{ required: true, message: '设备组不可为空', trigger: 'blur' }],
    description: [{ required: true, message: '描述不可为空', trigger: 'blur' }],
    stationType: [{ required: true, message: '未选择工序', trigger: 'blur' }],
}
export const mEditFormRules = {
    machineCode: [{ required: true, message: '设备编号不能为空', trigger: 'blur' }],
    // machineDesc: [{ required: true, message: '设备描述不能为空', trigger: 'blur' }],
    // machineloc: [{ required: true, message: '未选择/填写设备地址', trigger: 'blur' }],
    machineType: [{ required: true, message: '未选择设备类型', trigger: 'blur' }],
    line: [{ required: true, message: '未选择线别', trigger: 'blur' }],
}

function setProxy(p) {
    proxy = p
}

async function withLoadState(refBoolState, task) {
    refBoolState.value = true
    try {
        return await task()
    }
    finally {
        refBoolState.value = false
    }
}

function resetMgEditForm() {
    state.mgEditForm = {
        id: null,
        name: "",
        description: "",
        stationType: "",
    }
    proxy.resetForm('mgFormRef')
}

async function mgHandleQuery() {
    const r = await withLoadState(toRef(viewState, 'mgLoading'), async () => await mgApi.listMachineGroups(mgQueryParams))

    if (r.code != 200) return
    state.mgData = r.data.result
    state.mgDataTotal = r.data.totalNum
}

function mgSelectionChange(mg) {
    state.currentMg = mg
    mHandleQuery()
}

function mgResetQuery() {
    proxy.resetForm('mgQueryForm')
}

function mgHandleAdd() {
    resetMgEditForm()
    viewState.mgEditTitle = `新增设备组`
    viewState.showMgEdit = true
}

function mgHandleUpdate(row) {
    resetMgEditForm()

    const mg = row.id ? row : state.currentMg

    state.mgEditForm.id = mg.id
    state.mgEditForm.name = mg.name
    state.mgEditForm.description = mg.description
    state.mgEditForm.stationType = mg.stationType

    viewState.mgEditTitle = `修改 ${mg.name} 设备组`
    viewState.showMgEdit = true
}

async function mgHandleStatusChange(row) {
    const mg = row.id ? row : state.currentMg
    await withLoadState(toRef(viewState, 'mgLoading'), async () => await mgApi.switchStatus({
        id: mg.id,
        status: mg.enabled
    }))
}

function mgHandleExport() {
    proxy
        .$confirm('是否导出所有设备组数据项?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        })
        .then(async () => {
            await mgApi.exportPost(mgQueryParams)
        })
}

export function mgCancelEditForm() {
    resetMgEditForm()
    viewState.showMgEdit = false
}

export async function mgSubmitEditForm() {
    const form = proxy.$refs['mgFormRef']
    await form.validate()
    if (state.mgEditForm.id) {
        mgApi.updateMachineGroup(state.mgEditForm)
        proxy.$modal.msgSuccess(proxy.$t('mntnmachine.updateMgOk'))
    }
    else {
        await mgApi.addMachineGroup(state.mgEditForm)
        proxy.$modal.msgSuccess(proxy.$t('mntnmachine.addMgOk'))
    }

    mgHandleQuery()
    viewState.showMgEdit = false
}

function resetMEditForm() {
    state.mEditForm = {
        id: null,
        machineCode: "",
        machineDesc: "",
        machineloc: "",
        machineType: "",
        line: "",
        groupId: null,
        machineGroup: "",
    }
    proxy.resetForm('mFormRef')
}

export async function mHandleQuery() {
    if (state.currentMg) {
        mQueryParams.groupId = state.currentMg.id
    }
    else {
        mQueryParams.groupId = null
    }
    const r = await withLoadState(toRef(viewState, 'mLoading'), async () => await api.listMachines(mQueryParams))

    if (r.code != 200) return
    state.mData = r.data.result
    state.mDataTotal = r.data.totalNum
}

export function mSelectionChange(m) {
    state.currentMachine = m
}

export function mResetQuery() {
    proxy.resetForm('mQueryForm')

}

export function mHandleAdd() {
    resetMEditForm()

    const mg = state.currentMg

    state.mEditForm.groupId = mg.id
    state.mEditForm.machineGroup = mg.name

    viewState.mEditTitle = `新增设备`
    viewState.showMEdit = true
}

export function mHandleUpdate(row) {
    resetMEditForm()

    const m = row.id ? row : state.currentMachine

    state.mEditForm.id = m.id
    state.mEditForm.machineCode = m.machineCode
    state.mEditForm.machineDesc = m.machineDesc
    state.mEditForm.machineloc = m.machineloc
    state.mEditForm.machineType = m.machineType
    state.mEditForm.line = m.line
    state.mEditForm.groupId = m.groupId
    state.mEditForm.machineGroup = m.machineGroup

    viewState.mEditTitle = `修改 ${m.machineCode} 设备`
    viewState.showMEdit = true
}

export async function mHandleStatusChange(row) {
    const m = row.id ? row : state.currentMachine
    await withLoadState(toRef(viewState, 'mLoading'), async () => await api.switchStatus({
        id: m.id,
        status: m.enabled
    }))
}

export function mHandleExport() {
    proxy
        .$confirm('是否导出所有设备数据项?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        })
        .then(async () => {
            await api.exportPost(mQueryParams)
        })
}

export function mCancelEditForm() {
    resetMEditForm()
    viewState.showMEdit = false
}

export async function mSubmitEditForm() {
    const form = proxy.$refs['mFormRef']
    await form.validate()
    if (state.mEditForm.id) {
        await api.updateMachine(state.mEditForm)
        proxy.$modal.msgSuccess(proxy.$t('mntnmachine.updateMgOk'))
    }
    else {
        await api.addMachine(state.mEditForm)
        proxy.$modal.msgSuccess(proxy.$t('mntnmachine.addMgOk'))
    }

    mHandleQuery()
    viewState.showMEdit = false
}

export async function remoteLoadStationTypes(query) {
    const r = await withLoadState(toRef(viewState, 'mgLoadStationType'), async () => {
        return await stationtypelistget({
            parm: query
        })
    })

    if (r.code != 200) return
    state.stationTypes = r.data
}

export async function remoteLoadLines(query) {
    const r = await withLoadState(toRef(viewState, 'mLoadLine'), async () => {
        return await linelistget({
            parm: query
        })
    })

    if (r.code != 200) return
    state.lines = r.data
}

export async function initData() {
    state.machineTypes = (await listMachineTypes({
        enabled: "Y",
        pageNum: 1,
        pageSize: 999,
    })).data.result

    state.machinelocs = (await api.getAllMachineLocs()).data
}

export {
    state,
    viewState,
    selectstatusOptions,
    mgQueryParams,
    mQueryParams,
    mgFilterFields,
    mFilterFields,
    setProxy,
    mgHandleQuery,
    mgResetQuery,
    mgHandleAdd,
    mgHandleUpdate,
    mgHandleExport,
    mgHandleStatusChange,
    mgSelectionChange,
}