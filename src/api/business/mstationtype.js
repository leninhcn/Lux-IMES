import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
export function listMStationType(query) {
  return request({
    url: 'business/MStationType/list',
    method: 'get',
    params: query,
  })
}

/**
* 新增
* @param data
*/
export function addMStationType(data) {
  return request({
    url: 'business/MStationType',
    method: 'post',
    data: data,
  })
}
/**
* 修改
* @param data
*/
export function updateMStationType(data) {
  return request({
    url: 'business/MStationType',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取详情
* @param {Id}
*/
export function getMStationType(id) {
  return request({
    url: 'business/MStationType/' + id,
    method: 'get'
  })
}

/**
* 删除
* @param {主键} pid
*/
export function delMStationType(pid) {
  return request({
    url: 'business/MStationType/' + pid,
    method: 'delete'
  })
}
