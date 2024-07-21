import request from '@/utils/request'
import { downFile } from '@/utils/request'

// 查询工单详细信息
export function getwobase(query) {
  return request({
    url: '/womanagement/mntnwobomlink/getwobase',
    method: 'get',
    params: query,
  })
}

// 获得工单BOM
export function getwobom(query) {
  return request({
    url: '/womanagement/mntnwobomlink/getwobom',
    method: 'get',
    params: query,
  })
}

//更新工单BOM
export function updatewobom(data)
{
  return request({
    url: '/womanagement/mntnwobomlink/updatewobom',
    method:'post',
    data:data,
  })
}

//新增工单BOM
export function addwobom(data)
{
  return request({
    url: '/womanagement/mntnwobomlink/addwobom',
    method:'post',
    data:data,
  })
}