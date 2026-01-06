// Подключаемся к серверу
const socket = io();

// Сразу запрашиваем имя. Если не ввел — будет "Аноним"
const userName = prompt("Как тебя зовут?") || "Аноним";

// Функция для добавления контакта в список слева
function addContactToList(name) {
    const contactsList = document.getElementById('contacts-list');
    if (!contactsList) return;

    const item = document.createElement('div');
    item.classList.add('contact-item');
    const firstLetter = name.charAt(0).toUpperCase();
    
    item.innerHTML = `
        <div class="avatar-mini">${firstLetter}</div>
        <div class="contact-info">
            <div style="font-weight:600">${name}</div>
            <div style="font-size:12px; color:rgba(255,255,255,0.5)">Нажми, чтобы написать</div>
        </div>
    `;

    // При клике меняем данные в шапке чата
    item.onclick = () => {
        document.querySelector('.user-details .user-name').innerText = name;
        document.getElementById('avatar-letter').innerText = firstLetter;
    };

    contactsList.appendChild(item);
}

// Слушаем клик по кнопке "Найти контакт"
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'find-contact-btn') {
        const contactName = prompt("Введите имя друга:");
        if (contactName) addContactToList(contactName);
    }

    // Слушаем клик по кнопке "Отправить"
    if (button) {
        button.onclick = () => {
            // Проверяем: не пустое ли поле и не слишком ли длинное (макс 500 символов)
            if (input.value.trim() && input.value.length < 500) {
                socket.emit('chat message', { 
                    text: input.value.trim(), 
                    user: userName.substring(0, 20) // Ограничиваем ник 20 символами
                });
                input.value = '';
            } else if (input.value.length >= 500) {
                alert("Сообщение слишком длинное!");
            }
        };
    }

// Слушаем сообщения от сервера
socket.on('chat message', (data) => {
    const messages = document.getElementById('messages');
    if (!messages) return;

    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(data.user === userName ? 'mine' : 'theirs');

    // БЕЗОПАСНЫЙ СПОСОБ: используем textContent для текста сообщения
    const userSpan = document.createElement('b');
    userSpan.textContent = data.user + ": "; // Экранирует имя
    
    const textSpan = document.createElement('span');
    textSpan.textContent = data.text; // Экранирует само сообщение

    div.appendChild(userSpan);
    div.appendChild(textSpan);
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
});
// Устанавливаем твое имя в шапку при старте
document.addEventListener('DOMContentLoaded', () => {
    const headerName = document.querySelector('.user-details .user-name');
    const headerLetter = document.getElementById('avatar-letter');
    if (headerName) headerName.innerText = userName;
    if (headerLetter) headerLetter.innerText = userName.charAt(0).toUpperCase();
});