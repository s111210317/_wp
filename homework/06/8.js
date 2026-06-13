let listA = [1, 2];
let listB = [3, 4];

function process(a, b) {
  a.push(99);
  b = [100];
}
process(listA, listB);
console.log('listA:', listA); 
console.log('listB:', listB);

//【 函數執行前 】
//listA ───> [ 1, 2 ] (記憶體 A)
//listB ───> [ 3, 4 ] (記憶體 B)

//【 呼叫 process(listA, listB) 傳入地址 】
//listA ───> [ 1, 2 ] (記憶體 A) <─── a (區域變數)
//listB ───> [ 3, 4 ] (記憶體 B) <─── b (區域變數)

//【 執行 a.push(99) 】
//listA ───> [ 1, 2, 99 ] (記憶體 A) <─── a (區域變數修改了這裡)

//【 執行 b = [100] 】
//listA ───> [ 1, 2, 99 ] (記憶體 A)
//listB ───> [ 3, 4 ]     (記憶體 B) (完全沒被動到！)
//                             b ───> [ 100 ] (區域變數轉向新記憶體 C)