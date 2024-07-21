import request from '@/utils/request'

import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取数据
export function getTableMainTainData(params) {
    return request({
        url: '/prodMnt/ProdMaintenance/MaintenanceList',
        method: 'get',
        params
    })
}

// 新增
export function addTableMainTainData(data) {
    return request({
        url: '/ProdMnt/ProdMaintenance/MaintenanceInsert',
        method: 'post',
        data
    })
}

// 获取 IPN
export function getTableMainTainIpnData(params) {
    return request({
        url: '/prodMnt/ProdMaintenance/Maintenancepart',
        method: 'get',
        params,
        cancelToken: new cancelToken(function executor(c) {
            cancel = c
        })
    })
}

// 取消获取 IPN 请求
export function axiosCancel() {
    cancel && cancel()
}
