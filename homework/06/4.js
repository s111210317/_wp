// 4.js

function cleanData(arr) {
  // 1. 移除傳進來陣列的最後一個元素
  arr.pop();

  // 2. 在最前面加上 "Start"
  arr.unshift("Start"); 
}

// 驗證
let myData = [1,2,3];

// 執行函數（注意：這題函數不需要 return 任何東西）
cleanData(myData); 

// 觀察 myData 的內容是否被改變了
console.log(myData); 
// 預期輸出：[ 'Start', 1, 2 ]
