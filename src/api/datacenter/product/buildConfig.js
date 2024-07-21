import request from '@/utils/request'
// 获取数据
export function getBuildConfigData(params) {
  return request({
    url: '/datacenter/BuildConfig/MBuildConfigList',
    method: 'get',
    params
  })
}

// 新增数据
export function addBuildConfigData(data) {
  return request({
    url: '/datacenter/BuildConfig/MBuildConfigInsert',
    method: 'put',
    data
  })
}

// 修改数据
export function editBuildConfigData(data) {
  return request({
    url: '/datacenter/BuildConfig/MBuildConfigUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delBuildConfigData(data) {
  return request({
    url: '/datacenter/BuildConfig/MBuildConfigDelete',
    method: 'delete',
    data
  })
}

// 获取 LOG 数据
export function getBuildConfigLog(params) {
  return request({
    url: '/datacenter/BuildConfig/MBuildConfigListHt',
    method: 'get',
    params
  })
}

// 获取机种
export function getModelData(params) {
    return request({
      url: '/datacenter/BuildConfig/Modellist',
      method: 'get',
      params
    })
}
  

// 获取颜色
export function getColorData(params) {
    return request({
      url: '/datacenter/BuildConfig/Colorlist',
      method: 'get',
      params
    })
}

// 获取颜色
export function getColorDataInfo(params) {
  return request({
    url: '/datacenter/BuildConfig/ColorlistData',
    method: 'get',
    params
  })
}
