// 8.js

// 1. 宣告變數 user
let user = "Guest";

// 2. 使用反引號 () 建立 HTML 字串，開頭和結尾都要有反引號喔！
const htmlString = `<h1>Welcome, ${user ? user : "Stranger"} </h1>`;

// 3. 印出這個字串
console.log (htmlString)