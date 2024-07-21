import request from '@/utils/request'

import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取数据
export function getModelData(params) {
    return request({
        url: '/ProdMnt/ProdSamplingRule/SamplingRuleList',
        method: 'get',
        params
    })
}

// 新增数据
export function addModelData(data) {
    return request({
        url: '/ProdMnt/ProdSamplingRule/SamplingRuleInsert',
        method: 'put',
        data
    })
}

// 预设
export function editDescriptionData(data) {
    return request({
        url: `/ProdMnt/ProdSamplingRule/SamplingRulePreset?samplingRuleid=${data}`,
        method: 'get',

    })
}

// 修改数据
export function editModelData(data) {
    return request({
        url: '/ProdMnt/ProdSamplingRule/SamplingRuleUpdate',
        method: 'put',
        data
    })
}

// 禁用
export function ablModelData(data) {
    return request({
        url: 'ProdMnt/ProdSamplingRule/SamplingRuleabled',
        method: 'put',
        data
    })
}

// 删除
export function delModelData(data) {
    return request({
        url: 'ProdMnt/ProdSamplingRule/SamplingRuleDelete',
        method: 'put',
        data
    })
}

// 弹窗接口
// 获取数据
export function getModelDataDialog(params) {
    return request({
        url: '/ProdMnt/ProdSamplingRule/SamplingDetaitList',
        method: 'get',
        params
    })
}

// 新增数据
export function addModelDataDialog(data) {
    return request({
        url: '/ProdMnt/ProdSamplingRule/RuleDefaultInsert',
        method: 'put',
        data
    })
}

// 启用禁用
export function editDescriptionDataDialog(data) {
    return request({
        url: '/prodMnt/ProdSamplingPlan/Samplingabled',
        method: 'put',
        data
    })
}

// 修改数据
export function editModelDataDialog(data) {
    return request({
        url: '/ProdMnt/ProdSamplingRule/RuleDefaultUpdate',
        method: 'put',
        data
    })
}

// 删除数据
export function delModelDataDialog(data) {
    return request({
        url: 'ProdMnt/ProdSamplingRule/RuleDefaultDelete',
        method: 'delete',
        data
    })
}
