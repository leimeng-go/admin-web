<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group @handle-set-line-chart-data="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import GithubCorner from '@/components/GithubCorner/index.vue'
import PanelGroup from './components/PanelGroup.vue'
import LineChart from './components/LineChart.vue'
import RaddarChart from './components/RaddarChart.vue'
import PieChart from './components/PieChart.vue'
import BarChart from './components/BarChart.vue'
import TransactionTable from './components/TransactionTable.vue'
import TodoList from './components/TodoList/index.vue'
import BoxCard from './components/BoxCard.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()

// Ensure we have a default value for lineChartData
dashboardStore.setLineChartData('newVisitis')

// Computed property to get the current line chart data from the store
const lineChartData = computed(() => {
  console.log('Computing lineChartData:', dashboardStore.lineChartData)
  return dashboardStore.lineChartData
})

// Method to handle setting the line chart data
const handleSetLineChartData = (type: string): void => {
  console.log('Setting line chart data to type:', type)
  dashboardStore.setLineChartData(type)
}

onMounted(async () => {
  console.log('Dashboard mounted')
  // Initialize with default data
  dashboardStore.setLineChartData('newVisitis')
  
  // Wait for DOM to be updated
  await nextTick()
  console.log('Dashboard nextTick completed')
})

// Watch for changes to lineChartData
watch(lineChartData, (newVal) => {
  console.log('lineChartData changed:', newVal)
}, { deep: true })
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
