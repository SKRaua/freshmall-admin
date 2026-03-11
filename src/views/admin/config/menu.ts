import {
  HomeOutlined,
  AppstoreOutlined,
  FolderOutlined,
  UserOutlined,
  InfoCircleOutlined,
  TagOutlined,
  LayoutOutlined,
  DatabaseOutlined,
} from '@ant-design/icons-vue';

export const ADMIN_MENU = [
  {
    key: 'thing',
    label: '农产品管理',
    icon: DatabaseOutlined,
  },
  {
    key: 'classification',
    label: '分类管理',
    icon: LayoutOutlined,
  },
  {
    key: 'user',
    label: '用户管理',
    icon: UserOutlined,
  },
  {
    key: 'order',
    label: '订单管理',
    icon: TagOutlined,
  },
  {
    key: 'operation',
    label: '运营管理',
    icon: FolderOutlined,
    children: [{ key: 'notice', label: '通知公告', icon: AppstoreOutlined }],
  },
  {
    key: 'logs',
    label: '日志管理',
    icon: FolderOutlined,
    children: [
      { key: 'loginLog', label: '登录日志', icon: AppstoreOutlined },
      { key: 'opLog', label: '操作日志', icon: AppstoreOutlined },
      { key: 'errorLog', label: '错误日志', icon: AppstoreOutlined },
    ],
  },
  {
    key: 'overview',
    label: '统计分析',
    icon: HomeOutlined,
  },
  {
    key: 'sysInfo',
    label: '系统信息',
    icon: InfoCircleOutlined,
  },
];
