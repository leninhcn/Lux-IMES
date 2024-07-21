export const inputData = {
	workOrder: '',
	partNo: '',
	line: '',
	stationName: '',
	stationType: '',
	empNo: '',
	errorCode: 'N/A',
	snList: [],
	machineList: [],
	toolingList: [],
	carrierList: [],
	kpsnInfoList: [],
	lotIdInfoList: [],
	barCodeList: [],
	ipnInfoList: [],
	noPartSNList: [],
	hddList: [],
	aLLabelInfoList: [],

	currInputData: '',
	mainSN: '',
	csn: '',
	mpsn: '',

	newPanel: '',

	snToPanel: false,
	panelNo: '',

}

export const InputActionType =
{
	WorkOrder: 'WorkOrder',

	Machine: 'Machine',

	Tooling: 'Tooling',

	SerialNumber: 'SerialNumber',

	KeyPartSN: 'KeyPartSN',

	LotId: 'LotId',

	BarCode: 'BarCode',

	ErrorCode: 'ErrorCode',

	ESOPCompare: 'ESOPCompare',

	ItemPart: 'ItemPart',

	NoPartSN: 'NoPartSN',

	CustomerSN: 'CustomerSN',

	MPSN: 'MPSN',

	CHKSerialNumber: 'CHKSerialNumber',

	IPN: 'IPN',

	PO: 'PO',
	ItemPartPrint: 'ItemPartPrint',

	Panel: 'Panel',
}

export const InputSnActionType =
{
	SN_PASS: "SN_PASS",
	SN_PASS_N: "SN_PASS_N",
	KPSN_INPUT: "KPSN_INPUT",
	SN2WO_INPUT: "SN2WO_INPUT",

	SN_PASS_PANEL: "SN_PASS_PANEL",

	SN_PASS_NEW_PANEL: "SN_PASS_NEW_PANEL",

	KPSN_INPUT_NOWO: "KPSN_INPUT_NOWO",

	SN_PASS_NFC_READER: "SN_PASS_NFC_READER",

	SN_PASS_BUNDLE: "SN_PASS_BUNDLE",

	SN_PASS_NFC_READER_FAIL: "SN_PASS_NFC_READER_FAIL",

	SN_PASS_CHK_HDD: "SN_PASS_CHK_HDD",

	SN_PRINT_FIXED_ASSETS: "SN_PRINT_FIXED_ASSETS",
	AL_SN_PRINT_FIXED_ASSETS: "AL_SN_PRINT_FIXED_ASSETS",
}

export const InputLotActionType =
{
	LOT_ID_NO_WO: "LOT_ID_NO_WO",

	LOT_ID: "LOT_ID",

	LOT_ID_COUNTER: "LOT_ID_COUNTER",
	REEL_NO: "REEL_NO",
}

export const InputToolActionType =
{
	CARRIER: "CARRIER",

	TOOLING: "TOOLING",
}
export const InputNpsnActionType =
{
	MAC: "MAC",

	MAC_AUTO: "MAC_AUTO",
	DIMM_REEL: "DIMM_REEL",
}

export const InputChkActionType =
{
	SerialNumber: "SerialNumber",
	CheckHdd: "CheckHdd",
	ReplaceSn: "ReplaceSn",
}