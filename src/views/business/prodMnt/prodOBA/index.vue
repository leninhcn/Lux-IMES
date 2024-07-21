<template>
	<div h="full" b-rd="2" p="2" style="background-color: lavender;">
		<Stack h="full">
			<!-- <Stack class="menu-bar" horizontal b-rd="2" p="1" mt="-5">
				<el-dropdown trigger="click" size="small" @command="vc.onMenuCommand">
					<span p="1" class="el-dropdown-link">菜单<el-icon><arrow-down /></el-icon></span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="configTerminal">站点配置</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</Stack> -->
			<el-row item-class="mt-1" h="full" mt="-3" :gutter="10">
				<el-col :span="10" h="30">
					<div h="full" class="block-bar" b-rd="2" px="4" py="4">
						<Stack h="full" truncate>
							<el-text>站点信息</el-text>
							<div item-flex="1" flex flex-items="center" justify="center">
								<el-text>{{ state.stationTitle }}</el-text>
							</div>
						</Stack>
					</div>
				</el-col>
				<el-col :span="14" h="full">
					<el-row h="full" class="block-bar" b-rd="2" py="2" pl="8" truncate>
						<el-col :span="18" h="full">
						</el-col>
						<el-col :span="6" my="-2">
							<div class="flex windowState" :bg="state.windowStateAttr.bg" flex="col" flex-items="center"
								justify="center" h="full" font="mono" text="5xl">
								<div>{{ state.windowStateText }}</div>
							</div>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
			<el-row item-flex="1" h="full" :gutter="10" item-class="truncate p-5 m--5" pb="2" item-nogap>
				<el-col :span="10" h="full">
					<div h="full" truncate class="block-bar" b-rd="2" p="4">
						<Stack h="full" overflow="auto">
							<div class="flex" flex="col" flex-items="center" item-nogap mb="4">
								<el-radio-group v-model="state.passSnValue" @change="vc.onPassOrFailSelected">
									<el-radio-button label="Pass"><span px="15">PASS</span></el-radio-button>
									<el-radio-button label="Fail"><span px="15">FAIL</span></el-radio-button>
								</el-radio-group>
							</div>
							<InputBox label="SN" ref="snInput" v-model.trim="state.sn" :readonly="viewState.snInput.readonly"
								v-model:disabled="viewState.snInput.disabled" v-model:focused="viewState.snInput.focused"
								@submit="vc.onSnSubmit"/>

							<InputBox label="ErrorMsg" ref="eMsgInput" v-model.trim="state.errorMsg" :readonly="viewState.eMsgInput.readonly"
								v-model:disabled="viewState.eMsgInput.disabled" v-model:focused="viewState.eMsgInput.focused"
								@submit="vc.onErrorMsgSubmit" v-show="viewState.eMsgInput.visible"/>
						</Stack>
					</div>
				</el-col>
				<el-col :span="14" h="full">
					<div h="full" class="block-bar" b-rd="2" p="4">
						<!-- <Stack h="full" size="small">
							<el-table size="small" item-flex="0 0 60%" item-class="truncate" class="block-bar" border
								:data="state.woSnStatusData">
								<template #empty>
									WoSnStatus:Empty
								</template>
								<el-table-column v-for="i in woSnStatusCols" :key="i.prop" :prop="i.prop" :label="i.label"
									:min-width="i.width" :fixed="i.fixed" show-overflow-tooltip />
							</el-table>
							<el-divider my="0" item-class="mx--2" />
							<el-table ref="kpListTableRef" size="small" item-flex="1" item-class="truncate"
								class="block-bar kplist-table" border :data="state.kpsnInfoData"
								:row-class-name="getKpListRowClass">
								<template #empty>
									KpsnInfo:Empty
								</template>
								<el-table-column v-for="i in kpsnInfoCols" :key="i.prop" :prop="i.prop" :label="i.label"
									:min-width="i.width" :fixed="i.fixed" :show-overflow-tooltip="true" />
							</el-table>
						</Stack> -->
					</div>
				</el-col>
			</el-row>
			<div h="full" truncate class="windowMsg block-bar" b-rd="2" mb="-6">
				<div :bg="state.windowStateAttr.bg"></div>
				<div class="flex block-bar" p="2" py="4.5" flex="col" flex-items="center" whitespace="normal" h="full"
					text="2xl center wrap">
					<div class="msg-content">{{ state.windowMsg }}</div>
				</div>
			</div>
		</Stack>
		<DownDialog v-model:visible="viewState.showStationConfig" v-slot="{ dialogOpen }" width="80%">
			<StationConfig class="p-0" h="120" :op-types="['Repair']" :client-types="['MANU']" @onOk="vc.onStationConfigOk"
				@onCancel="vc.switchStationConfig(false)" :opened="dialogOpen" />
		</DownDialog>
	</div>
</template>
<style scoped>
.menu-bar {
	background-color: #ffffff57;
	backdrop-filter: blur(22px);
	box-shadow: 0px 20px 20px -10px rgb(0 0 0 / 37%);
}

.block-bar {
	background-color: #ffffff57;
	backdrop-filter: blur(15px);
	box-shadow: 0px 5px 20px 0px rgb(0 0 0 / 12%);
}

.el-dropdown-link {
	cursor: pointer;
	/* color: var(--el-color-primary); */
	display: flex;
	align-items: center;
	font-size: 0.75rem;
}

.windowState {
	color: var(--el-color-primary-light-9);
	transition: all 0.2s ease-out;
}

.windowState[bg~=red] {
	--un-bg-opacity: 1;
	background-color: rgb(248 113 113 / var(--un-bg-opacity));
}

.windowState[bg~=green] {
	--un-bg-opacity: 1;
	background-color: rgb(74 222 128 / var(--un-bg-opacity));
}

.windowMsg {
	color: var(--el-text-color-primary);
	position: relative;
	backdrop-filter: blur(3px);
	transition: all 0.5s ease-out;
}

.windowMsg .msg-content {
	--green-: 0 183 40;
	--red-: 255 0 50;

	padding: 0px 4px;
	-webkit-background-clip: text;
	-moz-background-clip: text;
	background-clip: text;
	background-color: #ffffff82;
	-webkit-text-stroke: 5px transparent;
}

.windowMsg>[bg] {
	position: absolute;
	inset: 0.3rem;
	border-radius: 0.3rem;
	transition: all 0.5s ease-out;
	--green-bg: 0 183 40;
	--red-bg: 255 0 50;

	background-color: rgb(230 230 250 / 0.01);
}

.windowMsg>[bg~=red] {
	box-shadow: inset 0px 0px 30px 18px rgb(var(--red-bg)/ 100%);
}

.windowMsg>[bg~=green] {
	box-shadow: inset 0px 0px 30px 18px rgb(var(--green-bg)/ 100%);
}

.windowMsg>.block-bar {
	backdrop-filter: blur(8px);
}

.windowMsg>[bg~=red]+.block-bar>.msg-content {
	color: rgb(var(--red-))
}

.windowMsg>[bg~=green]+.block-bar>.msg-content {
	color: rgb(var(--green-))
}
</style>
<style>
.kplist-table .pending-row {
	background-color: var(--el-color-warning-light-5);
}

.kplist-table .success-row {
	background-color: var(--el-color-success-light-5);
}
</style>

<script setup>
import Stack from '@/views/components/Stack.vue'

import StationConfig from '@/views/components/business/StationConfig.vue'
import DownDialog from '@/views/components/DownDialog.vue'

import InputBox from '@/views/components/business/InputBox.vue'

import { ElMessage } from 'element-plus'
import * as vc from './viewController.js'
import { state, viewState } from './viewController.js'
//refs
const snInput = ref()
const eMsgInput = ref()

//vue-hooks
onMounted(() => {
	vc.initRefs({ snInput, eMsgInput })
	vc.initWatches()
	vc.onLoad()
})
</script>