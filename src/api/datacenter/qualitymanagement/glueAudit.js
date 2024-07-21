import request from '@/utils/request'

import axios from 'axios'

// 获取数据
export function getModelData(params) {
  return request({
    url: '/ProdMnt/CallPartExamine/CallPartExamineList',
    method: 'get',
    params
  })
}

// 新增数据
export function addModelData(data) {
  return request({
    url: '/ProdMnt/CallPart/InsertCallPart',
    method: 'put',
    data
  })
}

// 审核
export function auditingCallPartExamine(data) {
  return request({
    url: '/ProdMnt/CallPartExamine/AuditingCallPartExamine',
    method: 'put',
    data
  })
}

// 启用禁用
export function editDescriptionData(data) {
  return request({
    url: '/ProdMnt/CallPartExamine/CallPartExamineabled',
    method: 'put',
    data
  })
}

// 修改数据
export function editModelData(data) {
  return request({
    url: '/ProdMnt/CallPartExamine/UpdateCallPartExamine',
    method: 'put',
    data
  })
}

// 删除数据
export function delModelData(data) {
  return request({
    url: '/ProdMnt/CallPartExamine/UpdateCallPartExamine',
    method: 'put',
    data
  })
}

// 弹窗接口
// 查看历史
export function getHistory(params) {
  return request({
    url: '/ProdMnt/CallPart/History',
    method: 'get',
    params
  })
}

//料号查询数据
export function getIpnList(params) {
  return request({
    url: `/ProdMnt/CallPartExamine/IpnList`,
    method: 'get',
    params
  })
}

//线别查询数据
export function lineList() {
  return request({
    url: '/ProdMnt/CallPartExamine/LineList',
    method: 'get',
  })
}

//工单查询数据
export function getWorkOrder(params) {
  return request({
    url: `/ProdMnt/CallPart/WorkOrder`,
    method: 'get',
    params
  })
}


