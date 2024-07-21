import request from '@/utils/request'


// 查询卡控信息列表
export function listHold(query) {
	return request({
		url: '/quality/hold/list',
		method: 'get',
		params: query
	})
}
// 获取卡控下拉列表绑定项数据
export function listOptions(query) {
	return request({
		url: '/quality/hold/options',
		method: 'get',
		params: query
	})
}

// 新增卡控
export function excuteHold(data) {
	return request({
		url: '/quality/hold/excute',
		method: 'post',
		data: data
	})
}
// 删除卡控
export function deleteHold(data) {
	return request({
		url: '/quality/hold/delete',
		method: 'post',
		data: data
	})
}

// 解除卡控
export function releaseHold(data) {
	return request({
		url: '/quality/hold/release',
		method: 'post',
		data: data
	})
}