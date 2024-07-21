import request from '@/utils/request'

// 获取线别数据
export function getPlantLineData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/GetLine',
    method: 'get',
    params
  })
}

// 获取左边数据
export function getPlantLeftData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/GetStageStationtype',
    method: 'get',
    params
  })
}

// 获取右边数据
export function getPlantRightData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/GetLineStation',
    method: 'get',
    params
  })
}

// 新增数据
export function addPlantRightData(data) {
  return request({
    url: '/prodMnt/FactoryInformation/InsertStationInfo',
    method: 'put',
    data
  })
}

// 删除数据
export function delPlantRightData(data) {
  return request({
    url: '/prodMnt/FactoryInformation/DeleteStation',
    method: 'delete',
    data
  })
}
