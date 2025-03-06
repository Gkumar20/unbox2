# Simple Two-Person Chat Application Specification

## Project Overview
A basic real-time chat application for two users using vanilla JavaScript and Node.js.

## Technical Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- Real-time: WebSocket (socket.io)
- Storage: In-memory Array

## Project Structure
```
unbox2/
├── public/           # Static frontend files
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js         # Node.js server
└── package.json
```

## Features
### 1. Basic Chat Features
- Two-person chat room
- Real-time message updates
- Simple username selection
- Online status indication

### 2. Message Features
- Send/receive text messages
- Timestamp for messages
- Online user list

## Technical Implementation

### Frontend Components
1. Login Section
   - Username input
   - Join chat button

2. Chat Interface
   - Message history display
   - Message input form
   - Online users display

### Backend Features
1. WebSocket Service
   - User connection management
   - Message broadcasting
   - Online status updates

2. Data Storage
   - In-memory array for messages
   - Active users array

## Server APIs
- WS 'connection': New user connects
- WS 'disconnect': User disconnects
- WS 'message': New chat message
- WS 'userJoin': User joins chat
- WS 'userLeave': User leaves chat

## Dependencies
- express: ^4.17.1
- socket.io: ^4.5.1

## Data Structures

### Message Object
```javascript
{
  id: String,
  user: String,
  text: String,
  timestamp: Date
}
```

### User Object
```javascript
{
  id: String,
  username: String
}
```

## Development Steps

1. Project Setup
   - Initialize Node.js project
   - Install dependencies
   - Create basic folder structure

2. Backend Development
   - Set up Express server
   - Implement Socket.io connection
   - Create message storage array

3. Frontend Development
   - Create HTML structure
   - Style with CSS
   - Implement JavaScript functionality

4. Testing
   - Local testing with multiple browsers
   - Basic error handling
