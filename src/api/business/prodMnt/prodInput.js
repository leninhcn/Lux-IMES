import request from '@/utils/request'

/**
* 分页查询
* @param {查询条件} data
*/
const base = 'prodMnt/prodInput'

export function getStationInfo(query) {
	return request({
		url: `${base}/GetStationInfo`,
		method: 'get',
		params: query,
	})
}

export function getLineWo(query) {
	return request({
		url: `${base}/GetLineWo`,
		method: 'get',
		params: query,
	})
}

export function getOprateStep(query) {
	return request({
		url: `${base}/GetOprateStep`,
		method: 'get',
		params: query,
	})
}

export function checkSNStatus(query) {
	return request({
		url: `${base}/CheckSNStatus`,
		method: 'get',
		params: query,
	})
}

export function getWoSnStatus(query) {
	return request({
		url: `${base}/GetWoSnStatus`,
		method: 'get',
		params: query,
	})
}

export function getValues(query) {
	return request({
		url: `${base}/GetValues`,
		method: 'get',
		params: query,
	})
}

export function checkValue(query) {
	return request({
		url: `${base}/CheckValue`,
		method: 'get',
		params: query,
	})
}

export function getPamSn(query) {
	return request({
		url: `${base}/GetPamSn`,
		method: 'get',
		params: query,
	})
}

export function getSNLinkKpsnInfo(query) {
	return request({
		url: `${base}/GetSNLinkKpsnInfo`,
		method: 'get',
		params: query,
	})
}

export function clearGetSN(query) {
	return request({
		url: `${base}/ClearGetSN`,
		method: 'get',
		params: query,
	})
}

export function getWoBomKeyparts(query) {
	return request({
		url: `${base}/GetWoBomKeyparts`,
		method: 'get',
		params: query,
	})
}

export function getStationLinkCount(query) {
	return request({
		url: `${base}/GetStationLinkCount`,
		method: 'get',
		params: query,
	})
}

export function getEmpWoPassCount(query) {
	return request({
		url: `${base}/GetEmpWoPassCount`,
		method: 'get',
		params: query,
	})
}

export function checkKpsn(query) {
	return request({
		url: `${base}/CheckKpsn`,
		method: 'get',
		params: query,
	})
}

export function checkStockOut(query) {
	return request({
		url: `${base}/CheckStockOut`,
		method: 'get',
		params: query,
	})
}

export function checkLogic(query) {
	return request({
		url: `${base}/CheckLogic`,
		method: 'get',
		params: query,
	})
}