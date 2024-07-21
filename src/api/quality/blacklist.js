import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
export function listPSnBlackList(query) {
	return request({
		url: 'quality/blacklist/list',
		method: 'get',
		params: query,
	})
}

/**
* 新增
* @param data
*/
export function addPSnBlackList(data) {
	return request({
		url: 'quality/blacklist',
		method: 'post',
		data: data,
	})
}
/**
* 修改
* @param data
*/
export function updatePSnBlackList(data) {
	return request({
		url: 'quality/blacklist',
		method: 'PUT',
		data: data,
	})
}
/**
* 获取详情
* @param {Id}
*/
export function getPSnBlackList(id) {
	return request({
		url: 'quality/blacklist/' + id,
		method: 'get'
	})
}

/**
* 删除
* @param {主键} pid
*/
export function delPSnBlackList(pid) {
	return request({
		url: 'quality/blacklist/' + pid,
		method: 'delete'
	})
}
