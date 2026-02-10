const http = require('http');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST || 'dpg-d65gom15pdvs73da10ig-a',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'silentap',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.PGSSL === 'disable' ? false : { rejectUnauthorized: false }
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      name TEXT PRIMARY KEY,
      highscore INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function normalizeName(name) {
  return String(name || '').trim();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  if (pathname === '/api/users/top' && req.method === 'GET') {
    try {
      const result = await pool.query(
        'SELECT name, highscore FROM users ORDER BY highscore DESC, name ASC LIMIT 10'
      );
      sendJson(res, 200, { users: result.rows });
      return;
    } catch {
      sendJson(res, 500, { error: 'Datenbankfehler beim Laden der Top-10.' });
      return;
    }
  }

  if (pathname === '/api/users' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const name = normalizeName(body.name);
      if (name.length < 3) {
        sendJson(res, 400, { error: 'Username muss mindestens 3 Zeichen lang sein.' });
        return;
      }

      const inserted = await pool.query(
        'INSERT INTO users(name, highscore) VALUES($1, 0) ON CONFLICT DO NOTHING RETURNING name, highscore',
        [name]
      );

      if (inserted.rowCount === 0) {
        sendJson(res, 409, { error: 'Username bereits vergeben.' });
        return;
      }

      sendJson(res, 201, { user: inserted.rows[0] });
      return;
    } catch {
      sendJson(res, 400, { error: 'Ungültige Anfrage.' });
      return;
    }
  }

  const userMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
  if (userMatch && req.method === 'GET') {
    try {
      const name = decodeURIComponent(userMatch[1]);
      const result = await pool.query('SELECT name, highscore FROM users WHERE name = $1', [name]);
      if (result.rowCount === 0) {
        sendJson(res, 404, { error: 'User nicht gefunden.' });
        return;
      }
      sendJson(res, 200, { user: result.rows[0] });
      return;
    } catch {
      sendJson(res, 500, { error: 'Datenbankfehler beim Laden des Users.' });
      return;
    }
  }

  const scoreMatch = pathname.match(/^\/api\/users\/([^/]+)\/highscore$/);
  if (scoreMatch && req.method === 'PATCH') {
    try {
      const name = decodeURIComponent(scoreMatch[1]);
      const body = await parseBody(req);
      const highscore = Number(body.highscore);
      if (!Number.isFinite(highscore) || highscore < 0) {
        sendJson(res, 400, { error: 'Ungültiger Highscore.' });
        return;
      }

      const result = await pool.query(
        `UPDATE users
         SET highscore = GREATEST(highscore, $2),
             updated_at = NOW()
         WHERE name = $1
         RETURNING name, highscore`,
        [name, highscore]
      );

      if (result.rowCount === 0) {
        sendJson(res, 404, { error: 'User nicht gefunden.' });
        return;
      }

      sendJson(res, 200, { user: result.rows[0] });
      return;
    } catch {
      sendJson(res, 400, { error: 'Ungültige Anfrage.' });
      return;
    }
  }

  const filePath = pathname === '/' ? path.join(ROOT, 'index.html') : path.join(ROOT, pathname);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  sendFile(res, filePath);
});

ensureSchema()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Silentap server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database schema:', error.message);
    process.exit(1);
  });
