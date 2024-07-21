import request from '@/utils/request'
import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取数据
export function getPartCodeData(params) {
  return request({
    url: '/prodMnt/MntnMaterials/Materialsllist',
    method: 'get',
    params
  })
}

// 新增数据
export function addPartCodeData(data) {
  return request({
    url: '/prodMnt/MntnMaterials/MaterialInsert',
    method: 'post',
    data
  })
}

// 修改数据
export function editPartCodeData(data) {
  return request({
    url: '/prodMnt/MntnMaterials/MaterialsUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delPartCodeData(data) {
  return request({
    url: '/prodMnt/MntnMaterials/MaterialsDelet',
    method: 'delete',
    data
  })
}

// 获取 log
export function getPartCodeLog(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MaterialsllistHt',
    method: 'get',
    params
  })
}

// 获取 IPN
export function getPartCodeIpnData(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MaterialslIpnlist',
    method: 'get',
    params,
    cancelToken: new cancelToken(function executor(c) {
      cancel = c
    })
  })
}

// 取消获取 IPN 请求
export function axiosCancel() {
  cancel()
}

// 获取品名
export function getPartCodeMesData(params) {
  return request({
    url: '/prodMnt/MntnMaterials/MaterialslDescriptionlist',
    method: 'get',
    params
  })
}
