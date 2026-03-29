## 習題4

AI問答 -- https://gemini.google.com/share/e80eb290b351

## 摘要
養成寫完程式後立刻進行測試的習慣，是非常棒的工程師思維！

以下為你整理出這 10 個函式的測試執行程式碼，以及它們在 Console 中實際印出的結果。為了保持畫面簡潔，我會省略上方定義函式的部分（你可以直接沿用上一次的函式碼），只寫出**測試用的資料與呼叫方式**，接著附上**實際的執行結果**。

---

### 練習 1：陣列總和計算機

**測試程式碼：**
```javascript
const numbers = [1, 2, 3, 4, 5];
console.log("練習 1 測試結果：", sumArray(numbers));
```

**執行結果：**
```text
練習 1 測試結果： 15
```

---

### 練習 2：成年資格審查

**測試程式碼：**
```javascript
const userA = { name: "Alice", age: 20 };
const userB = { name: "Bob", age: 16 };

console.log("練習 2 測試結果 (Alice)：", checkAdult(userA));
console.log("練習 2 測試結果 (Bob)：", checkAdult(userB));
```

**執行結果：**
```text
練習 2 測試結果 (Alice)： Alice 已成年
練習 2 測試結果 (Bob)： Bob 未成年
```

---

### 練習 3：尋找第一個合格數字

**測試程式碼：**
```javascript
const data1 = [10, 25, 47, 60, 12, 80];
const data2 = [10, 20, 30];

console.log("練習 3 測試結果 (有合格者)：", findFirstLargeNumber(data1));
console.log("練習 3 測試結果 (無合格者)：", findFirstLargeNumber(data2));
```

**執行結果：**
```text
練習 3 測試結果 (有合格者)： 60
練習 3 測試結果 (無合格者)： null
```

---

### 練習 4：篩選特定價格區間的商品

**測試程式碼：**
```javascript
const items = [
  {name: "筆", price: 20}, 
  {name: "書", price: 300}, 
  {name: "橡皮擦", price: 10}
];

console.log("練習 4 測試結果：");
console.log(filterByBudget(items, 50));
```

**執行結果：**
```text
練習 4 測試結果：
[ { name: '筆', price: 20 }, { name: '橡皮擦', price: 10 } ]
```

---

### 練習 5：JSON 解析與資料擴充

**測試程式碼：**
```javascript
const jsonInput = '{"name": "Bob", "grade": 8}';

console.log("練習 5 測試結果：");
console.log(processStudentData(jsonInput));
```

**執行結果：**
```text
練習 5 測試結果：
{ name: 'Bob', grade: 8, isStudent: true }
```

---

### 練習 6：狀態產生器

**測試程式碼：**
```javascript
console.log("練習 6 測試結果：");
console.log(countdown(2));
```

**執行結果：**
```text
練習 6 測試結果：
[
  { step: 2, status: '倒數中' },
  { step: 1, status: '倒數中' },
  { step: 0, status: '完成' }
]
```

---

### 練習 7：統計物件內的特定型別

**測試程式碼：**
```javascript
const profile = { 
  name: "Tom", 
  age: 30, 
  city: "Taipei", 
  isMarried: false,
  job: "Engineer"
};

console.log("練習 7 測試結果：", countStrings(profile));
```

**執行結果：**
```text
練習 7 測試結果： 3
```
*(備註：屬性值為字串的有 `name`, `city`, `job` 共 3 個)*

---

### 練習 8：活躍用戶的 JSON 報告

**測試程式碼：**
```javascript
const userList = [
  {id: 1, isActive: true}, 
  {id: 2, isActive: false},
  {id: 3, isActive: true}
];

console.log("練習 8 測試結果：");
console.log(getActiveUsers(userList));
```

**執行結果：**
```text
練習 8 測試結果：
[{"id":1,"isActive":true},{"id":3,"isActive":true}]
```

---

### 練習 9：陣列物件數值加總與條件判斷

**測試程式碼：**
```javascript
const scores = [
  {name: "A", score: 80}, 
  {name: "B", score: 55}, 
  {name: "C", score: 90}
];

console.log("練習 9 測試結果：", sumPassingScores(scores));
```

**執行結果：**
```text
練習 9 測試結果： 170
```

---

### 練習 10：綜合大挑戰：簡易訂單消化系統

**測試程式碼：**
```javascript
const stockJson = '{"apple": 10, "banana": 5}';
const orderQueue = [
  {item: "apple", qty: 2}, 
  {item: "banana", qty: 6}, 
  {item: "apple", qty: 1}
];

console.log("練習 10 測試結果：");
const finalInventory = processOrders(stockJson, orderQueue);
console.log("最終庫存狀態：", finalInventory);
```

**執行結果：**
```text
練習 10 測試結果：
警告：banana 庫存不足，無法出貨！
最終庫存狀態： { apple: 7, banana: 5 }
```

---

確認過這些執行結果後，你想試著自己更改一些測試用的輸入資料，看看輸出結果會有什麼變化嗎？或者，你想了解如何使用 JavaScript 的箭頭函式（Arrow Function）來簡化這些程式碼呢？
