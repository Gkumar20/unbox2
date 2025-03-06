const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.static('public'));
app.use(express.json());

// Add error handling for server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Message validation
const validateMessage = (message) => {
    if (!message || typeof message !== 'string') return false;
    if (message.trim().length === 0 || message.length > 500) return false;
    return true;
};

// In-memory storage
const messages = [];
const users = new Set();
const connectedSockets = new Map();

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('userJoin', (username) => {
        try {
            // Validate username
            if (!username || typeof username !== 'string' || username.trim().length === 0) {
                socket.emit('error', 'Invalid username');
                return;
            }

            // Check if username is taken
            if (users.has(username)) {
                socket.emit('error', 'Username already taken');
                return;
            }

            // Check room capacity
            if (users.size >= 2) {
                socket.emit('error', 'Chat room is full');
                return;
            }

            // Add user
            socket.username = username;
            users.add(username);
            connectedSockets.set(username, socket.id);

            // Notify all clients
            io.emit('userList', Array.from(users));
            socket.emit('previousMessages', messages);
            io.emit('systemMessage', `${username} has joined the chat`);

            console.log(`User ${username} joined`);
        } catch (error) {
            console.error('Join error:', error);
            socket.emit('error', 'Failed to join chat');
        }
    });

    socket.on('message', (message) => {
        try {
            // Validate user and message
            if (!socket.username) {
                socket.emit('error', 'Not authenticated');
                return;
            }

            if (!validateMessage(message)) {
                socket.emit('error', 'Invalid message');
                return;
            }

            // Create and store message
            const messageObj = {
                id: Date.now().toString(),
                user: socket.username,
                text: message.trim(),
                timestamp: new Date()
            };
            messages.push(messageObj);

            // Keep only last 50 messages
            if (messages.length > 50) {
                messages.shift();
            }

            io.emit('message', messageObj);
        } catch (error) {
            console.error('Message error:', error);
            socket.emit('error', 'Failed to send message');
        }
    });

    socket.on('disconnect', () => {
        try {
            if (socket.username) {
                users.delete(socket.username);
                connectedSockets.delete(socket.username);
                io.emit('userList', Array.from(users));
                io.emit('systemMessage', `${socket.username} has left the chat`);
                console.log(`User ${socket.username} left`);
            }
        } catch (error) {
            console.error('Disconnect error:', error);
        }
    });

    // Handle typing status
    socket.on('typing', (isTyping) => {
        if (socket.username) {
            socket.broadcast.emit('userTyping', {
                username: socket.username,
                isTyping
            });
        }
    });
});

// Update server listen with error handling
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error("Error starting server:", err);
        return;
    }
    console.log(`Server running on http://localhost:${PORT}`);
});
