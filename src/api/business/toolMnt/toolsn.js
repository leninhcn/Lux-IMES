import request from '@/utils/request'
import { downFile } from '@/utils/request'
const base = 'toolingmanagement/toolingsn'

export function listToolSn(query) {
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

export function addToolingSn(query) {
    return request({
        url: `${base}/AddToolingSn`,
        method: 'post',
        data: query,
    })
}

export function updateToolingSn(query) {
    return request({
        url: `${base}/UpdateToolingSn`,
        method: 'put',
        data: query,
    })
}