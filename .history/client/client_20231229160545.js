const socket = io();
const form = document.getElementById('form');
const input_message = document.getElementById('input_message');
const messages = document.getElementById('messages');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const playAgainButton = document.getElementById('play-again');
let hasRequestedPlayAgain = false;
playAgainButton.addEventListener('click', () => {
    socket.emit('play again', currentRoomId);
    hasRequestedPlayAgain = true;
    playAgainButton.disabled = true;
  });

playAgainButton.disabled = true
var playerMark = '';
var boardState = Array(9).fill('');

function getRoomId() {
    const params = new URLSearchParams(document.location.search);
    return params.get("room");
}
let currentRoomId = getRoomId();
socket.emit('join room', currentRoomId);


// Sends message to server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input_message.value) {
        socket.emit('chat message', { roomId: currentRoomId, message: input_message.value });
        console.log({ roomId: currentRoomId, message: input_message.value });
        input_message.value = '';
    }
});

// Client recieves message
socket.on('chat message', (msg) => {
    console.log(`Client recieved a message ${msg}`)
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
});

// Funkcja do obsługi kliknięcia
function handleClick(index) {
    return function () {
        console.log(`Sending move to server from ${socket.id}`);
        socket.emit('move', { roomId: currentRoomId, boardState: boardState, playerMark: playerMark, index: index });
        disableClick();
    };
}

// Funkcja do włączania obsługi kliknięcia
function enableClick() {
    cells.forEach((cell, index) => {
        const clickHandler = handleClick(index);
        cell.addEventListener('click', clickHandler);
        cell.clickHandler = clickHandler; // Dodajemy referencję jako właściwość elementu
    });
}

// Funkcja do wyłączania obsługi kliknięcia
function disableClick() {
    console.log("DISABLED CLICK YOU MORON");
    cells.forEach((cell) => {
        const clickHandler = cell.clickHandler;
        if (clickHandler) {
            cell.removeEventListener('click', clickHandler);
            delete cell.clickHandler; // Usuwamy referencję
        }
    });
}

socket.on('updateGame', (data) => {
    boardState = data.boardState;
    const nextMove = data.nextMove;
    updateBoard();
    if (nextMove == playerMark) {
        enableClick();
    }
    else {
        disableClick();
    }
});

socket.on('x', () => {
    playerMark = 'X';
});

socket.on('o', () => {
    playerMark = 'O';
});

socket.on('start game', () => {
    boardState = Array(9).fill('');
    currentPlayer = 'X';
    if (playerMark == 'X') enableClick();


    if (hasRequestedPlayAgain) {
      playAgainButton.disabled = false;
      hasRequestedPlayAgain = false;
    }
  });

socket.on('full room', (roomId) => {
    alert(`Room ${roomId} is full!`);
});

socket.on('wrong move', () => {
    alert('This move is incorect. Pick another tile.');
    enableClick();
});

socket.on('winner', (data) => {
    boardState = data.boardState;
    updateBoard();
    disableClick();
    playAgainButton.disabled = false;
    alert(`${data.winner} has won the match!`);
})

socket.on('draw', (data) => {
    boardState = data.boardState;
    updateBoard();
    playAgainButton.disabled = false;
    alert('Match ended in a draw');
})

function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = boardState[index];
    });
}

// TODO: Delete after work
// logs events
socket.onAny((event, ...args) => {
    console.log(event, args);
});
