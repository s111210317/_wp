# 版本演進記錄

## v1.0 - blog（初始版本）
**功能：**
- 基本網誌系統
- 發布文章（標題 + 內容）
- 瀏覽文章列表
- 閱讀單篇文章

**技術：**
- Node.js + Express
- SQLite 資料庫
- 無使用者系統

---

## v1.1 - blog1
**新增功能：**
- 使用者註冊系統
- 使用者登入/登出
- bcrypt 密碼加密
- session 會話管理

**新增頁面：**
- `/register` - 註冊頁面
- `/login` - 登入頁面
- `/logout` - 登出

**修改：**
- 發布文章需登入
- 未登入只能瀏覽

---

## v1.2 - blog2（Threads 風格）
**新增功能：**
- Threads 風格 UI 改版
- 黑色主題設計
- 漸層頭像
- 公共貼文區 `/for-you`
- 私人貼文區 `/my-posts`
- 按讚功能
- 用戶個人頁面 `/user/:username`

**移除：**
- 標題欄位（改為純內容）
- 分頁切換（改為獨立網址）

---

## v1.3 - blog3（最終版）
**新增功能：**
- 編輯貼文功能（模態視窗）
- 標籤系統（#標籤語法）
- 標籤頁面 `/tag/:tag`
- 刪除確認對話框
- 智慧時間顯示

**優化：**
- 標籤可點擊連結
- 按讚動畫效果
- 用戶體驗優化

---

## 資料表演進

### 初始
```sql
posts (id, title, content, created_at)
```

### v1.1 新增
```sql
users (id, username, password, created_at)
```

### v1.2 修改
```sql
posts (id, user_id, content, created_at)  -- 移除 title，新增 user_id
likes (id, user_id, post_id, created_at) -- 新增按讚功能
```

### v1.3 新增
```sql
tags (id, name)                    -- 標籤資料表
post_tags (post_id, tag_id)        -- 標籤關聯表
```
