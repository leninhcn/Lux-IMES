import request from '@/utils/request'

import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取数据
export function getPartCraftData(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartRoutelist',
    method: 'get',
    params
  })
}

// 新增数据
export function addPartCraftData(data) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartRouteInsert',
    method: 'post',
    data
  })
}

// 修改数据
export function editPartCraftData(data) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartRouteUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delPartCraftData(data) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartRouteDelet',
    method: 'delete',
    data
  })
}

// 获取历史记录
export function getPartCraftLog(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartRoutelistHt',
    method: 'get',
    params
  })
}

// 获取 IPN
export function getPartCraftIpnData(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartRouteIpnlist',
    method: 'get',
    params,
    cancelToken: new cancelToken(function executor(c) {
      cancel = c
    })
  })
}

// 获取工艺流程
export function getPartCraftRouteNameData(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartRouteRoadNamelist',
    method: 'get',
    params,
    cancelToken: new cancelToken(function executor(c) {
      cancel = c
    })
  })
}

// 获取包规
export function getPartCraftPackSpecData(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartPkspecNamelist',
    method: 'get',
    params,
    cancelToken: new cancelToken(function executor(c) {
      cancel = c
    })
  })
}

// 获取规则组合
export function getPartCraftRuleSetNameData(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MntnPartRuleSetNameRulelist',
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
