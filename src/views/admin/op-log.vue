<template>
  <log-table-page :columns="columns" :list-api="listOpLogListApi" :clear-api="clearOpLogListApi" clear-mode="empty" />
</template>

<script setup>
import { clearOpLogListApi, listOpLogListApi } from '/@/api/log';
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
    dataIndex: 'reMethod',
    key: 'reMethod',
    align: 'center',
  },
  {
    title: '请求URL',
    dataIndex: 'reUrl',
    key: 'reUrl',
    align: 'center',
  },
  {
    title: '操作IP',
    dataIndex: 'reIp',
    key: 'reIp',
    align: 'center',
  },
  {
    title: '操作时间',
    dataIndex: 'reTime',
    key: 'reTime',
    align: 'center',
  },
  {
    title: '耗时',
    dataIndex: 'accessTime',
    key: 'accessTime',
    align: 'center',
    customRender: ({ text }) => `${text}ms`,
  },
];
</script>
