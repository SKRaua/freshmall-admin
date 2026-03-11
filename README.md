# freshmall-admin

独立的后台管理端前端项目（从原混合前端工程拆分）。

# freshmall-admin

后台管理前端（项目级重构版）。

## 本地运行

```bash
pnpm install
pnpm dev
```

## 生产构建

```bash
pnpm build
```

## 项目结构

```text
src/
	api/                # 后台管理接口封装
	assets/             # 静态资源
	components/         # 全局复用组件
	core/               # 启动初始化
	router/             # 路由与鉴权
	store/              # Pinia 状态管理
	styles/             # 全局样式
	utils/              # 通用工具
	views/admin/        # 后台业务页面
```

## 约定

- 仅保留后台路由：`/adminLogin`、`/admin/*`
- 网关地址配置：`src/store/constants.js` 的 `BASE_URL`
- 后台鉴权 token：`ADMIN_USER_TOKEN`
