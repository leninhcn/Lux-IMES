import request from '@/utils/request'

// 获取数据
export function getFactoryData(params) {
  return request({
    url: '/prodMnt/FactoryInformation/ShowSiteInfo',
    method: 'get',
    params
  })
}

// 新增数据
export function addFactoryData(data) {
  return request({
    url: '/prodMnt/FactoryInformation/InsertSiteInfo',
    method: 'put',
    data
  })
}

// 修改数据
export function editFactoryData(data) {
  return request({
    url: '/prodMnt/FactoryInformation/UpdateSite',
    method: 'put',
    data
  })
}

// 删除数据
export function delFactoryData(data) {
  return request({
    url: '/prodMnt/FactoryInformation/DeleteSiteByID',
    method: 'delete',
    data
  })
}

// 获取 LOG 数据
export function getFactoryLog(params) {
  return request({
    url: '/prodMnt/FactoryInformation/SiteHistory',
    method: 'get',
    params
  })
}
