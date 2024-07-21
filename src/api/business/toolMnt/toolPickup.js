import request from '@/utils/request'
import { downFile } from '@/utils/request'
const base = 'toolingmanagement/toolingpickup'

export function pickUpToolingSn(query) {
    return request({
        url: `${base}/PickUpToolingSn`,
        method: 'post',
        params: query,
    })
}

export function returnToolingSn(query) {
    return request({
        url: `${base}/ReturnToolingSn`,
        method: 'post',
        params: query,
    })
}

export function selectEmpByNo(query) {
    return request({
        url: `${base}/SelectEmpByNo`,
        method: 'get',
        params: query,
    })
}

export function getToolingInfo(query) {
    return request({
        url: `${base}/GetToolingInfo`,
        method: 'get',
        params: query,
    })
}