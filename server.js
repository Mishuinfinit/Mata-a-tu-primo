const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = {};

wss.on('connection', (ws) => {
    const playerId = Date.now();
    clients[playerId] = ws;
    ws.send(JSON.stringify({ type: 'connected', playerId }));

    ws.on('message', (message) => {
        Object.values(clients).forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        delete clients[playerId];
    });
});

console.log('Servidor WebSocket corriendo en ws://localhost:8080');
