import request from '@/utils/request'

// 获取数据
export function getModelData(params) {
  return request({
    url: '/prodMnt/prodModel/PordModellist',
    method: 'get',
    params
  })
}

// 新增数据
export function addModelData(data) {
  return request({
    url: '/prodMnt/prodModel/PordModelInsert',
    method: 'post',
    data
  })
}

// 修改数据
export function editModelData(data) {
  return request({
    url: '/prodMnt/prodModel/PordModelUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delModelData(data) {
  return request({
    url: '/prodMnt/prodModel/PordModelDelete',
    method: 'delete',
    data
  })
}

// 数据LOG
export function getModelLog(params) {
  return request({
    url: '/prodMnt/prodModel/ImesMmodelHtlist',
    method: 'get',
    params
  })
}
