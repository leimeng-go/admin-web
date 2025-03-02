<template>
  <div v-if="errorLogs.length > 0">
    <el-badge :value="errorLogs.length" :max="99" class="item" type="danger">
      <el-button size="small" type="danger" @click="dialogTableVisible = true">
        <svg-icon icon-class="bug" />
      </el-button>
    </el-badge>

    <el-dialog v-model="dialogTableVisible" width="80%" append-to-body>
      <template #title>
        <span class="error-log-title">Error Log</span>
        <el-button size="small" type="primary" icon="el-icon-delete" @click="clearAll">
          Clear All
        </el-button>
      </template>
      <el-table :data="errorLogs" border>
        <el-table-column label="Message">
          <template #default="{ row }">
            <div>
              <span class="message-title">Msg:</span>
              <el-tag type="danger">
                {{ row.err.message }}
              </el-tag>
            </div>
            <br>
            <div>
              <span class="message-title">Info: </span>
              <el-tag type="warning">
                {{ row.vm.$vnode ? row.vm.$vnode.tag : 'unknown' }}
              </el-tag>
            </div>
            <br>
            <div>
              <span class="message-title">Url: </span>
              <el-tag type="success">
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template #default="{ row }">
            {{ row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useErrorLogStore } from '@/stores/errorLog'

const errorLogStore = useErrorLogStore()
const errorLogs = computed(() => errorLogStore.logs)

const dialogTableVisible = ref(false)

const clearAll = () => {
  dialogTableVisible.value = false
  errorLogStore.clearErrorLog()
}
</script>

<style lang="scss" scoped>
.error-log-title {
  padding-right: 8px;
}

.message-title {
  font-size: 16px;
  color: #333;
  padding-right: 8px;
}
</style> 