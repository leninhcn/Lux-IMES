import request from '@/utils/request'

// 获取客户数据
export function getClientData(params) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/CustomerList',
    method: 'get',
    params
  })
}

// 新增客户数据
export function addClientData(data) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/CustomerInsert',
    method: 'post',
    data
  })
}

// 修改客户数据
export function editClientData(data) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/CustomerUpdate',
    method: 'put',
    data
  })
}
