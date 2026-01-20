```java
src/
├─ main.ts                  # 应用入口
├─ App.vue                  # 根组件（只放 layout / router-view）

├─ assets/                  # 静态资源
│  ├─ main.css              # Tailwind 入口
│  └─ images/

├─ api/                     # 所有后端请求
│  ├─ request.ts            # axios 实例 + 拦截器
│  ├─ user.ts               # 用户 / 登录
│  ├─ article.ts            # 阅读文章
│  └─ ai.ts                 # AI 解析 / 生词 / 讲解 ⭐

├─ router/
│  ├─ index.ts              # router 实例
│  └─ routes/
│      ├─ auth.ts
│      ├─ dashboard.ts
│      └─ reading.ts

├─ stores/                  # Pinia 状态
│  ├─ user.ts               # 用户信息
│  ├─ exam.ts               # 阅读 / 练习进度
│  └─ ai.ts                 # AI 状态（loading / result）⭐

├─ layouts/                 # 页面布局（不含业务）
│  ├─ DefaultLayout.vue
│  ├─ AuthLayout.vue
│  ├─ Header.vue
│  └─ Sidebar.vue

├─ components/              # 通用可复用组件（跨页面）
│  ├─ common/
│  │   ├─ BaseButton.vue
│  │   ├─ BaseCard.vue
│  │   ├─ Loading.vue
│  │   ├─ Empty.vue
│  │   └─ ErrorState.vue
│  │
│  ├─ ai/                   # AI 展示组件 ⭐
│  │   ├─ ExplanationCard.vue
│  │   ├─ VocabularyPanel.vue
│  │   └─ SentenceAnalysis.vue
│  │
│  └─ charts/
│      └─ ScoreTrend.vue

├─ views/                   # 页面级组件（唯一写业务逻辑的地方）
│  ├─ login/
│  │   └─ LoginView.vue
│  │
│  ├─ dashboard/
│  │   └─ DashboardView.vue
│  │
│  ├─ account/
│  │   └─ AccountView.vue
│  │
│  ├─ practice/              # 练习中心 ⭐
│  │   ├─ PracticeView.vue
│  │   └─ components/
│  │       ├─ SearchBar.vue
│  │       ├─ ExerciseCard.vue
│  │       └─ EmptyState.vue
│  │
│  └─ reading/              # 阅读模块 ⭐⭐⭐
│      ├─ ReadingView.vue   # 页面调度（请求 + 状态）
│      └─ components/
│          ├─ ArticleSection.vue
│          ├─ SentenceItem.vue
│          ├─ QuestionPanel.vue
│          └─ AiResultPanel.vue

├─ types/                   # 全局类型定义（只保留一份）
│  ├─ user.ts
│  ├─ article.ts
│  ├─ ai.ts
│  └─ api.ts

├─ utils/                   # 纯工具函数（无请求）
│  ├─ storage.ts            # localStorage / token
│  ├─ format.ts             # 文本 / 时间格式
│  └─ debounce.ts
```

