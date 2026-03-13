<template>
    <div class="admin-page">
        <div class="admin-toolbar">
            <a-space>
                <a-button type="primary" @click="openCreate">新增用户</a-button>
            </a-space>
            <a-input-search v-model:value="keyword" addon-before="用户名" placeholder="输入用户名搜索" @search="loadData"
                style="width: 320px" />
        </div>

        <a-table rowKey="id" :loading="loading" :columns="columns" :data-source="list" :pagination="pagination"
            :scroll="{ x: 'max-content' }">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.key === 'avatar'">
                    <img v-if="record.avatar" :src="`/api/staticfiles/avatar/${record.avatar}`" alt="头像"
                        style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover" />
                    <span v-else>--</span>
                </template>
                <template v-else-if="column.key === 'role'">{{ roleLabel(text) }}</template>
                <template v-else-if="column.key === 'status'">{{ text === '0' ? '正常' : '封号' }}</template>
                <template v-else-if="column.key === 'operation'">
                    <a-space>
                        <a @click="openEdit(record)">编辑</a>
                        <a-popconfirm title="确定删除该用户？" @confirm="handleDelete(record)">
                            <a>删除</a>
                        </a-popconfirm>
                    </a-space>
                </template>
            </template>
        </a-table>

        <a-modal :visible="visible" :title="modalTitle" ok-text="确认" cancel-text="取消" @ok="handleSubmit"
            @cancel="closeModal">
            <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{ style: { width: '88px' } }">
                <a-form-item label="用户名" name="username">
                    <a-input v-model:value="formState.username" :disabled="!!editingId" placeholder="请输入用户名" />
                </a-form-item>
                <a-form-item v-if="!editingId" label="密码" name="password">
                    <a-input-password v-model:value="formState.password" placeholder="请输入密码" />
                </a-form-item>
                <a-form-item label="昵称" name="nickname">
                    <a-input v-model:value="formState.nickname" placeholder="请输入昵称" />
                </a-form-item>
                <a-form-item label="角色" name="role">
                    <a-select v-model:value="formState.role" placeholder="请选择角色">
                        <a-select-option value="1">普通用户</a-select-option>
                        <a-select-option value="2">演示用户</a-select-option>
                        <a-select-option value="3">管理员</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="状态" name="status">
                    <a-select v-model:value="formState.status" placeholder="请选择状态">
                        <a-select-option value="0">正常</a-select-option>
                        <a-select-option value="1">封号</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="邮箱" name="email">
                    <a-input v-model:value="formState.email" placeholder="请输入邮箱" />
                </a-form-item>
                <a-form-item label="手机号" name="mobile">
                    <a-input v-model:value="formState.mobile" placeholder="请输入手机号" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { createApi, deleteApi, listApi, updateApi } from '/@/api/user';
import { useUserStore } from '/@/store';

const userStore = useUserStore();

const loading = ref(false);
const list = ref([]);
const keyword = ref('');
const page = ref(1);
const pageSize = ref(10);

const visible = ref(false);
const editingId = ref(undefined);
const formRef = ref();
const formState = reactive({
    id: undefined,
    username: '',
    password: '',
    nickname: '',
    role: undefined,
    status: '0',
    email: '',
    mobile: '',
});

const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
};

const columns = [
    { title: '头像', dataIndex: 'avatar', key: 'avatar', width: 90, align: 'center' },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 140 },
    { title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 140 },
    { title: '角色', dataIndex: 'role', key: 'role', width: 120, align: 'center' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, align: 'center' },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 220 },
    { title: '手机号', dataIndex: 'mobile', key: 'mobile', width: 140 },
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

const modalTitle = computed(() => (editingId.value ? '编辑用户' : '新增用户'));

const roleLabel = (value) => {
    const map = { '1': '普通用户', '2': '演示用户', '3': '管理员' };
    return map[value] || '--';
};

const resetForm = () => {
    formState.id = undefined;
    formState.username = '';
    formState.password = '';
    formState.nickname = '';
    formState.role = undefined;
    formState.status = '0';
    formState.email = '';
    formState.mobile = '';
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

const openCreate = () => {
    editingId.value = undefined;
    resetForm();
    visible.value = true;
};

const openEdit = (record) => {
    editingId.value = record.id;
    resetForm();
    formState.id = record.id;
    formState.username = record.username || '';
    formState.nickname = record.nickname || '';
    formState.role = record.role;
    formState.status = record.status || '0';
    formState.email = record.email || '';
    formState.mobile = record.mobile || '';
    visible.value = true;
};

const closeModal = () => {
    visible.value = false;
    formRef.value?.resetFields();
};

const handleSubmit = async () => {
    await formRef.value?.validate();
    const formData = new FormData();
    if (formState.id) formData.append('id', formState.id);
    if (formState.username) formData.append('username', formState.username);
    if (formState.password) formData.append('password', formState.password);
    if (formState.nickname) formData.append('nickname', formState.nickname);
    if (formState.role) formData.append('role', formState.role);
    if (formState.status) formData.append('status', formState.status);
    if (formState.email) formData.append('email', formState.email);
    if (formState.mobile) formData.append('mobile', formState.mobile);

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

const handleDelete = async (record) => {
    if (record.username === userStore.admin_user_name) {
        message.warning('当前管理员账号不能删除');
        return;
    }
    await deleteApi({ ids: record.id });
    message.success('删除成功');
    await loadData();
};

loadData();
</script>
