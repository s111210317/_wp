const posts = [{ id: 1, t: "A" }, { id: 2, t: "B" }];
let html = "";

posts.forEach(p => {
  html += `<div>${p.t}</div>`;
});

console.log(html);
