import request from '@/utils/request'

// 获取数据
export function getSiteMaterialsData(params) {
  return request({
    url: '/prodMnt/prodModel/Stationlist',
    method: 'get',
    params
  })
}

// 新增
export function addSiteMaterialsData(data) {
  return request({
    url: '/prodMnt/prodModel/StationInsert',
    method: 'post',
    data
  })
}

// 修改
export function editSiteMaterialsData(data) {
  return request({
    url: '/prodMnt/prodModel/StationtUpdate',
    method: 'put',
    data
  })
}

// 删除
export function delSiteMaterialsData(data) {
  return request({
    url: '/prodMnt/prodModel/StationDelete',
    method: 'delete',
    data
  })
}

// 获取 log
export function getSiteMaterialsLog(params) {
  return request({
    url: '/prodMnt/prodModel/StationtlistHt',
    method: 'get',
    params
  })
}

// 修改时获取工段
export function getSiteMaterialsEditStageData(params) {
  return request({
    url: '/prodMnt/prodModel/StationtlistStage',
    method: 'get',
    params
  })
}

// 获取工段
export function getSiteMaterialsStageData(params) {
  return request({
    url: '/prodMnt/prodModel/StationStagelist',
    method: 'get',
    params
  })
}

// 获取站点类型
export function getSiteMaterialsTypeData(params) {
  return request({
    url: '/prodMnt/prodModel/StationTypelist',
    method: 'get',
    params
  })
}

// 获取机种
export function getSiteMaterialsModelData(params) {
  return request({
    url: '/prodMnt/prodModel/StationModellist',
    method: 'get',
    params
  })
}

// 获取品名
export function getSiteMaterialsMesData(params) {
  return request({
    url: '/prodMnt/prodModel/StationBrandlist',
    method: 'get',
    params
  })
}
