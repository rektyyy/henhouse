const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const path = "/../client"

app.use(express.static(__dirname + path));


io.on('connection', (socket) => {

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on('join room', (roomId) => {
    console.log(`Recieved event to join room ${roomId} from client ${socket.id}`)
    socket.join(roomId);
  })

  socket.on('chat message', (data) => {
    const senderSocketId = socket.id;
    console.log(`Server sending message to room ${data.roomId}: ${data.message}`)
    io.to(data.roomId).emit('chat message', data.message );
  });
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});