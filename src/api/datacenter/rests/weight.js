import request from '@/utils/request'

// 获取数据
export function getLWeightData(params) {
  return request({
    url: '/prodMnt/StationPassQty/ShowData',
    method: 'get',
    params
  })
}

// 新增数据
export function addWeightData(data) {
  return request({
    url: '/prodMnt/StationPassQty/InsertWeightFai',
    method: 'put',
    data
  })
}

// 修改数据
export function editWeightData(data) {
  return request({
    url: '/prodMnt/StationPassQty/UpdateWeightFai',
    method: 'put',
    data
  })
}

// 修改状态
export function editWeightState(data) {
  return request({
    url: '/prodMnt/StationPassQty/UpdateWeightFaiState',
    method: 'put',
    data
  })
}

// 删除
export function delWeightData(data) {
  return request({
    url: '/prodMnt/StationPassQty/DeleteWeightFai',
    method: 'delete',
    data
  })
}

// 历史记录
export function getWeightHistory(params) {
  return request({
    url: '/prodMnt/StationPassQty/History',
    method: 'get',
    params
  })
}

// 检查料号
export function checkWeightIpn(params) {
  return request({
    url: '/prodMnt/StationPassQty/ExistIPN',
    method: 'get',
    params
  })
}
