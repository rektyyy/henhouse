const socket = io();

const form = document.getElementById('form');
const input_message = document.getElementById('input_message');
const input_room = document.getElementById('input_room');
const button_room = document.getElementById('button_room');
const messages = document.getElementById('messages');

let currentRoomId = '0';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input_message.value) {
        socket.emit('chat message', {roomId: currentRoomId, message: input_message.value});
        console.log({roomId: currentRoomId, message: input_message.value});
        input_message.value = '';
    }
});

button_room.addEventListener('click', () => {
    if (input_room.value) {
        currentRoomId = input_room.value;
        socket.emit("join room", currentRoomId);
        console.log(`Sent event to join room ${currentRoomId}`);
        input_room.value = '';
    }

})

socket.onAny((event, ...args) => {
    console.log(event, args);
});


socket.on('chat message', (msg) => {
    console.log(`Client recieved a message ${msg}`)
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});