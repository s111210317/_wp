const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3004;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function parseTags(content) {
  const tagRegex = /#(\w+)/g;
  const tags = [];
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    tags.push(match[1]);
  }
  return tags;
}

function formatContent(content) {
  return escapeHtml(content).replace(/#(\w+)/g, '<a href="/tag/$1" style="color: #0095f6;">#$1</a>');
}

function getInitials(username) {
  return username ? username.charAt(0).toUpperCase() : '?';
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return '剛剛';
  if (diff < 3600) return Math.floor(diff / 60) + '分鐘前';
  if (diff < 86400) return Math.floor(diff / 3600) + '小時前';
  return date.toLocaleDateString('zh-TW');
}

function getAvatarColor(username) {
  const colors = ['linear-gradient(135deg, #667eea, #764ba2)', 'linear-gradient(135deg, #f093fb, #f5576c)', 'linear-gradient(135deg, #4facfe, #00f2fe)', 'linear-gradient(135deg, #43e97b, #38f9d7)', 'linear-gradient(135deg, #fa709a, #fee140)', 'linear-gradient(135deg, #a8edea, #fed6e3)', 'linear-gradient(135deg, #ff9a9e, #fecfef)', 'linear-gradient(135deg, #ffecd2, #fcb69f)'];
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash = username.charCodeAt(i) + ((hash << 5) - hash);
  return `background: ${colors[Math.abs(hash) % colors.length]};`;
}

const styles = `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #000; color: #fff; min-height: 100vh; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { position: sticky; top: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); padding: 15px 0; border-bottom: 1px solid #333; margin: -20px -20px 20px -20px; padding-left: 20px; padding-right: 20px; }
  .header h1 { font-size: 24px; font-weight: 700; }
  .nav-row { display: flex; justify-content: space-between; align-items: center; }
  .nav-links { display: flex; gap: 24px; }
  .nav-links a { color: #888; text-decoration: none; font-weight: 500; padding: 8px 0; border-bottom: 2px solid transparent; }
  .nav-links a:hover, .nav-links a.active { color: #fff; border-bottom-color: #fff; }
  .nav-right { display: flex; gap: 12px; align-items: center; }
  .btn { padding: 8px 16px; border-radius: 20px; font-weight: 600; cursor: pointer; text-decoration: none; font-size: 14px; border: none; }
  .btn-primary { background: #fff; color: #000; }
  .btn-outline { border: 1px solid #333; color: #fff; background: transparent; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .post-form { background: #111; border-radius: 16px; padding: 16px; margin-bottom: 20px; border: 1px solid #333; }
  .post-form textarea { width: 100%; background: transparent; border: none; color: #fff; font-size: 18px; resize: none; outline: none; min-height: 80px; font-family: inherit; }
  .post-form textarea::placeholder { color: #666; }
  .post-form-footer { display: flex; justify-content: flex-end; margin-top: 12px; }
  .post-card { background: #111; border-radius: 16px; padding: 16px; margin-bottom: 12px; border: 1px solid #222; }
  .post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .post-header-click { cursor: pointer; flex: 1; display: flex; align-items: center; gap: 12px; }
  .avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px; flex-shrink: 0; }
  .user-info h3 { font-size: 15px; font-weight: 600; }
  .user-info span { color: #666; font-size: 13px; }
  .post-content { font-size: 16px; line-height: 1.5; margin-bottom: 12px; white-space: pre-wrap; }
  .post-content a { color: #0095f6; text-decoration: none; }
  .post-tags { margin-bottom: 12px; }
  .post-tags a { color: #0095f6; margin-right: 8px; font-size: 14px; }
  .post-actions { display: flex; gap: 24px; border-top: 1px solid #222; padding-top: 12px; }
  .action-btn { background: none; border: none; color: #666; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 14px; }
  .action-btn:hover { color: #fff; }
  .action-btn.liked { color: #e0245e; }
  .empty { text-align: center; padding: 40px; color: #666; }
  .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); align-items: center; justify-content: center; }
  .modal.show { display: flex; }
  .modal-content { background: #111; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; border: 1px solid #333; }
  .modal-content h3 { margin-bottom: 16px; }
  .modal-content textarea { width: 100%; background: #000; border: 1px solid #333; color: #fff; font-size: 16px; padding: 12px; border-radius: 8px; min-height: 120px; resize: none; font-family: inherit; }
  .modal-content .btn-group { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
  .back-link { display: inline-block; margin-bottom: 20px; color: #888; text-decoration: none; }
  .back-link:hover { color: #fff; }
  .tag-header { text-align: center; margin-bottom: 20px; }
  .tag-header h2 { font-size: 22px; }
  .tag-header p { color: #666; margin-top: 8px; }
</style>
`;

function renderNav(user, activePage) {
  return `
<div class="header">
  <div class="nav-row">
    <div class="nav-links">
      <a href="/for-you" class="${activePage === 'for-you' ? 'active' : ''}">大家</a>
      <a href="/my-posts" class="${activePage === 'my-posts' ? 'active' : ''}">我的</a>
    </div>
    <div class="nav-right">
      ${user ? `<span style="color: #666; font-size: 14px;">@${escapeHtml(user.username)}</span><a href="/logout" class="btn btn-outline">登出</a>` : `<a href="/login" class="btn btn-outline">登入</a><a href="/register" class="btn btn-primary">註冊</a>`}
    </div>
  </div>
</div>`;
}

function renderPostForm(user) {
  if (!user) return '';
  return `
<div class="post-form">
  <textarea id="postContent" placeholder="有什麼新鮮事？可用 #標籤" maxlength="500"></textarea>
  <div class="post-form-footer">
    <button onclick="submitPost()" class="btn btn-primary">發布</button>
  </div>
</div>
<script>
  async function submitPost() {
    const content = document.getElementById('postContent').value.trim();
    if (!content) return;
    const res = await fetch('/api/posts', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ content }) });
    if (res.ok) { document.getElementById('postContent').value = ''; location.reload(); }
    else { const data = await res.json(); alert(data.error || '發布失敗'); }
  }
</script>`;
}

function renderPostCard(post, currentUser, isLiked, likeCount, tags = []) {
  const isOwn = currentUser && currentUser.id === post.user_id;
  const tagHtml = tags.length > 0 ? `<div class="post-tags">${tags.map(t => `<a href="/tag/${t}">#${escapeHtml(t)}</a>`).join('')}</div>` : '';
  return `
<div class="post-card" id="post-${post.id}">
  <div class="post-header">
    <div class="post-header-click" onclick="window.location.href='/user/${post.username}'">
      <div class="avatar" style="${getAvatarColor(post.username)}">${getInitials(post.username)}</div>
      <div class="user-info">
        <h3>@${escapeHtml(post.username)}</h3>
        <span>${formatTime(post.created_at)}</span>
      </div>
    </div>
    ${isOwn ? `<button class="action-btn" onclick="showEditModal(${post.id}, '${escapeHtml(post.content).replace(/'/g, "\\'")}')" style="margin-left: auto;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    </button>` : ''}
  </div>
  <div class="post-content">${formatContent(post.content)}</div>
  ${tagHtml}
  <div class="post-actions">
    <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${post.id}, this)">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="${isLiked ? '#e0245e' : 'none'}" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      <span>${likeCount}</span>
    </button>
    ${isOwn ? `<button class="action-btn" onclick="deletePost(${post.id})" style="margin-left: auto; color: #e0245e;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>` : ''}
  </div>
</div>`;
}

function renderEditModal() {
  return `
<div class="modal" id="editModal">
  <div class="modal-content">
    <h3>編輯貼文</h3>
    <textarea id="editContent"></textarea>
    <div class="btn-group">
      <button class="btn btn-outline" onclick="closeEditModal()">取消</button>
      <button class="btn btn-primary" onclick="saveEdit()">儲存</button>
    </div>
  </div>
</div>
<script>
  let editingPostId = null;
  function showEditModal(id, content) {
    editingPostId = id;
    document.getElementById('editContent').value = content.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    document.getElementById('editModal').classList.add('show');
  }
  function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    editingPostId = null;
  }
  async function saveEdit() {
    const content = document.getElementById('editContent').value.trim();
    if (!content) return;
    const res = await fetch('/api/posts/' + editingPostId, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ content }) });
    if (res.ok) location.reload();
    else { const data = await res.json(); alert(data.error || '儲存失敗'); }
  }
</script>`;
}

app.get('/', (req, res) => res.redirect('/for-you'));

app.get('/for-you', (req, res) => {
  const user = req.session.user;
  const query = `SELECT posts.*, users.username, (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC LIMIT 50`;
  
  if (user) {
    db.all('SELECT post_id FROM likes WHERE user_id = ?', [user.id], (err, likes) => {
      const likeStatus = {}; likes.forEach(l => likeStatus[l.post_id] = true);
      renderFeed(query, likeStatus, user, res, 'for-you');
    });
  } else {
    renderFeed(query, {}, user, res, 'for-you');
  }
});

app.get('/my-posts', (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');
  
  const query = `SELECT posts.*, users.username, (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count FROM posts JOIN users ON posts.user_id = users.id WHERE posts.user_id = ? ORDER BY posts.created_at DESC LIMIT 50`;
  
  db.all('SELECT post_id FROM likes WHERE user_id = ?', [user.id], (err, likes) => {
    const likeStatus = {}; likes.forEach(l => likeStatus[l.post_id] = true);
    renderFeed(query, likeStatus, user, res, 'my-posts', [user.id]);
  });
});

app.get('/user/:username', (req, res) => {
  const user = req.session.user;
  const username = req.params.username;
  
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, targetUser) => {
    if (!targetUser) return res.status(404).send('用戶不存在');
    
    const query = `SELECT posts.*, users.username, (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count FROM posts JOIN users ON posts.user_id = users.id WHERE posts.user_id = ? ORDER BY posts.created_at DESC LIMIT 50`;
    
    if (user) {
      db.all('SELECT post_id FROM likes WHERE user_id = ?', [user.id], (err, likes) => {
        const likeStatus = {}; likes.forEach(l => likeStatus[l.post_id] = true);
        renderUserPage(targetUser, query, likeStatus, user, res);
      });
    } else {
      renderUserPage(targetUser, query, {}, user, res);
    }
  });
});

app.get('/tag/:tag', (req, res) => {
  const user = req.session.user;
  const tag = req.params.tag;
  
  const query = `SELECT posts.*, users.username, (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) as like_count 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    JOIN post_tags ON posts.id = post_tags.post_id
    JOIN tags ON post_tags.tag_id = tags.id
    WHERE tags.name = ?
    ORDER BY posts.created_at DESC LIMIT 50`;
  
  if (user) {
    db.all('SELECT post_id FROM likes WHERE user_id = ?', [user.id], (err, likes) => {
      const likeStatus = {}; likes.forEach(l => likeStatus[l.post_id] = true);
      renderTagPage(tag, query, likeStatus, user, res);
    });
  } else {
    renderTagPage(tag, query, {}, user, res);
  }
});

function renderFeed(query, likeStatus, user, res, page, params = []) {
  db.all(query, params, (err, posts) => {
    if (err) { console.error(err); posts = []; }
    
    if (posts.length > 0) {
      const postIds = posts.map(p => p.id);
      db.all(`SELECT post_tags.post_id, tags.name FROM post_tags JOIN tags ON post_tags.tag_id = tags.id WHERE post_tags.post_id IN (${postIds.join(',')})`, [], (err, postTags) => {
        const tagMap = {};
        postTags.forEach(pt => { if (!tagMap[pt.post_id]) tagMap[pt.post_id] = []; tagMap[pt.post_id].push(pt.name); });
        
        let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Threads - ${page === 'for-you' ? '大家' : '我的'}</title>${styles}</head><body><div class="container">${renderNav(user, page)}${renderPostForm(user)}`;
        
        if (posts.length === 0) {
          html += '<div class="empty">還沒有任何貼文</div>';
        } else {
          posts.forEach(post => html += renderPostCard(post, user, !!likeStatus[post.id], post.like_count || 0, tagMap[post.id] || []));
        }
        
        html += renderEditModal() + `</div><script>
          async function toggleLike(postId, btn) {
            const res = await fetch('/api/like/' + postId, { method: 'POST' });
            const data = await res.json();
            btn.classList.toggle('liked', data.liked);
            btn.querySelector('svg').setAttribute('fill', data.liked ? '#e0245e' : 'none');
            btn.querySelector('span').textContent = data.count;
          }
          async function deletePost(postId) {
            if (!confirm('確定要刪除這篇貼文嗎？')) return;
            await fetch('/api/posts/' + postId, { method: 'DELETE' });
            document.getElementById('post-' + postId).remove();
          }
        </script></body></html>`;
        res.send(html);
      });
    } else {
      let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Threads - ${page === 'for-you' ? '大家' : '我的'}</title>${styles}</head><body><div class="container">${renderNav(user, page)}${renderPostForm(user)}<div class="empty">還沒有任何貼文</div></div>${renderEditModal()}</body></html>`;
      res.send(html);
    }
  });
}

function renderUserPage(targetUser, query, likeStatus, currentUser, res) {
  db.all(query, [targetUser.id], (err, posts) => {
    if (err) { console.error(err); posts = []; }
    
    if (posts.length > 0) {
      const postIds = posts.map(p => p.id);
      db.all(`SELECT post_tags.post_id, tags.name FROM post_tags JOIN tags ON post_tags.tag_id = tags.id WHERE post_tags.post_id IN (${postIds.join(',')})`, [], (err, postTags) => {
        const tagMap = {};
        postTags.forEach(pt => { if (!tagMap[pt.post_id]) tagMap[pt.post_id] = []; tagMap[pt.post_id].push(pt.name); });
        
        let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>@${escapeHtml(targetUser.username)}</title>${styles}</head><body><div class="container">${renderNav(currentUser, '')}<a href="javascript:history.back()" class="back-link">← 返回</a><div class="profile-header"><div class="avatar" style="width:80px;height:80px;font-size:32px;${getAvatarColor(targetUser.username)}">${getInitials(targetUser.username)}</div><h2 style="font-size:22px;margin:16px 0 8px;">@${escapeHtml(targetUser.username)}</h2><p style="color:#666;">${posts.length} 篇貼文</p></div>`;
        
        if (posts.length === 0) {
          html += '<div class="empty">還沒有任何貼文</div>';
        } else {
          posts.forEach(post => html += renderPostCard(post, currentUser, !!likeStatus[post.id], post.like_count || 0, tagMap[post.id] || []));
        }
        
        html += renderEditModal() + `</div><script>
          async function toggleLike(postId, btn) {
            const res = await fetch('/api/like/' + postId, { method: 'POST' });
            const data = await res.json();
            btn.classList.toggle('liked', data.liked);
            btn.querySelector('svg').setAttribute('fill', data.liked ? '#e0245e' : 'none');
            btn.querySelector('span').textContent = data.count;
          }
          async function deletePost(postId) {
            if (!confirm('確定要刪除這篇貼文嗎？')) return;
            await fetch('/api/posts/' + postId, { method: 'DELETE' });
            document.getElementById('post-' + postId).remove();
          }
        </script></body></html>`;
        res.send(html);
      });
    } else {
      let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>@${escapeHtml(targetUser.username)}</title>${styles}</head><body><div class="container">${renderNav(currentUser, '')}<a href="javascript:history.back()" class="back-link">← 返回</a><div class="profile-header"><div class="avatar" style="width:80px;height:80px;font-size:32px;${getAvatarColor(targetUser.username)}">${getInitials(targetUser.username)}</div><h2 style="font-size:22px;margin:16px 0 8px;">@${escapeHtml(targetUser.username)}</h2><p style="color:#666;">0 篇貼文</p></div><div class="empty">還沒有任何貼文</div></div>${renderEditModal()}</body></html>`;
      res.send(html);
    }
  });
}

function renderTagPage(tag, query, likeStatus, user, res) {
  db.all(query, [tag], (err, posts) => {
    if (err) { console.error(err); posts = []; }
    
    if (posts.length > 0) {
      const postIds = posts.map(p => p.id);
      db.all(`SELECT post_tags.post_id, tags.name FROM post_tags JOIN tags ON post_tags.tag_id = tags.id WHERE post_tags.post_id IN (${postIds.join(',')})`, [], (err, postTags) => {
        const tagMap = {};
        postTags.forEach(pt => { if (!tagMap[pt.post_id]) tagMap[pt.post_id] = []; tagMap[pt.post_id].push(pt.name); });
        
        let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>#${escapeHtml(tag)}</title>${styles}</head><body><div class="container">${renderNav(user, '')}<a href="javascript:history.back()" class="back-link">← 返回</a><div class="tag-header"><h2>#${escapeHtml(tag)}</h2><p>${posts.length} 篇貼文</p></div>`;
        
        if (posts.length === 0) {
          html += '<div class="empty">沒有相關貼文</div>';
        } else {
          posts.forEach(post => html += renderPostCard(post, user, !!likeStatus[post.id], post.like_count || 0, tagMap[post.id] || []));
        }
        
        html += renderEditModal() + `</div><script>
          async function toggleLike(postId, btn) {
            const res = await fetch('/api/like/' + postId, { method: 'POST' });
            const data = await res.json();
            btn.classList.toggle('liked', data.liked);
            btn.querySelector('svg').setAttribute('fill', data.liked ? '#e0245e' : 'none');
            btn.querySelector('span').textContent = data.count;
          }
          async function deletePost(postId) {
            if (!confirm('確定要刪除這篇貼文嗎？')) return;
            await fetch('/api/posts/' + postId, { method: 'DELETE' });
            document.getElementById('post-' + postId).remove();
          }
        </script></body></html>`;
        res.send(html);
      });
    } else {
      let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>#${escapeHtml(tag)}</title>${styles}</head><body><div class="container">${renderNav(user, '')}<a href="javascript:history.back()" class="back-link">← 返回</a><div class="tag-header"><h2>#${escapeHtml(tag)}</h2><p>0 篇貼文</p></div><div class="empty">沒有相關貼文</div></div>${renderEditModal()}</body></html>`;
      res.send(html);
    }
  });
}

app.post('/api/posts', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '請先登入' });
  const { content } = req.body;
  if (!content || content.trim().length === 0) return res.status(400).json({ error: '內容不能為空' });
  
  const userId = req.session.user.id;
  const trimmedContent = content.trim();
  
  db.run('INSERT INTO posts (user_id, content) VALUES (?, ?)', [userId, trimmedContent], function(err) {
    if (err) return res.status(500).json({ error: '發布失敗' });
    
    const postId = this.lastID;
    const tags = parseTags(trimmedContent);
    
    if (tags.length > 0) {
      tags.forEach(tagName => {
        db.get('SELECT id FROM tags WHERE name = ?', [tagName], (err, tag) => {
          if (!tag) {
            db.run('INSERT INTO tags (name) VALUES (?)', [tagName], function(err) {
              if (!err) {
                db.run('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, this.lastID]);
              }
            });
          } else {
            db.run('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tag.id]);
          }
        });
      });
    }
    
    res.json({ success: true });
  });
});

app.put('/api/posts/:id', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '請先登入' });
  const { content } = req.body;
  if (!content || content.trim().length === 0) return res.status(400).json({ error: '內容不能為空' });
  
  const postId = req.params.id;
  const userId = req.session.user.id;
  const trimmedContent = content.trim();
  
  db.run('UPDATE posts SET content = ? WHERE id = ? AND user_id = ?', [trimmedContent, postId, userId], function(err) {
    if (err) return res.status(500).json({ error: '儲存失敗' });
    if (this.changes === 0) return res.status(403).json({ error: '無法編輯此貼文' });
    
    db.run('DELETE FROM post_tags WHERE post_id = ?', [postId], () => {
      const tags = parseTags(trimmedContent);
      tags.forEach(tagName => {
        db.get('SELECT id FROM tags WHERE name = ?', [tagName], (err, tag) => {
          if (!tag) {
            db.run('INSERT INTO tags (name) VALUES (?)', [tagName], function(err) {
              if (!err) {
                db.run('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, this.lastID]);
              }
            });
          } else {
            db.run('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tag.id]);
          }
        });
      });
    });
    
    res.json({ success: true });
  });
});

app.delete('/api/posts/:id', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '請先登入' });
  db.run('DELETE FROM posts WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id], (err) => {
    if (err) return res.status(500).json({ error: '刪除失敗' });
    res.json({ success: true });
  });
});

app.post('/api/like/:postId', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: '請先登入' });
  const userId = req.session.user.id;
  const postId = req.params.postId;
  
  db.get('SELECT id FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId], (err, like) => {
    if (like) {
      db.run('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [userId, postId], () => {
        db.get('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId], (err, result) => {
          res.json({ liked: false, count: result.count });
        });
      });
    } else {
      db.run('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [userId, postId], () => {
        db.get('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [postId], (err, result) => {
          res.json({ liked: true, count: result.count });
        });
      });
    }
  });
});

app.get('/register', (req, res) => {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>註冊 - Threads</title>${styles}</head><body><div class="container">${renderNav(null, '')}<div class="post-form" style="max-width: 400px; margin: 40px auto;"><h2 style="margin-bottom: 20px;">建立帳號</h2><form method="POST" action="/register"><input type="text" name="username" placeholder="用戶名稱" required style="width: 100%; padding: 14px; margin-bottom: 12px; border-radius: 8px; border: 1px solid #333; background: #111; color: #fff;"><input type="password" name="password" placeholder="密碼" required style="width: 100%; padding: 14px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #333; background: #111; color: #fff;"><button type="submit" class="btn btn-primary" style="width: 100%;">註冊</button></form><p style="text-align: center; margin-top: 20px; color: #666;">已有帳號？<a href="/login" style="color: #fff;">登入</a></p></div></body></html>`;
  res.send(html);
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.redirect('/register');
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error');
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
      if (err) return res.send(`<script>alert('用戶名稱已被使用'); window.location='/register';</script>`);
      res.redirect('/login');
    });
  });
});

app.get('/login', (req, res) => {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>登入 - Threads</title>${styles}</head><body><div class="container">${renderNav(null, '')}<div class="post-form" style="max-width: 400px; margin: 40px auto;"><h2 style="margin-bottom: 20px;">登入</h2><form method="POST" action="/login"><input type="text" name="username" placeholder="用戶名稱" required style="width: 100%; padding: 14px; margin-bottom: 12px; border-radius: 8px; border: 1px solid #333; background: #111; color: #fff;"><input type="password" name="password" placeholder="密碼" required style="width: 100%; padding: 14px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #333; background: #111; color: #fff;"><button type="submit" class="btn btn-primary" style="width: 100%;">登入</button></form><p style="text-align: center; margin-top: 20px; color: #666;">沒有帳號？<a href="/register" style="color: #fff;">註冊</a></p></div></body></html>`;
  res.send(html);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) return res.send(`<script>alert('用戶不存在'); window.location='/login';</script>`);
    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) return res.send(`<script>alert('密碼錯誤'); window.location='/login';</script>`);
      req.session.user = { id: user.id, username: user.username };
      res.redirect('/for-you');
    });
  });
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/for-you'); });

app.listen(PORT, () => console.log(`Threads 風格網誌已啟動: http://localhost:${PORT}`));
