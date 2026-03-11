<template>
  <log-table-page :columns="columns" :list-api="listLoginLogApi" :clear-api="clearLoginLogApi" />
</template>

<script setup lang="ts">
import { listLoginLogApi, clearLoginLogApi } from '/@/api/log';
import LogTablePage from './components/log-table-page.vue';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
  },
  {
    title: 'IP地址',
    dataIndex: 'reIp',
    key: 'reIp',
    align: 'center',
  },
  {
    title: 'User-Agent',
    dataIndex: 'reUa',
    key: 'reUa',
    align: 'center',
  },
  {
    title: '登录时间',
    dataIndex: 'reTime',
    key: 'reTime',
    align: 'center',
  },
];
</script>
