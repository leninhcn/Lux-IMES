import request from '@/utils/request'

/**
 * 上下料
 分页查询
 * @param {查询条件} data
 */
export function listPFeeding(query) {
  return request({
    url: 'business/PFeeding/list',
    method: 'get',
    params: query,
  })
}

/**
 * 新增上下料

 * @param data
 */
export function addPFeeding(data) {
  return request({
    url: 'business/PFeeding',
    method: 'post',
    data: data,
  })
}
/**
 * 修改上下料

 * @param data
 */
export function updatePFeeding(data) {
  return request({
    url: 'business/PFeeding',
    method: 'PUT',
    data: data,
  })
}
/**
 * 获取上下料
 详情
 * @param {Id}
 */
export function getPFeeding(id) {
  return request({
    url: 'business/PFeeding/' + id,
    method: 'get'
  })
}

/**
 * 删除上下料

 * @param {主键} pid
 */
export function delPFeeding(pid) {
  return request({
    url: 'business/PFeeding/' + pid,
    method: 'delete'
  })
}
