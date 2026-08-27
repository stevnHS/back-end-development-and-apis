import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket, { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3001;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
};

const server = http.createServer((req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, './public', urlPath);

    // 讀取檔案
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

const wss = new WebSocketServer({ server })

wss.on('connection', (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get(
        "username",
    );
    const joinMessage = JSON.stringify({ type: "system", text: `${username} joined` });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(joinMessage);
        }
    });
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        const broadcastMessage = JSON.stringify({
            type: "chat",
            username: data.username,
            text: data.text,
        });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(broadcastMessage);
            }
        });
    });
    socket.on('close', () => {
        const broadcastMessage = JSON.stringify({
            type: "system",
            text: `${username} left`,
        });
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(broadcastMessage);
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});