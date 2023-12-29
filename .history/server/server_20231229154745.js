const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const path = "/../client"

app.use(express.static(__dirname + path));


io.on('connection', (socket) => {
  // TODO: Delete after work
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on('join room', (roomId) => {
    console.log(`Recieved event to join room ${roomId} from client ${socket.id}`)
    const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
    if (clientsInRoom === undefined) {
      socket.join(roomId);
      io.to(socket.id).emit('x');
    }
    else if (clientsInRoom.size == 1) {
      socket.join(roomId);
      io.to(socket.id).emit('o');
      io.to(roomId).emit('start game');
    }
    else {
      io.to(socket.id).emit('full room', roomId);
    }
  })

  socket.on('chat message', (data) => {
    console.log(`Server sending message to room ${data.roomId}: ${data.message}`)
    io.to(data.roomId).emit('chat message', data.message);
  });
  socket.on('play again', (roomId) => {

    boardState = Array(9).fill('');
    currentPlayer = 'X';
    io.to(roomId).emit('start game', { boardState, winner: checkWinner() });
  });
  socket.on('move', (data) => {
    roomId = data.roomId;
    boardState = data.boardState;
    playerMark = data.playerMark;
    index = data.index;

    if (boardState[index] == '') {
      boardState[index] = playerMark;
      let winCheck = checkWinner(boardState);
      if (winCheck == 'Draw') {
        io.to(roomId).emit('draw', { boardState: boardState });
      }
      if (playerMark == 'X') {
        if (winCheck == 'X') {
          io.to(roomId).emit('winner', { boardState: boardState, winner: 'X' });
        }
        else {
          io.to(roomId).emit('updateGame', { boardState: boardState, nextMove: 'O' });
        }
      }
      else {
        if (winCheck == 'O') {
          io.to(roomId).emit('winner', { boardState: boardState, winner: 'O' });
        }
        else {
          io.to(roomId).emit('updateGame', { boardState: boardState, nextMove: 'X' });
        }
      }
    }
    else {
      console.log(`Sending wrong move to ${socket.id}`);
      io.to(socket.id).emit('wrong move');
    }
  });
});

function checkWinner(boardState) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (boardState && boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }

  if (boardState && !boardState.includes('')) {
    return 'Draw';
  }

  return null;
}


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});

