import request from '@/utils/request'
import { downFile } from '@/utils/request'

/**
* NPI项目管理分页查询
* @param {查询条件} data
*/
export function listNpiProjet(query) {
  return request({
    url: 'business/NpiProjet/list',
    method: 'get',
    params: query,
  })
}

/**
* 新增NPI项目管理
* @param data
*/
export function addNpiProjet(data) {
  return request({
    url: 'business/NpiProjet',
    method: 'post',
    data: data,
  })
}
/**
* 修改NPI项目管理
* @param data
*/
export function updateNpiProjet(data) {
  return request({
    url: 'business/NpiProjet',
    method: 'PUT',
    data: data,
  })
}
/**
* 获取NPI项目管理详情
* @param {Id}
*/
export function getNpiProjet(id) {
  return request({
    url: 'business/NpiProjet/' + id,
    method: 'get'
  })
}

/**
* 删除NPI项目管理
* @param {主键} pid
*/
export function delNpiProjet(pid) {
  return request({
    url: 'business/NpiProjet/' + pid,
    method: 'delete'
  })
}
// 清空NPI项目管理
export function clearNpiProjet() {
  return request({
    url: 'business/NpiProjet/clean',
    method: 'delete'
  })
}
// 导出NPI项目管理
export async function exportNpiProjet(query) {
  await downFile('business/NpiProjet/export', { ...query })
}
/**
* 获取工单详情
* @param {id}
*/
export function GetStepById(id) {
  return request({
    url: 'business/NpiProjet/GetStepById/' + id,
    method: 'get'
  })
}

export function GetApprovalLogById(id) {
  return request({
    url: 'business/NpiProjet/GetApprovalLogById/' + id,
    method: 'get'
  })
}

/**GetStepInfoById
* 获取工单详情
* @param {id}
* @param {step}
*/
export function GetStepInfoById(id,stepname) {
  return request({
    url: 'business/NpiProjet/GetStepInfoById/' + id+'/'+stepname,
    method: 'get'
  })
}

/**
* 新增研发准备项目
* @param data
*/
export function addRdItem(data) {
  return request({
    url: 'business/NpiProjet/AddRdItem',
    method: 'post',
    data: data,
  })
}

/**
* 获取工单详情
* @param {id}
*/
export function GetOrderInfoById(id,stepname) {
  return request({
    url: 'business/NpiProjet/GetOrderInfoById/' + id+'/'+stepname,
    method: 'get'
  })
}

/**
* 新增研发准备项目
* @param data
*/
export function addOrderInfo(data) {
  return request({
    url: 'business/NpiProjet/AddOrderInfo',
    method: 'post',
    data: data,
  })
}


export function GetStationType() {
  return request({
    url: 'business/NpiProjet/GetStationType',
    method: 'get'
  })
}

export function GetStationTypeConfig() {
  return request({
    url: 'business/NpiProjet/GetStationTypeConfig',
    method: 'get'
  })
}


export function addWipStation(data) {
  return request({
    url: 'business/NpiProjet/AddWipStation',
    method: 'post',
    data: data,
  })
}