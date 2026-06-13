// 7.js

// 1. 定義模擬資料庫查詢的函數 fakeGet
function fakeGet(sql, params, callback) {
  // 不管 SQL 傳什麼，直接觸發 callback
  // 第一個參數傳 null 代表「沒有錯誤」，第二個參數傳入查詢到的資料物件
  callback(null, { title: "Fake Title" });
}

// 2. 測試呼叫 fakeGet
const sqlQuery = "SELECT * FROM posts WHERE id = ?";
const urlParams = [99]; // 這裡的 99 可以連結你上一題做的 params.id

fakeGet(sqlQuery, urlParams, (err, row) => {
  // 習慣上會先檢查有沒有錯誤
  if (err) {
    console.error("發生錯誤:", err);
    return;
  }

  // 成功拿到資料，印出標題
  console.log("查詢到的標題:", row.title);
});
