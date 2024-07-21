import request from '@/utils/request'

// 获取数据
export function getDescriptionData(params) {
  return request({
    url: '/prodMnt/prodModel/ErpMesllist',
    method: 'get',
    params
  })
}

// 新增数据
export function addDescriptionData(data) {
  return request({
    url: '/prodMnt/prodModel/ErpMesInsert',
    method: 'post',
    data
  })
}

// 修改数据
export function editDescriptionData(data) {
  return request({
    url: '/prodMnt/prodModel/ErpMesUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delDescriptionData(data) {
  return request({
    url: '/prodMnt/prodModel/ErpMesDelet',
    method: 'delete',
    data
  })
}

// 获取 log 历史记录
export function getDescriptionLog(params) {
  return request({
    url: '/prodMnt/prodModel/ErpMeslistHt',
    method: 'get',
    params
  })
}

// 获取机种数据
export function getDescriptionModelData(params) {
  return request({
    url: '/prodMnt/prodModel/ErpMeslModellist',
    method: 'get',
    params
  })
}

// 获取 STAGE 数据
export function getDescriptionStageData(params) {
  return request({
    url: '/prodMnt/prodModel/ErpMeslStageNamelist',
    method: 'get',
    params
  })
}
