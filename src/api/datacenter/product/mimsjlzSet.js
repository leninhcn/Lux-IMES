import request from '@/utils/request'
// 获取数据
export function getImsjlzSetData(params) {
  return request({
    url: '/datacenter/ImsjlzSet/MImsjlzSetList',
    method: 'get',
    params
  })
}

// 新增数据
export function addImsjlzSetData(data) {
  return request({
    url: '/datacenter/ImsjlzSet/MImsjlzSetInsert',
    method: 'put',
    data
  })
}

// 修改数据
export function editImsjlzSetData(data) {
  return request({
    url: '/datacenter/ImsjlzSet/MImsjlzSetUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delImsjlzSetData(data) {
  return request({
    url: '/datacenter/ImsjlzSet/MImsjlzSetDelete',
    method: 'delete',
    data
  })
}

// 获取 LOG 数据
export function getImsjlzSetLog(params) {
  return request({
    url: '/datacenter/ImsjlzSet/MImsjlzSetListHt',
    method: 'get',
    params
  })
}

// 获取机种
export function getModelData(params) {
    return request({
      url: '/datacenter/ImsjlzSet/Modellist',
      method: 'get',
      params
    })
  }
  
