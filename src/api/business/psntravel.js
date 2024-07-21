import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
export function listPSnTravel(query) {
  return request({
    url: 'business/PSnTravel/list',
    method: 'get',
    params: query,
  })
}

/**
* 新增
* @param data
*/
export function addPSnTravel(data) {
  return request({
    url: 'business/PSnTravel',
    method: 'post',
    data: data,
  })
}
/**
* 修改
* @param data
*/
export function updatePSnTravel(data) {
  return request({
    url: 'business/PSnTravel',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取详情
* @param {Id}
*/
export function getPSnTravel(id) {
  return request({
    url: 'business/PSnTravel/' + id,
    method: 'get'
  })
}

/**
* 删除
* @param {主键} pid
*/
export function delPSnTravel(pid) {
  return request({
    url: 'business/PSnTravel/' + pid,
    method: 'delete'
  })
}
