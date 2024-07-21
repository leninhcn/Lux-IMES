<template>
  <div class="app-container" style="margin: -10px;">
    <el-tabs type="border-card" v-model="tabName">
      <el-tab-pane name="base" label="Action Job Base">
        <JobBase :show="tabName === 'base'" />
      </el-tab-pane>
      <el-tab-pane name="group" label="Action Job Group">
        <JobGroup :show="tabName === 'group'" />
      </el-tab-pane>
      <el-tab-pane name="link" label="Station Action Link">
        <StationLink :show="tabName === 'link'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="mntnactionbase">
import JobBase from './jobbase'
import JobGroup from './jobgroup'
import StationLink from './stationlink'

const tabName = ref('base')
</script>

<style scoped>
:deep(.el-tabs__content) {
  padding: 0;
}
</style>