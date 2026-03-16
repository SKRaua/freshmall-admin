<template>
  <a-layout class="admin-layout">
    <a-layout-header class="admin-header">
      <div class="admin-header__brand">
        <img class="admin-header__logo" src="/src/assets/images/ic-admin-logo.png" />
        <span class="admin-header__title">后台管理</span>
      </div>
      <div class="admin-header__actions">
        <span class="admin-header__user">管理员[{{ userStore.admin_user_name }}]</span>
        <a class="admin-header__logout" @click="handleLogout">退出</a>
      </div>
    </a-layout-header>

    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" collapsible class="admin-sider">
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline" class="admin-menu" @click="handleClick">
          <template v-for="menu in ADMIN_MENU" :key="menu.key">
            <a-menu-item v-if="!menu.children" :key="menu.key">
              <component :is="menu.icon" />
              <span>{{ menu.label }}</span>
            </a-menu-item>

            <a-sub-menu v-else :key="`submenu-${menu.key}`">
              <template #icon>
                <component :is="menu.icon" />
              </template>
              <template #title>{{ menu.label }}</template>

              <a-menu-item v-for="child in menu.children" :key="child.key">
                <component :is="child.icon" />
                <span>{{ child.label }}</span>
              </a-menu-item>
            </a-sub-menu>
          </template>
        </a-menu>
      </a-layout-sider>

      <a-layout-content class="admin-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '/@/store';
import { ADMIN_MENU } from './config/menu';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const collapsed = ref(false);
const selectedKeys = ref<string[]>([]);

const routeKey = computed(() => (route.name ? String(route.name) : 'overview'));

watch(
  routeKey,
  (value) => {
    selectedKeys.value = [value];
  },
  { immediate: true },
);

const handleClick = ({ key }: { key: string }) => {
  if (!router.hasRoute(key)) {
    return;
  }
  router.push({ name: key });
};

const handleLogout = async () => {
  await userStore.adminLogout();
  router.push({ name: 'adminLogin' });
};
</script>

<style scoped lang="less">
.admin-layout {
  height: 100%;
  background: #f3f5f9;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.admin-header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-header__logo {
  width: 30px;
  height: 30px;
}

.admin-header__title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.admin-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.admin-header__user {
  color: #4b5563;
}

.admin-header__logout {
  color: #1677ff;
}

.admin-content {
  margin: 16px;
  min-height: 200px;
  overflow-x: hidden;
}

.admin-sider {
  padding: 14px 0;
}

.admin-menu {
  height: 100%;
}

@media screen and (max-width: 720px) {
  .admin-header {
    padding: 0 12px;
  }

  .admin-header__title,
  .admin-header__user {
    display: none;
  }
}
</style>
