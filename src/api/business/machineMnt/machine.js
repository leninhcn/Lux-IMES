import request from '@/utils/request'
import { downFile } from '@/utils/request'

const base = 'machinemanagement/machine'

export function listMachines(query) {
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

export function getAllMachineLocs() {
    return request({
        url: `${base}/GetAllMachineLocs`,
        method: 'get',
    })
}

export async function exportPost(query) {
    await downFile(`${base}/export`, query)
}

export function addMachine(query) {
    return request({
        url: `${base}/AddMachine`,
        method: 'post',
        data: query,
    })
}

export function updateMachine(query) {
    return request({
        url: `${base}/UpdateMachine`,
        method: 'put',
        data: query,
    })
}