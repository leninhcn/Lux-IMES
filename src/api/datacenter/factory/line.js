import request from '@/utils/request'

// 获取数据
export function getLineData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/ShowLineInfo',
    method: 'get',
    params
  })
}

// 新增数据
export function addLineData(data) {
  return request({
    url: '/prodMnt/FactoryInformation/InsertLineInfo',
    method: 'put',
    data
  })
}

// 修改数据
export function editLineData(data) {
  return request({
    url: '/prodMnt/FactoryInformation/UpdateLine',
    method: 'put',
    data
  })
}

// 删除数据
export function delLineData(data) {
  return request({
    url: '/prodMnt/FactoryInformation/DeleteLineByID',
    method: 'delete',
    data
  })
}

// 获取 LOG 数据
export function getLineLog(params) {
  return request({
    url: '/prodMnt/FactoryInformation/LineHistory',
    method: 'get',
    params
  })
}

// 获取厂区数据
export function getLineFactoryData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/GetSiteCode',
    method: 'get',
    params
  })
}

// 获取线别类型数据
export function getLineTypeData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/GetLineType',
    method: 'get',
    params
  })
}

// 获取线别等级数据
export function getLineLevelData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/GetLineLevel',
    method: 'get',
    params
  })
}

// 获取工作中心数据
export function getLineWrokCenterData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/GetWorkCenter',
    method: 'get',
    params
  })
}
