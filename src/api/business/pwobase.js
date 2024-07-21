import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
export function listPWoBase(query) {
  return request({
    url: 'business/PWoBase/list',
    method: 'get',
    params: query,
  })
}

/**
* 新增
* @param data
*/
export function addPWoBase(data) {
  return request({
    url: 'business/PWoBase',
    method: 'post',
    data: data,
  })
}
/**
* 修改
* @param data
*/
export function updatePWoBase(data) {
  return request({
    url: 'business/PWoBase',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取详情
* @param {Id}
*/
export function getPWoBase(id) {
  return request({
    url: 'business/PWoBase/' + id,
    method: 'get'
  })
}

/**
* 删除
* @param {主键} pid
*/
export function delPWoBase(pid) {
  return request({
    url: 'business/PWoBase/' + pid,
    method: 'delete'
  })
}
