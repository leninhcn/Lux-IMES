import request from '@/utils/request'

const base = 'labelmnt/labelmanagement'

// 获取label_type信息
export function listLabelType(query) {
  return request({
    url: `${base}/querylistlabeltype`,
    method: 'get',
    params: query,
  })
}
// 获取label_type明细
export function queryLabelType(query) {
  return request({
    url: `${base}/queryinfolabeltype`,
    method: 'get',
    params: query,
  })
}
// 新增label_type信息
export function addLabelType(data) {
  return request({
    url: `${base}/addlabeltype`,
    method: 'post',
    data: data
  })
}
// 修改label_type
export function updateLabelType(data) {
  return request({
    url: `${base}/updatelabeltype`,
    method: 'post',
    data: data
  })
}
// 删除label_type
export function removeLabelType(data) {
  return request({
    url: `${base}/removelabeltype`,
    method: 'post',
    data: data
  })
}

// 获取模板label_file
export function queryLabelFile(query) {
  return request({
    url: `${base}/querylabelfile`,
    method: 'get',
    params: query,
  })
}
// 新增标签模板label_file信息
export function addLabelFile(data) {
  return request({
    url: `${base}/addlabelfile`,
    method: 'post',
    data: data
  })
}

// 获取模板label_params
export function listLabelParams(query) {
  return request({
    url: `${base}/querylabelparams`,
    method: 'get',
    params: query,
  })
}
// 查询label_params明细
export function queryLabelParams(query) {
  return request({
    url: `${base}/queryinfolabelparams`,
    method: 'get',
    params: query,
  })
}
// 新增label_params
export function addLabelParams(data) {
  return request({
    url: `${base}/addlabelparams`,
    method: 'post',
    data: data
  })
}
// 修改label_params
export function updateLabelParams(data) {
  return request({
    url: `${base}/updatelabelparams`,
    method: 'post',
    data: data
  })
}
// 删除label_params
export function deleteLabelParams(data) {
  return request({
    url: `${base}/deletelabelparams`,
    method: 'post',
    data: data
  })
}

// 获取模板label_station
export function listLabelStation(query) {
  return request({
    url: `${base}/querylistlabelstation`,
    method: 'get',
    params: query,
  })
}
// 查询label_station明细
export function queryLabelStation(query) {
  return request({
    url: `${base}/queryinfolabelstation`,
    method: 'get',
    params: query,
  })
}
// 新增label_station
export function addLabelStation(data) {
  return request({
    url: `${base}/addlabelstation`,
    method: 'post',
    data: data
  })
}
// 修改label_station
export function updateLabelStation(data) {
  return request({
    url: `${base}/updatelabelstation`,
    method: 'post',
    data: data
  })
}
// 删除label_station
export function deleteLabelStation(data) {
  return request({
    url: `${base}/deletelabelstation`,
    method: 'post',
    data: data
  })
}

// 查询print_data信息
export function listPrintData(query) {
  return request({
    url: `${base}/querylistprintdata`,
    method: 'get',
    params: query,
  })
}
// 查询print_data明细
export function queryPrintData(query) {
  return request({
    url: `${base}/queryinfoprintdata`,
    method: 'get',
    params: query,
  })
}
// 新增print_data
export function addPrintData(data) {
  return request({
    url: `${base}/addprintdata`,
    method: 'post',
    data: data
  })
}
// 修改print_data
export function updatePrintData(data) {
  return request({
    url: `${base}/updateprintdata`,
    method: 'post',
    data: data
  })
}
// 删除print_data
export function deletePrintData(data) {
  return request({
    url: `${base}/deleteprintdata`,
    method: 'post',
    data: data
  })
}
