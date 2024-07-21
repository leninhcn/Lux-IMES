import request from '@/utils/request'
// 获取数据
export function getCategoryInfoData(params) {
  return request({
    url: '/datacenter/CategoryInfo/MCategoryInfoList',
    method: 'get',
    params
  })
}

// 新增数据
export function addCategoryInfoData(data) {
  return request({
    url: '/datacenter/CategoryInfo/MCategoryInfoInsert',
    method: 'put',
    data
  })
}

// 修改数据
export function editCategoryInfoData(data) {
  return request({
    url: '/datacenter/CategoryInfo/MCategoryInfoUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delCategoryInfoData(data) {
  return request({
    url: '/datacenter/CategoryInfo/MCategoryInfoDelete',
    method: 'delete',
    data
  })
}

// 获取 LOG 数据
export function getCategoryInfoLog(params) {
  return request({
    url: '/datacenter/CategoryInfo/MCategoryInfoListHt',
    method: 'get',
    params
  })
}

// 获取机种
export function getModelData(params) {
    return request({
      url: '/datacenter/CategoryInfo/Modellist',
      method: 'get',
      params
    })
}
  
// 获取部门
export function getDeptData(params) {
    return request({
      url: '/datacenter/CategoryInfo/Deptlist',
      method: 'get',
      params
    })
}
