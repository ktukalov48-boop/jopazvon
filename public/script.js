const socket = io();

// 1. НАСТРОЙКА КЛЮЧА
const SECRET_KEY = "super_jopazvon_pozvoni_kakashka_ale_ale"; 

// 2. ПРОВЕРКА КЛЮЧА
const urlParams = new URLSearchParams(window.location.search);
const accessKey = urlParams.get('key');

if (accessKey === SECRET_KEY) {
    const userName = prompt("Ваш никнейм:", "Друг") || "Аноним";
    initChat(userName);
} else {
    document.body.innerHTML = `
        <div style="color: white; background: #1c1c1e; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center;">
            <div><h1>🔒 Доступ закрыт</h1><p>Нужна секретная ссылка.</p></div>
        </div>`;
}

// 3. ЛОГИКА ЧАТА (запускается только если ключ верный)
function initChat(userName) {
    document.getElementById('main-wrapper').style.display = 'flex';
    
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const findBtn = document.getElementById('find-contact-btn');
    const messages = document.getElementById('messages');

    // Шапка
    document.querySelector('.user-name').innerText = userName;
    document.getElementById('avatar-letter').innerText = userName[0].toUpperCase();

    // Кнопка ОТПРАВИТЬ
    sendBtn.onclick = () => {
        if (input.value.trim()) {
            socket.emit('chat message', { text: input.value, user: userName });
            input.value = '';
        }
    };

    // Отправка по Enter
    input.onkeypress = (e) => { if (e.key === 'Enter') sendBtn.click(); };

    // Кнопка НАЙТИ
    findBtn.onclick = () => {
        alert("Поиск временно недоступен. Отправьте ссылку другу, чтобы он появился в сети!");
    };

    // Получение сообщений
    socket.on('chat message', (data) => {
        const div = document.createElement('div');
        div.classList.add('message', data.user === userName ? 'mine' : 'theirs');
        div.innerHTML = `<b>${data.user}:</b> <span>${data.text}</span>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    });
}