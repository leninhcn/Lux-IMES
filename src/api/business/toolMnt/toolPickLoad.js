import request from '@/utils/request'
import { downFile } from '@/utils/request'
const base = 'toolingmanagement/toolingpickload'

export function toolingSnPickLoad(query) {
    return request({
        url: `${base}/ToolingSnPickLoad`,
        method: 'post',
        params: query,
    })
}

export function selectLine(query) {
    return request({
        url: `${base}/SelectLine`,
        method: 'get',
        params: query,
    })
}

export function selectEmpNo(query) {
    return request({
        url: `${base}/SelectEmpNo`,
        method: 'get',
        params: query,
    })
}