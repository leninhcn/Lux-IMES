import * as api from "@/api/business/machineMnt/machineType"

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
    { label: '设备类型', value: 'MACHINE_TYPE_NAME' },
    { label: '设备描述', value: 'MACHINE_TYPE_DESC' },
    { label: '更新人员', value: 'UPDATE_EMPNO' },
]

export const EditFormRules = {
    machineTypeName: [{ required: true, message: '设备类型不可为空', trigger: 'blur' }],
    machineTypeDesc: [{ required: true, message: '描述不可为空', trigger: 'blur' }],
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
        machineTypeName: "",
        machineTypeDesc: "",
    }
    proxy.resetForm('EditForm')
}

export async function handleQuery() {
    const r = await withLoadState(toRef(viewState, 'loading'), async () => await api.listMachineTypes(queryParams))

    if (r.code != 200) return
    state.data = r.data.result
    state.dataTotal = r.data.totalNum
}

export function selectionChange(mt) {
    state.currentMType = mt
}

export function resetQuery() {
    proxy.resetForm('QueryForm')
}

export function handleAdd() {
    resetEditForm()
    viewState.editTitle = `新增设备类型`
    viewState.showEdit = true
}

export function handleUpdate(row) {
    resetEditForm()

    const mt = row.id ? row : state.currentMType

    state.editForm.id = mt.id
    state.editForm.machineTypeName = mt.machineTypeName
    state.editForm.machineTypeDesc = mt.machineTypeDesc

    viewState.editTitle = `修改 ${mt.machineTypeName} 设备类型`
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
        .$confirm('是否导出所有设备类型数据项?', '提示', {
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
        api.updateMachineType(state.editForm)
        proxy.$modal.msgSuccess(proxy.$t('mntnmachinetype.updateOk'))
    }
    else {
        await api.addMachineType(state.editForm)
        proxy.$modal.msgSuccess(proxy.$t('mntnmachinetype.addOk'))
    }

    handleQuery()
    viewState.showEdit = false
}

export async function initData() {

}