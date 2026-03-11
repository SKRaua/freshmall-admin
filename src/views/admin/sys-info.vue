<template>
    <div class="admin-page">
        <a-spin :spinning="loading">
            <a-descriptions title="系统信息" bordered :column="{ lg: 3, md: 2, sm: 1 }">
                <a-descriptions-item label="系统名称">{{ info.sysName }}</a-descriptions-item>
                <a-descriptions-item label="版本信息">{{ info.versionName }}</a-descriptions-item>
                <a-descriptions-item label="操作系统">{{ info.osName }}</a-descriptions-item>
                <a-descriptions-item label="系统平台">{{ info.pf }}</a-descriptions-item>
                <a-descriptions-item label="CPU核数">{{ info.cpuCount }}</a-descriptions-item>
                <a-descriptions-item label="处理器">{{ info.processor }}</a-descriptions-item>
                <a-descriptions-item label="CPU负载">{{ info.cpuLoad }}%</a-descriptions-item>
                <a-descriptions-item label="系统内存">{{ info.memory }}G</a-descriptions-item>
                <a-descriptions-item label="内存使用">{{ info.usedMemory }}G</a-descriptions-item>
                <a-descriptions-item label="内存利用率">{{ info.percentMemory }}%</a-descriptions-item>
                <a-descriptions-item label="系统语言">{{ info.sysLan }}</a-descriptions-item>
                <a-descriptions-item label="MySQL版本">5.7.37</a-descriptions-item>
                <a-descriptions-item label="Nginx版本">1.20.1</a-descriptions-item>
                <a-descriptions-item label="系统时区">{{ info.sysZone }}</a-descriptions-item>
            </a-descriptions>
        </a-spin>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { sysInfoApi } from '/@/api/overview';

const loading = ref(false);
const info = ref({});

const loadData = async () => {
    loading.value = true;
    try {
        const res = await sysInfoApi({});
        info.value = res?.data || {};
    } finally {
        loading.value = false;
    }
};

loadData();
</script>
