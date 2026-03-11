import { createRouter, createWebHistory } from 'vue-router';
import root from './root';

import { ADMIN_USER_TOKEN } from '/@/store/constants';

// 后台免登录白名单
const allowList = ['adminLogin'];
// 后台登录地址
const adminLoginRoutePath = '/adminLogin';

const router = createRouter({
  history: createWebHistory(),
  routes: root,
});

router.beforeEach(async (to, from, next) => {
  console.log(to, from);

  if (localStorage.getItem(ADMIN_USER_TOKEN)) {
    if (to.path === adminLoginRoutePath) {
      next({ path: '/admin' });
      return;
    }
    next();
    return;
  }

  if (allowList.includes(to.name)) {
    next();
    return;
  }

  next({ path: adminLoginRoutePath, query: { redirect: to.fullPath } });
});

router.afterEach((_to) => {
  // 回到顶部
  document.getElementById('html')?.scrollTo(0, 0);
});

export default router;
