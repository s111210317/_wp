const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'blog-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

app.get('/', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, posts) => {
    if (err) return res.status(500).send('Error loading posts');
    const user = req.session.user;
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>我的網誌</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .nav a { margin-left: 15px; }
    .post { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
    .post h2 { margin-top: 0; }
    .post .date { color: #888; font-size: 0.9em; }
    .form { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 30px; }
    input, textarea { width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; }
    button { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; }
    a { text-decoration: none; color: #007bff; }
    .error { color: red; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>我的網誌</h1>
    <div class="nav">
`;
    if (user) {
      html += `<span>歡迎, ${escapeHtml(user.username)}</span>`;
      html += `<a href="/logout">登出</a>`;
    } else {
      html += `<a href="/login">登入</a>`;
      html += `<a href="/register">註冊</a>`;
    }
    html += `
    </div>
  </div>
`;
    if (user) {
      html += `
  <div class="form">
    <h3>發表新文章</h3>
    <form method="POST" action="/posts">
      <input type="text" name="title" placeholder="標題" required>
      <textarea name="content" rows="5" placeholder="內容" required></textarea>
      <button type="submit">發布</button>
    </form>
  </div>
`;
    }
    html += `  <h2>文章列表</h2>`;
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
    const user = req.session.user;
    let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(post.title)}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .nav a { margin-left: 15px; }
    .date { color: #888; font-size: 0.9em; }
    .content { line-height: 1.6; white-space: pre-wrap; }
    a { text-decoration: none; color: #007bff; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(post.title)}</h1>
    <div class="nav">
`;
    if (user) {
      html += `<span>歡迎, ${escapeHtml(user.username)}</span>`;
      html += `<a href="/logout">登出</a>`;
    } else {
      html += `<a href="/login">登入</a>`;
      html += `<a href="/register">註冊</a>`;
    }
    html += `
    </div>
  </div>
  <p class="date">${new Date(post.created_at).toLocaleString('zh-TW')}</p>
  <div class="content">${escapeHtml(post.content)}</div>
  <p><a href="/">← 返回列表</a></p>
</body>
</html>`;
    res.send(html);
  });
});

app.get('/register', (req, res) => {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>註冊</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
    input { width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; }
    button { background: #28a745; color: white; border: none; padding: 10px 20px; cursor: pointer; width: 100%; }
    a { display: block; text-align: center; margin-top: 15px; color: #007bff; }
    .error { color: red; margin-bottom: 10px; }
  </style>
</head>
<body>
  <h2>註冊新帳號</h2>
  <form method="POST" action="/register">
    <input type="text" name="username" placeholder="帳號" required>
    <input type="password" name="password" placeholder="密碼" required>
    <button type="submit">註冊</button>
  </form>
  <a href="/login">已有帳號？登入</a>
</body>
</html>`;
  res.send(html);
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error hashing password');
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.send(`
            <script>alert('帳號已存在'); window.location.href='/register';</script>
          `);
        }
        return res.status(500).send('Error creating user');
      }
      res.redirect('/login');
    });
  });
});

app.get('/login', (req, res) => {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>登入</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
    input { width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; }
    button { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; width: 100%; }
    a { display: block; text-align: center; margin-top: 15px; color: #007bff; }
    .error { color: red; margin-bottom: 10px; }
  </style>
</head>
<body>
  <h2>登入</h2>
  <form method="POST" action="/login">
    <input type="text" name="username" placeholder="帳號" required>
    <input type="password" name="password" placeholder="密碼" required>
    <button type="submit">登入</button>
  </form>
  <a href="/register">沒有帳號？註冊</a>
</body>
</html>`;
  res.send(html);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.send(`
        <script>alert('帳號或密碼錯誤'); window.location.href='/login';</script>
      `);
    }
    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) {
        return res.send(`
          <script>alert('帳號或密碼錯誤'); window.location.href='/login';</script>
        `);
      }
      req.session.user = { id: user.id, username: user.username };
      res.redirect('/');
    });
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.post('/posts', requireAuth, (req, res) => {
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
