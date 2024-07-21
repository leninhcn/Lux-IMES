import request from '@/utils/request'
import { downFile } from '@/utils/request'
/**
* 分页查询
* @param {查询条件} data
*/
export function listMQcConfig(query) {
	return request({
		url: 'quality/qcconfig/list',
		method: 'get',
		params: query,
	})
}

//查询检查规则
export function queryRules(query) {
	return request({
		url: 'quality/qcconfig/rules',
		method: 'get',
		params: query,
	})
}

//查询途程
export function queryRoute(query) {
	return request({
		url: 'quality/qcconfig/route',
		method: 'get',
		params: query,
	})
}

//查询途程细节
export function queryStations(query) {
	return request({
		url: 'quality/qcconfig/stations',
		method: 'get',
		params: query,
	})
}

//查询qclevel
export function queryQCLevel(query) {
	return request({
		url: 'quality/qcconfig/qclevel',
		method: 'get',
		params: query,
	})
}

//查询ruletype
export function queryRuleType(query) {
	return request({
		url: 'quality/qcconfig/ruletype',
		method: 'get',
		params: query,
	})
}

// 导出用户
export async function exportMQcConfig(query) {

	await downFile('quality/qcconfig/export', { ...query })
}


/**
* 新增
* @param data
*/
export function addMQcConfig(data) {
	return request({
		url: 'quality/qcconfig',
		method: 'post',
		data: data,
	})
}
/**
* 修改
* @param data
*/
export function updateMQcConfig(data) {
	return request({
		url: 'quality/qcconfig',
		method: 'PUT',
		data: data,
	})
}
/**
* 获取详情
* @param {Id}
*/
export function getMQcConfig(id) {
	return request({
		url: 'quality/qcconfig/' + id,
		method: 'get'
	})
}

/**
* 删除
* @param {主键} pid
*/
export function delMQcConfig(pid) {
	return request({
		url: 'quality/qcconfig/' + pid,
		method: 'delete'
	})
}
