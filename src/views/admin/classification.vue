<template>
    <div class="admin-page">
        <div class="admin-toolbar">
            <a-space>
                <a-button type="primary" @click="openCreate">新增分类</a-button>
                <a-button danger @click="handleBatchDelete">批量删除</a-button>
            </a-space>
        </div>

        <a-table rowKey="id" :loading="loading" :columns="columns" :data-source="list" :row-selection="rowSelection"
            :pagination="pagination" :scroll="{ x: 'max-content' }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'operation'">
                    <a-space>
                        <a @click="openEdit(record)">编辑</a>
                        <a-popconfirm title="确定删除该分类？" @confirm="handleDelete(record.id)">
                            <a>删除</a>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </a-table>

        <a-modal :visible="visible" :title="modalTitle" ok-text="确认" cancel-text="取消" @ok="handleSubmit"
            @cancel="closeModal">
            <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ style: { width: '88px' } }">
                <a-form-item label="分类名称" name="title">
                    <a-input v-model:value="formState.title" placeholder="请输入分类名称" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { createApi, deleteApi, listApi, updateApi } from '/@/api/classification';

const loading = ref(false);
const list = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref<Array<string | number>>([]);

const visible = ref(false);
const editingId = ref<string | number | undefined>(undefined);
const formRef = ref();
const formState = reactive({
    title: '',
});

const rules = {
    title: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
};

const columns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 80, align: 'center' },
    { title: '分类名称', dataIndex: 'title', key: 'title' },
    { title: '操作', key: 'operation', width: 140, align: 'center' },
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

const modalTitle = computed(() => (editingId.value ? '编辑分类' : '新增分类'));

const loadData = async () => {
    loading.value = true;
    try {
        const res = await listApi({});
        const data = Array.isArray(res?.data) ? res.data : [];
        list.value = data.map((item: any, index: number) => ({ ...item, index: index + 1 }));
    } finally {
        loading.value = false;
    }
};

const openCreate = () => {
    editingId.value = undefined;
    formState.title = '';
    visible.value = true;
};

const openEdit = (record: any) => {
    editingId.value = record.id;
    formState.title = record.title || '';
    visible.value = true;
};

const closeModal = () => {
    visible.value = false;
    formRef.value?.resetFields();
};

const handleSubmit = async () => {
    await formRef.value?.validate();
    if (editingId.value) {
        await updateApi({ id: editingId.value }, { ...formState });
        message.success('编辑成功');
    } else {
        await createApi({ ...formState });
        message.success('新增成功');
    }
    closeModal();
    await loadData();
};

const handleDelete = async (id: string | number) => {
    await deleteApi({ ids: id });
    message.success('删除成功');
    await loadData();
};

const handleBatchDelete = async () => {
    if (!selectedRowKeys.value.length) {
        message.warning('请先勾选要删除的分类');
        return;
    }
    await deleteApi({ ids: selectedRowKeys.value.join(',') });
    selectedRowKeys.value = [];
    message.success('批量删除成功');
    await loadData();
};

loadData();
</script>
