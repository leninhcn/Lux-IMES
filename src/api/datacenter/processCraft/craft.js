import request from '@/utils/request'

// 获取工艺流程列表
export function getCraftRouteNameData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/GetRouteName',
    method: 'get',
    params
  })
}

// 获取左边数据
export function getCraftLeftData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/GetStationTypeInfo',
    method: 'get',
    params
  })
}

// 获取右边数据
export function getCraftRightData(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/GetRouteDetail',
    method: 'get',
    params
  })
}

// WIP 检测
export function checkCraftWip(params) {
  return request({
    url: '/prodMnt/ProcessTechnology/CheckRouteWIP',
    method: 'get',
    params
  })
}

// 保存数据
export function saveCraftData(data) {
  return request({
    url: '/prodMnt/ProcessTechnology/CheckRouteName',
    method: 'post',
    data
  })
}
