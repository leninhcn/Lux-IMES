import request from '@/utils/request'
import { downFile } from '@/utils/request'
const base = 'toolingmanagement/tooling'

export function listTools(query) {
    return request({
        url: `${base}/list`,
        method: 'get',
        params: query,
    })
}

export function listAllType(query) {
    return request({
        url: `${base}/listAllType`,
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

export function addTooling(query) {
    return request({
        url: `${base}/AddTooling`,
        method: 'post',
        data: query,
    })
}

export function updateTooling(query) {
    return request({
        url: `${base}/UpdateTooling`,
        method: 'put',
        data: query,
    })
}