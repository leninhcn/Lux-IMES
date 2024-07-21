import request from '@/utils/request'
import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取数据
export function getSiteData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/ShowStationInfo',
    method: 'get',
    params
  })
}

// 新增数据
export function addSiteData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/InsertStationInfo',
    method: 'put',
    data
  })
}

// 修改数据
export function editSiteData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/UpdateStation',
    method: 'put',
    data
  })
}

// 复制数据
export function copySiteData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/CopyStationInfo',
    method: 'put',
    data
  })
}

// 删除数据
export function delSiteData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/DeleteStationByID',
    method: 'delete',
    data
  })
}

// 获取数据 LOG
export function getSiteLog(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/StationHistory',
    method: 'get',
    params
  })
}

// 获取站点类型数据
export function getSiteStationtype(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/ShowStationType',
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
