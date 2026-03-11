<template>
  <log-table-page :columns="columns" :list-api="listErrorLogListApi" :clear-api="clearErrorLogListApi" />
</template>

<script setup lang="ts">
import { clearErrorLogListApi, listErrorLogListApi } from '/@/api/log';
import LogTablePage from './components/log-table-page.vue';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
  },
  {
    title: '请求方式',
    dataIndex: 'method',
    key: 'method',
    align: 'center',
  },
  {
    title: '请求URL',
    dataIndex: 'url',
    key: 'url',
    align: 'center',
  },
  {
    title: '异常信息',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '操作IP',
    dataIndex: 'ip',
    key: 'ip',
    align: 'center',
  },
  {
    title: '操作时间',
    dataIndex: 'log_time',
    key: 'log_time',
    align: 'center',
  },
];
</script>
