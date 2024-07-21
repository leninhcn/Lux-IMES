<template>
  <!-- 区段 -->
  <Stage @handle-current-change="handleCurrentChange" />
  <!-- 站点 -->
  <Station :stage="stage" />
</template>

<script setup name="datacenterProcessCraftStation">
import Stage from './components/Stage'
import Station from './components/Station'

// 点击的区段
const stage = ref('')

// 点击区段
const handleCurrentChange = (val) => {
  stage.value = val
}
</script>

<style lang="scss" scoped></style>
