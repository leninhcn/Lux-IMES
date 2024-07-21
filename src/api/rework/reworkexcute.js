import request from '@/utils/request'
//查询spec
export function querySpec(query) {
	return request({
		url: 'rework/excute/spec',
		method: 'get',
		params: query,
	})
}

//查询reworkno
export function queryReworkno(query) {
	return request({
		url: 'rework/excute/reworkno',
		method: 'get',
		params: query,
	})
}

//查询stationOptions
export function queryStationOptions(query) {
	return request({
		url: 'rework/excute/stationoptions',
		method: 'get',
		params: query,
	})
}


//查询stationOptions
export function queryRouteName(query) {
	return request({
		url: 'rework/excute/route',
		method: 'get',
		params: query,
	})
}


//重工操作之前相应的检查
export function preCheck(query) {
	return request({
		url: 'rework/excute/precheck',
		method: 'get',
		params: query,
	})
}

//执行重工操作
export function excuteRework(data) {
	return request({
		url: 'rework/excute',
		method: 'post',
		data: data,
	})
}