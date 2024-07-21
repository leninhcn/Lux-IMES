import request from '@/utils/request'

// 获取部门数据
export function getDepData(params) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/MdeptList',
    method: 'get',
    params
  })
}

// 新增部门数据
export function addDepData(data) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/MdeptInsert',
    method: 'post',
    data
  })
}

// 修改部门数据
export function editDepData(data) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/MdeptUpdate',
    method: 'put',
    data
  })
}

// 删除部门数据
export function delDepData(data) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/MdeptDelet',
    method: 'delete',
    data
  })
}

// 获取部门 LOG
export function getDepLog(params) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/MdeptListHt',
    method: 'get',
    params
  })
}

// 获取厂区数据
export function getDepFactoryData(data) {
  return request({
    url: '/MntnVendorMntnCustomer/VendorMntnCustomer/MdeptListFactory',
    method: 'put',
    data
  })
}
