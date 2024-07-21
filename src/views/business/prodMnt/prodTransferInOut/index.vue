<template>
    <div h="full" pt="4">
        <div h="full" b-rd="2" p="2" style="background-color: lavender;">
            <Stack h="full">
                <el-tabs v-model="state.activeTabName" type="" mt="-10" @tab-change="vc.onTabChange">
                    <el-tab-pane label="TransferOut" name="out">
                        <Stack px="4">
                            <div flex><el-text><span font="bold" font-size="8">借出</span></el-text></div>
                        </Stack>
                    </el-tab-pane>
                    <el-tab-pane label="TransferIn" name="in">
                        <Stack px="4">
                            <div flex><el-text><span font="bold" font-size="8">归还</span></el-text></div>
                        </Stack>
                    </el-tab-pane>
                </el-tabs>
                <el-row item-flex="1">
                    <el-col :span="12">
                        <Stack>
                            <Stack horizontal>
                                <InputBox item-flex="0 0 100%" label="SN" ref="sn" v-model.trim="state.sn"
                                    :readonly="vs.sn.readonly" v-model:disabled="vs.sn.disabled"
                                    v-model:focused="vs.sn.focused" @submit="vc.onErrorMsgSubmit"
                                    v-show="vs.sn.visible" />
                                <el-button px="4" type="primary">获取SN信息</el-button>
                            </Stack>
                            <InputBox label="Model" ref="model" v-model.trim="state.model" :readonly="vs.model.readonly"
                                v-model:disabled="vs.model.disabled" v-model:focused="vs.model.focused"
                                @submit="vc.onErrorMsgSubmit" v-show="vs.model.visible" />
                            <InputBox label="IPN" ref="ipn" v-model.trim="state.ipn" :readonly="vs.ipn.readonly"
                                v-model:disabled="vs.ipn.disabled" v-model:focused="vs.ipn.focused"
                                @submit="vc.onErrorMsgSubmit" v-show="vs.ipn.visible" />
                            <InputBox label="WO" ref="wo" v-model.trim="state.wo" :readonly="vs.wo.readonly"
                                v-model:disabled="vs.wo.disabled" v-model:focused="vs.wo.focused"
                                @submit="vc.onErrorMsgSubmit" v-show="vs.wo.visible" />
                            <InputBox label="经手人工号" ref="fromUser" v-model.trim="state.fromUser"
                                :readonly="vs.fromUser.readonly" v-model:disabled="vs.fromUser.disabled"
                                v-model:focused="vs.fromUser.focused" @submit="vc.onErrorMsgSubmit"
                                v-show="vs.fromUser.visible" />
                            <InputBox label="借出人工号" ref="toUser" v-model.trim="state.toUser"
                                :readonly="vs.toUser.readonly" v-model:disabled="vs.toUser.disabled"
                                v-model:focused="vs.toUser.focused" @submit="vc.onErrorMsgSubmit"
                                v-show="vs.toUser.visible" />
                            <InputBox label="借出人手机" ref="phone" v-model.trim="state.phone" :readonly="vs.phone.readonly"
                                v-model:disabled="vs.phone.disabled" v-model:focused="vs.phone.focused"
                                @submit="vc.onErrorMsgSubmit" v-show="vs.phone.visible" />
                            <Stack horizontal mx="1">
                                <el-text item-flex="0 0 20%" align="center" tag="b" size="large">LAB</el-text>
                                <el-select v-model="state.lab" item-flex="1">
                                    <el-option v-for="i in labs" :key="i" :label="i" :value="i"></el-option>
                                </el-select>
                            </Stack>
                            <Stack horizontal>
                                <div item-flex="1"></div>
                                <el-button type="primary">{{ state.confirmText }}</el-button>
                                <el-button type="info">取消</el-button>
                            </Stack>
                        </Stack>
                    </el-col>
                    <el-col :span="9" :offset="3">
                        <div class="flex windowState" b-rd="4" w="30" h="30" :bg="state.windowStateAttr.bg" flex="col"
                            flex-items="center" justify="center" font="mono" text="5xl">
                            <div>{{ state.windowStateText }}</div>
                        </div>
                    </el-col>
                </el-row>
                <div h="full" truncate class="windowMsg block-bar" b-rd="2" mb="-6">
                    <div :bg="state.windowStateAttr.bg"></div>
                    <div class="flex block-bar" p="2" py="4.5" flex="col" flex-items="center" whitespace="normal"
                        h="full" text="2xl center wrap">
                        <div class="msg-content">{{ state.windowMsg }}</div>
                    </div>
                </div>
            </Stack>
        </div>
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
    background-color: transparent;
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
import { state, viewState as vs } from './viewController.js'
//refs
const sn = ref()
const model = ref()
const ipn = ref()
const wo = ref()
const fromUser = ref()
const toUser = ref()
const phone = ref()

const labs = [
    'RD EE',
    'RD RF',
    'RD SW',
    'RD SAC',
    'PSE',
    'Other',
]

//vue-hooks
onMounted(() => {
    vc.initRefs({ sn, model, ipn, wo, fromUser, toUser, phone })
    vc.initWatches()
    vc.onLoad()
})
</script>