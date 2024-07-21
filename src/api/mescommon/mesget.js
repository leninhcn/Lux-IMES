import request from '@/utils/request'
import { downFile } from '@/utils/request'

// 获取机种model
export function listModel(query) {
  return request({
    url: '/mescommon/mesget/list_model',
    method: 'get',
    params: query
  })
}
// 查询Procedure列表
export function listProcedure(query) {
  return request({
    url: '/mescommon/mesget/list_procedure',
    method: 'get',
    params: query
  })
}
// 查询staiontype树
export function treeStationType(query) {
  return request({
    url: '/mescommon/mesget/list_stationtypetree',
    method: 'get',
    params: query
  })
}
// 查询staion树
export function treeStation(query) {
  return request({
    url: '/mescommon/mesget/list_stationtree',
    method: 'get',
    params: query
  })
}

// 查询线体列表
export function linelistget(query) {
  return request({
    url: '/mescommon/mesget/list_line',
    method: 'get',
    params: query,
  })
}
// 查询途程列表
export function routelistget(query) {
  return request({
    url: '/mescommon/mesget/list_route',
    method: 'get',
    params: query,
  })
}
// 查询站点类型列表
export function stationtypelistget(query) {
  return request({
    url: '/mescommon/mesget/list_station_type',
    method: 'get',
    params: query,
  })
}
// 查询站点列表
export function stationlistget(query) {
  return request({
    url: '/mescommon/mesget/list_station',
    method: 'get',
    params: query,
  })
}
// 工单类型列表
export function wotypelistget(query) {
  return request({
    url: '/mescommon/mesget/list_wotype',
    method: 'get',
    params: query,
  })
}

// 料号列表
export function partlistget(query) {
  return request({
    url: '/mescommon/mesget/list_part',
    method: 'get',
    params: query,
  })
}

// 包装规格
export function pkspeclistget(query) {
  return request({
    url: '/mescommon/mesget/list_pkspec',
    method: 'get',
    params: query,
  })
}
// 组合规则
export function setrulelistget(query) {
  return request({
    url: '/mescommon/mesget/list_rule',
    method: 'get',
    params: query,
  })
}
// 部门
export function deptlistget(query) {
  return request({
    url: '/mescommon/mesget/list_dept',
    method: 'get',
    params: query,
  })
}
// 获取投入制程
export function inprocesslistget(query) {
  return request({
    url: '/mescommon/mesget/list_inprocess',
    method: 'get',
    params: query,
  })
}
// 获取产出制程
export function outprocesslistget(query) {
  return request({
    url: '/mescommon/mesget/list_outprocess',
    method: 'get',
    params: query,
  })
}

// labeltype根据model获取IPN
export function listPartLabelType(query) {
  return request({
    url: '/mescommon/mesget/list_partlabeltype',
    method: 'get',
    params: query
  })
}
// labeltype根据model获取IPN
export function listLabelTypeByStation(query) {
  return request({
    url: '/mescommon/mesget/list_labeltype_bystation',
    method: 'get',
    params: query
  })
}
// 获取label_type_base
export function listLabelTypeBase(query) {
  return request({
    url: '/mescommon/mesget/list_labeltypebase',
    method: 'get',
    params: query
  })
}
// 获取station_type
export function listLabelStationType(query) {
  return request({
    url: '/mescommon/mesget/list_labelstationtype',
    method: 'get',
    params: query
  })
}
// 获取系统内的打印参数
export function listPrintField(query) {
  return request({
    url: '/mescommon/mesget/list_printfield',
    method: 'get',
    params: query
  })
}

// 导出岗位
//export async function defectexportPost(query) {
//  await downFile('/datacenter/mntndefect/export', query)
//}

export function listSnByWo(query) {
  return request({
    url: '/mescommon/mesget/list_snbywo',
    method: 'get',
    params: query
  })
}

export function listPanelByWo(query) {
  return request({
    url: '/mescommon/mesget/list_Panelbywo',
    method: 'get',
    params: query
  })
}

export function checkPart(query) {
  return request({
    url: '/mescommon/mesget/check_part',
    method: 'get',
    params: query
  })
}

export function getWarehouse(query) {
  return request({
    url: '/mescommon/mesget/get_warehouse',
    method: 'get',
    params: query
  })
}

export function checkWarehouse(query) {
  return request({
    url: '/mescommon/mesget/check_warehouse',
    method: 'get',
    params: query
  })
}
