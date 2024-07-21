import * as api from "@/api/business/toolMnt/toolType"

export const state = reactive({
    data: [],
    dataTotal: 0,
    currentMType: null,
    editForm: null,
})

export const viewState = reactive({
    loading: false,
    showSearch: true,
    showEdit: false,
    editTitle: "",
})

let proxy = null

export const queryParams = reactive({
    pageNum: 1,
    pageSize: 10,
    filterField: null,
    filterValue: null,
    enabled: 'Y'
})

export const selectstatusOptions = ref([])
export const filterFields = [
    { label: '设备类型', value: 'TOOLING_TYPE' },
    { label: '设备描述', value: 'TOOLING_TYPE_DESC' },
    { label: '储位数量', value: 'LOCATION_QTY' },
    { label: 'OPTIONS', value: 'OPTIONS' },
    { label: '更新人员', value: 'UPDATE_EMPNO' },
    { label: '创建人员', value: 'CREATE_EMPNO' },
]

export const EditFormRules = {
    toolingType: [{ required: true, message: '治具类型不可为空', trigger: 'blur' }],
    toolingTypeDesc: [{ required: true, message: '治具描述不可为空', trigger: 'blur' }],
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
        toolingTypeDesc: "",
        locationQty: 1,
        options: "",
    }
    proxy.resetForm('EditForm')
}

export async function handleQuery() {
    const r = await withLoadState(toRef(viewState, 'loading'), async () => await api.listToolTypes(queryParams))

    if (r.code != 200) return
    state.data = r.data.result
    state.dataTotal = r.data.totalNum
}

export function selectionChange(tool) {
    state.currentMType = tool
}

export function resetQuery() {
    proxy.resetForm('QueryForm')
}

export function handleAdd() {
    resetEditForm()
    viewState.editTitle = `新增治具类型`
    viewState.showEdit = true
}

export function handleUpdate(row) {
    resetEditForm()

    const tool = row.id ? row : state.currentMType

    state.editForm.id = tool.id
    state.editForm.toolingType = tool.toolingType
    state.editForm.toolingTypeDesc = tool.toolingTypeDesc
    state.editForm.locationQty = tool.locationQty
    state.editForm.options = tool.options

    viewState.editTitle = `修改 ${tool.toolingType} 治具类型`
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
        .$confirm('是否导出所有治具类型数据项?', '提示', {
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
        api.updateToolingType(state.editForm)
        proxy.$modal.msgSuccess(proxy.$t('mntntooltype.updateOk'))
    }
    else {
        await api.addToolingType(state.editForm)
        proxy.$modal.msgSuccess(proxy.$t('mntntooltype.addOk'))
    }

    handleQuery()
    viewState.showEdit = false
}

export async function initData() {

}