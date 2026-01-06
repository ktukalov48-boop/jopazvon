const socket = io();


const urlParams = new URLSearchParams(window.location.search);
const accessKey = urlParams.get('key');


const SECRET_KEY = "super_jopazvon_pozvoni_kakashka_ale_ale"; 

if (accessKey === SECRET_KEY) {
    
    const userName = prompt("Введите ваш никнейм:", "Друг") || "Аноним";
    initChat(userName);
} else {
    
    document.body.innerHTML = `
        <div style="color: white; background: #0f0c29; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center;">
            <div>
                <h1 style="font-size: 50px;">🔒</h1>
                <h2>Доступ закрыт</h2>
                <p>Для входа нужна секретная ссылка.</p>
            </div>
        </div>
    `;
}

function initChat(userName) {
    const messages = document.getElementById('messages');
    const input = document.getElementById('message-input');
    const button = document.getElementById('send-btn');
    const headerName = document.querySelector('.user-name');
    const headerLetter = document.getElementById('avatar-letter');

    document.getElementById('main-wrapper').style.display = 'flex';
    headerName.innerText = userName;
    headerLetter.innerText = userName[0].toUpperCase();

    button.onclick = () => {
        if (input.value.trim()) {
            socket.emit('chat message', { text: input.value, user: userName });
            input.value = '';
        }
    };

    socket.on('chat message', (data) => {
        const div = document.createElement('div');
        div.classList.add('message');
        div.classList.add(data.user === userName ? 'mine' : 'theirs');
        
        const b = document.createElement('b');
        b.textContent = data.user + ": ";
        const span = document.createElement('span');
        span.textContent = data.text;
        
        div.appendChild(b);
        div.appendChild(span);
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    });
}