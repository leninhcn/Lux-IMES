import request from '@/utils/request'
import { downFile } from '@/utils/request'
// 查询线体列表
export function linelistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_line',
    method: 'get',
    params: query
  })
}
// 查询途程列表
export function routelistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_route',
    method: 'get',
    params: query
  })
}
// 查询站点类型列表
export function stationtypelistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_station_type',
    method: 'get',
    params: query
  })
}
// 查询站点列表
export function stationlistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_station',
    method: 'get',
    params: query
  })
}
// 查询类型列表
export function typelistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_type',
    method: 'get',
    params: query
  })
}
// 查询sql类型列表
export function sqltypelistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_sqltype',
    method: 'get',
    params: query
  })
}

// 查询配置列表
export function valuelistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_value',
    method: 'get',
    params: query
  })
}

// 查询sql列表
export function sqllistPost(query) {
  return request({
    url: '/datacenter/mblockconfig/list_sql',
    method: 'get',
    params: query
  })
}

// 查询类型详细
export function typegetPost(postId) {
  return request({
    url: '/datacenter/mblockconfig/query_type',
    method: 'get',
    params: postId
  })
}

// 查询配置详细
export function valuegetPost(postId) {
  return request({
    url: '/datacenter/mblockconfig/query_value',
    method: 'get',
    params: postId
  })
}

// 查询sql详细
export function sqlgetPost(postId) {
  return request({
    url: '/datacenter/mblockconfig/query_sql',
    method: 'get',
    params: postId
  })
}

// 新增类型
export function typeaddPost(data) {
  return request({
    url: '/datacenter/mblockconfig/add_type',
    method: 'post',
    data: data
  })
}

// 新增配置
export function valueaddPost(data) {
  return request({
    url: '/datacenter/mblockconfig/add_value',
    method: 'post',
    data: data
  })
}

// 新增sql
export function sqladdPost(data) {
  return request({
    url: '/datacenter/mblockconfig/add_sql',
    method: 'post',
    data: data
  })
}

// 修改type
export function typeupdatePost(data) {
  return request({
    url: '/datacenter/mblockconfig/update_type',
    method: 'post',
    data: data
  })
}

// 修改value
export function valueupdatePost(data) {
  return request({
    url: '/datacenter/mblockconfig/update_value',
    method: 'post',
    data: data
  })
}

// 修改sql
export function sqlupdatePost(data) {
  return request({
    url: '/datacenter/mblockconfig/update_sql',
    method: 'post',
    data: data
  })
}

// 删除type
export function typedelPost(postId) {
  return request({
    url: '/datacenter/mblockconfig/type/' + postId,
    method: 'delete'
  })
}

// 删除value
export function valuedelPost(postId) {
  return request({
    url: '/datacenter/mblockconfig/value/' + postId,
    method: 'delete'
  })
}

// 删除sql
export function sqldelPost(postId) {
  return request({
    url: '/datacenter/mblockconfig/sql/' + postId,
    method: 'delete'
  })
}

// 导出岗位
//export async function defectexportPost(query) {
//  await downFile('/datacenter/mntndefect/export', query)
//}
