import request from '@/utils/request'
// 获取数据
export function getBuildColorData(params) {
  return request({
    url: '/MntnBuildColor/MntnBuildColorController/MBuildColorList',
    method: 'get',
    params
  })
}

// 新增数据
export function addBuildColorData(data) {
  return request({
    url: '/MntnBuildColor/MntnBuildColorController/MBuildColorInsert',
    method: 'put',
    data
  })
}

// 修改数据
export function editBuildColorData(data) {
  return request({
    url: '/MntnBuildColor/MntnBuildColorController/MBuildColorUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delBuildColorData(data) {
  return request({
    url: '/MntnBuildColor/MntnBuildColorController/MBuildColorDelete',
    method: 'delete',
    data
  })
}

// 获取 LOG 数据
export function getBuildColorLog(params) {
  return request({
    url: '/MntnBuildColor/MntnBuildColorController/MBuildColorListHt',
    method: 'get',
    params
  })
}

// 获取机种
export function getSiteMaterialsModelData(params) {
    return request({
      url: '/MntnBuildColor/MntnBuildColorController/Modellist',
      method: 'get',
      params
    })
  }
  
