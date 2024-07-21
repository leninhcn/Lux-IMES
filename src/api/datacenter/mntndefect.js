import request from '@/utils/request'
import { downFile } from '@/utils/request'
// 查询岗位列表
export function defectlistPost(query) {
  return request({
    url: '/datacenter/mntndefect/list',
    method: 'get',
    params: query,
  })
}

// 查询岗位详细
export function defectgetPost(postId) {
  return request({
    url: '/datacenter/mntndefect/query',
    method: 'get',
    params: postId,
  })
}

// 新增
export function defectaddPost(data) {
  return request({
    url: '/datacenter/mntndefect/add',
    method: 'post',
    data: data
  })
}

// 修改
export function defectupdatePost(data) {
  return request({
    url: '/datacenter/mntndefect/update',
    method: 'post',
    data: data
  })
}

// 修改状态
export function defectupdatestatusPost(data) {
  return request({
    url: '/datacenter/mntndefect/updatestatus',
    method: 'post',
    data: data
  })
}

// 删除
export function defectdelPost(postId) {
  return request({
    url: '/datacenter/mntndefect/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export async function defectexportPost(query) {
  // return request({
  //   url: '/system/post/export',
  //   method: 'get',
  //   params: query
  // })
  await downFile('/datacenter/mntndefect/export', query)
}