const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
// Вот здесь мы ОПРЕДЕЛЯЕМ io, чтобы ошибки не было
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Пользователь подключился');

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился');
    });
});

// Используем порт от Render или 3000 локально
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер JopaZvon запущен на порту ${PORT}`);
});