import request from '@/utils/request'
// 获取机种数据
export function getModelData(params) {
    return request({
      url: '/datacenter/imset/Modellist',
      method: 'get',
      params
    })
}

// 获取线别数据
export function getLineData(params) {
    return request({
      url: '/datacenter/imset/Linelist',
      method: 'get',
      params
    })
}


// 获取区段数据
export function getStageData(params) {
  return request({
    url: '/datacenter/imset/Stagelist',
    method: 'get',
    params
  })
}

// 获取站点数据
export function getStationData(params) {
    return request({
      url: '/datacenter/imset/Stationlist',
      method: 'get',
      params
    })
}


// 获取产品版本数据
export function getBuildData(params) {
    return request({
      url: '/datacenter/imset/Buildlist',
      method: 'get',
      params
    })
}

// 获取塑胶粒子批次数据
export function getSJVendorData(params) {
    return request({
      url: '/datacenter/imset/SJVendorlist',
      method: 'get',
      params
    })
}


// 获取上机/下机关联数据
export function getImsetDataSJ(params) {
    return request({
      url: '/datacenter/imset/MImSetListSJ',
      method: 'get',
      params
    })
}

// 获取上机/下机关联数据
export function getImsetDataXJ(params) {
    return request({
      url: '/datacenter/imset/MImSetListXJ',
      method: 'get',
      params
    })
}

// 新增上机/下机关联数据
export function addImsetData(data) {
  return request({
    url: '/datacenter/imset/MImSetInsert',
    method: 'put',
    data
  })
}

// 修改上机/下机关联数据
export function editImsetData(data) {
  return request({
    url: '/datacenter/imset/MImSetUpdate',
    method: 'put',
    data
  })
}

// 删除上机/下机关联数据
export function delImsetData(data) {
  return request({
    url: '/datacenter/imset/MImSetDelete',
    method: 'delete',
    data
  })
}

// 获取上机/下机关联LOG
export function getImsetLog(params) {
  return request({
    url: '/datacenter/imset/MImSetListHt',
    method: 'get',
    params
  })
}