<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Order_No" min-width="200">
      <template #default="scope">
        {{ orderNoFilter(scope.row.order_no) }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template #default="scope">
        ¥{{ toThousandFilter(scope.row.price) }}
      </template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template #default="{row}">
        <el-tag :type="statusFilter(row.status)">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { transactionList, TransactionData } from '@/api/remote-search'

const list = ref<TransactionData[]>([])

const statusFilter = (status: string): string => {
  const statusMap: Record<string, string> = {
    success: 'success',
    pending: 'danger'
  }
  return statusMap[status]
}

const orderNoFilter = (str: string): string => {
  return str.substring(0, 30)
}

const toThousandFilter = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const fetchData = (): void => {
  transactionList().then(response => {
    list.value = response.data.items.slice(0, 8)
  })
}

onMounted(() => {
  fetchData()
})
</script>
