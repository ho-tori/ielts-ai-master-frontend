# IELTS AI 前端集成指南

本文档提供前端开发者快速集成后端 API 的实用代码示例和最佳实践。

---

## 目录

1. [API 服务层实现](#api-服务层实现)
2. [认证管理](#认证管理)
3. [错误处理](#错误处理)
4. [常用功能实现](#常用功能实现)
5. [环境配置](#环境配置)
6. [测试与调试](#测试与调试)

---

## API 服务层实现

### 使用 Fetch API

```typescript
// src/services/api.ts
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = 'http://localhost:8080/api', timeout: number = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<T> = await response.json();

      if (data.code === 0) {
        return data.data;
      } else {
        if (data.message.includes('过期') || data.message.includes('无效')) {
          this.handleTokenExpired();
        }
        throw new Error(data.message);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时');
      }
      throw error;
    }
  }

  // ==================== 认证接口 ====================

  register(data: {
    username: string;
    password: string;
    nickname?: string;
    email?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  login(data: { username: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getProfile() {
    return this.request('/auth/profile');
  }

  updateProfile(data: {
    nickname?: string;
    email?: string;
    avatar?: string;
  }) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  updateSecurity(data: { password: string }) {
    return this.request('/auth/security', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==================== 文章接口 ====================

  getArticles(params: {
    examType?: string;
    difficulty?: string;
    page?: number;
    size?: number;
  } = {}) {
    const query = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString();

    return this.request(`/articles${query ? '?' + query : ''}`);
  }

  getArticleDetail(id: number) {
    return this.request(`/articles/${id}`);
  }

  submitAnswer(articleId: number, data: { questionId: number; userAnswer: string }) {
    return this.request(`/articles/${articleId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== AI 接口 ====================

  analyzeText(data: { text: string; articleTitle?: string }) {
    return this.request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== 统计接口 ====================

  getUserStats() {
    return this.request('/stats');
  }

  // ==================== 管理员接口 ====================

  uploadArticle(data: any) {
    return this.request('/admin/uploadArticle', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== Token 管理 ====================

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  private handleTokenExpired(): void {
    this.removeToken();
    // 触发应用级别的事件，让路由器处理登出
    window.dispatchEvent(new Event('token-expired'));
  }
}

// 创建全局实例
export const apiService = new ApiService();
```

### 使用 Axios（可选）

```typescript
// src/services/apiAxios.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

export class ApiServiceAxios {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8080/api') {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        const { data } = response;
        if (data.code === 0) {
          return data.data;
        } else {
          if (data.message.includes('过期') || data.message.includes('无效')) {
            this.handleTokenExpired();
          }
          return Promise.reject(new Error(data.message));
        }
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.handleTokenExpired();
        }
        return Promise.reject(error);
      }
    );
  }

  // 所有接口方法...（与 Fetch API 版本相同）

  private handleTokenExpired(): void {
    localStorage.removeItem('auth_token');
    window.dispatchEvent(new Event('token-expired'));
  }
}

export const apiServiceAxios = new ApiServiceAxios();
```

---

## 认证管理

### 登录流程

```typescript
// src/stores/authStore.ts 或 src/contexts/AuthContext.tsx
import { reactive } from 'vue'; // 如果使用 Vue
import { apiService } from '@/services/api';

export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Vue 3 Composition API 示例
export function useAuth() {
  const state = reactive<AuthState>({
    token: localStorage.getItem('auth_token'),
    user: null,
    isLoading: false,
    error: null,
  });

  async function login(username: string, password: string) {
    state.isLoading = true;
    state.error = null;
    try {
      const response = await apiService.login({ username, password });
      state.token = response.token;
      state.user = response.user;
      apiService.setToken(response.token);
      return response;
    } catch (error) {
      state.error = error instanceof Error ? error.message : '登录失败';
      throw error;
    } finally {
      state.isLoading = false;
    }
  }

  async function register(data: {
    username: string;
    password: string;
    nickname?: string;
    email?: string;
  }) {
    state.isLoading = true;
    state.error = null;
    try {
      const response = await apiService.register(data);
      state.token = response.token;
      state.user = response.user;
      apiService.setToken(response.token);
      return response;
    } catch (error) {
      state.error = error instanceof Error ? error.message : '注册失败';
      throw error;
    } finally {
      state.isLoading = false;
    }
  }

  async function logout() {
    state.token = null;
    state.user = null;
    apiService.removeToken();
  }

  async function loadProfile() {
    try {
      state.user = await apiService.getProfile();
    } catch (error) {
      state.error = error instanceof Error ? error.message : '获取用户信息失败';
    }
  }

  return {
    state,
    login,
    register,
    logout,
    loadProfile,
    isAuthenticated: () => !!state.token,
  };
}
```

### React Context 版本

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadProfile: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('auth_token')
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.login({ username, password });
      setToken(response.token);
      setUser(response.user);
      apiService.setToken(response.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.register(data);
      setToken(response.token);
      setUser(response.user);
      apiService.setToken(response.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : '注册失败';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    apiService.removeToken();
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await apiService.getProfile();
      setUser(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户信息失败');
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    loadProfile,
    isAuthenticated: () => !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 错误处理

### 全局错误处理器

```typescript
// src/utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public message: string,
    public code?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('过期') || error.message.includes('无效')) {
      // Token 过期 - 应该由 token-expired 事件处理
      return '登录已过期，请重新登录';
    }
    if (error.message.includes('权限')) {
      return '您没有权限执行此操作';
    }
    if (error.message.includes('超时')) {
      return '请求超时，请检查网络连接';
    }
    if (error.message.includes('网络')) {
      return '网络错误，请检查连接';
    }
    return error.message;
  }
  return '发生未知错误';
}

export function showNotification(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info'
) {
  // 这里可以集成你的 UI 组件库（如 ElementUI、Antd 等）
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // 示例：使用 ElementUI
  // ElMessage[type](message);
}

// Vue 3 错误处理中间件
export function setupGlobalErrorHandler(app: any) {
  app.config.errorHandler = (err: unknown, instance, info) => {
    console.error('Global error:', err);
    if (err instanceof ApiError) {
      showNotification(err.message, 'error');
    }
  };

  // 监听 token 过期事件
  window.addEventListener('token-expired', () => {
    showNotification('登录已过期，请重新登录', 'warning');
    // 导航到登录页面
    // router.push('/login');
  });
}
```

---

## 常用功能实现

### 1. 文章列表及分页

```typescript
// src/composables/useArticles.ts (Vue 3) 或 src/hooks/useArticles.ts (React)
import { ref, computed } from 'vue';
import { apiService } from '@/services/api';

export function useArticles() {
  const articles = ref([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(0);
  const pageSize = ref(10);
  const totalCount = ref(0);

  // 过滤器
  const filters = ref({
    examType: '',
    difficulty: '',
  });

  // 获取文章列表
  const fetchArticles = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      articles.value = await apiService.getArticles({
        page: currentPage.value,
        size: pageSize.value,
        examType: filters.value.examType || undefined,
        difficulty: filters.value.difficulty || undefined,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载失败';
    } finally {
      isLoading.value = false;
    }
  };

  // 翻页
  const goToPage = (page: number) => {
    currentPage.value = page;
    fetchArticles();
  };

  // 应用过滤器
  const applyFilters = (newFilters: typeof filters.value) => {
    filters.value = newFilters;
    currentPage.value = 0;
    fetchArticles();
  };

  // 计算总页数
  const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

  // 下拉加载更多
  const loadMore = async () => {
    if (currentPage.value < totalPages.value - 1) {
      currentPage.value++;
      try {
        const moreArticles = await apiService.getArticles({
          page: currentPage.value,
          size: pageSize.value,
        });
        articles.value = [...articles.value, ...moreArticles];
      } catch (err) {
        error.value = err instanceof Error ? err.message : '加载失败';
      }
    }
  };

  return {
    articles,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    filters,
    fetchArticles,
    goToPage,
    applyFilters,
    loadMore,
  };
}
```

### 2. 答题流程

```typescript
// src/composables/useQuiz.ts
import { ref } from 'vue';
import { apiService } from '@/services/api';

export function useQuiz(articleId: number) {
  const currentQuestionIndex = ref(0);
  const answers = ref<Map<number, string>>(new Map());
  const results = ref<Map<number, any>>(new Map());
  const isSubmitting = ref(false);

  // 提交单个答案
  const submitAnswer = async (questionId: number, answer: string) => {
    isSubmitting.value = true;
    try {
      answers.value.set(questionId, answer);
      const result = await apiService.submitAnswer(articleId, {
        questionId,
        userAnswer: answer,
      });
      results.value.set(questionId, result);
      return result;
    } catch (error) {
      console.error('提交答案失败:', error);
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  };

  // 获取当前答案
  const getCurrentAnswer = (questionId: number): string | undefined => {
    return answers.value.get(questionId);
  };

  // 获取当前结果
  const getCurrentResult = (questionId: number): any | undefined => {
    return results.value.get(questionId);
  };

  // 下一题
  const nextQuestion = () => {
    currentQuestionIndex.value++;
  };

  // 上一题
  const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  };

  // 计算得分
  const calculateScore = () => {
    let correct = 0;
    let total = results.value.size;
    results.value.forEach((result) => {
      if (result.isCorrect) {
        correct++;
      }
    });
    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  };

  return {
    currentQuestionIndex,
    answers,
    results,
    isSubmitting,
    submitAnswer,
    getCurrentAnswer,
    getCurrentResult,
    nextQuestion,
    previousQuestion,
    calculateScore,
  };
}
```

### 3. AI 分析

```typescript
// src/composables/useAiAnalysis.ts
import { ref } from 'vue';
import { apiService } from '@/services/api';

export interface AnalysisResult {
  explanation: string;
  vocab: Array<{
    word: string;
    meaning: string;
  }>;
}

export function useAiAnalysis() {
  const analysis = ref<AnalysisResult | null>(null);
  const isAnalyzing = ref(false);
  const error = ref<string | null>(null);

  const analyze = async (text: string, articleTitle?: string) => {
    isAnalyzing.value = true;
    error.value = null;
    try {
      analysis.value = await apiService.analyzeText({
        text,
        articleTitle,
      });
    } catch (err) {
      error.value = err instanceof Error ? err.message : '分析失败';
      throw err;
    } finally {
      isAnalyzing.value = false;
    }
  };

  const clear = () => {
    analysis.value = null;
    error.value = null;
  };

  return {
    analysis,
    isAnalyzing,
    error,
    analyze,
    clear,
  };
}
```

### 4. 用户统计

```typescript
// src/composables/useStats.ts
import { ref } from 'vue';
import { apiService } from '@/services/api';

export function useStats() {
  const stats = ref({
    totalArticlesRead: 0,
    totalQuestionsAnswered: 0,
    correctRate: 0,
  });
  const isLoading = ref(false);

  const fetchStats = async () => {
    isLoading.value = true;
    try {
      stats.value = await apiService.getUserStats();
    } catch (error) {
      console.error('获取统计信息失败:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    stats,
    isLoading,
    fetchStats,
  };
}
```

---

## 环境配置

### 开发环境配置

```typescript
// src/config/api.ts
export const API_CONFIG = {
  // 开发环境
  development: {
    baseURL: 'http://localhost:8080/api',
    timeout: 30000,
  },
  // 生产环境
  production: {
    baseURL: 'https://api.ieltsai.com/api',
    timeout: 30000,
  },
};

export const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG[env as keyof typeof API_CONFIG];
};
```

### .env 文件示例

```
# .env.local (开发环境)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000

# .env.production
VITE_API_BASE_URL=https://api.ieltsai.com/api
VITE_API_TIMEOUT=30000
```

### 使用环境变量

```typescript
// src/services/api.ts (修改)
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const timeout = import.meta.env.VITE_API_TIMEOUT || 30000;

export const apiService = new ApiService(baseURL, parseInt(timeout));
```

---

## 测试与调试

### Mock 数据用于本地开发

```typescript
// src/services/mockData.ts
export const mockArticles = [
  {
    id: 1,
    title: "人工智能与未来",
    examType: "IELTS",
    difficulty: "medium",
    paragraphs: [
      {
        paragraphNumber: 1,
        content: "Artificial intelligence (AI) is the simulation of human intelligence.",
        translation: "人工智能(AI)是人类智能的模拟。",
        sentenceList: [
          "Artificial intelligence (AI) is the simulation of human intelligence.",
          "It is widely used in various fields."
        ],
        sentenceTranslationList: [
          "人工智能(AI)是人类智能的模拟。",
          "它被广泛应用于各个领域。"
        ]
      }
    ],
    topics: [
      { id: 1, code: "technology", name: "科技" }
    ],
    questions: [
      {
        id: 1,
        questionNumber: 1,
        questionTypeCode: "single_choice",
        questionTypeName: "单选题",
        stem: "According to the passage, AI is...",
        options: [
          { label: "A", content: "the simulation of human intelligence" },
          { label: "B", content: "a type of computer" }
        ],
        correctAnswer: "A",
        analysis: "第一段明确指出AI是人类智能的模拟。",
        answerParagraphNumber: 1,
        answerSentenceIndex: 0
      }
    ]
  }
];

export const mockUser = {
  id: 1,
  username: "testuser",
  nickname: "测试用户",
  email: "test@example.com",
  avatar: null
};

export const mockStats = {
  totalArticlesRead: 15,
  totalQuestionsAnswered: 47,
  correctRate: 82
};
```

### 开发时启用 Mock 数据

```typescript
// src/services/api.ts (修改)
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true';

class ApiService {
  // ... 其他方法

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (ENABLE_MOCK) {
      return this.getMockData<T>(endpoint);
    }

    // 真实 API 调用...
  }

  private getMockData<T>(endpoint: string): T {
    // 根据 endpoint 返回对应的 mock 数据
    if (endpoint === '/articles') {
      return mockArticles as T;
    }
    // ... 其他 mock 数据
    throw new Error(`No mock data for ${endpoint}`);
  }
}
```

### 浏览器开发者工具调试

```javascript
// 在浏览器控制台中可用
window.__API_SERVICE__ = apiService; // 导出 API 服务供调试

// 测试 API 调用
await window.__API_SERVICE__.getArticles()

// 查看当前 token
localStorage.getItem('auth_token')

// 清除 token
localStorage.removeItem('auth_token')
```

---

## 最佳实践总结

1. **使用 TypeScript** - 提供类型安全和更好的开发体验
2. **统一错误处理** - 集中处理所有 API 错误
3. **Token 管理** - 安全存储和自动刷新
4. **请求拦截** - 自动添加认证信息
5. **响应拦截** - 统一处理响应格式
6. **Loading 状态** - 提供用户反馈
7. **错误恢复** - 提供重试机制
8. **环境配置** - 区分开发和生产环境
9. **Mock 数据** - 便于离线开发测试
10. **日志记录** - 便于调试和问题排查

---

## 快速开始示例

### Vue 3 完整页面示例

```vue
<template>
  <div class="article-list">
    <!-- 过滤器 -->
    <div class="filters">
      <select v-model="filters.difficulty">
        <option value="">所有难度</option>
        <option value="easy">简单</option>
        <option value="medium">中等</option>
        <option value="hard">困难</option>
      </select>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 文章列表 -->
    <div v-if="!isLoading" class="list">
      <div v-for="article in articles" :key="article.id" class="article-card">
        <h3>{{ article.title }}</h3>
        <p>难度: {{ article.difficulty }}</p>
        <button @click="viewArticle(article.id)">查看详情</button>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 0">
        上一页
      </button>
      <span>第 {{ currentPage + 1 }} 页</span>
      <button @click="goToPage(currentPage + 1)">下一页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useArticles } from '@/composables/useArticles';
import { useRouter } from 'vue-router';

const router = useRouter();
const { articles, isLoading, error, filters, fetchArticles, goToPage, currentPage } = useArticles();

// 初始化加载
fetchArticles();

const viewArticle = (id: number) => {
  router.push(`/article/${id}`);
};
</script>

<style scoped>
.article-list {
  padding: 20px;
}

.filters {
  margin-bottom: 20px;
}

.list {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.article-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
```

---

更多具体实现细节，请参考完整的 API 文档：`FRONTEND_API_DOCUMENTATION.md`

