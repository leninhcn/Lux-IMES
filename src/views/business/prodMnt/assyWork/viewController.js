import { ElMessage, ElMessageBox } from 'element-plus'
import {
	inputData,
	InputActionType,
	InputSnActionType,
	InputLotActionType,
	InputToolActionType,
	InputNpsnActionType,
	InputChkActionType
} from './models.js'
import dayjs from 'dayjs'
import * as api from '@/api/business/prodMnt/prodAssy.js'

//consts
const stationInfoKey = 'AssyWork.stationInfo'
const ERROR = 'error'
const SUCCESS = 'success'
const WARM = 'error' //2
const OK = 'success' //3
const NORMAL = '-1'
const PENDING_OK = '4'
const PASS_OK = '5'

//fields
const state = reactive({
	stationInfo: {
		line: '',
		stage: '',
		stationType: '',
		station: '',
	},

	actionDesc: '',

	woList: [],

	inputBomData: [],
	bindItemsData: [],
	bomData: [],

	input: '',

	info: '',
	mainSn: '',
	snWo: '',
	snIpn: '',
	snLine: '',

	curWo: '',

	windowMsg: 'Standby',
	windowStateAttr: {
		bg: 'red'
	},
	windowStateText: '',
})

const viewState = reactive({
	showStationConfig: false,

	input: {
		label: 'Input',
		readonly: false,
		disabled: false,
		focused: false,
	},

	showWoList: true,
})

let stationActions = []
let curStationAction = null

let isLotAssy = false
let ctrlStep = 0

let isFixedAssts = false
let needPrint = true

//watch
function initWatches() {
	watch(() => state.stationInfo, initFormData)
}

//methods
const switchStationConfig = (visible) => {
	viewState.showStationConfig = visible
}

function windowState(bg, stateMsg) {
	state.windowStateAttr.bg = bg
	state.windowStateText = stateMsg
}

function showMessage(msg, level) {
	state.windowMsg = msg
	if (level === ERROR)
		windowState('red', '')
	else if (level === SUCCESS)
		windowState('green', '')
	else if (level == NORMAL)
		windowState('white', '')
}

const loadStation = async () => {
	const res = await api.getStationActionList({
		lineName: state.stationInfo.line,
		stageName: state.stationInfo.stage,
		stationType: state.stationInfo.stationType,
		stationName: state.stationInfo.station,
	})

	const result = { ok: true, msg: '' }

	if (!res.list || res.list.length == 0) {
		result.ok = false
		result.msg = 'Station Name Or Station Type Not Setting Action'
	}
	else
		stationActions = res.list

	return result
}

async function initFormData() {
	let ret = await loadStation()
	if (!ret.ok) {
		showMessage(ret.msg, ERROR)
		return
	}

	viewState.input.readonly = false
	viewState.input.disabled = false
	viewState.input.focused = true
	state.input = ''

	if (stationActions.length == 0) {
		viewState.input.disabled = true
		return
	}

	if (stationActions.reduce((p, val) => p + (val.valueKind == "L" ? 1 : 0)) == 0) {
		viewState.input.disabled = true
		showMessage('Station Action Error,No Found Last Input', ERROR)

		return
	}

	const res = await api.checkIsLotAssy({ line: state.stationInfo.line, stationType: state.stationInfo.stationType })
	isLotAssy = res.isLotAssy

	curStationAction = stationActions.find(val => val.step == 1)

	ctrlStep = 1
	inputData.stationName = state.stationInfo.station
	inputData.stationType = state.stationInfo.stationType

	viewState.input.label = curStationAction.typeName
	state.actionDesc = `请输入：${curStationAction.typeDesc}`

	state.inputBomData = []
	state.bindItemsData = []
	state.bomData = []

	//打印逻辑不处理
	//自动读码不处理

	if (curStationAction.typeName == InputActionType.WorkOrder) {
		viewState.showWoList = true

		const res = await api.getWoList({ station: state.stationInfo.station, cmd: 'NORMAL-WO' })
		state.woList = res.list

		if (!res.ok) {
			showMessage(res.msg, ERROR)
		}
	} else {
		viewState.showWoList = false
	}

	if (stationActions.reduce((p, val) => p + (val.jobName == InputSnActionType.SN_PASS_NFC_READER_FAIL ? 1 : 0)) > 0) {
		//nfc 逻辑不处理
	}

	state.info = ''
	showMessage('Standby', NORMAL)
}

function clearMultiData() {
	for (const item of stationActions) {
		if (item.typeName == InputActionType.Machine && item.valueKind != "O") {
			inputData.machineList = []
			item.inputCount = 0
		}

		if (item.typeName == InputActionType.Tooling && item.valueKind != "O")//Once-->O 
		{
			inputData.toolingList = []
			item.inputCount = 0
		}

		if (item.typeName == InputActionType.LotId && item.valueKind != "O") {
			inputData.lotIdInfoList = []
			item.inputCount = 0
		}

		if (item.typeName == InputActionType.KeyPartSN && item.valueKind != "O") {
			inputData.kpsnInfoList = []
			item.inputCount = 0
		}

		if (item.typeName == InputActionType.ItemPart && item.valueKind != "O") {
			inputData.ipnInfoList = []
			item.inputCount = 0
		}

		if (item.typeName == InputActionType.NoPartSN && item.valueKind != "O") {
			inputData.noPartSNList = []
			item.inputCount = 0
		}

		if (item.valueKind != "O") {
			item.inputCount = 0
		}
	}
}

function resetInputData() {
	if (stationActions.length == 0) return
	clearMultiData()
	state.inputBomData = []

	const count = stationActions.reduce((p, val) => {
		return p + (val.jobName == InputSnActionType.SN_PASS ? 1 : 0)
	})
	if (count > 0) {
		inputData.workOrder = ''
		inputData.partNo = ''
		inputData.line = ''
	}

	inputData.snToPanel = false
	inputData.snToBundle = false
	inputData.newPanel = ''
	inputData.mainSN = ''
	inputData.currInputData = ''
	inputData.snList = []
	inputData.carrierList = []
	inputData.kpsnInfoList = []
	inputData.ipnInfoList = []
	inputData.errorCode = 'N/A'
	inputData.barCodeList = []

	inputData.mpsn = ''
	inputData.csn = ''

	inputData.lotIdInfoList = []
	inputData.panelNo = ''
	inputData.machineList = []
	inputData.toolingList = []
	inputData.hddList = []
}

function clearFormData() {
	if (curStationAction.typeName == InputActionType.SerialNumber
		&& curStationAction.jobName != InputSnActionType.KPSN_INPUT
		&& curStationAction.jobName != InputSnActionType.SN2WO_INPUT
		&& curStationAction.jobName != InputSnActionType.KPSN_INPUT_NOWO) {
		state.snIpn = ''
		state.snLine = ''
		state.snWo = ''
		state.info = ''

		if (stationActions.filter(q => q.jobName == "REEL_NO").length <= 0) {
			state.bomData = [] //dgvBom.Clear()
		}

		state.inputBomData = [] //dgvMappingData.Clear()
		state.bindItemsData = [] //dgvItemIPN.Clear()

		if (curStationAction.typeName == InputActionType.SerialNumber) {
			state.mainSn = ''

			if (stationActions.filter(q => q.jobName == "REEL_NO").length <= 0) {
				state.bomData = []
			}
			state.inputBomData = []
			state.bindItemsData = []
		}
		//soundFile = ""

		showMessage(' ', NORMAL)
	}
}

function refreshPPartWO() {

}

async function transferSn() {

}

async function checkKpsnInputMpn() {
	//内存8031开头料号都要检查,---贺鑫龙要求
	let mpn = ""

	if (inputData.partNo.substring(0, 4) == "8031") {
		// Frm_InputData f = new Frm_InputData()
		// try {
		// 	f.text = "请输入MPN"
		// 	if (f.showDialog() == DialogResult.oK)
		// 		mpn = f.strData
		// }
		// finally {
		// 	f.dispose()
		// }

		// 检查MPN特征码规则，

		const res = await api.checkKpsnIputMPN({ mpn, ipn: inputData.partNo })
		if (!res.ok) {
			showMessage(res.msg, ERROR)
			return false
		}
		return true
	}
	return true
}

async function checkInputDataCore() {
	switch (curStationAction.typeName) {
		case InputActionType.WorkOrder:
			{
				const mainsn = (await api.getMainSn({ input: inputData.currInputData, station: inputData.stationName })).data
				const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
				if (snInfo) {
					inputData.currInputData = snInfo.workOrder
				}

				let res = await api.checkWo({ wo: inputData.currInputData, station: inputData.stationName })
				if (!res.ok) {
					showMessage(res.msg, ERROR)
					return false
				}
				else {
					const woInfo = (await api.getWoInfoByWo({ wo: inputData.currInputData })).data
					if (!woInfo) {
						showMessage('Work Order Error', ERROR)
						return false
					}

					inputData.workOrder = woInfo.workOrder
					inputData.partNo = woInfo.partNo
					inputData.line = woInfo.line

					state.snLine = inputData.line
					state.snIpn = inputData.partNo
					state.snWo = inputData.workOrder

					curStationAction.inputCount++

					if (curStationAction.showBom) {
						const res = await api.getBomInfosByWO(inputData.stationType, inputData.workOrder)

						state.bomData = res.data

						//setPartBomColor(inputData)
						//dgvBom.refresh()
					}

					if (curStationAction.loopCount == curStationAction.inputCount) {
						if (curStationAction.valueKind == "L") {
							await transferSn()
							curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
							ctrlStep = curStationAction.step
						}
						else {
							showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
							ctrlStep++
							curStationAction = stationActions.find(q => q.step == ctrlStep)
						}
					}
					else {
						showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
					}
				}
				break
			}
		case InputActionType.Machine:
			{
				const machineno = inputData.currInputData
				if (machineno.toUpperCase() == "END") {
					if (curStationAction.valueKind == "L") {
						await transferSn()
						curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
						ctrlStep = curStationAction.step
					}
					else {
						showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)

						ctrlStep++
						curStationAction = stationActions.find(q => q.step == ctrlStep)
					}
					break
				}

				if (inputData.machineList.filter(q => q == machineno).length > 0) {
					showMessage("Machine No input Duplicate", ERROR)
					return false
				}
				const res = await api.checkMachine({
					station: inputData.stationName,
					wo: inputData.workOrder,
					sn: inputData.mainSN,
					machine: inputData.currInputData
				})
				if (!res.ok) {
					showMessage(res.msg, ERROR)
					return false
				}
				else {
					curStationAction.inputCount++
					inputData.machineList.push(machineno)
					if (curStationAction.loopCount == curStationAction.inputCount) {
						if (curStationAction.valueKind == "L") {
							await transferSn()
							curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
							ctrlStep = curStationAction.step
						}
						else {
							showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
							ctrlStep++
							curStationAction = stationActions.find(q => q.step == ctrlStep)
						}
					}
					else {
						showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
					}
				}

				break
			}
		case InputActionType.Tooling:
			{
				const toolno = inputData.currInputData
				if (toolno.toUpperCase() == "END") {
					if (curStationAction.valueKind == "L") {
						await transferSn()
						curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
						ctrlStep = curStationAction.step
					}
					else {
						showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)

						ctrlStep++
						curStationAction = stationActions.find(q => q.step == ctrlStep)
					}
					break
				}
				if (inputData.toolingList.filter(q => q == toolno).length > 0) {
					showMessage("Tool No input Duplicate", ERROR)
					return false
				}

				if (inputData.carrierList.filter(q => q == toolno).length > 0) {
					showMessage("Carrier No input Duplicate", ERROR)
					return false
				}

				switch (curStationAction.jobName) {
					case InputToolActionType.TOOLING:
						{
							const res = await api.checkTooling({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
								tool: inputData.currInputData
							})
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							inputData.toolingList.push(toolno)
							break
						}
					case InputToolActionType.CARRIER:
						{
							const res = await api.checkCarrier({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
								carrier: inputData.currInputData
							})
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							inputData.carrierList.push(toolno)
							break
						}
				}
				// lot 计数
				if (isLotAssy) {
					inputData.currInputData = inputData.stationType //后端来加上：+ "-" + Guid.newGuid().toString("N").toUpperCase()

					const res = await api.checkSNInput1WO({
						station: inputData.stationName,
						wo: inputData.workOrder,
						sn: inputData.currInputData,
					})
					if (!res.ok) {
						showMessage(res.msg, ERROR)
						return false
					}
					else {
						inputData.mainSN = inputData.currInputData

						state.mainSn = inputData.mainSN
						inputData.snList.push(inputData.currInputData)
					}
				}

				curStationAction.inputCount++

				if (curStationAction.loopCount == curStationAction.inputCount) {
					if (curStationAction.valueKind == "L") {
						await transferSn()
						curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
						ctrlStep = curStationAction.step
					}
					else {
						showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)

						ctrlStep++
						curStationAction = stationActions.find(q => q.step == ctrlStep)
					}
				}
				else {
					showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
				}

				break
			}
		case InputActionType.SerialNumber:
			{
				const input = inputData.currInputData

				inputData.currInputData = input

				if ((await api.checkIsErrorCode({ ecode: input })).yes) //查到不良代码
				{
					inputData.errorCode = input
					showMessage("Error Code Input OK", WARM)
					return true
				}

				let res = await api.checkSnBefore({
					station: inputData.stationName,
					wo: inputData.workOrder,
					sn: inputData.currInputData,
				})
				if (!res.ok) {
					showMessage(res.msg, ERROR)
					return false
				}
				if (inputData.snList != null && inputData.snList.filter(q => q == input).length > 0) {
					showMessage("Serial Number input Duplicate", ERROR)
					return false
				}

				//检查是否测试过ESS,测试过ESS弹窗提示确认
				res = await api.checkEssTest(inputData)
				if (res.ok) {
					try {
						await ElMessageBox.confirm(
							'该台整机做过ESS测试，请复核硬盘有无漏装、有无装错位置！',
							'提示信息',
							{
								confirmButtonText: 'YES',
								cancelButtonClass: 'NO',
								type: 'warning'
							}
						)
					}
					catch {
						showMessage("ESS测试后需复核硬盘位置！", ERROR)
						return false
					}
					//DialogResult dr = MessageBox.show("该台整机做过ESS测试，请复核硬盘有无漏装、有无装错位置！", "提示信息", MessageBoxButtons.yesNo, MessageBoxIcon.hand)
					// if (dr == DialogResult.no) {

					// }
				}
				switch (curStationAction.jobName) {
					case InputSnActionType.KPSN_INPUT:
						{
							if (string.isNullOrEmpty(inputData.workOrder)) {
								showMessage("Work Order is null,Cannot input", ERROR)
								return false
							}
							if (!checkKpsnInputMpn()) {
								//  showMessage("输入料件MPN错误！", ERROR)
								return false
							}

							const res = await api.checkSNInput1WO({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.currInputData,
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								inputData.mainSN = inputData.currInputData
								state.mainSn = inputData.mainSN
								curStationAction.inputCount++
								inputData.snList.push(inputData.currInputData)
								if (curStationAction.loopCount == curStationAction.inputCount) {
									if (curStationAction.valueKind == "L") {
										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)

										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)

									}
								}
								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}
							break
						}
					case InputSnActionType.SN_PASS:
						{
							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
							if (!snInfo) {
								showMessage(res.msg, ERROR)
								return false
							}

							if (inputData.workOrder != snInfo.workOrder && stationActions.filter(q => q.jobName == "REEL_NO").length > 0) {
								showMessage(mainsn + "工单:" + snInfo.workOrder + "与lot上料的工单:" + inputData.workOrder + "不一致！", ERROR)
								return false
							}

							inputData.mainSN = snInfo.mainSN
							inputData.workOrder = snInfo.workOrder
							inputData.partNo = snInfo.partNo
							inputData.line = snInfo.line

							res = await api.checkPalos(mainsn)
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							//5dx 检查自动化过站比例20%，低于20%不允许扫描过站---柳笑需求，---李超20221128
							res = await api.check5DX(inputData)
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							res = await api.checkSnPass({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								//显示已经link 的是 item_ipn item_sn
								//KpsnInfo kpsnInfo = new KpsnInfo()
								const data = (await api.getItemInfo({ sn: inputData.mainSN })).data
								state.bindItemsData = data

								if (curStationAction.checkLine && snInfo.line != state.stationInfo.line) {
									showMessage("工单设置默认线别与当前线别不一致！", ERROR)
									return false
								}
								if (curStationAction.showBom) {
									const bomInfos = (await api.getBomInfosBySN({
										stationType: inputData.stationType,
										sn: inputData.mainSN
									})).data

									state.bomData = bomInfos

									// SetPartBomColor(inputData)
									// dgvBom.refresh()
								}

								//显示站点BOM
								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN

								inputData.snList.push(mainsn)
								curStationAction.inputCount++
								const soundfile = ''

								//更新lot投入数量,检查数量是否够用
								if (inputData.lotIdInfoList.length > 0 && stationActions.filter(q => q.jobName == "REEL_NO").length > 0) {
									for (const item of inputData.lotIdInfoList) {
										const bomInfos = state.bomData
										for (const itempartbom of bomInfos.filter(q => q.itemPartDesc == item.lotPartDesc && q.itemPartDesc != "0" && q.itemCount != q.ipnFinishCount)) {
											bomInfos.find(q => q.itemPartNo == itempartbom.itemPartNo && q.itemPartCode == itempartbom.itemPartCode).ipnFinishCount += item.length
										}
									}
									// SetPartBomColor(inputData)
									// dgvBom.refresh()
								}

								//播放声音先不使用
								// if (mesOperate.getStationSound(inputData, out soundfile)) {
								// 	if (!string.isNullOrEmpty(soundfile)) {
								// 		soundFile = soundfile
								// 		if (soundfile.toLower().endsWith(".wav"))
								// 			CommHelper.playSoundAsyncByFile(soundfile)
								// 		else if (soundfile.toLower().endsWith(".mp3"))
								// 			CommHelper.playMusic(soundfile)
								// 	}
								// }
								if (curStationAction.loopCount == curStationAction.inputCount) {
									const res = await api.getCompareImageFileName({
										station: inputData.stationName,
										wo: inputData.workOrder,
										sn: inputData.mainSN,
									})

									if (res.ok) {
										const filestr = res.data
										if (filestr) {
											const fileList = filestr.split('|')
											//LoadCompareImage(fileList)
											showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
											ctrlStep++
											if (ctrlStep <= stationActions.length) {
												curStationAction = stationActions.find(q => q.step == ctrlStep)
												return {}
											}
										}
									}

									if (curStationAction.valueKind == "L") {
										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)

									}
								}
								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}
							break
						}
					case InputSnActionType.SN_PASS_N:
						{
							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
							if (!snInfo) {
								showMessage(res.msg, ERROR)
								return false
							}

							inputData.mainSN = snInfo.mainSN
							inputData.workOrder = snInfo.workOrder
							inputData.partNo = snInfo.partNo
							inputData.line = snInfo.line

							res = await api.checkSnPass({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								const data = (await api.getItemInfo({ sn: inputData.mainSN })).data
								state.bindItemsData = data

								if (curStationAction.checkLine && snInfo.line != state.stationInfo.line) {
									showMessage("SN Line Different", ERROR)
									return false
								}
								if (curStationAction.showBom) {
									const bomInfos = (await api.getBomInfosBySN({
										stationType: inputData.stationType,
										sn: inputData.mainSN
									})).data

									state.bomData = bomInfos

									// setPartBomColor(inputData)
									// dgvBom.refresh()
								}
								//显示站点BOM

								//获取 IPN 的连板数
								if (inputData.snList.length == 0) {
									const iPanelqty = (await api.getPanelLinkQtyBySN({
										sn: inputData.mainSN
									})).data

									if (iPanelqty != 0) {
										curStationAction.loopCount = iPanelqty
									}
								}

								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN
								inputData.snList.push(mainsn)
								// panelno 等于第一个SN
								inputData.panelNo = inputData.snList[0].toString()

								curStationAction.inputCount++
								const soundfile = ''

								if (curStationAction.loopCount == curStationAction.inputCount) {
									const res = await api.getCompareImageFileName({
										station: inputData.stationName,
										wo: inputData.workOrder,
										sn: inputData.mainSN,
									})

									if (res.ok) {
										const filestr = res.data
										if (filestr) {
											const fileList = filestr.split('|')
											//LoadCompareImage(fileList)
											showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
											ctrlStep++
											if (ctrlStep <= stationActions.length) {
												curStationAction = stationActions.find(q => q.step == ctrlStep)
												return {}
											}
										}
									}

									if (curStationAction.valueKind == "L") {

										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)

									}
								}
								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}

							break
						}
					case InputSnActionType.SN2WO_INPUT:
						{
							if (!inputData.workOrder) {
								showMessage("Work Order is null,Cannot input", ERROR)
								return false
							}

							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							inputData.mainSN = mainsn

							res = await api.checkSNInput2WO({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								curStationAction.inputCount++
								inputData.snList.push(mainsn)
								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN
								if (curStationAction.loopCount == curStationAction.inputCount) {
									if (curStationAction.valueKind == "L") {

										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)

									}
								}
								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}
							break
						}
					case InputSnActionType.SN_PASS_PANEL:
						{
							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
							if (!snInfo) {
								showMessage(res.msg, ERROR)
								return false
							}

							inputData.mainSN = snInfo.mainSN
							inputData.workOrder = snInfo.workOrder
							inputData.partNo = snInfo.partNo
							inputData.line = snInfo.line

							res = await api.checkSnPassPanel({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								if (curStationAction.showBom) {
									const bomInfos = (await api.getBomInfosBySN({
										stationType: inputData.stationType,
										sn: inputData.mainSN
									})).data

									state.bomData = bomInfos
								}

								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN
								inputData.snList.push(mainsn)
								curStationAction.inputCount++
								if (curStationAction.loopCount == curStationAction.inputCount) {
									if (curStationAction.valueKind == "L") {
										inputData.snToPanel = true
										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)

									}
								}

								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}

							break
						}

					case InputSnActionType.SN_PASS_BUNDLE:
						{
							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
							if (!snInfo) {
								showMessage(res.msg, ERROR)
								return false
							}

							inputData.mainSN = snInfo.mainSN
							inputData.workOrder = snInfo.workOrder
							inputData.partNo = snInfo.partNo
							inputData.line = snInfo.line

							res = await api.checkSnPassBundle({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								if (curStationAction.showBom) {
									const bomInfos = (await api.getBomInfosBySN({
										stationType: inputData.stationType,
										sn: inputData.mainSN
									})).data

									state.bomData = bomInfos
								}

								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN
								inputData.snList.push(mainsn)
								curStationAction.inputCount++
								if (curStationAction.loopCount == curStationAction.inputCount) {
									if (curStationAction.valueKind == "L") {
										inputData.snToBundle = true
										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)

									}
								}

								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}
							break
						}
					case InputSnActionType.SN_PASS_NEW_PANEL:
						{
							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
							if (!snInfo) {
								showMessage(res.msg, ERROR)
								return false
							}

							if (inputData.snList != null && inputData.snList.filter(q => q == snInfo.mainSN).length > 0) {
								showMessage("Serial Number input Duplicate", ERROR)
								return false

							}
							inputData.mainSN = snInfo.mainSN
							inputData.workOrder = snInfo.workOrder
							inputData.partNo = snInfo.partNo
							inputData.line = snInfo.line

							res = await api.checkSnPass({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								if (curStationAction.showBom) {
									const bomInfos = (await api.getBomInfosBySN({
										stationType: inputData.stationType,
										sn: inputData.mainSN
									})).data

									state.bomData = bomInfos
								}
								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN
								inputData.snList.push(mainsn)
								curStationAction.inputCount++

								if (curStationAction.inputCount == 1) {
									//guid js
									inputData.newPanel = inputData.stationType + "-" + Guid.newGuid().toString("N")
								}

								if (curStationAction.loopCount == curStationAction.inputCount) {
									if (curStationAction.valueKind == "L") {

										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)

									}
								}
								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}

							break
						}
					case InputSnActionType.KPSN_INPUT_NOWO:
						{
							let res = api.checkSNInputNoWo({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.currInputData,
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								const snInfo = (await api.getSnInfoBySn({ mainSn: inputData.currInputData })).data
								if (!snInfo) {
									showMessage(res.msg, ERROR)
									return false
								}

								inputData.mainSN = snInfo.mainSN
								inputData.workOrder = snInfo.workOrder
								inputData.partNo = snInfo.partNo
								inputData.line = snInfo.line

								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN
								curStationAction.inputCount++
								inputData.snList.push(inputData.currInputData)
								if (curStationAction.loopCount == curStationAction.inputCount) {
									if (curStationAction.valueKind == "L") {

										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)

										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)
									}
								}
								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}
							break
						}
					case InputSnActionType.SN_PASS_CHK_HDD:
						{
							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
							if (!snInfo) {
								showMessage(res.msg, ERROR)
								return false
							}

							inputData.mainSN = snInfo.mainSN
							inputData.workOrder = snInfo.workOrder
							inputData.partNo = snInfo.partNo
							inputData.line = snInfo.line

							res = await api.checkSnPass({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								inputData.hddList = []
								//显示已经link 的是 item_ipn item_sn
								//KpsnInfo kpsnInfo = new KpsnInfo()
								const dt = (await api.getHDDInfo(inputData)).data
								if (dt.length > 0) {
									for (const ds of dt) {
										inputData.hddList.push(ds["ITEM_SN"].toString())
									}
								}
								else {
									showMessage(inputData.mainSN + "未查询到硬盘信息！", ERROR)
								}
								if (curStationAction.showBom) {
									const bomInfos = (await api.getBomInfosBySN({
										stationType: inputData.stationType,
										sn: inputData.mainSN
									})).data

									state.bomData = bomInfos

									// setPartBomColor(inputData)
									// dgvBom.refresh()

									//显示站点BOM
									state.snLine = inputData.line
									state.snIpn = inputData.partNo
									state.snWo = inputData.workOrder
									state.mainSn = inputData.mainSN
									inputData.snList.push(mainsn)
									curStationAction.inputCount++
									let soundfile = ''

									//播放声音先不使用
									// if (mesOperate.getStationSound(inputData, out soundfile)) {
									// 	if (!string.isNullOrEmpty(soundfile)) {
									// 		soundFile = soundfile
									// 		if (soundfile.toLower().endsWith(".wav"))
									// 			CommHelper.playSoundAsyncByFile(soundfile)
									// 		else if (soundfile.toLower().endsWith(".mp3"))
									// 			CommHelper.playMusic(soundfile)
									// 	}
									// }
									if (curStationAction.loopCount == curStationAction.inputCount) {
										const res = await api.getCompareImageFileName({
											station: inputData.stationName,
											wo: inputData.workOrder,
											sn: inputData.mainSN,
										})

										if (res.ok) {
											const filestr = res.data
											if (filestr) {
												const fileList = filestr.split('|')
												//LoadCompareImage(fileList)
												showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
												ctrlStep++
												if (ctrlStep <= stationActions.length) {
													curStationAction = stationActions.find(q => q.step == ctrlStep)
													return {}
												}
											}
										}

										if (curStationAction.valueKind == "L") {

											await transferSn()
											curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
											ctrlStep = curStationAction.step
										}
										else {
											showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
											ctrlStep++
											curStationAction = stationActions.find(q => q.step == ctrlStep)

										}
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
									}
								}
								break
							}
						}
					case InputSnActionType.SN_PRINT_FIXED_ASSETS:
						{
							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
							if (!snInfo) {
								showMessage(res.msg, ERROR)
								return false
							}

							inputData.mainSN = snInfo.mainSN
							inputData.workOrder = snInfo.workOrder
							inputData.partNo = snInfo.partNo
							inputData.line = snInfo.line

							res = await api.checkSnPass({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})
							if (!res.ok) {
								showMessage(mesOperate.msg, ERROR)
								return false
							}
							else {
								//显示已经link 的是 item_ipn item_sn
								//KpsnInfo kpsnInfo = new KpsnInfo()
								const data = (await api.getItemInfo({ sn: inputData.mainSN })).data
								state.bindItemsData = data

								if (curStationAction.checkLine && snInfo.line != state.stationInfo.line) {
									showMessage("工单设置默认线别与当前线别不一致！", ERROR)
									return false
								}

								let bomInfos = []
								if (curStationAction.showBom) {

									bomInfos = (await api.getBomInfosBySN({
										stationType: inputData.stationType,
										sn: inputData.mainSN
									})).data

									state.bomData = bomInfos

									// setPartBomColor(inputData)
									// dgvBom.refresh()
								}
								//显示站点BOM

								//重工的需要打印新的，防止重工漏选解绑，故不在重工再做一个固资标签的解绑功能，在此处进行固资号的解绑keyparts 2022-08-29 by jipeng_wang 

								res = await api.checkFixedAssets({ sn: state.input })
								if (res.yes) {
									await api.relieveLink({ sn: state.input })
								}

								const dt_Ipn_Apn = (await api.getIPNAPNBySN({ sn: state.input })).data
								if (dt_Ipn_Apn.length <= 0) {
									showMessage("无资料", ERROR)
									return false
								}
								else if (dt_Ipn_Apn[0]["ipn"].toString() == "null") {
									showMessage("无料号", ERROR)
									return false
								}
								else if (dt_Ipn_Apn[0]["apn"].toString() == "null") {
									showMessage("无客户编码", ERROR)
									return false
								}
								const dt_rule = (await api.getRule()).data
								if (dt_rule.length != 6) {
									showMessage("固定资产编码规则缺失", ERROR)
									return false
								}
								let fixed_assets_1 = ""
								let fixed_assets_2 = ""
								let equipment_code_1_1_desc = ""
								let equipment_code_1_1_value = ""
								let equipment_code_1_2_desc = ""
								let equipment_code_1_2_value = ""
								let equipment_code_2 = ""
								let company_name = ""
								for (const rule of dt_rule) {
									switch (rule.configName.toString()) {
										case "FIXED_ASSETS_1":
											fixed_assets_1 = rule.configValue.toString().trim()
											break
										case "FIXED_ASSETS_2":
											fixed_assets_2 = rule.configValue.toString().trim()
											break
										case "EQUIPMENT_CODE_1_1":
											equipment_code_1_1_desc = rule.configDesc.toString().trim()
											equipment_code_1_1_value = rule.configValue.toString().trim()
											break
										case "EQUIPMENT_CODE_1_2":
											equipment_code_1_2_desc = rule.configDesc.toString().trim()
											equipment_code_1_2_value = rule.configValue.toString().trim()
											break
										case "EQUIPMENT_CODE_2":
											equipment_code_2 = rule.configValue.toString().trim()
											break
										case "COMPANY_NAME":
											company_name = rule.configValue.toString().trim()
											break
									}
								}

								if (fixed_assets_1 == "" || fixed_assets_2 == "" || equipment_code_1_1_desc == "" || equipment_code_1_1_value == "" || equipment_code_1_2_desc == "" || equipment_code_1_2_value == "" || equipment_code_2 == "" || company_name == "") {
									showMessage("固定资产编码规则缺失", ERROR)
									return false
								}

								//固定资产编码拼接
								const fixed_assets = fixed_assets_1 + dayjs(new Date()).format("yyMMdd") + fixed_assets_2 + state.input

								//设备编码拼接
								if (dt_Ipn_Apn[0]["apn"].toString().trim().length < 8) {
									showMessage("客户编码至少八位", ERROR)
									return false
								}
								if (!(equipment_code_1_1_desc + "," + equipment_code_1_2_desc).includes(dt_Ipn_Apn[0]["ipn"].toString().substring(0, WARM))) {
									showMessage("当前料号：" + dt_Ipn_Apn[0]["ipn"].toString() + "无法区分是哪种机型", ERROR)
									return false
								}

								let equipment_code = ""
								if (equipment_code_1_1_desc.includes(dt_Ipn_Apn[0]["ipn"].toString().substring(0, WARM))) {
									equipment_code = equipment_code_1_1_value + dt_Ipn_Apn[0]["apn"].toString().substring(0, 8) + equipment_code_2 + dt_Ipn_Apn[0]["apn"].toString().substring(dt_Ipn_Apn[0]["apn"].toString().length - 3, OK)
								}
								else {
									equipment_code = equipment_code_1_2_value + dt_Ipn_Apn[0]["apn"].toString().substring(0, 8) + equipment_code_2 + dt_Ipn_Apn[0]["apn"].toString().substring(dt_Ipn_Apn[0]["apn"].toString().length - 3, OK)
								}

								const kpsnInfo = {}
								kpsnInfo.kpsnPartDesc = "FIXED_ASSETS"
								kpsnInfo.kpsnPn = equipment_code
								kpsnInfo.slot = company_name
								kpsnInfo.kpsn = fixed_assets
								inputData.kpsnInfoList.push(kpsnInfo)

								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN
								inputData.snList.push(mainsn)
								curStationAction.inputCount++
								let soundfile = ''
								//更新lot投入数量,检查数量是否够用

								if (inputData.lotIdInfoList.length > 0 && stationActions.filter(q => q.jobName == "REEL_NO").length > 0) {
									for (const item of inputData.lotIdInfoList) {
										for (const itempartbom of bomInfos.filter(q => q.itemPartDesc == item.lotPartDesc && q.itemPartDesc != "0" && q.itemCount != q.ipnFinishCount)) {
											bomInfos.find(q => q.itemPartNo == itempartbom.itemPartNo && q.itemPartCode == itempartbom.itemPartCode).ipnFinishCount += item.length
										}
									}
									// setPartBomColor(inputData)
									// dgvBom.refresh()
								}

								//播放声音先不使用
								// if (mesOperate.getStationSound(inputData)) {
								// 	if (!string.isNullOrEmpty(soundfile)) {
								// 		soundFile = soundfile
								// 		if (soundfile.toLower().endsWith(".wav"))
								// 			CommHelper.playSoundAsyncByFile(soundfile)
								// 		else if (soundfile.toLower().endsWith(".mp3"))
								// 			CommHelper.playMusic(soundfile)
								// 	}
								// }
								if (curStationAction.loopCount == curStationAction.inputCount) {
									const res = await api.getCompareImageFileName({
										station: inputData.stationName,
										wo: inputData.workOrder,
										sn: inputData.mainSN,
									})

									if (res.ok) {
										const filestr = res.data
										if (filestr) {
											const fileList = filestr.split('|')
											//LoadCompareImage(fileList)
											showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
											ctrlStep++
											if (ctrlStep <= stationActions.length) {
												curStationAction = stationActions.find(q => q.step == ctrlStep)
												return {}
											}
										}
									}

									if (curStationAction.valueKind == "L") {
										isFixedAssts = true
										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)

									}
								}
								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}
						}
						break
					case InputSnActionType.AL_SN_PRINT_FIXED_ASSETS:
						{
							let res = await api.getMainSn({
								input: inputData.currInputData,
								station: inputData.stationName
							})

							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}

							const mainsn = res.data

							const snInfo = (await api.getSnInfoBySn({ mainSn: mainsn })).data
							if (!snInfo) {
								showMessage(res.msg, ERROR)
								return false
							}

							inputData.mainSN = snInfo.mainSN
							inputData.workOrder = snInfo.workOrder
							inputData.partNo = snInfo.partNo
							inputData.line = snInfo.line

							res = await api.checkSnPass({
								station: inputData.stationName,
								wo: inputData.workOrder,
								sn: inputData.mainSN,
							})
							if (!res.ok) {
								showMessage(res.msg, ERROR)
								return false
							}
							else {
								const data = (await api.getItemInfo({ sn: inputData.mainSN })).data
								state.bindItemsData = data

								if (curStationAction.checkLine && snInfo.line != state.stationInfo.line) {
									showMessage("工单设置默认线别与当前线别不一致！", ERROR)
									return false
								}
								if (curStationAction.showBom) {
									bomInfos = (await api.getBomInfosBySN({
										stationType: inputData.stationType,
										sn: inputData.mainSN
									})).data

									state.bomData = bomInfos

									// setPartBomColor(inputData)
									// dgvBom.refresh()
								}

								/*
								 * 从卡关配置里面获取允许绑定的IPN
								 * 卡关配置->AL_FIXED_ASSETS_IPN->IPN
								 */

								res = await api.checkIPN({ sn: state.input })
								if (!res.ok) {
									showMessage(res.msg, ERROR)
									return false
								}

								res = await api.checkALFixedAssetsIsExist({ sn: state.input })
								if (!res.ok) {
									showMessage(res.msg, ERROR)
									return false
								}
								else {
									const dataTable = res.data
									if (dataTable.length == 0) {
										const aLLabelInfo = {}
										let dt_temp = res.data
										if (dt_temp.length == 0) {
											res = await api.getTdId()
											if (!res.ok) {
												showMessage("获取TD_ID异常：" + res.msg, ERROR)
												return false
											}

											dt_temp = res.data
											if (dt_temp.length == 0) {
												showMessage("无可用TD_ID，请联系PE确认", ERROR)
												return false
											}

											aLLabelInfo.tdId = dt_temp[0]["TD_ID"].toString()
											aLLabelInfo.sn = state.input
											res = await api.insertALLabelInfo(aLLabelInfo)

											const kpsnInfo = {}
											kpsnInfo.kpsnPartDesc = "AL_FIXED_ASSETS"
											kpsnInfo.kpsnPn = ""
											kpsnInfo.slot = ""
											kpsnInfo.kpsn = dt_temp[0]["TD_ID"].toString()
											inputData.kpsnInfoList.push(kpsnInfo)
										}
									}
									else {
										needPrint = false
									}
								}

								state.snLine = inputData.line
								state.snIpn = inputData.partNo
								state.snWo = inputData.workOrder
								state.mainSn = inputData.mainSN
								inputData.snList.push(mainsn)
								curStationAction.inputCount++
								let soundfile = ''
								//更新lot投入数量,检查数量是否够用
								if (inputData.lotIdInfoList.length > 0 && stationActions.filter(q => q.jobName == "REEL_NO").length > 0) {
									for (const item of inputData.lotIdInfoList) {
										for (const itempartbom of bomInfos.filter(q => q.itemPartDesc == item.lotPartDesc && q.itemPartDesc != "0" && q.itemCount != q.ipnFinishCount)) {
											bomInfos.find(q => q.itemPartNo == itempartbom.itemPartNo && q.itemPartCode == itempartbom.itemPartCode).ipnFinishCount += item.length
										}
									}
									// setPartBomColor(inputData)
									// dgvBom.refresh()
								}

								//播放声音先不使用
								// if (mesOperate.getStationSound(inputData, out soundfile)) {
								// 	if (!string.isNullOrEmpty(soundfile)) {
								// 		soundFile = soundfile
								// 		if (soundfile.toLower().endsWith(".wav"))
								// 			CommHelper.playSoundAsyncByFile(soundfile)
								// 		else if (soundfile.toLower().endsWith(".mp3"))
								// 			CommHelper.playMusic(soundfile)
								// 	}
								// }
								if (curStationAction.loopCount == curStationAction.inputCount) {
									const res = await api.getCompareImageFileName({
										station: inputData.stationName,
										wo: inputData.workOrder,
										sn: inputData.mainSN,
									})

									if (res.ok) {
										const filestr = res.data
										if (filestr) {
											const fileList = filestr.split('|')
											//LoadCompareImage(fileList)
											showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
											ctrlStep++
											if (ctrlStep <= stationActions.length) {
												curStationAction = stationActions.find(q => q.step == ctrlStep)
												return {}
											}
										}
									}

									if (curStationAction.valueKind == "L") {
										isFixedAssts = true
										await transferSn()
										curStationAction = stationActions.find(q => q.valueKind != "O" && q.valueKind != "N")
										ctrlStep = curStationAction.step
									}
									else {
										showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
										ctrlStep++
										curStationAction = stationActions.find(q => q.step == ctrlStep)
									}
								}
								else {
									showMessage(curStationAction.typeDesc + " Input OK " + curStationAction.inputCount + "/" + curStationAction.loopCount, OK)
								}
							}
						}
						break
				}
				break
			}

	}
}

async function checkInputData() {
	const cr = await checkInputDataCore()
	if (!cr) return false

	if (typeof (cr) === 'boolean') return true

	viewState.input.label = curStationAction.typeName

	if ((curStationAction.autoReadSn && curStationAction.jobName == InputSnActionType.SN_PASS)
		|| curStationAction.jobName == InputSnActionType.SN_PASS_NFC_READER) {
		viewState.input.disabled = true
	}
	else { viewState.input.disabled = false }

	//卡关配置里面机种是需要扫描checksn ---IsCheckSN 20220923 lichao
	const res = await api.getModel(inputData.mainSN)
	if (!res.list || res.list.length == 0) {
		//判断不需要走checksn 直接跳过
		if (curStationAction.typeName == "CHKSerialNumber" && curStationAction.stationType == "FINALCHECK") {
			state.input = "NEXT"
			onInputSubmit()
		}
	}

	if (curStationAction.typeName != InputActionType.WorkOrder) {
		viewState.showWoList = false
	}
	else {
		viewState.showWoList = true
	}

	if (!string.IsNullOrEmpty(Msg) && Msg != "NEXT") { lblInfo.Text = Msg }

	//如果有料卷用完 重置
	if (inputData.lotIdInfoList != null && inputData.lotIdInfoList.length > 0) {
		for (const item of inputData.lotIdInfoList) {
			if (!item.lengthFlag) {
				continue
			}
			if (item.lotQty == item.lotUsedQty) {
				state.input = "RESET"
				onInputSubmit()

				showMessage("料号:" + item.LotPn + "LOT:" + item.Lotsn + "数量:" + item.LotQty + ",已用完，请重新上料", ERROR)
				return false
			}
		}
	}

	return true
}

//events
const onLoad = () => {
	state.stationInfo = JSON.parse(localStorage.getItem(stationInfoKey))
}

async function onInputSubmit() {
	const input = state.input
	clearFormData()

	if (!input) return

	inputData.currInputData = input
	if (inputData.currInputData == "RESET") {
		resetInputData()
		onLoad()

		state.input = ''
		viewState.input.focused = true
		return
	}

	checkInputData()
	refreshPPartWO()

	state.actionDesc = `下一步输入：${curStationAction.typeDesc}`

	state.input = ''
	viewState.input.focused = true
}

const onMenuCommand = (command) => {
	if (command === 'configTerminal') {
		switchStationConfig(true)
	}
}

const onStationConfigOk = async (stationInfo) => {
	localStorage.setItem(stationInfoKey, JSON.stringify(stationInfo))

	state.stationInfo = stationInfo

	switchStationConfig(false)
}

export {
	state,
	viewState,
	initWatches,
	switchStationConfig,
	onLoad,
	onMenuCommand,
	onStationConfigOk, onInputSubmit,
}