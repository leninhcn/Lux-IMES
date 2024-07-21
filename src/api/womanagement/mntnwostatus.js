import request from '@/utils/request'
import { downFile } from '@/utils/request'
// 查询所有工单
export function linelistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_line',
    method: 'get',
    params: query,
  })
}

// 查询工单详细信息
export function getDetail(query) {
  return request({
    url: '/womanagement/mntnwostatus/getdetail',
    method: 'get',
    params: query,
  })
}

// 修改工单状态
export function update(data) {
  return request({
    url: '/womanagement/mntnwostatus/update',
    method: 'post',
    data: data
  })
}

