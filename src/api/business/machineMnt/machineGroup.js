import request from '@/utils/request'
import { downFile } from '@/utils/request'

const base = 'machinemanagement/machinegroup'

export function listMachineGroups(query) {
    return request({
        url: `${base}/list`,
        method: 'get',
        params: query,
    })
}

export function switchStatus(query) {
    return request({
        url: `${base}/SwitchStatus`,
        method: 'get',
        params: query,
    })
}

export async function exportPost(query) {
    await downFile(`${base}/export`, query)
}

export function addMachineGroup(query) {
    return request({
        url: `${base}/AddMachineGroup`,
        method: 'post',
        data: query,
    })
}

export function updateMachineGroup(query) {
    return request({
        url: `${base}/UpdateMachineGroup`,
        method: 'put',
        data: query,
    })
}