# 前端开发快速开始指南

本指南帮助前端开发者快速上手项目，完成与后端的对接。

---

## 📋 目录

1. [环境准备](#环境准备)
2. [项目初始化](#项目初始化)
3. [API 集成](#api-集成)
4. [常用操作](#常用操作)
5. [常见问题](#常见问题)
6. [相关文档](#相关文档)

---

## 环境准备

### 系统要求

- **Node.js**: 16.0 或更高版本
- **npm**: 7.0 或更高版本，或 yarn 1.22 或更高版本
- **后端服务**: 已启动并运行在 http://localhost:8080/api

### 验证环境

```bash
# 检查 Node.js 版本
node --version  # 应显示 v16.0 或更高

# 检查 npm 版本
npm --version   # 应显示 7.0 或更高

# 检查后端是否运行
curl http://localhost:8080/api/articles
# 应该返回文章列表（如果有数据）
```

---

## 项目初始化

### Vue 3 + TypeScript 项目

```bash
# 1. 创建项目
npm create vite@latest ielts-ai-frontend -- --template vue-ts
cd ielts-ai-frontend

# 2. 安装依赖
npm install

# 3. 推荐安装额外依赖
npm install axios vue-router pinia
npm install -D tailwindcss postcss autoprefixer

# 4. 启动开发服务
npm run dev
```

### React 项目

```bash
# 1. 创建项目
npx create-react-app ielts-ai-frontend --template typescript
cd ielts-ai-frontend

# 2. 推荐安装额外依赖
npm install axios react-router-dom zustand

# 3. 启动开发服务
npm start
```

---

## API 集成

### 1. 设置 API 服务

#### 方案 A：使用提供的 API 服务类（推荐）

将 `FRONTEND_INTEGRATION_GUIDE.md` 中的 `ApiService` 类复制到项目：

```bash
# 在项目根目录
mkdir -p src/services
# 将 ApiService 实现复制到 src/services/api.ts
```

#### 方案 B：使用 Axios

```bash
npm install axios
```

然后创建 `src/services/api.ts`：

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000
});

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  response => {
    if (response.data.code === 0) {
      return response.data.data;
    }
    throw new Error(response.data.message);
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // 重定向到登录页
    }
    throw error;
  }
);

export default api;
```

### 2. 导入 API 文档

下载并导入 Postman 集合文件进行 API 测试：

1. 打开 Postman
2. 选择 **Import**
3. 选择 `IELTS_AI_API.postman_collection.json` 文件
4. 配置环境变量：
   - `base_url`: http://localhost:8080/api
   - `token`: （登录后自动填充）

### 3. 配置环境变量

创建 `.env` 文件：

```
# .env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000

# .env.production
VITE_API_BASE_URL=https://api.ieltsai.com/api
VITE_API_TIMEOUT=30000
```

---

## 常用操作

### 1. 用户认证流程

#### 注册新用户

```typescript
import api from '@/services/api';

async function register() {
  try {
    const response = await api.post('/auth/register', {
      username: 'newuser',
      password: 'password123',
      nickname: '新用户',
      email: 'user@example.com'
    });
    
    // 保存 token
    localStorage.setItem('auth_token', response.token);
    console.log('用户信息:', response.user);
  } catch (error) {
    console.error('注册失败:', error.message);
  }
}
```

#### 用户登录

```typescript
async function login(username: string, password: string) {
  try {
    const response = await api.post('/auth/login', {
      username,
      password
    });
    
    localStorage.setItem('auth_token', response.token);
    console.log('登录成功');
    // 重定向到主页
  } catch (error) {
    console.error('登录失败:', error.message);
  }
}
```

#### 获取用户信息

```typescript
async function getCurrentUser() {
  try {
    const user = await api.get('/auth/profile');
    return user;
  } catch (error) {
    console.error('获取用户信息失败:', error.message);
  }
}
```

### 2. 文章列表操作

#### 获取文章列表

```typescript
async function getArticles(page = 0, size = 10, filters = {}) {
  try {
    const params = {
      page,
      size,
      ...filters  // examType, difficulty
    };
    
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/articles?${query}`);
    return response;
  } catch (error) {
    console.error('获取文章列表失败:', error.message);
  }
}

// 使用示例
const articles = await getArticles(0, 10, {
  examType: 'IELTS',
  difficulty: 'medium'
});
```

#### 获取文章详情

```typescript
async function getArticleDetail(articleId: number) {
  try {
    const response = await api.get(`/articles/${articleId}`);
    return response;
  } catch (error) {
    console.error('获取文章详情失败:', error.message);
  }
}
```

### 3. 答题操作

#### 提交答案

```typescript
async function submitAnswer(articleId: number, questionId: number, answer: string) {
  try {
    const response = await api.post(`/articles/${articleId}/submit`, {
      questionId,
      userAnswer: answer
    });
    
    return {
      isCorrect: response.isCorrect,
      correctAnswer: response.correctAnswer,
      analysis: response.analysis
    };
  } catch (error) {
    console.error('提交答案失败:', error.message);
  }
}

// 使用示例
const result = await submitAnswer(1, 1, 'A');
console.log(`答案${result.isCorrect ? '正确' : '错误'}`);
console.log('解析:', result.analysis);
```

### 4. AI 分析

#### 分析英文文本

```typescript
async function analyzeText(text: string, articleTitle?: string) {
  try {
    const response = await api.post('/ai/analyze', {
      text,
      articleTitle
    });
    
    return {
      explanation: response.explanation,
      vocab: response.vocab
    };
  } catch (error) {
    console.error('AI 分析失败:', error.message);
  }
}

// 使用示例
const analysis = await analyzeText('The quick brown fox jumps over the lazy dog');
console.log('解释:', analysis.explanation);
console.log('词汇:', analysis.vocab);
```

### 5. 用户统计

#### 获取学习统计

```typescript
async function getUserStats() {
  try {
    const stats = await api.get('/stats');
    return {
      articlesRead: stats.totalArticlesRead,
      questionsAnswered: stats.totalQuestionsAnswered,
      correctRate: stats.correctRate
    };
  } catch (error) {
    console.error('获取统计信息失败:', error.message);
  }
}
```

---

## 常见问题

### Q1: API 返回 401 错误

**症状**: 获取需要认证的资源时返回 401

**解决方案**:
```typescript
// 检查是否已登录
const token = localStorage.getItem('auth_token');
if (!token) {
  // 跳转到登录页
  router.push('/login');
}

// 检查 token 是否正确传递
console.log('Token:', token);
```

### Q2: CORS 错误

**症状**: 浏览器控制台显示 "Access to XMLHttpRequest has been blocked by CORS policy"

**解决方案**:
- 确保后端已配置 CORS
- 检查 API 基础 URL 是否正确
- 确保使用正确的 HTTP 方法

### Q3: 请求超时

**症状**: 某些请求没有响应

**解决方案**:
```typescript
// 增加超时时间
const api = axios.create({
  timeout: 60000  // 60 秒
});

// 或者检查网络连接
if (!navigator.onLine) {
  console.error('网络连接已断开');
}
```

### Q4: Token 过期

**症状**: 登录后一段时间无法进行需要认证的操作

**解决方案**:
```typescript
// Token 有效期为 24 小时
// 可以在响应拦截器中处理
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token 无效或过期
      localStorage.removeItem('auth_token');
      // 重定向到登录
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Q5: 数据类型不匹配

**症状**: TypeScript 报告类型错误

**解决方案**:
```typescript
// 定义清晰的数据结构
interface Article {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  // ... 其他字段
}

// 类型强制转换
const article: Article = response as Article;
```

---

## 测试接口

### 1. 使用 Postman 测试

1. 打开 Postman
2. 导入 `IELTS_AI_API.postman_collection.json`
3. 设置环境变量
4. 依次测试各个接口

### 2. 使用 cURL 测试

```bash
# 登录
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 获取文章列表
curl http://localhost:8080/api/articles

# 获取用户信息（需要 token）
curl -H "Authorization: Bearer {token}" \
  http://localhost:8080/api/auth/profile
```

### 3. 浏览器控制台测试

```javascript
// 登录
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
}).then(r => r.json()).then(console.log)

// 获取文章列表
fetch('http://localhost:8080/api/articles')
  .then(r => r.json())
  .then(console.log)
```

---

## 代码模板

### Vue 3 组件示例

```vue
<template>
  <div class="article-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 内容 -->
    <div v-if="!loading && article" class="article">
      <h1>{{ article.title }}</h1>
      <div class="meta">
        <span>难度: {{ article.difficulty }}</span>
        <span>类型: {{ article.examType }}</span>
      </div>

      <!-- 段落 -->
      <div v-for="(para, index) in article.paragraphs" :key="index" class="paragraph">
        <p>{{ para.content }}</p>
        <p class="translation">{{ para.translation }}</p>
      </div>

      <!-- 题目 -->
      <div v-for="(question, index) in article.questions" :key="index" class="question">
        <h3>题目 {{ question.questionNumber }}</h3>
        <p>{{ question.stem }}</p>
        <div class="options">
          <label v-for="option in question.options" :key="option.label">
            <input type="radio" :value="option.label" v-model="answers[question.id]">
            {{ option.label }}. {{ option.content }}
          </label>
        </div>
        <button @click="submitAnswer(article.id, question.id)">提交答案</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const articleId = ref(1);  // 从路由参数获取
const article = ref(null);
const loading = ref(true);
const error = ref(null);
const answers = ref({});

onMounted(async () => {
  try {
    article.value = await api.get(`/articles/${articleId.value}`);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

async function submitAnswer(articleId: number, questionId: number) {
  try {
    const result = await api.post(`/articles/${articleId}/submit`, {
      questionId,
      userAnswer: answers.value[questionId]
    });
    
    alert(result.isCorrect ? '答案正确！' : `答案错误，正确答案是：${result.correctAnswer}`);
  } catch (err) {
    alert('提交失败：' + err.message);
  }
}
</script>

<style scoped>
.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.meta {
  display: flex;
  gap: 20px;
  color: #666;
  margin: 10px 0;
}

.paragraph {
  margin: 20px 0;
  line-height: 1.8;
}

.translation {
  color: #008000;
  font-style: italic;
  margin-top: 5px;
}

.question {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 20px 0;
  border-radius: 5px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 15px 0;
}

.options label {
  cursor: pointer;
  padding: 5px;
}

button {
  padding: 8px 16px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0052a3;
}

.loading,
.error {
  padding: 20px;
  text-align: center;
  font-size: 16px;
}

.error {
  color: #d32f2f;
}
</style>
```

### React Hook 示例

```typescript
import { useState, useEffect } from 'react';
import api from '@/services/api';

function ArticlePage({ articleId }) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  async function fetchArticle() {
    try {
      const data = await api.get(`/articles/${articleId}`);
      setArticle(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAnswer(qId: number) {
    try {
      const result = await api.post(`/articles/${articleId}/submit`, {
        questionId: qId,
        userAnswer: answers[qId]
      });

      alert(result.isCorrect ? '答案正确！' : 
            `答案错误，正确答案是：${result.correctAnswer}`);
    } catch (err) {
      alert('提交失败：' + err.message);
    }
  }

  if (loading) return <div>加载中...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!article) return null;

  return (
    <div className="article-page">
      <h1>{article.title}</h1>
      <div className="meta">
        <span>难度: {article.difficulty}</span>
        <span>类型: {article.examType}</span>
      </div>

      {/* 段落 */}
      {article.paragraphs?.map((para, idx) => (
        <div key={idx} className="paragraph">
          <p>{para.content}</p>
          <p className="translation">{para.translation}</p>
        </div>
      ))}

      {/* 题目 */}
      {article.questions?.map(question => (
        <div key={question.id} className="question">
          <h3>题目 {question.questionNumber}</h3>
          <p>{question.stem}</p>
          <div className="options">
            {question.options?.map(option => (
              <label key={option.label}>
                <input
                  type="radio"
                  name={`q${question.id}`}
                  value={option.label}
                  onChange={e => setAnswers({...answers, [question.id]: e.target.value})}
                />
                {option.label}. {option.content}
              </label>
            ))}
          </div>
          <button onClick={() => handleSubmitAnswer(question.id)}>
            提交答案
          </button>
        </div>
      ))}
    </div>
  );
}

export default ArticlePage;
```

---

## 开发工具推荐

### VS Code 扩展

- **REST Client**: 直接在 VS Code 中测试 API
- **Thunder Client**: VS Code 内置 API 客户端
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **TypeScript Vue Plugin**: Vue 3 + TypeScript 支持

### 调试工具

- **Vue DevTools**: Vue 应用调试
- **React DevTools**: React 应用调试
- **Redux DevTools**: 状态管理调试
- **Chrome DevTools**: 浏览器原生调试工具

---

## 推荐阅读

1. **[API 完整文档](./FRONTEND_API_DOCUMENTATION.md)** - 详细的 API 参考
2. **[集成指南](./FRONTEND_INTEGRATION_GUIDE.md)** - 代码集成最佳实践
3. **[Postman 集合](./IELTS_AI_API.postman_collection.json)** - API 测试用例

---

## 联系支持

遇到问题？

1. 检查 [常见问题](#常见问题) 部分
2. 查阅 API 文档
3. 联系后端开发团队

---

**祝你开发愉快！** 🚀

