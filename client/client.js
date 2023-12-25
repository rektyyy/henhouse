const socket = io();
const form = document.getElementById('form');
const input_message = document.getElementById('input_message');
const input_room = document.getElementById('input_room');
const button_room = document.getElementById('button_room');
const messages = document.getElementById('messages');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');

let currentRoomId = '0';
let currentPlayer = 'X';


// Sends message to server 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input_message.value) {
        socket.emit('chat message', { roomId: currentRoomId, message: input_message.value });
        console.log({ roomId: currentRoomId, message: input_message.value });
        input_message.value = '';
    }
});

// Sends join room to server
button_room.addEventListener('click', () => {
    if (input_room.value) {
        currentRoomId = input_room.value;
        socket.emit("join room", currentRoomId);
        console.log(`Sent event to join room ${currentRoomId}`);
        input_room.value = '';
    }

})

// Client recieves message
socket.on('chat message', (msg) => {
    console.log(`Client recieved a message ${msg}`)
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

// Tic tac toe game loop
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;
        socket.emit('move', { index });
    });
});

socket.on('updateGame', ({ boardState, winner }) => {
    updateBoard(boardState);

    if (winner) {
        alert(`${winner} wygrywa!`);
    } else if (!boardState.includes('')) {
        alert('Remis!');
    }
});

function updateBoard(boardState) {
    cells.forEach((cell, index) => {
        cell.textContent = boardState[index];
    });
}

// logs events
socket.onAny((event, ...args) => {
    console.log(event, args);
});
