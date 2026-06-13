const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'scores.json');

app.use(express.json());

// Serve static files
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

// Default route → game
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ensure data directory and file exist
function initData() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

function readScores() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch { return []; }
}

function writeScores(scores) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(scores, null, 2), 'utf-8');
}

// Submit a score
app.post('/api/score', (req, res) => {
  const { player, score, total, stageName } = req.body;
  if (!player || typeof score !== 'number' || typeof total !== 'number') {
    return res.status(400).json({ error: 'Missing fields' });
  }
  if (player.length > 20) return res.status(400).json({ error: 'Name too long' });

  const scores = readScores();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    player: player.trim().slice(0, 20),
    score,
    total,
    stageName: stageName || '未知關卡',
    pct: total > 0 ? Math.round((score / total) * 100) : 0,
    date: new Date().toISOString()
  };
  scores.push(entry);
  writeScores(scores);
  res.json({ ok: true, id: entry.id });
});

// Get rankings (top 100, sorted by pct desc, then score desc)
app.get('/api/rankings', (req, res) => {
  const scores = readScores();
  const stage = req.query.stage || '';
  let filtered = scores;
  if (stage) filtered = scores.filter(s => s.stageName === stage);

  filtered.sort((a, b) => b.pct - a.pct || b.score - a.score || a.date.localeCompare(b.date));
  const top = filtered.slice(0, 100).map((s, i) => ({ rank: i + 1, ...s }));
  res.json(top);
});

// Get distinct stage names for filtering
app.get('/api/stages', (req, res) => {
  const scores = readScores();
  const stages = [...new Set(scores.map(s => s.stageName))].sort();
  res.json(stages);
});

initData();
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
