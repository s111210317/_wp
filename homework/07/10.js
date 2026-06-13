function checkAdmin(role, callback) {
  if (role !== "admin") {
    callback("Access Denied");
  } else {
    callback(null, "Welcome");
  }
}

checkAdmin("user", (err, msg) => {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Success:", msg);
  }
});

checkAdmin("admin", (err, msg) => {
  if (err) {
    console.log("Error:", err);
  } else {
    console.log("Success:", msg);
  }
});
