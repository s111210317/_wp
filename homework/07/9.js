const arr = ["Very long content here", "Another Very long content here", "3rd Very long content here"];

arr.forEach(s => {
  console.log(s.substring(0, 10) + "...");
});
