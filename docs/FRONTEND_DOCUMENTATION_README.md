# 前端对接文档总览

本项目包含了完整的前端对接文档，帮助前端开发者快速集成后端 API。

---

## 📚 文档清单

### 1. **FRONTEND_API_DOCUMENTATION.md** (主要文档)
   - **用途**: 完整的 API 接口文档
   - **内容包括**:
     - API 基础信息和通用响应格式
     - 认证相关 API（登录、注册、个人资料等）
     - 文章管理 API（列表、详情、答题）
     - AI 分析 API
     - 用户统计 API
     - 管理员上传文章 API
     - 错误处理说明
     - 常见问题解答
   - **适合**: API 开发者、测试人员、前端开发者查询 API 接口

### 2. **FRONTEND_INTEGRATION_GUIDE.md** (集成指南)
   - **用途**: 前端集成实现指南
   - **内容包括**:
     - API 服务层实现（Fetch API 和 Axios 两种方案）
     - 认证管理（Vue 3 Composition API 和 React Hooks）
     - 全局错误处理
     - 常用功能实现（文章列表、答题、AI 分析等）
     - 环境配置
     - 本地开发 Mock 数据
     - 最佳实践建议
   - **适合**: 前端开发者学习如何集成 API

### 3. **FRONTEND_QUICK_START.md** (快速开始)
   - **用途**: 快速上手指南
   - **内容包括**:
     - 环境准备检查
     - Vue 3 和 React 项目初始化
     - API 服务配置（两种方案）
     - 常用操作代码示例
     - 常见问题排查
     - 接口测试方法
     - 完整的组件代码模板（Vue 3 和 React）
     - 推荐工具和扩展
   - **适合**: 新加入项目的开发者快速上手

### 4. **IELTS_AI_API.postman_collection.json** (Postman 集合)
   - **用途**: API 测试用例集合
   - **内容包括**:
     - 所有 API 接口的完整测试用例
     - 请求示例和参数说明
     - 预设的环境变量（base_url, token）
   - **如何使用**:
     1. 打开 Postman
     2. 点击 Import
     3. 选择此文件
     4. 配置环境变量
     5. 开始测试
   - **适合**: API 测试、集成测试、接口验证

---

## 🚀 快速开始流程

### 第一步：选择合适的文档

```
如果你是...
├─ 前端新手
│  └─ 阅读：FRONTEND_QUICK_START.md
├─ 需要 API 详细信息
│  └─ 阅读：FRONTEND_API_DOCUMENTATION.md
├─ 要学习代码实现
│  └─ 阅读：FRONTEND_INTEGRATION_GUIDE.md
└─ 需要测试 API
   └─ 使用：IELTS_AI_API.postman_collection.json
```

### 第二步：环境检查

```bash
# 确保后端服务运行在 http://localhost:8080/api
curl http://localhost:8080/api/articles

# 检查 Node.js 和 npm
node --version
npm --version
```

### 第三步：项目初始化

```bash
# Vue 3 + TypeScript
npm create vite@latest ielts-ai-frontend -- --template vue-ts
cd ielts-ai-frontend
npm install axios vue-router pinia

# 或 React
npx create-react-app ielts-ai-frontend --template typescript
npm install axios react-router-dom zustand
```

### 第四步：集成 API 服务

1. 从 **FRONTEND_INTEGRATION_GUIDE.md** 复制 `ApiService` 类
2. 或使用 Axios 配置（参考 **FRONTEND_QUICK_START.md**）
3. 配置环境变量

### 第五步：开发与测试

- 参考 **FRONTEND_QUICK_START.md** 中的代码模板
- 使用 Postman 测试 API 端点
- 开始开发功能模块

---

## 📖 API 接口总览

| 功能模块 | 方法 | 端点 | 认证 | 文档位置 |
|---------|------|------|------|---------|
| **认证** | POST | /auth/register | 否 | [认证模块](./FRONTEND_API_DOCUMENTATION.md#认证相关) |
| | POST | /auth/login | 否 | |
| | GET | /auth/profile | 是 | |
| | PUT | /auth/profile | 是 | |
| | PUT | /auth/security | 是 | |
| **文章** | GET | /articles | 否 | [文章管理](./FRONTEND_API_DOCUMENTATION.md#文章管理) |
| | GET | /articles/{id} | 否 | |
| | POST | /articles/{id}/submit | 是 | |
| **AI** | POST | /ai/analyze | 否 | [AI 分析](./FRONTEND_API_DOCUMENTATION.md#ai-分析) |
| **统计** | GET | /stats | 是 | [用户统计](./FRONTEND_API_DOCUMENTATION.md#用户统计) |
| **管理** | POST | /admin/uploadArticle | 否 | [管理员功能](./FRONTEND_API_DOCUMENTATION.md#管理员功能) |

---

## 🔧 常用代码片段

### 快速登录

```typescript
import { apiService } from '@/services/api';

async function quickLogin() {
  try {
    const result = await apiService.login({
      username: 'admin',
      password: 'admin123'
    });
    localStorage.setItem('auth_token', result.token);
    console.log('登录成功', result.user);
  } catch (error) {
    console.error('登录失败', error.message);
  }
}
```

### 获取文章列表

```typescript
async function loadArticles() {
  try {
    const articles = await apiService.getArticles({
      page: 0,
      size: 10,
      difficulty: 'medium'
    });
    console.log('文章列表', articles);
  } catch (error) {
    console.error('加载失败', error.message);
  }
}
```

### 提交答案

```typescript
async function submitUserAnswer() {
  try {
    const result = await apiService.submitAnswer(1, {
      questionId: 1,
      userAnswer: 'A'
    });
    console.log('是否正确:', result.isCorrect);
    console.log('解析:', result.analysis);
  } catch (error) {
    console.error('提交失败', error.message);
  }
}
```

### AI 分析

```typescript
async function analyzeText() {
  try {
    const result = await apiService.analyzeText({
      text: 'The quick brown fox jumps over the lazy dog.',
      articleTitle: '动物故事'
    });
    console.log('解释:', result.explanation);
    console.log('词汇:', result.vocab);
  } catch (error) {
    console.error('分析失败', error.message);
  }
}
```

---

## 📊 数据流图

```
前端应用
  │
  ├─ 用户认证
  │   └─ /auth/* API
  │
  ├─ 文章浏览
  │   ├─ GET /articles (列表)
  │   └─ GET /articles/{id} (详情)
  │
  ├─ 答题练习
  │   └─ POST /articles/{id}/submit (提交答案)
  │
  ├─ AI 分析
  │   └─ POST /ai/analyze (文本分析)
  │
  └─ 统计查询
      └─ GET /stats (用户统计)
```

---

## ✅ 检查清单

前端开发者完成集成时，请检查以下项目：

- [ ] 后端服务运行正常 (http://localhost:8080/api)
- [ ] 已创建前端项目并安装必要依赖
- [ ] 已配置 API 服务层和环境变量
- [ ] 已测试登录功能
- [ ] 已测试获取文章列表
- [ ] 已测试获取文章详情
- [ ] 已测试答题功能
- [ ] 已测试 AI 分析功能
- [ ] 已处理所有错误场景
- [ ] 已进行浏览器兼容性测试
- [ ] 已使用 TypeScript 进行类型检查
- [ ] 已实现 Token 自动刷新或过期处理
- [ ] 已实现响应式加载状态
- [ ] 已进行性能优化（图片懒加载、列表虚拟化等）

---

## 🐛 问题排查

### API 调用失败

1. **检查后端是否运行**
   ```bash
   curl http://localhost:8080/api/articles
   ```

2. **检查网络连接**
   - 确保防火墙未阻止请求
   - 检查 VPN 连接状态

3. **检查环境变量配置**
   - 确认 `VITE_API_BASE_URL` 正确
   - 重启开发服务器

4. **查看浏览器控制台错误**
   - F12 打开开发者工具
   - 查看 Network 标签中的请求

### Token 相关问题

- Token 过期: 需要重新登录
- Token 无效: 清除本地 token，重新登录
- Token 未传递: 检查请求头是否正确设置

### 跨域（CORS）问题

- 确认后端已配置 CORS
- 检查请求的 HTTP 方法和头部
- 尝试在 Postman 中测试相同请求

---

## 📞 获取帮助

### 文档位置

| 问题类型 | 参考文档 |
|---------|---------|
| 不知道如何开始 | FRONTEND_QUICK_START.md |
| 不清楚 API 接口 | FRONTEND_API_DOCUMENTATION.md |
| 需要代码示例 | FRONTEND_INTEGRATION_GUIDE.md |
| 需要测试 API | IELTS_AI_API.postman_collection.json |

### 开发工具

- **VS Code**: https://code.visualstudio.com/
- **Postman**: https://www.postman.com/
- **Chrome DevTools**: F12 在 Chrome 浏览器中打开

### 相关资源

- Vue 3 文档: https://vuejs.org/
- React 文档: https://react.dev/
- Axios 文档: https://axios-http.com/
- TypeScript 文档: https://www.typescriptlang.org/

---

## 📝 文档版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0 | 2026-03-20 | 初始版本，包含所有基础 API 文档 |

---

## 👥 贡献指南

如需更新文档：

1. 修改对应的 markdown 文件
2. 确保文档内容准确完整
3. 遵循现有的文档格式
4. 提交更新请求

---

## 📄 许可证

本文档遵循项目许可证。

---

**祝你开发顺利！** 🎉

如有任何问题或建议，欢迎联系后端开发团队。

