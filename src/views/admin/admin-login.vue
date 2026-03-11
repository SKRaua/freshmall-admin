<template>
  <div class="admin-login">
    <header class="admin-login__header">
      <img class="admin-login__logo" src="/@/assets/images/ic-admin-logo.png" />
      <span class="admin-login__title">后台管理系统</span>
    </header>

    <section class="admin-login__content">
      <div class="admin-login__card">
        <h2 class="admin-login__card-title">管理员登录</h2>
        <a-form ref="formRef" layout="vertical" :model="loginForm" :rules="rules" :hideRequiredMark="true">
          <a-form-item name="username" label="账号" :colon="false">
            <a-input v-model:value="loginForm.username" size="large" placeholder="请输入登录账号" @pressEnter="handleSubmit" />
          </a-form-item>
          <a-form-item name="password" label="密码" :colon="false">
            <a-input-password v-model:value="loginForm.password" size="large" placeholder="请输入登录密码"
              @pressEnter="handleSubmit" />
          </a-form-item>
          <a-form-item>
            <a-button class="admin-login__submit" type="primary" :loading="submitting" size="large" block
              @click="handleSubmit">
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '/@/store';

const router = useRouter();
const userStore = useUserStore();

const formRef = ref();
const submitting = ref(false);

const loginForm = reactive({
  username: 'admin123',
  password: 'admin123',
});

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    await userStore.adminLogin({
      username: loginForm.username,
      password: loginForm.password,
    });
    message.success('登录成功！');
    router.push({ path: '/admin' });
  } catch (err) {
    message.warn(err?.msg || '登录失败');
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="less" scoped>
.admin-login {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fbff 0%, #f3f5f9 100%);
}

.admin-login__header {
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.admin-login__logo {
  width: 36px;
  height: 36px;
  margin-right: 12px;
}

.admin-login__content {
  min-height: calc(100vh - 72px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.admin-login__card {
  width: 420px;
  max-width: 100%;
  background: #fff;
  border-radius: 14px;
  border: 1px solid #eef2f7;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);
  padding: 24px;
}

.admin-login__card-title {
  font-size: 22px;
  margin-bottom: 12px;
  color: #111827;
}

.admin-login__submit {
  margin-top: 8px;
}

@media (max-width: 640px) {
  .admin-login__header {
    font-size: 20px;
    padding: 0 14px;
  }

  .admin-login__content {
    align-items: flex-start;
    padding-top: 18vh;
  }
}
</style>
