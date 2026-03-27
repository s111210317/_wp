const express = require('express');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, posts) => {
    if (err) return res.status(500).send('Error loading posts');
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>我的網誌</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .post { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
    .post h2 { margin-top: 0; }
    .post .date { color: #888; font-size: 0.9em; }
    .form { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 30px; }
    input, textarea { width: 100%; margin-bottom: 10px; padding: 8px; }
    button { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; }
    a { text-decoration: none; color: #007bff; }
  </style>
</head>
<body>
  <h1>我的網誌</h1>
  
  <div class="form">
    <h3>發表新文章</h3>
    <form method="POST" action="/posts">
      <input type="text" name="title" placeholder="標題" required>
      <textarea name="content" rows="5" placeholder="內容" required></textarea>
      <button type="submit">發布</button>
    </form>
  </div>
  
  <h2>文章列表</h2>
`;
    if (posts.length === 0) {
      html += '<p>尚無文章</p>';
    } else {
      posts.forEach(post => {
        html += `
  <div class="post">
    <h2><a href="/post/${post.id}">${escapeHtml(post.title)}</a></h2>
    <p class="date">${new Date(post.created_at).toLocaleString('zh-TW')}</p>
    <p>${escapeHtml(post.content.substring(0, 100))}${post.content.length > 100 ? '...' : ''}</p>
    <a href="/post/${post.id}">閱讀更多</a>
  </div>
`;
      });
    }
    html += `
</body>
</html>`;
    res.send(html);
  });
});

app.get('/post/:id', (req, res) => {
  db.get('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, post) => {
    if (err || !post) return res.status(404).send('文章不存在');
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(post.title)}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .date { color: #888; font-size: 0.9em; }
    .content { line-height: 1.6; white-space: pre-wrap; }
    a { text-decoration: none; color: #007bff; }
  </style>
</head>
<body>
  <h1>${escapeHtml(post.title)}</h1>
  <p class="date">${new Date(post.created_at).toLocaleString('zh-TW')}</p>
  <div class="content">${escapeHtml(post.content)}</div>
  <p><a href="/">← 返回列表</a></p>
</body>
</html>`;
    res.send(html);
  });
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err) => {
    if (err) return res.status(500).send('Error saving post');
    res.redirect('/');
  });
});

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.listen(PORT, () => {
  console.log(`網誌系統已啟動: http://localhost:${PORT}`);
});
