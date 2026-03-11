<template>
    <div class="page-view">
        <div class="table-operations">
            <a-space>
                <a-button type="primary" @click="clickClear">清空</a-button>
            </a-space>
        </div>

        <a-table size="middle" rowKey="id" :loading="loading" :columns="columns" :data-source="dataList"
            :scroll="{ x: 'max-content' }" :pagination="{
                size: 'default',
                current: page,
                pageSize,
                onChange: (current) => (page = current),
                showSizeChanger: false,
                showTotal: (total) => `共${total}条数据`,
            }" />
    </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { onMounted, ref } from 'vue';

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    listApi: {
        type: Function,
        required: true,
    },
    clearApi: {
        type: Function,
        required: true,
    },
    clearMode: {
        type: String,
        default: 'reload',
    },
});

const dataList = ref([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(10);

const getDataList = async () => {
    loading.value = true;
    try {
        const res = await props.listApi({ keyword: '' });
        const list = Array.isArray(res?.data) ? res.data : [];
        dataList.value = list.map((item, index) => ({ ...item, index: index + 1 }));
    } finally {
        loading.value = false;
    }
};

const clickClear = async () => {
    loading.value = true;
    try {
        await props.clearApi({});
        message.success('操作成功');
        if (props.clearMode === 'empty') {
            dataList.value = [];
            return;
        }
        await getDataList();
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    getDataList();
});
</script>

<style scoped lang="less">
.page-view {
    min-height: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.table-operations {
    margin-bottom: 14px;
    text-align: right;
}
</style>
