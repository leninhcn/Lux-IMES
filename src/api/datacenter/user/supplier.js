import request from '@/utils/request'

// 获取供应商数据
export function getSupplierData(params) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/VendorList',
    method: 'get',
    params
  })
}

// 获取新增供应商数据
export function addSupplierData(data) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/VendorInsert',
    method: 'post',
    data
  })
}

// 获取修改供应商数据
export function editSupplierData(data) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/VendorUpdate',
    method: 'put',
    data
  })
}

// 获取供应商 log 数据
export function getSupplierLog(params) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/VendorListHt',
    method: 'get',
    params
  })
}
