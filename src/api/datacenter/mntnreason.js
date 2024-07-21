import request from '@/utils/request'
import { downFile } from '@/utils/request'
// 查询列表
export function reasonlistPost(query) {
  return request({
    url: '/datacenter/mntnreason/list',
    method: 'get',
    params: query,
  })
}

// 查询详细
export function reasongetPost(postId) {
  return request({
    url: '/datacenter/mntnreason/query',
    method: 'get',
    params: postId,
  })
}

// 新增
export function reasonaddPost(data) {
  return request({
    url: '/datacenter/mntnreason/add',
    method: 'post',
    data: data
  })
}

// 修改
export function reasonupdatePost(data) {
  return request({
    url: '/datacenter/mntnreason/update',
    method: 'post',
    data: data
  })
}

// 修改状态
export function reasonupdatestatusPost(data) {
  return request({
    url: '/datacenter/mntnreason/updatestatus',
    method: 'post',
    data: data
  })
}

// 删除
export function reasondefectdelPost(postId) {
  return request({
    url: '/datacenter/mntnreason/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export async function reasonexportPost(query) {
  // return request({
  //   url: '/system/post/export',
  //   method: 'get',
  //   params: query
  // })
  await downFile('/datacenter/mntnreason/export', query)
}