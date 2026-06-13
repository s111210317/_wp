function myFilter(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    if (callback(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}

const filtered = myFilter([1, 5, 8, 12], function (item) {
  return item > 7;
});
console.log(filtered);
