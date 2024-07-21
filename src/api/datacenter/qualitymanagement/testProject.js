import request from '@/utils/request'

import axios from 'axios'

let cancelToken = axios.CancelToken
let cancel

// 获取数据
export function getModelData(params) {
  return request({
    url: '/prodMnt/ProdTestitem/TestList',
    method: 'get',
    params
  })
}

// 新增数据
export function addModelData(data) {
  return request({
    url: '/prodMnt/ProdTestitem/TestInsert',
    method: 'put',
    data
  })
}

// 启用禁用
export function editDescriptionData(data) {
  return request({
    url: '/prodMnt/ProdTestitem/Testabled',
    method: 'put',
    data
  })
}

// 修改数据
export function editModelData(data) {
  return request({
    url: '/prodMnt/ProdTestitem/TestUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delModelData(data) {
  return request({
    url: 'prodMnt/ProdTestitem/TestDelete',
    method: 'put',
    data
  })
}

// 弹窗接口
// 获取数据
export function getModelDataDialog(params) {
  return request({
    url: '/prodMnt/ProdTestitem/TestitemList',
    method: 'get',
    params
  })
}

// 新增数据
export function addModelDataDialog(data) {
  return request({
    url: '/prodMnt/ProdTestitem/ItemInsert',
    method: 'put',
    data
  })
}

// 启用禁用
export function editDescriptionDataDialog(data) {
  return request({
    url: '/prodMnt/ProdTestitem/Itemabled',
    method: 'put',
    data
  })
}

// 修改数据
export function editModelDataDialog(data) {
  return request({
    url: '/prodMnt/ProdTestitem/ItemUpdate',
    method: 'put',
    data
  })
}

// 删除数据
export function delModelDataDialog(data) {
  return request({
    url: 'prodMnt/ProdTestitem/ItemDelete',
    method: 'put',
    data
  })
}
