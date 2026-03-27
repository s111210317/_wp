const stockJson = '{"apple": 10, "banana": 5}';
const orderQueue = [
  {item: "apple", qty: 2}, 
  {item: "banana", qty: 6}, 
  {item: "apple", qty: 1}
];

console.log("練習 10 測試結果：");
const finalInventory = processOrders(stockJson, orderQueue);
console.log("最終庫存狀態：", finalInventory);
