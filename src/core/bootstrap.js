import { useUserStore } from '/@/store';
import { ADMIN_USER_ID, ADMIN_USER_NAME, ADMIN_USER_TOKEN } from '/@/store/constants';

export default function Initializer() {
  const userStore = useUserStore();
  userStore.$patch((state) => {
    state.admin_user_id = localStorage.getItem(ADMIN_USER_ID);
    state.admin_user_name = localStorage.getItem(ADMIN_USER_NAME);
    state.admin_user_token = localStorage.getItem(ADMIN_USER_TOKEN);
  });
}
