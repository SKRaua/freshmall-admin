<template>
    <div class="admin-page">
        <div class="admin-toolbar">
            <a-space>
                <a-button type="primary" @click="openCreate">新增商品</a-button>
                <a-button danger @click="handleBatchDelete">批量删除</a-button>
            </a-space>
            <a-input-search v-model:value="keyword" addon-before="名称" placeholder="输入商品名搜索" @search="loadData"
                style="width: 320px" />
        </div>

        <a-table rowKey="id" :loading="loading" :columns="columns" :data-source="list" :row-selection="rowSelection"
            :pagination="pagination" :scroll="{ x: 'max-content' }">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'cover'">
                    <img v-if="record.cover" :src="`/api/staticfiles/image/${record.cover}`" alt="商品图"
                        style="width: 36px; height: 36px; border-radius: 4px; object-fit: cover" />
                    <span v-else>--</span>
                </template>
                <template v-else-if="column.key === 'status'">{{ text === '0' ? '上架' : '下架' }}</template>
                <template v-else-if="column.key === 'description'">{{ shortText(text) }}</template>
                <template v-else-if="column.key === 'operation'">
                    <a-space>
                        <a @click="openEdit(record)">编辑</a>
                        <a-popconfirm title="确定删除该商品？" @confirm="handleDelete(record.id)">
                            <a>删除</a>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </a-table>

        <a-modal :visible="visible" :title="modalTitle" width="880px" ok-text="确认" cancel-text="取消" @ok="handleSubmit"
            @cancel="closeModal">
            <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ style: { width: '88px' } }">
                <a-row :gutter="16">
                    <a-col :span="24">
                        <a-form-item label="农产品名称" name="title">
                            <a-input v-model:value="formState.title" placeholder="请输入农产品名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="分类" name="classificationId">
                            <a-select v-model:value="formState.classificationId" :options="classificationOptions"
                                :field-names="{ label: 'title', value: 'id' }" placeholder="请选择分类" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="封面图">
                            <a-upload-dragger v-model:file-list="fileList" name="file" accept="image/*"
                                :multiple="false" :before-upload="beforeUpload">
                                <p class="ant-upload-drag-icon">
                                    <img v-if="coverPreview" :src="coverPreview"
                                        style="width: 64px; height: 64px; object-fit: cover" />
                                </p>
                                <p class="ant-upload-text">拖拽或点击上传封面图片</p>
                            </a-upload-dragger>
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="农产品简介">
                            <a-textarea v-model:value="formState.description" :rows="3" placeholder="请输入商品简介" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="价格" name="price">
                            <a-input-number v-model:value="formState.price" :min="0" style="width: 100%" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="库存" name="repertory">
                            <a-input-number v-model:value="formState.repertory" :min="0" style="width: 100%" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="品种">
                            <a-input v-model:value="formState.pinzhong" placeholder="请输入品种" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="保质期">
                            <a-input v-model:value="formState.baozhiqi" placeholder="请输入保质期" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="生产日期">
                            <a-input v-model:value="formState.shengchanriqi" placeholder="请输入生产日期" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="状态" name="status">
                            <a-select v-model:value="formState.status" placeholder="请选择状态">
                                <a-select-option value="0">上架</a-select-option>
                                <a-select-option value="1">下架</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { computed, h, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { createApi, deleteApi, listApi, updateApi } from '/@/api/thing';
import { listApi as listClassificationApi } from '/@/api/classification';

const loading = ref(false);
const list = ref([]);
const keyword = ref('');
const page = ref(1);
const pageSize = ref(10);
const selectedRowKeys = ref([]);

const visible = ref(false);
const editingId = ref(undefined);
const formRef = ref();
const fileList = ref([]);
const coverPreview = ref('');
const classificationOptions = ref([]);

const formState = reactive({
    id: undefined,
    title: '',
    classificationId: undefined,
    description: '',
    price: undefined,
    pinzhong: '',
    baozhiqi: '',
    shengchanriqi: '',
    repertory: undefined,
    status: '0',
    imageFile: undefined,
});

const rules = {
    title: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    classificationId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    price: [{ required: true, message: '请输入价格', trigger: 'change' }],
    repertory: [{ required: true, message: '请输入库存', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const columns = [
    { title: '图片', dataIndex: 'cover', key: 'cover', width: 90, align: 'center' },
    {
        title: '名称',
        dataIndex: 'title',
        key: 'title',
        width: 180,
        customRender: ({ text }) => h('span', { class: 'title-ellipsis-3' }, text || '--'),
    },
    { title: '价格', dataIndex: 'price', key: 'price', width: 100 },
    { title: '品种', dataIndex: 'pinzhong', key: 'pinzhong', width: 120 },
    { title: '保质期', dataIndex: 'baozhiqi', key: 'baozhiqi', width: 120 },
    { title: '生产日期', dataIndex: 'shengchanriqi', key: 'shengchanriqi', width: 140 },
    { title: '库存', dataIndex: 'repertory', key: 'repertory', width: 100 },
    { title: '简介', dataIndex: 'description', key: 'description', width: 200 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' },
    { title: '操作', key: 'operation', width: 140, align: 'center', fixed: 'right' },
];

const pagination = computed(() => ({
    current: page.value,
    pageSize: pageSize.value,
    showSizeChanger: false,
    showTotal: (total) => `共${total}条数据`,
    onChange: (current) => {
        page.value = current;
    },
}));

const rowSelection = computed(() => ({
    selectedRowKeys: selectedRowKeys.value,
    onChange: (keys) => {
        selectedRowKeys.value = keys;
    },
}));

const modalTitle = computed(() => (editingId.value ? '编辑商品' : '新增商品'));

const shortText = (text) => {
    if (!text) return '--';
    return text.length > 22 ? `${text.slice(0, 22)}...` : text;
};

const resetForm = () => {
    formState.id = undefined;
    formState.title = '';
    formState.classificationId = undefined;
    formState.description = '';
    formState.price = undefined;
    formState.pinzhong = '';
    formState.baozhiqi = '';
    formState.shengchanriqi = '';
    formState.repertory = undefined;
    formState.status = '0';
    formState.imageFile = undefined;
    fileList.value = [];
    coverPreview.value = '';
};

const beforeUpload = (file) => {
    const fileName = `${Date.now()}.${file.type.substring(6)}`;
    formState.imageFile = new File([file], fileName);
    coverPreview.value = URL.createObjectURL(file);
    fileList.value = [file];
    return false;
};

const loadData = async () => {
    loading.value = true;
    try {
        const res = await listApi({ keyword: keyword.value });
        const data = Array.isArray(res?.data) ? res.data : [];
        list.value = data;
    } finally {
        loading.value = false;
    }
};

const loadClassifications = async () => {
    const res = await listClassificationApi({});
    classificationOptions.value = Array.isArray(res?.data) ? res.data : [];
};

const openCreate = () => {
    editingId.value = undefined;
    resetForm();
    visible.value = true;
};

const openEdit = (record) => {
    editingId.value = record.id;
    resetForm();
    formState.id = record.id;
    formState.title = record.title || '';
    formState.classificationId = record.classificationId;
    formState.description = record.description || '';
    formState.price = record.price;
    formState.pinzhong = record.pinzhong || '';
    formState.baozhiqi = record.baozhiqi || '';
    formState.shengchanriqi = record.shengchanriqi || '';
    formState.repertory = record.repertory;
    formState.status = record.status || '0';
    if (record.cover) {
        coverPreview.value = `/api/staticfiles/image/${record.cover}`;
    }
    visible.value = true;
};

const closeModal = () => {
    visible.value = false;
    formRef.value?.resetFields();
};

const handleSubmit = async () => {
    await formRef.value?.validate();
    const formData = new FormData();
    if (editingId.value) formData.append('id', editingId.value);
    formData.append('title', formState.title);
    if (formState.classificationId) formData.append('classificationId', formState.classificationId);
    if (formState.imageFile) formData.append('imageFile', formState.imageFile);
    formData.append('description', formState.description || '');
    formData.append('price', formState.price ?? '');
    formData.append('pinzhong', formState.pinzhong || '');
    formData.append('baozhiqi', formState.baozhiqi || '');
    formData.append('shengchanriqi', formState.shengchanriqi || '');
    formData.append('repertory', formState.repertory ?? '');
    formData.append('status', formState.status || '0');

    if (editingId.value) {
        await updateApi(formData);
        message.success('编辑成功');
    } else {
        await createApi(formData);
        message.success('新增成功');
    }

    closeModal();
    await loadData();
};

const handleDelete = async (id) => {
    await deleteApi({ ids: id });
    message.success('删除成功');
    await loadData();
};

const handleBatchDelete = async () => {
    if (!selectedRowKeys.value.length) {
        message.warning('请先勾选要删除的商品');
        return;
    }
    await deleteApi({ ids: selectedRowKeys.value.join(',') });
    selectedRowKeys.value = [];
    message.success('批量删除成功');
    await loadData();
};

loadData();
loadClassifications();
</script>

<style scoped>
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
