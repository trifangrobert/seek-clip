const io = require('socket.io-client');

// Command line arguments for user and token
const userId = process.argv[2];
const token = process.argv[3];
const serverUrl = 'http://localhost:5000';

const socket = io(serverUrl, {
    query: {
        "userId": userId
    },
    auth: {
        token: token  
    },
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log(`Connected as User ${userId}`);
});

socket.on('new-message', (msg) => {
    console.log(`[${userId}] Received message from ${msg.senderId}: ${msg.content}`);
});

socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
});

// Handle command-line input to send messages
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.on('line', (line) => {
    const [command, receiverId, ...messageParts] = line.split(' ');
    if (command === 'send') {
        const message = messageParts.join(' ');
        console.log(`Message sent ${receiverId}: ${message}`);
        socket.emit('send-message', { receiverId, message });
    }
});
