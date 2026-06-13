# 作業 01 ~ 07 說明

## 作業 01 — 個人網頁（`01/me.html`）
以「施宇柔」（學號 111210317）為主題的個人資訊卡片，包含大頭貼、姓名、學號、Email，具有懸浮動畫（`hover` 上移）與圓角卡片設計，採用簡潔的藍白配色風格，並附「寄信給我」按鈕。

## 作業 02 — 食品感官評鑑表單（`02/foodform.html`）
新產品官能品評問卷，包含基本資料（姓名、Email、日期、年齡）、外觀與色澤（顏色選取器、評分滑桿即時顯示數值）、風味與口感（甜度單選、風味複選、質地下拉選單）、綜合評價（照片上傳、時間選取、文字建議）。JavaScript 實作日期自動填入與滑桿數值即時更新。

## 作業 03 — Hello World（`03/hello.js`）
最簡 JavaScript 入門：`console.log('hello 你好')`，熟悉 Node.js 執行環境。

## 作業 04 — 十個 JavaScript 函式練習（`04/`）
涵蓋 10 道 JS 實作題，需自行完成函式邏輯（僅提供測試呼叫）：
1. `sumArray` — 陣列數字加總
2. `checkAdult` — 成年資格判斷
3. `findFirstLargeNumber` — 找出第一個合格數字
4. `filterByBudget` — 依預算篩選商品
5. `processStudentData` — JSON 解析與資料擴充
6. `countdown` — 倒數狀態產生器
7. `countStrings` — 統計物件內字串型別屬性數量
8. `getActiveUsers` — 篩選活躍使用者並輸出 JSON
9. `sumPassingScores` — 及格分數加總
10. `processOrders` — 訂單庫存管理系統（含庫存不足警告）

## 作業 05 — 部落格系統多版本迭代（`05/`）

### blog1 — 基本部落格
基於 Express + SQLite 的基本文章 CRUD，可瀏覽文章列表與新增文章，使用 EJS 樣板引擎。

### blog2 — 加入會員系統
在 blog1 基礎上加入使用者註冊、登入、登出功能，並以 bcrypt 加密密碼，使用 session 管理登入狀態。

### blog3 — Threads 風格社群平台
改版為類似 Instagram Threads 的微社群平台，支援：
- 「為你推薦」與「我的貼文」雙動態牆
- 按讚 / 取消按讚（無刷新頁面，透過 `fetch` API）
- `#Hashtag` 自動解析與標籤搜尋頁面
- 貼文編輯（Modal 編輯框）與刪除
- 使用者個人頁面
- 深色主題 UI 設計，所有視圖以 JavaScript 字串內嵌渲染

## 作業 06 — JavaScript 練習（`06/`）
10 個 JS 基礎觀念練習檔案：

| 檔案 | 主題 |
|------|------|
| `1.js` | 高階函式 — `mathTool` 回呼計算機（加/減） |
| `2.js` | 立即執行函式（IIFE）與變數作用域 |
| `3.js` | `map()` 方法 — 陣列打 8 折 |
| `4.js` | 陣列操作 — `pop()` 移除末項、`unshift()` 插入開頭 |
| `5.js` | 閉包（Closure）— `multiplier` 乘法工廠 |
| `6.js` | 自訂 `myFilter` — 回呼函式實作篩選 |
| `7.js` | 物件陣列篩選 — 找出成年使用者 |
| `8.js` | 傳參考（Pass by Reference）— 陣列可變性示範 |
| `9.js` | `setTimeout` — 非同步延遲執行 |
| `10.js` | `calculateTotal` — 購物車總價計算與折扣回呼 |

## 作業 07 — JavaScript 練習（`07/`）
10 個進階 JS 概念練習檔案（含完整 README）：

| 檔案 | 主題 |
|------|------|
| `1.js` | 物件屬性存取 — 點記法 vs 括號記法 |
| `2.js` | 解構賦值 — 從 `req.body` 提取屬性 |
| `3.js` | `forEach` 迭代 + 模板字串組 HTML |
| `4.js` | 動態新增物件屬性 |
| `5.js` | 回呼函式（Callback）非同步模擬 |
| `6.js` | `JSON.parse()` 解析巢狀資料 |
| `7.js` | 模擬資料庫查詢（`fakeGet`） |
| `8.js` | 三元運算子 + 模板字串 |
| `9.js` | `substring()` 字串截斷與摘要 |
| `10.js` | `checkAdmin` 權限檢查回呼 |
