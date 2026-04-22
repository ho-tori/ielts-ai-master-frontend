# 一、系统目标

系统用于实现 **AI阅读理解辅助**：

- 管理员上传阅读文章
- 系统自动处理文章并存储
- 用户做题时请求 AI 解析
- AI 返回 **答案 + 解析 + 关键句**
- 前端高亮关键句并支持跳转

------

# 二、系统整体架构

```text
前端 (Web)
    │
    ▼
后端 API (SpringBoot / Node)
    │
    ├── MySQL
    │       ├─ 文章
    │       ├─ 文章 chunk
    │       ├─ 题目
    │       └─ AI解析缓存
    │
    └── AI 服务
            ├─ Embedding (向量化)
            └─ LLM 解析题目
```

------

# 三、管理员上传文章流程

管理员负责上传阅读材料。

```text
管理员
   │
   │ 上传文章
   ▼
前端
   │
   │ POST /admin/uploadArticle
   ▼
后端 Controller
   │
   ▼
文章处理 Service
   │
   ├─ 1 清洗文本
   │
   ├─ 2 按长度切分 chunk
   │
   ├─ 3 记录 chunk 在原文中的位置
   │     start_offset
   │     end_offset
   │
   └─ 4 存入数据库
```

数据库示例：

**Article**

```text
id
title
content
```

**ArticleChunk**

```text
id
article_id
content
start_offset
end_offset
embedding
```

chunk 的作用：

- 防止文章过长
- 方便 AI 检索关键段落

------

# 四、用户做题流程

用户阅读文章并请求解析。

```text
用户
   │
   │ 点击 “查看解析”
   ▼
前端
   │
   │ GET /question/{id}/analysis
   ▼
后端
```

后端处理逻辑：

```text
1 查询数据库
   │
   ├─ 已存在解析
   │      │
   │      └─ 直接返回
   │
   └─ 不存在解析
          │
          ▼
       调用 AI
```

------

# 五、AI解析流程

如果解析不存在：

```text
题目
   │
   ▼
EmbeddingService
   │
   │ 题目向量化
   ▼
Vector Search
   │
   │ 找到最相关的文章 chunk
   ▼
AI (LLM)
   │
   │ 输入：
   │ question + chunk
   │
   ▼
返回 JSON
```

AI返回结构示例：

```json
{
  "answer": "B",
  "analysis": "作者通过对比两种观点说明...",
  "keywords": [
    {
      "text": "However, many researchers argue...",
      "start": 320,
      "end": 360,
      "reason": "转折句体现作者态度"
    }
  ]
}
```

------

# 六、解析缓存流程

AI返回后：

```text
AI 返回解析
    │
    ▼
后端
    │
    ├─ 存入 QuestionAnalysis 表
    │
    └─ 返回前端
```

数据库：

**QuestionAnalysis**

```text
id
question_id
answer
analysis
keywords_json
created_time
```

这样做的好处：

- AI **只调用一次**
- 之后直接从数据库读取

------

# 七、前端高亮与跳转逻辑

前端拿到 `keywords` 后：

```text
文章原文
   │
   ▼
根据 start / end
   │
   ▼
插入 <span class="highlight">
```

示例：

```html
<span class="highlight">
However, many researchers argue...
</span>
```

用户点击关键词：

```javascript
element.scrollIntoView({
  behavior: "smooth"
});
```

页面会自动跳到文章对应位置。

------

# 八、完整系统流程（最终版）

```text
管理员上传文章
      │
      ▼
后端处理
      │
      ├─ 文本清洗
      ├─ chunk切分
      └─ 存数据库
      │
      ▼
用户做题
      │
      ▼
请求解析
      │
      ▼
后端查询数据库
      │
   ┌──┴─────────┐
   │            │
已有解析      无解析
   │            │
   ▼            ▼
直接返回      AI解析
                 │
                 ▼
            存数据库
                 │
                 ▼
             返回前端
                 │
                 ▼
         前端高亮关键句
         点击跳转原文位置
```

------

# 九、这个系统的核心设计思想

其实就是三个核心：

### 1 文本 chunk 化

避免文章太长。

### 2 RAG 检索

只把相关段落给 AI。

### 3 AI解析缓存

避免重复调用 AI。