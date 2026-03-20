# IELTS AI 后端 API 前端对接文档

**文档版本**: 1.0  
**最后更新**: 2026-03-20  
**后端服务地址**: http://localhost:8080/api

---

## 目录

1. [基础说明](#基础说明)
2. [认证相关](#认证相关)
3. [文章管理](#文章管理)
4. [AI 分析](#ai-分析)
5. [用户统计](#用户统计)
6. [管理员功能](#管理员功能)
7. [错误处理](#错误处理)
8. [常见问题](#常见问题)

---

## 基础说明

### API 基础信息

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8
- **认证方式**: JWT Token（Bearer）

### 通用响应格式

所有 API 响应都遵循以下格式：

```json
{
  "code": 0,
  "message": "操作成功",
  "data": {}
}
```

#### 响应字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| code | int | 状态码，0 表示成功，-1 表示失败 |
| message | string | 响应消息 |
| data | object | 响应数据（失败时可能为 null） |

#### 示例

**成功响应**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "testuser"
  }
}
```

**失败响应**:
```json
{
  "code": -1,
  "message": "用户名或密码错误",
  "data": null
}
```

### 认证方式

需要认证的接口请求头中必须包含 Authorization：

```
Authorization: Bearer {token}
```

其中 `{token}` 是登录时返回的 JWT Token。

---

## 认证相关

### 1. 用户注册

**端点**: `POST /auth/register`

**描述**: 创建新用户账户

**请求体**:
```json
{
  "username": "testuser",
  "password": "123456",
  "nickname": "测试用户",
  "email": "test@example.com"
}
```

**请求参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名（3-50字符） |
| password | string | 是 | 密码（6-100字符） |
| nickname | string | 否 | 昵称 |
| email | string | 否 | 邮箱 |

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "email": "test@example.com",
      "avatar": null
    }
  }
}
```

**错误场景**:
- 用户名长度不符合要求 (3-50字符)
- 密码长度不符合要求 (6-100字符)
- 用户名已存在

---

### 2. 用户登录

**端点**: `POST /auth/login`

**描述**: 用户登录获取 JWT Token

**请求体**:
```json
{
  "username": "testuser",
  "password": "123456"
}
```

**请求参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "email": "test@example.com",
      "avatar": null
    }
  }
}
```

**前端处理**:
- 将返回的 token 保存到本地存储（如 localStorage）
- 后续所有需要认证的请求都要在 Header 中携带该 token
- token 有效期为 24 小时，过期后需要重新登录

---

### 3. 获取用户信息

**端点**: `GET /auth/profile`

**描述**: 获取当前登录用户的个人信息

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "nickname": "测试用户",
    "email": "test@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**错误场景**:
- Token 无效或已过期
- 用户不存在

---

### 4. 更新用户资料

**端点**: `PUT /auth/profile`

**描述**: 更新用户个人信息（昵称、邮箱、头像）

**请求头**:
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "nickname": "新昵称",
  "email": "newemail@example.com",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**请求参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 新昵称 |
| email | string | 否 | 新邮箱 |
| avatar | string | 否 | 头像 URL |

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "nickname": "新昵称",
    "email": "newemail@example.com",
    "avatar": "https://example.com/new-avatar.jpg"
  }
}
```

---

### 5. 修改密码

**端点**: `PUT /auth/security`

**描述**: 修改用户密码

**请求头**:
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "password": "newpassword123"
}
```

**请求参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| password | string | 是 | 新密码（6-100字符） |

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "nickname": "测试用户",
    "email": "test@example.com",
    "avatar": null
  }
}
```

---

## 文章管理

### 1. 获取文章列表

**端点**: `GET /articles`

**描述**: 获取文章列表，支持筛选和分页

**查询参数**:

| 参数 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| examType | string | 否 | 考试类型筛选 | IELTS, TOEFL |
| difficulty | string | 否 | 难度筛选 | easy, medium, hard |
| page | int | 否 | 页码（从 0 开始） | 0 |
| size | int | 否 | 每页数量 | 10 |

**请求示例**:
```
GET /articles?examType=IELTS&difficulty=medium&page=0&size=10
```

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "title": "人工智能与未来",
      "examType": "IELTS",
      "difficulty": "medium",
      "paragraphs": [
        {
          "paragraphNumber": 1,
          "content": "Artificial intelligence (AI) is...",
          "translation": "人工智能(AI)是...",
          "sentenceList": [
            "Artificial intelligence (AI) is the simulation of human intelligence.",
            "It is widely used in various fields."
          ],
          "sentenceTranslationList": [
            "人工智能(AI)是人类智能的模拟。",
            "它被广泛应用于各个领域。"
          ]
        }
      ],
      "topics": [
        {
          "id": 1,
          "code": "technology",
          "name": "科技"
        }
      ],
      "questions": [
        {
          "id": 1,
          "questionNumber": 1,
          "questionTypeCode": "single_choice",
          "questionTypeName": "单选题",
          "stem": "According to the passage, AI is...",
          "options": [
            {
              "label": "A",
              "content": "the simulation of human intelligence"
            },
            {
              "label": "B",
              "content": "a type of computer"
            }
          ],
          "correctAnswer": "A",
          "analysis": "第一段明确指出AI是人类智能的模拟。",
          "answerParagraphNumber": 1,
          "answerSentenceIndex": 0
        }
      ]
    }
  ]
}
```

**文章列表字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | long | 文章 ID |
| title | string | 文章标题 |
| examType | string | 考试类型（如 IELTS, TOEFL） |
| difficulty | string | 难度等级（easy, medium, hard） |
| paragraphs | array | 段落列表 |
| topics | array | 话题列表 |
| questions | array | 题目列表 |

**段落对象说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| paragraphNumber | int | 段落号 |
| content | string | 段落原文 |
| translation | string | 中文翻译 |
| sentenceList | array | 句子列表 |
| sentenceTranslationList | array | 句子中文翻译列表 |

**话题对象说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 话题 ID |
| code | string | 话题代码（technology, humanity, environment, health, language, animal） |
| name | string | 话题名称 |

**题目对象说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | long | 题目 ID |
| questionNumber | int | 题号 |
| questionTypeCode | string | 题型代码（single_choice, multi_choice, blank, judgment, match） |
| questionTypeName | string | 题型名称 |
| stem | string | 题目 |
| options | array | 选项列表（填空题/判断题/匹配题可能为空） |
| correctAnswer | string | 正确答案 |
| analysis | string | 答案解析 |
| answerParagraphNumber | int | 答案所在段落号 |
| answerSentenceIndex | int | 答案在段落中的句子索引 |

---

### 2. 获取文章详情

**端点**: `GET /articles/{id}`

**描述**: 获取单个文章的完整信息

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | long | 文章 ID |

**请求示例**:
```
GET /articles/1
```

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 1,
    "title": "人工智能与未来",
    "examType": "IELTS",
    "difficulty": "medium",
    "paragraphs": [...],
    "topics": [...],
    "questions": [...]
  }
}
```

---

### 3. 提交答案

**端点**: `POST /articles/{id}/submit`

**描述**: 用户提交答案并获取判分结果

**请求头**:
```
Authorization: Bearer {token}
```

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | long | 文章 ID |

**请求体**:
```json
{
  "questionId": 1,
  "userAnswer": "A"
}
```

**请求参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| questionId | long | 是 | 题目 ID |
| userAnswer | string | 是 | 用户答案 |

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "isCorrect": true,
    "correctAnswer": "A",
    "analysis": "第一段明确指出AI是人类智能的模拟。"
  }
}
```

**响应字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| isCorrect | boolean | 答案是否正确 |
| correctAnswer | string | 正确答案 |
| analysis | string | 答案解析 |

**前端处理**:
- 根据 `isCorrect` 判断是否回答正确
- 显示正确答案和详细解析
- 记录用户答题记录用于统计

---

## AI 分析

### AI 文本分析

**端点**: `POST /ai/analyze`

**描述**: 使用 AI 对英文文本进行语法、词汇分析

**请求头** (可选):
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "text": "The quick brown fox jumps over the lazy dog.",
  "articleTitle": "动物相关"
}
```

**请求参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| text | string | 是 | 要分析的英文文本 |
| articleTitle | string | 否 | 文章标题（用于上下文） |

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "explanation": "这是一个经典的英文句子。'quick' 是形容词，修饰 'fox'；'lazy' 修饰 'dog'。整个句子使用了简单的 SVO 语序。",
    "vocab": [
      {
        "word": "quick",
        "meaning": "快的；迅速的"
      },
      {
        "word": "brown",
        "meaning": "棕色的"
      },
      {
        "word": "fox",
        "meaning": "狐狸"
      },
      {
        "word": "jump",
        "meaning": "跳跃"
      },
      {
        "word": "lazy",
        "meaning": "懒惰的；慵懒的"
      }
    ]
  }
}
```

**响应字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| explanation | string | AI 生成的文本解释和语法分析 |
| vocab | array | 词汇列表 |

**词汇对象说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| word | string | 单词 |
| meaning | string | 中文释义 |

**使用场景**:
- 用户点击句子时触发分析
- 显示语法解释和词汇释义
- 帮助用户理解难懂的句子

**注意事项**:
- 此接口可以不需要认证
- 如果认证后调用，系统会记录用户的查询历史
- 过长的文本可能导致分析失败，建议单个句子长度不超过 500 字符

---

## 用户统计

### 获取用户统计信息

**端点**: `GET /stats`

**描述**: 获取当前用户的学习统计数据

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "totalArticlesRead": 15,
    "totalQuestionsAnswered": 47,
    "correctRate": 82
  }
}
```

**响应字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| totalArticlesRead | int | 已阅读的文章总数 |
| totalQuestionsAnswered | int | 已答题的题目总数 |
| correctRate | int | 正确率（百分比，0-100） |

**前端展示**:
- 在用户个人中心显示学习成果
- 用于生成学习进度图表
- 显示学习动态和成就

---

## 管理员功能

### 上传文章

**端点**: `POST /admin/uploadArticle`

**描述**: 管理员上传新的阅读文章

**请求头** (可选):
```
Authorization: Bearer {token}
```

**请求体**:
```json
{
  "title": "人工智能与未来社会",
  "examType": "IELTS",
  "difficulty": "hard",
  "topicCodes": ["technology", "humanity"],
  "paragraphs": [
    {
      "paragraphNumber": 1,
      "content": "Artificial intelligence (AI) is...",
      "translation": "人工智能(AI)是...",
      "sentenceList": [
        "Artificial intelligence (AI) is the simulation of human intelligence.",
        "It is widely used in various fields."
      ],
      "sentenceTranslationList": [
        "人工智能(AI)是人类智能的模拟。",
        "它被广泛应用于各个领域。"
      ]
    }
  ],
  "questions": [
    {
      "questionNumber": 1,
      "questionTypeCode": "single_choice",
      "stem": "According to the passage, AI is...",
      "options": [
        {
          "label": "A",
          "content": "the simulation of human intelligence"
        },
        {
          "label": "B",
          "content": "a type of computer"
        }
      ],
      "correctAnswer": "A",
      "analysis": "第一段明确指出AI是人类智能的模拟。",
      "answerParagraphNumber": 1,
      "answerSentenceIndex": 0
    }
  ]
}
```

**请求参数说明**:

**顶层参数**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| title | string | 是 | 文章标题 |
| examType | string | 是 | 考试类型（IELTS, TOEFL 等） |
| difficulty | string | 是 | 难度等级（easy, medium, hard） |
| topicCodes | array | 是 | 话题代码列表（如 ["technology", "humanity"]） |
| paragraphs | array | 是 | 段落列表 |
| questions | array | 是 | 题目列表 |

**段落参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| paragraphNumber | int | 是 | 段落号 |
| content | string | 是 | 段落原文 |
| translation | string | 是 | 中文翻译 |
| sentenceList | array | 是 | 句子列表 |
| sentenceTranslationList | array | 是 | 句子中文翻译列表 |

**题目参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| questionNumber | int | 是 | 题号 |
| questionTypeCode | string | 是 | 题型代码（single_choice, multi_choice, blank, judgment, match） |
| stem | string | 是 | 题目 |
| options | array | 否 | 选项列表（填空题/判断题/匹配题可能为空） |
| correctAnswer | string | 是 | 正确答案 |
| analysis | string | 是 | 答案解析 |
| answerParagraphNumber | int | 是 | 答案所在段落号 |
| answerSentenceIndex | int | 是 | 答案在段落中的句子索引 |

**选项参数说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| label | string | 是 | 选项标签（A, B, C, D 等） |
| content | string | 是 | 选项内容 |

**响应示例**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "id": 2,
    "title": "人工智能与未来社会",
    "examType": "IELTS",
    "difficulty": "hard",
    "paragraphs": [...],
    "topics": [...],
    "questions": [...]
  }
}
```

**支持的话题代码**:

| 代码 | 中文 |
|------|------|
| technology | 科技 |
| humanity | 人文 |
| environment | 环境 |
| health | 健康 |
| language | 语言 |
| animal | 动物 |

**支持的题型代码**:

| 代码 | 类型 |
|------|------|
| single_choice | 单选题 |
| multi_choice | 多选题 |
| blank | 填空题 |
| judgment | 判断题 |
| match | 匹配题 |

---

## 错误处理

### 常见错误状态码

| 状态码 | 说明 | 处理方案 |
|--------|------|--------|
| -1 | 通用错误 | 显示返回的 message 信息 |
| -1 | 用户名或密码错误 | 提示用户重新输入 |
| -1 | 用户名已存在 | 提示用户更换用户名 |
| -1 | Token 无效或已过期 | 跳转到登录页面，需要重新登录 |
| -1 | 权限不足 | 显示无权限信息 |
| -1 | 资源不存在 | 404 提示 |

### 前端错误处理建议

```javascript
// 伪代码示例
async function handleApiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(localStorage.getToken() && {
          'Authorization': `Bearer ${localStorage.getToken()}`
        })
      }
    });

    const data = await response.json();

    if (data.code === 0) {
      // 成功
      return data.data;
    } else if (data.message?.includes('过期') || data.message?.includes('无效')) {
      // Token 过期，跳转到登录
      localStorage.removeToken();
      window.location.href = '/login';
    } else {
      // 其他错误
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('API 调用失败:', error);
    throw error;
  }
}
```

---

## 常见问题

### Q1: 前端如何存储 Token？

**A**: 建议使用 localStorage 存储：
```javascript
// 登录后
const { token } = response.data;
localStorage.setItem('auth_token', token);

// 后续请求
const token = localStorage.getItem('auth_token');
headers['Authorization'] = `Bearer ${token}`;
```

### Q2: Token 过期了怎么办？

**A**: 当 API 返回 "Token 过期" 或类似错误时，清除本地 Token 并跳转到登录页面：
```javascript
localStorage.removeItem('auth_token');
window.location.href = '/login';
```

### Q3: 如何处理网络错误？

**A**: 使用 try-catch 捕获异常：
```javascript
try {
  await api.login(credentials);
} catch (error) {
  if (error.message === '网络错误') {
    // 处理网络错误
    showNotification('网络连接失败，请检查网络');
  } else {
    // 处理其他错误
    showNotification(error.message);
  }
}
```

### Q4: 文章数据结构中的段落翻译是否必须？

**A**: 是的，为了提升用户体验，每个段落都应该包含中文翻译。同时，sentenceList 和 sentenceTranslationList 的长度应该相同。

### Q5: 题目的正确答案格式是什么？

**A**: 根据题型不同：
- **单选题**: 单个选项标签，如 "A"
- **多选题**: 多个选项标签用逗号分隔，如 "A,B,C"
- **填空题**: 具体填空内容
- **判断题**: "T" (True) 或 "F" (False)
- **匹配题**: 匹配对应关系

### Q6: 如何实现文章列表的下拉加载更多？

**A**: 使用分页参数：
```javascript
// 初次加载第一页
const response1 = await api.getArticles({ page: 0, size: 10 });

// 下拉加载第二页
const response2 = await api.getArticles({ page: 1, size: 10 });

// 合并数据
articles = articles.concat(response2);
```

### Q7: AI 分析功能是否需要认证？

**A**: 不需要。AI 分析接口支持未认证用户调用，但建议携带 Token 以便系统记录用户行为。

### Q8: 如何显示用户的学习进度？

**A**: 使用 `/stats` 接口获取用户统计数据，然后在前端展示：
```javascript
const stats = await api.getStats();
// 显示：已阅读文章 15 篇，做题 47 题，正确率 82%
```

### Q9: 上传文章时如何验证数据格式？

**A**: 前端应该验证：
- 段落列表不为空
- sentenceList 和 sentenceTranslationList 长度相同
- 题目列表不为空
- 每个题目都有 correctAnswer 和 analysis

### Q10: 如何处理用户登出？

**A**: 清除本地存储的 Token 即可：
```javascript
function logout() {
  localStorage.removeItem('auth_token');
  window.location.href = '/login';
}
```

---

## 开发实践建议

### 1. API 请求封装

建议在前端创建一个 API 服务层统一处理所有请求：

```javascript
class ApiService {
  constructor(baseURL = 'http://localhost:8080/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    const data = await response.json();

    if (data.code === 0) {
      return data.data;
    } else {
      throw new Error(data.message);
    }
  }

  // 认证相关
  register(credentials) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // 文章相关
  getArticles(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/articles?${queryString}`);
  }

  getArticleDetail(id) {
    return this.request(`/articles/${id}`);
  }

  submitAnswer(articleId, answer) {
    return this.request(`/articles/${articleId}/submit`, {
      method: 'POST',
      body: JSON.stringify(answer)
    });
  }
}

export default new ApiService();
```

### 2. 错误处理最佳实践

```javascript
// 创建统一的错误处理器
function handleApiError(error) {
  if (error.message.includes('过期') || error.message.includes('无效')) {
    // Token 失效，清除并跳转
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  } else if (error.message.includes('权限')) {
    // 权限不足
    showNotification('您没有权限执行此操作');
  } else {
    // 其他错误
    showNotification(error.message);
  }
}
```

### 3. 请求/响应拦截

```javascript
// 使用 Axios 示例（如果使用 Axios）
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// 请求拦截器
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    if (response.data.code === 0) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    throw error;
  }
);

export default apiClient;
```

### 4. 数据模型定义（TypeScript）

```typescript
// 用户类型
interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar?: string;
}

// 文章类型
interface Article {
  id: number;
  title: string;
  examType: string;
  difficulty: 'easy' | 'medium' | 'hard';
  paragraphs: Paragraph[];
  topics: Topic[];
  questions: Question[];
}

interface Paragraph {
  paragraphNumber: number;
  content: string;
  translation: string;
  sentenceList: string[];
  sentenceTranslationList: string[];
}

interface Question {
  id: number;
  questionNumber: number;
  questionTypeCode: string;
  questionTypeName: string;
  stem: string;
  options?: Option[];
  correctAnswer: string;
  analysis: string;
  answerParagraphNumber: number;
  answerSentenceIndex: number;
}

interface Option {
  label: string;
  content: string;
}

// API 响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
```

---

## 接口快速参考

| 功能 | 方法 | 端点 | 认证 |
|------|------|------|------|
| 用户注册 | POST | /auth/register | 否 |
| 用户登录 | POST | /auth/login | 否 |
| 获取用户信息 | GET | /auth/profile | 是 |
| 更新用户资料 | PUT | /auth/profile | 是 |
| 修改密码 | PUT | /auth/security | 是 |
| 获取文章列表 | GET | /articles | 否 |
| 获取文章详情 | GET | /articles/{id} | 否 |
| 提交答案 | POST | /articles/{id}/submit | 是 |
| AI 文本分析 | POST | /ai/analyze | 否 |
| 获取用户统计 | GET | /stats | 是 |
| 上传文章 | POST | /admin/uploadArticle | 否 |

---

## 联系与反馈

如有任何问题或建议，请联系后端开发团队。

**文档更新日期**: 2026-03-20

