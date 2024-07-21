import request from '@/utils/request'

import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取数据
export function getModelData(params) {
  return request({
    url: '/prodMnt/ProdSamplingPlan/SamplingList',
    method: 'get',
    params
  })
}

// 新增数据
export function addModelData(data) {
  return request({
    url: '/prodMnt/ProdSamplingPlan/SamplingInsert',
    method: 'put',
    data
  })
}

// 启用禁用
export function editDescriptionData(data) {
  return request({
    url: '/prodMnt/ProdSamplingPlan/Samplingabled',
    method: 'put',
    data
  })
}

// 修改数据
export function editModelData(data) {
  return request({
    url: '/prodMnt/ProdSamplingPlan/SamplingUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delModelData(data) {
  return request({
    url: 'prodMnt/ProdSamplingPlan/SamplingDelete',
    method: 'put',
    data
  })
}

// 弹窗接口
// 获取数据
export function getModelDataDialog(params) {
  return request({
    url: '/prodMnt/ProdSamplingPlan/SamplingDetaitList',
    method: 'get',
    params
  })
}

// 新增数据
export function addModelDataDialog(data) {
  return request({
    url: '/prodMnt/ProdSamplingPlan/SamplingDefaultInsert',
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
    url: '/prodMnt/ProdSamplingPlan/SamplingDefaultUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delModelDataDialog(data) {
  return request({
    url: 'prodMnt/ProdSamplingPlan/SamplingDefaultDelete',
    method: 'put',
    data
  })
}
