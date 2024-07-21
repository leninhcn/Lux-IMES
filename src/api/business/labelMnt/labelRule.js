import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
const base = 'labelMnt/labelRule'

export function listRuleNames(query) {
	return request({
		url: `${base}/ListRuleNames`,
		method: 'get',
		params: query,
	})
}

export function getRuleParamByName(query) {
	return request({
		url: `${base}/GetRuleParamByName`,
		method: 'get',
		params: query,
	})
}

export function getFunName(query) {
	return request({
		url: `${base}/GetFunName`,
		method: 'get',
		params: query,
	})
}

export function getSeqName(query) {
	return request({
		url: `${base}/GetSeqName`,
		method: 'get',
		params: query,
	})
}

export function getSeq(query) {
	return request({
		url: `${base}/GetSeq`,
		method: 'get',
		params: query,
	})
}