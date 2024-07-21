import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
export function listPSnStatus(query) {
  return request({
    url: 'business/PSnStatus/list',
    method: 'get',
    params: query,
  })
}

/**
* 新增
* @param data
*/
export function addPSnStatus(data) {
  return request({
    url: 'business/PSnStatus',
    method: 'post',
    data: data,
  })
}
/**
* 修改
* @param data
*/
export function updatePSnStatus(data) {
  return request({
    url: 'business/PSnStatus',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取详情
* @param {Id}
*/
export function getPSnStatus(id) {
  return request({
    url: 'business/PSnStatus/' + id,
    method: 'get'
  })
}

/**
* 删除
* @param {主键} pid
*/
export function delPSnStatus(pid) {
  return request({
    url: 'business/PSnStatus/' + pid,
    method: 'delete'
  })
}
