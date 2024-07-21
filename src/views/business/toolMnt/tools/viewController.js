import * as api from "@/api/business/toolMnt/tools"
import * as snApi from "@/api/business/toolMnt/toolsn"
import { stationtypelistget } from "@/api/mescommon/mesget"

export const state = reactive({
    data: [],
    dataTotal: 0,
    currentTooling: null,
    editForm: null,

    stationTypes: [],
    toolingTypes: [],

    mData: [],
    mDataTotal: 0,
    currentToolingSn: null,
    mEditForm: null,
})

export const viewState = reactive({
    loading: false,
    showSearch: true,
    showEdit: false,
    editTitle: "",

    loadStationType: false,

    mLoading: false,
    showMSearch: true,
    showMEdit: false,
    mEditTitle: "",
    mLoadLine: false,
})

let proxy = null

export const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    filterField: null,
    filterValue: null,
    enabled: 'Y'
})

export const mQueryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    filterField: null,
    filterValue: null,
    toolingId: null,
    enabled: 'Y'
})

export const selectstatusOptions = ref([])
export const filterFields = [
    { label: 'toolingNo', value: 'TOOLING_NO' },
    { label: 'toolingType', value: 'TOOLING_TYPE' },
    { label: 'toolingDesc', value: 'TOOLING_DESC' },
    { label: 'location', value: 'LOCATION' },
    { label: 'job', value: 'JOB' },
    { label: 'maxUseTimes', value: 'MAX_USE_TIMES' },
    { label: 'warnUsedTimes', value: 'WARN_UESD_TIMES' },
    { label: 'maxUseDay', value: 'MAX_USE_DAY' },
    { label: 'warnUsedDay', value: 'WARN_USED_DAY' },
    { label: 'maxMaintainTimes', value: 'MAX_MAINTAIN_TIMES' },
    { label: 'maintainTime', value: 'MAINTAIN_TIME' },
    { label: 'cavityQty', value: 'CAVITY_QTY' },
    { label: 'line', value: 'LINE' },
    { label: 'stationType', value: 'STATION_TYPE' },
]

export const mFilterFields = [
    { label: 'toolingSn', value: 'TOOLING_SN' },
    { label: 'toolingSnDesc', value: 'TOOLING_SN_DESC' },
    { label: 'totalUsedCount', value: 'TOTAL_USED_COUNT' },
    { label: 'location', value: 'LOCATION' },
    { label: 'length', value: 'LENGTH' },
    { label: 'width', value: 'WIDTH' },
    { label: 'height', value: 'HEIGHT' },
    { label: 'face', value: 'FACE' },
    { label: 'viewcheck', value: 'VIEWCHECK' },
    { label: 'damageDegree', value: 'DAMAGE_DEGREE' },
    { label: 'cleanDegree', value: 'CLEAN_DEGREE' },
    { label: 'rough', value: 'ROUGH' },
    { label: 'scrape', value: 'SCRAPE' },
    { label: 'toolingStatus', value: 'TOOLING_STATUS1' },
    { label: 'updateEmpNo', value: 'UPDATE_EMPNO' },
    { label: 'createEmpNo', value: 'CREATE_EMPNO' },
]

export const EditFormRules = {
    toolingType: [{ required: true, message: '治具类型不可为空', trigger: 'blur' }],
    toolingNo: [{ required: true, message: '治具名称不可为空', trigger: 'blur' }],
    location: [{ required: true, message: '储位不可为空', trigger: 'blur' }],
}

export const mEditFormRules = {
    toolingSn: [{ required: true, message: '治具编码不可为空', trigger: 'blur' }],
}

export function setProxy(p) {
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

function resetEditForm() {
    state.editForm = {
        id: null,
        toolingType: "",
        toolingNo: "",
        toolingDesc: "",
        location: "",
        job: "",
        maxUseTimes: 9999,
        warnUsedTimes: 999,
        maxUseDay: 365,
        warnUsedDay: 180,
        maxMaintainTimes: 99,
        maintainTime: 99,
        cavityQty: 1,
        stationType: "",
    }
    proxy.resetForm('EditForm')
}

export async function handleQuery() {
    const r = await withLoadState(toRef(viewState, 'loading'), async () => await api.listTools(queryParams))

    if (r.code != 200) return
    state.data = r.data.result
    state.dataTotal = r.data.totalNum
}

export function selectionChange(tool) {
    state.currentTooling = tool
    mHandleQuery()
}

export function resetQuery() {
    proxy.resetForm('QueryForm')
}

export function handleAdd() {
    resetEditForm()
    viewState.editTitle = `新增治具`
    viewState.showEdit = true
}

export function handleUpdate(row) {
    resetEditForm()

    const t = row.id ? row : state.currentTooling

    state.editForm.id = t.id
    state.editForm.toolingNo = t.toolingNo
    state.editForm.toolingType = t.toolingType
    state.editForm.toolingDesc = t.toolingDesc
    state.editForm.location = t.location
    state.editForm.job = t.job
    state.editForm.maxUseTimes = t.maxUseTimes
    state.editForm.warnUsedTimes = t.warnUsedTimes
    state.editForm.maxUseDay = t.maxUseDay
    state.editForm.warnUsedDay = t.warnUsedDay
    state.editForm.maxMaintainTimes = t.maxMaintainTimes
    state.editForm.maintainTime = t.maintainTime
    state.editForm.cavityQty = t.cavityQty
    state.editForm.stationType = t.stationType

    viewState.editTitle = `修改 ${t.toolingNo} 治具`
    viewState.showEdit = true
}

export async function handleStatusChange(row) {
    const mt = row.id ? row : state.currentMType
    await withLoadState(toRef(viewState, 'loading'), async () => await api.switchStatus({
        id: mt.id,
        status: mt.enabled
    }))
}

export function handleExport() {
    proxy
        .$confirm('是否导出所有治具数据项?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
        })
        .then(async () => {
            await api.exportPost(queryParams)
        })
}

export function cancelEditForm() {
    resetEditForm()
    viewState.showEdit = false
}

export async function submitEditForm() {
    const form = proxy.$refs['EditForm']
    await form.validate()
    if (state.editForm.id) {
        api.updateTooling(state.editForm)
        proxy.$modal.msgSuccess(proxy.$t('mntntools.updateOk'))
    }
    else {
        await api.addTooling(state.editForm)
        proxy.$modal.msgSuccess(proxy.$t('mntntools.addOk'))
    }

    handleQuery()
    viewState.showEdit = false
}

//治具sn逻辑
function resetMEditForm() {
    state.mEditForm = {
        toolingSnId: null,
        toolingId: null,
        toolingType: "",
        toolingNo: "",
        toolingSn: "",
        toolingSnDesc: "",
        location: "",
        totalUsedCount: NaN,
        length: null,
        width: null,
        height: null,
        face: "",
        viewcheck: "",
        damageDegree: "",
        cleanDegree: "",
        rough: "",
        scrape: "",
        toolingStatus: "N/A",
        viewcheck: "",
    }
    proxy.resetForm('mFormRef')
}

export async function mHandleQuery() {
    if (state.currentTooling) {
        mQueryParams.toolingId = state.currentTooling.id
    }
    else {
        mQueryParams.toolingId = null
    }
    const r = await withLoadState(toRef(viewState, 'mLoading'), async () => await snApi.listToolSn(mQueryParams))

    if (r.code != 200) return
    state.mData = r.data.result
    state.mDataTotal = r.data.totalNum
}

export function mSelectionChange(m) {
    state.currentToolingSn = m
}

export function mResetQuery() {
    proxy.resetForm('mQueryForm')

}

export function mHandleAdd() {
    resetMEditForm()

    const t = state.currentTooling

    state.mEditForm.toolingId = t.id
    state.mEditForm.toolingNo = t.toolingNo
    state.mEditForm.toolingType = t.toolingType

    viewState.mEditTitle = `新增治具sn`
    viewState.showMEdit = true
}

export function mHandleUpdate(row) {
    resetMEditForm()

    const sn = row.id ? row : state.currentToolingSn
    const t = state.currentTooling

    state.mEditForm.toolingId = t.id
    state.mEditForm.toolingNo = t.toolingNo
    state.mEditForm.toolingType = t.toolingType

    state.mEditForm.toolingSnId = sn.toolingSnId
    state.mEditForm.toolingSn = sn.toolingSn
    state.mEditForm.toolingSnDesc = sn.toolingSnDesc
    state.mEditForm.totalUsedCount = sn.totalUsedCount
    state.mEditForm.length = sn.length
    state.mEditForm.width = sn.width
    state.mEditForm.height = sn.height
    state.mEditForm.face = sn.face
    state.mEditForm.viewcheck = sn.viewcheck
    state.mEditForm.damageDegree = sn.damageDegree
    state.mEditForm.cleanDegree = sn.cleanDegree
    state.mEditForm.rough = sn.rough
    state.mEditForm.scrape = sn.scrape
    state.mEditForm.toolingStatus = sn.toolingStatus

    viewState.mEditTitle = `修改 ${sn.toolingSn} 治具sn`
    viewState.showMEdit = true
}

export async function mHandleStatusChange(row) {
    const m = row.id ? row : state.currentToolingSn
    await withLoadState(toRef(viewState, 'mLoading'), async () => await api.switchStatus({
        id: m.id,
        status: m.enabled
    }))
}

export function mHandleExport() {
    proxy
        .$confirm('是否导出所有治具sn数据项?', '提示', {
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
    if (state.mEditForm.toolingSnId) {
        await snApi.updateToolingSn(state.mEditForm)
        proxy.$modal.msgSuccess(proxy.$t('mntntools.updateSnOk'))
    }
    else {
        if (!state.mEditForm.totalUsedCount)
            state.mEditForm.totalUsedCount = 0
        if (state.mEditForm.toolingStatus === 'N/A')
            state.mEditForm.toolingStatus = 'I'
        await snApi.addToolingSn(state.mEditForm)
        proxy.$modal.msgSuccess(proxy.$t('mntntools.addSnOk'))
    }

    mHandleQuery()
    viewState.showMEdit = false
}

export async function remoteLoadStationTypes(query) {
    const r = await withLoadState(toRef(viewState, 'loadStationType'), async () => {
        return await stationtypelistget({
            parm: query
        })
    })

    if (r.code != 200) return
    state.stationTypes = r.data
}

export async function initData() {
    state.toolingTypes = (await api.listAllType()).data
}