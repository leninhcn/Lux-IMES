import request from '@/utils/request'

import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取用户数据
export function getUserInfoData(params) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMemplist',
    method: 'get',
    params
  })
}

// 新增用户数据
export function addUserInfoData(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMempInsert',
    method: 'post',
    data
  })
}

// 修改用户数据
export function editUserInfoData(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMempUpdate',
    method: 'put',
    data
  })
}

// 删除用户数据
export function delUserInfoData(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMempDelet',
    method: 'delete',
    data
  })
}

// 获取角色列表
export function getUserInfoRoleData(params) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMemplistRole',
    method: 'get',
    params,
    cancelToken: new cancelToken(function executor(c) {
      cancel = c
    })
  })
}

// 绑定角色
export function bindUserInfoRole(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMemplistRoleInsert',
    method: 'post',
    data
  })
}

// 日志
export function getUserInfoLog(params) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMemplistHt',
    method: 'get',
    params
  })
}

// 权限拷贝
export function copyUserInfoAuthData(data) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMemplistCopy',
    method: 'post',
    data
  })
}

// 获取厂区数据
export function getUserInfoFactoryData(params) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMemplistFactory',
    method: 'get',
    params
  })
}

// 获取部门数据
export function getUserInfoDeptData(params) {
  return request({
    url: '/MntnRolePrivilege/MntnRolePrivilegeController/ImesMemplistBranch',
    method: 'get',
    params
  })
}

// 取消获取 IPN 请求
export function axiosCancel() {
  cancel && cancel()
}
