var http = require('http');
var socket = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var server = http.createServer(app);
var io = socket(server);

let boardState = Array(9).fill('');
let currentPlayer = 'X';

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/game', (req, res) => {
  res.render('game', { boardState, winner: checkWinner() });
});

io.on('connection', (socket) => {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on('join room', (roomId) => {
    console.log(`Received event to join room ${roomId} from client ${socket.id}`);
    socket.join(roomId);
  });

  socket.on('chat message', (data) => {
    console.log(`Server sending message to room ${data.roomId}: ${data.message}`);
    io.to(data.roomId).emit('chat message', data.message);
  });

  socket.emit('updateGame', { boardState, winner: checkWinner() });

  socket.on('move', ({ index }) => {
    if (!boardState[index]) {
      boardState[index] = currentPlayer;
      io.emit('updateGame', { boardState, winner: checkWinner() });
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    } else {
      console.log('Invalid move!');
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
