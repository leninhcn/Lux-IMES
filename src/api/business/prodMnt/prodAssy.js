import request from '@/utils/request'

const base = 'prodMnt/prodAssy'

export function getStationActionList(query) {
	return request({
		url: `${base}/GetStationActionList`,
		method: 'get',
		params: query,
	})
}

export function checkIsLotAssy(query) {
	return request({
		url: `${base}/CheckIsLotAssy`,
		method: 'get',
		params: query,
	})
}

export function getWoList(query) {
	return request({
		url: `${base}/GetWoList`,
		method: 'get',
		params: query,
	})
}

export function getModel(query) {
	return request({
		url: `${base}/GetModel`,
		method: 'get',
		params: query,
	})
}

export function getMainSn(query) {
	return request({
		url: `${base}/GetMainSn`,
		method: 'get',
		params: query,
	})
}

export function getSnInfoBySn(query) {
	return request({
		url: `${base}/GetSnInfoBySn`,
		method: 'get',
		params: query,
	})
}

export function checkWo(query) {
	return request({
		url: `${base}/CheckWo`,
		method: 'get',
		params: query,
	})
}

export function getWoInfoByWo(query) {
	return request({
		url: `${base}/GetWoInfoByWo`,
		method: 'get',
		params: query,
	})
}

export function getBomInfosByWO(query) {
	return request({
		url: `${base}/GetBomInfosByWO`,
		method: 'get',
		params: query,
	})
}

export function checkMachine(query) {
	return request({
		url: `${base}/CheckMachine`,
		method: 'get',
		params: query,
	})
}

export function checkTooling(query) {
	return request({
		url: `${base}/CheckTooling`,
		method: 'get',
		params: query,
	})
}

export function checkCarrier(query) {
	return request({
		url: `${base}/CheckCarrier`,
		method: 'get',
		params: query,
	})
}

export function checkSNInput1WO(query) {
	return request({
		url: `${base}/CheckSNInput1WO`,
		method: 'get',
		params: query,
	})
}

export function checkIsErrorCode(query) {
	return request({
		url: `${base}/CheckIsErrorCode`,
		method: 'get',
		params: query,
	})
}

export function checkSnBefore(query) {
	return request({
		url: `${base}/CheckSnBefore`,
		method: 'get',
		params: query,
	})
}

export function checkEssTest(query) {
	return request({
		url: `${base}/CheckEssTest`,
		method: 'get',
		params: query,
	})
}

export function checkKpsnIputMPN(query) {
	return request({
		url: `${base}/CheckKpsnIputMPN`,
		method: 'get',
		params: query,
	})
}

export function checkPalos(query) {
	return request({
		url: `${base}/CheckPalos`,
		method: 'get',
		params: query,
	})
}

export function checkSnPass(query) {
	return request({
		url: `${base}/CheckSnPass`,
		method: 'get',
		params: query,
	})
}

export function check5DX(query) {
	return request({
		url: `${base}/Check5DX`,
		method: 'get',
		params: query,
	})
}

export function getItemInfo(query) {
	return request({
		url: `${base}/GetItemInfo`,
		method: 'get',
		params: query,
	})
}

export function getBomInfosBySN(query) {
	return request({
		url: `${base}/GetBomInfosBySN`,
		method: 'get',
		params: query,
	})
}

export function getCompareImageFileName(query) {
	return request({
		url: `${base}/GetCompareImageFileName`,
		method: 'get',
		params: query,
	})
}

export function getPanelLinkQtyBySN(query) {
	return request({
		url: `${base}/GetPanelLinkQtyBySN`,
		method: 'get',
		params: query,
	})
}

export function checkSNInput2WO(query) {
	return request({
		url: `${base}/CheckSNInput2WO`,
		method: 'get',
		params: query,
	})
}

export function checkSnPassPanel(query) {
	return request({
		url: `${base}/CheckSnPassPanel`,
		method: 'get',
		params: query,
	})
}

export function checkSnPassBundle(query) {
	return request({
		url: `${base}/CheckSnPassBundle`,
		method: 'get',
		params: query,
	})
}

export function checkSNInputNoWo(query) {
	return request({
		url: `${base}/CheckSNInputNoWo`,
		method: 'get',
		params: query,
	})
}

export function getHDDInfo(query) {
	return request({
		url: `${base}/GetHDDInfo`,
		method: 'get',
		params: query,
	})
}

export function checkFixedAssets(query) {
	return request({
		url: `${base}/CheckFixedAssets`,
		method: 'get',
		params: query,
	})
}

export function relieveLink(query) {
	return request({
		url: `${base}/RelieveLink`,
		method: 'get',
		params: query,
	})
}

export function getIPNAPNBySN(query) {
	return request({
		url: `${base}/GetIPNAPNBySN`,
		method: 'get',
		params: query,
	})
}

export function getRule(query) {
	return request({
		url: `${base}/GetRule`,
		method: 'get',
		params: query,
	})
}

export function checkIPN(query) {
	return request({
		url: `${base}/CheckIPN`,
		method: 'get',
		params: query,
	})
}

export function checkALFixedAssetsIsExist(query) {
	return request({
		url: `${base}/checkALFixedAssetsIsExist`,
		method: 'get',
		params: query,
	})
}

export function getTdId(query) {
	return request({
		url: `${base}/GetTdId`,
		method: 'get',
		params: query,
	})
}

export function insertALLabelInfo(query) {
	return request({
		url: `${base}/InsertALLabelInfo`,
		method: 'get',
		params: query,
	})
}