const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const path = "/../client"

app.use(express.static(__dirname + path));

let boardState = Array(9).fill('');
let currentPlayer = 'X';

io.on('connection', (socket) => {

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on('join room', (roomId) => {
    console.log(`Recieved event to join room ${roomId} from client ${socket.id}`)
    socket.join(roomId);
  })

  socket.on('chat message', (data) => {
    console.log(`Server sending message to room ${data.roomId}: ${data.message}`)
    io.to(data.roomId).emit('chat message', data.message );
  });

  socket.emit('updateGame', { boardState, winner: checkWinner() });

  socket.on('move', ({ index }) => {
    if (!boardState[index]) {
      boardState[index] = currentPlayer;
      io.emit('updateGame', { boardState, winner: checkWinner() });

      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    } else {
      // Gracz próbuje oszukać, nie zmieniaj stanu planszy
      console.log('Niezgodność ruchu z zasadami gry!');
    }
  });
});

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }

  if (!boardState.includes('')) {
    return 'Draw';
  }

  return null;
}


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

