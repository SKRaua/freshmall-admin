<template>
    <div class="admin-page">
        <div class="admin-toolbar">
            <a-space direction="vertical" style="width: 100%" :size="12">
                <a-space :size="12" wrap>
                    <a-input v-model:value="searchForm.orderNumber" placeholder="按订单号搜索" style="width: 220px"
                        allow-clear @pressEnter="handleSearch" />
                    <a-input v-model:value="searchForm.username" placeholder="按用户名搜索" style="width: 220px" allow-clear
                        @pressEnter="handleSearch" />
                    <a-select v-model:value="searchForm.status" :options="searchStatusOptions" placeholder="按状态筛选"
                        style="width: 160px" allow-clear />
                    <a-range-picker v-model:value="searchForm.timeRange" show-time />
                    <a-button type="primary" @click="handleSearch">搜索</a-button>
                    <a-button @click="handleResetSearch">重置</a-button>
                </a-space>

                <a-space>
                    <a-button danger @click="handleBatchDelete">批量删除</a-button>
                    <a-select v-model:value="batchStatus" :options="statusOptions" placeholder="选择批量状态"
                        style="width: 180px" />
                    <a-button type="primary" @click="handleBatchUpdateStatus">批量修改状态</a-button>
                </a-space>
            </a-space>
        </div>

        <a-table rowKey="id" :loading="loading" :columns="columns" :data-source="list" :row-selection="rowSelection"
            :pagination="pagination" :scroll="{ x: 'max-content' }">
            <template #bodyCell="scope">
                <template v-if="scope.column.key === 'status'">
                    <a-tag :color="getStatusColor(scope.text)">{{ getStatusLabel(scope.text) }}</a-tag>
                </template>
                <template v-else-if="scope.column.key === 'operation'">
                    <a-space class="operation-actions" :wrap="false" size="small">
                        <a-select :value="String(scope.record.status)" :options="statusOptions" style="width: 120px"
                            @change="handleInlineStatusChange(scope.record.id, $event)" />
                        <a-popconfirm title="确定删除该订单？" @confirm="handleDelete(scope.record.id)">
                            <a>删除</a>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { message } from 'ant-design-vue';
import { deleteApi, listApi, updateStatusApi } from '/@/api/order';
import { getFormatTime } from '/@/utils';

const loading = ref(false);
const list = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref<Array<string | number>>([]);
const batchStatus = ref<string | undefined>();
const searchForm = ref<{
    orderNumber: string;
    username: string;
    status: string | undefined;
    timeRange: [Dayjs, Dayjs] | null;
}>({
    orderNumber: '',
    username: '',
    status: undefined,
    timeRange: null,
});

const statusOptions = [
    { label: '待支付', value: '4' },
    { label: '待发货', value: '1' },
    { label: '待收货', value: '2' },
    { label: '已完成', value: '3' },
    { label: '已取消', value: '0' },
];

const searchStatusOptions = [
    { label: '待支付', value: '4' },
    { label: '待发货', value: '1' },
    { label: '待收货', value: '2' },
    { label: '已完成', value: '3' },
    { label: '已取消', value: '0' },
];

const statusLabelMap: Record<string, string> = {
    '4': '待支付',
    '1': '待发货',
    '2': '待收货',
    '3': '已完成',
    '0': '已取消',
};

const statusColorMap: Record<string, string> = {
    '4': 'gold',
    '1': 'processing',
    '2': 'warning',
    '3': 'success',
    '0': 'default',
};

const columns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 80, align: 'center' },
    { title: '编号', dataIndex: 'orderNumber', key: 'orderNumber', width: 180 },
    { title: '用户', dataIndex: 'username', key: 'username', width: 120 },
    {
        title: '产品名称',
        dataIndex: 'title',
        key: 'title',
        width: 160,
        customRender: ({ text }: { text: string }) => h('span', { class: 'title-ellipsis-3' }, text || '--'),
    },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' },
    { title: '姓名', dataIndex: 'receiverName', key: 'receiverName', width: 120 },
    { title: '收货地址', dataIndex: 'receiverAddress', key: 'receiverAddress', width: 220 },
    { title: '电话', dataIndex: 'receiverPhone', key: 'receiverPhone', width: 140 },
    { title: '时间', dataIndex: 'orderTime', key: 'orderTime', width: 180 },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 160 },
    { title: '操作', key: 'operation', width: 280, align: 'center', fixed: 'right' },
];

const pagination = computed(() => ({
    current: page.value,
    pageSize: pageSize.value,
    showSizeChanger: false,
    showTotal: (total: number) => `共${total}条数据`,
    onChange: (current: number) => {
        page.value = current;
    },
}));

const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys: Array<string | number>) => {
        selectedRowKeys.value = keys;
    },
}));

const loadData = async () => {
    loading.value = true;
    try {
        const params: Record<string, string> = {};
        if (searchForm.value.orderNumber.trim()) {
            params.orderNumber = searchForm.value.orderNumber.trim();
        }
        if (searchForm.value.username.trim()) {
            params.username = searchForm.value.username.trim();
        }
        if (searchForm.value.status) {
            params.status = searchForm.value.status;
        }
        if (searchForm.value.timeRange?.length === 2) {
            params.startTime = String(dayjs(searchForm.value.timeRange[0]).valueOf());
            params.endTime = String(dayjs(searchForm.value.timeRange[1]).valueOf());
        }

        const res = await listApi(params);
        let data = Array.isArray(res?.data) ? res.data : [];

        if (searchForm.value.orderNumber.trim()) {
            const keyword = searchForm.value.orderNumber.trim();
            data = data.filter((item: any) => String(item.orderNumber || '').includes(keyword));
        }
        if (searchForm.value.username.trim()) {
            const keyword = searchForm.value.username.trim().toLowerCase();
            data = data.filter((item: any) => String(item.username || '').toLowerCase().includes(keyword));
        }
        if (searchForm.value.status) {
            data = data.filter((item: any) => String(item.status) === String(searchForm.value.status));
        }
        if (searchForm.value.timeRange?.length === 2) {
            const start = dayjs(searchForm.value.timeRange[0]).valueOf();
            const end = dayjs(searchForm.value.timeRange[1]).valueOf();
            data = data.filter((item: any) => {
                const current = Number(item.orderTime);
                return Number.isFinite(current) && current >= start && current <= end;
            });
        }

        list.value = data.map((item: any, index: number) => ({
            ...item,
            index: index + 1,
            orderTime: getFormatTime(item.orderTime, true),
        }));
    } finally {
        loading.value = false;
    }
};

const getStatusLabel = (status: string | number) => statusLabelMap[String(status)] || `未知(${status})`;
const getStatusColor = (status: string | number) => statusColorMap[String(status)] || 'default';

const handleUpdateStatus = async (id: string | number, status: string | number, silent = false) => {
    await updateStatusApi({ id, status: String(status) });
    if (!silent) {
        message.success('订单状态修改成功');
    }
    await loadData();
};

const handleInlineStatusChange = (id: string | number, value: unknown) => {
    handleUpdateStatus(id, String(value));
};

const handleSearch = async () => {
    page.value = 1;
    await loadData();
};

const handleResetSearch = async () => {
    searchForm.value = {
        orderNumber: '',
        username: '',
        status: undefined,
        timeRange: null,
    };
    page.value = 1;
    await loadData();
};

const handleDelete = async (id: string | number) => {
    await deleteApi({ ids: id });
    message.success('删除成功');
    await loadData();
};

const handleBatchDelete = async () => {
    if (!selectedRowKeys.value.length) {
        message.warning('请先勾选要删除的订单');
        return;
    }
    await deleteApi({ ids: selectedRowKeys.value.join(',') });
    selectedRowKeys.value = [];
    message.success('批量删除成功');
    await loadData();
};

const handleBatchUpdateStatus = async () => {
    if (!selectedRowKeys.value.length) {
        message.warning('请先勾选要修改的订单');
        return;
    }
    if (!batchStatus.value) {
        message.warning('请先选择要更新的状态');
        return;
    }

    await Promise.all(selectedRowKeys.value.map((id) => updateStatusApi({ id, status: batchStatus.value })));
    message.success('批量修改状态成功');
    selectedRowKeys.value = [];
    batchStatus.value = undefined;
    await loadData();
};

loadData();
</script>

<style scoped>
.operation-actions {
    white-space: nowrap;
}

.title-ellipsis-3 {
    display: -webkit-box;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    line-height: 1.4;
}
</style>
