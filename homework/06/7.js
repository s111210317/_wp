const users = [{ name: "Alice", age: 25 }, { name: "Bob", age: 17 }];
const adults = users.filter(u => u.age >= 18);
console.log(adults);
