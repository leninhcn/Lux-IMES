import request from '@/utils/request'

// 查询厂区下拉列表
export function sitelist() {
    return request({
        url: '/system/site/list',
        method: 'get'
    })
}