const input_room = document.getElementById('room');
const input_name = document.getElementById('name');
const button_room = document.getElementById('button_room');

// Joins room

// Joins room
button_room.addEventListener('click', () => {
    const roomId = input_room.value.trim();
    const playerName = input_name.value.trim();

    if (roomId && playerName) {
        // Emit the 'join room' event with both roomId and playerName
        socket.emit('join room', roomId, playerName);
        // Assuming you have already established the socket connection with `const socket = io();`
    } else {
        // Alert the user to enter both a room and a name
        alert("Please enter both a room and a name.");
    }
});
