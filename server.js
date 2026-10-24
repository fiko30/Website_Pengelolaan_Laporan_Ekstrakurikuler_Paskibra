/**
 * Local Live Server untuk Akses Laptop & HP (Local Wi-Fi)
 * Paskibra Garatika SMKN 40 Jakarta
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function getWifiIp() {
  const ifaces = os.networkInterfaces();
  for (const name in ifaces) {
    for (const net of ifaces[name]) {
      if (net.family === 'IPv4' && !net.internal && !name.toLowerCase().includes('vmnet')) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const server = http.createServer((req, res) => {
  // CORS & No-Cache agar HP selalu dapat versi terbaru
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const SARPRAS_MASTER_FILE = path.join(ROOT_DIR, 'data_master_sarpras.json');

  // API Master Sarpras (Sinkronisasi Multi-Perangkat Laptop & HP)
  if (req.url.startsWith('/api/master-sarpras')) {
    if (req.method === 'GET') {
      try {
        if (fs.existsSync(SARPRAS_MASTER_FILE)) {
          const raw = fs.readFileSync(SARPRAS_MASTER_FILE, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
          res.end(raw);
          return;
        }
      } catch (e) {
        console.error("Gagal baca master sarpras:", e);
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify([]));
      return;
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
          if (Array.isArray(items) && items.length > 0) {
            fs.writeFileSync(SARPRAS_MASTER_FILE, JSON.stringify(items, null, 2), 'utf8');
            console.log(`[${new Date().toLocaleTimeString()}] Master Sarpras disinkronkan (${items.length} barang)`);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
            res.end(JSON.stringify({ status: 'success', count: items.length }));
            return;
          }
        } catch (e) {
          console.error("Gagal simpan master sarpras:", e);
        }
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ status: 'error', message: 'Invalid payload' }));
      });
      return;
    }
  }

  let cleanUrl = req.url.split('?')[0];
  if (cleanUrl === '/' || cleanUrl === '') {
    cleanUrl = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, decodeURIComponent(cleanUrl));

  // Cegah directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
      res.end(`<h3>404 Berkas Tidak Ditemukan: ${cleanUrl}</h3>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

    const clientIp = req.socket.remoteAddress.replace(/^.*:/, '');
    console.log(`[${new Date().toLocaleTimeString()}] Akses dari ${clientIp} -> ${cleanUrl}`);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const wifiIp = getWifiIp();
  console.log('\n========================================================');
  console.log('  LIVE SERVER SIAP DIAKSES DARI LAPTOP & HP!');
  console.log('========================================================');
  console.log(`  Buka di Laptop : http://localhost:${PORT}`);
  console.log(`  Buka di HP     : http://${wifiIp}:${PORT}`);
  console.log('========================================================\n');
});
