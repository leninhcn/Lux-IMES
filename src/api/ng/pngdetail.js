import request from '@/utils/request'

/**
* 不良品统计分页查询
* @param {查询条件} data
*/
export function listPNgDetail(query) {
  return request({
    url: 'ng/PNgDetail/list',
    method: 'get',
    params: query,
  })
}

export function statistics(query) {
  return request({
    url: 'ng/PNgDetail/statistics',
    method: 'get',
    params: query,
  })
}

export function ListMaChine() {
  return request({
    url: 'ng/PNgDetail/ListMaChine',
    method: 'get',
  })
}

export function QuerySnTravel(WorkOrder) {
  return request({
    url: 'ng/PNgDetail/SnTravel?WorkOrder='+WorkOrder,
    method: 'get',
  })
}
export function SnTravelMacine(SnTravelstr, workOrder) {
  return request({
    url: `ng/PNgDetail/SnTravelMacine?SnTravelstr=${SnTravelstr}&workOrder=${workOrder}`,
    method: 'get',
  })
}

/**
* 新增不良品统计
* @param data
*/
export function addPNgDetail(data) {
  return request({
    url: 'ng/PNgDetail',
    method: 'post',
    data: data,
  })
}
/**
* 修改不良品统计
* @param data
*/
export function updatePNgDetail(data) {
  return request({
    url: 'ng/PNgDetail',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取不良品统计详情
* @param {Id}
*/
export function getPNgDetail(Id) {
  return request({
    url: 'ng/PNgDetail/Id?Id=' + Id,
    method: 'get'
  })
}

/**
* 删除不良品统计
* @param {主键} pid
*/
export function delPNgDetail(pid) {
  return request({
    url: 'ng/PNgDetail/' + pid,
    method: 'delete'
  })
}
