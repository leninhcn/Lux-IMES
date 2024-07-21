import request from '@/utils/request'

const base = 'warehousemanagement/mwarehouse'

export function listWarehouse(query) {
  return request({
    url: `${base}/listwarehouse`,
    method: 'get',
    params: query,
  })
}

export function queryWarehouse(query) {
  return request({
    url: `${base}/querywarehouse`,
    method: 'get',
    params: query,
  })
}

export function addWarehouse(data) {
  return request({
    url: `${base}/addwarehouse`,
    method: 'post',
    data: data
  })
}

export function updateWarehouse(data) {
  return request({
    url: `${base}/updatewarehouse`,
    method: 'post',
    data: data
  })
}

export function listLocation(query) {
  return request({
    url: `${base}/listlocal`,
    method: 'get',
    params: query,
  })
}

export function queryLocation(query) {
  return request({
    url: `${base}/querylocal`,
    method: 'get',
    params: query,
  })
}

export function addLocation(data) {
  return request({
    url: `${base}/addlocal`,
    method: 'post',
    data: data
  })
}

export function updateLocation(data) {
  return request({
    url: `${base}/updatelocal`,
    method: 'post',
    data: data
  })
}
