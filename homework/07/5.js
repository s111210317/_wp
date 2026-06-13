function fetchData(id, callback) {
  const result = { id: id, status: "success" };
  callback(null, result);
}

fetchData(5, (err, data) => {
  console.log(data);
});
