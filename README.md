# IELTS AI - 前端应用

一个基于 Vue 3 + TypeScript + Vite 的 IELTS 阅读练习 AI 辅助平台。

## 🎯 项目特性

- ✨ **AI 智能解析** - 提供词汇解释、句子分析、整体讲解
- 📖 **阅读练习** - 支持文章阅读和问题练习
- 📊 **数据统计** - 实时记录练习进度和成绩趋势
- 🎨 **现代化 UI** - 基于 Tailwind CSS 的响应式设计
- ⚡ **高性能** - Vite 快速构建和开发体验

## 📁 项目结构

```
ielts-ai-master/
├─ src/
│  ├─ main.ts                  # 应用入口
│  ├─ App.vue                  # 根组件
│  │
│  ├─ api/                     # 后端 API 接口
│  │  ├─ request.ts            # axios 实例和拦截器
│  │  ├─ user.ts               # 用户登录相关
│  │  ├─ article.ts            # 文章数据接口
│  │  ├─ ai.ts                 # AI 分析接口 ⭐
│  │  └─ stats.ts              # 统计数据接口
│  │
│  ├─ stores/                  # Pinia 状态管理
│  │  ├─ user.ts               # 用户信息状态
│  │  ├─ exam.ts               # 考试/阅读进度
│  │  └─ theme.ts              # 主题配置
│  │
│  ├─ router/                  # 路由配置
│  │  ├─ index.ts              # 路由实例
│  │  └─ routes/
│  │      ├─ auth.ts           # 认证路由
│  │      ├─ dashboard.ts      # 仪表盘路由
│  │      └─ reading.ts        # 阅读路由
│  │
│  ├─ layouts/                 # 页面布局组件
│  │  ├─ DefaultLayout.vue
│  │  ├─ AuthLayout.vue
│  │  ├─ Header.vue
│  │  ├─ Sidebar.vue
│  │  └─ components/
│  │      └─ SidebarNavItem.vue
│  │
│  ├─ components/              # 通用可复用组件
│  │  ├─ common/               # 基础组件
│  │  │  ├─ BaseButton.vue
│  │  │  ├─ BaseCard.vue
│  │  │  ├─ BaseDialog.vue
│  │  │  ├─ BaseInput.vue
│  │  │  ├─ BaseSelect.vue
│  │  │  ├─ BaseTextarea.vue
│  │  │  ├─ Empty.vue
│  │  │  ├─ ErrorState.vue
│  │  │  └─ Loading.vue
│  │  │
│  │  ├─ ai/                   # AI 展示组件 ⭐
│  │  │  ├─ ExplanationCard.vue
│  │  │  ├─ SentenceAnalysis.vue
│  │  │  └─ VocabularyPanel.vue
│  │  │
│  │  └─ charts/               # 图表组件
│  │
│  ├─ views/                   # 页面级组件（业务逻辑）
│  │  ├─ login/
│  │  │  ├─ LoginView.vue
│  │  │  └─ components/
│  │  │
│  │  ├─ account/
│  │  │  ├─ AccountView.vue
│  │  │  └─ components/
│  │  │      ├─ AccountSecurityDialog.vue
│  │  │      └─ EditProfileDialog.vue
│  │  │
│  │  ├─ admin/
│  │  │  ├─ AdminUploadView.vue
│  │  │  └─ components/
│  │  │      └─ AdminQuestionItem.vue
│  │  │
│  │  ├─ dashboard/
│  │  │  └─ DashboardView.vue
│  │  │
│  │  ├─ practice/             # 练习中心 ⭐
│  │  │  ├─ PracticeView.vue
│  │  │  └─ components/
│  │  │      ├─ SearchBar.vue
│  │  │      ├─ ExerciseCard.vue
│  │  │      ├─ Pagination.vue
│  │  │      └─ EmptyState.vue
│  │  │
│  │  ├─ reading/              # 阅读模块 ⭐⭐⭐
│  │  │  ├─ ReadingView.vue
│  │  │  └─ components/
│  │  │      ├─ ArticleSection.vue
│  │  │      ├─ SentenceItem.vue
│  │  │      ├─ QuestionPanel.vue
│  │  │      ├─ AiResultPanel.vue
│  │  │      ├─ ReadingBottomNavigator.vue
│  │  │      ├─ ReadingToolPanel.vue
│  │  │      ├─ RecentArticlesPanel.vue
│  │  │
│  │  └─ notfound/
│  │     └─ NotFoundView.vue
│  │
│  ├─ types/                   # 全局类型定义
│  │  ├─ user.ts
│  │  ├─ article.ts
│  │  ├─ ai.ts
│  │  └─ api.ts
│  │
│  ├─ utils/                   # 工具函数
│  │  ├─ storage.ts            # localStorage 管理
│  │  ├─ format.ts             # 文本格式化
│  │  └─ debounce.ts           # 防抖函数
│  │
│  ├─ styles/                  # 全局样式
│  │  └─ globals.css
│  │
│  ├─ data/                    # 本地数据
│  │  ├─ article.ts
│  │  └─ user.ts
│  │
│  └─ assets/                  # 静态资源
│     ├─ main.css
│     └─ images/
│
├─ public/                     # 公共静态资源
├─ docs/                       # 项目文档（已在 .gitignore 中忽略）
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ tailwind.config.js
├─ postcss.config.js
├─ .gitignore
└─ index.html
```

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **样式**: Tailwind CSS + PostCSS
- **编辑器**: TypeScript + ESLint (推荐)

## 🚀 快速开始

### 前置要求
- Node.js >= 16
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发服务
```bash
npm run dev
```

### 构建生产
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📝 主要功能模块

### 1. 认证模块 (auth)
- 用户登录
- 用户注册
- 身份验证

### 2. 仪表盘 (dashboard)
- 学习进度概览
- 成绩统计
- 最近活动

### 3. 阅读模块 (reading) ⭐⭐⭐
- 文章浏览和阅读
- AI 智能解析（词汇、句子、整体讲解）
- 练习题目
- 答题反馈

### 4. 练习中心 (practice) ⭐
- 练习题库搜索
- 练习题目浏览
- 成绩记录

### 5. 用户账户 (account)
- 个人信息管理
- 账户安全设置
- 密码修改

## 📚 API 文档

详见 [FRONTEND_API_DOCUMENTATION.md](docs/FRONTEND_API_DOCUMENTATION.md)

## 🤝 协作指南

详见 [FRONTEND_COLLABORATION_GUIDE.md](docs/FRONTEND_COLLABORATION_GUIDE.md)

## 📖 文档目录

- [快速开始指南](docs/FRONTEND_QUICK_START.md)
- [开发文档](docs/FRONTEND_DOCUMENTATION_README.md)
- [集成指南](docs/FRONTEND_INTEGRATION_GUIDE.md)
- [API 文档](docs/IELTS_AI_API.postman_collection.json)

## 🐛 已知问题和改进

详见 [COMPLETION_REPORT.md](docs/COMPLETION_REPORT.md)


