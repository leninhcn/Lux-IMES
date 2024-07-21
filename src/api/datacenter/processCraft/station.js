import request from '@/utils/request'

// 获取区段数据
export function getStageData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/ShowStageInfo',
    method: 'get',
    params
  })
}

// 新增区段数据
export function addStageData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/InsertStageInfo',
    method: 'put',
    data
  })
}

// 修改区段数据
export function editStageData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/UpdateStage',
    method: 'put',
    data
  })
}

// 删除区段数据
export function delStageData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/DeleteStageByID',
    method: 'delete',
    data
  })
}

// 获取区段 LOG
export function getStageLog(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/StageHistory',
    method: 'get',
    params
  })
}

// 获取站点数据
export function getStationData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/ShowStationTypeInfo',
    method: 'get',
    params
  })
}

// 新增站点数据
export function addStationData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/InsertStationTypeInfo',
    method: 'put',
    data
  })
}

// 修改站点数据
export function editStationData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/UpdateStationType',
    method: 'put',
    data
  })
}

// 删除站点数据
export function delStationData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/DeleteStationTypeByID',
    method: 'delete',
    data
  })
}

// 获取站点 LOG
export function getStationLog(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/StationTypeHistory',
    method: 'get',
    params
  })
}

// 获取站点操作类型数据
export function getStationOperateTypeData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/GetStationType',
    method: 'get',
    params
  })
}

// 获取站点客户端类型数据
export function getStationClientTypeData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/GetClientType',
    method: 'get',
    params
  })
}
