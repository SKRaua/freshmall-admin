<template>
    <div class="admin-page">
        <a-spin :spinning="loading">
            <a-row :gutter="16" style="margin-bottom: 16px">
                <a-col :xs="24" :md="8">
                    <a-card title="近7天UV">
                        <div class="metric">{{ summary.uv }}</div>
                    </a-card>
                </a-col>
                <a-col :xs="24" :md="8">
                    <a-card title="近7天PV">
                        <div class="metric">{{ summary.pv }}</div>
                    </a-card>
                </a-col>
                <a-col :xs="24" :md="8">
                    <a-card title="平均每日访问">
                        <div class="metric">{{ summary.avgVisit }}</div>
                    </a-card>
                </a-col>
            </a-row>

            <a-row :gutter="16">
                <a-col :xs="24" :lg="12">
                    <a-card title="最近一周访问明细">
                        <a-table :columns="visitColumns" :data-source="visitList" :pagination="false" rowKey="day"
                            size="small" />
                    </a-card>
                </a-col>
                <a-col :xs="24" :lg="12">
                    <a-card title="热门农产品排名">
                        <a-table :columns="thingColumns" :data-source="popularThings" :pagination="false" rowKey="title"
                            size="small" />
                    </a-card>
                </a-col>
            </a-row>

            <a-card title="热门分类比例" style="margin-top: 16px">
                <a-table :columns="classificationColumns" :data-source="popularClassification" :pagination="false"
                    rowKey="title" size="small" />
            </a-card>
        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { listApi } from '/@/api/overview';

const loading = ref(false);
const visitList = ref<any[]>([]);
const popularThings = ref<any[]>([]);
const popularClassification = ref<any[]>([]);

const visitColumns = [
    { title: '日期', dataIndex: 'day', key: 'day' },
    { title: 'UV', dataIndex: 'uv', key: 'uv', width: 100 },
    { title: 'PV', dataIndex: 'pv', key: 'pv', width: 100 },
];

const thingColumns = [
    { title: '排名', dataIndex: 'index', key: 'index', width: 80, align: 'center' },
    { title: '名称', dataIndex: 'title', key: 'title' },
    { title: '热度', dataIndex: 'count', key: 'count', width: 100 },
];

const classificationColumns = [
    { title: '排名', dataIndex: 'index', key: 'index', width: 80, align: 'center' },
    { title: '分类', dataIndex: 'title', key: 'title' },
    { title: '热度', dataIndex: 'count', key: 'count', width: 100 },
];

const summary = computed(() => {
    const uv = visitList.value.reduce((sum, item) => sum + Number(item.uv || 0), 0);
    const pv = visitList.value.reduce((sum, item) => sum + Number(item.pv || 0), 0);
    const avgVisit = visitList.value.length ? Math.round(pv / visitList.value.length) : 0;
    return { uv, pv, avgVisit };
});

const loadData = async () => {
    loading.value = true;
    try {
        const res = await listApi({});
        const data = res?.data || {};
        visitList.value = Array.isArray(data.visitList) ? data.visitList : [];
        popularThings.value = (Array.isArray(data.popularThings) ? data.popularThings : []).map((item: any, index: number) => ({
            ...item,
            index: index + 1,
        }));
        popularClassification.value = (Array.isArray(data.popularClassification) ? data.popularClassification : []).map((item: any, index: number) => ({
            ...item,
            index: index + 1,
        }));
    } finally {
        loading.value = false;
    }
};

loadData();
</script>

<style scoped>
.metric {
    font-size: 30px;
    font-weight: 700;
    color: #1677ff;
}
</style>
