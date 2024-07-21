import request from '@/utils/request'

// 获取线别数据
export function getLineData(params) {
  return request({
    url: '/prodMnt/StationPassQty/GetLineInfo',
    method: 'get',
    params
  })
}

// 获取站点类型数据
export function getSiteData(params) {
  return request({
    url: '/prodMnt/StationPassQty/GetStationTypeInfo',
    method: 'get',
    params
  })
}

// 获取工作站数据
export function geWorkstationData(params) {
  return request({
    url: '/prodMnt/StationPassQty/GetStationNameInfo',
    method: 'get',
    params
  })
}

// 获取数据
export function getData(params) {
  return request({
    url: '/prodMnt/StationPassQty/GetStationInfo',
    method: 'get',
    params
  })
}

// 修改数据
export function editData(data) {
  return request({
    url: '/prodMnt/StationPassQty/UpdateStationInfo',
    method: 'put',
    data
  })
}
