import request from '@/utils/request'
import { downFile } from '@/utils/request'
const base = 'toolingmanagement/toolingmaintain'

export function toolingMaintain(query) {
    return request({
        url: `${base}/ToolingMaintain`,
        method: 'post',
        data: query,
    })
}

export function selectEmpByNo(query) {
    return request({
        url: `${base}/SelectEmpByNo`,
        method: 'get',
        params: query,
    })
}

export function checkToolingSn(query) {
    return request({
        url: `${base}/CheckToolingSn`,
        method: 'get',
        params: query,
    })
}