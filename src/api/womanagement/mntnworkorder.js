import request from '@/utils/request'
import { downFile } from '@/utils/request'
// 获取所有信息
export function getall(query) {
  return request({
    url: '/womanagement/mntnwoworkder/getall',
    method: 'get',
    params: query,
  })
}

export function getallToNg(query) {
  return request({
    url: '/womanagement/mntnwoworkder/getallToNg',
    method: 'get',
    params: query,
  })
}

// 新增工单信息
export function mntwobaseadd(data) {
  return request({
    url: '/womanagement/mntnwoworkder/add',
    method: 'post',
    data: data,
  })
}
// 修改工单信息
export function mntwobaseupdate(data) {
  return request({
    url: '/womanagement/mntnwoworkder/update',
    method: 'post',
    data: data,
  })
}
// 导出
export async function wobaseexportPost(query) {
  // return request({
  //   url: '/system/post/export',
  //   method: 'get',
  //   params: query
  // })
  await downFile('/womanagement/mntnwoworkder/export', query)
}

export function getWoBaseHistory(query) {
  return request({
    url: '/womanagement/mntnwoworkder/getwobasehistory',
    method: 'get',
    params: query
  })
}

export function getWoStatusLog(query) {
  return request({
    url: '/womanagement/mntnwoworkder/getwostatuslog',
    method: 'get',
    params: query
  })
}

export function updateEquipment(data) {
  return request({
    url: '/womanagement/mntnwoworkder/updateequipment',
    method: 'post',
    data: data
  })
}

export function getWoBomTree(query) {
  return request({
    url: '/womanagement/mntnwoworkder/getwobomtree',
    method: 'get',
    params: query
  })
}

export function updateWoBom(data) {
  return request({
    url: '/womanagement/mntnwoworkder/updateaddwobombywobase',
    method: 'post',
    data: data
  })
}

export function deleteWoBom(data) {
  return request({
    url: '/womanagement/mntnwoworkder/deletewobombywobase',
    method: 'post',
    data: data
  })
}

