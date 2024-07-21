import request from '@/utils/request'

export function getSites() {
  return request({
    url: '/prodMnt/stationConfig/GetSites',
    method: 'GET'
  })
}

export function getStations(data) {
  return request({
    url: '/prodMnt/stationConfig/GetStations',
    method: 'POST',
    data
  })
}

export function requestRepairIn(data) {
  return request({
    url: '/repair/repairin/list',
    method: 'POST',
    data
  })
}

export function requestRepairOut(data) {
  return request({
    url: '/repair/repairout/list',
    method: 'POST',
    data
  })
}

export function repairDelinkList(data) {
  return request({
    url: '/repair/repairdelink/List',
    method: 'POST',
    data
  })
}

export function linkRemove(data) {
  return request({
    url: '/repair/repairdelink/remove',
    method: 'POST',
    data
  })
}

export function getInfoBySn(data) {
  return request({
    url: '/repair/repairexe/GetInfoBySn',
    method: 'POST',
    data
  })
}

export function getEmpName(params) {
  return request({
    url: '/repair/repairexe/getEmpName',
    method: 'GET',
    params
  })
}

export function checkRepairOP(data) {
  return request({
    url: '/repair/repairexe/CheckRepairOP',
    method: 'POST',
    data
  })
}

export function repairDefReasonType() {
  return request({
    url: '/repair/repairexe/repairDefReasonType',
    method: 'GET'
  })
}

export function getDefReason(params) {
  return request({
    url: '/repair/repairexe/repairDefReason',
    method: 'GET',
    params
  })
}

export function getLocation(params) {
  return request({
    url: '/repair/repairexe/getLocation',
    method: 'GET',
    params
  })
}

export function getACTValidate() {
  return request({
    url: '/repair/repairexe/getACTValidate',
    method: 'GET'
  })
}

export function checkOldCSN(params) {
  return request({
    url: '/repair/repairexe/CheckOldCSN',
    method: 'GET',
    params
  })
}

export function checkNewCSN(params) {
  return request({
    url: '/repair/repairexe/CheckNewCSN',
    method: 'GET',
    params
  })
}

export function checkOldCPN(params) {
  return request({
    url: '/repair/repairexe/CheckOldCPN',
    method: 'GET',
    params
  })
}

export function checkNewCPN(params) {
  return request({
    url: '/repair/repairexe/CheckNewCPN',
    method: 'GET',
    params
  })
}

export function getKPReplaceInfo(params) {
  return request({
    url: '/repair/repairexe/GetKPReplaceInfo',
    method: 'GET',
    params
  })
}

export function repairDataOK(data) {
  return request({
    url: '/repair/repairexe/RepairDataOK',
    method: 'POST',
    data
  })
}

export function getReason(params) {
  return request({
    url: '/repair/repairexe/getReason',
    method: 'GET',
    params
  })
}

export function editDefect(data) {
  return request({
    url: '/repair/repairexereplace/editDefect',
    method: 'POST',
    data
  })
}

export function getKpsn(params) {
  return request({
    url: '/repair/repairexereplace/getKpsn',
    method: 'GET',
    params
  })
}

// 移除
export function defRemoveKP(data) {
  return request({
    url: '/repair/repairexereplace/defRemoveKP',
    method: 'POST',
    data
  })
}

export function checkNewKPSN(data) {
  return request({
    url: '/repair/repairexereplace/CheckNewKPSN',
    method: 'POST',
    data
  })
}

// 替换
export function defReplaceKP(data) {
  return request({
    url: '/repair/repairexereplace/defReplaceKP',
    method: 'POST',
    data
  })
}

// 获取回流站点
export function getReturnStation(params) {
  return request({
    url: '/repair/repairexe/GetReturnStation',
    method: 'GET',
    params
  })
}

// 完成
export function repairFinish(params) {
  return request({
    url: '/repair/repairexe/RepairFinish',
    method: 'GET',
    params
  })
}

// 报废
export function repairScrap(data) {
  return request({
    url: '/repair/repairexe/Scrap',
    method: 'POST',
    data
  })
}

// 新增不良信息
export function addDefect(data) {
  return request({
    url: '/repair/repairexe/AddDefect',
    method: 'POST',
    data
  })
}

// 删除不良信息
export function delDefect(data) {
  return request({
    url: '/repair/repairexe/DelDefect',
    method: 'POST',
    data
  })
}

// 打印维修单
export function checkPrintSN(params) {
  return request({
    url: '/repair/printlabel/checkPrintSN',
    method: 'GET',
    params
  })
}

export function chekPrintRole(params) {
  return request({
    url: '/repair/printlabel/chekprintrole',
    method: 'GET',
    params
  })
}

export function getLabelInfo(params) {
  return request({
    url: '/repair/printlabel/GetLabelInfo',
    method: 'GET',
    params
  })
}

// 批量维修
export function getRapidSNInfo(params) {
  return request({
    url: '/repair/rapidrepair/getRapidSNInfo',
    method: 'GET',
    params
  })
}

export function checkDefect(params) {
  return request({
    url: '/repair/rapidrepair/checkDefect',
    method: 'GET',
    params
  })
}

// export function repairFinish(data) {
//   return request({
//     url: '/repair/rapidrepair/repairFinish',
//     method: 'POST',
//     data
//   })
// }
