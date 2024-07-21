import request from '@/utils/request'
import { downFile } from '@/utils/request'
const base = 'machinemanagement/machinetype'

export function listMachineTypes(query) {
    return request({
        url: `${base}/list`,
        method: 'get',
        params: query,
    })
}

export async function exportPost(query) {
    await downFile(`${base}/export`, query)
}

export function switchStatus(query) {
    return request({
        url: `${base}/SwitchStatus`,
        method: 'get',
        params: query,
    })
}

export function addMachineType(query) {
    return request({
        url: `${base}/AddMachineType`,
        method: 'post',
        data: query,
    })
}

export function updateMachineType(query) {
    return request({
        url: `${base}/UpdateMachineType`,
        method: 'put',
        data: query,
    })
}