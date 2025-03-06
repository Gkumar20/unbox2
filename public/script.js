const socket = io();
let username = '';

function joinChat() {
    username = document.getElementById('username').value.trim();
    if (!username) return;

    socket.emit('userJoin', username);
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'flex';
}

// Add typing indicator
let typingTimeout;
const messageInput = document.getElementById('message-input');

messageInput.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    socket.emit('typing', true);
    
    typingTimeout = setTimeout(() => {
        socket.emit('typing', false);
    }, 1000);
});

socket.on('error', (message) => {
    alert(message);
});

socket.on('userList', (users) => {
    const usersList = document.getElementById('users');
    usersList.innerHTML = users
        .map(user => `<li>${user}</li>`)
        .join('');
});

// Handle typing events
socket.on('userTyping', ({username, isTyping}) => {
    const typingIndicator = document.getElementById('typing-indicator');
    if (isTyping) {
        typingIndicator.textContent = `${username} is typing...`;
        typingIndicator.style.display = 'block';
    } else {
        typingIndicator.style.display = 'none';
    }
});

// Handle system messages
socket.on('systemMessage', (message) => {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system');
    messageElement.innerHTML = `<em>${message}</em>`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('previousMessages', (messages) => {
    messages.forEach(addMessage);
});

socket.on('message', addMessage);

function addMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(message.user === username ? 'own' : 'other');
    
    const time = new Date(message.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageElement.innerHTML = `
        ${message.user === username ? '' : `<strong>${message.user}</strong><br>`}
        ${message.text}
        <small>${time}</small>
    `;
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Add enter key support for login
document.getElementById('username').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        joinChat();
    }
});

document.getElementById('message-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    if (message) {
        socket.emit('message', message);
        input.value = '';
    }
});
