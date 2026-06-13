# 07 資料夾 — JavaScript 練習程式說明

## 1.js — 物件屬性存取

建立一個 `post` 物件（id、title、content），示範使用點記法 `post.title` 與括號記法 `post["title"]` 來讀取物件屬性。

```js
const post = {
  id: 1,
  title: "Hello World",
  content: "Markdown content"
};

console.log(post.title);
console.log(post["title"]);
```

## 2.js — 解構賦值

模擬 HTTP 請求物件 `req.body`，使用 ES6 解構賦值 `const { title, content } = req.body` 直接提取內部屬性，並分別印出。

```js
const req = { body: { title: "JS教學", content: "內容在此", author: "Gemini" } };

const { title, content } = req.body;

console.log(title);
console.log(content);
```

## 3.js — 陣列迭代與模板字串

遍歷文章陣列 `posts`，使用 `forEach` 迴圈逐筆取出資料，並以模板字串 `` `<div>${p.t}</div>` `` 串接成 HTML 字串後輸出。

```js
const posts = [{ id: 1, t: "A" }, { id: 2, t: "B" }];
let html = "";

posts.forEach(p => {
  html += `<div>${p.t}</div>`;
});

console.log(html);
```

## 4.js — 動態新增物件屬性

建立空物件 `params`，模擬 URL 查詢參數的蒐集過程；動態新增鍵 `id` 值為 `99`，最後印出物件內容。

```js
const params = {};

params.id = 99;

console.log(params);
```

## 5.js — 回呼函式（Callback）

定義 `fetchData` 函式，模擬非同步資料查詢：接收 id 與 callback，執行後呼叫 `callback(null, result)`。外層傳入箭頭函式處理結果。

```js
function fetchData(id, callback) {
  const result = { id: id, status: "success" };
  callback(null, result);
}

fetchData(5, (err, data) => {
  console.log(data);
});
```

## 6.js — JSON 解析

將 JSON 格式字串 `jsonStr` 透過 `JSON.parse()` 轉為 JavaScript 物件，並存取巢狀陣列元素 `obj.tags[1]`。

```js
const jsonStr = '{"title": "Post 1", "tags": ["js", "node"]}';
const obj = JSON.parse(jsonStr);

console.log(obj.tags[1]);
```

## 7.js — 模擬資料庫查詢

定義 `fakeGet(sql, params, callback)` 模擬資料庫查詢：無論傳入什麼 SQL，都直接回傳假資料 `{ title: "Fake Title" }`。外層呼叫時檢查 `err` 並輸出查詢結果。

```js
function fakeGet(sql, params, callback) {
  callback(null, { title: "Fake Title" });
}

const sqlQuery = "SELECT * FROM posts WHERE id = ?";
const urlParams = [99];

fakeGet(sqlQuery, urlParams, (err, row) => {
  if (err) {
    console.error("發生錯誤:", err);
    return;
  }

  console.log("查詢到的標題:", row.title);
});
```

## 8.js — 三元運算子與模板字串

宣告變數 `user` 為 `"Guest"`，使用模板字串搭配三元運算子 `${user ? user : "Stranger"}`，若 user 為 falsy 則顯示 `Stranger`。

```js
let user = "Guest";

const htmlString = `<h1>Welcome, ${user ? user : "Stranger"} </h1>`;

console.log(htmlString);
```

## 9.js — 字串截斷

定義長字串陣列 `arr`，使用 `forEach` 遍歷並透過 `substring(0, 10)` 截取前 10 個字元，補上 `...` 後輸出，模擬摘要顯示效果。

```js
const arr = ["Very long content here", "Another Very long content here", "3rd Very long content here"];

arr.forEach(s => {
  console.log(s.substring(0, 10) + "...");
});
```

## 10.js — 權限檢查

定義 `checkAdmin(role, callback)` 函式，若 role 不是 `"admin"` 則回傳錯誤訊息 `"Access Denied"`，否則回傳成功訊息 `"Welcome"`。分別以 `"user"` 和 `"admin"` 測試兩種情境。

```js
function checkAdmin(role, callback) {
  if (role !== "admin") {
    callback("Access Denied");
  } else {
    callback(null, "Welcome");
  }
}

checkAdmin("user", (err, msg) => {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Success:", msg);
  }
});

checkAdmin("admin", (err, msg) => {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Success:", msg);
  }
});
```
