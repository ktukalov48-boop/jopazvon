const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Друг подключился к JopaZvon!');

    socket.on('chat message', (data) => {
        io.emit('chat message', data); // Отправка всем
    });

    socket.on('disconnect', () => {
        console.log('Кто-то вышел из сети');
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});