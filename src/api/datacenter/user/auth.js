import request from '@/utils/request'

import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取用户数据
export function getAuthData(params) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/RolePrivilegeList',
    method: 'get',
    params
  })
}

// 新增用户数据
export function addAuthData(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/RolePrivilegeInsert',
    method: 'post',
    data
  })
}

// 修改用户数据
export function editAuthData(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/RolePrivilegeUpdate',
    method: 'put',
    data
  })
}

// 获取权限列表数据
export function getPermissionList(params) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/RolePrivilegeBindingList',
    method: 'get',
    params,
    cancelToken: new cancelToken(function executor(c) {
      cancel = c
    })
  })
}

// 绑定权限
export function bindPermission(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/RolePrivilegeBindingPermission',
    method: 'post',
    data
  })
}

// 获取权限日志
export function getPermissionLog(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/RolePrivilegeBindingPermissionHt',
    method: 'post',
    data
  })
}

// 获取报表权限
export function getReportData(params) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/RolePrivilegeBindingReportPermission',
    method: 'get',
    params
  })
}

// 新增报表权限
export function addReport(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/RolePrivilegeBindInRepPer',
    method: 'post',
    data
  })
}

// 取消获取请求
export function axiosCancel() {
  cancel && cancel()
}
