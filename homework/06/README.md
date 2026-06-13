# JavaScript 練習 1 ~ 10 解說

本目錄包含十個 JavaScript 練習檔案，循序漸進地介紹函數式編程與陣列操作的核心概念。

---

### 1.js — 高階函數（Higher-Order Function）

將函數當作參數傳入，實現加／減法運算。

```js
mathTool(10, 5, function (a, b) { return a + b; }); // 15
mathTool(10, 5, function (a, b) { return a - b; }); //  5
```

### 2.js — IIFE（立即執行函數）

定義後立刻執行的匿名函數，變數 `count` 被封存在函數作用域內，不污染全局。

```js
(function () {
  var count = 100;
  console.log("Count is: " + count); // 100
})();
```

### 3.js — Array.map()

將每個陣列元素乘以 0.8，產生新陣列。

```js
[100, 200, 300, 400]  →  [80, 160, 240, 320]
```

### 4.js — 函數修改外部陣列（Side Effect）

`pop()` 移除最後一項，`unshift()` 在最前方插入 `"Start"`，直接改動原始陣列。

```js
[1, 2, 3]  →  ["Start", 1, 2]
```

### 5.js — 閉包（Closure）

`multiplier(2)` 回傳一個記住了 `factor=2` 的函數，之後呼叫 `double(10)` 得到 `20`。

```js
const double = multiplier(2);
double(10); // 20
```

### 6.js — 自製 Array.filter()

手動實作 `filter`：遍歷陣列，傳入回呼函數決定是否保留該元素。

```js
myFilter([1, 5, 8, 12], item => item > 7); // [8, 12]
```

### 7.js — Array.filter() + 物件

篩選年齡 >= 18 的使用者。

```js
[{ name: "Alice", age: 25 }, { name: "Bob", age: 17 }]
→ [{ name: "Alice", age: 25 }]
```

### 8.js — 傳參考（Pass by Reference）

陣列以參考方式傳入函數，`push(99)` 會修改原陣列；但重新賦值 `b = [100]` 只讓區域變數指向新物件，不影響原陣列。

```
listA: [1, 2, 99]
listB: [3, 4]
```

### 9.js — setTimeout 非同步

2 秒後才執行箭頭函數，輸出 `"Task Completed"`。

```js
setTimeout(() => { console.log("Task Completed"); }, 2000);
```

### 10.js — reduce + 高階函數整合

用 `reduce` 加總購物車金額，再傳入折扣函數減去 50。

```js
calculateTotal([100, 200, 300], total => total - 50); // 550
```

---

## 學習路線建議

| 編號 | 主題 | 關鍵字 |
|------|------|--------|
| 1 | 高階函數（傳入回呼） | callback, higher-order function |
| 2 | IIFE 作用域 | 立即函數, 封閉作用域 |
| 3 | Array.map() | 映射轉換, 純函數 |
| 4 | 函數副作用 | pop, unshift, side effect |
| 5 | 閉包 | closure, 函數工廠 |
| 6 | 自訂 filter | 手動實作, 回呼 |
| 7 | 物件陣列過濾 | 實際應用 |
| 8 | 傳參考 vs 傳值 | mutable, immutable |
| 9 | 非同步 | 非同步, 事件循環 |
| 10 | 整合應用 | reduce, callback |
```
