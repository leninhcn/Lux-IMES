import request from '@/utils/request'

// 查询类型列表
export function listJobType(query) {
  return request({
    url: '/datacenter/mntnactionbase/queryjobtype',
    method: 'get',
    params: query
  })
}

// 新增类型
export function addJobType(data) {
  return request({
    url: '/datacenter/mntnactionbase/addjobtype',
    method: 'post',
    data: data
  })
}

// 修改类型
export function updateJobType(data) {
  return request({
    url: '/datacenter/mntnactionbase/updatejobtype',
    method: 'post',
    data: data
  })
}

// 删除类型
export function deleteJobType(data) {
  return request({
    url: '/datacenter/mntnactionbase/deletejobtype',
    method: 'delete',
    data
  })
}

// 查询job列表
export function listJob(query) {
  return request({
    url: '/datacenter/mntnactionbase/queryjobid',
    method: 'get',
    params: query
  })
}

// 新增job
export function addJob(data) {
  return request({
    url: '/datacenter/mntnactionbase/addjobid',
    method: 'post',
    data: data
  })
}

// 修改job
export function updateJob(data) {
  return request({
    url: '/datacenter/mntnactionbase/updatejobid',
    method: 'post',
    data: data
  })
}

// 删除job
export function deleteJob(data) {
  return request({
    url: '/datacenter/mntnactionbase/deletejobid',
    method: 'delete',
    data
  })
}

// 查询link列表
export function listJobLink(query) {
  return request({
    url: '/datacenter/mntnactionbase/queryjoblink',
    method: 'get',
    params: query
  })
}

// 新增link
export function addJobLink(data) {
  return request({
    url: '/datacenter/mntnactionbase/addjoblink',
    method: 'post',
    data: data
  })
}

// 修改link
export function updateJobLink(data) {
  return request({
    url: '/datacenter/mntnactionbase/updatejoblink',
    method: 'post',
    data: data
  })
}

// 删除link
export function deleteJobLink(data) {
  return request({
    url: '/datacenter/mntnactionbase/deletejoblink',
    method: 'delete',
    data
  })
}

// 查询group列表
export function listJobGroup(query) {
  return request({
    url: '/datacenter/mntnactionbase/queryjobgroup',
    method: 'get',
    params: query
  })
}

// 新增group
export function addJobGroup(data) {
  return request({
    url: '/datacenter/mntnactionbase/insertjobgroup',
    method: 'post',
    data: data
  })
}

// 修改group
export function updateJobGroup(data) {
  return request({
    url: '/datacenter/mntnactionbase/updatejobgroup',
    method: 'post',
    data: data
  })
}

// 删除group
export function deleteJobGroup(data) {
  return request({
    url: '/datacenter/mntnactionbase/deletejobgroup',
    method: 'delete',
    data
  })
}

// 查询group job列表
export function listGroupJob(query) {
  return request({
    url: '/datacenter/mntnactionbase/queryjobgrouplinkdetail',
    method: 'get',
    params: query
  })
}

// 新增group job
export function addGroupJob(data) {
  return request({
    url: '/datacenter/mntnactionbase/insertjobgrouplink',
    method: 'post',
    data: data
  })
}

// 修改group job
export function updateGroupJob(data) {
  return request({
    url: '/datacenter/mntnactionbase/updatejobgrouplink',
    method: 'post',
    data: data
  })
}

// 删除group job
export function removeGroupJob(data) {
  return request({
    url: '/datacenter/mntnactionbase/deletejobgrouplink',
    method: 'post',
    data: data
  })
}

// 查询stationactionlink
export function listStationAction(query) {
  return request({
    url: '/datacenter/mntnactionbase/querystationaction',
    method: 'get',
    params: query
  })
}

// 新增/修改stationaction
export function updateStationAction(data) {
  return request({
    url: '/datacenter/mntnactionbase/insertorupdatestationaction',
    method: 'post',
    data: data
  })
}
