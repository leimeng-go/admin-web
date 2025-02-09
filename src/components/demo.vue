<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from "@element-plus/icons-vue";

// 定义一个函数
const queryStudent=()=>{
    ElMessageBox.confirm(
        '是否开启编写？',
        '提示',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
    .then(()=>{
        ElMessage({
            type: "success",
            message: '已开启',
        })
    })
    .catch(()=>{
      ElMessage({  
        type: "info",
        message: '已取消',
      })
    })
}
</script>

<template>
    <h1>Demo中的标题</h1>
    <div>
        <el-button :icon="Search" circle></el-button>
        <el-button type="primary" @click="queryStudent" :icon="Edit" circle></el-button>
        <el-button type="success" :icon="Check" circle >{{ $t('button.login') }}</el-button>
        <el-button type="info" :icon="Message" circle></el-button>
        <el-button type="warning" :icon="Star" circle></el-button>
        <el-button type="danger" :icon="Delete" circle></el-button>
    </div>
</template>

<style>
h1{
    color: blue 
}
</style>