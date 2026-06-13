function mathTool(num1, num2, action) {
  return action(num1, num2);
}

console.log(mathTool(10, 5, function (a, b) { return a + b; }));
console.log(mathTool(10, 5, function (a, b) { return a - b; }));
