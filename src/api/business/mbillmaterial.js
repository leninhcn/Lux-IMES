import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
export function listMBillMaterial(query) {
  return request({
    url: 'business/MBillMaterial/list',
    method: 'get',
    params: query,
  })
}

/**
* 新增
* @param data
*/
export function addMBillMaterial(data) {
  return request({
    url: 'business/MBillMaterial',
    method: 'post',
    data: data,
  })
}
/**
* 修改
* @param data
*/
export function updateMBillMaterial(data) {
  return request({
    url: 'business/MBillMaterial',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取详情
* @param {Id}
*/
export function getMBillMaterial(id) {
  return request({
    url: 'business/MBillMaterial/' + id,
    method: 'get'
  })
}

/**
* 删除
* @param {主键} pid
*/
export function delMBillMaterial(pid) {
  return request({
    url: 'business/MBillMaterial/' + pid,
    method: 'delete'
  })
}
