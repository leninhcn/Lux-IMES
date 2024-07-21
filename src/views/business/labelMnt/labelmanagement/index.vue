<template>
  <div class="app-container" style="margin: -10px;">
    <el-tabs type="border-card" v-model="tabName">
      <el-tab-pane name="base" :label="$t('labelmanagement.LabelBase')">
        <LabelBase :show="tabName === 'base'" />
      </el-tab-pane>
      <el-tab-pane name="params" :label="$t('labelmanagement.LabelParams')">
        <LabelParams :show="tabName === 'params'" />
      </el-tab-pane>
      <el-tab-pane name="type" :label="$t('labelmanagement.LabelType')">
        <LabelType :show="tabName === 'type'" />
      </el-tab-pane>
      <el-tab-pane name="sql" :label="$t('labelmanagement.LabelSQL')">
        <LabelSql :show="tabName === 'sql'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="labelmanagement">
import LabelBase from './base'
import LabelParams from './params'
import LabelType from './type'
import LabelSql from './sql'

const tabName = ref('base')
</script>

<style scoped>
:deep(.el-tabs__content) {
  padding: 0;
}
</style>