# 合并冲突处理记录（2026-03-20）

## 背景
- 仓库在执行合并后存在多处 `UU`（unmerged）状态文件。
- 本次目标：解决全部合并冲突并保留可运行的数据结构方向。

## 冲突文件清单
已处理并解决以下 8 个冲突文件：

1. `src/views/account/AccountView.vue`
2. `src/views/account/components/AccountSecurityDialog.vue`
3. `src/views/account/components/EditProfileDialog.vue`
4. `src/views/practice/PracticeView.vue`
5. `src/views/reading/ReadingView.vue`
6. `src/views/reading/components/ArticleSection.vue`
7. `src/views/reading/components/QuestionPanel.vue`
8. `src/views/reading/components/RecentArticlesPanel.vue`

## 处理策略
- 以当前代码库的新数据模型为准（如 `username/nickname`、`correctAnswer`、`analysis`、`paragraphs` 等字段）。
- 移除已被删除 API 的依赖与相关逻辑（如 `progress`/`badge` 相关调用）。
- 保留可兼容的主题样式类（如 `text-primary`、`bg-danger/10` 等），避免引入新冲突。

## 关键合并决策
- `AccountView.vue`
  - 采用 `nickname/username` 展示用户名称。
  - 统计字段采用 `totalArticlesRead/totalQuestionsAnswered/correctRate`。
  - 移除提醒开关、徽章和阅读图表逻辑（对应 API 已在当前分支删除）。
- `EditProfileDialog.vue`
  - 保留 `nickname + email` 编辑能力。
  - 移除旧的 `target` 字段逻辑。
- `AccountSecurityDialog.vue`
  - 保留仅密码更新流程，移除手机号绑定字段。
- `ReadingView.vue`
  - 判分逻辑改为使用 `q.correctAnswer`。
  - 移除 `@/api/progress` 的冲突导入。
- `QuestionPanel.vue`
  - 题干统一为 `q.stem`，解析统一为 `q.analysis`。
  - `getButtonVariant` 返回类型统一为 `ButtonVariant`。
- `RecentArticlesPanel.vue`
  - 移除 `everCompleted/progress` UI（当前 `RecentArticle` 类型未定义）。

## 验证结果
已执行以下验证：

1. 冲突标记扫描（`<<<<<<<`, `=======`, `>>>>>>>`）
   - 结果：未发现残留标记。
2. Git 未解决冲突检查
   - 命令：`git diff --name-only --diff-filter=U`
   - 结果：空输出（无未解决冲突文件）。
3. 构建检查（`npm run build`）
   - 结果：构建失败，但失败项集中在本次冲突文件之外的数据模型迁移问题（如 `src/data/article.ts`、`src/layouts/Sidebar.vue`、`src/views/admin/AdminUploadView.vue` 等类型不一致）。

## 后续建议
- 单独发起一次“类型迁移收敛”修复，重点处理：
  - `src/data/article.ts` 与 `src/types/article.ts` 的字段契约一致性；
  - `src/layouts/Sidebar.vue` 对 `userStore.isAdmin` 的引用；
  - `src/views/admin/AdminUploadView.vue` 的 `QuestionOption` 结构映射。
