import request from '@/utils/request'
import { downFile } from '@/utils/request'
const base = 'toolingmanagement/toolingtype'

export function listToolTypes(query) {
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

export function addToolingType(query) {
    return request({
        url: `${base}/AddToolingType`,
        method: 'post',
        data: query,
    })
}

export function updateToolingType(query) {
    return request({
        url: `${base}/UpdateToolingType`,
        method: 'put',
        data: query,
    })
}