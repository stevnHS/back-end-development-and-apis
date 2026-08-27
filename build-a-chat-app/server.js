import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3001;

const server = http.createServer((req, res) => {
    // 取得 HTML 檔案的路徑（假設為同目錄下的 index.html）
    const filePath = path.join(__dirname, './public/index.html');

    // 讀取檔案
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('500 Internal Server Error');
            return;
        }

        // 回傳 HTML 內容
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
    });
});

const wss = new WebSocketServer({ server })

// wss.on('connection', (socket, req) => {

// })

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});