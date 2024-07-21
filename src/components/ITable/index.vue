<template>
  <!-- 工具按钮 -->
  <div class="tool-btns">
    <slot name="tool-btns"></slot>
  </div>
  <!-- 表格 -->
  <el-table
    v-loading="loading"
    :data="tableData"
    :height="tableHeight"
    :highlight-current-row="highlightCurrentRow"
    @selection-change="handleSelectionChange"
    @expand-change="expandChange"
    @current-change="handleCurrentChange">
    <template v-for="item in columns" :key="item.key">
      <!-- selection || index -->
      <el-table-column
        v-if="item.type === 'index' || item.type === 'selection'"
        :type="item.type"
        :label="item.label"
        :width="item.width"
        :fixed="item.fixed"
        align="center">
      </el-table-column>
      <!-- expand -->
      <el-table-column v-if="item.type === 'expand'" :type="item.type" :label="item.label" :width="item.width" :fixed="item.fixed" align="center">
        <template #default="{ row }">
          <slot name="expand" :row="row"> </slot>
        </template>
      </el-table-column>
      <!-- other -->
      <el-table-column
        v-if="!item.type && item.prop && item.visible"
        align="center"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sortable"
        :width="item.width || ''"
        :fixed="item.fixed"
        show-overflow-tooltip>
        <template #default="{ row }">
          <slot :name="item.prop" :row="row">
            <span> {{ row[item.prop] }}</span>
          </slot>
        </template>
      </el-table-column>
      <!-- operation -->
      <el-table-column v-if="item.type === 'operation'" align="center" :label="item.label" :width="item.width || ''" :fixed="item.fixed">
        <template #default="{ row }">
          <div class="operation">
            <slot name="operation" :row="row"> </slot>
          </div>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup name="ITable">
import mitt from '@/utils/mitt'

const props = defineProps({
  // 表格数据
  tableData: {
    type: Array,
    default: () => []
  },
  //   表格配置
  /**
   * key: (Number) 唯一值
   * type?: (String)类型 index-序号 selection-选择框 expand-展开
   * label: (String)列名
   * prop: (String)变量名
   * visible: (Boolean)是否显示
   * width?: (Number)宽度
   * sortable: (Boolean)排序
   * fixed: (left | right)固定
   */
  columns: {
    type: Array,
    default: () => []
  },
  //   表格加载
  loading: {
    type: Boolean,
    default: false
  },
  //   表格高度
  height: [Number, String],
  // 是否高亮显示当前行
  highlightCurrentRow: {
    type: Boolean,
    default: false
  },
  //   多选
  handleSelectionChange: {
    type: Function,
    default: (list) => {}
  },
  //   展开
  expandChange: {
    type: Function,
    default: (list) => {}
  },
  // 当前行变化
  handleCurrentChange: {
    type: Function,
    default: (list) => {}
  }
})

// 动态表格高度
const tableHeight = ref(0)
const h = 60 + 70 + 17 * 2 + 32 * 2 + 54
/**
 * 获取表格高度并监听浏览器高度变化
 * @param {Number} height 正数为增加高度 负数为减少高度
 */
const getTableHeight = (height = 0) => {
  tableHeight.value = (props.height || window.innerHeight - h) + height
  // 监听浏览器高度变化
  window.onresize = () => {
    tableHeight.value = (props.height || window.innerHeight - h) + height
  }
}
onMounted(() => {
  getTableHeight()
})

// 其他dom元素影响表格高度
mitt.on('domHeightChange', getTableHeight)

// 卸载影响高度的函数
onUnmounted(() => {
  mitt.off('domHeightChange', getTableHeight)
})
</script>

<style lang="scss" scoped>
:deep(.operation .el-button) {
  margin-left: 0;
  padding: 12px 7px;
}

.tool-btns {
  margin-bottom: 5px;
}
</style>
