import request from '@/utils/request'
import { downFile } from '@/utils/request'
// 查询列表
export function dutylistPost(query) {
  return request({
    url: '/datacenter/mduty/list',
    method: 'get',
    params: query,
  })
}

// 查询详细
export function dutygetPost(postId) {
  return request({
    url: '/datacenter/mduty/query',
    method: 'get',
    params: postId,
  })
}

// 新增
export function dutyaddPost(data) {
  return request({
    url: '/datacenter/mduty/add',
    method: 'post',
    data: data
  })
}

// 修改
export function dutyupdatePost(data) {
  return request({
    url: '/datacenter/mduty/update',
    method: 'post',
    data: data
  })
}

// 修改状态
export function dutyupdatestatusPost(data) {
  return request({
    url: '/datacenter/mduty/updatestatus',
    method: 'post',
    data: data
  })
}

// 删除
export function dutydefectdelPost(postId) {
  return request({
    url: '/datacenter/mduty/' + postId,
    method: 'delete'
  })
}

// 导出
export async function dutyexportPost(query) {
  // return request({
  //   url: '/system/post/export',
  //   method: 'get',
  //   params: query
  // })
  await downFile('/datacenter/mduty/export', query)
}
